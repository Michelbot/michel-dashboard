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
