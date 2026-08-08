"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../features/auth/AuthProvider";
import { AuthPanel } from "../../../features/auth/AuthPanel";
import { useTenant } from "../../../features/tenancy/TenantProvider";
import { acceptInvitation } from "../../../features/tenancy/tenancy.api";

export default function InvitationAcceptPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 p-6 text-slate-950">Đang tải lời mời...</main>}>
      <InvitationAcceptContent />
    </Suspense>
  );
}

function InvitationAcceptContent() {
  const params = useSearchParams();
  const auth = useAuth();
  const tenant = useTenant();
  const token = params.get("token") ?? "";
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);
    try {
      await acceptInvitation({ token });
      await tenant.refreshMemberships();
      setMessage("Đã nhận lời mời. Bạn có thể quay lại trang chính để chọn tổ chức.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể nhận lời mời.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-xl">
        {auth.state.status === "authenticated" ? (
          <form className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/5" onSubmit={submit}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Invitation</p>
            <h1 className="mt-3 text-2xl font-bold">Nhận lời mời tổ chức</h1>
            <p className="mt-2 text-sm text-slate-600">Token chỉ được gửi tới backend để xác minh, không lưu ở trình duyệt.</p>
            <button className="mt-6 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={!token || isSubmitting} type="submit">
              {isSubmitting ? "Đang nhận lời mời..." : "Nhận lời mời"}
            </button>
            {!token ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">Thiếu token lời mời.</p> : null}
            {message ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}
            {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          </form>
        ) : (
          <AuthPanel />
        )}
      </div>
    </main>
  );
}
