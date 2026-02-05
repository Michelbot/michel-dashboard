'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { workspaceFiles, sessionStats } from '@/lib/data';

export default function Sidebar() {
  const [memoryExpanded, setMemoryExpanded] = useState(false);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0f1419] border-r border-slate-700 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white">
              M
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-yellow-500 rounded-full border-2 border-[#0f1419] flex items-center justify-center text-xs">
              🏅
            </div>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-50">Michel</h3>
          <div className="flex items-center gap-2 text-sm text-green-500 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            En ligne
          </div>
          {/* XP Bar */}
          <div className="w-full mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Niveau 5</span>
              <span>50%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>💬</span>
            <span>STATUS</span>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border-l-4 border-cyan-500">
            <p className="text-sm text-slate-300 italic">
              Construction de quelque chose d'incroyable...
            </p>
          </div>
        </div>

        {/* Workspace Files */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>📁</span>
            <span>FICHIERS WORKSPACE</span>
          </div>
          <div className="space-y-1">
            {workspaceFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 rounded hover:bg-slate-700 cursor-pointer transition-all duration-200 hover:translate-x-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{file.icon}</span>
                  <span className="text-sm text-slate-300">{file.name}</span>
                </div>
                <span className="text-xs text-slate-500">{file.timestamp}</span>
              </div>
            ))}
            {/* Memory Folder */}
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-slate-700 cursor-pointer transition-all duration-200"
              onClick={() => setMemoryExpanded(!memoryExpanded)}
            >
              <div className="flex items-center gap-2">
                {memoryExpanded ? (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                )}
                <span className="text-base">📁</span>
                <span className="text-sm text-slate-300">
                  MEMORY/ <span className="text-slate-500">(31 FILES)</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>📊</span>
            <span>STATS SESSION</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">MESSAGES</div>
              <div className="text-2xl font-bold text-cyan-500">
                {sessionStats.messages}
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">OUTILS</div>
              <div className="text-2xl font-bold text-cyan-500">
                {sessionStats.tools}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500">
            v1.2.0 🌙 <span className="italic">Toujours curieux</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
