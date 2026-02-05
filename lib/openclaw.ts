// OpenClaw Service - HTTP client for OpenClaw Gateway

const GATEWAY_URL = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL || 'http://localhost:18789';

interface OpenClawConfig {
  gatewayUrl: string;
  authToken?: string;
  timeout?: number;
}

class OpenClawService {
  private config: OpenClawConfig;

  constructor(config: Partial<OpenClawConfig> = {}) {
    this.config = {
      gatewayUrl: config.gatewayUrl || GATEWAY_URL,
      authToken: config.authToken,
      timeout: config.timeout || 30000,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.gatewayUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.config.authToken && {
        Authorization: `Bearer ${this.config.authToken}`,
      }),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  }

  // Health check
  async getHealth(): Promise<{ status: string; uptime: number }> {
    return this.request('/api/health');
  }

  // Get status
  async getStatus(): Promise<{
    connected: boolean;
    sessions: number;
    uptime: number;
  }> {
    try {
      const health = await this.getHealth();
      return {
        connected: true,
        sessions: 0,
        uptime: health.uptime,
      };
    } catch {
      return {
        connected: false,
        sessions: 0,
        uptime: 0,
      };
    }
  }

  // Send a chat message
  async chat(message: string, sessionId?: string): Promise<{
    response: string;
    sessionId: string;
  }> {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });
  }

  // List skills
  async getSkills(): Promise<{
    skills: Array<{
      name: string;
      description: string;
      enabled: boolean;
    }>;
  }> {
    return this.request('/api/skills');
  }

  // Get memory files
  async getMemoryFiles(): Promise<{
    files: Array<{
      name: string;
      path: string;
      size: number;
      lastModified: string;
    }>;
  }> {
    return this.request('/api/memory');
  }

  // Read memory file
  async readMemoryFile(filename: string): Promise<{
    content: string;
    metadata: object;
  }> {
    return this.request(`/api/memory/${encodeURIComponent(filename)}`);
  }
}

// Singleton instance
let instance: OpenClawService | null = null;

export function getOpenClawService(config?: Partial<OpenClawConfig>): OpenClawService {
  if (!instance || config) {
    instance = new OpenClawService(config);
  }
  return instance;
}

export default OpenClawService;
