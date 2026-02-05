'use client';

import DashboardLayout from '@/components/DashboardLayout';
import MainDashboard from '@/components/MainDashboard';
import NewKanbanBoard from '@/components/NewKanbanBoard';
import LogsViewer from '@/components/LogsViewer';
import CommandTerminal from '@/components/CommandTerminal';
import MessagesPanel from '@/components/MessagesPanel';
import MemoryViewer from '@/components/MemoryViewer';
import SkillsActivity from '@/components/SkillsActivity';
import { useOpenClawStore } from '@/lib/openclawStore';
import { useExecutionSync } from '@/hooks/useExecutionSync';

export default function Home() {
  const { activeView } = useOpenClawStore();

  // Sync execution events with task store
  useExecutionSync();

  // Render OpenClaw views
  const renderOpenClawView = () => {
    switch (activeView) {
      case 'logs':
        return (
          <div className="h-[calc(100vh-8rem)]">
            <LogsViewer />
          </div>
        );
      case 'terminal':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
            <div className="lg:col-span-2">
              <CommandTerminal />
            </div>
            <div className="hidden lg:block">
              <SkillsActivity />
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="h-[calc(100vh-8rem)]">
            <MessagesPanel />
          </div>
        );
      case 'memory':
        return (
          <div className="h-[calc(100vh-8rem)]">
            <MemoryViewer />
          </div>
        );
      default:
        return null;
    }
  };

  // If showing an OpenClaw-specific view
  if (activeView !== 'dashboard') {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6">
          {renderOpenClawView()}
        </div>
      </DashboardLayout>
    );
  }

  // Default dashboard view
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <MainDashboard />
      </div>
      <div className="mt-4 sm:mt-6">
        <NewKanbanBoard />
      </div>
    </DashboardLayout>
  );
}
