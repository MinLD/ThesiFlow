import { HealthStatus } from "../features/health/HealthStatus";
import { AuthPanel } from "../features/auth/AuthPanel";

const lifecycleItems = [
  "Topic proposal",
  "Project registration",
  "Supervision",
  "Submission",
  "Review",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
            Academic Project Lifecycle Platform
          </div>
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Quản lý vòng đời đồ án học thuật từ đề xuất đến đánh giá.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            ThesiFlow chuẩn hóa account, tổ chức, chiến dịch, đề tài, đăng ký, dự án, nộp tài liệu và phản biện trong một nền tảng modular monolith.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {lifecycleItems.map((item) => (
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm" key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Metric label="Current phase" value="Phase 3" />
            <Metric label="Auth model" value="Global" />
            <Metric label="Architecture" value="Modular" />
          </div>
        </section>

        <div className="w-full max-w-xl justify-self-center lg:justify-self-end">
          <AuthPanel />
          <HealthStatus />
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}
