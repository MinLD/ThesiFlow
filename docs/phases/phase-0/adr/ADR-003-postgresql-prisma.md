# ADR-003 — PostgreSQL + Prisma

## Purpose

Khóa database và ORM baseline.

## Status

ACCEPTED for Phase 0 baseline.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Context

APLP cần FK/unique/check direction, transaction, idempotency, immutable versioning, audit/outbox và integration test bằng PostgreSQL thật.

## Decision

Core database dùng PostgreSQL. ORM dùng Prisma. Migration/evidence dùng PostgreSQL thật, không SQLite substitute.

## Rationale

- PostgreSQL đáp ứng relational integrity và transaction boundary trọng yếu.
- Prisma phù hợp TypeScript app, migration và schema review.
- Real PostgreSQL test evidence cần cho constraint/concurrency claims.

## Consequences

- Không claim DB invariant verified nếu chưa có schema + migration + executed test/evidence.
- Raw SQL chỉ dùng khi có ownership/worker boundary rõ.
- Runtime schema mismatch giữ lại cho P0-017/implementation correction, không sửa trong Phase 0.

## Rejected Alternatives

| Alternative | Rejected Reason |
|---|---|
| SQLite integration tests | Không chứng minh PostgreSQL constraint/concurrency. |
| MongoDB/NoSQL | Không khớp manifest relational integrity. |
| TypeORM/Sequelize | Không phải stack đã khóa. |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — database, manifest, test strategy.
- `docs/phase-0/STACK_LOCK.md`
- `docs/phase-0/DATABASE_MANIFEST_AUDIT.md`
- `docs/phase-0/BUSINESS_INVARIANTS.md`

## Validation Checklist

- PostgreSQL locked: PASS.
- Prisma locked: PASS.
- SQLite evidence rejected: PASS.

