import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column, Task } from '@/types/types';
import SortableTaskCard from './SortableTaskCard';

interface DroppableColumnProps {
  column: Column;
  tasks: Task[];
}

export default function DroppableColumn({ column, tasks }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 bg-slate-800 rounded-lg border-2 p-4
        transition-all duration-200
        ${isOver ? 'border-orange-500/50 bg-orange-500/5' : 'border-slate-700'}
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-100">{column.title}</h2>
        <span className="px-2.5 py-1 text-sm font-semibold bg-slate-700 text-slate-300 rounded-full border border-slate-600">
          {tasks.length}
        </span>
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
