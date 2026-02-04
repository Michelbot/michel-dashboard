import { Task, Status } from '@/types/types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
}

export default function KanbanColumn({ title, status, tasks }: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        <span className="px-2.5 py-1 text-sm font-semibold bg-slate-700 text-slate-300 rounded-full border border-slate-600">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-40 bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg">
            <p className="text-sm text-slate-500 font-medium">No tasks yet</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
