'use client';

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '@/lib/store';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-green-900/90 border-green-500 text-green-100',
  error: 'bg-red-900/90 border-red-500 text-red-100',
  info: 'bg-blue-900/90 border-blue-500 text-blue-100',
};

export default function Toast() {
  const { showToast, toastMessage, toastType, hideToast } = useStore();

  if (!showToast) return null;

  const Icon = icons[toastType];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[toastType]}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{toastMessage}</span>
        <button
          onClick={hideToast}
          className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
