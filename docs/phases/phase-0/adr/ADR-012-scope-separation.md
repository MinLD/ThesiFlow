# ADR-012 — Scope Separation

## Purpose

Khóa bốn lớp scope để tránh trộn product vision, core implementation, demo và roadmap.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

APLP có product vision rộng, nhưng thesis cần vertical slice bảo vệ được. Source đã tách Product Scope, Core Implementation Scope, Demo Scope và Deferred Roadmap.

## Decision

Giữ bốn lớp scope độc lập. Runtime artifact tồn tại sớm không tự biến capability thành CORE. Optional/deferred không vào core nếu không có change control approval.

## Rationale

- Chống scope creep.
- Cho phép traceability rõ giữa FR/API/UI/DB/phase/test.
- Giữ Search/AI, enterprise integration, microservices, realtime, billing ngoài core.

## Consequences

- Phase 1 chỉ làm foundation primitives.
- THESIS demo slice cần P0-016 handoff, không mở toàn product vision.
- Change control bắt buộc khi đổi priority/owner/phase/classification.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| Treat product vision as implementation scope | Quá rộng, không bảo vệ được. |
| Treat demo data as product requirement | Gây sai baseline. |
| Promote optional/deferred silently | Vi phạm change control. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — four scope layers, roadmap.
- `docs/phase-0/SCOPE_FREEZE.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`

## Validation Checklist

- Four-scope separation locked: PASS.
- Deferred roadmap preserved: PASS.

