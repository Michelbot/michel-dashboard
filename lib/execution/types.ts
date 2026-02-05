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
  agentId?: string; // Specialized agent to use (developer, researcher, content, devops, qa)
  // Task data for execution
  title?: string;
  description?: string;
  priority?: string;
  subtasks?: Array<{ id: string; text: string; completed: boolean }>;
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

// Agent assignment check - includes legacy names and new specialized agents
export const EXECUTION_AGENTS = [
  // Legacy names
  'OpenClaw AI',
  'Michel',
  'openclaw',
  'michel',
  // Specialized agents
  'developer',
  'researcher',
  'content',
  'devops',
  'qa',
  // Agent full names
  'Developer Agent',
  'Researcher Agent',
  'Content Agent',
  'DevOps Agent',
  'QA Agent',
] as const;

export type ExecutionAgent = typeof EXECUTION_AGENTS[number];

// Keywords that indicate an AI agent assignment
const AGENT_KEYWORDS = [
  'openclaw', 'ai', 'agent', 'developer', 'researcher',
  'content', 'devops', 'qa', 'michel', 'code architect',
  'knowledge navigator', 'documentation writer',
  'infrastructure engineer', 'quality assurance'
];

export function isExecutionAgent(assignedTo: string): boolean {
  const normalized = assignedTo.toLowerCase().trim();

  // Direct match
  if (EXECUTION_AGENTS.some(agent => normalized === agent.toLowerCase())) {
    return true;
  }

  // Keyword match
  return AGENT_KEYWORDS.some(keyword => normalized.includes(keyword));
}

/**
 * Extract agent ID from assignedTo string
 */
export function extractAgentId(assignedTo: string): string | null {
  const normalized = assignedTo.toLowerCase().trim();

  // Direct agent ID match
  const directIds = ['developer', 'researcher', 'content', 'devops', 'qa'];
  for (const id of directIds) {
    if (normalized === id || normalized.includes(id)) {
      return id;
    }
  }

  // Legacy mappings
  if (normalized.includes('openclaw') || normalized.includes('michel') || normalized.includes('ai')) {
    return 'developer'; // Default to developer for legacy names
  }

  return null;
}
