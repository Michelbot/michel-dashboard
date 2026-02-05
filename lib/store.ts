import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus, Project, Priority } from './types';
import { initialTasks, initialProjects } from './data';

interface FilterState {
  searchQuery: string;
  priorityFilter: Priority | 'all';
  showToast: boolean;
  toastMessage: string;
  toastType: 'success' | 'error' | 'info';
}

interface DashboardStore {
  tasks: Task[];
  projects: Project[];
  currentActivity: string | null;

  // Filter states (not persisted)
  searchQuery: string;
  priorityFilter: Priority | 'all';

  // Toast state
  showToast: boolean;
  toastMessage: string;
  toastType: 'success' | 'error' | 'info';

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

  // Filter actions
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: Priority | 'all') => void;
  getFilteredTasks: () => Task[];

  // Toast actions
  showToastMessage: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

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
    (set, get) => ({
      tasks: initialTasks,
      projects: initialProjects,
      currentActivity: null,

      // Filter states
      searchQuery: '',
      priorityFilter: 'all',

      // Toast state
      showToast: false,
      toastMessage: '',
      toastType: 'success',

      // Modal states
      isAddModalOpen: false,
      addModalStatus: null,
      isTaskModalOpen: false,
      taskModalId: null,

      addTask: (task) => {
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
        get().showToastMessage('Tâche créée avec succès', 'success');
      },

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        get().showToastMessage('Tâche supprimée', 'info');
      },

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

      // Filter actions
      setSearchQuery: (query) =>
        set({ searchQuery: query }),

      setPriorityFilter: (priority) =>
        set({ priorityFilter: priority }),

      getFilteredTasks: () => {
        const { tasks, searchQuery, priorityFilter } = get();
        return tasks.filter((task) => {
          const matchesSearch = searchQuery === '' ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

          const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

          return matchesSearch && matchesPriority;
        });
      },

      // Toast actions
      showToastMessage: (message, type = 'success') => {
        set({ showToast: true, toastMessage: message, toastType: type });
        setTimeout(() => {
          set({ showToast: false });
        }, 3000);
      },

      hideToast: () =>
        set({ showToast: false }),

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

      archiveCompletedTasks: () => {
        const count = get().tasks.filter((task) => task.status === 'done').length;
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== 'done'),
        }));
        get().showToastMessage(`${count} tâche${count > 1 ? 's' : ''} archivée${count > 1 ? 's' : ''}`, 'success');
      },
        
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
      partialize: (state) => ({
        tasks: state.tasks,
        projects: state.projects,
        currentActivity: state.currentActivity,
      }),
    }
  )
);
