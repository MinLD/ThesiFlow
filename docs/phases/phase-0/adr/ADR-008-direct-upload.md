# ADR-008 — Direct Upload

## Purpose

Khóa upload architecture cho tài liệu học thuật.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

Document flow cần object security, tenant-scoped key, immutable versions và không proxy file lớn qua API trong flow thường.

## Decision

Bytes upload trực tiếp từ web tới MinIO/S3-compatible storage bằng short-lived grant. API tạo/complete upload session, kiểm metadata/checksum/MIME/size/expiry hoặc HEAD evidence.

## Rationale

- Giảm tải backend.
- Giữ object key tenant-scoped và download reauthorization.
- Tách DocumentVersion official evidence khỏi mutable object state.

## Consequences

- Presigned URL không log.
- UploadSession complete chỉ một lần.
- File scanning policy OD-004 chưa tự approve.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| API proxies large files | Tăng tải và complexity không cần thiết. |
| Public object URL | Vi phạm tenant/object security. |
| Complete without metadata verification | Không đủ evidence integrity. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — direct upload, object storage.
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/STACK_LOCK.md`

## Validation Checklist

- Direct upload locked: PASS.
- MinIO/S3-compatible locked: PASS.
- OD-004 remains open: PASS.

