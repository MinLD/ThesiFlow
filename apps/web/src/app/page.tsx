import { HealthStatus } from "../features/health/HealthStatus";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">ThesiFlow</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Foundation Architecture</h1>
      <p className="mt-4 text-lg text-slate-600">
        Phase 1 chỉ xác minh frontend, backend, database, Docker và quality gates. Chưa có Auth/RBAC/domain workflow.
      </p>
      <HealthStatus />
    </main>
  );
}
