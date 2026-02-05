'use client';

import { useEffect, useState } from 'react';
import { useOpenClawStore } from '@/lib/openclawStore';
import {
  Database,
  FileText,
  Calendar,
  FolderOpen,
  Loader2,
  RefreshCw,
  ChevronLeft,
  Clock,
  HardDrive,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const typeIcons = {
  daily: Calendar,
  project: FolderOpen,
  context: Database,
  other: FileText,
};

const typeColors = {
  daily: 'text-blue-400 bg-blue-500/20',
  project: 'text-purple-400 bg-purple-500/20',
  context: 'text-green-400 bg-green-500/20',
  other: 'text-slate-400 bg-slate-500/20',
};

export default function MemoryViewer() {
  const {
    memoryFiles,
    selectedMemoryFile,
    memoryLoading,
    fetchMemoryFiles,
    loadMemoryFile,
    setSelectedMemoryFile,
  } = useOpenClawStore();

  const [filterType, setFilterType] = useState<string>('all');

  // Fetch files on mount
  useEffect(() => {
    fetchMemoryFiles();
  }, [fetchMemoryFiles]);

  const filteredFiles = filterType === 'all'
    ? memoryFiles
    : memoryFiles.filter((f) => f.type === filterType);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const totalSize = memoryFiles.reduce((acc, f) => acc + f.size, 0);

  // Render file content (simple markdown preview)
  const renderContent = (content: string) => {
    // Split into lines and render with basic formatting
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('# ')) {
        return (
          <h1 key={i} className="text-xl font-bold text-slate-100 mt-4 mb-2">
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-lg font-semibold text-slate-200 mt-3 mb-2">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-base font-medium text-slate-300 mt-2 mb-1">
            {line.slice(4)}
          </h3>
        );
      }
      // List items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-4 text-slate-300">
            {line.slice(2)}
          </li>
        );
      }
      // Code blocks (simplified)
      if (line.startsWith('```')) {
        return null; // Skip code block markers
      }
      // Empty lines
      if (!line.trim()) {
        return <br key={i} />;
      }
      // Regular text
      return (
        <p key={i} className="text-slate-300">
          {line}
        </p>
      );
    });
  };

  // Detail view
  if (selectedMemoryFile) {
    return (
      <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedMemoryFile(null)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-semibold text-slate-100">{selectedMemoryFile.file.name}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(selectedMemoryFile.file.lastModified), 'dd MMM yyyy HH:mm', {
                    locale: fr,
                  })}
                </span>
                <span>{formatSize(selectedMemoryFile.file.size)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-invert prose-sm max-w-none">
            {renderContent(selectedMemoryFile.content)}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-orange-400" />
          <h2 className="font-semibold text-slate-100">Memory</h2>
          <span className="px-2 py-0.5 bg-slate-800 rounded-full text-xs text-slate-400">
            {memoryFiles.length} fichiers
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <HardDrive className="w-3 h-3" />
            {formatSize(totalSize)}
          </span>
          <button
            onClick={() => fetchMemoryFiles()}
            disabled={memoryLoading}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${memoryLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-700/50 overflow-x-auto">
        {['all', 'daily', 'project', 'context', 'other'].map((type) => {
          const isActive = filterType === type;
          const Icon = type === 'all' ? Database : typeIcons[type as keyof typeof typeIcons];
          const colorClass = type === 'all' ? '' : typeColors[type as keyof typeof typeColors];
          const count = type === 'all'
            ? memoryFiles.length
            : memoryFiles.filter((f) => f.type === type).length;

          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-orange-500/20 text-orange-400'
                  : `bg-slate-800 text-slate-400 hover:bg-slate-700`
              }`}
            >
              <Icon className={`w-4 h-4 ${!isActive && colorClass.split(' ')[0]}`} />
              <span className="capitalize">
                {type === 'all' ? 'Tous' : type}
              </span>
              <span className="text-xs opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Files list */}
      <div className="flex-1 overflow-y-auto p-2">
        {memoryLoading && filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <Database className="w-8 h-8" />
            <p>Aucun fichier</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFiles.map((file) => {
              const Icon = typeIcons[file.type];
              const colorClass = typeColors[file.type];

              return (
                <button
                  key={file.path}
                  onClick={() => loadMemoryFile(file.name)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-left group"
                >
                  <span className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-200 truncate group-hover:text-orange-400 transition-colors">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>
                        {format(new Date(file.lastModified), 'dd MMM yyyy', { locale: fr })}
                      </span>
                      <span>{formatSize(file.size)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
