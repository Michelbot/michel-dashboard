import { create } from 'zustand';
import {
  ExecutionRecord,
  ExecutionStatus,
  ExecutionLog,
  ExecutionEvent,
  QueuedExecution,
  StartExecutionResponse,
} from './execution/types';

interface ExecutionStore {
  // State
  executions: Map<string, ExecutionRecord>;
  taskExecutions: Map<string, string>; // taskId -> executionId
  queue: QueuedExecution[];
  isConnected: boolean;
  lastError: string | null;

  // Actions
  startExecution: (taskId: string) => Promise<StartExecutionResponse>;
  cancelExecution: (taskId: string) => Promise<boolean>;
  getExecutionForTask: (taskId: string) => ExecutionRecord | undefined;
  getActiveExecutions: () => ExecutionRecord[];

  // SSE connection
  connectSSE: () => void;
  disconnectSSE: () => void;

  // Internal updates from SSE
  handleEvent: (event: ExecutionEvent) => void;
  updateExecution: (executionId: string, updates: Partial<ExecutionRecord>) => void;
  addLogToExecution: (executionId: string, log: ExecutionLog) => void;

  // Reset
  reset: () => void;
}

let eventSource: EventSource | null = null;

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
  // Initial state
  executions: new Map(),
  taskExecutions: new Map(),
  queue: [],
  isConnected: false,
  lastError: null,

  // Start execution for a task
  startExecution: async (taskId: string) => {
    try {
      const response = await fetch('/api/execution/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });

      const data: StartExecutionResponse = await response.json();

      if (data.success && data.executionId) {
        // Create local execution record
        const execution: ExecutionRecord = {
          id: data.executionId,
          taskId,
          status: 'starting',
          progress: 0,
          startedAt: new Date(),
          updatedAt: new Date(),
          logs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date(),
              type: 'system',
              message: 'Starting execution...',
            },
          ],
          result: { completedSubtasks: [] },
        };

        set((state) => {
          const newExecutions = new Map(state.executions);
          const newTaskExecutions = new Map(state.taskExecutions);
          newExecutions.set(data.executionId!, execution);
          newTaskExecutions.set(taskId, data.executionId!);
          return {
            executions: newExecutions,
            taskExecutions: newTaskExecutions,
            lastError: null,
          };
        });

        // Connect to SSE if not already connected
        if (!eventSource) {
          get().connectSSE();
        }
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start execution';
      set({ lastError: message });
      return { success: false, error: message };
    }
  },

  // Cancel execution
  cancelExecution: async (taskId: string) => {
    try {
      const response = await fetch('/api/execution/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });

      const data = await response.json();

      if (data.success) {
        const executionId = get().taskExecutions.get(taskId);
        if (executionId) {
          get().updateExecution(executionId, {
            status: 'cancelled',
            completedAt: new Date(),
          });
        }
      }

      return data.success;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel execution';
      set({ lastError: message });
      return false;
    }
  },

  // Get execution for a task
  getExecutionForTask: (taskId: string) => {
    const executionId = get().taskExecutions.get(taskId);
    if (executionId) {
      return get().executions.get(executionId);
    }
    return undefined;
  },

  // Get all active executions
  getActiveExecutions: () => {
    return Array.from(get().executions.values()).filter(
      (e) => e.status === 'running' || e.status === 'starting' || e.status === 'pending'
    );
  },

  // Connect to SSE endpoint
  connectSSE: () => {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource('/api/execution/events');

    eventSource.onopen = () => {
      set({ isConnected: true, lastError: null });
    };

    eventSource.onmessage = (event) => {
      try {
        const data: ExecutionEvent = JSON.parse(event.data);
        get().handleEvent(data);
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
      }
    };

    eventSource.onerror = () => {
      set({ isConnected: false, lastError: 'SSE connection lost' });

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (get().getActiveExecutions().length > 0) {
          get().connectSSE();
        }
      }, 5000);
    };
  },

  // Disconnect SSE
  disconnectSSE: () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    set({ isConnected: false });
  },

  // Handle incoming SSE event
  handleEvent: (event: ExecutionEvent) => {
    const { executions, taskExecutions } = get();
    const execution = executions.get(event.executionId);

    switch (event.type) {
      case 'execution_started': {
        if (!execution) {
          const newExecution: ExecutionRecord = {
            id: event.executionId,
            taskId: event.taskId,
            status: 'starting',
            progress: 0,
            startedAt: new Date(event.timestamp),
            updatedAt: new Date(event.timestamp),
            logs: [],
            result: { completedSubtasks: [] },
          };
          set((state) => {
            const newExecutions = new Map(state.executions);
            const newTaskExecutions = new Map(state.taskExecutions);
            newExecutions.set(event.executionId, newExecution);
            newTaskExecutions.set(event.taskId, event.executionId);
            return { executions: newExecutions, taskExecutions: newTaskExecutions };
          });
        }
        break;
      }

      case 'status_changed': {
        if (execution) {
          get().updateExecution(event.executionId, {
            status: event.data.status as ExecutionStatus,
            updatedAt: new Date(event.timestamp),
          });
        }
        break;
      }

      case 'progress_update': {
        if (execution) {
          get().updateExecution(event.executionId, {
            progress: event.data.progress as number,
            currentStep: event.data.message as string | undefined,
            updatedAt: new Date(event.timestamp),
          });
        }
        break;
      }

      case 'subtask_complete': {
        if (execution) {
          const completedSubtasks = [
            ...(execution.result?.completedSubtasks || []),
            event.data.subtaskId as string,
          ];
          get().updateExecution(event.executionId, {
            result: {
              ...execution.result,
              completedSubtasks,
            },
            updatedAt: new Date(event.timestamp),
          });
        }
        break;
      }

      case 'log_added': {
        if (execution && event.data.log) {
          const log = event.data.log as ExecutionLog;
          get().addLogToExecution(event.executionId, {
            ...log,
            timestamp: new Date(log.timestamp),
          });
        }
        break;
      }

      case 'execution_completed': {
        if (execution) {
          get().updateExecution(event.executionId, {
            status: 'completed',
            progress: 100,
            completedAt: new Date(event.timestamp),
            updatedAt: new Date(event.timestamp),
            result: {
              ...execution.result,
              summary: event.data.summary as string | undefined,
              reviewNotes: event.data.reviewNotes as string | undefined,
            },
          });
        }
        break;
      }

      case 'execution_failed': {
        if (execution) {
          get().updateExecution(event.executionId, {
            status: 'failed',
            error: event.data.error as string,
            completedAt: new Date(event.timestamp),
            updatedAt: new Date(event.timestamp),
          });
        }
        break;
      }
    }
  },

  // Update execution record
  updateExecution: (executionId: string, updates: Partial<ExecutionRecord>) => {
    set((state) => {
      const execution = state.executions.get(executionId);
      if (!execution) return state;

      const newExecutions = new Map(state.executions);
      newExecutions.set(executionId, {
        ...execution,
        ...updates,
      });
      return { executions: newExecutions };
    });
  },

  // Add log to execution
  addLogToExecution: (executionId: string, log: ExecutionLog) => {
    set((state) => {
      const execution = state.executions.get(executionId);
      if (!execution) return state;

      const newLogs = [...execution.logs, log].slice(-200);
      const newExecutions = new Map(state.executions);
      newExecutions.set(executionId, {
        ...execution,
        logs: newLogs,
        updatedAt: new Date(),
      });
      return { executions: newExecutions };
    });
  },

  // Reset store
  reset: () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    set({
      executions: new Map(),
      taskExecutions: new Map(),
      queue: [],
      isConnected: false,
      lastError: null,
    });
  },
}));
