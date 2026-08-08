"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "./AuthProvider";
import { TenantDashboard } from "../tenancy/TenantDashboard";

type Mode = "login" | "register";

type Notice = {
  type: "success" | "info";
  text: string;
};

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const auth = useAuth();

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError(null);
    setNotice(null);
    setPassword("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await auth.register({ email, fullName, password });
        setNotice({ type: "success", text: "Đã tạo tài khoản. Vui lòng kiểm tra email để xác minh trước khi đăng nhập." });
        setMode("login");
        setPassword("");
        return;
      }

      await auth.login({ email, password });
      setPassword("");
      setNotice({ type: "success", text: "Đăng nhập thành công." });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể xử lý yêu cầu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function requestPasswordReset() {
    if (!email) {
      setError("Nhập email trước khi yêu cầu đặt lại mật khẩu.");
      return;
    }

    setError(null);
    setNotice(null);
    setIsForgotSubmitting(true);

    try {
      await auth.forgotPassword({ email });
      setNotice({ type: "info", text: "Nếu email tồn tại, hệ thống đã gửi link đặt lại mật khẩu." });
    } catch (forgotError) {
      setError(forgotError instanceof Error ? forgotError.message : "Không thể gửi yêu cầu đặt lại mật khẩu.");
    } finally {
      setIsForgotSubmitting(false);
    }
  }

  async function logout() {
    setError(null);
    setNotice(null);
    await auth.logout().catch((logoutError) => {
      setError(logoutError instanceof Error ? logoutError.message : "Không thể đăng xuất.");
    });
  }

  if (auth.state.status === "loading") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-950/5 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">ThesiFlow Access</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">Đang khôi phục phiên đăng nhập</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Hệ thống đang kiểm tra refresh session an toàn qua HttpOnly cookie.</p>
      </section>
    );
  }

  if (auth.state.status === "authenticated") {
    return <TenantDashboard />;
  }


  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-950/5 backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">ThesiFlow Access</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">Đăng nhập hệ thống</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Sử dụng tài khoản toàn cục để truy cập nền tảng quản lý vòng đời đồ án học thuật.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-sm font-semibold">
        <button className={`rounded-xl px-4 py-2.5 transition ${mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-700"}`} type="button" onClick={() => switchMode("login")}>
          Đăng nhập
        </button>
        <button className={`rounded-xl px-4 py-2.5 transition ${mode === "register" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-700"}`} type="button" onClick={() => switchMode("register")}>
          Tạo tài khoản
        </button>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={submit}>
        {mode === "register" ? (
          <FormField label="Họ và tên" autoComplete="name" value={fullName} onChange={setFullName} />
        ) : null}
        <FormField label="Email học vụ" type="email" autoComplete="email" value={email} onChange={setEmail} />
        <FormField label="Mật khẩu" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={12} value={password} onChange={setPassword} />

        <button className="mt-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Đang xử lý..." : mode === "register" ? "Tạo tài khoản và gửi email xác minh" : "Đăng nhập"}
        </button>
      </form>

      {mode === "login" ? (
        <button className="mt-4 text-sm font-semibold text-blue-700 transition hover:text-blue-900 disabled:text-slate-400" disabled={isForgotSubmitting} type="button" onClick={requestPasswordReset}>
          {isForgotSubmitting ? "Đang gửi link..." : "Quên mật khẩu? Gửi link đặt lại"}
        </button>
      ) : (
        <p className="mt-4 text-xs leading-5 text-slate-500">Sau khi tạo tài khoản, hệ thống gửi link xác minh qua email. Tài khoản chưa xác minh sẽ không đăng nhập được.</p>
      )}

      {notice ? <Alert tone={notice.type} text={notice.text} /> : null}
      {error ? <Alert tone="error" text={error} /> : null}

      <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
        <TrustItem title="Account toàn cục" description="Không gắn tenant vào account; membership được xử lý ở Phase 3." />
        <TrustItem title="Session an toàn" description="Refresh token dùng HttpOnly cookie, rotation và revoke chain." />
        <TrustItem title="Email verification" description="Link xác minh và reset mật khẩu được gửi qua SMTP hệ thống." />
      </div>
    </section>
  );
}

function FormField(input: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "email" | "password" | "text";
  autoComplete?: string;
  minLength?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {input.label}
      <input
        autoComplete={input.autoComplete}
        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        minLength={input.minLength}
        required
        type={input.type ?? "text"}
        value={input.value}
        onChange={(event) => input.onChange(event.target.value)}
      />
    </label>
  );
}

function Alert({ tone, text }: { tone: Notice["type"] | "error"; text: string }) {
  const classes = {
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  }[tone];

  return <p className={`mt-4 rounded-2xl border p-4 text-sm font-medium ${classes}`}>{text}</p>;
}

function TrustItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 size-2 rounded-full bg-blue-600" />
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-slate-600">{description}</p>
      </div>
    </div>
  );
}
