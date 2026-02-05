'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { useExecutionStore } from '@/lib/executionStore';

/**
 * Hook to sync execution events with the main dashboard store.
 * This ensures subtasks get marked complete when OpenClaw finishes them,
 * and tasks get moved to the correct columns automatically.
 */
export function useExecutionSync() {
  const { tasks, moveTask, updateTask, markSubtaskCompleteFromExecution, showToastMessage } = useStore();
  const { executions, connectSSE, isConnected } = useExecutionStore();

  // Sync completed subtasks from executions to tasks
  const syncSubtasks = useCallback(() => {
    executions.forEach((execution, executionId) => {
      const task = tasks.find((t) => t.executionId === executionId || t.id === execution.taskId);
      if (!task) return;

      // Sync completed subtasks
      const completedFromExecution = execution.result?.completedSubtasks || [];
      for (const subtaskId of completedFromExecution) {
        const subtask = task.subtasks.find((st) => st.id === subtaskId);
        if (subtask && !subtask.completed) {
          markSubtaskCompleteFromExecution(task.id, subtaskId);
        }
      }

      // Auto-move task based on execution status
      if (execution.status === 'completed' && task.status === 'inprogress') {
        // If there are review notes, move to review, otherwise to done
        if (execution.result?.reviewNotes) {
          moveTask(task.id, 'review');
          showToastMessage(`Tâche "${task.title}" en révision`, 'info');
        } else {
          moveTask(task.id, 'done');
          showToastMessage(`Tâche "${task.title}" terminée!`, 'success');
        }
      }

      // Update task execution state
      if (task.executionState !== mapExecutionStatus(execution.status)) {
        updateTask(task.id, {
          executionState: mapExecutionStatus(execution.status),
        });
      }
    });
  }, [executions, tasks, markSubtaskCompleteFromExecution, moveTask, updateTask, showToastMessage]);

  // Map execution status to task execution state
  function mapExecutionStatus(status: string): 'idle' | 'queued' | 'executing' | 'paused' | 'review_needed' {
    switch (status) {
      case 'pending':
      case 'starting':
        return 'queued';
      case 'running':
        return 'executing';
      case 'paused':
        return 'paused';
      case 'completed':
      case 'failed':
      case 'cancelled':
        return 'idle';
      default:
        return 'idle';
    }
  }

  // Connect to SSE when there are active executions
  useEffect(() => {
    const hasActiveExecutions = tasks.some(
      (t) => t.executionState === 'executing' || t.executionState === 'queued'
    );

    if (hasActiveExecutions && !isConnected) {
      connectSSE();
    }
  }, [tasks, isConnected, connectSSE]);

  // Sync whenever executions change
  useEffect(() => {
    syncSubtasks();
  }, [syncSubtasks]);

  return {
    isConnected,
    activeExecutionsCount: Array.from(executions.values()).filter(
      (e) => e.status === 'running' || e.status === 'pending' || e.status === 'starting'
    ).length,
  };
}
