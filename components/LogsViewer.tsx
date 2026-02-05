'use client';

import { useEffect, useRef, useState } from 'react';
import { useOpenClawStore } from '@/lib/openclawStore';
import { LogLevel } from '@/lib/openclawTypes';
import {
  Search,
  Pause,
  Play,
  Trash2,
  Filter,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  ChevronDown,
} from 'lucide-react';

const levelIcons = {
  info: Info,
  warn: AlertTriangle,
  error: AlertCircle,
  debug: Bug,
};

const levelColors = {
  info: 'text-blue-400 bg-blue-500/10',
  warn: 'text-yellow-400 bg-yellow-500/10',
  error: 'text-red-400 bg-red-500/10',
  debug: 'text-slate-400 bg-slate-500/10',
};

export default function LogsViewer() {
  const {
    logs,
    logsFilter,
    logsPaused,
    logsSearchQuery,
    setLogsFilter,
    toggleLogsPaused,
    setLogsSearchQuery,
    clearLogs,
    getFilteredLogs,
    addLogs,
  } = useOpenClawStore();

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredLogs = getFilteredLogs();

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs.length, autoScroll]);

  // Fetch initial logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/openclaw/logs');
        const data = await response.json();
        if (data.logs) {
          addLogs(data.logs);
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      }
    };

    fetchLogs();
  }, [addLogs]);

  // SSE streaming for real-time logs
  useEffect(() => {
    if (logsPaused) return;

    let eventSource: EventSource | null = null;

    const connect = () => {
      eventSource = new EventSource('/api/openclaw/logs?stream=true');

      eventSource.onmessage = (event) => {
        try {
          const log = JSON.parse(event.data);
          addLogs([log]);
        } catch {
          // Ignore parse errors
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
        // Reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
    };
  }, [logsPaused, addLogs]);

  // Handle scroll to detect manual scrolling
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isNearBottom);
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <h2 className="font-semibold text-slate-100">Logs OpenClaw</h2>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={logsSearchQuery}
              onChange={(e) => setLogsSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 w-48"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                logsFilter !== 'all'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm capitalize">{logsFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 py-1 min-w-32">
                {(['all', 'info', 'warn', 'error', 'debug'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setLogsFilter(level);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-700/50 ${
                      logsFilter === level ? 'text-orange-400' : 'text-slate-300'
                    }`}
                  >
                    {level === 'all' ? 'Tous' : level.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pause/Play */}
          <button
            onClick={toggleLogsPaused}
            className={`p-2 rounded-lg transition-colors ${
              logsPaused
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={logsPaused ? 'Reprendre' : 'Pause'}
          >
            {logsPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Clear */}
          <button
            onClick={clearLogs}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-red-400 transition-colors"
            title="Effacer les logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs list */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2 font-mono text-sm"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Aucun log</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredLogs.map((log) => {
              const Icon = levelIcons[log.level as LogLevel] || Info;
              const colorClass = levelColors[log.level as LogLevel] || levelColors.info;

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-2 p-2 rounded hover:bg-slate-800/50 group"
                >
                  <span className="text-slate-500 text-xs whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                    <Icon className="w-3 h-3 inline-block mr-1" />
                    {log.level.toUpperCase()}
                  </span>
                  {log.source && (
                    <span className="text-purple-400 text-xs">[{log.source}]</span>
                  )}
                  <span className="text-slate-300 break-all">{log.message}</span>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Footer status */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-slate-700/50 text-xs text-slate-500">
        <span>{filteredLogs.length} / {logs.length} logs</span>
        <div className="flex items-center gap-3">
          {logsPaused && (
            <span className="text-yellow-400">Pause</span>
          )}
          <span
            className={`flex items-center gap-1 ${autoScroll ? 'text-green-400' : 'text-slate-500'}`}
          >
            <span className={`w-2 h-2 rounded-full ${autoScroll ? 'bg-green-400' : 'bg-slate-600'}`} />
            Auto-scroll
          </span>
        </div>
      </div>
    </div>
  );
}
