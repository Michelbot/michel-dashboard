export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Michel Dashboard
        </h1>
        <p className="text-xl text-slate-400">
          Production-ready Kanban Dashboard with Next.js 14
        </p>
        <div className="flex gap-4 text-sm">
          <span className="rounded-full bg-green-500/10 px-4 py-2 text-green-400 border border-green-500/20">
            TypeScript
          </span>
          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-blue-400 border border-blue-500/20">
            Tailwind CSS
          </span>
          <span className="rounded-full bg-orange-500/10 px-4 py-2 text-orange-400 border border-orange-500/20">
            Zustand
          </span>
          <span className="rounded-full bg-purple-500/10 px-4 py-2 text-purple-400 border border-purple-500/20">
            DnD Kit
          </span>
        </div>
      </main>
    </div>
  );
}
