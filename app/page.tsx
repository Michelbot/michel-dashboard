import Sidebar from '@/components/Sidebar';
import RightPanel from '@/components/RightPanel';
import KanbanBoard from '@/components/KanbanBoard';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Left Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content Area - Kanban Board */}
      <main className="flex-1 ml-64 lg:mr-80 overflow-hidden">
        <div className="h-screen overflow-y-auto">
          <KanbanBoard />
        </div>
      </main>

      {/* Right Panel - Fixed (hidden on mobile/tablet) */}
      <RightPanel />
    </div>
  );
}
