'use client';

import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { useOpenClawStore } from '@/lib/openclawStore';
import {
  Terminal,
  Send,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export default function CommandTerminal() {
  const {
    terminalHistory,
    currentCommand,
    commandLoading,
    setCurrentCommand,
    sendCommand,
    clearTerminalHistory,
    connected,
  } = useOpenClawStore();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-scroll to bottom
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory.length]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Get command history for navigation
  const commandHistory = terminalHistory
    .filter((cmd) => cmd.status !== 'pending')
    .map((cmd) => {
      // Extract the prompt from the response if available
      const match = cmd.response?.match(/^Commande: (.+)$/m);
      return match?.[1] || '';
    })
    .filter(Boolean);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp' && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown' && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  const handleSubmit = () => {
    if (!currentCommand.trim() || commandLoading || !connected) return;
    sendCommand(currentCommand.trim());
    setHistoryIndex(-1);
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-orange-400" />
          <h2 className="font-semibold text-slate-100">Terminal OpenClaw</h2>
        </div>
        <button
          onClick={clearTerminalHistory}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-red-400 transition-colors"
          title="Effacer l'historique"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-4">
        {terminalHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <Terminal className="w-8 h-8" />
            <p>Envoyer une commande a OpenClaw</p>
            <p className="text-xs">Utiliser Shift+Enter pour un saut de ligne</p>
          </div>
        ) : (
          terminalHistory.map((cmd) => (
            <div key={cmd.id} className="space-y-2">
              {/* Command info */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {getStatusIcon(cmd.status)}
                <span>{formatTimestamp(cmd.startedAt)}</span>
                {cmd.completedAt && (
                  <span className="text-slate-600">
                    ({Math.round((new Date(cmd.completedAt).getTime() - new Date(cmd.startedAt).getTime()) / 1000)}s)
                  </span>
                )}
              </div>

              {/* Response or error */}
              <div
                className={`p-3 rounded-lg ${
                  cmd.status === 'error'
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-slate-800/50'
                }`}
              >
                {cmd.status === 'pending' || cmd.status === 'processing' ? (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Traitement en cours...</span>
                  </div>
                ) : cmd.error ? (
                  <div className="text-red-400">
                    <p className="font-medium">Erreur:</p>
                    <p className="mt-1 whitespace-pre-wrap">{cmd.error}</p>
                  </div>
                ) : (
                  <div className="text-slate-300 whitespace-pre-wrap">
                    {cmd.response || 'Aucune reponse'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={historyEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-slate-700/50">
        {!connected && (
          <div className="mb-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
            OpenClaw n'est pas connecte. Verifiez que le gateway est actif.
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-3 text-orange-400 font-mono">&gt;</span>
            <textarea
              ref={inputRef}
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={connected ? 'Entrer une commande...' : 'Connexion requise...'}
              disabled={!connected || commandLoading}
              rows={2}
              className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 resize-none font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {/* History navigation hint */}
            <div className="absolute right-3 top-3 flex items-center gap-1 text-slate-600">
              <ChevronUp className="w-3 h-3" />
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!currentCommand.trim() || commandLoading || !connected}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
          >
            {commandLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
