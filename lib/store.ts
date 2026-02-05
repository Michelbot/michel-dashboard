import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus, Project } from './types';
import { initialTasks, initialProjects } from './data';

interface DashboardStore {
  tasks: Task[];
  projects: Project[];
  currentActivity: string | null;

  // Modal states
  isAddModalOpen: boolean;
  addModalStatus: TaskStatus | null;
  isTaskModalOpen: boolean;
  taskModalId: string | null;

  // Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  setCurrentActivity: (activity: string | null) => void;

  // Subtask actions
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, text: string) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;

  // Archive actions
  archiveCompletedTasks: () => void;

  // Modal actions
  openAddModal: (status: TaskStatus) => void;
  closeAddModal: () => void;
  openTaskModal: (id: string) => void;
  closeTaskModal: () => void;
}

export const useStore = create<DashboardStore>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      projects: initialProjects,
      currentActivity: null,
      isAddModalOpen: false,
      addModalStatus: null,
      isTaskModalOpen: false,
      taskModalId: null,

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status,
                  updatedAt: new Date(),
                  startedAt:
                    status === 'inprogress' && !task.startedAt
                      ? new Date()
                      : task.startedAt,
                  completedAt:
                    status === 'done' ? new Date() : task.completedAt,
                }
              : task
          ),
        })),

      setCurrentActivity: (activity) =>
        set({ currentActivity: activity }),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;

            const updatedSubtasks = task.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            );
            const completedCount = updatedSubtasks.filter((st) => st.completed).length;
            const progress = updatedSubtasks.length > 0
              ? Math.round((completedCount / updatedSubtasks.length) * 100)
              : 0;

            return {
              ...task,
              subtasks: updatedSubtasks,
              progress,
              updatedAt: new Date(),
            };
          }),
        })),

      addSubtask: (taskId, text) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;

            const newSubtask = {
              id: `st-${Date.now()}`,
              text,
              completed: false,
            };
            const updatedSubtasks = [...task.subtasks, newSubtask];
            const completedCount = updatedSubtasks.filter((st) => st.completed).length;
            const progress = Math.round((completedCount / updatedSubtasks.length) * 100);

            return {
              ...task,
              subtasks: updatedSubtasks,
              progress,
              updatedAt: new Date(),
            };
          }),
        })),

      removeSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;

            const updatedSubtasks = task.subtasks.filter((st) => st.id !== subtaskId);
            const completedCount = updatedSubtasks.filter((st) => st.completed).length;
            const progress = updatedSubtasks.length > 0
              ? Math.round((completedCount / updatedSubtasks.length) * 100)
              : 0;

            return {
              ...task,
              subtasks: updatedSubtasks,
              progress,
              updatedAt: new Date(),
            };
          }),
        })),

      archiveCompletedTasks: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== 'done'),
        })),
        
      openAddModal: (status) =>
        set({ isAddModalOpen: true, addModalStatus: status }),
        
      closeAddModal: () =>
        set({ isAddModalOpen: false, addModalStatus: null }),
        
      openTaskModal: (id) =>
        set({ isTaskModalOpen: true, taskModalId: id }),
        
      closeTaskModal: () =>
        set({ isTaskModalOpen: false, taskModalId: null }),
    }),
    {
      name: 'michel-dashboard-storage',
    }
  )
);
