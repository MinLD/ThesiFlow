# ADR-006 — Transactional Outbox

## Purpose

Khóa reliability pattern cho side effects.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

Critical business mutations cần audit/notification/event intent không mất khi transaction thành công. Worker dispatch sau commit, không sở hữu aggregate.

## Decision

Critical business mutation và outbox event intent phải ghi trong cùng PostgreSQL transaction. Worker chỉ claim/dispatch `outbox_events` sau commit.

## Rationale

- Tránh best-effort event sau commit làm mất side effect intent.
- Cho retry/duplicate delivery có kiểm soát.
- Giữ audit khác outbox: audit là lịch sử, outbox là delivery intent.

## Consequences

- Consumer phải idempotent.
- Outbox không thay audit.
- Worker SQL direct chỉ giới hạn trong M01 outbox ownership.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| Best-effort publish after commit | Có thể mất event. |
| Kafka/NATS core | Deferred; quá scope. |
| Notification inline blocking transaction | Side-effect failure không được làm mất business state hợp lệ. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — transactional outbox, worker boundary.
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/DATABASE_MANIFEST_AUDIT.md`

## Validation Checklist

- Outbox atomicity locked: PASS.
- Worker boundary preserved: PASS.

