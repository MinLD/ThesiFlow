import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { AuthPanel } from "../auth/AuthPanel";
import { TenantProvider } from "./TenantProvider";
import { TenantDashboard } from "./TenantDashboard";
import type { MembershipListItem, TenantContext } from "./types";
import { createInvitation, listMyMemberships, switchTenantContext } from "./tenancy.api";

vi.mock("../auth/AuthProvider", () => ({
  useAuth: () => authMock,
}));

vi.mock("./tenancy.api", () => ({
  listMyMemberships: vi.fn(),
  switchTenantContext: vi.fn(),
  createOrganization: vi.fn(),
  activateOrganization: vi.fn(),
  createInvitation: vi.fn(),
  acceptInvitation: vi.fn(),
}));

type AuthMock = {
  state: { status: "loading"; account: null } | { status: "unauthenticated"; account: null } | { status: "authenticated"; account: { id: string; email: string; fullName: string; status: string } };
  login: Mock;
  register: Mock;
  forgotPassword: Mock;
  logout: Mock;
  clearAuth: Mock;
};

let authMock: AuthMock;

function membership(input: { id: string; organizationId: string; organizationName: string; canSwitch?: boolean; status?: "invited" | "active" | "inactive" }): MembershipListItem {
  return {
    id: input.id,
    status: input.status ?? "active",
    source: "provisioning",
    canSwitch: input.canSwitch ?? true,
    organization: {
      id: input.organizationId,
      name: input.organizationName,
      slug: input.organizationName.toLowerCase().replaceAll(" ", "-"),
      status: input.canSwitch === false ? "disabled" : "active",
    },
  };
}

function contextFor(item: MembershipListItem): TenantContext {
  return {
    accountId: "account-1",
    organizationId: item.organization.id,
    membershipId: item.id,
    organization: {
      id: item.organization.id,
      name: item.organization.name,
      slug: item.organization.slug,
    },
    membership: {
      id: item.id,
      status: "active",
      source: item.source,
    },
  };
}

function renderWithTenant(children: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}><TenantProvider>{children}</TenantProvider></QueryClientProvider>);
}

beforeEach(() => {
  authMock = {
    state: { status: "authenticated", account: { id: "account-1", email: "user@example.test", fullName: "User One", status: "active" } },
    login: vi.fn(),
    register: vi.fn(),
    forgotPassword: vi.fn(),
    logout: vi.fn(),
    clearAuth: vi.fn(),
  };
  vi.mocked(listMyMemberships).mockReset();
  vi.mocked(switchTenantContext).mockReset();
  vi.mocked(createInvitation).mockReset();
});

describe("TenantDashboard", () => {
  it("does not render authenticated organization UI for unauthenticated users", () => {
    authMock.state = { status: "unauthenticated", account: null };

    renderWithTenant(<AuthPanel />);

    expect(screen.getByText("Đăng nhập hệ thống")).toBeTruthy();
    expect(screen.queryByText("Workspace tổ chức")).toBeNull();
  });

  it("shows empty state when authenticated user has no memberships", async () => {
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });

    renderWithTenant(<TenantDashboard />);

    expect(await screen.findByText("Bạn chưa thuộc tổ chức nào.")).toBeTruthy();
  });

  it("renders active memberships", async () => {
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [membership({ id: "m1", organizationId: "org-a", organizationName: "Org A" })] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });

    renderWithTenant(<TenantDashboard />);

    expect(await screen.findByText("Org A")).toBeTruthy();
    expect(screen.getByText("Organization active")).toBeTruthy();
    expect(screen.getByText("Membership active")).toBeTruthy();
  });

  it("switches tenant context from server response", async () => {
    const orgA = membership({ id: "m1", organizationId: "org-a", organizationName: "Org A" });
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [orgA] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(switchTenantContext).mockResolvedValue({ success: true, data: { tenantContext: contextFor(orgA) }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });

    renderWithTenant(<TenantDashboard />);
    const switchButton = await screen.findByRole("button", { name: "Chọn tổ chức" });
    fireEvent.click(switchButton);

    await waitFor(() => expect(switchTenantContext).toHaveBeenCalledWith({ organizationId: "org-a" }));
    expect(await screen.findByText("Tổng quan tổ chức")).toBeTruthy();
    expect(screen.getByText("Org A")).toBeTruthy();
  });

  it("keeps old/no context when switch fails", async () => {
    const orgA = membership({ id: "m1", organizationId: "org-a", organizationName: "Org A" });
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [orgA] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(switchTenantContext).mockRejectedValue(new Error("Tenant context is not available"));

    renderWithTenant(<TenantDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "Chọn tổ chức" }));

    expect(await screen.findByText("Bạn không thể truy cập tổ chức này.")).toBeTruthy();
    expect(screen.queryByText("Tổng quan tổ chức")).toBeNull();
  });

  it("does not switch inactive memberships", async () => {
    const orgA = membership({ id: "m1", organizationId: "org-a", organizationName: "Org A", canSwitch: false, status: "inactive" });
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [orgA] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });

    renderWithTenant(<TenantDashboard />);
    const switchButton = await screen.findByRole("button", { name: "Chọn tổ chức" });

    expect(switchButton).toHaveProperty("disabled", true);
    expect(switchTenantContext).not.toHaveBeenCalled();
  });

  it("switches between multiple organizations without keeping old context", async () => {
    const orgA = membership({ id: "m1", organizationId: "org-a", organizationName: "Org A" });
    const orgB = membership({ id: "m2", organizationId: "org-b", organizationName: "Org B" });
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [orgA, orgB] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(switchTenantContext)
      .mockResolvedValueOnce({ success: true, data: { tenantContext: contextFor(orgA) }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } })
      .mockResolvedValueOnce({ success: true, data: { tenantContext: contextFor(orgB) }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });

    renderWithTenant(<TenantDashboard />);
    const buttons = await screen.findAllByRole("button", { name: "Chọn tổ chức" });
    fireEvent.click(buttons[0]!);
    expect(await screen.findByText("org-a")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Đổi tổ chức" }));
    const nextButtons = await screen.findAllByRole("button", { name: "Chọn tổ chức" });
    fireEvent.click(nextButtons[1]!);

    expect(await screen.findByText("org-b")).toBeTruthy();
  });

  it("clears tenant context before logout", async () => {
    const orgA = membership({ id: "m1", organizationId: "org-a", organizationName: "Org A" });
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [orgA] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(switchTenantContext).mockResolvedValue({ success: true, data: { tenantContext: contextFor(orgA) }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });

    renderWithTenant(<TenantDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "Chọn tổ chức" }));
    expect(await screen.findByText("Tổng quan tổ chức")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Đăng xuất" }));

    await waitFor(() => expect(authMock.logout).toHaveBeenCalled());
  });

  it("disables switch button during loading to prevent double submit", async () => {
    const orgA = membership({ id: "m1", organizationId: "org-a", organizationName: "Org A" });
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [orgA] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(switchTenantContext).mockReturnValue(new Promise(() => undefined));

    renderWithTenant(<TenantDashboard />);
    const switchButton = await screen.findByRole("button", { name: "Chọn tổ chức" });
    fireEvent.click(switchButton);

    await waitFor(() => expect(switchButton).toHaveProperty("disabled", true));
  });

  it("submits invitation from active tenant workspace", async () => {
    const orgA = membership({ id: "m1", organizationId: "org-a", organizationName: "Org A" });
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [orgA] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(switchTenantContext).mockResolvedValue({ success: true, data: { tenantContext: contextFor(orgA) }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(createInvitation).mockResolvedValue({
      success: true,
      data: { invitation: { id: "inv-1", organizationId: "org-a", email: "member@example.test", status: "pending" } },
      meta: { requestId: "r", correlationId: "c", timestamp: "t" },
    });

    renderWithTenant(<TenantDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "Chọn tổ chức" }));
    fireEvent.change(await screen.findByLabelText("Email thành viên"), { target: { value: "member@example.test" } });
    fireEvent.click(screen.getByRole("button", { name: "Tạo lời mời" }));

    await waitFor(() => expect(createInvitation).toHaveBeenCalledWith("org-a", { email: "member@example.test" }));
    expect(await screen.findByText("Lời mời đã được ghi nhận và đang được gửi.")).toBeTruthy();
  });

  it("shows invitation API errors", async () => {
    const orgA = membership({ id: "m1", organizationId: "org-a", organizationName: "Org A" });
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [orgA] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(switchTenantContext).mockResolvedValue({ success: true, data: { tenantContext: contextFor(orgA) }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(createInvitation).mockRejectedValue(new Error("Email không hợp lệ."));

    renderWithTenant(<TenantDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "Chọn tổ chức" }));
    fireEvent.change(await screen.findByLabelText("Email thành viên"), { target: { value: "member@example.test" } });
    fireEvent.click(screen.getByRole("button", { name: "Tạo lời mời" }));

    expect(await screen.findByText("Email không hợp lệ.")).toBeTruthy();
  });

  it("does not submit malformed invitation email", async () => {
    const orgA = membership({ id: "m1", organizationId: "org-a", organizationName: "Org A" });
    vi.mocked(listMyMemberships).mockResolvedValue({ success: true, data: { memberships: [orgA] }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });
    vi.mocked(switchTenantContext).mockResolvedValue({ success: true, data: { tenantContext: contextFor(orgA) }, meta: { requestId: "r", correlationId: "c", timestamp: "t" } });

    renderWithTenant(<TenantDashboard />);
    fireEvent.click(await screen.findByRole("button", { name: "Chọn tổ chức" }));
    fireEvent.change(await screen.findByLabelText("Email thành viên"), { target: { value: "bad-email" } });
    fireEvent.click(screen.getByRole("button", { name: "Tạo lời mời" }));

    await waitFor(() => expect(createInvitation).not.toHaveBeenCalled());
  });
});
