// Execution Queue Management
// In-memory queue for managing concurrent task executions

import {
  ExecutionRecord,
  ExecutionStatus,
  ExecutionLog,
  QueuedExecution,
  ExecutionEvent,
} from './types';

// In-memory storage (will be replaced with Redis/DB in production)
const executions: Map<string, ExecutionRecord> = new Map();
const taskToExecution: Map<string, string> = new Map();
const queue: QueuedExecution[] = [];
const eventListeners: Set<(event: ExecutionEvent) => void> = new Set();

// Configuration
const MAX_CONCURRENT = 2;

// Generate unique execution ID
function generateExecutionId(): string {
  return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Emit event to all listeners
function emitEvent(event: ExecutionEvent): void {
  eventListeners.forEach((listener) => {
    try {
      listener(event);
    } catch (error) {
      console.error('Event listener error:', error);
    }
  });
}

// Create a new execution record
export function createExecution(taskId: string): ExecutionRecord {
  const executionId = generateExecutionId();

  const execution: ExecutionRecord = {
    id: executionId,
    taskId,
    status: 'pending',
    progress: 0,
    startedAt: new Date(),
    updatedAt: new Date(),
    logs: [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        type: 'system',
        message: 'Execution created, waiting to start...',
      },
    ],
    result: {
      completedSubtasks: [],
    },
  };

  executions.set(executionId, execution);
  taskToExecution.set(taskId, executionId);

  emitEvent({
    type: 'execution_started',
    executionId,
    taskId,
    timestamp: new Date(),
    data: { status: 'pending' },
  });

  return execution;
}

// Get execution by ID
export function getExecution(executionId: string): ExecutionRecord | undefined {
  return executions.get(executionId);
}

// Get execution by task ID
export function getExecutionByTaskId(taskId: string): ExecutionRecord | undefined {
  const executionId = taskToExecution.get(taskId);
  if (executionId) {
    return executions.get(executionId);
  }
  return undefined;
}

// Get all active executions (running or pending)
export function getActiveExecutions(): ExecutionRecord[] {
  return Array.from(executions.values()).filter(
    (e) => e.status === 'running' || e.status === 'pending' || e.status === 'starting'
  );
}

// Get running executions count
export function getRunningCount(): number {
  return Array.from(executions.values()).filter((e) => e.status === 'running').length;
}

// Check if can start new execution
export function canStartNewExecution(): boolean {
  return getRunningCount() < MAX_CONCURRENT;
}

// Update execution status
export function updateExecutionStatus(
  executionId: string,
  status: ExecutionStatus,
  additionalData?: Partial<ExecutionRecord>
): ExecutionRecord | undefined {
  const execution = executions.get(executionId);
  if (!execution) return undefined;

  execution.status = status;
  execution.updatedAt = new Date();

  if (status === 'completed' || status === 'failed' || status === 'cancelled') {
    execution.completedAt = new Date();
  }

  if (additionalData) {
    Object.assign(execution, additionalData);
  }

  emitEvent({
    type: 'status_changed',
    executionId,
    taskId: execution.taskId,
    timestamp: new Date(),
    data: { status, ...additionalData },
  });

  return execution;
}

// Update execution progress
export function updateExecutionProgress(
  executionId: string,
  progress: number,
  message?: string
): ExecutionRecord | undefined {
  const execution = executions.get(executionId);
  if (!execution) return undefined;

  execution.progress = Math.min(100, Math.max(0, progress));
  execution.updatedAt = new Date();

  if (message) {
    execution.currentStep = message;
    addExecutionLog(executionId, 'progress', message);
  }

  emitEvent({
    type: 'progress_update',
    executionId,
    taskId: execution.taskId,
    timestamp: new Date(),
    data: { progress: execution.progress, message },
  });

  return execution;
}

// Add log entry to execution
export function addExecutionLog(
  executionId: string,
  type: ExecutionLog['type'],
  message: string,
  metadata?: Record<string, unknown>
): ExecutionLog | undefined {
  const execution = executions.get(executionId);
  if (!execution) return undefined;

  const log: ExecutionLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date(),
    type,
    message,
    metadata,
  };

  execution.logs.push(log);
  execution.updatedAt = new Date();

  // Keep only last 200 logs
  if (execution.logs.length > 200) {
    execution.logs = execution.logs.slice(-200);
  }

  emitEvent({
    type: 'log_added',
    executionId,
    taskId: execution.taskId,
    timestamp: new Date(),
    data: { log },
  });

  return log;
}

// Mark subtask as completed
export function markSubtaskComplete(
  executionId: string,
  subtaskId: string
): boolean {
  const execution = executions.get(executionId);
  if (!execution) return false;

  if (!execution.result) {
    execution.result = { completedSubtasks: [] };
  }

  if (!execution.result.completedSubtasks) {
    execution.result.completedSubtasks = [];
  }

  if (!execution.result.completedSubtasks.includes(subtaskId)) {
    execution.result.completedSubtasks.push(subtaskId);
  }

  execution.updatedAt = new Date();

  addExecutionLog(executionId, 'subtask', `Subtask completed: ${subtaskId}`, {
    subtaskId,
  });

  emitEvent({
    type: 'subtask_complete',
    executionId,
    taskId: execution.taskId,
    timestamp: new Date(),
    data: { subtaskId },
  });

  return true;
}

// Complete execution successfully
export function completeExecution(
  executionId: string,
  summary?: string,
  reviewNotes?: string
): ExecutionRecord | undefined {
  const execution = executions.get(executionId);
  if (!execution) return undefined;

  execution.status = 'completed';
  execution.progress = 100;
  execution.completedAt = new Date();
  execution.updatedAt = new Date();

  if (!execution.result) {
    execution.result = { completedSubtasks: [] };
  }

  if (summary) execution.result.summary = summary;
  if (reviewNotes) execution.result.reviewNotes = reviewNotes;

  addExecutionLog(executionId, 'system', summary || 'Execution completed successfully');

  emitEvent({
    type: 'execution_completed',
    executionId,
    taskId: execution.taskId,
    timestamp: new Date(),
    data: { summary, reviewNotes },
  });

  return execution;
}

// Fail execution
export function failExecution(
  executionId: string,
  error: string
): ExecutionRecord | undefined {
  const execution = executions.get(executionId);
  if (!execution) return undefined;

  execution.status = 'failed';
  execution.error = error;
  execution.completedAt = new Date();
  execution.updatedAt = new Date();

  addExecutionLog(executionId, 'error', `Execution failed: ${error}`);

  emitEvent({
    type: 'execution_failed',
    executionId,
    taskId: execution.taskId,
    timestamp: new Date(),
    data: { error },
  });

  return execution;
}

// Cancel execution
export function cancelExecution(executionId: string): ExecutionRecord | undefined {
  const execution = executions.get(executionId);
  if (!execution) return undefined;

  if (execution.status === 'completed' || execution.status === 'failed') {
    return undefined; // Can't cancel finished executions
  }

  execution.status = 'cancelled';
  execution.completedAt = new Date();
  execution.updatedAt = new Date();

  addExecutionLog(executionId, 'system', 'Execution cancelled by user');

  emitEvent({
    type: 'status_changed',
    executionId,
    taskId: execution.taskId,
    timestamp: new Date(),
    data: { status: 'cancelled' },
  });

  return execution;
}

// Add to queue
export function addToQueue(taskId: string, priority: 'high' | 'medium' | 'low'): void {
  const existingIndex = queue.findIndex((q) => q.taskId === taskId);
  if (existingIndex >= 0) {
    queue.splice(existingIndex, 1);
  }

  const queueItem: QueuedExecution = {
    taskId,
    priority,
    queuedAt: new Date(),
  };

  // Insert by priority
  const insertIndex = queue.findIndex((q) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[q.priority] > priorityOrder[priority];
  });

  if (insertIndex >= 0) {
    queue.splice(insertIndex, 0, queueItem);
  } else {
    queue.push(queueItem);
  }
}

// Remove from queue
export function removeFromQueue(taskId: string): boolean {
  const index = queue.findIndex((q) => q.taskId === taskId);
  if (index >= 0) {
    queue.splice(index, 1);
    return true;
  }
  return false;
}

// Get queue state
export function getQueueState() {
  return {
    running: getActiveExecutions().filter((e) => e.status === 'running'),
    queued: [...queue],
    maxConcurrent: MAX_CONCURRENT,
  };
}

// Get next from queue
export function getNextFromQueue(): QueuedExecution | undefined {
  return queue.shift();
}

// Subscribe to events
export function subscribeToEvents(
  listener: (event: ExecutionEvent) => void
): () => void {
  eventListeners.add(listener);
  return () => {
    eventListeners.delete(listener);
  };
}

// Get all executions for a list of task IDs
export function getExecutionsForTasks(taskIds: string[]): Map<string, ExecutionRecord> {
  const result = new Map<string, ExecutionRecord>();
  for (const taskId of taskIds) {
    const execution = getExecutionByTaskId(taskId);
    if (execution) {
      result.set(taskId, execution);
    }
  }
  return result;
}

// Clean up old completed executions (keep last 50)
export function cleanupOldExecutions(): void {
  const completed = Array.from(executions.values())
    .filter(
      (e) =>
        e.status === 'completed' ||
        e.status === 'failed' ||
        e.status === 'cancelled'
    )
    .sort((a, b) => {
      const aTime = a.completedAt?.getTime() || 0;
      const bTime = b.completedAt?.getTime() || 0;
      return bTime - aTime;
    });

  // Keep only last 50 completed
  const toRemove = completed.slice(50);
  for (const execution of toRemove) {
    executions.delete(execution.id);
    taskToExecution.delete(execution.taskId);
  }
}
