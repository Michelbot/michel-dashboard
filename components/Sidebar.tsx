import { Home, Folder, Settings, User } from 'lucide-react';

export default function Sidebar() {
  const projects = [
    { id: '1', name: 'Website Redesign', color: 'bg-orange-500' },
    { id: '2', name: 'Mobile App', color: 'bg-blue-500' },
    { id: '3', name: 'API Integration', color: 'bg-green-500' },
    { id: '4', name: 'Marketing Campaign', color: 'bg-purple-500' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-semibold text-slate-100">
          Michel <span className="text-orange-500">Dashboard</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 transition-all duration-200 hover:bg-orange-500/20">
          <Home size={20} />
          <span className="font-medium">Dashboard</span>
        </button>

        <div className="pt-4">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Projects
            </h3>
            <button className="text-slate-400 hover:text-orange-500 transition-colors duration-200">
              <Folder size={16} />
            </button>
          </div>
          <div className="space-y-1 mt-2">
            {projects.map((project) => (
              <button
                key={project.id}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200"
              >
                <div className={`w-2 h-2 rounded-full ${project.color}`} />
                <span className="text-sm font-medium">{project.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-all duration-200 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
            <User size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-100">Michel</p>
            <p className="text-xs text-slate-400">michel@dashboard.app</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
