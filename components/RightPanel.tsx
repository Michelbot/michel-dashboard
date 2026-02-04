export default function RightPanel() {
  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-slate-900 border-l border-slate-700 hidden lg:flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-100">Task Details</h2>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">No task selected</p>
            <p className="text-xs text-slate-500 mt-1">
              Click on a task card to view details
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
