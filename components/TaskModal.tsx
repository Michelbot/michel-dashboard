'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Priority } from '@/lib/types';
import { format } from 'date-fns';
import { X, User, Tag, AlertCircle } from 'lucide-react';

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-500/20 text-red-400 border-red-500/50',
  medium: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

export default function TaskModal() {
  const {
    tasks,
    taskModalId,
    isTaskModalOpen,
    closeTaskModal,
    updateTask,
    deleteTask,
  } = useStore();

  const task = tasks.find((t) => t.id === taskModalId);

  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPriority, setEditedPriority] = useState<Priority>('medium');
  const [editedAssigneeName, setEditedAssigneeName] = useState('');
  const [editedTags, setEditedTags] = useState('');

  // Initialize form values when task changes
  useEffect(() => {
    if (task) {
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
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Task Details</h2>
          <button
            onClick={closeTaskModal}
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
              Title
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter task title"
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
              Assignee
            </label>
            <input
              type="text"
              value={editedAssigneeName}
              onChange={(e) => setEditedAssigneeName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter assignee name"
            />
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

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Tag size={16} className="inline mr-1" />
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., frontend, react, urgent"
            />
          </div>

          {/* Comments Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Comments
            </label>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-500 italic">
              No comments yet
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-slate-700 text-xs text-slate-500 space-y-1">
            <p>Created: {format(task.createdAt, 'MMM d, yyyy h:mm a')}</p>
            <p>Last updated: {format(task.updatedAt, 'MMM d, yyyy h:mm a')}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg font-medium hover:bg-red-500/30 hover:scale-105 transition-all duration-200"
          >
            Delete Task
          </button>
          <div className="flex gap-3">
            <button
              onClick={closeTaskModal}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 hover:scale-105 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 hover:scale-105 transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
