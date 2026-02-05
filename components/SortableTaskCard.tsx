'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/lib/types';
import { useStore } from '@/lib/store';
import TaskCard from './TaskCard';

interface SortableTaskCardProps {
  task: Task;
}

export default function SortableTaskCard({ task }: SortableTaskCardProps) {
  const { openTaskModal } = useStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    openTaskModal(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-50' : 'opacity-100'}
      onClick={handleClick}
      suppressHydrationWarning
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}
