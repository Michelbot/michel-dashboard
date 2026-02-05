'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle, User, Tag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Priority, TaskStatus } from '@/lib/types';

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
];

export default function AddTaskModal() {
  const { isAddModalOpen, addModalStatus, closeAddModal, addTask } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeName, setAssigneeName] = useState(availableAssignees[0]);
  const [tags, setTags] = useState('');
  const [titleError, setTitleError] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isAddModalOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssigneeName(availableAssignees[0]);
      setTags('');
      setTitleError(false);
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

  const handleCreate = () => {
    // Validate title
    if (title.trim().length === 0) {
      setTitleError(true);
      return;
    }

    // Create task
    addTask({
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      status: addModalStatus,
      priority,
      assignedTo: assigneeName,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      subtasks: [],
      links: [],
      project: 'General',
    });

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
            <h2 className="text-xl font-semibold text-slate-100">Create New Task</h2>
            <p className="text-sm text-slate-400 mt-1">
              Adding to: <span className="text-orange-400 font-medium">{getColumnTitle(addModalStatus)}</span>
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
              Title <span className="text-red-400">*</span>
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
              placeholder="Enter task title"
              autoFocus
            />
            {titleError && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} />
                Title is required
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
              placeholder="Enter task description"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <AlertCircle size={16} className="inline mr-1" />
              Priority
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
              Assignee
            </label>
            <select
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              {availableAssignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Tag size={16} className="inline mr-1" />
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., frontend, react, urgent"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={closeAddModal}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 hover:scale-105 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 hover:scale-105 transition-all duration-200"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
