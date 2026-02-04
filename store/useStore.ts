import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Status } from '@/types/types';
import { initialTasks } from '@/lib/initialData';

interface StoreState {
  tasks: Task[];
  selectedTaskId: string | null;
  isTaskModalOpen: boolean;
  isAddModalOpen: boolean;
  addModalStatus: Status | null;

  // Task actions
  moveTask: (taskId: string, newStatus: Status) => void;
  reorderTasks: (taskId: string, overTaskId: string) => void;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;

  // Modal actions
  selectTask: (taskId: string) => void;
  openTaskModal: () => void;
  closeTaskModal: () => void;
  openAddModal: (status: Status) => void;
  closeAddModal: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      selectedTaskId: null,
      isTaskModalOpen: false,
      isAddModalOpen: false,
      addModalStatus: null,

      // Task actions
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

      addTask: (taskData) =>
        set((state) => {
          const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return { tasks: [...state.tasks, newTask] };
        }),

      updateTask: (taskId: string, updates: Partial<Task>) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),

      deleteTask: (taskId: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),

      // Modal actions
      selectTask: (taskId: string) =>
        set({ selectedTaskId: taskId }),

      openTaskModal: () =>
        set({ isTaskModalOpen: true }),

      closeTaskModal: () =>
        set({ isTaskModalOpen: false, selectedTaskId: null }),

      openAddModal: (status: Status) =>
        set({ isAddModalOpen: true, addModalStatus: status }),

      closeAddModal: () =>
        set({ isAddModalOpen: false, addModalStatus: null }),
    }),
    {
      name: 'michel-dashboard-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
