'use client';

import { useEffect, useRef, useState } from 'react';
import { useExecutionStore } from '@/lib/executionStore';
import { ExecutionLog, ExecutionRecord } from '@/lib/execution/types';
import { format } from 'date-fns';
import {
  Play,
  Square,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Terminal,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2,
} from 'lucide-react';

interface ExecutionLogsProps {
  taskId: string;
  executionId?: string;
}

const logTypeConfig: Record<
  ExecutionLog['type'],
  { icon: React.ReactNode; className: string }
> = {
  info: {
    icon: <Info className="w-3 h-3" />,
    className: 'text-slate-400',
  },
  progress: {
    icon: <RefreshCw className="w-3 h-3" />,
    className: 'text-cyan-400',
  },
  subtask: {
    icon: <CheckCircle className="w-3 h-3" />,
    className: 'text-green-400',
  },
  error: {
    icon: <AlertCircle className="w-3 h-3" />,
    className: 'text-red-400',
  },
  system: {
    icon: <Terminal className="w-3 h-3" />,
    className: 'text-purple-400',
  },
};

function LogEntry({ log }: { log: ExecutionLog }) {
  const config = logTypeConfig[log.type];
  const timestamp =
    log.timestamp instanceof Date
      ? log.timestamp
      : new Date(log.timestamp);

  return (
    <div className={`flex items-start gap-2 py-1 ${config.className}`}>
      <span className="flex-shrink-0 mt-0.5">{config.icon}</span>
      <span className="text-xs text-slate-500 flex-shrink-0 font-mono">
        {format(timestamp, 'HH:mm:ss')}
      </span>
      <span className="text-sm flex-1 break-words">{log.message}</span>
    </div>
  );
}

function ExecutionHeader({
  execution,
  onCancel,
  onRetry,
}: {
  execution: ExecutionRecord | undefined;
  onCancel: () => void;
  onRetry: () => void;
}) {
  if (!execution) {
    return (
      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 text-slate-500">
          <Terminal className="w-4 h-4" />
          <span className="text-sm">Aucune exécution en cours</span>
        </div>
        <button
          onClick={onRetry}
          className="px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition-colors flex items-center gap-1"
        >
          <Play className="w-3 h-3" />
          Démarrer
        </button>
      </div>
    );
  }

  const statusConfig = {
    pending: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
    starting: { label: 'Démarrage', color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
    running: { label: 'En cours', color: 'text-cyan-400', bg: 'bg-cyan-900/30' },
    paused: { label: 'En pause', color: 'text-orange-400', bg: 'bg-orange-900/30' },
    completed: { label: 'Terminé', color: 'text-green-400', bg: 'bg-green-900/30' },
    failed: { label: 'Échoué', color: 'text-red-400', bg: 'bg-red-900/30' },
    cancelled: { label: 'Annulé', color: 'text-slate-400', bg: 'bg-slate-700' },
  };

  const config = statusConfig[execution.status];
  const isActive =
    execution.status === 'running' ||
    execution.status === 'pending' ||
    execution.status === 'starting';

  return (
    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
      <div className="flex items-center gap-3">
        <div className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.color}`}>
          {isActive && <Loader2 className="w-3 h-3 animate-spin inline mr-1" />}
          {config.label}
        </div>
        <div className="text-sm text-slate-400">
          {execution.progress}%
          {execution.currentStep && (
            <span className="ml-2 text-slate-500">• {execution.currentStep}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isActive ? (
          <button
            onClick={onCancel}
            className="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors flex items-center gap-1"
          >
            <Square className="w-3 h-3" />
            Annuler
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Relancer
          </button>
        )}
      </div>
    </div>
  );
}

export default function ExecutionLogs({ taskId, executionId }: ExecutionLogsProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [expanded, setExpanded] = useState(true);

  const {
    getExecutionForTask,
    startExecution,
    cancelExecution,
    connectSSE,
    isConnected,
  } = useExecutionStore();

  const execution = getExecutionForTask(taskId);

  // Connect to SSE when component mounts
  useEffect(() => {
    if (!isConnected && executionId) {
      connectSSE();
    }
  }, [isConnected, executionId, connectSSE]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [execution?.logs.length, autoScroll]);

  const handleCancel = async () => {
    await cancelExecution(taskId);
  };

  const handleRetry = async () => {
    await startExecution(taskId);
  };

  const logs = execution?.logs ?? [];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          <Terminal className="w-4 h-4" />
          Exécution
          {logs.length > 0 && (
            <span className="text-xs text-slate-500">({logs.length} logs)</span>
          )}
        </button>
        {execution && (
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="w-3 h-3 rounded bg-slate-700 border-slate-600"
            />
            Auto-scroll
          </label>
        )}
      </div>

      {expanded && (
        <>
          {/* Execution status header */}
          <ExecutionHeader
            execution={execution}
            onCancel={handleCancel}
            onRetry={handleRetry}
          />

          {/* Progress bar */}
          {execution && (
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  execution.status === 'running'
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400'
                    : execution.status === 'completed'
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : execution.status === 'failed'
                    ? 'bg-gradient-to-r from-red-500 to-red-400'
                    : 'bg-gradient-to-r from-orange-500 to-orange-400'
                }`}
                style={{ width: `${execution.progress}%` }}
              />
            </div>
          )}

          {/* Error message */}
          {execution?.error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-2 text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{execution.error}</p>
              </div>
            </div>
          )}

          {/* Result summary */}
          {execution?.result?.summary && execution.status === 'completed' && (
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-start gap-2 text-green-400">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{execution.result.summary}</p>
              </div>
            </div>
          )}

          {/* Review notes */}
          {execution?.result?.reviewNotes && (
            <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <p className="text-xs font-medium text-purple-400 mb-1">Notes de révision:</p>
              <p className="text-sm text-purple-300">{execution.result.reviewNotes}</p>
            </div>
          )}

          {/* Logs container */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto p-3 font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic">Aucun log disponible</p>
              ) : (
                logs.map((log) => <LogEntry key={log.id} log={log} />)
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Completed subtasks from execution */}
          {execution?.result?.completedSubtasks &&
            execution.result.completedSubtasks.length > 0 && (
              <div className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg">
                <p className="text-xs font-medium text-slate-400 mb-2">
                  Sous-tâches complétées ({execution.result.completedSubtasks.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {execution.result.completedSubtasks.map((id) => (
                    <span
                      key={id}
                      className="px-2 py-0.5 text-xs bg-green-900/30 text-green-400 rounded"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );
}
