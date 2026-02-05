import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';

const LOG_FILE = process.env.OPENCLAW_LOG_FILE || '/tmp/openclaw/openclaw.log';

// Parse log line to extract level and components
function parseLogLine(line: string): { level: string; message: string; timestamp: string; source?: string } | null {
  if (!line.trim()) return null;

  // Common log formats:
  // [2026-02-05 11:42:15] [INFO] Message here
  // 2026-02-05T11:42:15.000Z INFO: Message here
  // INFO: Message here

  let timestamp = new Date().toISOString();
  let level = 'info';
  let message = line;
  let source: string | undefined;

  // Try ISO format with level
  const isoMatch = line.match(/^(\d{4}-\d{2}-\d{2}T[\d:.]+Z?)\s+(\w+):?\s*(.*)$/);
  if (isoMatch) {
    timestamp = isoMatch[1];
    level = isoMatch[2].toLowerCase();
    message = isoMatch[3];
  }

  // Try bracket format
  const bracketMatch = line.match(/^\[([^\]]+)\]\s*\[(\w+)\]\s*(.*)$/);
  if (bracketMatch) {
    timestamp = bracketMatch[1];
    level = bracketMatch[2].toLowerCase();
    message = bracketMatch[3];
  }

  // Try simple level prefix
  const simpleLevelMatch = line.match(/^(INFO|WARN|ERROR|DEBUG):?\s*(.*)$/i);
  if (simpleLevelMatch) {
    level = simpleLevelMatch[1].toLowerCase();
    message = simpleLevelMatch[2];
  }

  // Extract source if present (e.g., [telegram], [gateway])
  const sourceMatch = message.match(/^\[(\w+)\]\s*(.*)$/);
  if (sourceMatch) {
    source = sourceMatch[1];
    message = sourceMatch[2];
  }

  // Normalize level
  if (!['info', 'warn', 'error', 'debug'].includes(level)) {
    level = 'info';
  }

  return { level, message, timestamp, source };
}

// GET: Stream logs via SSE
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lastId = parseInt(searchParams.get('lastId') || '0');
  const stream = searchParams.get('stream') === 'true';

  // For SSE streaming
  if (stream) {
    const encoder = new TextEncoder();
    let lastPosition = 0;
    let logId = lastId;

    const readableStream = new ReadableStream({
      async start(controller) {
        const sendLog = (data: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Initial read
        try {
          const content = await fs.readFile(LOG_FILE, 'utf-8');
          const lines = content.split('\n');
          lastPosition = content.length;

          // Send last 100 lines initially
          const startIdx = Math.max(0, lines.length - 100);
          for (let i = startIdx; i < lines.length; i++) {
            const parsed = parseLogLine(lines[i]);
            if (parsed) {
              logId++;
              sendLog({
                id: `log-${logId}`,
                ...parsed,
              });
            }
          }
        } catch {
          sendLog({
            id: `log-${++logId}`,
            level: 'warn',
            message: `Log file not found: ${LOG_FILE}`,
            timestamp: new Date().toISOString(),
          });
        }

        // Poll for new content every 1 second
        const interval = setInterval(async () => {
          try {
            const stat = await fs.stat(LOG_FILE);
            if (stat.size > lastPosition) {
              const fd = await fs.open(LOG_FILE, 'r');
              const buffer = Buffer.alloc(stat.size - lastPosition);
              await fd.read(buffer, 0, buffer.length, lastPosition);
              await fd.close();

              const newContent = buffer.toString('utf-8');
              const newLines = newContent.split('\n');

              for (const line of newLines) {
                const parsed = parseLogLine(line);
                if (parsed) {
                  logId++;
                  sendLog({
                    id: `log-${logId}`,
                    ...parsed,
                  });
                }
              }

              lastPosition = stat.size;
            }
          } catch {
            // File might not exist yet
          }
        }, 1000);

        // Clean up on close
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  // Non-streaming: return last N logs
  try {
    const content = await fs.readFile(LOG_FILE, 'utf-8');
    const lines = content.split('\n');
    const logs = [];
    let logId = 0;

    for (const line of lines) {
      const parsed = parseLogLine(line);
      if (parsed) {
        logId++;
        logs.push({
          id: `log-${logId}`,
          ...parsed,
        });
      }
    }

    // Return last 200 logs
    return Response.json({
      logs: logs.slice(-200),
      total: logs.length,
    });
  } catch {
    return Response.json({
      logs: [],
      total: 0,
      error: 'Log file not found',
    });
  }
}
