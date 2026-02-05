import { AgentDefinition, AgentExecutionContext, WorkflowStep } from './types';
import { getAgent, getAgentByString, getAllAgents } from './registry';

/**
 * Build the execution prompt for a specific agent
 */
export function buildAgentPrompt(context: AgentExecutionContext): string {
  const { agent, task, executionId, webhookUrl } = context;

  const priorityEmoji =
    task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';

  const subtasksList = task.subtasks
    .map((st) => `- [${st.completed ? 'x' : ' '}] [${st.id}] ${st.text}`)
    .join('\n');

  const skillsList = agent.skills
    .filter((s) => s.enabled)
    .map((s) => `- **${s.name}**: ${s.description}`)
    .join('\n');

  const workflowSteps = agent.workflow
    .map((w) => `${w.step}. **${w.name}** - ${w.description}${w.required ? ' *(requis)*' : ''}`)
    .join('\n');

  return `# ${agent.name} - Task Execution

## Agent Profile
**Role:** ${agent.role}
**Agent ID:** ${agent.id}

## Active Skills
${skillsList}

## Workflow Steps
${workflowSteps}

---

## TASK EXECUTION REQUEST
**Task ID:** ${task.id}
**Execution ID:** ${executionId}
**Title:** ${task.title}
**Priority:** ${priorityEmoji} ${task.priority}

## Description
${task.description || 'No description provided.'}

## Subtasks
${subtasksList || 'No subtasks defined.'}

---

## Progress Reporting
Report your progress via POST ${webhookUrl}/api/openclaw/webhook

### Available Webhook Actions

1. **subtask_complete** - Mark a subtask as done
\`\`\`json
{
  "taskId": "${task.id}",
  "executionId": "${executionId}",
  "action": "subtask_complete",
  "data": { "subtaskId": "st-xxx" }
}
\`\`\`

2. **progress_update** - Update overall progress (0-100)
\`\`\`json
{
  "taskId": "${task.id}",
  "executionId": "${executionId}",
  "action": "progress_update",
  "data": { "progress": 50, "message": "Working on step 2..." }
}
\`\`\`

3. **log** - Add a log entry
\`\`\`json
{
  "taskId": "${task.id}",
  "executionId": "${executionId}",
  "action": "log",
  "data": { "message": "Found relevant files" }
}
\`\`\`

4. **request_review** - Request human review before completion
\`\`\`json
{
  "taskId": "${task.id}",
  "executionId": "${executionId}",
  "action": "request_review",
  "data": { "reviewNotes": "Please verify the changes to..." }
}
\`\`\`

5. **complete** - Mark task as complete
\`\`\`json
{
  "taskId": "${task.id}",
  "executionId": "${executionId}",
  "action": "complete",
  "data": { "summary": "Successfully completed all steps" }
}
\`\`\`

6. **error** - Report an error
\`\`\`json
{
  "taskId": "${task.id}",
  "executionId": "${executionId}",
  "action": "error",
  "data": { "error": "Error message describing what went wrong" }
}
\`\`\`

---

## Execution Instructions

Follow your workflow steps in order:
${agent.workflow.map((w) => `${w.step}. ${w.name}: ${w.description}`).join('\n')}

**Important Guidelines:**
- Report progress after each workflow step
- Mark subtasks as complete when finished
- Capture screenshots as evidence when relevant
- If you encounter blockers, use the error webhook
- For ambiguous decisions, use request_review

Begin execution now, starting with step 1: **${agent.workflow[0]?.name || 'ANALYZE'}**`;
}

/**
 * Build prompt with context from an agent ID string
 */
export function buildPromptFromAgentId(
  agentIdOrName: string,
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    subtasks: Array<{ id: string; text: string; completed: boolean }>;
  },
  executionId: string,
  webhookUrl: string
): { prompt: string; agent: AgentDefinition } | null {
  const agent = getAgentByString(agentIdOrName);

  if (!agent) {
    console.warn(`[PromptBuilder] Unknown agent: ${agentIdOrName}, falling back to developer`);
    const fallbackAgent = getAgent('developer');
    if (!fallbackAgent) return null;

    return {
      prompt: buildAgentPrompt({ agent: fallbackAgent, task, executionId, webhookUrl }),
      agent: fallbackAgent,
    };
  }

  return {
    prompt: buildAgentPrompt({ agent, task, executionId, webhookUrl }),
    agent,
  };
}

/**
 * Get the timeout for an agent (or default)
 */
export function getAgentTimeout(agentIdOrName: string): number {
  const agent = getAgentByString(agentIdOrName);
  return agent?.defaultTimeout ?? 300; // 5 min default
}

/**
 * Format workflow steps for display
 */
export function formatWorkflowSteps(steps: WorkflowStep[]): string[] {
  return steps.map((s) => `${s.step}. ${s.name}${s.required ? '' : ' (optional)'}`);
}

/**
 * Get a brief summary of an agent for UI display
 */
export function getAgentSummary(agentId: string): {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  skillCount: number;
  workflowSteps: number;
} | null {
  const agent = getAgentByString(agentId);
  if (!agent) return null;

  return {
    id: agent.id,
    name: agent.name,
    role: agent.role,
    icon: agent.icon,
    color: agent.color,
    skillCount: agent.skills.filter((s) => s.enabled).length,
    workflowSteps: agent.workflow.length,
  };
}

/**
 * Get all agent summaries for selector UI
 */
export function getAllAgentSummaries(): Array<{
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  skillCount: number;
  workflowSteps: number;
}> {
  return getAllAgents().map((agent) => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    icon: agent.icon,
    color: agent.color,
    skillCount: agent.skills.filter((s) => s.enabled).length,
    workflowSteps: agent.workflow.length,
  }));
}
