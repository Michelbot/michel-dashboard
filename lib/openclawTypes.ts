// OpenClaw Integration Types

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  source?: string;
  sessionId?: string;
}

export type MessageSource = 'telegram' | 'whatsapp' | 'api' | 'terminal';

export interface OpenClawMessage {
  id: string;
  source: MessageSource;
  from: string;
  text: string;
  timestamp: Date;
  chatId?: string;
  replyTo?: string;
  status: 'received' | 'processing' | 'completed' | 'error';
}

export interface MemoryFile {
  name: string;
  path: string;
  lastModified: Date;
  size: number;
  type: 'daily' | 'project' | 'context' | 'other';
}

export interface MemoryContent {
  file: MemoryFile;
  content: string;
}

export interface OpenClawSession {
  id: string;
  startedAt: Date;
  status: 'active' | 'idle' | 'terminated';
  messagesCount: number;
  lastActivity: Date;
}

export interface OpenClawSkill {
  name: string;
  description: string;
  active: boolean;
  lastUsed?: Date;
  usageCount: number;
}

export interface OpenClawStatus {
  connected: boolean;
  gatewayUrl: string;
  sessions: OpenClawSession[];
  activeSessionsCount: number;
  skillsCount: number;
  uptime: number;
  lastActivity: Date;
  telegramConnected: boolean;
  whatsappConnected: boolean;
  memorySize: number;
}

export interface CommandRequest {
  prompt: string;
  sessionId?: string;
  priority?: 'normal' | 'high';
}

export interface CommandResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  response?: string;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface TaskSyncRequest {
  taskId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface TaskSyncResponse {
  success: boolean;
  openclawTaskId?: string;
  message: string;
}

// Store state types
export interface OpenClawState {
  // Connection
  connected: boolean;
  connecting: boolean;
  lastError: string | null;
  status: OpenClawStatus | null;

  // Logs
  logs: LogEntry[];
  logsFilter: LogLevel | 'all';
  logsPaused: boolean;

  // Messages
  messages: OpenClawMessage[];
  messagesFilter: MessageSource | 'all';

  // Memory
  memoryFiles: MemoryFile[];
  selectedMemoryFile: MemoryContent | null;

  // Terminal
  terminalHistory: CommandResponse[];
  currentCommand: string;

  // Active view
  activeView: 'dashboard' | 'logs' | 'messages' | 'terminal' | 'memory';
}

export interface OpenClawActions {
  // Connection
  connect: () => Promise<void>;
  disconnect: () => void;
  setConnected: (connected: boolean) => void;
  setStatus: (status: OpenClawStatus | null) => void;

  // Logs
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
  setLogsFilter: (filter: LogLevel | 'all') => void;
  toggleLogsPaused: () => void;

  // Messages
  addMessage: (message: OpenClawMessage) => void;
  updateMessageStatus: (id: string, status: OpenClawMessage['status']) => void;
  setMessagesFilter: (filter: MessageSource | 'all') => void;

  // Memory
  setMemoryFiles: (files: MemoryFile[]) => void;
  loadMemoryFile: (path: string) => Promise<void>;
  setSelectedMemoryFile: (content: MemoryContent | null) => void;

  // Terminal
  sendCommand: (prompt: string) => Promise<CommandResponse>;
  setCurrentCommand: (command: string) => void;
  clearTerminalHistory: () => void;

  // Navigation
  setActiveView: (view: OpenClawState['activeView']) => void;
}
