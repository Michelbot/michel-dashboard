// Agent System Types

export type AgentId = 'developer' | 'researcher' | 'content' | 'devops' | 'qa';

export type SkillCategory = 'file' | 'web' | 'browser' | 'shell' | 'api';

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  enabled: boolean;
}

export interface WorkflowStep {
  step: number;
  name: string;
  description: string;
  required: boolean;
}

export interface AgentDefinition {
  id: AgentId;
  name: string;
  role: string;
  icon: string;  // Lucide icon name
  color: string; // Tailwind color class
  skills: AgentSkill[];
  workflow: WorkflowStep[];
  systemPromptPath: string;
  defaultTimeout: number; // seconds
}

// Task type to agent mapping
export interface TaskAgentMapping {
  taskType: string;
  primaryAgent: AgentId;
  supportAgent?: AgentId;
}

// Agent execution context passed to prompt builder
export interface AgentExecutionContext {
  agent: AgentDefinition;
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    subtasks: Array<{ id: string; text: string; completed: boolean }>;
  };
  executionId: string;
  webhookUrl: string;
}
