'use client';

import { Task, Priority } from '@/lib/types';
import { useStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const priorityStyles: Record<Priority, { bg: string; text: string; dot: string }> = {
  high: { bg: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'text-red-400', dot: 'bg-red-500' },
  medium: { bg: 'bg-orange-500/20 text-orange-400 border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500' },
  low: { bg: 'bg-gray-500/20 text-gray-400 border-gray-500/30', text: 'text-gray-400', dot: 'bg-gray-500' },
};

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const [showAllSubtasks, setShowAllSubtasks] = useState(false);
  const toggleSubtask = useStore((state) => state.toggleSubtask);
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const visibleSubtasks = showAllSubtasks ? task.subtasks : task.subtasks.slice(0, 5);

  return (
    <div
      className={`
        group relative bg-slate-800 border border-slate-700 rounded-lg p-4
        cursor-pointer transition-all duration-200 ease-in-out
        hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10 hover:border-slate-600
        active:scale-[0.98]
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {/* Header: Status Dot + Title + Priority */}
      <div className="flex items-start gap-3 mb-3">
        {/* Status Dot */}
        <div className={`w-2 h-2 rounded-full ${priorityStyles[task.priority].dot} mt-2 flex-shrink-0`} />

        <h3 className="text-base font-medium text-slate-100 line-clamp-2 flex-1">
          {task.title}
        </h3>

        <span
          className={`
            px-2 py-1 text-xs font-semibold rounded border uppercase tracking-wide flex-shrink-0
            ${priorityStyles[task.priority].bg}
          `}
        >
          {task.priority}
        </span>
      </div>

      {/* Auto Badges */}
      {(task.autoCreated || task.autoPickup) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {task.autoCreated && (
            <span className="px-2 py-1 text-xs font-medium bg-purple-900/30 text-purple-300 rounded border border-purple-700 flex items-center gap-1">
              🤖 Auto-créé
            </span>
          )}
          {task.autoPickup && (
            <span className="px-2 py-1 text-xs font-medium bg-cyan-900/30 text-cyan-300 rounded border border-cyan-700 flex items-center gap-1">
              🔄 Récupération auto
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
          <span className="font-medium">Progression</span>
          <span className={`font-bold ${task.progress >= 80 ? 'text-green-500' : task.progress >= 50 ? 'text-orange-500' : 'text-slate-400'}`}>
            {task.progress}% • {completedSubtasks}/{task.subtasks.length}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 line-clamp-2 mb-3">
        {task.description}
      </p>

      {/* Subtasks */}
      {task.subtasks.length > 0 && (
        <div className="space-y-2 my-3">
          {visibleSubtasks.map(subtask => (
            <div
              key={subtask.id}
              className="flex items-start gap-2 group/subtask cursor-pointer hover:bg-slate-700/30 rounded px-1 py-0.5 -mx-1 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleSubtask(task.id, subtask.id);
              }}
            >
              <div className={`w-4 h-4 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                subtask.completed
                  ? 'bg-orange-500 border-orange-500'
                  : 'border-slate-600 bg-slate-700 group-hover/subtask:border-orange-500/50'
              }`}>
                {subtask.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm transition-colors ${subtask.completed ? "line-through text-slate-500" : "text-slate-300"}`}>
                {subtask.text}
              </span>
            </div>
          ))}
          {task.subtasks.length > 5 && (
            <button
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllSubtasks(!showAllSubtasks);
              }}
            >
              {showAllSubtasks
                ? 'Voir moins...'
                : `Voir ${task.subtasks.length - 5} de plus...`
              }
            </button>
          )}
        </div>
      )}

      {/* Links Section */}
      {task.links.length > 0 && (
        <div className="border-t border-slate-700 pt-3 mt-3">
          <div className="text-xs font-semibold text-slate-400 mb-2">🔗 LIENS</div>
          <div className="space-y-1">
            {task.links.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{link.icon}</span>
                <span className="truncate">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-slate-700 text-slate-300 rounded border border-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Timestamps */}
      <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 mt-3 border-t border-slate-700 flex-wrap">
        {task.startedAt && (
          <span className="flex items-center gap-1">
            ⏱️ Début: {formatDistanceToNow(task.startedAt, { locale: fr, addSuffix: true })}
          </span>
        )}
        <span className="flex items-center gap-1">
          🔄 Modifié: {formatDistanceToNow(task.updatedAt, { locale: fr, addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
