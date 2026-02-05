import Sidebar from '@/components/Sidebar';
import MainDashboard from '@/components/MainDashboard';
import NewKanbanBoard from '@/components/NewKanbanBoard';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#0a0e1a]">
      {/* Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 overflow-hidden">
        <div className="h-screen overflow-y-auto">
          <div className="p-6">
            <MainDashboard />
          </div>
          <div className="mt-6">
            <NewKanbanBoard />
          </div>
        </div>
      </main>
    </div>
  );
}
