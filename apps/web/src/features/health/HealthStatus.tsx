"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealth } from "./health.api";

export function HealthStatus() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 30_000
  });

  if (healthQuery.isPending) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Đang kiểm tra API...</p>
      </section>
    );
  }

  if (healthQuery.isError) {
    return (
      <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm font-semibold text-red-700">API chưa sẵn sàng</p>
        <p className="mt-2 text-sm text-red-600">{healthQuery.error.message}</p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
      <p className="text-sm font-semibold text-emerald-700">API đang hoạt động</p>
      <dl className="mt-4 grid gap-3 text-sm text-emerald-950 sm:grid-cols-2">
        <div>
          <dt className="font-medium">Service</dt>
          <dd>{healthQuery.data.data.service}</dd>
        </div>
        <div>
          <dt className="font-medium">Status</dt>
          <dd>{healthQuery.data.data.status}</dd>
        </div>
        <div>
          <dt className="font-medium">API timestamp</dt>
          <dd>{healthQuery.data.data.timestamp}</dd>
        </div>
        <div>
          <dt className="font-medium">Request ID</dt>
          <dd className="break-all">{healthQuery.data.meta.requestId}</dd>
        </div>
        <div>
          <dt className="font-medium">Correlation ID</dt>
          <dd className="break-all">{healthQuery.data.meta.correlationId}</dd>
        </div>
      </dl>
    </section>
  );
}
