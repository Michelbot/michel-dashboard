import { create } from 'zustand';
import { Task, Status } from '@/types/types';
import { initialTasks } from '@/lib/initialData';

interface StoreState {
  tasks: Task[];
  moveTask: (taskId: string, newStatus: Status) => void;
  reorderTasks: (taskId: string, overTaskId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  tasks: initialTasks,

  moveTask: (taskId: string, newStatus: Status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task
      ),
    })),

  reorderTasks: (taskId: string, overTaskId: string) =>
    set((state) => {
      const tasks = [...state.tasks];
      const draggedTaskIndex = tasks.findIndex((t) => t.id === taskId);
      const overTaskIndex = tasks.findIndex((t) => t.id === overTaskId);

      if (draggedTaskIndex === -1 || overTaskIndex === -1) {
        return state;
      }

      const [draggedTask] = tasks.splice(draggedTaskIndex, 1);
      tasks.splice(overTaskIndex, 0, draggedTask);

      return { tasks };
    }),
}));
