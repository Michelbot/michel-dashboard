'use client';

import { ExecutionState } from '@/lib/types';
import { useExecutionStore } from '@/lib/executionStore';
import { Loader2, Play, Pause, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ExecutionStatusProps {
  taskId: string;
  executionState?: ExecutionState;
  executionId?: string;
  compact?: boolean;
}

const stateConfig: Record<
  ExecutionState,
  {
    label: string;
    icon: React.ReactNode;
    bgClass: string;
    textClass: string;
    animate?: boolean;
  }
> = {
  idle: {
    label: 'Inactif',
    icon: null,
    bgClass: 'bg-slate-700',
    textClass: 'text-slate-400',
  },
  queued: {
    label: 'En attente',
    icon: <Clock className="w-3 h-3" />,
    bgClass: 'bg-yellow-900/30',
    textClass: 'text-yellow-400',
  },
  executing: {
    label: 'En cours',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
    bgClass: 'bg-cyan-900/30',
    textClass: 'text-cyan-400',
    animate: true,
  },
  paused: {
    label: 'En pause',
    icon: <Pause className="w-3 h-3" />,
    bgClass: 'bg-orange-900/30',
    textClass: 'text-orange-400',
  },
  review_needed: {
    label: 'Révision requise',
    icon: <CheckCircle className="w-3 h-3" />,
    bgClass: 'bg-purple-900/30',
    textClass: 'text-purple-400',
  },
};

export default function ExecutionStatus({
  taskId,
  executionState = 'idle',
  executionId,
  compact = false,
}: ExecutionStatusProps) {
  const { getExecutionForTask } = useExecutionStore();

  // Get real-time execution data if available
  const execution = executionId ? getExecutionForTask(taskId) : undefined;

  // Use execution store status if available, otherwise use prop
  const currentState = execution
    ? execution.status === 'running'
      ? 'executing'
      : execution.status === 'pending' || execution.status === 'starting'
      ? 'queued'
      : execution.status === 'paused'
      ? 'paused'
      : 'idle'
    : executionState;

  const config = stateConfig[currentState];

  // Don't show anything for idle state unless there's an execution
  if (currentState === 'idle' && !execution) {
    return null;
  }

  // Progress from execution
  const progress = execution?.progress ?? 0;
  const currentStep = execution?.currentStep;

  if (compact) {
    return (
      <div
        className={`
          inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
          ${config.bgClass} ${config.textClass}
          ${config.animate ? 'animate-pulse' : ''}
        `}
        title={currentStep || config.label}
      >
        {config.icon}
        {currentState === 'executing' && progress > 0 && (
          <span>{progress}%</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Status badge */}
      <div
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border
          ${config.bgClass} ${config.textClass}
          ${config.animate ? 'border-cyan-500/50' : 'border-transparent'}
        `}
      >
        {config.icon}
        <span>{config.label}</span>
        {currentState === 'executing' && progress > 0 && (
          <span className="ml-1 font-bold">{progress}%</span>
        )}
      </div>

      {/* Progress bar for executing state */}
      {currentState === 'executing' && (
        <div className="w-full">
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {currentStep && (
            <p className="text-xs text-slate-500 mt-1 truncate">{currentStep}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Separate component for execution badge in task card
export function ExecutionBadge({
  executionState,
  progress,
}: {
  executionState?: ExecutionState;
  progress?: number;
}) {
  if (!executionState || executionState === 'idle') return null;

  const config = stateConfig[executionState];

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border
        ${config.bgClass} ${config.textClass}
        ${config.animate ? 'border-cyan-500/50' : 'border-transparent'}
      `}
    >
      {config.icon}
      <span>{config.label}</span>
      {executionState === 'executing' && progress !== undefined && progress > 0 && (
        <span className="font-bold">{progress}%</span>
      )}
    </span>
  );
}
