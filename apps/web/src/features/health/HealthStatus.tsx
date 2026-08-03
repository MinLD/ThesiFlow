"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealth } from "./health.api";

export function HealthStatus() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 30_000,
  });

  if (healthQuery.isPending) {
    return <StatusShell tone="pending" title="Đang kiểm tra API" description="Kết nối tới backend ThesiFlow..." />;
  }

  if (healthQuery.isError) {
    return <StatusShell tone="error" title="API chưa sẵn sàng" description={healthQuery.error.message} />;
  }

  return <StatusShell tone="ready" title="Hệ thống sẵn sàng" description={`${healthQuery.data.data.service} · ${healthQuery.data.data.status}`} />;
}

function StatusShell({ tone, title, description }: { tone: "pending" | "ready" | "error"; title: string; description: string }) {
  const toneClass = {
    pending: "border-slate-200 bg-white/70 text-slate-600",
    ready: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
    error: "border-red-200 bg-red-50/80 text-red-700",
  }[tone];

  return (
    <section className={`mt-4 rounded-2xl border px-4 py-3 shadow-sm backdrop-blur ${toneClass}`}>
      <div className="flex items-center gap-3">
        <span className="size-2 rounded-full bg-current" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs opacity-80">{description}</p>
        </div>
      </div>
    </section>
  );
}
