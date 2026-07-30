# ADR-011 — Search and AI Deferred

## Purpose

Khóa M17 Search và M18 AI/RAG là optional gated capability.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

Search/AI hữu ích nhưng không thuộc core thesis implementation trước khi workflow chính có evidence. Source cấm OpenSearch/vector DB/dedicated RAG infrastructure trong core.

## Decision

M17 Search và M18 AI/RAG giữ OPTIONAL, chỉ xét sau Phase 13 go/no-go. Search index/read model không là canonical owner. AI advisory-only, không mutate state hoặc bypass authorization.

## Rationale

- Bảo vệ scope và evidence trọng yếu.
- Tránh hạ chất lượng core workflow vì tính năng phụ.
- Giữ permission-aware requirement nếu mở gate sau này.

## Consequences

- Không tạo search/AI runtime trong Phase 0–13 core.
- OD-008/OD-009 cần approval sau Phase 13.
- Any optional/deferred table không được promote thành CORE không approval.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| Search in core | Source scope cấm trước Phase 13 gate. |
| AI scoring/finalize | AI không được mutate/chấm điểm/quyết định. |
| Vector DB in core | Deferred infrastructure. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — AI/RAG, deferred roadmap.
- `docs/phase-0/SCOPE_FREEZE.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`

## Validation Checklist

- Search optional gate: PASS.
- AI advisory-only: PASS.

