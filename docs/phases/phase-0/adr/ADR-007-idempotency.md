# ADR-007 — Scoped Idempotency

## Purpose

Khóa idempotency direction cho command quan trọng.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

Approval, upload complete, submission, finalize và mutation có retry/concurrency không được tạo duplicate side effect.

## Decision

Idempotency key phải scope theo tenant/account/operation phù hợp. Cùng key với payload khác trả conflict. Retry cùng payload trả kết quả tương thích, không tạo duplicate.

## Rationale

- Bảo vệ business intent khi network retry.
- Tránh global key collision thiếu tenant/account scope.
- Bổ sung nhưng không thay concurrency guard.

## Consequences

- Critical POST cần idempotency direction trong API/error/evidence plan.
- Still cần unique/lock/compare-and-set cho concurrent approval.
- `idempotency_records` thuộc M01.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| No idempotency | Retry có thể duplicate project/version/event. |
| Global idempotency key | Cross-tenant/account collision. |
| Idempotency as concurrency substitute | Không đủ cho race concurrent distinct requests. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — idempotency, transaction/concurrency.
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`

## Validation Checklist

- Scoped idempotency locked: PASS.
- Concurrency non-substitution noted: PASS.

