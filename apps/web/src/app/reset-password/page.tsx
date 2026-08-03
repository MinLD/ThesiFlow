"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { resetPassword } from "../../features/auth/auth.api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState(() => (typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") ?? ""));
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      await resetPassword({ token, password });
      setPassword("");
      setStatus("Mật khẩu đã đổi. Bạn có thể đăng nhập lại.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Đặt lại mật khẩu thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">ThesiFlow</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Đặt lại mật khẩu</h1>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Token
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-950"
              required
              value={token}
              onChange={(event) => setToken(event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Mật khẩu mới
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-950"
              minLength={12}
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </form>
        {status ? <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-700">{status}</p> : null}
        <Link className="mt-6 inline-block text-sm font-semibold text-slate-700" href="/">
          Về trang đăng nhập
        </Link>
      </section>
    </main>
  );
}
