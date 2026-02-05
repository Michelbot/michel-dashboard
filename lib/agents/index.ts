// Agent System - Main exports

// Types
export type {
  AgentId,
  AgentDefinition,
  AgentSkill,
  WorkflowStep,
  SkillCategory,
  TaskAgentMapping,
  AgentExecutionContext,
} from './types';

// Agent configs
export { developerAgent } from './configs/developer';
export { researcherAgent } from './configs/researcher';
export { contentAgent } from './configs/content';
export { devopsAgent } from './configs/devops';
export { qaAgent } from './configs/qa';

// Registry functions
export {
  getAgent,
  getAllAgents,
  getAgentByString,
  getAgentForTask,
  getRecommendedAgent,
  isAgentAssignment,
  getAgentColorClass,
} from './registry';

// Prompt builder functions
export {
  buildAgentPrompt,
  buildPromptFromAgentId,
  getAgentTimeout,
  formatWorkflowSteps,
  getAgentSummary,
  getAllAgentSummaries,
} from './promptBuilder';
