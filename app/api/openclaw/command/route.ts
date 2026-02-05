import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

// Execute openclaw agent command
function runOpenClawAgent(message: string, options: {
  sessionId?: string;
  agent?: string;
  timeout?: number;
  local?: boolean;
}): Promise<{ success: boolean; output: string; error?: string }> {
  return new Promise((resolve) => {
    const args = ['agent', '--message', message, '--json'];

    if (options.sessionId) {
      args.push('--session-id', options.sessionId);
    } else if (options.agent) {
      args.push('--agent', options.agent);
    } else {
      // Default to main agent if no session or agent specified
      args.push('--agent', 'main');
    }

    if (options.local) {
      args.push('--local');
    }

    const timeout = options.timeout || 120; // 2 minutes default
    args.push('--timeout', timeout.toString());

    const proc = spawn('openclaw', args, {
      timeout: (timeout + 10) * 1000, // Add buffer to CLI timeout
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output: stdout });
      } else {
        resolve({ success: false, output: stdout, error: stderr || `Exit code: ${code}` });
      }
    });

    proc.on('error', (err) => {
      resolve({ success: false, output: '', error: err.message });
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, sessionId, agent, timeout } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const commandId = `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startedAt = new Date();

    const result = await runOpenClawAgent(prompt, {
      sessionId,
      agent,
      timeout: timeout || 120,
    });

    if (result.success) {
      // Try to parse JSON output from openclaw CLI
      let response = result.output;
      let sessionId: string | undefined;

      // Remove doctor warnings from output
      const jsonStart = result.output.indexOf('{');
      if (jsonStart > 0) {
        response = result.output.substring(jsonStart);
      }

      try {
        const jsonResult = JSON.parse(response);

        // Extract text from OpenClaw's response structure
        // Structure: { result: { payloads: [{ text: "..." }], meta: { agentMeta: { sessionId: "..." } } } }
        if (jsonResult.result?.payloads?.[0]?.text) {
          response = jsonResult.result.payloads[0].text;
        } else if (jsonResult.result?.text) {
          response = jsonResult.result.text;
        } else if (jsonResult.response) {
          response = jsonResult.response;
        } else if (jsonResult.message) {
          response = jsonResult.message;
        }

        // Get sessionId for follow-up conversations
        sessionId = jsonResult.result?.meta?.agentMeta?.sessionId;

        // If response is still an object, stringify it nicely
        if (typeof response === 'object') {
          response = JSON.stringify(response, null, 2);
        }
      } catch {
        // Not JSON, use raw output but remove doctor warnings
        if (jsonStart > 0) {
          response = result.output.substring(jsonStart);
        }
      }

      return NextResponse.json({
        id: commandId,
        status: 'completed',
        response: typeof response === 'string' ? response.trim() : response,
        sessionId,
        startedAt,
        completedAt: new Date(),
      });
    } else {
      return NextResponse.json({
        id: commandId,
        status: 'error',
        error: result.error || 'Command failed',
        response: result.output,
        startedAt,
        completedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Command API error:', error);
    return NextResponse.json(
      {
        error: 'Invalid request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}

// GET: Get command help/status
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    description: 'Send commands to OpenClaw agent via CLI',
    usage: {
      method: 'POST',
      body: {
        prompt: 'string (required) - The message/prompt to send',
        sessionId: 'string (optional) - Session ID to continue a conversation',
        agent: 'string (optional) - Specific agent ID to use',
        timeout: 'number (optional) - Timeout in seconds (default: 120)',
      },
    },
  });
}
