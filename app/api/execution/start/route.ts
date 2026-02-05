import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
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
import { StartExecutionRequest, StartExecutionResponse } from '@/lib/execution/types';

// Build the OpenClaw prompt for task execution
function buildExecutionPrompt(
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

// Execute task via OpenClaw CLI
async function executeViaOpenClaw(
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    subtasks: Array<{ id: string; text: string; completed: boolean }>;
  },
  executionId: string,
  webhookUrl: string
): Promise<{ success: boolean; output?: string; error?: string }> {
  return new Promise((resolve) => {
    const prompt = buildExecutionPrompt(task, executionId, webhookUrl);
    const timeout = 300; // 5 minutes max

    const args = ['agent', '--message', prompt, '--json', '--agent', 'main', '--timeout', timeout.toString()];

    addExecutionLog(executionId, 'system', 'Spawning OpenClaw agent...');

    const proc = spawn('openclaw', args, {
      timeout: (timeout + 30) * 1000,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
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
      addExecutionLog(executionId, 'info', data.toString().trim());
    });

    proc.on('close', (code) => {
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
      resolve({ success: false, error: err.message });
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: StartExecutionRequest = await request.json();
    const { taskId, force } = body;

    if (!taskId) {
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

    // Update status to running
    updateExecutionStatus(execution.id, 'running');

    // Start execution asynchronously
    executeViaOpenClaw(task, execution.id, webhookUrl)
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
      message: 'Execution started',
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
