import Sidebar from '@/components/Sidebar';
import RightPanel from '@/components/RightPanel';
import KanbanBoard from '@/components/KanbanBoard';
import TaskModal from '@/components/TaskModal';
import AddTaskModal from '@/components/AddTaskModal';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Left Sidebar - Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area - Kanban Board */}
      <main className="flex-1 lg:ml-64 xl:mr-80 overflow-hidden">
        <div className="h-screen overflow-y-auto">
          <KanbanBoard />
        </div>
      </main>

      {/* Right Panel - Hidden on mobile/tablet, visible on xl+ */}
      <div className="hidden xl:block">
        <RightPanel />
      </div>

      {/* Modals */}
      <TaskModal />
      <AddTaskModal />
    </div>
  );
}
