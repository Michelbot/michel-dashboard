import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

// Execute openclaw agent command
function runOpenClawAgent(message: string, options: {
  sessionId?: string;
  agent?: string;
  timeout?: number;
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

    const timeout = options.timeout || 120;
    args.push('--timeout', timeout.toString());

    const proc = spawn('openclaw', args, {
      timeout: (timeout + 10) * 1000,
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
    const { title, description, priority, tags } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    // Format the task as a prompt for OpenClaw
    const priorityEmoji = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';
    const tagsStr = tags?.length > 0 ? `\nTags: ${tags.join(', ')}` : '';

    const prompt = `Nouvelle tâche assignée: "${title}"

${priorityEmoji} Priorité: ${priority || 'medium'}
${description ? `\nDescription:\n${description}` : ''}${tagsStr}

Traite cette tâche et indique quand elle est terminée.`;

    const result = await runOpenClawAgent(prompt, {
      timeout: 60, // Shorter timeout for task assignment
    });

    if (result.success) {
      // Try to parse JSON output from openclaw CLI
      let response = result.output;

      // Remove doctor warnings from output
      const jsonStart = result.output.indexOf('{');
      if (jsonStart > 0) {
        response = result.output.substring(jsonStart);
      }

      try {
        const jsonResult = JSON.parse(response);

        // Extract text from OpenClaw's response structure
        if (jsonResult.result?.payloads?.[0]?.text) {
          response = jsonResult.result.payloads[0].text;
        } else if (jsonResult.result?.text) {
          response = jsonResult.result.text;
        } else if (jsonResult.response) {
          response = jsonResult.response;
        } else if (jsonResult.message) {
          response = jsonResult.message;
        }
      } catch {
        // Not JSON, use raw output
      }

      return NextResponse.json({
        success: true,
        openclawTaskId: `oc-${Date.now()}`,
        message: 'Task sent to OpenClaw successfully',
        response: typeof response === 'string' ? response.trim() : response,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.error || 'Failed to send task to OpenClaw',
        error: result.error,
        output: result.output,
      });
    }
  } catch (error) {
    console.error('Task sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
