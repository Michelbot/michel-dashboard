import { NextRequest, NextResponse } from 'next/server';
import { spawn, execSync } from 'child_process';
import {
  createExecution,
  updateExecutionStatus,
  updateExecutionProgress,
  addExecutionLog,
  completeExecution,
  failExecution,
  canStartNewExecution,
  getExecutionByTaskId,
} from '@/lib/execution/queue';
import { StartExecutionRequest, StartExecutionResponse, extractAgentId } from '@/lib/execution/types';
import {
  buildPromptFromAgentId,
  getAgentTimeout,
  getAgentByString,
  developerAgent,
} from '@/lib/agents';

// Legacy prompt builder (fallback)
function buildLegacyExecutionPrompt(
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    subtasks: Array<{ id: string; text: string; completed: boolean }>;
  },
  executionId: string,
  webhookUrl: string
): string {
  const priorityEmoji =
    task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';

  const subtasksList = task.subtasks
    .map(
      (st) =>
        `- [${st.completed ? 'x' : ' '}] [${st.id}] ${st.text}`
    )
    .join('\n');

  return `## TASK EXECUTION REQUEST
**Task ID:** ${task.id}
**Execution ID:** ${executionId}
**Title:** ${task.title}
**Priority:** ${priorityEmoji} ${task.priority}

## Description
${task.description || 'No description provided.'}

## Subtasks
${subtasksList || 'No subtasks defined.'}

## Progress Reporting
Report your progress via POST ${webhookUrl}/api/openclaw/webhook

Available webhook actions:
1. \`subtask_complete\`: Mark a subtask as done
   { "taskId": "${task.id}", "executionId": "${executionId}", "action": "subtask_complete", "data": { "subtaskId": "st-xxx" } }

2. \`progress_update\`: Update overall progress
   { "taskId": "${task.id}", "executionId": "${executionId}", "action": "progress_update", "data": { "progress": 50, "message": "Working on..." } }

3. \`request_review\`: Request human review before completion
   { "taskId": "${task.id}", "executionId": "${executionId}", "action": "request_review", "data": { "reviewNotes": "Please verify..." } }

4. \`complete\`: Mark task as complete
   { "taskId": "${task.id}", "executionId": "${executionId}", "action": "complete", "data": { "summary": "Completed successfully" } }

5. \`error\`: Report an error
   { "taskId": "${task.id}", "executionId": "${executionId}", "action": "error", "data": { "error": "Error message" } }

## Instructions
1. Analyze the task and create a plan
2. Execute each subtask in order
3. Report progress after each step
4. Use the webhook to mark subtasks as complete
5. When finished, send the complete action

Begin execution now.`;
}

// Check if OpenClaw CLI is installed
function checkOpenClawInstalled(): { installed: boolean; path?: string; error?: string } {
  try {
    const openclawPath = execSync('which openclaw 2>/dev/null || echo "NOT_FOUND"', { encoding: 'utf-8' }).trim();
    if (openclawPath === 'NOT_FOUND') {
      return { installed: false, error: 'OpenClaw CLI not found in PATH' };
    }
    return { installed: true, path: openclawPath };
  } catch {
    return { installed: false, error: 'Failed to check OpenClaw CLI' };
  }
}

// Execute task via OpenClaw CLI with agent-specific prompt
async function executeViaOpenClaw(
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    subtasks: Array<{ id: string; text: string; completed: boolean }>;
  },
  executionId: string,
  webhookUrl: string,
  agentId?: string
): Promise<{ success: boolean; output?: string; error?: string }> {
  return new Promise((resolve) => {
    // Determine which agent to use
    const resolvedAgentId = agentId || 'developer';
    const agent = getAgentByString(resolvedAgentId) || developerAgent;

    console.log('[OpenClaw] Starting execution for task:', task.title);
    console.log('[OpenClaw] Using agent:', agent.name, `(${agent.id})`);

    // Check if openclaw CLI exists
    const cliCheck = checkOpenClawInstalled();
    console.log('[OpenClaw] CLI check:', cliCheck);

    if (!cliCheck.installed) {
      console.error('[OpenClaw] CLI NOT INSTALLED!', cliCheck.error);
      addExecutionLog(executionId, 'error', `OpenClaw CLI not found: ${cliCheck.error}`);
      resolve({ success: false, error: cliCheck.error });
      return;
    }

    // Build agent-specific prompt
    const promptResult = buildPromptFromAgentId(resolvedAgentId, task, executionId, webhookUrl);

    let prompt: string;
    if (promptResult) {
      prompt = promptResult.prompt;
      addExecutionLog(executionId, 'system', `Using ${promptResult.agent.name} (${promptResult.agent.role})`);
    } else {
      // Fallback to legacy prompt
      prompt = buildLegacyExecutionPrompt(task, executionId, webhookUrl);
      addExecutionLog(executionId, 'system', 'Using legacy execution prompt');
    }

    // Get agent-specific timeout
    const timeout = getAgentTimeout(resolvedAgentId);
    console.log('[OpenClaw] Timeout:', timeout, 'seconds');

    const args = ['agent', '--message', prompt, '--json', '--agent', 'main', '--timeout', timeout.toString()];
    console.log('[OpenClaw] Spawning with args:', ['openclaw', ...args.slice(0, 2), '...']);

    addExecutionLog(executionId, 'system', `Spawning OpenClaw agent (timeout: ${timeout}s)...`);

    const proc = spawn('openclaw', args, {
      timeout: (timeout + 30) * 1000,
    });

    console.log('[OpenClaw] Process spawned, PID:', proc.pid);

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log('[OpenClaw] stdout:', data.toString().substring(0, 100));
      // Try to extract progress from output
      const progressMatch = stdout.match(/progress[:\s]+(\d+)/i);
      if (progressMatch) {
        const progress = parseInt(progressMatch[1], 10);
        if (!isNaN(progress) && progress >= 0 && progress <= 100) {
          updateExecutionProgress(executionId, progress);
        }
      }
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
      console.log('[OpenClaw] stderr:', data.toString().substring(0, 100));
      addExecutionLog(executionId, 'info', data.toString().trim());
    });

    proc.on('close', (code) => {
      console.log('[OpenClaw] Process closed with code:', code);
      if (code === 0) {
        resolve({ success: true, output: stdout });
      } else {
        resolve({
          success: false,
          output: stdout,
          error: stderr || `Process exited with code ${code}`,
        });
      }
    });

    proc.on('error', (err) => {
      console.error('[OpenClaw] SPAWN ERROR:', err);
      addExecutionLog(executionId, 'error', `Spawn error: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
  });
}

export async function POST(request: NextRequest) {
  console.log('[API/execution/start] === REQUEST RECEIVED ===');

  try {
    const body: StartExecutionRequest = await request.json();
    console.log('[API/execution/start] Body:', {
      taskId: body.taskId,
      title: body.title,
      agentId: body.agentId,
      force: body.force
    });

    const { taskId, force, agentId } = body;

    if (!taskId) {
      console.log('[API/execution/start] Missing taskId!');

      return NextResponse.json<StartExecutionResponse>(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Check if already executing
    const existingExecution = getExecutionByTaskId(taskId);
    if (existingExecution && !force) {
      if (
        existingExecution.status === 'running' ||
        existingExecution.status === 'starting' ||
        existingExecution.status === 'pending'
      ) {
        return NextResponse.json<StartExecutionResponse>({
          success: false,
          error: 'Task is already being executed',
          executionId: existingExecution.id,
        });
      }
    }

    // Check concurrent limit
    if (!canStartNewExecution()) {
      return NextResponse.json<StartExecutionResponse>({
        success: false,
        error: 'Maximum concurrent executions reached. Task queued.',
        message: 'Task has been added to the queue',
      });
    }

    // Create execution record
    const execution = createExecution(taskId);

    // Get webhook URL from request
    const webhookUrl = request.nextUrl.origin;

    // Fetch the task data from the dashboard
    // Since we don't have direct DB access, we need to get it from request or store
    // For now, we'll assume the task data is passed in the request
    const taskData = body as unknown as {
      taskId: string;
      title?: string;
      description?: string;
      priority?: string;
      subtasks?: Array<{ id: string; text: string; completed: boolean }>;
    };

    // Default task structure if not provided
    const task = {
      id: taskId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      subtasks: taskData.subtasks || [],
    };

    // Resolve agent ID - from request or extract from assignedTo (would need to be passed)
    const resolvedAgentId = agentId || extractAgentId(taskData.title || '') || 'developer';

    // Log which agent is being used
    const selectedAgent = getAgentByString(resolvedAgentId);
    if (selectedAgent) {
      addExecutionLog(execution.id, 'system', `Agent selected: ${selectedAgent.name}`);
    }

    // Update status to running
    updateExecutionStatus(execution.id, 'running');

    // Start execution asynchronously with agent-specific prompt
    executeViaOpenClaw(task, execution.id, webhookUrl, resolvedAgentId)
      .then((result) => {
        if (result.success) {
          // Check if webhook already completed it
          const currentExecution = getExecutionByTaskId(taskId);
          if (currentExecution && currentExecution.status === 'running') {
            completeExecution(execution.id, 'Task execution completed via CLI');
          }
        } else {
          failExecution(execution.id, result.error || 'Unknown error');
        }
      })
      .catch((error) => {
        failExecution(
          execution.id,
          error instanceof Error ? error.message : 'Execution failed'
        );
      });

    return NextResponse.json<StartExecutionResponse>({
      success: true,
      executionId: execution.id,
      message: `Execution started with ${selectedAgent?.name || 'Developer Agent'}`,
    });
  } catch (error) {
    console.error('Start execution error:', error);
    return NextResponse.json<StartExecutionResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start execution',
      },
      { status: 500 }
    );
  }
}
