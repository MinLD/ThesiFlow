# ADR-004 — Global Account and TenantMembership

## Purpose

Khóa invariant identity/tenancy cốt lõi.

## Status

ACCEPTED for Phase 0 baseline. Runtime mismatch recorded; not fixed here.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

Source yêu cầu account là danh tính toàn cục, tenant context sinh từ active membership. P0-008/P0-009 ghi mismatch `users.tenant_id` trong runtime hiện có.

## Decision

`Account` không có `tenantId`. Một account có thể có nhiều `TenantMembership`. Quyền trong organization không đến từ account global mà từ active membership + role/scope.

## Rationale

- Tránh khóa identity vào một tenant.
- Hỗ trợ multi-organization academic membership.
- Giữ tenant isolation và authorization đúng nguồn.

## Consequences

- Runtime `users.tenant_id` là violation/structure mismatch cần correction plan sau Phase 0.
- JWT/session không được biến `tenantId` client-provided thành trusted context.
- Query tenant-owned phải scope qua membership/resource path.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| User belongs to one tenant by `tenant_id` | Vi phạm global account invariant. |
| Tenant from request body/query | Không trusted; rủi ro cross-tenant/IDOR. |
| Role stored directly on account | Không đủ tenant/scope/history. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — multi-tenant, identity, permission matrix.
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/DATABASE_MANIFEST_AUDIT.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`

## Validation Checklist

- Global account invariant locked: PASS.
- Runtime mismatch recorded: PASS.
- No schema change made: PASS.

