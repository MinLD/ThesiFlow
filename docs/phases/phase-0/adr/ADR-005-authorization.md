# ADR-005 — Deny-by-Default Authorization

## Purpose

Khóa authorization model cho protected resources.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

APLP authorization cần tenant, role, scope, relationship, state và classification. M04 sở hữu permission/scope policy; business module sở hữu resource state/relationship.

## Decision

Authorization deny-by-default. Protected action chỉ allow khi đủ tenant context, permission, scope, relationship và state guard.

## Rationale

- Ngăn privilege escalation, IDOR, cross-tenant access.
- Không biến UI role-aware thành backend authorization.
- Không biến M04 thành owner của business relationship.

## Consequences

- Mỗi API protected cần permission/error direction ở P0-012 và test evidence ở P0-013.
- Revoked membership/role phải mất hiệu lực theo request mới.
- Missing policy chi tiết ghi `NEEDS_APPROVAL` hoặc `NEEDS_P0-012_OR_IMPLEMENTATION_DETAIL`.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| Allow by default | Không an toàn cho multi-tenant. |
| Role-only authorization | Thiếu resource relationship/state. |
| Frontend-only permission | Backend vẫn là authority. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — RBAC/resource authorization, permission matrix.
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/MODULE_BOUNDARIES.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`

## Validation Checklist

- Deny-by-default locked: PASS.
- M04 boundary preserved: PASS.

