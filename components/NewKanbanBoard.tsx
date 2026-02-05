'use client';

import { useState } from 'react';
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
  useDraggable,
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

const columns = [
  { id: 'ideas', title: '💡 Idées/Plans', status: 'ideas' as TaskStatus },
  { id: 'backlog', title: '📋 Backlog', status: 'backlog' as TaskStatus },
  { id: 'todo', title: '📝 À Faire', status: 'todo' as TaskStatus },
  { id: 'inprogress', title: '⚡ En Cours', status: 'inprogress' as TaskStatus },
  { id: 'review', title: '🔍 Révision', status: 'review' as TaskStatus },
  { id: 'done', title: '✅ Terminé', status: 'done' as TaskStatus },
];

function SortableTaskCard({ task }: { task: Task }) {
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

  const priorityColors = {
    high: 'border-red-500 bg-red-900/20',
    medium: 'border-orange-500 bg-orange-900/20',
    low: 'border-blue-500 bg-blue-900/20',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-[#1a1f2e] border border-slate-700 rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'opacity-50' : 'hover:shadow-lg hover:-translate-y-1'
      } ${priorityColors[task.priority]}`}
    >
      <h4 className="font-semibold text-slate-200 mb-2">{task.title}</h4>
      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
        {task.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="px-2 py-1 bg-slate-700 rounded">{task.project}</span>
        <span>{task.assignedTo}</span>
      </div>
    </div>
  );
}

function TaskCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const priorityColors = {
    high: 'border-red-500 bg-red-900/20',
    medium: 'border-orange-500 bg-orange-900/20',
    low: 'border-blue-500 bg-blue-900/20',
  };

  return (
    <div
      className={`bg-[#1a1f2e] border border-slate-700 rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'opacity-50' : 'hover:shadow-lg hover:-translate-y-1'
      } ${priorityColors[task.priority]}`}
    >
      <h4 className="font-semibold text-slate-200 mb-2">{task.title}</h4>
      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
        {task.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="px-2 py-1 bg-slate-700 rounded">{task.project}</span>
        <span>{task.assignedTo}</span>
      </div>
    </div>
  );
}

function KanbanColumn({ title, status, tasks }: { title: string; status: TaskStatus; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="flex flex-col min-w-[280px] bg-[#0f1419] rounded-xl border border-slate-700">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-200">{title}</h3>
          <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded-full">
            {tasks.length}
          </span>
        </div>
        <button 
          className="p-1 hover:bg-slate-700 rounded transition-colors"
          onClick={() => alert('Nouvelle tâche - À implémenter')}
        >
          <Plus className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      <div ref={setNodeRef} className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[200px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default function NewKanbanBoard() {
  const tasks = useStore((state) => state.tasks);
  const moveTask = useStore((state) => state.moveTask);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
      console.log('✅ Tâche déplacée vers:', overColumn.title);
      return;
    }

    // Si on drop sur une autre tâche, trouver sa colonne
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && overTask.status) {
      const activeTask = tasks.find((t) => t.id === active.id);
      if (activeTask && activeTask.status !== overTask.status) {
        moveTask(active.id as string, overTask.status);
        console.log('✅ Tâche déplacée vers:', overTask.status);
      }
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-6 overflow-x-auto h-full">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            status={column.status}
            tasks={getTasksByStatus(column.status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
