'use client';

import { Search, X, Filter } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Priority } from '@/lib/types';

const priorities: { value: Priority | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'Toutes', color: 'bg-slate-700 text-slate-300' },
  { value: 'high', label: 'Haute', color: 'bg-red-500/20 text-red-400 border-red-500/50' },
  { value: 'medium', label: 'Moyenne', color: 'bg-orange-500/20 text-orange-400 border-orange-500/50' },
  { value: 'low', label: 'Basse', color: 'bg-gray-500/20 text-gray-400 border-gray-500/50' },
];

export default function SearchBar() {
  const { searchQuery, setSearchQuery, priorityFilter, setPriorityFilter, tasks, getFilteredTasks } = useStore();

  const filteredCount = getFilteredTasks().length;
  const totalCount = tasks.length;
  const isFiltering = searchQuery !== '' || priorityFilter !== 'all';

  return (
    <div className="bg-[#1a1f2e] rounded-xl border border-slate-700 p-4 space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par titre, description ou tag..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Filter className="w-4 h-4" />
          <span>Priorité:</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriorityFilter(p.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all duration-200 cursor-pointer ${
                priorityFilter === p.value
                  ? p.color + ' border-current'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {isFiltering && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {filteredCount} résultat{filteredCount !== 1 ? 's' : ''} sur {totalCount}
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setPriorityFilter('all');
            }}
            className="text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
          >
            Effacer les filtres
          </button>
        </div>
      )}
    </div>
  );
}
