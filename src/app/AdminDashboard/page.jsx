export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
          Admin Dashboard
        </p>
        <h1 className="mb-4 text-4xl font-black">Dashboard temporarily unavailable</h1>
        <p className="max-w-2xl text-white/65">
          The previous admin dashboard component in this workspace is incomplete, so this route now
          renders a safe placeholder instead of crashing the build. The rest of the app can compile
          normally while the admin experience is rebuilt.
        </p>
      </div>
    </main>
  );
}
