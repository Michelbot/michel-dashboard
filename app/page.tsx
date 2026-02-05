import DashboardLayout from '@/components/DashboardLayout';
import MainDashboard from '@/components/MainDashboard';
import NewKanbanBoard from '@/components/NewKanbanBoard';

export default function Home() {
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
