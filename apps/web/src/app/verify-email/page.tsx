"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { verifyEmail } from "../../features/auth/auth.api";

export default function VerifyEmailPage() {
  const [token] = useState(() => (typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") ?? ""));
  const [status, setStatus] = useState(() => (token ? "Đang xác minh email..." : "Thiếu token xác minh email."));

  useEffect(() => {
    if (!token) {
      return;
    }

    verifyEmail({ token })
      .then(() => setStatus("Email đã xác minh. Bạn có thể đăng nhập."))
      .catch((error) => setStatus(error instanceof Error ? error.message : "Xác minh email thất bại."));
  }, [token]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">ThesiFlow</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Xác minh email</h1>
        <p className="mt-4 text-slate-700">{status}</p>
        <Link className="mt-6 inline-block rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/">
          Về trang đăng nhập
        </Link>
      </section>
    </main>
  );
}
