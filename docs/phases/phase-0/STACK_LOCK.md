# APLP Stack Lock

## Purpose

Khóa architecture và technology stack cho APLP Phase 0, xác định vai trò, allowed usage, forbidden usage và phase đưa vào của từng công nghệ. File này ngăn AI/coder sau tự đổi stack theo sở thích, đồng thời phân biệt quyết định đã khóa với exact version chỉ được chốt khi có repository evidence đáng tin cậy.

## Status

DONE for P0-004 — Stack Lock

- Chỉ P0-004 hoàn thành.
- Phase 0 tổng thể vẫn IN_PROGRESS.
- Chưa có Phase 0 sign-off.
- Không được bắt đầu Phase 1 chỉ dựa vào file này.

## Last Updated

2026-07-29 10:15 Asia/Ho_Chi_Minh

## Architecture Lock

- Architecture chính thức: Modular Monolith First.
- API chính là một Express.js modular monolith process.
- Worker là process riêng, dùng chung application/domain modules với API.
- Worker không phải microservice và không tạo distributed service boundary.
- Module phải có boundary, contract và data ownership rõ ràng.
- Cross-module interaction phải đi qua application contract.
- Module không được tùy ý đọc/ghi trực tiếp dữ liệu do module khác sở hữu.
- PostgreSQL là transactional source of truth.
- Critical mutation phải giữ transaction boundary phù hợp và ghi outbox intent khi cần side effect.
- Không dùng microservices trong Core Thesis.

## Technology Decision Matrix

| Layer | Technology | Decision Status | Purpose | Allowed Usage | Forbidden Usage | Introduced Phase |
|---|---|---|---|---|---|---|
| Frontend | Next.js | LOCKED | Web application chính | App routing, UI shell, SSR/SSG/client rendering khi phù hợp | Thay bằng React SPA framework khác; bắt mọi màn hình phải SSR | Phase 1 |
| Frontend | TypeScript | LOCKED | Typed frontend code and contracts | Static typing, shared DTO typing where safe | Dùng TypeScript như runtime validation substitute | Phase 1 |
| Backend | Express.js | LOCKED | API modular monolith | HTTP API, middleware, route/controller/service boundaries | NestJS; distributed service per module | Phase 1 |
| Backend | TypeScript | LOCKED | Typed backend code | Module contracts, DTO types, service typing | Bỏ runtime validation tại trust boundary | Phase 1 |
| Database | PostgreSQL | LOCKED | Transactional source of truth | ACID transaction, constraints, locking, tenant isolation evidence | SQLite for transaction/tenant evidence; adding another core DB for convenience | Phase 1 |
| ORM | Prisma | LOCKED | Schema, migration, CRUD, normal transaction | Prisma schema/migration/client, transaction handling | Raw SQL without reason/test; bypassing ownership contracts | Phase 1 |
| Validation | Zod | LOCKED | Runtime validation and typed contract | Env validation, request/response DTO validation, config validation | TypeScript-only input validation | Phase 1 |
| Object Storage | MinIO/S3-compatible | LOCKED | Private object storage for document flow | Presigned upload/download, tenant-scoped object keys, private buckets | Public object URL, logging presigned URL, proxying large files via Express in normal flow | Phase 10 baseline; local service expected from Phase 1 foundation/deployment baseline |
| Async Boundary | Worker process | LOCKED | Outbox dispatch, notification, cleanup, scheduled jobs, controlled file processing | Poll outbox, execute defined use cases, retry/cleanup | Acting as microservice; changing business state outside defined use case | Phase 1 |
| Unit Test | Vitest or Jest | LOCKED_FAMILY | Unit tests | Use Vitest or Jest; repository currently observes Vitest | Mixing frameworks without reason; no tests for critical invariants | Phase 1 |
| API Integration Test | Supertest | LOCKED | Express API integration tests | HTTP API assertions against app/server | Replacing DB isolation evidence with mocks only | Phase 1 |
| Browser E2E | Playwright | LOCKED_FAMILY | Browser E2E evidence | End-to-end user workflow tests when UI exists | Claiming E2E without browser artifact | Later Phase 6+ evidence; final Phase 13 |
| Local Deployment | Docker/Docker Compose | LOCKED_BASELINE | Local/integration baseline orchestration | Web, API, worker, PostgreSQL, MinIO/S3-compatible baseline | Interpreting Compose as Kubernetes or production platform | Phase 1 |

## Runtime Topology Baseline

- Web → API → PostgreSQL.
- Web → presigned URL → MinIO/S3-compatible storage.
- API → PostgreSQL.
- API business transaction → `outbox_events`.
- Worker → PostgreSQL/outbox → side effects.
- Worker remains a process boundary inside the modular monolith architecture; it is not a microservice.

## Backend Rules

- Backend stack is Express.js + TypeScript.
- API must preserve modular boundaries through route/controller/service/repository/application contract layers.
- Do not introduce NestJS in core.
- Do not create one distributed service per module.
- Critical mutations must use appropriate transaction boundaries.
- Side effects after critical mutations must use transactional outbox where required.
- Request/correlation ID must flow through logs and error envelope.
- Production error response must not expose stack trace.

## Frontend Rules

- Frontend stack is Next.js + TypeScript.
- Web application is the primary client.
- Server rendering may be used when appropriate; no blanket SSR requirement.
- Client rendering is allowed for interactive workflow views.
- Do not replace Next.js with another React SPA framework.
- UI implementation must follow scope freeze: demo screens do not redefine product scope.

## Database and Prisma Rules

- PostgreSQL is the transactional source of truth.
- Prisma is the default ORM for schema, migration, CRUD and normal transaction work.
- Raw SQL is allowed only when constraint, locking, migration or query needs exceed reasonable Prisma capability.
- Every Raw SQL use must have a reason and a test or validation evidence.
- Integration tests proving transaction, constraint or tenant isolation must use PostgreSQL, not SQLite.
- Adding another database to core is forbidden unless change control approves it.

## Worker Rules

- Worker is a separate process, not a microservice.
- Worker shares application/domain modules with API.
- Worker priority order: outbox dispatch, notification, cleanup, scheduled jobs, file processing when a real toolchain exists.
- Worker must execute defined use cases and respect ownership/authorization rules where applicable.
- Worker must not mutate business state outside defined use cases.
- Worker failures must be observable and retry-safe where side effects are involved.

## Object Storage Rules

- Object storage family is MinIO/S3-compatible.
- Buckets must be private.
- Upload/download flow must use presigned URLs.
- Object key must be tenant-scoped.
- Download must re-authorize through API.
- Public object URL is forbidden.
- Presigned URLs and storage credentials must not be logged.
- Large files must not be proxied through Express in the ordinary document flow.

## Validation and Contract Rules

- Zod is the runtime validation standard.
- Trust boundaries must validate runtime input; TypeScript compile-time type is not sufficient.
- Configuration must be validated at application start.
- Request DTO, command DTO and environment contracts should be typed from validation schema where practical.
- Validation errors must use the shared error envelope.

## Testing Stack Rules

- Unit test family: Vitest or Jest; repository currently observes Vitest.
- API integration stack: Supertest.
- Browser E2E stack: Playwright.
- PostgreSQL is required for integration tests that prove transaction, constraint, locking or tenant isolation behavior.
- SQLite must not be used as proof for PostgreSQL-specific behavior.
- Test reports are evidence only when the command output or artifact exists.

## Configuration and Secret Rules

- Configuration must be validated at application start.
- Missing required server configuration must fail fast.
- Secrets must not be hard-coded.
- Secrets must not be committed.
- Public config and server-only config must be separated.
- Source of exact config requirements is the application config schema and deployment environment manifest.

## Logging and Redaction Rules

- Request/correlation ID is required for API request lifecycle.
- Structured logging is required.
- Redact password, access token, refresh/session token, cookie, storage credential, presigned URL and raw secret.
- Do not log the full request body by default.
- Production error response must not expose stack trace.
- Logs are implementation evidence only when logger behavior is tested or inspected.

## Version Lock Policy

- Source of truth locks technology family, not necessarily exact dependency version.
- Exact version must come from `package.json`, workspace manifest, lockfile, Docker image tag, Prisma configuration or repository artifact.
- `package.json` alone does not prove resolved version; `package-lock.json` is the dependency resolution source.
- If repository has no trustworthy exact version, record `TO_BE_LOCKED_IN_PHASE_1`.
- Do not use floating recency labels for dependency decisions.
- Do not upgrade dependency in P0-004.
- Dependency version change after this file requires review and validation.

| Technology | Locked Family | Exact Version | Version Source | Status |
|---|---|---|---|---|
| Node.js runtime | Node.js | `>=22.0.0`; Docker tag `node:22-alpine` observed | `package.json`; `apps/*/Dockerfile` | OBSERVED_PRE_EXISTING |
| npm | npm | `>=10.0.0` | `package.json` | OBSERVED_PRE_EXISTING |
| Next.js | Next.js | `16.2.10` resolved; manifest `^16.2.10` | `package-lock.json`; `apps/web/package.json` | LOCKED |
| React | React | `19.2.7` resolved; manifest `^19.2.7` | `package-lock.json`; `apps/web/package.json` | OBSERVED_PRE_EXISTING |
| TypeScript | TypeScript | `5.9.3` resolved; manifest `^5.9.3` | `package-lock.json`; workspace manifests | LOCKED |
| Express.js | Express.js | `5.2.1` resolved; manifest `^5.2.1` | `package-lock.json`; `apps/api/package.json` | LOCKED |
| PostgreSQL | PostgreSQL | Docker image `postgres:16-alpine`; Prisma provider `postgresql` | `docker-compose.yml`; `apps/api/prisma/schema.prisma` | LOCKED |
| Prisma Client | Prisma | `7.8.0` resolved; manifest `^7.8.0` | `package-lock.json`; `apps/api/package.json` | LOCKED |
| Prisma CLI | Prisma | `7.8.0` resolved; manifest `^7.8.0` | `package-lock.json`; `apps/api/package.json` | LOCKED |
| Prisma PostgreSQL adapter | Prisma adapter | `7.8.0` resolved; manifest `^7.8.0` | `package-lock.json`; `apps/api/package.json` | OBSERVED_PRE_EXISTING |
| Zod | Zod | `4.4.3` resolved; manifest `^4.4.3` | `package-lock.json`; workspace manifests | LOCKED |
| pg | PostgreSQL driver | `8.22.0` resolved; manifest `^8.22.0` | `package-lock.json`; API/worker manifests | OBSERVED_PRE_EXISTING |
| MinIO/S3-compatible server | MinIO/S3-compatible | `TO_BE_LOCKED_IN_PHASE_1` | No repository service/image observed | TO_BE_LOCKED_IN_PHASE_1 |
| S3 SDK/client | S3-compatible client | `TO_BE_LOCKED_IN_PHASE_1` | No S3 client dependency observed | TO_BE_LOCKED_IN_PHASE_1 |
| Worker process | Node.js process | Internal workspace `@thesiflow/worker` version `0.1.0` | `apps/worker/package.json`; root workspaces | OBSERVED_PRE_EXISTING |
| Vitest | Vitest/Jest family | `2.1.9` resolved; manifest `^2.1.8` | `package-lock.json`; `apps/api/package.json` | OBSERVED_PRE_EXISTING |
| Jest | Vitest/Jest family | Not installed | Repository currently selects Vitest | TO_BE_LOCKED_IN_PHASE_1 |
| Supertest | Supertest | `7.2.2` resolved; manifest `^7.0.0` | `package-lock.json`; `apps/api/package.json` | LOCKED |
| Playwright | Playwright | `TO_BE_LOCKED_IN_PHASE_1` | No dependency observed | TO_BE_LOCKED_IN_PHASE_1 |
| Docker Compose | Docker Compose | Compose file observed; exact CLI version not recorded | `docker-compose.yml` | OBSERVED_PRE_EXISTING |
| Tailwind CSS | Tailwind CSS | `4.3.3` resolved; manifest `^4.3.3` | `package-lock.json`; `apps/web/package.json` | OBSERVED_PRE_EXISTING |
| TanStack Query | TanStack Query | `5.101.2` resolved; manifest `^5.101.2` | `package-lock.json`; `apps/web/package.json` | OBSERVED_PRE_EXISTING |
| dotenv | dotenv | `16.6.1` resolved; manifest `^16.4.7` | `package-lock.json`; API/worker manifests | OBSERVED_PRE_EXISTING |

## Deferred and Forbidden Technology

| Technology/Capability | Status | Adoption Trigger | Reason |
|---|---|---|---|
| NestJS | FORBIDDEN_IN_CORE | Formal architecture change approval | Source locks Express.js; NestJS violates backend lock |
| Microservices | FORBIDDEN_IN_CORE | Measured extraction need and change approval after core evidence | Modular Monolith First preserves ACID and thesis simplicity |
| Redis | DEFERRED | Measured queue/cache need beyond PostgreSQL baseline | Not required for core workflow |
| BullMQ | DEFERRED | Redis approved plus queue SLO evidence | Worker/outbox baseline comes first |
| Kafka | DEFERRED | Independent scaling/topology need with evidence | Distributed messaging too early |
| NATS | DEFERRED | Independent scaling/topology need with evidence | Distributed messaging too early |
| Kubernetes | DEFERRED | Operations/topology requires it | Docker Compose local baseline enough for thesis |
| Multi-region architecture | DEFERRED | Availability/data residency requirement | Not graduation demo scope |
| OpenSearch | DEFERRED | PostgreSQL search fails benchmark and M17 approved | Advanced search is optional after core gate |
| Vector database | DEFERRED | M18 approved with evaluation plan | Dedicated AI/RAG infrastructure outside core |
| Dedicated RAG infrastructure | DEFERRED | AI/RAG go decision after Phase 13 | Core workflow takes priority |
| Realtime WebSocket chat infrastructure | FORBIDDEN_IN_CORE | Collaboration scope change approval | M15 is notification, not chat |
| Enterprise SSO/SCIM stack | DEFERRED | Enterprise customer/governance requirement | Core auth/RBAC first |
| Billing stack | DEFERRED | Commercial validation and governance | Not thesis workflow |
| Marketplace/extension ecosystem | DEFERRED | Extension governance and stable APIs | Scope creep risk |

## Repository Observation

Repository inspection is read-only evidence. It does not mark implementation complete.

| Observed Artifact | Observation | Source Alignment | Required Follow-up |
|---|---|---|---|
| `package.json` | Workspaces: `apps/api`, `apps/worker`, `apps/web`; Node `>=22.0.0`; npm `>=10.0.0` | Aligns monorepo baseline | Audit during Phase 1 evidence if runtime continues |
| `apps/web/package.json` | Next.js, React, TypeScript, Zod, Tailwind, TanStack Query observed | Next.js + TypeScript align; UI libs are pre-existing details | Confirm UI dependency policy during implementation review |
| `apps/api/package.json` | Express, Prisma, Zod, pg, Vitest, Supertest observed | Aligns backend/database/test baseline | Verify module boundary and test depth later |
| `apps/worker/package.json` | Worker workspace with TypeScript, pg, Zod, dotenv observed | Aligns worker process baseline | Ensure shared application/domain modules when implemented |
| `package-lock.json` | Resolved versions observed for listed npm dependencies | Supports version evidence | Exact version changes require review |
| `docker-compose.yml` | Services: postgres, api, worker, web; no MinIO service observed | Mostly aligns local baseline; object storage service missing | Add MinIO/S3-compatible baseline only in implementation phase |
| `apps/*/Dockerfile` | Node `22-alpine` images observed for API, web, worker | Aligns Node container baseline | Treat as pre-existing implementation artifact |
| `apps/api/prisma/schema.prisma` | Prisma generator; PostgreSQL provider; runtime tables observed | Aligns PostgreSQL/Prisma family | Schema content audit belongs to P0-008/P0-017 |
| `apps/api/vitest.config.ts` | Vitest configuration observed | Aligns Vitest/Jest family by choosing Vitest | Add broader tests in implementation phases |
| `apps/api/tests` | Existing API tests observed | Aligns test foundation direction | Does not prove full Phase 1 completion |
| Forbidden stack grep | No direct NestJS/Redis/BullMQ/Kafka/NATS/Kubernetes/OpenSearch app dependency observed in workspace manifests | No immediate forbidden dependency in package manifests | Re-check at P0-017; lockfile text can include transitive unrelated names |
| `docs/phase-0/SCOPE_FREEZE.md` | P0-003 scope freeze exists | Aligns Phase 0 order | Continue P0-005 only after P0-004 done |

## Known Mismatches

| ID | Mismatch | Evidence | Handling | Status |
|---|---|---|---|---|
| KM-001 | Runtime code, migration and Docker already exist before Phase 0 sign-off | `git status --short`; app folders and Dockerfiles observed | Preserve; audit at P0-017; do not count as Phase 1 completion | NON_BLOCKING_REVIEW_P0-017 |
| KM-002 | Dependency/runtime currently present is not automatically accepted by Phase 0 | Workspace manifests and lockfile have pre-existing dependencies | Treat as observation until reviewed against source and tests | OPEN |
| KM-003 | Exact versions must be audited from lockfile, not only manifests | Manifest ranges differ from resolved lockfile versions | Use lockfile for resolved dependency evidence | OPEN |
| KM-004 | MinIO/S3-compatible service/client not observed in repository baseline | `docker-compose.yml` and selected dependency inspection show none | Add only in implementation phase after P0 completion | OPEN |
| KM-005 | Playwright not observed in dependency lockfile | Lockfile selected package lookup shows no Playwright package | Introduce later when E2E evidence phase requires it | OPEN |
| KM-006 | Worker workspace exists before Phase 0 sign-off | `apps/worker/*` observed | Preserve as pre-existing artifact; audit boundary at P0-017 | NON_BLOCKING_REVIEW_P0-017 |

If NestJS, Redis, Kafka or another forbidden technology is later found, record mismatch first; do not delete or rewrite runtime code in Phase 0.

## Change Control

Every stack change after this lock requires this record:

| Change ID | Requested Technology Change | Reason | Current Technology | Proposed Technology | Architecture Impact | Database Impact | Security Impact | Test Impact | Operations Impact | Migration Cost | Rollback Plan | Approval Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| STACK-CHG-TEMPLATE | Describe requested stack change | Why change is needed | Current locked/observed stack | Proposed stack | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | Low/Medium/High | Required rollback | NEEDS_APPROVAL |

No stack change may be made by silently editing code, manifests, Docker files or lockfiles.

## Validation Checklist

| Check | Result | Evidence |
|---|---|---|
| Modular Monolith First được khóa | PASS | Architecture Lock |
| Express.js + TypeScript được khóa | PASS | Technology Decision Matrix; Backend Rules |
| Next.js + TypeScript được khóa | PASS | Technology Decision Matrix; Frontend Rules |
| PostgreSQL + Prisma được khóa | PASS | Technology Decision Matrix; Database and Prisma Rules |
| Zod được khóa | PASS | Technology Decision Matrix; Validation and Contract Rules |
| MinIO/S3-compatible được khóa | PASS | Technology Decision Matrix; Object Storage Rules |
| Worker boundary được mô tả | PASS | Architecture Lock; Runtime Topology; Worker Rules |
| Vitest/Jest, Supertest, Playwright được ghi đúng | PASS | Testing Stack Rules; Version Lock Policy |
| Integration test dùng PostgreSQL thật | PASS | Testing Stack Rules |
| NestJS bị cấm trong core | PASS | Deferred and Forbidden Technology |
| Microservices bị cấm trong core | PASS | Architecture Lock; Deferred and Forbidden Technology |
| Redis/BullMQ/Kafka/NATS/Kubernetes không thuộc core | PASS | Deferred and Forbidden Technology |
| Exact versions không bị bịa | PASS | Version table uses package-lock, manifests, Docker tags, Prisma config or `TO_BE_LOCKED_IN_PHASE_1` |
| Không dùng recency label để khóa dependency | PASS | Version policy avoids floating recency labels |
| Không sửa runtime code | PASS | P0-004 writes docs only |
| Không tạo P0-005 artifact | PASS | `docs/phase-0/MODULE_BOUNDARIES.md` absent during validation |
| Không tuyên bố hoàn tất toàn Phase 0 | PASS | Status limits completion to P0-004 only |
| Không chuyển Phase 1 sang started state | PASS | `docs/PROJECT_STATUS.md` keeps Phase 1 in NOT_STARTED state |
| Có Source References | PASS | Source References section |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — Architecture decision: Modular Monolith First.
- `docs/BaoCaoKhoaLuan.docx` — Technology selection: Express.js + TypeScript, Next.js + TypeScript, PostgreSQL + Prisma, Zod, MinIO/S3-compatible.
- `docs/BaoCaoKhoaLuan.docx` — Worker boundary: worker process, outbox and async reliability without Kafka/Redis from start.
- `docs/BaoCaoKhoaLuan.docx` — Security architecture: tenant isolation, authorization, secret/log redaction, production-safe errors.
- `docs/BaoCaoKhoaLuan.docx` — Deployment baseline: web, API, worker, PostgreSQL, MinIO/S3-compatible local baseline.
- `docs/BaoCaoKhoaLuan.docx` — Direct upload architecture: private object storage, presigned URL, tenant-scoped key, re-authorized download.
- `docs/BaoCaoKhoaLuan.docx` — Testing direction: unit/API/E2E/integration evidence and PostgreSQL isolation checks.
- `docs/BaoCaoKhoaLuan.docx` — Phase 0 forbidden scope: no runtime code, migration, route or UI.
- `docs/BaoCaoKhoaLuan.docx` — Phase 1 foundation scope: monorepo, PostgreSQL, worker, outbox, idempotency and test foundation.
- `docs/phase-0/SOURCE_HIERARCHY.md` — source priority, implementation evidence rules and mismatch handling.
- `docs/phase-0/SCOPE_FREEZE.md` — four-layer scope freeze, forbidden core scope and deferred technologies.
