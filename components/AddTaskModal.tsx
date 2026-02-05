'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle, User, Tag, Zap, Loader2, Play } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useOpenClawStore } from '@/lib/openclawStore';
import { Priority, TaskStatus } from '@/lib/types';
import { isExecutionAgent } from '@/lib/execution/types';

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-500/20 text-red-400 border-red-500/50',
  medium: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

const availableAssignees = [
  'Sarah Chen',
  'Marcus Rodriguez',
  'Emily Watson',
  'David Park',
  'Alex Johnson',
  'OpenClaw AI',
];

export default function AddTaskModal() {
  const { isAddModalOpen, addModalStatus, closeAddModal, addTask, showToastMessage } = useStore();
  const { connected, sendTaskToOpenClaw } = useOpenClawStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeName, setAssigneeName] = useState(availableAssignees[0]);
  const [tags, setTags] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [sendToOpenClaw, setSendToOpenClaw] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Reset form when modal opens - intentional setState in effect for form reset
  useEffect(() => {
    if (isAddModalOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssigneeName(availableAssignees[0]);
      setTags('');
      setTitleError(false);
      setSendToOpenClaw(false);
      setIsSending(false);
    }
  }, [isAddModalOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAddModal();
      }
    };

    if (isAddModalOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isAddModalOpen, closeAddModal]);

  if (!isAddModalOpen || !addModalStatus) return null;

  const handleCreate = async () => {
    // Validate title
    if (title.trim().length === 0) {
      setTitleError(true);
      return;
    }

    const taskId = `task-${Date.now()}`;
    const taskTags = tags.split(',').map((tag) => tag.trim()).filter(Boolean);

    // Create task
    addTask({
      id: taskId,
      title: title.trim(),
      description: description.trim(),
      status: addModalStatus,
      priority,
      assignedTo: sendToOpenClaw ? 'OpenClaw AI' : assigneeName,
      tags: taskTags,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      subtasks: [],
      links: [],
      project: 'General',
      autoCreated: false,
      autoPickup: sendToOpenClaw,
    });

    // Send to OpenClaw if enabled
    if (sendToOpenClaw && connected) {
      setIsSending(true);
      const result = await sendTaskToOpenClaw({
        id: taskId,
        title: title.trim(),
        description: description.trim(),
        priority,
        tags: taskTags,
      });

      if (result.success) {
        showToastMessage('Tache envoyee a OpenClaw', 'success');
      } else {
        showToastMessage(`Erreur: ${result.message}`, 'error');
      }
      setIsSending(false);
    }

    closeAddModal();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeAddModal();
    }
  };

  const getColumnTitle = (status: TaskStatus): string => {
    const titles: Record<TaskStatus, string> = {
      'ideas': 'Idées',
      'backlog': 'Backlog',
      'todo': 'À Faire',
      'inprogress': 'En Cours',
      'review': 'Révision',
      'done': 'Terminé',
    };
    return titles[status];
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-200"
      onClick={handleOverlayClick}
    >
      <div className="bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 transition-all duration-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Nouvelle Tâche</h2>
            <p className="text-sm text-slate-400 mt-1">
              Ajout dans: <span className="text-orange-400 font-medium">{getColumnTitle(addModalStatus)}</span>
            </p>
          </div>
          <button
            onClick={closeAddModal}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(false);
              }}
              className={`
                w-full px-4 py-2 bg-slate-900 border rounded-lg text-slate-100
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                transition-all duration-200
                ${titleError ? 'border-red-500 ring-2 ring-red-500/50' : 'border-slate-700'}
              `}
              placeholder="Titre de la tâche"
              autoFocus
              data-testid="task-title-input"
            />
            {titleError && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} />
                Le titre est requis
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Description de la tâche"
              data-testid="task-description-input"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <AlertCircle size={16} className="inline mr-1" />
              Priorité
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`
                    px-4 py-2 text-sm font-semibold rounded-lg border uppercase tracking-wide
                    transition-all duration-200 hover:scale-105
                    ${
                      priority === p
                        ? priorityStyles[p]
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                    }
                  `}
                >
                  {p}
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
            <select
              value={sendToOpenClaw ? 'OpenClaw AI' : assigneeName}
              onChange={(e) => {
                setAssigneeName(e.target.value);
                setSendToOpenClaw(e.target.value === 'OpenClaw AI');
              }}
              disabled={sendToOpenClaw}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            >
              {availableAssignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Tag size={16} className="inline mr-1" />
              Tags (séparés par virgule)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="ex: frontend, react, urgent"
              data-testid="task-tags-input"
            />
          </div>

          {/* OpenClaw Integration */}
          <div className={`p-4 rounded-lg border transition-all ${
            sendToOpenClaw
              ? 'bg-orange-500/10 border-orange-500/30'
              : 'bg-slate-900 border-slate-700'
          }`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendToOpenClaw}
                onChange={(e) => {
                  setSendToOpenClaw(e.target.checked);
                  if (e.target.checked) {
                    setAssigneeName('OpenClaw AI');
                  }
                }}
                disabled={!connected}
                className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 disabled:opacity-50"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Zap className={`w-5 h-5 ${sendToOpenClaw ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span className={`font-medium ${sendToOpenClaw ? 'text-orange-400' : 'text-slate-300'}`}>
                    Envoyer a OpenClaw
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {connected
                    ? 'OpenClaw traitera cette tache automatiquement'
                    : 'OpenClaw n\'est pas connecte'}
                </p>
              </div>
              {!connected && (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                  Hors ligne
                </span>
              )}
            </label>
          </div>

          {/* Auto-execution warning */}
          {addModalStatus === 'inprogress' && isExecutionAgent(sendToOpenClaw ? 'OpenClaw AI' : assigneeName) && (
            <div className="p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Play className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-cyan-400">
                    Exécution automatique activée
                  </p>
                  <p className="text-xs text-cyan-400/70 mt-1">
                    Cette tâche sera créée dans &quot;En Cours&quot; et sera immédiatement envoyée à l&apos;agent pour exécution.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={closeAddModal}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 hover:scale-105 transition-all duration-200"
            disabled={isSending}
            data-testid="cancel-task-btn"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={isSending}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            data-testid="create-task-btn"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi...
              </>
            ) : sendToOpenClaw ? (
              <>
                <Zap className="w-4 h-4" />
                Créer et Envoyer
              </>
            ) : (
              'Créer la tâche'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
