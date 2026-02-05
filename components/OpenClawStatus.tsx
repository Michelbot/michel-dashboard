'use client';

import { useEffect } from 'react';
import { useOpenClawStore } from '@/lib/openclawStore';
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';

interface OpenClawStatusProps {
  compact?: boolean;
  onClick?: () => void;
}

export default function OpenClawStatus({ compact = false, onClick }: OpenClawStatusProps) {
  const { connected, connecting, status, lastError, checkConnection } = useOpenClawStore();

  useEffect(() => {
    // Check connection on mount
    checkConnection();

    // Poll every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
          connected
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
        }`}
      >
        {connecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : connected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {connecting ? 'Connexion...' : connected ? 'OpenClaw' : 'Hors ligne'}
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
        connected
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-red-500/10 border-red-500/30'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              connected ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
          >
            {connecting ? (
              <Loader2 className={`w-5 h-5 animate-spin ${connected ? 'text-green-400' : 'text-red-400'}`} />
            ) : connected ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">OpenClaw Gateway</h3>
            <p className={`text-sm ${connected ? 'text-green-400' : 'text-red-400'}`}>
              {connecting ? 'Connexion en cours...' : connected ? 'Connecte' : 'Deconnecte'}
            </p>
          </div>
        </div>
        {connected && status && (
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-100">
              {status.activeSessionsCount || 0}
            </span>
            <p className="text-xs text-slate-400">sessions</p>
          </div>
        )}
      </div>

      {lastError && !connected && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="truncate">{lastError}</span>
        </div>
      )}

      {connected && status && (
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-800/50 rounded-lg p-2">
            <p className="text-lg font-semibold text-slate-100">{status.skillsCount || 0}</p>
            <p className="text-xs text-slate-400">Skills</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2">
            <p className="text-lg font-semibold text-slate-100">
              {status.telegramConnected ? (
                <span className="text-green-400">ON</span>
              ) : (
                <span className="text-slate-500">OFF</span>
              )}
            </p>
            <p className="text-xs text-slate-400">Telegram</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2">
            <p className="text-lg font-semibold text-slate-100">
              {formatBytes(status.memorySize || 0)}
            </p>
            <p className="text-xs text-slate-400">Memory</p>
          </div>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
