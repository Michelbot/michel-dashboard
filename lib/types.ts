export type TaskStatus = 'ideas' | 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Link {
  id: string;
  type: 'doc' | 'memory' | 'session' | 'git';
  label: string;
  url: string;
  icon: string; // '📁', '🔧', '💬', '🔀'
}

// Execution status for real-time task execution
export type ExecutionState = 'idle' | 'queued' | 'executing' | 'paused' | 'review_needed';

// Agent IDs for specialized execution
export type AgentId = 'developer' | 'researcher' | 'content' | 'devops' | 'qa';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  project: string;
  tags: string[];
  assignedTo: string;
  agentId?: AgentId;           // Specific agent for execution
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // 0-100
  subtasks: Subtask[];
  links: Link[];
  autoCreated?: boolean;
  autoPickup?: boolean;
  // Execution-related fields
  executionId?: string;        // Current execution ID if running
  executionState?: ExecutionState;
  lastExecutionError?: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  description: string;
  progress: number;
  phase: string;
  milestones: {
    total: number;
    completed: number;
  };
  startedAt: string;
  version: string;
  nextSteps: string[];
}

export interface WorkspaceFile {
  name: string;
  icon: string;
  timestamp: string;
}

export interface SessionStats {
  messages: number;
  tools: number;
}
