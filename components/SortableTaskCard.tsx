import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/types';
import { useStore } from '@/store/useStore';
import TaskCard from './TaskCard';

interface SortableTaskCardProps {
  task: Task;
}

export default function SortableTaskCard({ task }: SortableTaskCardProps) {
  const { selectTask, openTaskModal } = useStore();

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
    selectTask(task.id);
    openTaskModal();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-50' : 'opacity-100'}
      onClick={handleClick}
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}
