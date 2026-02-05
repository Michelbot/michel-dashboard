import { AgentDefinition, AgentId, TaskAgentMapping } from './types';
import { developerAgent } from './configs/developer';
import { researcherAgent } from './configs/researcher';
import { contentAgent } from './configs/content';
import { devopsAgent } from './configs/devops';
import { qaAgent } from './configs/qa';

// Central registry of all agents
const agentRegistry: Map<AgentId, AgentDefinition> = new Map([
  ['developer', developerAgent],
  ['researcher', researcherAgent],
  ['content', contentAgent],
  ['devops', devopsAgent],
  ['qa', qaAgent],
]);

// Task type to agent mapping
const taskAgentMappings: TaskAgentMapping[] = [
  { taskType: 'feature', primaryAgent: 'developer', supportAgent: 'qa' },
  { taskType: 'implementation', primaryAgent: 'developer', supportAgent: 'qa' },
  { taskType: 'bugfix', primaryAgent: 'developer', supportAgent: 'qa' },
  { taskType: 'bug', primaryAgent: 'developer', supportAgent: 'qa' },
  { taskType: 'research', primaryAgent: 'researcher', supportAgent: 'content' },
  { taskType: 'investigation', primaryAgent: 'researcher', supportAgent: 'developer' },
  { taskType: 'documentation', primaryAgent: 'content', supportAgent: 'developer' },
  { taskType: 'docs', primaryAgent: 'content', supportAgent: 'developer' },
  { taskType: 'readme', primaryAgent: 'content' },
  { taskType: 'deployment', primaryAgent: 'devops', supportAgent: 'qa' },
  { taskType: 'deploy', primaryAgent: 'devops', supportAgent: 'qa' },
  { taskType: 'ci', primaryAgent: 'devops' },
  { taskType: 'cd', primaryAgent: 'devops' },
  { taskType: 'docker', primaryAgent: 'devops' },
  { taskType: 'infrastructure', primaryAgent: 'devops' },
  { taskType: 'test', primaryAgent: 'qa', supportAgent: 'developer' },
  { taskType: 'testing', primaryAgent: 'qa', supportAgent: 'developer' },
  { taskType: 'validation', primaryAgent: 'qa' },
  { taskType: 'audit', primaryAgent: 'qa' },
  { taskType: 'review', primaryAgent: 'qa', supportAgent: 'developer' },
];

/**
 * Get a specific agent by ID
 */
export function getAgent(agentId: AgentId): AgentDefinition | undefined {
  return agentRegistry.get(agentId);
}

/**
 * Get all registered agents
 */
export function getAllAgents(): AgentDefinition[] {
  return Array.from(agentRegistry.values());
}

/**
 * Get agent by any ID string (case-insensitive, supports legacy names)
 */
export function getAgentByString(agentString: string): AgentDefinition | undefined {
  const normalized = agentString.toLowerCase().trim();

  // Direct ID match
  const directMatch = agentRegistry.get(normalized as AgentId);
  if (directMatch) return directMatch;

  // Legacy name mappings
  const legacyMappings: Record<string, AgentId> = {
    'openclaw ai': 'developer',
    'openclaw': 'developer',
    'michel': 'developer',
    'code architect': 'developer',
    'developer agent': 'developer',
    'knowledge navigator': 'researcher',
    'researcher agent': 'researcher',
    'documentation writer': 'content',
    'content agent': 'content',
    'infrastructure engineer': 'devops',
    'devops agent': 'devops',
    'quality assurance': 'qa',
    'qa agent': 'qa',
  };

  const mappedId = legacyMappings[normalized];
  if (mappedId) return agentRegistry.get(mappedId);

  // Partial match (contains)
  for (const [key, agentId] of Object.entries(legacyMappings)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return agentRegistry.get(agentId);
    }
  }

  return undefined;
}

/**
 * Auto-select the best agent for a task based on tags, title, or type
 */
export function getAgentForTask(task: {
  title?: string;
  description?: string;
  tags?: string[];
  type?: string;
}): { primary: AgentDefinition; support?: AgentDefinition } | undefined {
  const searchTerms: string[] = [];

  if (task.type) searchTerms.push(task.type.toLowerCase());
  if (task.tags) searchTerms.push(...task.tags.map(t => t.toLowerCase()));
  if (task.title) searchTerms.push(...task.title.toLowerCase().split(/\s+/));
  if (task.description) {
    // Extract first few significant words
    const words = task.description.toLowerCase().split(/\s+/).slice(0, 10);
    searchTerms.push(...words);
  }

  // Find best matching mapping
  for (const mapping of taskAgentMappings) {
    if (searchTerms.some(term => term.includes(mapping.taskType) || mapping.taskType.includes(term))) {
      const primary = agentRegistry.get(mapping.primaryAgent);
      const support = mapping.supportAgent ? agentRegistry.get(mapping.supportAgent) : undefined;
      if (primary) {
        return { primary, support };
      }
    }
  }

  // Default to developer agent
  return { primary: developerAgent };
}

/**
 * Get recommended agent with explanation
 */
export function getRecommendedAgent(task: {
  title?: string;
  description?: string;
  tags?: string[];
}): { agent: AgentDefinition; reason: string } {
  const result = getAgentForTask(task);

  if (!result) {
    return {
      agent: developerAgent,
      reason: 'Agent par défaut pour les tâches générales',
    };
  }

  const reasons: Record<AgentId, string> = {
    developer: 'Tâche de développement détectée (code, feature, bugfix)',
    researcher: 'Tâche de recherche détectée (investigation, documentation)',
    content: 'Tâche de documentation détectée (README, guides)',
    devops: 'Tâche infrastructure détectée (CI/CD, déploiement)',
    qa: 'Tâche de qualité détectée (tests, validation)',
  };

  return {
    agent: result.primary,
    reason: reasons[result.primary.id],
  };
}

/**
 * Check if a string refers to an execution agent
 */
export function isAgentAssignment(assignedTo: string): boolean {
  const normalized = assignedTo.toLowerCase().trim();

  // Check direct agent IDs
  if (agentRegistry.has(normalized as AgentId)) return true;

  // Check legacy names
  const agentKeywords = [
    'openclaw', 'ai', 'agent', 'developer', 'researcher',
    'content', 'devops', 'qa', 'michel'
  ];

  return agentKeywords.some(keyword => normalized.includes(keyword));
}

/**
 * Get agent color class for UI
 */
export function getAgentColorClass(agentId: AgentId): string {
  const colorMap: Record<AgentId, string> = {
    developer: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    researcher: 'bg-violet-500/10 text-violet-500 border-violet-500/30',
    content: 'bg-green-500/10 text-green-500 border-green-500/30',
    devops: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    qa: 'bg-red-500/10 text-red-500 border-red-500/30',
  };

  return colorMap[agentId] || 'bg-gray-500/10 text-gray-500 border-gray-500/30';
}
