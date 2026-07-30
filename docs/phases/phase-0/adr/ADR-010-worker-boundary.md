# ADR-010 — Worker Boundary

## Purpose

Khóa ranh giới worker trong modular monolith.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

Worker cần xử lý outbox/retry/notification/file jobs nhưng không được trở thành microservice hoặc owner canonical aggregate.

## Decision

Worker là process riêng dùng chung application/domain modules. Worker không tự mutate canonical business aggregate ngoài use case được phép. Direct SQL chỉ trong ownership cho phép, mặc định M01 outbox claim/dispatch.

## Rationale

- Giữ business rules tập trung trong owning module/use case.
- Tránh bypass authorization/audit/transaction guard.
- Vẫn tách latency/side effect khỏi request path.

## Consequences

- Worker failures cần retry/duplicate delivery evidence.
- Worker logs phải redact secrets/presigned URLs.
- Runtime worker SQL audit ở P0-017/implementation.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| Worker as microservice owner | Vi phạm modular monolith first. |
| Worker direct business table mutation | Bypass owner/use case. |
| Inline all side effects in API | Tăng latency và coupling. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — worker boundary.
- `docs/phase-0/MODULE_DEPENDENCIES.md`
- `docs/phase-0/BUSINESS_INVARIANTS.md`

## Validation Checklist

- Worker not microservice: PASS.
- Direct SQL boundary noted: PASS.

