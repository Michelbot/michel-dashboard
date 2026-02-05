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

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  project: string;
  tags: string[];
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // 0-100
  subtasks: Subtask[];
  links: Link[];
  autoCreated?: boolean;
  autoPickup?: boolean;
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
