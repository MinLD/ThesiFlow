# ADR-009 — Immutable Versioning and Version Pinning

## Purpose

Khóa lịch sử chính thức và evidence versioning.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

APLP phải chứng minh đúng phiên bản template, document, submission, rubric, review, evaluation tại thời điểm quyết định.

## Decision

Published/official versions immutable. Business records phải pin exact version: campaign pins template version, submission pins document version, review assignment pins submission/rubric version/reviewer/round.

## Rationale

- Tránh lịch sử bị diễn giải lại bởi “current version”.
- Hỗ trợ audit, appeal, amendment và defense evidence.
- Cho phép amendment workflow thay vì overwrite.

## Consequences

- Không update direct official version/score/result sau lock/finalize.
- Correction cần workflow riêng được source cho phép.
- Test phải chứng minh V2 không làm V1 official pointer đổi.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| Mutable current version lookup | Phá historical evidence. |
| Overwrite finalized evaluation | Phá official history. |
| Review score without rubric version | Không trace được criterion/range. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — versioning, immutable evidence, business invariants.
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/DATABASE_MANIFEST_AUDIT.md`

## Validation Checklist

- Version pinning locked: PASS.
- Amendment instead of overwrite noted: PASS.

