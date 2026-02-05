'use client';

import { Menu, X, Plus } from 'lucide-react';
import { useStore } from '@/lib/store';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function MobileHeader({ onMenuToggle, isMenuOpen }: MobileHeaderProps) {
  const { openAddModal } = useStore();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f1419] border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-slate-300" />
          ) : (
            <Menu className="w-6 h-6 text-slate-300" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white">
            M
          </div>
          <span className="font-semibold text-slate-100">Michel</span>
        </div>

        <button
          onClick={() => openAddModal('todo')}
          className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  );
}
