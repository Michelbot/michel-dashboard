'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Priority, TaskStatus } from '@/lib/types';
import { format } from 'date-fns';
import { X, User, Tag, AlertCircle, Plus, Trash2, CheckSquare, ArrowRight, Terminal, FileText } from 'lucide-react';
import ExecutionLogs from './ExecutionLogs';
import { isExecutionAgent } from '@/lib/execution/types';

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-500/20 text-red-400 border-red-500/50',
  medium: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

const statusOptions: { value: TaskStatus; label: string; icon: string }[] = [
  { value: 'ideas', label: 'Idées', icon: '💡' },
  { value: 'backlog', label: 'Backlog', icon: '📋' },
  { value: 'todo', label: 'À Faire', icon: '📝' },
  { value: 'inprogress', label: 'En Cours', icon: '⚡' },
  { value: 'review', label: 'Révision', icon: '🔍' },
  { value: 'done', label: 'Terminé', icon: '✅' },
];

export default function TaskModal() {
  const {
    tasks,
    taskModalId,
    isTaskModalOpen,
    closeTaskModal,
    updateTask,
    deleteTask,
    moveTask,
    toggleSubtask,
    addSubtask,
    removeSubtask,
    showToastMessage,
  } = useStore();

  const task = tasks.find((t) => t.id === taskModalId);

  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPriority, setEditedPriority] = useState<Priority>('medium');
  const [editedAssigneeName, setEditedAssigneeName] = useState('');
  const [editedTags, setEditedTags] = useState('');
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'execution'>('details');

  // Initialize form values when task changes - intentional sync with prop
  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditedTitle(task.title);
      setEditedDescription(task.description);
      setEditedPriority(task.priority);
      setEditedAssigneeName(task.assignedTo);
      setEditedTags(task.tags.join(', '));
    }
  }, [task]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTaskModal();
      }
    };

    if (isTaskModalOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isTaskModalOpen, closeTaskModal]);

  if (!isTaskModalOpen || !task) return null;

  const handleSave = () => {
    if (taskModalId) {
      updateTask(taskModalId, {
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
        assignedTo: editedAssigneeName,
        tags: editedTags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      closeTaskModal();
    }
  };

  const handleDelete = () => {
    if (taskModalId && confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskModalId);
      closeTaskModal();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeTaskModal();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-200"
      onClick={handleOverlayClick}
    >
      <div className="bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 transition-all duration-200 animate-in fade-in zoom-in-95">
        {/* Header with Tabs */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-slate-100">Détails de la Tâche</h2>
            <button
              onClick={closeTaskModal}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              aria-label="Fermer"
              data-testid="close-detail-modal"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          {/* Tab navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'details'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              Détails
            </button>
            <button
              onClick={() => setActiveTab('execution')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'execution'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Exécution
              {task.executionState === 'executing' && (
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Execution Tab */}
          {activeTab === 'execution' && (
            <div className="space-y-6">
              {/* Agent warning */}
              {!isExecutionAgent(task.assignedTo) && (
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-400">
                        Tâche non assignée à un agent
                      </p>
                      <p className="text-xs text-yellow-400/70 mt-1">
                        Pour activer l&apos;exécution automatique, assignez cette tâche à &quot;OpenClaw AI&quot; ou &quot;Michel&quot;.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Execution logs component */}
              <ExecutionLogs
                taskId={task.id}
                executionId={task.executionId}
              />

              {/* Last error */}
              {task.lastExecutionError && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-xs font-medium text-red-400 mb-1">Dernière erreur:</p>
                  <p className="text-sm text-red-300">{task.lastExecutionError}</p>
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Titre
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Titre de la tâche"
              data-testid="edit-task-title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Description de la tâche"
              data-testid="edit-task-description"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <AlertCircle size={16} className="inline mr-1" />
              Priorité
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setEditedPriority(priority)}
                  className={`
                    px-4 py-2 text-sm font-semibold rounded-lg border uppercase tracking-wide
                    transition-all duration-200 hover:scale-105
                    ${
                      editedPriority === priority
                        ? priorityStyles[priority]
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                    }
                  `}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <User size={16} className="inline mr-1" />
              Assigné à
            </label>
            <input
              type="text"
              value={editedAssigneeName}
              onChange={(e) => setEditedAssigneeName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Nom de l'assigné"
            />
          </div>

          {/* Quick Status Change */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <ArrowRight size={16} className="inline mr-1" />
              Déplacer vers
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (task.status !== option.value) {
                      moveTask(task.id, option.value);
                      showToastMessage(`Tâche déplacée vers ${option.label}`, 'success');
                    }
                  }}
                  disabled={task.status === option.value}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    task.status === option.value
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Progress: {task.progress}%
            </label>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <CheckSquare size={16} className="inline mr-1" />
              Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
            </label>

            {/* Add new subtask */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSubtaskText.trim()) {
                    addSubtask(task.id, newSubtaskText.trim());
                    setNewSubtaskText('');
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Ajouter une sous-tâche..."
              />
              <button
                onClick={() => {
                  if (newSubtaskText.trim()) {
                    addSubtask(task.id, newSubtaskText.trim());
                    setNewSubtaskText('');
                  }
                }}
                disabled={!newSubtaskText.trim()}
                className="px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 cursor-pointer"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Subtask list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {task.subtasks.length === 0 ? (
                <p className="text-sm text-slate-500 italic py-2">Aucune sous-tâche</p>
              ) : (
                task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 group bg-slate-900/50 rounded-lg px-3 py-2 hover:bg-slate-900 transition-colors"
                  >
                    <button
                      onClick={() => toggleSubtask(task.id, subtask.id)}
                      className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                        subtask.completed
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-slate-600 hover:border-orange-500/50'
                      }`}
                    >
                      {subtask.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                      {subtask.text}
                    </span>
                    <button
                      onClick={() => removeSubtask(task.id, subtask.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all cursor-pointer"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Tag size={16} className="inline mr-1" />
              Tags (séparés par virgule)
            </label>
            <input
              type="text"
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="ex: frontend, react, urgent"
            />
          </div>

          {/* Comments Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Commentaires
            </label>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-500 italic">
              Aucun commentaire
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-slate-700 text-xs text-slate-500 space-y-1">
            <p>Created: {format(task.createdAt, 'MMM d, yyyy h:mm a')}</p>
            <p>Last updated: {format(task.updatedAt, 'MMM d, yyyy h:mm a')}</p>
          </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg font-medium hover:bg-red-500/30 hover:scale-105 transition-all duration-200"
            data-testid="delete-task-btn"
          >
            Supprimer
          </button>
          <div className="flex gap-3">
            <button
              onClick={closeTaskModal}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 hover:scale-105 transition-all duration-200"
              data-testid="cancel-edit-btn"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 hover:scale-105 transition-all duration-200"
              data-testid="save-task-btn"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
