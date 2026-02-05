import { NextRequest, NextResponse } from 'next/server';
import {
  getExecution,
  updateExecutionProgress,
  addExecutionLog,
  markSubtaskComplete,
  completeExecution,
  failExecution,
  updateExecutionStatus,
} from '@/lib/execution/queue';
import { WebhookPayload } from '@/lib/execution/types';

// Store for pending actions that need to be synced to the frontend
// This will be picked up by the SSE connection or polled

export async function POST(request: NextRequest) {
  try {
    const body: WebhookPayload = await request.json();
    const { taskId, executionId, action, data } = body;

    // Validate required fields
    if (!taskId || !executionId || !action) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: taskId, executionId, action',
        },
        { status: 400 }
      );
    }

    // Find the execution
    const execution = getExecution(executionId);
    if (!execution) {
      return NextResponse.json(
        { success: false, error: 'Execution not found' },
        { status: 404 }
      );
    }

    // Verify task ID matches
    if (execution.taskId !== taskId) {
      return NextResponse.json(
        { success: false, error: 'Task ID mismatch' },
        { status: 400 }
      );
    }

    // Check if execution is still active
    if (
      execution.status === 'completed' ||
      execution.status === 'failed' ||
      execution.status === 'cancelled'
    ) {
      return NextResponse.json({
        success: false,
        error: `Execution is already ${execution.status}`,
      });
    }

    // Handle different actions
    switch (action) {
      case 'progress_update': {
        const { progress, message } = data;

        if (typeof progress === 'number') {
          updateExecutionProgress(executionId, progress, message);
        } else if (message) {
          addExecutionLog(executionId, 'progress', message);
        }

        return NextResponse.json({
          success: true,
          message: 'Progress updated',
        });
      }

      case 'subtask_complete': {
        const { subtaskId } = data;

        if (!subtaskId) {
          return NextResponse.json(
            { success: false, error: 'subtaskId is required' },
            { status: 400 }
          );
        }

        markSubtaskComplete(executionId, subtaskId);

        // Return subtask ID for frontend to sync
        return NextResponse.json({
          success: true,
          message: 'Subtask marked as complete',
          subtaskId,
        });
      }

      case 'log': {
        const { message } = data;

        if (!message) {
          return NextResponse.json(
            { success: false, error: 'message is required' },
            { status: 400 }
          );
        }

        addExecutionLog(executionId, 'info', message);

        return NextResponse.json({
          success: true,
          message: 'Log added',
        });
      }

      case 'request_review': {
        const { reviewNotes } = data;

        // Update status to indicate review needed
        updateExecutionStatus(executionId, 'paused', {
          result: {
            ...execution.result,
            reviewNotes,
          },
        });

        addExecutionLog(
          executionId,
          'system',
          `Review requested: ${reviewNotes || 'No notes provided'}`
        );

        return NextResponse.json({
          success: true,
          message: 'Review requested',
          targetStatus: 'review', // Signal to frontend to move task to review column
        });
      }

      case 'complete': {
        const { summary } = data;

        completeExecution(executionId, summary);

        return NextResponse.json({
          success: true,
          message: 'Execution completed',
          targetStatus: 'done', // Signal to frontend to move task to done column
        });
      }

      case 'error': {
        const { error: errorMessage } = data;

        failExecution(executionId, errorMessage || 'Unknown error');

        return NextResponse.json({
          success: true,
          message: 'Error recorded',
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check webhook status
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    endpoints: {
      progress_update: 'Update task progress',
      subtask_complete: 'Mark subtask as complete',
      log: 'Add log entry',
      request_review: 'Request human review',
      complete: 'Complete execution',
      error: 'Report error',
    },
  });
}
