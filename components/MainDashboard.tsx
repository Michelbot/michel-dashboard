'use client';

import { useStore } from '@/lib/store';

export default function MainDashboard() {
  const tasks = useStore((state) => state.tasks);

  const activeTasks = tasks.filter((t) => t.status !== 'done').length;
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'inprogress').length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;

  const currentTask = tasks.find((t) => t.status === 'inprogress');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Bonjour';
    if (hour < 18) return '🌤️ Bon après-midi';
    return '🌙 Bonsoir';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-50">Michel Dashboard</h1>
        <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs font-semibold rounded-full border border-purple-700">
          DEVELOPMENT
        </span>
      </div>

      {/* Greeting Card */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-8 border border-purple-700/30">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-50">
            {getGreeting()}, Michel
          </h2>
          <p className="text-slate-300">
            Votre espace de travail personnel & centre de commande
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => alert("Bouton cliqué!")} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 rounded-lg transition-all duration-200 text-sm font-medium border border-slate-600">
              🧠 Mes Pensées
            </button>
            <button onClick={() => alert("Bouton cliqué!")} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 rounded-lg transition-all duration-200 text-sm font-medium border border-slate-600">
              📊 Analytiques
            </button>
            <button onClick={() => alert("Bouton cliqué!")} className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 rounded-lg transition-all duration-200 text-sm font-medium border border-slate-600">
              ⚙️ Paramètres
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a1f2e] rounded-xl p-6 border border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📋</div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tâches Actives
              </div>
              <div className="text-3xl font-bold text-slate-50 mt-1">
                {activeTasks}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {totalTasks} au total
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1f2e] rounded-xl p-6 border border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                En Cours
              </div>
              <div className="text-3xl font-bold text-orange-500 mt-1">
                {inProgressTasks}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Travail actuel
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1f2e] rounded-xl p-6 border border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Terminé
              </div>
              <div className="text-3xl font-bold text-green-500 mt-1">
                {completedTasks}
              </div>
              <div className="text-xs text-slate-500 mt-1">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Currently Working On */}
      <div className="bg-[#1a1f2e] rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚡</span>
          <span className="text-xl">🔥</span>
          <h3 className="text-lg font-semibold text-slate-50">
            Travail en Cours
          </h3>
        </div>
        {currentTask ? (
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <h4 className="font-semibold text-slate-200 mb-2">
              {currentTask.title}
            </h4>
            <p className="text-sm text-slate-400 mb-3">
              {currentTask.description}
            </p>
            <div className="flex gap-2">
              {currentTask.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-orange-900/30 text-orange-300 text-xs rounded border border-orange-700/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-2">Aucune tâche active</p>
            <p className="text-sm text-slate-500 mb-4">
              Commencez à travailler sur une tâche pour la voir ici
            </p>
            <button className="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors">
              Voir Toutes les Tâches →
            </button>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="bg-[#1a1f2e] rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🔋</span>
          <h3 className="text-lg font-semibold text-slate-50">État Système</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✅</span>
            <span className="text-slate-300">API Connectée</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✅</span>
            <span className="text-slate-300">WebSocket Actif</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500">✅</span>
            <span className="text-slate-300">Base de Données OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
