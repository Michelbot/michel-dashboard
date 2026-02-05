'use client';

import { TaskStatus } from '@/lib/types';
import { useStore } from '@/lib/store';

const columns: { id: TaskStatus; label: string; icon: string }[] = [
  { id: 'ideas', label: 'Idées', icon: '💡' },
  { id: 'backlog', label: 'Backlog', icon: '📋' },
  { id: 'todo', label: 'À Faire', icon: '📝' },
  { id: 'inprogress', label: 'En Cours', icon: '⚡' },
  { id: 'review', label: 'Révision', icon: '🔍' },
  { id: 'done', label: 'Terminé', icon: '✅' },
];

interface MobileColumnTabsProps {
  activeColumn: TaskStatus;
  onColumnChange: (column: TaskStatus) => void;
}

export default function MobileColumnTabs({ activeColumn, onColumnChange }: MobileColumnTabsProps) {
  const { tasks } = useStore();

  const getTaskCount = (status: TaskStatus) => tasks.filter(t => t.status === status).length;

  return (
    <div className="lg:hidden sticky top-0 z-10 bg-[#0a0e1a] border-b border-slate-700 -mx-4 px-4 py-2">
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {columns.map((col) => {
          const count = getTaskCount(col.id);
          const isActive = activeColumn === col.id;

          return (
            <button
              key={col.id}
              onClick={() => onColumnChange(col.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
              }`}
            >
              <span>{col.icon}</span>
              <span className="hidden sm:inline">{col.label}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-slate-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
