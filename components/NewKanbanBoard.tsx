'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '@/lib/store';
import { Task, TaskStatus } from '@/lib/types';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import MobileColumnTabs from './MobileColumnTabs';

const columns = [
  { id: 'ideas', title: '💡 Idées/Plans', status: 'ideas' as TaskStatus },
  { id: 'backlog', title: '📋 Backlog', status: 'backlog' as TaskStatus },
  { id: 'todo', title: '📝 À Faire', status: 'todo' as TaskStatus },
  { id: 'inprogress', title: '⚡ En Cours', status: 'inprogress' as TaskStatus },
  { id: 'review', title: '🔍 Révision', status: 'review' as TaskStatus },
  { id: 'done', title: '✅ Terminé', status: 'done' as TaskStatus },
];

function SortableTaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Handle click on the card (not drag)
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent if click originated from the drag handle (top 32px)
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;

    if (clickY > 32 && !isDragging) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`task-card-${task.id}`}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
    >
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}

function KanbanColumn({
  title,
  status,
  tasks,
  onAddTask,
  onTaskClick,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onTaskClick: (taskId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      id={`column-${status}`}
      className={`flex flex-col min-w-[300px] max-w-[320px] bg-[#0f1419] rounded-xl border transition-colors duration-200 ${
        isOver ? 'border-orange-500 bg-orange-900/10' : 'border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-200">{title}</h3>
          <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded-full font-bold">
            {tasks.length}
          </span>
        </div>
        <button
          className="p-1.5 hover:bg-orange-500/20 hover:text-orange-400 rounded-lg transition-all duration-200 cursor-pointer"
          onClick={() => onAddTask(status)}
          data-testid={`add-task-${status}`}
          aria-label={`Ajouter une tâche à ${title}`}
        >
          <Plus className="w-4 h-4 text-slate-400 hover:text-orange-400" />
        </button>
      </div>
      <div ref={setNodeRef} className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-280px)]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-lg">
              <p className="text-sm text-slate-500">Aucune tâche</p>
            </div>
          ) : (
            tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task.id)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default function NewKanbanBoard() {
  const tasks = useStore((state) => state.tasks);
  const getFilteredTasks = useStore((state) => state.getFilteredTasks);
  const moveTask = useStore((state) => state.moveTask);
  const openAddModal = useStore((state) => state.openAddModal);
  const openTaskModal = useStore((state) => state.openTaskModal);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [mobileActiveColumn, setMobileActiveColumn] = useState<TaskStatus>('todo');
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch with @dnd-kit - intentional pattern for SSR
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Use filtered tasks for display
  const filteredTasks = getFilteredTasks();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    // Si on drop sur une colonne différente
    const overColumn = columns.find((col) => col.id === over.id);
    if (overColumn) {
      moveTask(active.id as string, overColumn.status);
      return;
    }

    // Si on drop sur une autre tâche, trouver sa colonne
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && overTask.status) {
      const currentTask = tasks.find((t) => t.id === active.id);
      if (currentTask && currentTask.status !== overTask.status) {
        moveTask(active.id as string, overTask.status);
      }
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleAddTask = (status: TaskStatus) => {
    openAddModal(status);
  };

  const handleTaskClick = (taskId: string) => {
    openTaskModal(taskId);
  };

  // Get the active mobile column data
  const activeMobileColumnData = columns.find(c => c.status === mobileActiveColumn);

  // Prevent hydration mismatch - show loading skeleton until mounted
  if (!mounted) {
    return (
      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col min-w-[300px] max-w-[320px] bg-[#0f1419] rounded-xl border border-slate-700 animate-pulse"
            >
              <div className="p-4 border-b border-slate-700">
                <div className="h-6 bg-slate-700 rounded w-32"></div>
              </div>
              <div className="p-3 space-y-3 min-h-[200px]">
                <div className="h-24 bg-slate-800 rounded-lg"></div>
                <div className="h-24 bg-slate-800 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Mobile Column Tabs */}
      <div className="px-4 sm:px-6">
        <MobileColumnTabs
          activeColumn={mobileActiveColumn}
          onColumnChange={setMobileActiveColumn}
        />
      </div>

      {/* Desktop: All columns */}
      <div className="hidden lg:flex gap-4 p-6 overflow-x-auto h-full pb-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            status={column.status}
            tasks={getTasksByStatus(column.status)}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>

      {/* Mobile: Single column */}
      <div className="lg:hidden p-4">
        {activeMobileColumnData && (
          <KanbanColumn
            title={activeMobileColumnData.title}
            status={activeMobileColumnData.status}
            tasks={getTasksByStatus(activeMobileColumnData.status)}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
