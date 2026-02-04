import { Task, Priority } from '@/types/types';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  return (
    <div
      className={`
        group relative bg-slate-800 border border-slate-700 rounded-lg p-4
        cursor-move transition-all duration-200
        hover:scale-105 hover:shadow-lg hover:border-slate-600
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {/* Header: Title + Priority */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-medium text-slate-100 line-clamp-2 flex-1">
          {task.title}
        </h3>
        <span
          className={`
            px-2 py-1 text-xs font-semibold rounded border uppercase tracking-wide
            ${priorityStyles[task.priority]}
          `}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 line-clamp-3 mb-4">
        {task.description}
      </p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
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

      {/* Footer: Assignee + Due Date */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-slate-300">
            {task.assignee.name}
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar size={14} />
          <span className="text-xs font-medium">
            {format(task.dueDate, 'MMM d')}
          </span>
        </div>
      </div>
    </div>
  );
}
