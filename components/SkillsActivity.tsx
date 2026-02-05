'use client';

import { useState, useEffect } from 'react';
import { useOpenClawStore } from '@/lib/openclawStore';
import {
  Zap,
  Play,
  Clock,
  Hash,
  RefreshCw,
} from 'lucide-react';

interface SkillInfo {
  name: string;
  description: string;
  active: boolean;
  lastUsed?: Date;
  usageCount: number;
}

// Mock skills data - in real implementation, this would come from the API
const mockSkills: SkillInfo[] = [
  { name: 'web-search', description: 'Search the web', active: true, usageCount: 45, lastUsed: new Date(Date.now() - 1000 * 60 * 5) },
  { name: 'code-gen', description: 'Generate code', active: true, usageCount: 128, lastUsed: new Date(Date.now() - 1000 * 60 * 2) },
  { name: 'image-gen', description: 'Generate images', active: false, usageCount: 23 },
  { name: 'file-manager', description: 'Manage files', active: true, usageCount: 67, lastUsed: new Date(Date.now() - 1000 * 60 * 15) },
  { name: 'telegram-bot', description: 'Telegram integration', active: true, usageCount: 89, lastUsed: new Date(Date.now() - 1000 * 60 * 1) },
  { name: 'memory-manager', description: 'Manage memory', active: true, usageCount: 156, lastUsed: new Date(Date.now() - 1000 * 60 * 3) },
];

export default function SkillsActivity() {
  const { connected, status } = useOpenClawStore();
  const [skills, setSkills] = useState<SkillInfo[]>(mockSkills);
  const [loading, setLoading] = useState(false);

  // In a real implementation, fetch skills from the API
  const refreshSkills = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSkills(mockSkills);
    setLoading(false);
  };

  useEffect(() => {
    if (connected) {
      refreshSkills();
    }
  }, [connected]);

  const activeSkills = skills.filter((s) => s.active);
  const totalUsage = skills.reduce((acc, s) => acc + s.usageCount, 0);

  const formatLastUsed = (date?: Date) => {
    if (!date) return 'Jamais';
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 1) return 'A l\'instant';
    if (minutes < 60) return `Il y a ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-400" />
          <h2 className="font-semibold text-slate-100">Skills</h2>
          <span className="px-2 py-0.5 bg-slate-800 rounded-full text-xs text-slate-400">
            {status?.skillsCount || skills.length}
          </span>
        </div>
        <button
          onClick={refreshSkills}
          disabled={loading || !connected}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-700/50">
        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
          <p className="text-lg font-semibold text-green-400">{activeSkills.length}</p>
          <p className="text-xs text-slate-500">Actifs</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
          <p className="text-lg font-semibold text-slate-200">{skills.length}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
          <p className="text-lg font-semibold text-orange-400">{totalUsage}</p>
          <p className="text-xs text-slate-500">Usages</p>
        </div>
      </div>

      {/* Skills list */}
      <div className="flex-1 overflow-y-auto p-2">
        {!connected ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <Zap className="w-8 h-8" />
            <p>Connexion requise</p>
          </div>
        ) : (
          <div className="space-y-1">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  skill.active
                    ? 'bg-slate-800/50 hover:bg-slate-800'
                    : 'bg-slate-900/50 opacity-60'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    skill.active ? 'bg-green-400' : 'bg-slate-600'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-200 truncate">{skill.name}</p>
                    {skill.active && skill.lastUsed && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Play className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{skill.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Hash className="w-3 h-3" />
                    {skill.usageCount}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatLastUsed(skill.lastUsed)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
