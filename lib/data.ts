import { Task, Project, WorkspaceFile, SessionStats } from './types';

// Fichiers workspace - vide par défaut, à charger depuis le backend
export const workspaceFiles: WorkspaceFile[] = [];

// Stats de session - initialisé à zéro
export const sessionStats: SessionStats = {
  messages: 0,
  tools: 0,
};

// Projets - vide par défaut, à charger depuis le backend
export const initialProjects: Project[] = [];

// Tâches - vide par défaut, à charger depuis le backend
export const initialTasks: Task[] = [];
