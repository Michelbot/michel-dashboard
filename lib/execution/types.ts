// Execution System Types

export type ExecutionStatus =
  | 'pending'      // Waiting in queue
  | 'starting'     // Being picked up
  | 'running'      // OpenClaw is executing
  | 'paused'       // Temporarily paused
  | 'completed'    // Successfully finished
  | 'failed'       // Error occurred
  | 'cancelled';   // User cancelled

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'progress' | 'subtask' | 'error' | 'system';
  message: string;
  metadata?: Record<string, unknown>;
}

export interface ExecutionRecord {
  id: string;
  taskId: string;
  status: ExecutionStatus;
  progress: number;           // 0-100
  startedAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  logs: ExecutionLog[];
  currentStep?: string;
  openclawSessionId?: string;
  error?: string;
  result?: {
    summary?: string;
    reviewNotes?: string;
    completedSubtasks?: string[];
  };
}

export interface ExecutionEvent {
  type:
    | 'execution_started'
    | 'progress_update'
    | 'subtask_complete'
    | 'log_added'
    | 'status_changed'
    | 'execution_completed'
    | 'execution_failed';
  executionId: string;
  taskId: string;
  timestamp: Date;
  data: Record<string, unknown>;
}

// Webhook payloads from OpenClaw
export interface WebhookPayload {
  taskId: string;
  executionId: string;
  action:
    | 'progress_update'
    | 'subtask_complete'
    | 'log'
    | 'request_review'
    | 'complete'
    | 'error';
  data: {
    progress?: number;
    message?: string;
    subtaskId?: string;
    reviewNotes?: string;
    summary?: string;
    error?: string;
  };
}

// API request/response types
export interface StartExecutionRequest {
  taskId: string;
  force?: boolean;  // Force start even if already running
}

export interface StartExecutionResponse {
  success: boolean;
  executionId?: string;
  error?: string;
  message?: string;
}

export interface CancelExecutionRequest {
  taskId: string;
  executionId?: string;
}

export interface CancelExecutionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Queue types
export interface QueuedExecution {
  taskId: string;
  priority: 'high' | 'medium' | 'low';
  queuedAt: Date;
  estimatedStart?: Date;
}

export interface ExecutionQueueState {
  running: ExecutionRecord[];
  queued: QueuedExecution[];
  maxConcurrent: number;
}

// Agent assignment check
export const EXECUTION_AGENTS = ['OpenClaw AI', 'Michel', 'openclaw', 'michel'] as const;
export type ExecutionAgent = typeof EXECUTION_AGENTS[number];

export function isExecutionAgent(assignedTo: string): boolean {
  const normalized = assignedTo.toLowerCase().trim();
  return EXECUTION_AGENTS.some(agent =>
    normalized === agent.toLowerCase() ||
    normalized.includes('openclaw') ||
    normalized.includes('ai')
  );
}
