import { NextRequest, NextResponse } from 'next/server';
import {
  cancelExecution,
  getExecutionByTaskId,
  getExecution,
  removeFromQueue,
} from '@/lib/execution/queue';
import { CancelExecutionRequest, CancelExecutionResponse } from '@/lib/execution/types';

export async function POST(request: NextRequest) {
  try {
    const body: CancelExecutionRequest = await request.json();
    const { taskId, executionId } = body;

    if (!taskId && !executionId) {
      return NextResponse.json<CancelExecutionResponse>(
        { success: false, error: 'Task ID or Execution ID is required' },
        { status: 400 }
      );
    }

    // Find the execution
    let execution;
    if (executionId) {
      execution = getExecution(executionId);
    } else if (taskId) {
      execution = getExecutionByTaskId(taskId);
    }

    if (!execution) {
      // Maybe it's in the queue
      if (taskId && removeFromQueue(taskId)) {
        return NextResponse.json<CancelExecutionResponse>({
          success: true,
          message: 'Task removed from queue',
        });
      }

      return NextResponse.json<CancelExecutionResponse>(
        { success: false, error: 'Execution not found' },
        { status: 404 }
      );
    }

    // Check if can be cancelled
    if (
      execution.status === 'completed' ||
      execution.status === 'failed' ||
      execution.status === 'cancelled'
    ) {
      return NextResponse.json<CancelExecutionResponse>({
        success: false,
        error: `Cannot cancel execution with status: ${execution.status}`,
      });
    }

    // Cancel the execution
    const cancelled = cancelExecution(execution.id);

    if (cancelled) {
      return NextResponse.json<CancelExecutionResponse>({
        success: true,
        message: 'Execution cancelled successfully',
      });
    } else {
      return NextResponse.json<CancelExecutionResponse>({
        success: false,
        error: 'Failed to cancel execution',
      });
    }
  } catch (error) {
    console.error('Cancel execution error:', error);
    return NextResponse.json<CancelExecutionResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel execution',
      },
      { status: 500 }
    );
  }
}
