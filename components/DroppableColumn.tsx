import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/lib/types';
import { useStore } from '@/lib/store';
import SortableTaskCard from './SortableTaskCard';
import { Plus } from 'lucide-react';

interface Column {
  id: string;
  title: string;
  status: TaskStatus;
}

interface DroppableColumnProps {
  column: Column;
  tasks: Task[];
}

export default function DroppableColumn({ column, tasks }: DroppableColumnProps) {
  const { openAddModal } = useStore();
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map((task) => task.id);

  const handleAddTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    openAddModal(column.status);
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 bg-slate-800 rounded-lg border-2 p-3 md:p-4
        transition-all duration-200
        min-h-[300px] md:min-h-[400px]
        ${isOver ? 'border-orange-500/50 bg-orange-500/5' : 'border-slate-700'}
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-100">{column.title}</h2>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-sm font-semibold bg-slate-700 text-slate-300 rounded-full border border-slate-600">
            {tasks.length}
          </span>
          <button
            onClick={handleAddTask}
            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-110 transition-all duration-200 shadow-lg"
            aria-label="Add new task"
            title="Add new task"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Task List */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-40 border-2 border-dashed border-slate-700 rounded-lg">
              <p className="text-sm text-slate-500 font-medium">No tasks yet</p>
            </div>
          ) : (
            tasks.map((task) => <SortableTaskCard key={task.id} task={task} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}
