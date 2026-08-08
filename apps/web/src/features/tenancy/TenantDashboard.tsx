"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { activateOrganization, createInvitation, createOrganization } from "./tenancy.api";
import { useTenant } from "./TenantProvider";
import type { MembershipListItem } from "./types";

export function TenantDashboard() {
  const auth = useAuth();
  const tenant = useTenant();
  const [showSelector, setShowSelector] = useState(false);

  if (auth.state.status !== "authenticated") {
    return null;
  }

  async function logout() {
    tenant.clearTenantContext();
    await auth.logout();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">ThesiFlow</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Workspace tổ chức</h2>
          <p className="mt-1 text-sm text-slate-600">Tài khoản: {auth.state.account.email}</p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            Đang làm việc tại: {tenant.activeContext ? tenant.activeContext.organization.name : "Chưa chọn tổ chức"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tenant.activeContext ? (
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100" type="button" onClick={() => setShowSelector((current) => !current)}>
              Đổi tổ chức
            </button>
          ) : null}
          <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100" type="button" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-6">
        {tenant.state === "loading" ? <StateMessage title="Đang tải tổ chức..." /> : null}
        {tenant.error ? <StateMessage tone="error" title="Bạn không thể truy cập tổ chức này." description={tenant.error} /> : null}
        {!tenant.activeContext || showSelector ? <TenantSelector onSelected={() => setShowSelector(false)} /> : null}
        {tenant.activeContext && tenant.state !== "selecting" ? <OrganizationWorkspace /> : null}
        {tenant.state === "selecting" ? <StateMessage title="Đang chuyển tổ chức..." /> : null}
        <OrganizationCreateForm />
      </div>
    </section>
  );
}

function TenantSelector({ onSelected }: { onSelected: () => void }) {
  const tenant = useTenant();

  if (tenant.memberships.length === 0 && tenant.state !== "loading") {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <h3 className="text-base font-bold text-slate-950">Bạn chưa thuộc tổ chức nào.</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">Bạn cần nhận lời mời từ tổ chức hoặc tạo tổ chức mới nếu được backend cho phép.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h3 className="text-base font-bold text-slate-950">Chọn tổ chức</h3>
      <div className="mt-4 grid gap-3">
        {tenant.memberships.map((membership) => (
          <MembershipCard key={membership.id} membership={membership} onSelected={onSelected} />
        ))}
      </div>
    </div>
  );
}

function MembershipCard({ membership, onSelected }: { membership: MembershipListItem; onSelected: () => void }) {
  const tenant = useTenant();
  const [isActivating, setIsActivating] = useState(false);
  const canActivate = membership.organization.status === "disabled" && membership.status === "inactive" && membership.source === "provisioning";
  const isSwitching = tenant.switchingOrganizationId === membership.organization.id;

  async function selectOrganization() {
    await tenant.switchToOrganization(membership.organization.id);
    onSelected();
  }

  async function activate() {
    setIsActivating(true);
    try {
      await activateOrganization(membership.organization.id);
      await tenant.refreshMemberships();
      await tenant.switchToOrganization(membership.organization.id);
      onSelected();
    } finally {
      setIsActivating(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="break-words text-sm font-bold text-slate-950">{membership.organization.name}</h4>
          <p className="mt-1 break-words text-sm text-slate-600">{membership.organization.slug}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
            <StatusBadge label={`Organization ${membership.organization.status}`} />
            <StatusBadge label={`Membership ${membership.status}`} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canActivate ? (
            <button className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isActivating} type="button" onClick={activate}>
              {isActivating ? "Đang kích hoạt..." : "Kích hoạt tổ chức"}
            </button>
          ) : null}
          <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={!membership.canSwitch || isSwitching} type="button" onClick={selectOrganization}>
            {isSwitching ? "Đang chuyển..." : "Chọn tổ chức"}
          </button>
        </div>
      </div>
    </article>
  );
}

function OrganizationWorkspace() {
  const tenant = useTenant();
  const context = tenant.activeContext;
  if (!context) {
    return null;
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-lg font-bold text-slate-950">Tổng quan tổ chức</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoItem label="Tên" value={context.organization.name} />
          <InfoItem label="Slug" value={context.organization.slug} />
          <InfoItem label="Organization ID" value={context.organizationId} />
          <InfoItem label="Membership" value={context.membership.status} />
        </dl>
        <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">Phase 3 đã sẵn sàng. Các chức năng quyền chi tiết sẽ được bổ sung ở Phase 4+.</p>
      </div>
      <InvitationForm organizationId={context.organizationId} />
    </div>
  );
}

function OrganizationCreateForm() {
  const tenant = useTenant();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await createOrganization({ name, slug });
      setMessage(`Đã tạo ${response.data.organization.name}. Trạng thái hiện tại: ${response.data.organization.status}.`);
      setName("");
      setSlug("");
      await tenant.refreshMemberships();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể tạo tổ chức.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-2xl border border-slate-200 p-5" onSubmit={submit}>
      <h3 className="text-base font-bold text-slate-950">Tạo tổ chức</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextField label="Tên tổ chức" value={name} onChange={setName} />
        <TextField label="Slug" pattern="[a-z0-9-]{3,80}" value={slug} onChange={setSlug} />
      </div>
      <button className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Đang tạo..." : "Tạo tổ chức"}
      </button>
      {message ? <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}

function InvitationForm({ organizationId }: { organizationId: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);
    try {
      await createInvitation(organizationId, { email });
      setEmail("");
      setMessage("Lời mời đã được ghi nhận và đang được gửi.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể tạo lời mời.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="rounded-2xl border border-slate-200 p-5" onSubmit={submit}>
      <h3 className="text-base font-bold text-slate-950">Mời thành viên</h3>
      <div className="mt-4">
        <TextField label="Email thành viên" type="email" value={email} onChange={setEmail} />
      </div>
      <button className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Đang tạo lời mời..." : "Tạo lời mời"}
      </button>
      {message ? <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-950">{value}</dd>
    </div>
  );
}

function TextField(input: { label: string; value: string; onChange: (value: string) => void; type?: "email" | "text"; pattern?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {input.label}
      <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" pattern={input.pattern} required type={input.type ?? "text"} value={input.value} onChange={(event) => input.onChange(event.target.value)} />
    </label>
  );
}

function StatusBadge({ label }: { label: string }) {
  return <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">{label}</span>;
}

function StateMessage({ title, description, tone = "info" }: { title: string; description?: string; tone?: "info" | "error" }) {
  const classes = tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-blue-200 bg-blue-50 text-blue-800";
  return <div className={`rounded-2xl border p-4 text-sm ${classes}`}><p className="font-semibold">{title}</p>{description ? <p className="mt-1">{description}</p> : null}</div>;
}
