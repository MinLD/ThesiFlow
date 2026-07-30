# APLP Module Dependency Audit

## Purpose

Audit hướng dependency giữa M01–M18, phân biệt dependency hợp lệ/bị cấm, ghi nhận runtime import/Prisma/SQL hiện có, nhận diện circular-risk và worker boundary risk. Artifact này chuẩn bị đầu vào cho P0-008 Database Manifest Audit và P0-017 Consistency Audit; không sửa source/runtime.

## Status

DONE for P0-007 — Dependency Audit

- Chỉ P0-007 hoàn thành.
- Phase 0 tổng thể vẫn IN_PROGRESS.
- Chưa có Phase 0 sign-off.
- P0-008 chưa được thực hiện.
- Audit này không tự sửa runtime violations.
- Không tuyên bố dependency graph được chứng minh sạch chu kỳ hoàn toàn; chỉ ghi nhận phạm vi inspection cụ thể.

## Last Updated

2026-07-29 11:12 Asia/Ho_Chi_Minh

## Dependency Principles

1. Dependency direction đi từ consumer đến public contract của provider.
2. Không import controller, route, Prisma repository nội bộ, private service, internal domain entity hoặc implementation-specific helper của module khác.
3. Public contract không expose Prisma model, Express `Request`/`Response`, Next.js type, database client hoặc repository implementation.
4. Module không dùng Prisma trực tiếp để mutate table do module khác sở hữu.
5. Cross-module mutation phải đi qua application command, owning module use case, orchestrated transaction có owner hoặc event-after-commit khi mutation không cần đồng bộ.
6. Cross-module read dùng application query, read model, identifier reference hoặc permission-filtered query contract.
7. Event không được dùng để né transaction cần tính nguyên tử.
8. Outbox lưu event intent trong business transaction; worker dispatch sau commit; outbox không thay thế invariant đồng bộ.
9. Audit ghi cùng critical mutation khi cần; audit không thay outbox; M16 không sở hữu aggregate đang được audit.
10. M04 sở hữu permission/scope policy primitives; module nghiệp vụ sở hữu resource state và relationship context.
11. Worker không phải microservice, dùng chung application/domain modules, không chạy SQL mutate business state ngoài owning use case.
12. M17/M18 chỉ đọc qua permission-aware contract, không mutate business state, không thành dependency bắt buộc của M01–M16.

## Dependency Types

| Type | Meaning | Synchronous | Mutation Allowed |
|------|---------|-------------|------------------|
| APPLICATION_COMMAND | Gọi use case của owning module | Có thể | Chỉ owning module |
| APPLICATION_QUERY | Query public contract | Có thể | Không |
| DOMAIN_POLICY | Dùng policy contract | Có thể | Không trực tiếp |
| IDENTIFIER_REFERENCE | Giữ ID tham chiếu | N/A | Không |
| READ_MODEL | Đọc projection/snapshot | Có thể | Không |
| EVENT_AFTER_COMMIT | Side effect sau commit | Không | Qua consumer use case nếu cần |
| SHARED_FOUNDATION | Dùng primitive M01 | Có thể | Chỉ primitive |
| FORBIDDEN_INTERNAL_IMPORT | Import implementation nội bộ | N/A | Bị cấm |
| FORBIDDEN_CROSS_MODULE_WRITE | Ghi table module khác | N/A | Bị cấm |

## Expected Dependency Graph

| Consumer | Provider | Capability | Expected Type | Required? | Notes |
|---|---|---|---|---|---|
| M01 Platform/Foundation | none | Foundation primitives | N/A | Yes | M01 không phụ thuộc business module. |
| M02 Identity | M01 Platform/Foundation | request context, config, idempotency/audit/outbox primitives | SHARED_FOUNDATION | Yes | Identity vẫn giữ Account global; không lấy tenant authority từ M03. |
| M03 Tenancy | M02 Identity | authenticated account context | APPLICATION_QUERY | Yes | Tenant context bắt đầu từ account đã xác thực. |
| M03 Tenancy | M01 Platform/Foundation | config/idempotency/outbox primitives | SHARED_FOUNDATION | Yes | Membership lifecycle cần audit/outbox khi critical. |
| M04 Authorization | M02 Identity | account identifier | IDENTIFIER_REFERENCE | Yes | Không xử lý credential/session. |
| M04 Authorization | M03 Tenancy | membership/tenant context | APPLICATION_QUERY | Yes | Role assignment dựa trên active membership. |
| M05 Academic Organization | M03 Tenancy | tenant boundary | IDENTIFIER_REFERENCE | Yes | Academic units thuộc organization. |
| M05 Academic Organization | M04 Authorization | scoped authorization | DOMAIN_POLICY | Yes | Mutation hierarchy cần permission. |
| M06 Academic Profiles | M02 Identity | account reference | IDENTIFIER_REFERENCE | Yes | Profile không thay credential. |
| M06 Academic Profiles | M03 Tenancy | membership context | APPLICATION_QUERY | Yes | Profile gắn membership/tenant. |
| M06 Academic Profiles | M05 Academic Organization | academic unit read model | APPLICATION_QUERY | Yes | Placement tham chiếu unit. |
| M06 Academic Profiles | M04 Authorization | profile authorization | DOMAIN_POLICY | Yes | Visibility theo tenant/scope/relationship. |
| M07 Campaign | M05 Academic Organization | academic unit context | APPLICATION_QUERY | Yes | Campaign scope/eligibility. |
| M07 Campaign | M06 Academic Profiles | profile/placement context | APPLICATION_QUERY | Yes | Participant snapshot. |
| M07 Campaign | M04 Authorization | campaign authorization | DOMAIN_POLICY | Yes | Coordinator/admin mutations. |
| M08 Topic | M07 Campaign | campaign state/policy | APPLICATION_QUERY | Yes | Proposal phải trong campaign hợp lệ. |
| M08 Topic | M04 Authorization | topic permission | DOMAIN_POLICY | Yes | Approve/reject/request changes. |
| M09 Project | M07 Campaign | campaign policy/participant | APPLICATION_QUERY | Yes | Registration eligibility. |
| M09 Project | M08 Topic | approved CampaignTopic | APPLICATION_QUERY | Yes | Project không sửa TopicDecision. |
| M09 Project | M06 Academic Profiles | member profile context | APPLICATION_QUERY | Yes | Team/supervisor validation. |
| M09 Project | M04 Authorization | project authorization | DOMAIN_POLICY | Yes | Relationship/state context do M09 cung cấp. |
| M10 Work Progress | M09 Project | project relationship | APPLICATION_QUERY | Yes | Milestone/update gắn Project. |
| M10 Work Progress | M04 Authorization | progress permission | DOMAIN_POLICY | Yes | Actor visibility/mutation guard. |
| M11 Documents | M09 Project | project relationship | APPLICATION_QUERY | Yes | Document belongs to Project. |
| M11 Documents | M04 Authorization | document permission | DOMAIN_POLICY | Yes | Download/upload re-authorize. |
| M11 Documents | M01 Platform/Foundation | presigned flow support, idempotency, outbox | SHARED_FOUNDATION | Yes | M01 is primitive only; object storage belongs M11 flow. |
| M12 Feedback | M09 Project | project relationship | APPLICATION_QUERY | Conditional | Feedback may target Project. |
| M12 Feedback | M11 Documents | document/version target | APPLICATION_QUERY | Conditional | Feedback may target DocumentVersion. |
| M12 Feedback | M04 Authorization | feedback permission | DOMAIN_POLICY | Yes | No realtime chat ownership. |
| M13 Review | M11 Documents | Submission/DocumentVersion target | APPLICATION_QUERY | Yes | Assignment pins Submission. |
| M13 Review | M07 Campaign | rubric/campaign policy context | APPLICATION_QUERY | Conditional | Policy/source may decide rubric setup. |
| M13 Review | M04 Authorization | reviewer permission | DOMAIN_POLICY | Yes | Reviewer relationship still owned by M13 context. |
| M14 Evaluation | M13 Review | review result/read model | APPLICATION_QUERY | Yes | Evaluation consumes submitted/locked reviews. |
| M14 Evaluation | M11 Documents | submission target | APPLICATION_QUERY | Yes | Final result references target. |
| M14 Evaluation | M04 Authorization | finalize/appeal permission | DOMAIN_POLICY | Yes | Quorum/COI policy remains open. |
| M15 Communication/Notification | M01 Platform/Foundation | outbox/event dispatch primitive | EVENT_AFTER_COMMIT | Yes | Notification not synchronous business dependency. |
| M15 Communication/Notification | M01–M14 event producers | action-required events | EVENT_AFTER_COMMIT | Conditional | Consumes events, does not mutate producer aggregate. |
| M16 Audit/Operations | M01–M14 use cases | critical transition evidence | EVENT_AFTER_COMMIT / SHARED_FOUNDATION | Yes | Audit records evidence; no business aggregate ownership. |
| M17 Search | M04 + provider modules | permission-filtered read contracts | READ_MODEL | Optional | After Phase 13 gate only. |
| M18 AI/RAG | M04/M17/provider modules | permission-aware retrieval/advisory context | READ_MODEL | Optional | Advisory-only after Phase 13 gate. |

## Allowed Dependency Matrix

| Consumer | Allowed Providers | Allowed Contract Types | Reason |
|---|---|---|---|
| M01 | none; platform libraries | SHARED_FOUNDATION internal only | Foundation must stay business-free. |
| M02 | M01 | SHARED_FOUNDATION | Auth lifecycle needs config/logging/idempotency primitives. |
| M03 | M01, M02 | SHARED_FOUNDATION, APPLICATION_QUERY, IDENTIFIER_REFERENCE | Tenant membership starts from authenticated account. |
| M04 | M01, M02, M03 | SHARED_FOUNDATION, APPLICATION_QUERY, IDENTIFIER_REFERENCE, DOMAIN_POLICY | Authorization needs account/membership context. |
| M05 | M01, M03, M04 | SHARED_FOUNDATION, DOMAIN_POLICY, IDENTIFIER_REFERENCE | Academic hierarchy is tenant scoped. |
| M06 | M01, M02, M03, M04, M05 | SHARED_FOUNDATION, APPLICATION_QUERY, DOMAIN_POLICY, IDENTIFIER_REFERENCE | Profile/placement references account, membership and unit. |
| M07 | M01, M04, M05, M06, M16 | SHARED_FOUNDATION, APPLICATION_QUERY, DOMAIN_POLICY, EVENT_AFTER_COMMIT | Campaign uses academic context and emits evidence. |
| M08 | M01, M04, M07, M16 | SHARED_FOUNDATION, APPLICATION_QUERY, DOMAIN_POLICY, EVENT_AFTER_COMMIT | Topic lifecycle depends on campaign state. |
| M09 | M01, M04, M06, M07, M08, M16 | SHARED_FOUNDATION, APPLICATION_QUERY, DOMAIN_POLICY, APPLICATION_COMMAND orchestration | Registration approval creates Project; topic remains provider-owned. |
| M10 | M01, M04, M09, M16 | SHARED_FOUNDATION, APPLICATION_QUERY, DOMAIN_POLICY, EVENT_AFTER_COMMIT | Progress references project relationship. |
| M11 | M01, M04, M09, M16 | SHARED_FOUNDATION, APPLICATION_QUERY, DOMAIN_POLICY, EVENT_AFTER_COMMIT | Documents require project authorization and storage flow. |
| M12 | M01, M04, M09, M11, M16 | SHARED_FOUNDATION, APPLICATION_QUERY, DOMAIN_POLICY, EVENT_AFTER_COMMIT | Feedback targets project or document version. |
| M13 | M01, M04, M07, M11, M16 | SHARED_FOUNDATION, APPLICATION_QUERY, DOMAIN_POLICY, EVENT_AFTER_COMMIT | Review pins submission/rubric versions. |
| M14 | M01, M04, M11, M13, M16 | SHARED_FOUNDATION, APPLICATION_QUERY, DOMAIN_POLICY, EVENT_AFTER_COMMIT | Evaluation consumes review/submission evidence. |
| M15 | M01, event producers M02–M14 | EVENT_AFTER_COMMIT, APPLICATION_QUERY for recipient context | Notification is side-effect consumer, not commit dependency. |
| M16 | M01, event/evidence producers M02–M15 | EVENT_AFTER_COMMIT, SHARED_FOUNDATION | Audit/ops receives evidence and emits no domain mutation. |
| M17 | M04, permission-filtered provider read contracts | READ_MODEL, APPLICATION_QUERY | Optional Search after Phase 13 gate. |
| M18 | M04, M17 optional, permission-filtered provider read contracts | READ_MODEL, APPLICATION_QUERY | Optional AI/RAG advisory after Phase 13 gate. |

## Forbidden Dependency Matrix

| Rule ID | Consumer | Forbidden Provider/Artifact | Violation Example | Risk |
|---|---|---|---|---|
| FDM-001 | M02 Identity | M03 tenant authority | Access token hard-codes `tenantId` as auth truth. | Authentication conflates membership/authorization. |
| FDM-002 | M03 Tenancy | M02 credential/session internals | Tenancy hashes password or rotates refresh token. | Credential leakage and ownership split. |
| FDM-003 | M04 Authorization | all business relationship/state | Authorization owns project supervisor/reviewer relation. | Business guards centralized incorrectly. |
| FDM-004 | M07 Campaign | hard-coded THESIS workflow | Campaign template code branches only for THESIS. | Product scope collapses to one workflow. |
| FDM-005 | M09 Project | M08 TopicDecision write | Registration approval updates `topic_decisions` directly. | Topic evidence corrupted. |
| FDM-006 | M11 Documents | bypass M04 | Download grants object without authorization contract. | Tenant/data leak. |
| FDM-007 | M12 Feedback | M11 DocumentVersion mutation/retarget | Feedback edits pinned target after creation. | Evidence target drift. |
| FDM-008 | M13 Review | M11 Submission mutation | Review assignment changes submission state directly. | Submission immutability violated. |
| FDM-009 | M14 Evaluation | M13 Review mutation | Finalization edits submitted reviews/scores. | Review evidence corrupted. |
| FDM-010 | M15 Notification | any business aggregate mutation | Notification retry changes project/evaluation state. | Side effect becomes business authority. |
| FDM-011 | M16 Audit/Operations | any business aggregate mutation | Audit cleanup updates project/review rows. | Evidence module mutates source data. |
| FDM-012 | Worker | domain aggregate SQL outside owning use case | Worker SQL updates `projects` or `evaluations`. | Bypasses invariants and transactions. |
| FDM-013 | M17/M18 | permission bypass or state mutation | AI reads raw tables or approves proposal. | Security and governance failure. |
| FDM-014 | M01–M16 | M17/M18 | Core module imports Search/AI service. | Optional module becomes required dependency. |
| FDM-015 | Any module | repository/controller/router internals of another module | `project.service` imports `topic.repository`. | Boundary collapse. |
| FDM-016 | Any module | Prisma cross-module write | M13 uses Prisma to update `submissions`. | Ownership violation. |
| FDM-017 | Any module | circular application import | M09 imports M11 service and M11 imports M09 service. | Initialization/runtime cycles. |
| FDM-018 | Any module | shared/common business logic bucket | Policy logic lives in `common` without owner. | Hidden ownership and inconsistent rules. |

## Runtime Repository Inspection

| Observation ID | File/Folder | Observation | Expected Boundary | Status | Follow-up |
|---|---|---|---|---|---|
| RT-001 | `apps/api/src/app.ts` | Composition root imports `common` middleware and health controller/routes. | Composition root may wire public routers/controllers. | ALIGNED | Keep composition-only; avoid business orchestration here. |
| RT-002 | `apps/api/src/modules` | Existing modules are `auth`, `health`, `system`; no M05–M18 runtime modules. | Phase 0 should not create runtime modules; source modules remain design baseline. | NOT_IMPLEMENTED | Implement later by phase order after sign-off. |
| RT-003 | `apps/api/src/common` | Contains auth/token/password, idempotency, logger, middleware, responses, validation. | Shared/common may hold technical primitives only, not ownerless business rules. | NEEDS_DEEPER_AUDIT | P0-017 alignment review; keep future business logic in owner modules. |
| RT-004 | `apps/api/src/modules/auth/auth.repository.ts` | Auth repository imports `../../database/prisma`, queries `prisma.user`, includes tenant/roles/permissions. | M02 Identity should use Account global; M03/M04 context must be via contracts. | POTENTIAL_VIOLATION | P0-017 implementation alignment; later refactor to source manifest. |
| RT-005 | `apps/api/src/common/auth/token.ts` | Access token payload includes `tenantId`. | Authentication must not equal active tenant membership. | POTENTIAL_VIOLATION | P0-017 authorization/tenancy alignment. |
| RT-006 | `apps/api/src/modules/health/health.service.ts` | Health service uses `prisma.$queryRaw\`SELECT 1\`` for readiness. | M01 health/readiness may use DB ping as foundation primitive. | ALIGNED | Keep as foundation/readiness, not domain data access. |
| RT-007 | `apps/api/src/modules/system/system.repository.ts` | System repository queries `prisma.systemInfo`; source manifest uses `system_configurations`, not `system_info`. | M01 owns system configuration/meta; schema alignment not final. | POTENTIAL_VIOLATION | P0-017 schema/runtime alignment. |
| RT-008 | `apps/api/prisma/seed.ts` | Seed writes tenant/user/role/permission/userRole/system rows in one transaction. | Seed is pre-existing implementation artifact; not source proof. | NEEDS_DEEPER_AUDIT | P0-017 seed alignment; do not treat as dependency approval. |
| RT-009 | `apps/worker/src/index.ts` | Worker uses `pg.Pool` and SQL updates `outbox_events` only. | Worker may dispatch M01 outbox; must not mutate business aggregate. | ALIGNED | Limited alignment: only outbox operational fields observed; later worker should call contracts/adapters for real side effects. |
| RT-010 | `apps/web/src` | Web imports local API client/config/health feature only; no backend implementation import observed. | Frontend must not import backend internals. | ALIGNED | Recheck when shared contracts exist. |
| RT-011 | `apps/api/dist`, `apps/web/.next`, `apps/worker/dist` | Build/generated output exists pre-Phase-0. | Generated/runtime artifacts are not Phase 0 evidence. | NEEDS_DEEPER_AUDIT | P0-017 generated artifact policy review. |

## Cross-Module Import Audit

| Importer | Imported Artifact | Provider Module | Public/Internal | Allowed? | Evidence |
|---|---|---|---|---|---|
| `apps/api/src/app.ts` | `./modules/health/health.controller`, `./modules/health/health.routes` | M01 Platform/Foundation equivalent | Public route/controller wiring | Yes, composition root only | `rg` import inspection. |
| `apps/api/src/app.ts` | `./common/middleware/*` | M01 Platform/Foundation | Technical middleware | Yes | Foundation middleware only. |
| `apps/api/src/modules/health/health.controller.ts` | `./health.service` | Same health/foundation module | Internal same-module | Yes | Same folder. |
| `apps/api/src/modules/health/health.routes.ts` | `./health.controller` | Same health/foundation module | Internal same-module | Yes | Same folder. |
| `apps/api/src/modules/health/health.service.ts` | `../../database/prisma` | M01 Platform/Foundation DB adapter | Infrastructure adapter | Yes with limit | DB ping only; no domain table mutation. |
| `apps/api/src/modules/auth/auth.repository.ts` | `../../database/prisma` | M02/M03/M04 mixed runtime schema | Internal DB adapter | Needs deeper audit | Direct Prisma query joins tenant/roles; source wants separated owners. |
| `apps/api/src/modules/system/system.repository.ts` | `../../database/prisma` | M01 Platform/Foundation | Internal DB adapter | Needs deeper audit | Queries `systemInfo`, not source manifest `system_configurations`. |
| `apps/api/src/common/auth/token.ts` | `../../config/env` | M01 Platform/Foundation | Technical config | Yes with warning | Payload includes tenant context; boundary risk recorded. |
| `apps/api/src/database/prisma.ts` | `../generated/prisma/client` | Prisma generated artifact | Internal infrastructure | Yes with generated-artifact warning | Must not be exposed as public module contract. |
| `apps/api/tests/*` | controllers/services/common helpers | Test targets | Test-only internal import | Not production boundary | Tests are pre-existing; not dependency evidence. |
| `apps/web/src/features/health/*` | local web API client | Frontend local | Public HTTP client | Yes | No backend implementation import observed. |
| `apps/worker/src/index.ts` | none first-party | M01 worker runtime | Standalone process entry | Yes with limit | Uses SQL only for outbox table. |

## Prisma and SQL Access Audit

| Caller | Table/Aggregate Accessed | Owning Module | Read/Write | Through Owner Contract? | Status |
|---|---|---|---|---|---|
| `apps/api/src/modules/health/health.service.ts` | DB ping via `SELECT 1` | M01 Platform/Foundation | Readiness read | N/A foundation primitive | ALIGNED |
| `apps/api/src/modules/auth/auth.repository.ts` | `users` runtime table, source equivalent should be `accounts` | M02 Identity | Read | No explicit public owner contract | POTENTIAL_VIOLATION |
| `apps/api/src/modules/auth/auth.repository.ts` | `tenants`, `user_roles`, `roles`, `role_permissions`, `permissions` through include | M03/M04 source-equivalent ownership | Read | No explicit M03/M04 contracts | POTENTIAL_VIOLATION |
| `apps/api/src/modules/system/system.repository.ts` | `system_info` runtime table | M01 Platform/Foundation | Read | Repository internal, source mismatch | NEEDS_DEEPER_AUDIT |
| `apps/api/prisma/seed.ts` | `systemInfo`, `systemConfiguration`, `tenant`, `permission`, `role`, `rolePermission`, `user`, `userRole` | M01/M02/M03/M04 source-equivalent | Write | Seed bypasses module contracts | NEEDS_DEEPER_AUDIT |
| `apps/worker/src/index.ts` | `outbox_events` | M01 Platform/Foundation | Write status/attempt/published fields | Worker foundation path, not business use case | ALIGNED |
| `apps/api/prisma/migrations/*/migration.sql` | runtime schema tables | Multiple source owners | DDL | Pre-existing migration artifact | NEEDS_DEEPER_AUDIT |

## Worker Dependency Audit

| Worker Job | Owning Module | Entry Contract | Direct SQL/Repository Use | Status | Required Fix |
|---|---|---|---|---|---|
| Outbox claim/publish loop | M01 Platform/Foundation | Worker process entry; should later wrap M01 outbox dispatcher contract | Direct SQL on `outbox_events` only | ALIGNED | Extract M01 outbox application contract when implementation phases formalize modules; keep limited to outbox operational fields. |
| Notification delivery | M15 Communication/Notification | Not implemented | None observed | NOT_IMPLEMENTED | Add only after M15/M01 outbox contracts exist. |
| Cleanup/scheduled jobs | M01 or owning module per target | Not implemented | None observed | NOT_IMPLEMENTED | Do not mutate domain tables without owner use case. |
| File processing | M11 Documents | Not implemented | None observed | NOT_IMPLEMENTED | Requires real toolchain and OD-004 decision. |

## Transaction Boundary Audit

| Use Case/Flow | Modules Involved | Transaction Owner | Sync Changes | Outbox/Audit | Risk |
|---|---|---|---|---|---|
| Registration approval → Project creation | M09 with M07/M08/M06/M04/M01/M16 | M09 Project application use case | Registration transition, Project create idempotently, official membership/supervisor if in phase | Audit and outbox in same transaction | Splitting M08 topic mutation into M09 would violate ownership. |
| Upload complete → DocumentVersion | M11 with M09/M04/M01/M16 | M11 Documents use case | UploadSession complete, DocumentVersion immutable metadata | Audit/outbox after complete | Direct object-store callback must not bypass authorization/checksum guards. |
| Submission creation → version pin | M11 with M09/M04/M16 | M11 Documents use case | Submission pins DocumentVersion and requirement attempt | Audit/outbox for official submission | Retargeting version after submit corrupts evidence. |
| Review submission | M13 with M11/M07/M04/M16 | M13 Review use case | Review/ReviewScore submit/lock against pinned assignment | Audit/outbox for submitted review | M13 must not mutate M11 Submission. |
| Evaluation finalize | M14 with M13/M11/M04/M16 | M14 Evaluation use case | Evaluation finalized once guard/quorum/COI policy passes | Audit/outbox for final result | Policy open decisions can affect Phase 12 implementation. |
| Evaluation amendment | M14 with M16/M04 | M14 Evaluation use case | Append EvaluationAmendment, do not directly rewrite finalized evidence | Audit mandatory | Direct evaluation rewrite violates append-only rule. |
| Critical notification/audit event | Owning module + M01/M15/M16 | Owning module for business commit; M15 after commit | Business mutation remains synchronous in owner | Outbox intent and audit evidence recorded with transaction where needed | Synchronous notification coupling can break business commit. |

## Circular Dependency Analysis

| Cycle ID | Modules | Type | Evidence | Impact | Resolution Direction |
|---|---|---|---|---|---|
| CYCLE-001 | Existing runtime module folders | NO_CYCLE_OBSERVED | `rg` found no production import from one `apps/api/src/modules/*` folder into a different module folder. | No direct runtime module cycle observed. | Re-run when M05–M18 are implemented. |
| CYCLE-002 | M02/M03/M04 runtime auth schema | LOGICAL_CYCLE_RISK | `auth.repository.ts` reads user + tenant + role graph in one repository. | Identity/Tenancy/Authorization boundaries may become coupled. | Split public contracts and source-aligned owners in implementation phases. |
| CYCLE-003 | M01 common/shared primitives | IMPORT_CYCLE_RISK | `common` is imported by app/middleware/tests; currently no reverse import seen. | Could become god module if business rules move there. | Keep common technical-only; move business policy to owners. |
| CYCLE-004 | Worker/outbox | NO_CYCLE_OBSERVED | Worker imports no first-party app modules and updates only `outbox_events`. | No import cycle; contract absence remains design debt. | Introduce M01 outbox dispatcher contract later. |
| CYCLE-005 | Future M17/M18 | NOT_IMPLEMENTED | No Search/AI runtime imports observed. | Optional modules not coupled yet. | Keep after Phase 13 gate and permission-filtered read contracts. |

No direct cycle observed in inspected artifacts. This does not prove the dependency graph is fully sạch chu kỳ because most source modules are not implemented yet.

## Dependency Risk Register

| Risk ID | Risk | Probability | Impact | Phase to Resolve | Owner |
|---|---|---|---|---|---|
| DEP-R01 | `shared/common` becomes god module with business rules. | Medium | High | P0-017 and implementation phases | Architecture owner |
| DEP-R02 | Cross-module Prisma write bypasses owning use case. | Medium | High | P0-017 / each implementation phase | Module owners |
| DEP-R03 | Authorization centralizes business relationship/state. | Medium | High | Phase 4 onward | M04 + domain owners |
| DEP-R04 | Worker bypasses application use case for domain aggregate. | Low now, Medium later | High | Phase 13 / P0-017 | M01/M15/M11 owners |
| DEP-R05 | Circular application imports appear after M05–M18 implementation. | Medium | Medium | P0-017 and code review | Staff TS engineer |
| DEP-R06 | M17/M18 become required dependencies of core modules. | Low now | High | Phase 13 gate | Architect |
| DEP-R07 | Synchronous notification blocks business commit. | Medium | Medium | Phase 13 | M15/M01 owners |
| DEP-R08 | Transaction split across modules loses atomicity. | Medium | High | Phase 8–12 | Use case owner |
| DEP-R09 | Raw SQL ownership bypass. | Medium | High | P0-017 and implementation reviews | Backend owner |

## Recommended Resolution Direction

- Extract public contract for each module before runtime implementation.
- Move mutation to owning use case; never write another module table directly.
- Introduce application orchestrator only where transaction owner is explicit.
- Replace direct repository import with query/read-model contract.
- Emit outbox event after commit for non-blocking side effects.
- Move shared business logic from `common` to owning module.
- Defer optional dependency, especially M17/M18, until gate approval.
- Create integration tests for tenant isolation, cross-module mutation, transaction/outbox/audit and worker behavior.

## Known Mismatches

| Reference | Existing Finding | P0-007 Dependency Impact | Follow-up |
|---|---|---|---|
| `MODULE_BOUNDARIES.md` KM-004 / P0-006 RT observation | Auth repository reads tenant/userRoles/rolePermissions with `prisma.user`. | Potential M02/M03/M04 boundary coupling. | P0-017 implementation alignment. |
| `MODULE_BOUNDARIES.md` KM-005 | Access token includes `tenantId`. | Potential Identity/Tenancy dependency inversion. | P0-017 authorization/tenant context review. |
| `MODULE_BOUNDARIES.md` KM-006 | Worker directly SQL-updates `outbox_events`. | Allowed only while restricted to M01 outbox operational fields. | Keep under M01; add contract later. |
| `MODULE_BOUNDARIES.md` KM-007/KM-010 | Prisma schema/table names diverge from source manifest. | Runtime dependency evidence cannot override source ownership. | P0-008 manifest audit and P0-017 runtime alignment. |
| `PROJECT_STATUS.md` BI-002 | Runtime code/migration/Docker pre-exist Phase 0 sign-off. | Treat observations as pre-existing artifacts, not phase completion evidence. | P0-017 consistency audit. |

## Handoff to P0-008

P0-008 receives:

- confirmed source-level ownership summary from `docs/phase-0/MODULE_BOUNDARIES.md`;
- P0-007 cross-module read/write findings;
- no source CORE table with unclear owner in P0-006 matrix;
- raw SQL/table access findings: health readiness DB ping, auth Prisma query, systemInfo query, seed writes, worker `outbox_events` SQL;
- mismatch between Database Capability Manifest and runtime Prisma schema names;
- ownership/dependency conflicts needing deeper runtime alignment at P0-017.

P0-008 must create `docs/phase-0/DATABASE_MANIFEST_AUDIT.md` and reconcile 48 CORE, 12 OPTIONAL, 17 DEFERRED entries with module owner, phase ownership and runtime schema evidence.

## Change Control

| Change ID | Requested Dependency Change | Consumer | Provider | Current Type | Proposed Type | Boundary Impact | Approval Status |
|---|---|---|---|---|---|---|---|
| DEP-CHG-TEMPLATE | Describe requested dependency change | MXX | MYY | Current dependency type | Proposed dependency type | None/Low/Medium/High | NEEDS_APPROVAL |

Every new inter-module dependency requires review. Any dependency that promotes M17/M18, introduces cross-module write, imports internal repository/controller/router, or moves ownership between modules requires explicit approval.

## Validation Checklist

| Check | Result | Evidence |
|---|---|---|
| Có Expected Dependency Graph | PASS | `## Expected Dependency Graph` |
| Có Allowed Dependency Matrix | PASS | `## Allowed Dependency Matrix` |
| Có Forbidden Dependency Matrix | PASS | `## Forbidden Dependency Matrix` |
| Có runtime import inspection | PASS | `## Runtime Repository Inspection`; `## Cross-Module Import Audit` |
| Có Prisma/SQL access audit | PASS | `## Prisma and SQL Access Audit` |
| Có worker audit | PASS | `## Worker Dependency Audit` |
| Có transaction boundary audit | PASS | `## Transaction Boundary Audit` |
| Có circular dependency analysis | PASS | `## Circular Dependency Analysis` |
| Có risk register | PASS | `## Dependency Risk Register` |
| Có handoff P0-008 | PASS | `## Handoff to P0-008` |
| M17/M18 không trở thành dependency bắt buộc | PASS | Expected graph and allowed matrix mark optional/gated only |
| Worker không được gọi là microservice | PASS | Worker principle and audit define process boundary only |
| Không tuyên bố graph sạch chu kỳ tuyệt đối | PASS | Circular section limits claim to inspected artifacts |
| Không sửa runtime code | PASS | P0-007 writes docs only |
| Không tạo P0-008 artifact | PASS | `docs/phase-0/DATABASE_MANIFEST_AUDIT.md` not created |
| Không tuyên bố Phase 0 DONE | PASS | Status limits completion to P0-007 only |
| Không đánh dấu Phase 1 IN_PROGRESS | PASS | `docs/PROJECT_STATUS.md` keeps Phase 1 NOT_STARTED |
| Có Source References | PASS | `## Source References` |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — architecture decision: Modular Monolith First; worker process is not microservice.
- `docs/BaoCaoKhoaLuan.docx` — module boundary and data ownership: owner, contract and no direct cross-module mutation.
- `docs/BaoCaoKhoaLuan.docx` — worker boundary: shared application/domain modules, outbox dispatch, notification, cleanup, scheduled jobs, file processing when toolchain exists.
- `docs/BaoCaoKhoaLuan.docx` — transaction/outbox/idempotency: critical transitions use transaction, idempotency, outbox and audit.
- `docs/BaoCaoKhoaLuan.docx` — security architecture: tenant + role + scope + relationship + state authorization.
- `docs/BaoCaoKhoaLuan.docx` — roadmap Phase 0–13 and Phase 13 Search/AI gate.
- `docs/BaoCaoKhoaLuan.docx` — Database Capability Manifest: table owner/status/phase source for dependency and runtime schema follow-up.
- `docs/phase-0/SOURCE_HIERARCHY.md` — source priority and implementation-evidence rules.
- `docs/phase-0/SCOPE_FREEZE.md` — core/deferred scope and forbidden core scope.
- `docs/phase-0/STACK_LOCK.md` — locked stack, worker topology, raw SQL and test rules.
- `docs/phase-0/MODULE_BOUNDARIES.md` — M01–M18 boundaries, data ownership matrix and P0-006 repository observations.
