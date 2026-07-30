# ADR-002 — Express.js + TypeScript Backend

## Purpose

Khóa backend application stack.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

Backend cần API rõ, validation Zod, policy authorization, transaction orchestration và worker reuse application/domain modules.

## Decision

Backend core dùng Express.js + TypeScript. Không dùng NestJS trong core thesis.

## Rationale

- Express đủ cho REST API catalog 91 route.
- TypeScript hỗ trợ contract, DTO, service/repository typing.
- Ít framework magic, dễ giải thích trong báo cáo và kiểm thử Supertest.
- Tránh NestJS boilerplate cho thesis slice.

## Consequences

- Route/controller/service/repository phải giữ module boundary.
- Validation dùng Zod tại trust boundary.
- Error contract khóa ở P0-012 trước implementation hardening.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| NestJS | Bị scope lock cấm; tăng abstraction không cần thiết. |
| Fastify | Không phải stack đã khóa trong source. |
| Next.js API only | Không khớp backend Express baseline và worker sharing plan. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — technology baseline.
- `docs/phase-0/STACK_LOCK.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`

## Validation Checklist

- Express.js + TypeScript locked: PASS.
- NestJS forbidden: PASS.

