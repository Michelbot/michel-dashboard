'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Plus, Archive } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function EnhancedRightPanel() {
  const { openAddModal, archiveCompletedTasks, tasks } = useStore();
  const completedCount = tasks.filter(t => t.status === 'done').length;

  const handleArchive = () => {
    if (completedCount === 0) return;
    archiveCompletedTasks();
  };

  return (
    <aside className="hidden xl:block fixed right-0 top-0 w-80 h-screen overflow-y-auto bg-[#0f1419] border-l border-slate-700 p-4 space-y-4">
      {/* Top Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleArchive}
          disabled={completedCount === 0}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
            completedCount > 0
              ? 'bg-slate-800 hover:bg-green-900/50 text-slate-300 hover:text-green-300'
              : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Archive size={16} />
          Archiver ({completedCount})
        </button>
        <button
          onClick={() => openAddModal('todo')}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1"
        >
          <Plus size={16} />
          Nouvelle
        </button>
      </div>

      {/* Mental State Card */}
      <MentalStateCard />

      {/* Idle Mode Card */}
      <IdleModeCard />
    </aside>
  );
}

function MentalStateCard() {
  const [collapsed, setCollapsed] = useState(false);
  const { projects } = useStore();
  const activeProject = projects.find(p => p.status === 'active');

  return (
    <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl border border-orange-700/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">❤️</span>
          <h3 className="font-semibold text-slate-100">État Mental</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Modifié il y a 7s</span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-slate-700/50 rounded transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Active Projects Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span>📊</span>
            <span className="text-sm font-semibold text-slate-300">Projets Actifs</span>
            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full font-bold">
              {projects.filter(p => p.status === 'active').length}
            </span>
          </div>

          {/* Project Card */}
          {activeProject && (
            <div className="bg-[#1a1f2e] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-200">{activeProject.name}</h4>
                <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs font-semibold rounded border border-purple-700 uppercase">
                  En Cours
                </span>
              </div>

              <div>
                <p className="text-sm text-slate-400">📊 {activeProject.phase}</p>
                <p className="text-sm text-green-500 font-semibold mt-1">
                  ✅ {activeProject.milestones.completed}/{activeProject.milestones.total} milestones
                </p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{activeProject.milestones.completed} sur {activeProject.milestones.total} milestones</span>
                  <span className="text-orange-500 font-bold">{activeProject.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${activeProject.progress}%` }}
                  />
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-slate-500 space-y-1">
                <div>📅 Début : {activeProject.startedAt}</div>
                <div>🚀 Version : {activeProject.version}</div>
              </div>

              {/* Next Steps */}
              {activeProject.nextSteps.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2">Prochaines Étapes :</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {activeProject.nextSteps.slice(0, 3).map((step, i) => (
                      <li key={i}>• {step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function IdleModeCard() {
  const { tasks, openAddModal } = useStore();
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const ideasCount = tasks.filter(t => t.status === 'ideas').length;

  const scrollToColumn = (columnId: string) => {
    const column = document.getElementById(`column-${columnId}`);
    if (column) {
      column.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      column.classList.add('ring-2', 'ring-orange-500');
      setTimeout(() => {
        column.classList.remove('ring-2', 'ring-orange-500');
      }, 2000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-700/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h3 className="font-semibold text-slate-100">Mode Veille</h3>
        </div>
        <span className="text-xs text-slate-400">il y a 7s</span>
      </div>

      <p className="text-sm text-slate-400 mb-3">
        Non concentré sur une tâche spécifique
      </p>

      <p className="text-sm text-slate-300 font-medium mb-4">
        Prêt à travailler ? Voici quelques actions rapides :
      </p>

      {/* Quick Actions */}
      <div className="space-y-2">
        <button
          onClick={() => scrollToColumn('todo')}
          className="w-full bg-slate-800/50 hover:bg-slate-700 rounded-lg p-3 text-left transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
            <div>
              <p className="text-sm font-medium text-slate-200">Vérifier À Faire</p>
              <p className="text-xs text-slate-400">{todoCount} tâches en attente</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => scrollToColumn('ideas')}
          className="w-full bg-slate-800/50 hover:bg-slate-700 rounded-lg p-3 text-left transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">💡</span>
            <div>
              <p className="text-sm font-medium text-slate-200">Revoir Idées</p>
              <p className="text-xs text-slate-400">{ideasCount} éléments à explorer</p>
            </div>
          </div>
        </button>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => openAddModal('todo')}
        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>⚙️</span>
        <span>Commencer quelque chose</span>
      </button>
    </div>
  );
}
