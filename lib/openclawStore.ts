import { create } from 'zustand';
import {
  LogEntry,
  LogLevel,
  OpenClawMessage,
  MessageSource,
  MemoryFile,
  MemoryContent,
  OpenClawStatus,
  CommandResponse,
} from './openclawTypes';

interface OpenClawStore {
  // Connection state
  connected: boolean;
  connecting: boolean;
  lastError: string | null;
  status: OpenClawStatus | null;

  // Logs
  logs: LogEntry[];
  logsFilter: LogLevel | 'all';
  logsPaused: boolean;
  logsSearchQuery: string;

  // Messages
  messages: OpenClawMessage[];
  messagesFilter: MessageSource | 'all';

  // Memory
  memoryFiles: MemoryFile[];
  selectedMemoryFile: MemoryContent | null;
  memoryLoading: boolean;

  // Terminal
  terminalHistory: CommandResponse[];
  currentCommand: string;
  commandLoading: boolean;

  // Active view
  activeView: 'dashboard' | 'logs' | 'messages' | 'terminal' | 'memory';

  // Connection actions
  checkConnection: () => Promise<void>;
  setConnected: (connected: boolean) => void;
  setStatus: (status: OpenClawStatus | null) => void;
  setLastError: (error: string | null) => void;

  // Logs actions
  addLog: (log: LogEntry) => void;
  addLogs: (logs: LogEntry[]) => void;
  clearLogs: () => void;
  setLogsFilter: (filter: LogLevel | 'all') => void;
  toggleLogsPaused: () => void;
  setLogsSearchQuery: (query: string) => void;
  getFilteredLogs: () => LogEntry[];

  // Messages actions
  addMessage: (message: OpenClawMessage) => void;
  updateMessageStatus: (id: string, status: OpenClawMessage['status']) => void;
  setMessagesFilter: (filter: MessageSource | 'all') => void;
  getFilteredMessages: () => OpenClawMessage[];

  // Memory actions
  fetchMemoryFiles: () => Promise<void>;
  loadMemoryFile: (filename: string) => Promise<void>;
  setSelectedMemoryFile: (content: MemoryContent | null) => void;

  // Terminal actions
  sendCommand: (prompt: string) => Promise<CommandResponse>;
  setCurrentCommand: (command: string) => void;
  clearTerminalHistory: () => void;

  // Task sync
  sendTaskToOpenClaw: (task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    tags: string[];
  }) => Promise<{ success: boolean; message: string }>;

  // Navigation
  setActiveView: (view: OpenClawStore['activeView']) => void;
}

export const useOpenClawStore = create<OpenClawStore>((set, get) => ({
  // Initial state
  connected: false,
  connecting: false,
  lastError: null,
  status: null,

  logs: [],
  logsFilter: 'all',
  logsPaused: false,
  logsSearchQuery: '',

  messages: [],
  messagesFilter: 'all',

  memoryFiles: [],
  selectedMemoryFile: null,
  memoryLoading: false,

  terminalHistory: [],
  currentCommand: '',
  commandLoading: false,

  activeView: 'dashboard',

  // Connection actions
  checkConnection: async () => {
    set({ connecting: true, lastError: null });
    try {
      const response = await fetch('/api/openclaw/status');
      const data = await response.json();

      set({
        connected: data.connected,
        status: data,
        connecting: false,
      });
    } catch (error) {
      set({
        connected: false,
        connecting: false,
        lastError: error instanceof Error ? error.message : 'Connection failed',
      });
    }
  },

  setConnected: (connected) => set({ connected }),

  setStatus: (status) => set({ status }),

  setLastError: (error) => set({ lastError: error }),

  // Logs actions
  addLog: (log) =>
    set((state) => {
      if (state.logsPaused) return state;
      // Keep last 500 logs
      const newLogs = [...state.logs, log].slice(-500);
      return { logs: newLogs };
    }),

  addLogs: (logs) =>
    set((state) => {
      if (state.logsPaused) return state;
      const newLogs = [...state.logs, ...logs].slice(-500);
      return { logs: newLogs };
    }),

  clearLogs: () => set({ logs: [] }),

  setLogsFilter: (filter) => set({ logsFilter: filter }),

  toggleLogsPaused: () => set((state) => ({ logsPaused: !state.logsPaused })),

  setLogsSearchQuery: (query) => set({ logsSearchQuery: query }),

  getFilteredLogs: () => {
    const { logs, logsFilter, logsSearchQuery } = get();
    return logs.filter((log) => {
      const matchesFilter = logsFilter === 'all' || log.level === logsFilter;
      const matchesSearch =
        logsSearchQuery === '' ||
        log.message.toLowerCase().includes(logsSearchQuery.toLowerCase()) ||
        (log.source?.toLowerCase().includes(logsSearchQuery.toLowerCase()) ?? false);
      return matchesFilter && matchesSearch;
    });
  },

  // Messages actions
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message].slice(-200),
    })),

  updateMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, status } : msg
      ),
    })),

  setMessagesFilter: (filter) => set({ messagesFilter: filter }),

  getFilteredMessages: () => {
    const { messages, messagesFilter } = get();
    if (messagesFilter === 'all') return messages;
    return messages.filter((msg) => msg.source === messagesFilter);
  },

  // Memory actions
  fetchMemoryFiles: async () => {
    set({ memoryLoading: true });
    try {
      const response = await fetch('/api/openclaw/memory');
      const data = await response.json();
      set({
        memoryFiles: data.files || [],
        memoryLoading: false,
      });
    } catch (error) {
      set({
        memoryLoading: false,
        lastError: error instanceof Error ? error.message : 'Failed to load memory',
      });
    }
  },

  loadMemoryFile: async (filename) => {
    set({ memoryLoading: true });
    try {
      const response = await fetch(`/api/openclaw/memory?file=${encodeURIComponent(filename)}`);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      set({
        selectedMemoryFile: data,
        memoryLoading: false,
      });
    } catch (error) {
      set({
        memoryLoading: false,
        lastError: error instanceof Error ? error.message : 'Failed to load file',
      });
    }
  },

  setSelectedMemoryFile: (content) => set({ selectedMemoryFile: content }),

  // Terminal actions
  sendCommand: async (prompt) => {
    set({ commandLoading: true });

    const pendingResponse: CommandResponse = {
      id: `cmd-${Date.now()}`,
      status: 'pending',
      startedAt: new Date(),
    };

    set((state) => ({
      terminalHistory: [...state.terminalHistory, pendingResponse],
    }));

    try {
      const response = await fetch('/api/openclaw/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      const completedResponse: CommandResponse = {
        ...pendingResponse,
        ...data,
        status: data.error ? 'error' : 'completed',
      };

      set((state) => ({
        terminalHistory: state.terminalHistory.map((cmd) =>
          cmd.id === pendingResponse.id ? completedResponse : cmd
        ),
        commandLoading: false,
        currentCommand: '',
      }));

      return completedResponse;
    } catch (error) {
      const errorResponse: CommandResponse = {
        ...pendingResponse,
        status: 'error',
        error: error instanceof Error ? error.message : 'Command failed',
        completedAt: new Date(),
      };

      set((state) => ({
        terminalHistory: state.terminalHistory.map((cmd) =>
          cmd.id === pendingResponse.id ? errorResponse : cmd
        ),
        commandLoading: false,
      }));

      return errorResponse;
    }
  },

  setCurrentCommand: (command) => set({ currentCommand: command }),

  clearTerminalHistory: () => set({ terminalHistory: [] }),

  // Task sync
  sendTaskToOpenClaw: async (task) => {
    try {
      const response = await fetch('/api/openclaw/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          tags: task.tags,
        }),
      });

      const data = await response.json();
      return {
        success: data.success,
        message: data.message || (data.success ? 'Task sent to OpenClaw' : 'Failed to send task'),
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send task',
      };
    }
  },

  // Navigation
  setActiveView: (view) => set({ activeView: view }),
}));
