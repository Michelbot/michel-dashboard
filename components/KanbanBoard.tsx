'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useStore } from '@/store/useStore';
import { columns } from '@/lib/initialData';
import { Status, Task } from '@/types/types';
import DroppableColumn from './DroppableColumn';
import TaskCard from './TaskCard';

export default function KanbanBoard() {
  const { tasks, moveTask } = useStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dragging over a column
    const overColumn = columns.find((col) => col.id === overId);
    if (overColumn) {
      const task = tasks.find((t) => t.id === activeId);
      if (task && task.status !== overColumn.status) {
        moveTask(activeId, overColumn.status);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dropping on a column
    const overColumn = columns.find((col) => col.id === overId);
    if (overColumn) {
      moveTask(activeId, overColumn.status);
    }

    setActiveTask(null);
  };

  const getTasksByStatus = (status: Status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Responsive layout:
          - Mobile: Single column, stacked vertically
          - Tablet (md): Two columns side by side
          - Desktop (lg+): Three columns side by side
      */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full p-4 md:p-6">
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
