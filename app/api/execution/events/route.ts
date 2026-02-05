import { NextRequest } from 'next/server';
import { subscribeToEvents, getActiveExecutions } from '@/lib/execution/queue';
import { ExecutionEvent } from '@/lib/execution/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const sendEvent = (event: ExecutionEvent | { type: string; data: unknown }) => {
        try {
          const data = JSON.stringify(event);
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // Controller might be closed
        }
      };

      // Send connected event
      sendEvent({
        type: 'connected',
        data: { timestamp: new Date().toISOString() },
      });

      // Send current active executions
      const activeExecutions = getActiveExecutions();
      for (const execution of activeExecutions) {
        sendEvent({
          type: 'execution_started',
          executionId: execution.id,
          taskId: execution.taskId,
          timestamp: execution.startedAt,
          data: {
            status: execution.status,
            progress: execution.progress,
            currentStep: execution.currentStep,
          },
        } as ExecutionEvent);
      }

      // Subscribe to new events
      const unsubscribe = subscribeToEvents((event) => {
        sendEvent(event);
      });

      // Heartbeat every 30 seconds to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 30000);

      // Cleanup on abort
      request.signal.addEventListener('abort', () => {
        unsubscribe();
        clearInterval(heartbeatInterval);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}
