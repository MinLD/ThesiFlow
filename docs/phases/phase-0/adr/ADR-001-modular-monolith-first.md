# ADR-001 — Modular Monolith First

## Purpose

Khóa kiểu kiến trúc triển khai core thesis cho APLP.

## Status

ACCEPTED for Phase 0 baseline. Không chứng minh runtime đã hoàn tất.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

APLP cần workflow học thuật có transaction, authorization theo tenant/resource/state, version evidence và audit. Scope khóa luận cần bảo vệ được bằng vertical slice thay vì phân tán effort vào distributed operations.

## Decision

APLP core dùng modular monolith first: một backend Express.js + TypeScript, module boundary rõ, PostgreSQL transaction chung, worker process riêng nhưng không là microservice.

## Rationale

- Giữ consistency transaction/concurrency cho Topic, Project, Document, Review, Evaluation.
- Giảm complexity vận hành so với microservices/Kafka/Kubernetes.
- Phù hợp Phase 1–13 và evidence strategy trong khóa luận.
- Vẫn cho phép tách service sau khi có load, team, ownership, observability và contract maturity.

## Consequences

- Module boundary enforce bằng package/import rule, repository ownership, ADR và audit.
- Cross-module mutation đi qua use case/orchestrator owning transaction.
- Runtime hiện có phải audit lại ở P0-017/implementation, không tự được xem là đúng boundary.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| Microservices first | Tăng distributed transaction, deployment, observability, test complexity quá scope thesis. |
| Event-driven core with Kafka/NATS | Không cần cho core; outbox đủ cho side effect/retry. |
| Big ball of mud monolith | Không bảo vệ module/data ownership, khó audit. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — architecture, roadmap, deferred infrastructure.
- `docs/phase-0/STACK_LOCK.md`
- `docs/phase-0/MODULE_BOUNDARIES.md`
- `docs/phase-0/MODULE_DEPENDENCIES.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`

## Validation Checklist

- Modular monolith locked: PASS.
- Microservices/Kafka/Kubernetes deferred: PASS.
- Phase 1 not started: PASS.

