# APLP Business Invariants

## Purpose

Tổng hợp business invariant trọng yếu của APLP, gán owner module, aggregate/table, enforcement dự kiến, phase, test evidence, runtime status và mismatch/finding liên quan. Artifact này phục vụ P0-010 Traceability Audit, P0-012 Error Contract Baseline, P0-013 Evidence Plan và P0-017 Consistency Audit; không sửa runtime.

## Status

DONE for P0-009 — Business Invariants

- Chỉ P0-009 hoàn thành.
- Phase 0 tổng thể vẫn IN_PROGRESS.
- Chưa có Phase 0 sign-off.
- P0-010 chưa được thực hiện.
- Tài liệu này không chứng minh invariant đã được code hoặc test.
- Runtime mismatch không được sửa trong task này.
- Không invariant nào được đánh dấu `VERIFIED` trong Phase 0.

## Last Updated

2026-07-29 14:18 Asia/Ho_Chi_Minh

## Invariant Interpretation Rules

- Design rule khác runtime enforcement.
- Database constraint khác application guard.
- Test plan khác executed evidence.
- Foreign key không đủ để chứng minh authorization.
- Authorization middleware không đủ nếu thiếu relationship/state context.
- Audit không thay thế transaction.
- Outbox không thay thế audit.
- Idempotency không thay thế concurrency guard.
- Immutable record không đồng nghĩa không có amendment workflow.
- Optional policy chưa chốt không được tự diễn giải thành invariant chính thức.
- Runtime code hiện có không được âm thầm thay đổi invariant theo source.

## Invariant Status Model

| Status | Meaning |
|--------|---------|
| DESIGN_LOCKED | Invariant được source khóa. |
| PLANNED_ENFORCEMENT | Đã xác định cách enforce nhưng chưa có runtime evidence. |
| PARTIALLY_ENFORCED | Có một phần DB/application evidence. |
| RUNTIME_ENFORCED_UNTESTED | Runtime có enforcement nhưng chưa có test execution. |
| VERIFIED | Có DB/application/test evidence phù hợp. Không dùng trong P0-009. |
| VIOLATED_BY_RUNTIME | Runtime hiện tại mâu thuẫn invariant. |
| NEEDS_APPROVAL | Chi tiết policy chưa được phê duyệt. |
| DEFERRED | Invariant thuộc capability optional/deferred. |

## Invariant Definitions

- Business Invariant: Điều phải luôn đúng đối với trạng thái nghiệp vụ hợp lệ.
- Authorization Invariant: Điều quy định actor nào được phép tác động lên resource nào trong context nào.
- Data Integrity Invariant: Điều được bảo vệ bằng FK, unique, check, exclusion, immutable record hoặc transaction.
- Historical Invariant: Điều bảo đảm lịch sử chính thức không bị ghi đè.
- Reliability Invariant: Điều bảo đảm retry, concurrency, worker hoặc side effect không làm mất hoặc nhân đôi business intent.
- Security Invariant: Điều bảo đảm tenant isolation, object security, secret redaction và deny-by-default.

## Master Invariant Register

| Invariant ID | Domain | Invariant Statement | Type | Owner Module | Supporting Modules | Aggregate/Tables | Implementation Phase | Design Status | Runtime Status | Finding Reference |
|---|---|---|---|---|---|---|---|---|---|---|
| INV-FND-001 | Foundation | Critical business mutation and outbox event intent are written in the same PostgreSQL transaction; worker dispatches only after commit and consumers handle duplicates idempotently. | Reliability Invariant | M01 Platform/Foundation | M15, M16, event-producing business modules | outbox_events; business table; audit_logs when critical | Phase 1 foundation; applies Phase 2–13 | DESIGN_LOCKED | PARTIALLY_ENFORCED | F-DB-008; MODULE_DEPENDENCIES RT-009 |
| INV-FND-002 | Foundation | Idempotency key is scoped by tenant/account/operation; same key with different payload conflicts; retry does not duplicate side effects. | Reliability Invariant | M01 Platform/Foundation | all command-owning modules | idempotency_records | Phase 1 foundation; applies to critical commands | DESIGN_LOCKED | PARTIALLY_ENFORCED | DATABASE_MANIFEST_AUDIT F-DB-010; runtime idempotencyKey.test observes header validation only |
| INV-FND-003 | Foundation | Critical transition never commits partial business state; transaction owner is explicit; cross-module mutation uses owning use case/orchestrator. | Reliability Invariant | M01 Platform/Foundation | M08–M14, M16 | varies by flow | Phase 1 foundation; applies Phase 7–13 | DESIGN_LOCKED | NOT_IMPLEMENTED | DATABASE_MANIFEST_AUDIT F-DB-007 |
| INV-FND-004 | Foundation | Logs and error responses must redact password, credential hash, access token, refresh/session token, cookie, storage credential, presigned URL and raw secret. | Security Invariant | M01 Platform/Foundation | all modules | logs; error envelope; config secrets | Phase 1 and Phase 13 hardening | DESIGN_LOCKED | PARTIALLY_ENFORCED | runtime `errorHandler.test.ts`; no full log-redaction proof |
| INV-FND-005 | Foundation | Worker is a process boundary, not a business owner or microservice; it must not mutate canonical business aggregates outside application use cases. | Reliability Invariant | M01 Platform/Foundation | M15, M11, business owners | outbox_events; notifications later | Phase 1 worker foundation; Phase 13 hardening | DESIGN_LOCKED | PARTIALLY_ENFORCED | F-DB-008; MODULE_DEPENDENCIES RT-009 |
| INV-ID-001 | Identity | Account is global, has no tenantId, may have many TenantMemberships, and does not imply organization authorization. | Business Invariant | M02 Identity | M03 Tenancy | accounts; tenant_memberships | Phase 2 + Phase 3 | DESIGN_LOCKED | VIOLATED_BY_RUNTIME | F-DB-002; F-DB-003; users.tenant_id |
| INV-ID-002 | Identity | Credential belongs to global Account, contains no tenant authorization, and secret/hash is not logged. | Security Invariant | M02 Identity | M01 | account_credentials; accounts | Phase 2 | DESIGN_LOCKED | PARTIALLY_ENFORCED | runtime password/token helpers; schema merged into users |
| INV-ID-003 | Identity | Verification/reset token is hash-stored, one-time consumed, and expired/revoked token cannot be used. | Security Invariant | M02 Identity | M01 | account_tokens | Phase 2 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-002 |
| INV-ID-004 | Identity | Refresh/session rotation maintains a safe chain; old token reuse revokes chain/session per policy; session is not tenant membership. | Security Invariant | M02 Identity | M03, M01 | sessions; account_tokens; tenant_memberships reference only | Phase 2 | DESIGN_LOCKED | VIOLATED_BY_RUNTIME | F-DB-002; F-DB-003; refresh_tokens.tenant_id |
| INV-TEN-001 | Tenancy | An account has at most one valid TenantMembership for the same organization. | Data Integrity Invariant | M03 Tenancy | M02 | tenant_memberships | Phase 3 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007; F-DB-002 name mismatch |
| INV-TEN-002 | Tenancy | Inactive, suspended or revoked membership must not create tenant context; tenant switch verifies current active membership. | Authorization Invariant | M03 Tenancy | M02, M04 | tenant_memberships; sessions | Phase 3 | DESIGN_LOCKED | PARTIALLY_ENFORCED | auth repository filters tenant active, but no membership model |
| INV-TEN-003 | Tenancy | Tenant context derives from authenticated session plus active membership; client-sent tenantId is never trusted. | Security Invariant | M03 Tenancy | M02, M04 | tenant_memberships; sessions | Phase 3 | DESIGN_LOCKED | VIOLATED_BY_RUNTIME | INV-ID-001/F-DB-003; token contains tenantId |
| INV-TEN-004 | Tenancy | Tenant-owned data has direct organization/tenant scope or safe parent-derived scope; queries are tenant scoped and cross-tenant lookup denies by default. | Security Invariant | M03 Tenancy | all tenant modules, M04 | all TENANT/GLOBAL-TENANT tables | Phase 3 onward | DESIGN_LOCKED | NEEDS_TEST_EVIDENCE | DATABASE_MANIFEST_AUDIT tenant scope audit |
| INV-TEN-005 | Tenancy | Invitation records organization, intended recipient, expiry and status; replay or accept by wrong account is rejected. | Business Invariant | M03 Tenancy | M02, M01 | membership_invitations; tenant_memberships | Phase 3 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-AUTH-001 | Authorization | Authorization combines tenant, role, scope, relationship, state and classification; missing required context denies by default. | Authorization Invariant | M04 Authorization | M03 and resource owner modules | roles; permissions; role_assignments; role_assignment_scopes; resource tables | Phase 4 onward | DESIGN_LOCKED | NOT_IMPLEMENTED | MODULE_DEPENDENCIES RT-004 auth coupling risk |
| INV-AUTH-002 | Authorization | Actor cannot grant role/permission to self without appropriate admin authority; student cannot manage academic structure. | Authorization Invariant | M04 Authorization | M05, M03 | role_assignments; role_assignment_scopes; academic_units | Phase 4/5 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-AUTH-003 | Authorization | Role assignment scope is normalized/FK-backed and cannot exceed tenant; JSON/free-form permission cannot bypass integrity. | Data Integrity Invariant | M04 Authorization | M03, M05, M09 | role_assignments; role_assignment_scopes | Phase 4 | DESIGN_LOCKED | VIOLATED_BY_RUNTIME | F-DB-005; runtime user_roles inline scopes |
| INV-AUTH-004 | Authorization | Revoked membership, role or scope affects new requests; cache/session cannot retain old permission beyond policy. | Security Invariant | M04 Authorization | M03, M02 | role_assignments; tenant_memberships; sessions | Phase 4 onward | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-AUTH-005 | Authorization | M04 owns permission/scope policy only; resource relationship and state context remain with business module owner. | Authorization Invariant | M04 Authorization | M05–M14 | authorization tables plus resource tables by owner | Phase 4 onward | DESIGN_LOCKED | NOT_IMPLEMENTED | MODULE_DEPENDENCIES FDM-003 |
| INV-ACD-001 | Academic | Student cannot create faculty, department, program, class or cohort; Class/Cohort remains OD-002, not auto CORE. | Authorization Invariant | M05 Academic Organization | M04, M03 | academic_units; academic_cohorts/classes optional | Phase 5 | DESIGN_LOCKED | NOT_IMPLEMENTED | OD-002; F-DB-007 |
| INV-ACD-002 | Academic | Academic hierarchy parent/type relation is valid, cycle-free and tenant-scoped. | Data Integrity Invariant | M05 Academic Organization | M03, M04 | academic_units | Phase 5 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-ACD-003 | Academic | Placement history is effective-dated and not overwritten; overlap is rejected or handled by approved policy. | Historical Invariant | M06 Academic Profiles | M05, M03, M04 | academic_profiles; academic_placements | Phase 5 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007; policy detail needs approval if overlap allowed |
| INV-CAM-001 | Campaign | Published CampaignTemplateVersion is immutable; changes create a new version and never mutate policy already used. | Historical Invariant | M07 Campaign | M01, M16 | campaign_templates; campaign_template_versions | Phase 6 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-CAM-002 | Campaign | Campaign pins exact CampaignTemplateVersion and never reads mutable current version for historical interpretation. | Historical Invariant | M07 Campaign | M16 | academic_campaigns; campaign_template_versions | Phase 6 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-CAM-003 | Campaign | Campaign transition follows valid state guard with actor, precondition, transaction, audit and side-effect direction. | Business Invariant | M07 Campaign | M04, M01, M16, M15 | academic_campaigns; audit_logs; outbox_events | Phase 6 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-CAM-004 | Campaign | Participant uniqueness and eligibility are checked; participant snapshot is not arbitrarily changed after close. | Historical Invariant | M07 Campaign | M05, M06, M04 | campaign_participants | Phase 6 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-TOP-001 | Topic | Approving one TopicProposal creates at most one CampaignTopic; retry/concurrency cannot duplicate materialization. | Reliability Invariant | M08 Topic | M07, M04, M01, M16 | topic_proposals; topic_decisions; campaign_topics; outbox_events; audit_logs | Phase 7 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-TOP-002 | Topic | Topic decision records actor, timestamp, outcome and reason/evidence; decision history is not overwritten. | Historical Invariant | M08 Topic | M16 | topic_decisions; topic_proposals | Phase 7 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-TOP-003 | Topic | Rejected proposal cannot be registered; Project/Registration must not directly mutate TopicDecision. | Business Invariant | M08 Topic | M09, M04 | topic_proposals; topic_decisions; campaign_topics; project_registrations | Phase 7/8 | DESIGN_LOCKED | NOT_IMPLEMENTED | MODULE_DEPENDENCIES FDM-005 |
| INV-PRJ-001 | Project | One approved registration creates exactly one Project; retry/concurrent approval cannot create duplicates. | Reliability Invariant | M09 Project | M07, M08, M06, M04, M01, M16 | project_registrations; projects; project_memberships; outbox_events; audit_logs | Phase 8 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-PRJ-002 | Project | One account/member cannot appear twice in same registration; eligibility and capacity are checked before approval. | Business Invariant | M09 Project | M07, M06, M04 | project_registrations; registration_members; campaign_participants | Phase 8 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-PRJ-003 | Project | Project membership is unique and access derives from project relationship and active member state. | Authorization Invariant | M09 Project | M03, M04 | projects; project_memberships; tenant_memberships | Phase 9 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-PRJ-004 | Project | Supervisor is active and in valid scope; capacity/overlap follows source/approved policy; revoke removes request-time authority. | Authorization Invariant | M09 Project | M06, M04 | supervision_assignments; academic_profiles; project_memberships | Phase 9 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007; policy detail may need approval |
| INV-WRK-001 | Work Progress | Progress update has actor/time and is append-only; milestone plan and progress evidence remain distinct. | Historical Invariant | M10 Work Progress | M09, M04, M16 | project_milestones; progress_updates | Phase 9 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-DOC-001 | Documents | Object key is tenant-scoped; bucket/object URL is not public; tenant A cannot access tenant B object. | Security Invariant | M11 Documents | M09, M04, M01 | documents; upload_sessions; document_versions; object storage keys | Phase 10 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-013; MinIO/S3 no runtime evidence |
| INV-DOC-002 | Documents | UploadSession completes validly once; retry complete does not create duplicate DocumentVersion; expired/aborted session cannot materialize version. | Reliability Invariant | M11 Documents | M01, M04 | upload_sessions; document_versions | Phase 10 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-DOC-003 | Documents | DocumentVersion is immutable; a new version is a new row/snapshot; official bytes/metadata of old version are not changed. | Historical Invariant | M11 Documents | M16 | document_versions; documents | Phase 10 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-DOC-004 | Documents | Web uploads bytes directly to S3-compatible storage; API does not proxy large files normally; complete checks metadata evidence. | Security Invariant | M11 Documents | M01, M04 | upload_sessions; document_versions; object storage | Phase 10 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-013 |
| INV-DOC-005 | Documents | Each download is re-authorized; presigned URL is short-lived and never logged. | Security Invariant | M11 Documents | M04, M01 | documents; document_versions; object storage access logs | Phase 10 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-013 |
| INV-SUB-001 | Submission | Submission pins exact DocumentVersion; creating V2 never moves an existing Submission from V1; official submission target cannot be updated. | Historical Invariant | M11 Documents | M09, M04, M16 | submissions; document_versions | Phase 11 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-SUB-002 | Submission | Duplicate/replayed submission attempt is controlled; deadline/timezone uses approved policy. | Business Invariant | M11 Documents | M07, M09, M04 | submissions; academic_campaigns | Phase 11 | NEEDS_APPROVAL | NOT_IMPLEMENTED | F-DB-007 |
| INV-FB-001 | Feedback | Feedback pins exact resource/version target, cannot be retargeted after creation, and visibility follows relationship/assignment. | Historical Invariant | M12 Feedback | M09, M11, M04 | feedback_items; documents; document_versions; projects | Phase 11 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-001 | Review | Published RubricVersion is immutable; Rubric is logical aggregate root; RubricCriterion code is unique per rubric_version_id. | Historical Invariant | M13 Review | M16 | rubrics; rubric_versions; rubric_criteria | Phase 12 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-002 | Review | ReviewAssignment pins Submission, RubricVersion, Reviewer and Round; mutable current target/rubric is never used. | Historical Invariant | M13 Review | M11, M07, M04 | review_assignments; submissions; rubric_versions | Phase 12 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-003 | Review | Reviewer can create/update Review only for assigned ReviewAssignment in scope. | Authorization Invariant | M13 Review | M04, M03 | review_assignments; reviews | Phase 12 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-004 | Review | Review in SUBMITTED/LOCKED state is not directly edited; correction uses approved workflow; score belongs to same Review and RubricCriterion/version. | Historical Invariant | M13 Review | M16 | reviews; review_scores; rubric_criteria | Phase 12 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-005 | Review | Score range and criterion match the pinned RubricVersion; aggregation is deterministic. | Data Integrity Invariant | M13 Review | M14 | review_scores; rubric_criteria; rubric_versions | Phase 12 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-001 | Evaluation | Evaluation finalizes only when review/rubric/assignment conditions satisfy approved quorum/COI/rubric policy. | Business Invariant | M14 Evaluation | M13, M11, M04, M16 | evaluations; reviews; review_assignments; rubric_versions | Phase 12 | NEEDS_APPROVAL | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-002 | Evaluation | FINALIZED Evaluation is not directly updated; official result preserves history. | Historical Invariant | M14 Evaluation | M16 | evaluations; evaluation_amendments | Phase 12 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-003 | Evaluation | EvaluationAppeal is review request only; it does not directly mutate Evaluation; decision has actor/reason/evidence. | Historical Invariant | M14 Evaluation | M04, M16 | evaluation_appeals; evaluations | Phase 12 | NEEDS_APPROVAL | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-004 | Evaluation | Official change after finalize uses append-only EvaluationAmendment linked to Evaluation with reason/evidence; old amendment is not overwritten. | Historical Invariant | M14 Evaluation | M16 | evaluation_amendments; evaluations | Phase 12 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-005 | Evaluation | Student sees result only when release/visibility state allows; policy not inferred when source is undecided. | Authorization Invariant | M14 Evaluation | M04, M09 | evaluations; project_memberships | Phase 12 | NEEDS_APPROVAL | NOT_IMPLEMENTED | F-DB-007 |
| INV-NOT-001 | Notification | Notification is side effect, not business commit condition; failure does not lose committed business state and never mutates aggregate. | Reliability Invariant | M15 Communication/Notification | M01, event producers | notifications; outbox_events | Phase 13 | DESIGN_LOCKED | NOT_IMPLEMENTED | F-DB-007; F-DB-008 for outbox foundation |
| INV-AUD-001 | Audit | Critical transition writes audit with actor, action/transition, target, reason and correlation in same business transaction when source requires; audit does not replace outbox. | Historical Invariant | M16 Audit/Operations | M01 and business owners | audit_logs; business table; outbox_events | Phase 13 hardening; applied earlier where critical | DESIGN_LOCKED | PARTIALLY_ENFORCED | audit_logs runtime table observed; no critical use case evidence |
| INV-AUD-002 | Audit | Audit record is append-only and cannot be edited to change history; audit payload must not include sensitive data. | Historical Invariant | M16 Audit/Operations | M01 | audit_logs | Phase 13 | DESIGN_LOCKED | PARTIALLY_ENFORCED | audit_logs runtime table exists; update policy/test missing |
| INV-SRCH-001 | Search | Search is OPTIONAL after Phase 13 gate, returns only authorized data, and index/read model is not canonical owner. | Security Invariant | M17 Search | M04 and provider read contracts | search_documents; search_chunks optional | After Phase 13 gate | DEFERRED | DEFERRED | OD-008; no runtime observed |
| INV-AI-001 | AI/RAG | AI/RAG is OPTIONAL/advisory, retrieval is permission-aware with citation/evidence, and AI cannot approve, grade, finalize, mutate state or bypass authorization. | Security Invariant | M18 AI/RAG | M04, M17 optional, provider read contracts | ai_assistance_runs optional; vector_embeddings deferred | After Phase 13 gate | DEFERRED | DEFERRED | OD-009; no runtime observed |

## Invariant Detail Cards

### INV-FND-001 — Transactional Outbox Atomicity

- Statement: Critical business mutation and outbox event intent are written in the same PostgreSQL transaction; worker dispatches only after commit and consumers handle duplicates idempotently.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Reliability Invariant
- Owner Module: M01 Platform/Foundation
- Supporting Modules: M15, M16, event-producing business modules
- Aggregate: outbox_events
- Tables: outbox_events; business table; audit_logs when critical
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK/aggregate refs; status CHECK; append/retention policy planned
- Application Enforcement: Outbox writer in owning use case
- Authorization Enforcement: NOT_APPLICABLE
- Transaction Boundary: Same DB transaction as business mutation
- Concurrency Strategy: ROW_LOCK/claim status for worker; consumer idempotency
- Idempotency Strategy: Event dedupe/consumer idempotency
- Outbox Requirement: REQUIRED
- Audit Requirement: Critical mutation audit where required
- Worker Interaction: Worker claims/publishes outbox rows only
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 1 foundation; applies Phase 2–13
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: PARTIALLY_ENFORCED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-008; MODULE_DEPENDENCIES RT-009
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-FND-002 — Scoped Idempotency

- Statement: Idempotency key is scoped by tenant/account/operation; same key with different payload conflicts; retry does not duplicate side effects.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Reliability Invariant
- Owner Module: M01 Platform/Foundation
- Supporting Modules: all command-owning modules
- Aggregate: idempotency_records
- Tables: idempotency_records
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UNIQUE(scope,key,operation) and request_hash/status fields planned; runtime has `@@unique([scope,key])` only
- Application Enforcement: Idempotency middleware/use case check payload hash and cached result
- Authorization Enforcement: NOT_APPLICABLE
- Transaction Boundary: Command transaction records idempotency result atomically
- Concurrency Strategy: UNIQUE + ROW_LOCK/COMPARE_AND_SET
- Idempotency Strategy: PRIMARY STRATEGY
- Outbox Requirement: Optional outbox only for emitted events
- Audit Requirement: Audit conflict/replay where security relevant
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: ARTIFACT_OBSERVED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 1 foundation; applies to critical commands
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: PARTIALLY_ENFORCED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: DATABASE_MANIFEST_AUDIT F-DB-010; runtime idempotencyKey.test observes header validation only
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-FND-003 — Critical Mutation Atomicity

- Statement: Critical transition never commits partial business state; transaction owner is explicit; cross-module mutation uses owning use case/orchestrator.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Reliability Invariant
- Owner Module: M01 Platform/Foundation
- Supporting Modules: M08–M14, M16
- Aggregate: varies by flow
- Tables: varies by flow
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UNIQUE/FK/CHECK per flow
- Application Enforcement: State machine guard in owner use case
- Authorization Enforcement: Owner module supplies resource context
- Transaction Boundary: Owner-specific transaction boundary
- Concurrency Strategy: ROW_LOCK/OPTIMISTIC_VERSION/COMPARE_AND_SET chosen per flow
- Idempotency Strategy: Use per retryable command
- Outbox Requirement: REQUIRED when side effect exists
- Audit Requirement: REQUIRED for critical transition
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 1 foundation; applies Phase 7–13
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: DATABASE_MANIFEST_AUDIT F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-FND-004 — Secret and Sensitive Data Redaction

- Statement: Logs and error responses must redact password, credential hash, access token, refresh/session token, cookie, storage credential, presigned URL and raw secret.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M01 Platform/Foundation
- Supporting Modules: all modules
- Aggregate: logs
- Tables: logs; error envelope; config secrets
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: NOT_APPLICABLE
- Application Enforcement: Logger/error handler redaction policy
- Authorization Enforcement: NOT_APPLICABLE
- Transaction Boundary: NOT_APPLICABLE
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit must avoid sensitive payload
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: INTERNAL_ERROR redacts stack/message in production
- Unit Test Evidence: ARTIFACT_OBSERVED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: ARTIFACT_OBSERVED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 1 and Phase 13 hardening
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: PARTIALLY_ENFORCED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: runtime `errorHandler.test.ts`; no full log-redaction proof
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-FND-005 — Worker Business Boundary

- Statement: Worker is a process boundary, not a business owner or microservice; it must not mutate canonical business aggregates outside application use cases.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Reliability Invariant
- Owner Module: M01 Platform/Foundation
- Supporting Modules: M15, M11, business owners
- Aggregate: outbox_events
- Tables: outbox_events; notifications later
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: Allowed SQL only for owned operational rows
- Application Enforcement: Worker jobs call public contracts for business actions
- Authorization Enforcement: NOT_APPLICABLE
- Transaction Boundary: Worker transaction only for operational claim/update
- Concurrency Strategy: FOR UPDATE SKIP LOCKED for outbox claim
- Idempotency Strategy: Consumer-side idempotency
- Outbox Requirement: PRIMARY
- Audit Requirement: Worker errors/audit per job policy
- Worker Interaction: Direct SQL observed only on outbox_events
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 1 worker foundation; Phase 13 hardening
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: PARTIALLY_ENFORCED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-008; MODULE_DEPENDENCIES RT-009
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-ID-001 — Global Account

- Statement: Account is global, has no tenantId, may have many TenantMemberships, and does not imply organization authorization.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Business Invariant
- Owner Module: M02 Identity
- Supporting Modules: M03 Tenancy
- Aggregate: accounts
- Tables: accounts; tenant_memberships
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: accounts no tenant_id; tenant_memberships UNIQUE(org,account)
- Application Enforcement: Auth returns account identity only; tenant context resolved separately
- Authorization Enforcement: Tenant membership required for org access
- Transaction Boundary: Session/account creation separate from membership
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit login/member actions separately
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: TENANT_CONTEXT_INVALID/FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 2 + Phase 3
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: VIOLATED_BY_RUNTIME
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-002; F-DB-003; users.tenant_id
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-ID-002 — Credential Separation

- Statement: Credential belongs to global Account, contains no tenant authorization, and secret/hash is not logged.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M02 Identity
- Supporting Modules: M01
- Aggregate: account_credentials
- Tables: account_credentials; accounts
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK account_id; hash non-null; no tenant auth column
- Application Enforcement: Password hashing/verification service
- Authorization Enforcement: NOT_APPLICABLE
- Transaction Boundary: Credential update isolated in Identity transaction
- Concurrency Strategy: COMPARE_AND_SET/rotation policy
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit credential lifecycle without secret
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 2
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: PARTIALLY_ENFORCED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: runtime password/token helpers; schema merged into users
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-ID-003 — One-time Token Consumption

- Statement: Verification/reset token is hash-stored, one-time consumed, and expired/revoked token cannot be used.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M02 Identity
- Supporting Modules: M01
- Aggregate: account_tokens
- Tables: account_tokens
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: token_hash UNIQUE; status/expiry CHECK
- Application Enforcement: Consume-once use case validates hash/status/expiry
- Authorization Enforcement: NOT_APPLICABLE
- Transaction Boundary: Consume transition transaction
- Concurrency Strategy: COMPARE_AND_SET status consume
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit token consumption without token value
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 2
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-002
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-ID-004 — Refresh Session Rotation

- Statement: Refresh/session rotation maintains a safe chain; old token reuse revokes chain/session per policy; session is not tenant membership.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M02 Identity
- Supporting Modules: M03, M01
- Aggregate: sessions
- Tables: sessions; account_tokens; tenant_memberships reference only
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: refresh/session hash unique; status/expiry; no fixed tenant authority
- Application Enforcement: Refresh rotation and reuse detection
- Authorization Enforcement: Tenant selection via active membership only
- Transaction Boundary: Rotate/revoke in transaction
- Concurrency Strategy: COMPARE_AND_SET token status
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit refresh/reuse events
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: TENANT_CONTEXT_INVALID/CONFLICT
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 2
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: VIOLATED_BY_RUNTIME
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-002; F-DB-003; refresh_tokens.tenant_id
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-TEN-001 — Unique Organization Membership

- Statement: An account has at most one valid TenantMembership for the same organization.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Data Integrity Invariant
- Owner Module: M03 Tenancy
- Supporting Modules: M02
- Aggregate: tenant_memberships
- Tables: tenant_memberships
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UNIQUE(organization_id,account_id); status history/audit
- Application Enforcement: Membership create/accept checks existing membership
- Authorization Enforcement: Admin or invite accept guard
- Transaction Boundary: Membership accept transaction
- Concurrency Strategy: UNIQUE + ROW_LOCK on accept
- Idempotency Strategy: Invitation accept idempotency
- Outbox Requirement: Optional notification event
- Audit Requirement: Audit membership transition
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 3
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007; F-DB-002 name mismatch
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-TEN-002 — Active Membership Required

- Statement: Inactive, suspended or revoked membership must not create tenant context; tenant switch verifies current active membership.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Authorization Invariant
- Owner Module: M03 Tenancy
- Supporting Modules: M02, M04
- Aggregate: tenant_memberships
- Tables: tenant_memberships; sessions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: membership status CHECK/index
- Application Enforcement: Tenant-context resolver verifies active membership each request
- Authorization Enforcement: M04 receives active context only
- Transaction Boundary: NOT_APPLICABLE
- Concurrency Strategy: Cache invalidation/reload on revoke
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit revoke/suspend
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 3
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: PARTIALLY_ENFORCED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: auth repository filters tenant active, but no membership model
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-TEN-003 — Trusted Tenant Context

- Statement: Tenant context derives from authenticated session plus active membership; client-sent tenantId is never trusted.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M03 Tenancy
- Supporting Modules: M02, M04
- Aggregate: tenant_memberships
- Tables: tenant_memberships; sessions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK session/account + membership relation planned
- Application Enforcement: Context resolver ignores body/header tenantId as authority
- Authorization Enforcement: Deny if no active membership
- Transaction Boundary: NOT_APPLICABLE
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit tenant switch
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: TENANT_CONTEXT_INVALID
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 3
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: VIOLATED_BY_RUNTIME
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: INV-ID-001/F-DB-003; token contains tenantId
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-TEN-004 — Tenant-Owned Data Isolation

- Statement: Tenant-owned data has direct organization/tenant scope or safe parent-derived scope; queries are tenant scoped and cross-tenant lookup denies by default.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M03 Tenancy
- Supporting Modules: all tenant modules, M04
- Aggregate: all TENANT/GLOBAL-TENANT tables
- Tables: all TENANT/GLOBAL-TENANT tables
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: tenant/org FK or parent-derived FK; indexes
- Application Enforcement: Repository/query contract always scopes tenant
- Authorization Enforcement: M04 tenant + relationship guard
- Transaction Boundary: Use case-owned transaction
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit cross-tenant denies where required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: FORBIDDEN/TENANT_CONTEXT_INVALID
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 3 onward
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NEEDS_TEST_EVIDENCE
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: DATABASE_MANIFEST_AUDIT tenant scope audit
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-TEN-005 — Invitation Integrity

- Statement: Invitation records organization, intended recipient, expiry and status; replay or accept by wrong account is rejected.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Business Invariant
- Owner Module: M03 Tenancy
- Supporting Modules: M02, M01
- Aggregate: membership_invitations
- Tables: membership_invitations; tenant_memberships
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UNIQUE(org,email,active); expiry/status CHECK
- Application Enforcement: Accept/revoke invitation use cases
- Authorization Enforcement: Invite admin permission
- Transaction Boundary: Accept transaction creates/links membership
- Concurrency Strategy: COMPARE_AND_SET invite status
- Idempotency Strategy: Idempotent accept optional
- Outbox Requirement: Notification optional
- Audit Requirement: Audit invite lifecycle
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 3
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-AUTH-001 — Deny by Default

- Statement: Authorization combines tenant, role, scope, relationship, state and classification; missing required context denies by default.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Authorization Invariant
- Owner Module: M04 Authorization
- Supporting Modules: M03 and resource owner modules
- Aggregate: roles
- Tables: roles; permissions; role_assignments; role_assignment_scopes; resource tables
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: role/permission/scope FK and status checks
- Application Enforcement: Policy contract returns allow only with full context
- Authorization Enforcement: Deny-by-default middleware/policy
- Transaction Boundary: NOT_APPLICABLE
- Concurrency Strategy: Cache invalidation on revoke
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit denied/critical allowed actions
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 4 onward
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: MODULE_DEPENDENCIES RT-004 auth coupling risk
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-AUTH-002 — No Self Privilege Escalation

- Statement: Actor cannot grant role/permission to self without appropriate admin authority; student cannot manage academic structure.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Authorization Invariant
- Owner Module: M04 Authorization
- Supporting Modules: M05, M03
- Aggregate: role_assignments
- Tables: role_assignments; role_assignment_scopes; academic_units
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK/unique; no DB-only guarantee
- Application Enforcement: Role assignment command checks actor target and permission
- Authorization Enforcement: Admin scope required; student denied
- Transaction Boundary: Transaction for assignment mutation
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: Idempotency for assignment command optional
- Outbox Requirement: Outbox notification optional
- Audit Requirement: Audit role/structure mutation
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 4/5
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-AUTH-003 — Normalized Scope Integrity

- Statement: Role assignment scope is normalized/FK-backed and cannot exceed tenant; JSON/free-form permission cannot bypass integrity.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Data Integrity Invariant
- Owner Module: M04 Authorization
- Supporting Modules: M03, M05, M09
- Aggregate: role_assignments
- Tables: role_assignments; role_assignment_scopes
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK role_assignment_id; UQ(assign,scope_type,scope_id); tenant scope check
- Application Enforcement: Scope validation policy
- Authorization Enforcement: M04 policy guard
- Transaction Boundary: Assignment transaction
- Concurrency Strategy: UNIQUE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit assignment changes
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 4
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: VIOLATED_BY_RUNTIME
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-005; runtime user_roles inline scopes
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-AUTH-004 — Revocation Effect

- Statement: Revoked membership, role or scope affects new requests; cache/session cannot retain old permission beyond policy.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M04 Authorization
- Supporting Modules: M03, M02
- Aggregate: role_assignments
- Tables: role_assignments; tenant_memberships; sessions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: status/effective window fields/indexes
- Application Enforcement: Permission resolver reloads/checks revocation state
- Authorization Enforcement: Deny revoked state
- Transaction Boundary: Revocation transaction
- Concurrency Strategy: Cache version/short TTL
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: Optional revoke notification
- Audit Requirement: Audit revocation
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 4 onward
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-AUTH-005 — Resource Context Ownership

- Statement: M04 owns permission/scope policy only; resource relationship and state context remain with business module owner.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Authorization Invariant
- Owner Module: M04 Authorization
- Supporting Modules: M05–M14
- Aggregate: authorization tables plus resource tables by owner
- Tables: authorization tables plus resource tables by owner
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK references only; no ownership transfer
- Application Enforcement: Resource module supplies context to policy
- Authorization Enforcement: M04 evaluates permission with context
- Transaction Boundary: NOT_APPLICABLE
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit critical auth decisions where needed
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 4 onward
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: MODULE_DEPENDENCIES FDM-003
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-ACD-001 — Academic Structure Creation Restriction

- Statement: Student cannot create faculty, department, program, class or cohort; Class/Cohort remains OD-002, not auto CORE.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Authorization Invariant
- Owner Module: M05 Academic Organization
- Supporting Modules: M04, M03
- Aggregate: academic_units
- Tables: academic_units; academic_cohorts/classes optional
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: No DB-only guarantee
- Application Enforcement: Academic unit create command checks role/scope
- Authorization Enforcement: Student denied; admin/coordinator allowed
- Transaction Boundary: Create/update transaction
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit structure mutation
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 5
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: OD-002; F-DB-007
- Open Decision: OD-002
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-ACD-002 — Valid Academic Hierarchy

- Statement: Academic hierarchy parent/type relation is valid, cycle-free and tenant-scoped.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Data Integrity Invariant
- Owner Module: M05 Academic Organization
- Supporting Modules: M03, M04
- Aggregate: academic_units
- Tables: academic_units
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK parent_id; UQ(org,parent,type,code); cycle guard via app/recursive check
- Application Enforcement: Hierarchy service validates type and cycle
- Authorization Enforcement: Scoped admin permission
- Transaction Boundary: Hierarchy mutation transaction
- Concurrency Strategy: ROW_LOCK/COMPARE_AND_SET on hierarchy path
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit hierarchy mutation
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 5
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-ACD-003 — Effective-Dated Placement History

- Statement: Placement history is effective-dated and not overwritten; overlap is rejected or handled by approved policy.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M06 Academic Profiles
- Supporting Modules: M05, M03, M04
- Aggregate: academic_profiles
- Tables: academic_profiles; academic_placements
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK profile/unit; valid_from/to; EXCLUSION or app overlap guard planned
- Application Enforcement: Placement command appends/ends records
- Authorization Enforcement: Profile management permission
- Transaction Boundary: Placement update transaction
- Concurrency Strategy: EXCLUSION/ROW_LOCK or policy check
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit placement changes
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 5
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007; policy detail needs approval if overlap allowed
- Open Decision: OD-002 if class/cohort affects placement
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-CAM-001 — Published Template Version Immutability

- Statement: Published CampaignTemplateVersion is immutable; changes create a new version and never mutate policy already used.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M07 Campaign
- Supporting Modules: M01, M16
- Aggregate: campaign_templates
- Tables: campaign_templates; campaign_template_versions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(template,version); published status immutable policy
- Application Enforcement: Publish/update commands branch new version
- Authorization Enforcement: Campaign admin/coordinator permission
- Transaction Boundary: Publish transaction
- Concurrency Strategy: OPTIMISTIC_VERSION/COMPARE_AND_SET
- Idempotency Strategy: Idempotency for publish optional
- Outbox Requirement: Outbox for publish optional
- Audit Requirement: Audit publish/update
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 6
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-CAM-002 — Campaign Version Pinning

- Statement: Campaign pins exact CampaignTemplateVersion and never reads mutable current version for historical interpretation.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M07 Campaign
- Supporting Modules: M16
- Aggregate: academic_campaigns
- Tables: academic_campaigns; campaign_template_versions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK campaign_template_version_id; NOT NULL
- Application Enforcement: Campaign create/open uses pinned version read model
- Authorization Enforcement: Scoped campaign permission
- Transaction Boundary: Campaign create transaction
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: Idempotency for campaign create optional
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit campaign create/open
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 6
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-CAM-003 — Campaign State Guards

- Statement: Campaign transition follows valid state guard with actor, precondition, transaction, audit and side-effect direction.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Business Invariant
- Owner Module: M07 Campaign
- Supporting Modules: M04, M01, M16, M15
- Aggregate: academic_campaigns
- Tables: academic_campaigns; audit_logs; outbox_events
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: state CHECK; optimistic version planned
- Application Enforcement: State machine guard
- Authorization Enforcement: Campaign relationship/state authorization
- Transaction Boundary: Campaign transition transaction
- Concurrency Strategy: OPTIMISTIC_VERSION
- Idempotency Strategy: Idempotent transition optional
- Outbox Requirement: Lifecycle notifications after commit
- Audit Requirement: Audit required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: INVALID_STATE/FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 6
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-CAM-004 — Participant Snapshot Integrity

- Statement: Participant uniqueness and eligibility are checked; participant snapshot is not arbitrarily changed after close.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M07 Campaign
- Supporting Modules: M05, M06, M04
- Aggregate: campaign_participants
- Tables: campaign_participants
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(campaign,membership); snapshot fields
- Application Enforcement: Eligibility/snapshot service
- Authorization Enforcement: Participant management permission
- Transaction Boundary: Participant mutation transaction
- Concurrency Strategy: UNIQUE + ROW_LOCK
- Idempotency Strategy: Idempotent participant import optional
- Outbox Requirement: Notification optional
- Audit Requirement: Audit participant changes
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 6
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-TOP-001 — Idempotent Topic Approval

- Statement: Approving one TopicProposal creates at most one CampaignTopic; retry/concurrency cannot duplicate materialization.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Reliability Invariant
- Owner Module: M08 Topic
- Supporting Modules: M07, M04, M01, M16
- Aggregate: topic_proposals
- Tables: topic_proposals; topic_decisions; campaign_topics; outbox_events; audit_logs
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UNIQUE(source_proposal_id) or equivalent
- Application Enforcement: Approve use case materializes idempotently
- Authorization Enforcement: Topic approval permission
- Transaction Boundary: Proposal decision + topic create in one transaction
- Concurrency Strategy: UNIQUE + ROW_LOCK
- Idempotency Strategy: Scoped idempotency required
- Outbox Requirement: Outbox for approval optional/required by notification
- Audit Requirement: Audit decision required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 7
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-TOP-002 — Topic Decision Evidence

- Statement: Topic decision records actor, timestamp, outcome and reason/evidence; decision history is not overwritten.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M08 Topic
- Supporting Modules: M16
- Aggregate: topic_decisions
- Tables: topic_decisions; topic_proposals
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: append decision row; FK proposal/actor
- Application Enforcement: Decision command requires reason where policy says
- Authorization Enforcement: Approver permission
- Transaction Boundary: Decision transaction
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: Idempotency for decision optional
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit/decision evidence required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 7
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-TOP-003 — Rejected Topic Cannot Register

- Statement: Rejected proposal cannot be registered; Project/Registration must not directly mutate TopicDecision.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Business Invariant
- Owner Module: M08 Topic
- Supporting Modules: M09, M04
- Aggregate: topic_proposals
- Tables: topic_proposals; topic_decisions; campaign_topics; project_registrations
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: Registration FK targets only approved CampaignTopic
- Application Enforcement: M09 queries M08 approved topic contract
- Authorization Enforcement: Registration permission + topic visibility
- Transaction Boundary: Registration transaction checks approved topic
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: Idempotency for registration
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit rejected attempts optional
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: INVALID_STATE/FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 7/8
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: MODULE_DEPENDENCIES FDM-005
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-PRJ-001 — One Project Per Approved Registration

- Statement: One approved registration creates exactly one Project; retry/concurrent approval cannot create duplicates.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Reliability Invariant
- Owner Module: M09 Project
- Supporting Modules: M07, M08, M06, M04, M01, M16
- Aggregate: project_registrations
- Tables: project_registrations; projects; project_memberships; outbox_events; audit_logs
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UNIQUE(source_registration_id); FK campaign/topic; state CHECK
- Application Enforcement: Approve registration use case owns project creation
- Authorization Enforcement: Coordinator/admin permission + relationship/state
- Transaction Boundary: Registration approve + Project create in one transaction
- Concurrency Strategy: UNIQUE + ROW_LOCK
- Idempotency Strategy: Scoped idempotency required
- Outbox Requirement: Outbox required for downstream notifications
- Audit Requirement: Audit required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 8
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-PRJ-002 — Registration Member Uniqueness

- Statement: One account/member cannot appear twice in same registration; eligibility and capacity are checked before approval.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Business Invariant
- Owner Module: M09 Project
- Supporting Modules: M07, M06, M04
- Aggregate: project_registrations
- Tables: project_registrations; registration_members; campaign_participants
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(registration,membership); capacity check policy
- Application Enforcement: Registration command validates team/capacity/eligibility
- Authorization Enforcement: Participant/project permission
- Transaction Boundary: Registration submit/approve transaction
- Concurrency Strategy: UNIQUE
- Idempotency Strategy: Idempotency for submit/approve
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit registration transitions
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 8
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-PRJ-003 — Project Membership Integrity

- Statement: Project membership is unique and access derives from project relationship and active member state.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Authorization Invariant
- Owner Module: M09 Project
- Supporting Modules: M03, M04
- Aggregate: projects
- Tables: projects; project_memberships; tenant_memberships
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(project,membership); status check
- Application Enforcement: Membership command manages official team
- Authorization Enforcement: Project relationship authorization
- Transaction Boundary: Membership mutation transaction
- Concurrency Strategy: UNIQUE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: Notification optional
- Audit Requirement: Audit membership changes
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 9
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-PRJ-004 — Supervisor Assignment Integrity

- Statement: Supervisor is active and in valid scope; capacity/overlap follows source/approved policy; revoke removes request-time authority.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Authorization Invariant
- Owner Module: M09 Project
- Supporting Modules: M06, M04
- Aggregate: supervision_assignments
- Tables: supervision_assignments; academic_profiles; project_memberships
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ active(project,lecturer,role); status/effective fields
- Application Enforcement: Supervisor assignment command validates lecturer/capacity
- Authorization Enforcement: Coordinator/admin permission
- Transaction Boundary: Assignment transaction
- Concurrency Strategy: ROW_LOCK on lecturer capacity
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: Notification optional
- Audit Requirement: Audit assignment/revoke
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 9
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007; policy detail may need approval
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-WRK-001 — Append-Only Progress Evidence

- Statement: Progress update has actor/time and is append-only; milestone plan and progress evidence remain distinct.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M10 Work Progress
- Supporting Modules: M09, M04, M16
- Aggregate: project_milestones
- Tables: project_milestones; progress_updates
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK project/milestone/author; append row; status CHECK
- Application Enforcement: Progress command appends update
- Authorization Enforcement: Project member/supervisor permission
- Transaction Boundary: Update transaction
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: Idempotency optional
- Outbox Requirement: Notification optional
- Audit Requirement: Audit important updates optional
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 9
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-DOC-001 — Tenant-Scoped Object Key

- Statement: Object key is tenant-scoped; bucket/object URL is not public; tenant A cannot access tenant B object.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M11 Documents
- Supporting Modules: M09, M04, M01
- Aggregate: documents
- Tables: documents; upload_sessions; document_versions; object storage keys
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: object_key UNIQUE; tenant/project path metadata
- Application Enforcement: Upload session builder scopes key
- Authorization Enforcement: Reauthorize project/document access
- Transaction Boundary: Upload/session transaction
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: Idempotency for session/complete
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit access where required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 10
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-013; MinIO/S3 no runtime evidence
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-DOC-002 — Single Upload Completion

- Statement: UploadSession completes validly once; retry complete does not create duplicate DocumentVersion; expired/aborted session cannot materialize version.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Reliability Invariant
- Owner Module: M11 Documents
- Supporting Modules: M01, M04
- Aggregate: upload_sessions
- Tables: upload_sessions; document_versions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(document,version_no); upload status/expiry CHECK
- Application Enforcement: Complete use case validates status/checksum/MIME/size/expiry
- Authorization Enforcement: Uploader/project permission
- Transaction Boundary: Upload state + version create transaction
- Concurrency Strategy: COMPARE_AND_SET upload status + UNIQUE
- Idempotency Strategy: Scoped idempotency required
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit complete/abort
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 10
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-DOC-003 — Immutable DocumentVersion

- Statement: DocumentVersion is immutable; a new version is a new row/snapshot; official bytes/metadata of old version are not changed.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M11 Documents
- Supporting Modules: M16
- Aggregate: document_versions
- Tables: document_versions; documents
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(document,version_no); immutable row policy
- Application Enforcement: No update path for finalized version metadata
- Authorization Enforcement: Document owner/project permission
- Transaction Boundary: Version create transaction
- Concurrency Strategy: OPTIMISTIC_VERSION on document version counter
- Idempotency Strategy: Idempotency complete
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit version creation
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 10
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-DOC-004 — Direct Upload Boundary

- Statement: Web uploads bytes directly to S3-compatible storage; API does not proxy large files normally; complete checks metadata evidence.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M11 Documents
- Supporting Modules: M01, M04
- Aggregate: upload_sessions
- Tables: upload_sessions; document_versions; object storage
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: upload_session expiry/size/checksum fields
- Application Enforcement: Presigned URL issue/complete flow
- Authorization Enforcement: Upload/download authorization
- Transaction Boundary: Complete transaction after object HEAD/check
- Concurrency Strategy: COMPARE_AND_SET upload status
- Idempotency Strategy: Idempotency complete
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit complete/abort
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 10
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-013
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-DOC-005 — Download Reauthorization

- Statement: Each download is re-authorized; presigned URL is short-lived and never logged.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M11 Documents
- Supporting Modules: M04, M01
- Aggregate: documents
- Tables: documents; document_versions; object storage access logs
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: NOT_APPLICABLE DB-only
- Application Enforcement: Download command re-checks authorization before presign
- Authorization Enforcement: Document relationship authorization
- Transaction Boundary: NOT_APPLICABLE
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit sensitive downloads if required; redact URL
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 10
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-013
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-SUB-001 — Submission Pins Exact Version

- Statement: Submission pins exact DocumentVersion; creating V2 never moves an existing Submission from V1; official submission target cannot be updated.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M11 Documents
- Supporting Modules: M09, M04, M16
- Aggregate: submissions
- Tables: submissions; document_versions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK document_version_id; UQ(project,requirement,attempt); immutable target
- Application Enforcement: Submission create uses version id snapshot
- Authorization Enforcement: Project submit permission
- Transaction Boundary: Submission create transaction
- Concurrency Strategy: UNIQUE + ROW_LOCK deadline/attempt
- Idempotency Strategy: Scoped idempotency
- Outbox Requirement: Outbox for official submission
- Audit Requirement: Audit required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 11
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-SUB-002 — Submission Attempt Integrity

- Statement: Duplicate/replayed submission attempt is controlled; deadline/timezone uses approved policy.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Business Invariant
- Owner Module: M11 Documents
- Supporting Modules: M07, M09, M04
- Aggregate: submissions
- Tables: submissions; academic_campaigns
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(project,requirement,attempt); deadline fields
- Application Enforcement: Submission policy validates attempt/deadline
- Authorization Enforcement: Submit permission
- Transaction Boundary: Submission transaction
- Concurrency Strategy: UNIQUE + clock policy
- Idempotency Strategy: Scoped idempotency
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit submit/withdraw
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 11
- Design Status: NEEDS_APPROVAL
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: OD-003
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-FB-001 — Feedback Pins Exact Target

- Statement: Feedback pins exact resource/version target, cannot be retargeted after creation, and visibility follows relationship/assignment.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M12 Feedback
- Supporting Modules: M09, M11, M04
- Aggregate: feedback_items
- Tables: feedback_items; documents; document_versions; projects
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK target/version; parent_id FK; immutable target policy
- Application Enforcement: Feedback create/resolution use case
- Authorization Enforcement: Project/document relationship authorization
- Transaction Boundary: Feedback create transaction
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: Idempotency optional
- Outbox Requirement: Notification optional
- Audit Requirement: Audit important revision requests
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 11
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-REV-001 — Published Rubric Version Immutability

- Statement: Published RubricVersion is immutable; Rubric is logical aggregate root; RubricCriterion code is unique per rubric_version_id.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M13 Review
- Supporting Modules: M16
- Aggregate: rubrics
- Tables: rubrics; rubric_versions; rubric_criteria
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(rubric,version); UQ(rubric_version,criterion_code); immutable published policy
- Application Enforcement: Rubric publish creates new version
- Authorization Enforcement: Rubric admin/coordinator permission
- Transaction Boundary: Publish transaction
- Concurrency Strategy: OPTIMISTIC_VERSION
- Idempotency Strategy: Idempotency optional
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit publish/update
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: OD-005
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-REV-002 — Review Assignment Pinning

- Statement: ReviewAssignment pins Submission, RubricVersion, Reviewer and Round; mutable current target/rubric is never used.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M13 Review
- Supporting Modules: M11, M07, M04
- Aggregate: review_assignments
- Tables: review_assignments; submissions; rubric_versions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK submission_id/reviewer/rubric_version; UQ(target,reviewer,round)
- Application Enforcement: Assignment command pins IDs
- Authorization Enforcement: Reviewer assignment permission
- Transaction Boundary: Assignment transaction
- Concurrency Strategy: UNIQUE
- Idempotency Strategy: Idempotency optional
- Outbox Requirement: Notification optional
- Audit Requirement: Audit assignment
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-REV-003 — Reviewer Assignment Ownership

- Statement: Reviewer can create/update Review only for assigned ReviewAssignment in scope.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Authorization Invariant
- Owner Module: M13 Review
- Supporting Modules: M04, M03
- Aggregate: review_assignments
- Tables: review_assignments; reviews
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK review_assignment_id; UQ assignment/attempt
- Application Enforcement: Review draft/submit checks assigned reviewer
- Authorization Enforcement: Reviewer relationship authorization
- Transaction Boundary: Review transaction
- Concurrency Strategy: OPTIMISTIC_VERSION on review draft
- Idempotency Strategy: Idempotency submit optional
- Outbox Requirement: Outbox submit optional
- Audit Requirement: Audit submit
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: FORBIDDEN
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-REV-004 — Submitted Review Immutability

- Statement: Review in SUBMITTED/LOCKED state is not directly edited; correction uses approved workflow; score belongs to same Review and RubricCriterion/version.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M13 Review
- Supporting Modules: M16
- Aggregate: reviews
- Tables: reviews; review_scores; rubric_criteria
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: status CHECK; FK score review/criterion; no direct update policy
- Application Enforcement: State machine forbids edit after submit/lock
- Authorization Enforcement: Reviewer/admin policy per correction
- Transaction Boundary: Submit/lock transaction
- Concurrency Strategy: OPTIMISTIC_VERSION
- Idempotency Strategy: Idempotency submit
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit correction/submit
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-REV-005 — Score Integrity

- Statement: Score range and criterion match the pinned RubricVersion; aggregation is deterministic.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Data Integrity Invariant
- Owner Module: M13 Review
- Supporting Modules: M14
- Aggregate: review_scores
- Tables: review_scores; rubric_criteria; rubric_versions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: CHECK score range; FK criterion; app verifies criterion belongs pinned version
- Application Enforcement: Score validation and deterministic aggregation
- Authorization Enforcement: Reviewer assignment authorization
- Transaction Boundary: Review submit transaction validates all scores
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: Idempotency submit
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit submit/final aggregate
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: OD-005
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-EVA-001 — Evaluation Finalize Guard

- Statement: Evaluation finalizes only when review/rubric/assignment conditions satisfy approved quorum/COI/rubric policy.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Business Invariant
- Owner Module: M14 Evaluation
- Supporting Modules: M13, M11, M04, M16
- Aggregate: evaluations
- Tables: evaluations; reviews; review_assignments; rubric_versions
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(project,round); state CHECK
- Application Enforcement: Finalize guard checks reviews/quorum/COI/rubric
- Authorization Enforcement: Finalize permission
- Transaction Boundary: Finalize transaction
- Concurrency Strategy: ROW_LOCK/COMPARE_AND_SET evaluation state
- Idempotency Strategy: Scoped idempotency
- Outbox Requirement: Outbox final result
- Audit Requirement: Audit required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: POLICY_NOT_SATISFIED
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: NEEDS_APPROVAL
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: OD-005; OD-006; OD-007
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-EVA-002 — Finalized Evaluation Immutability

- Statement: FINALIZED Evaluation is not directly updated; official result preserves history.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M14 Evaluation
- Supporting Modules: M16
- Aggregate: evaluations
- Tables: evaluations; evaluation_amendments
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: state CHECK; immutable finalized policy
- Application Enforcement: No direct update path after finalize
- Authorization Enforcement: Evaluation admin/coordinator policy
- Transaction Boundary: Finalize transaction
- Concurrency Strategy: COMPARE_AND_SET state
- Idempotency Strategy: Idempotency finalize
- Outbox Requirement: Outbox final result
- Audit Requirement: Audit required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-EVA-003 — Appeal Does Not Mutate Evaluation

- Statement: EvaluationAppeal is review request only; it does not directly mutate Evaluation; decision has actor/reason/evidence.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M14 Evaluation
- Supporting Modules: M04, M16
- Aggregate: evaluation_appeals
- Tables: evaluation_appeals; evaluations
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: FK evaluation; status CHECK; decision evidence fields
- Application Enforcement: Appeal submit/decision use case
- Authorization Enforcement: Appeal/decision permission
- Transaction Boundary: Appeal decision transaction
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: Idempotency optional
- Outbox Requirement: Outbox optional
- Audit Requirement: Audit required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: NEEDS_APPROVAL
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: OD-003
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-EVA-004 — Append-Only Amendment

- Statement: Official change after finalize uses append-only EvaluationAmendment linked to Evaluation with reason/evidence; old amendment is not overwritten.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M14 Evaluation
- Supporting Modules: M16
- Aggregate: evaluation_amendments
- Tables: evaluation_amendments; evaluations
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: UQ(evaluation,sequence); append-only row
- Application Enforcement: Amendment command appends only
- Authorization Enforcement: Authorized correction permission
- Transaction Boundary: Amendment transaction
- Concurrency Strategy: UNIQUE sequence + ROW_LOCK
- Idempotency Strategy: Idempotency optional
- Outbox Requirement: Outbox correction event
- Audit Requirement: Audit required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-EVA-005 — Result Visibility

- Statement: Student sees result only when release/visibility state allows; policy not inferred when source is undecided.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Authorization Invariant
- Owner Module: M14 Evaluation
- Supporting Modules: M04, M09
- Aggregate: evaluations
- Tables: evaluations; project_memberships
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: visibility/release state fields planned
- Application Enforcement: Result query checks visibility policy
- Authorization Enforcement: Project/student relationship authorization
- Transaction Boundary: NOT_APPLICABLE
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: Notification optional
- Audit Requirement: Audit visibility changes if critical
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: FORBIDDEN/POLICY_NOT_SATISFIED
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 12
- Design Status: NEEDS_APPROVAL
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007
- Open Decision: OD-003/OD-006 if release tied to policy
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-NOT-001 — Notification Is a Side Effect

- Statement: Notification is side effect, not business commit condition; failure does not lose committed business state and never mutates aggregate.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Reliability Invariant
- Owner Module: M15 Communication/Notification
- Supporting Modules: M01, event producers
- Aggregate: notifications
- Tables: notifications; outbox_events
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: notification status/dedupe fields
- Application Enforcement: Notification worker consumes event after commit
- Authorization Enforcement: Recipient visibility for notification read
- Transaction Boundary: Notification delivery transaction separate from business commit
- Concurrency Strategy: Retry state/dedupe
- Idempotency Strategy: Consumer idempotency
- Outbox Requirement: Primary delivery mechanism
- Audit Requirement: Audit only for operational evidence if needed
- Worker Interaction: Worker later dispatches notifications through M15 contract
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 13
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: NOT_IMPLEMENTED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: F-DB-007; F-DB-008 for outbox foundation
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-AUD-001 — Critical Audit Atomicity

- Statement: Critical transition writes audit with actor, action/transition, target, reason and correlation in same business transaction when source requires; audit does not replace outbox.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M16 Audit/Operations
- Supporting Modules: M01 and business owners
- Aggregate: audit_logs
- Tables: audit_logs; business table; outbox_events
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: audit_logs append row; FK/resource refs; redaction policy
- Application Enforcement: Owner use case writes audit record
- Authorization Enforcement: Actor/context required
- Transaction Boundary: Same transaction as critical mutation when required
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: Outbox separate when side effect exists
- Audit Requirement: PRIMARY
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 13 hardening; applied earlier where critical
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: PARTIALLY_ENFORCED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: audit_logs runtime table observed; no critical use case evidence
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-AUD-002 — Append-Only Audit

- Statement: Audit record is append-only and cannot be edited to change history; audit payload must not include sensitive data.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Historical Invariant
- Owner Module: M16 Audit/Operations
- Supporting Modules: M01
- Aggregate: audit_logs
- Tables: audit_logs
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: append-only policy; no update path; retention policy
- Application Enforcement: Audit writer redacts sensitive fields
- Authorization Enforcement: Audit read authorization
- Transaction Boundary: Audit write in owner transaction
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: PRIMARY
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: Phase 13
- Design Status: DESIGN_LOCKED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: PARTIALLY_ENFORCED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: audit_logs runtime table exists; update policy/test missing
- Open Decision: none
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-SRCH-001 — Permission-Aware Search

- Statement: Search is OPTIONAL after Phase 13 gate, returns only authorized data, and index/read model is not canonical owner.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M17 Search
- Supporting Modules: M04 and provider read contracts
- Aggregate: search_documents
- Tables: search_documents; search_chunks optional
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: Optional read model only
- Application Enforcement: Permission-filtered indexing/query
- Authorization Enforcement: M04/provider authorization
- Transaction Boundary: NOT_APPLICABLE
- Concurrency Strategy: Reindex idempotency if adopted
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit search access if required
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: After Phase 13 gate
- Design Status: DEFERRED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: DEFERRED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: OD-008; no runtime observed
- Open Decision: OD-008
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

### INV-AI-001 — Advisory-Only AI

- Statement: AI/RAG is OPTIONAL/advisory, retrieval is permission-aware with citation/evidence, and AI cannot approve, grade, finalize, mutate state or bypass authorization.
- Business Rationale: Preserves correctness, authorization, history or evidence for the academic lifecycle.
- Invariant Type: Security Invariant
- Owner Module: M18 AI/RAG
- Supporting Modules: M04, M17 optional, provider read contracts
- Aggregate: ai_assistance_runs optional
- Tables: ai_assistance_runs optional; vector_embeddings deferred
- Triggering Commands/Transitions: Create/update/transition commands touching this aggregate; exact FR/API mapping deferred to P0-010.
- Preconditions: Authenticated actor, valid tenant/resource context and source-specific state guard.
- Postconditions: Invariant remains true after commit, retry and failed side effect.
- Database Enforcement: Optional run/evidence table only if approved
- Application Enforcement: Advisory service refuses without evidence
- Authorization Enforcement: Permission-aware retrieval
- Transaction Boundary: NOT_APPLICABLE
- Concurrency Strategy: NOT_APPLICABLE
- Idempotency Strategy: NOT_APPLICABLE
- Outbox Requirement: NOT_APPLICABLE
- Audit Requirement: Audit AI assistance if adopted
- Worker Interaction: NOT_APPLICABLE
- Failure/Error Direction: CONFLICT/INVALID_STATE/FORBIDDEN as appropriate
- Unit Test Evidence: PLANNED
- Integration Test Evidence: PLANNED
- API/Security Test Evidence: PLANNED
- E2E Evidence: PLANNED
- Implementation Phase: After Phase 13 gate
- Design Status: DEFERRED
- Runtime Evidence: See runtime status and related finding; Phase 0 did not execute tests.
- Runtime Status: DEFERRED
- Related FR/API/UI: NEEDS_TRACE_P0-010
- Related Finding: OD-009; no runtime observed
- Open Decision: OD-009
- Explicit Non-Guarantees: Runtime not claimed enforced in Phase 0
- Source References: `docs/BaoCaoKhoaLuan.docx`; Phase 0 derived artifacts listed in Source References.

## Enforcement Matrix

| Invariant ID | DB Constraint | Application Guard | Authorization Guard | Transaction | Concurrency | Outbox | Audit | Test Level | Phase |
|---|---|---|---|---|---|---|---|---|---|
| INV-FND-001 | FK/aggregate refs | Outbox writer in owning use case | NOT_APPLICABLE | Same DB transaction as business mutation | ROW_LOCK/claim status for worker; consumer idempotency | REQUIRED | Critical mutation audit where required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 1 foundation; applies Phase 2–13 |
| INV-FND-002 | UNIQUE(scope,key,operation) and request_hash/status fields planned | Idempotency middleware/use case check payload hash and cached result | NOT_APPLICABLE | Command transaction records idempotency result atomically | UNIQUE + ROW_LOCK/COMPARE_AND_SET | Optional outbox only for emitted events | Audit conflict/replay where security relevant | Unit:ARTIFACT_OBSERVED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 1 foundation; applies to critical commands |
| INV-FND-003 | UNIQUE/FK/CHECK per flow | State machine guard in owner use case | Owner module supplies resource context | Owner-specific transaction boundary | ROW_LOCK/OPTIMISTIC_VERSION/COMPARE_AND_SET chosen per flow | REQUIRED when side effect exists | REQUIRED for critical transition | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 1 foundation; applies Phase 7–13 |
| INV-FND-004 | NOT_APPLICABLE | Logger/error handler redaction policy | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | Audit must avoid sensitive payload | Unit:ARTIFACT_OBSERVED; Integration:PLANNED; API:ARTIFACT_OBSERVED; E2E:PLANNED | Phase 1 and Phase 13 hardening |
| INV-FND-005 | Allowed SQL only for owned operational rows | Worker jobs call public contracts for business actions | NOT_APPLICABLE | Worker transaction only for operational claim/update | FOR UPDATE SKIP LOCKED for outbox claim | PRIMARY | Worker errors/audit per job policy | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 1 worker foundation; Phase 13 hardening |
| INV-ID-001 | accounts no tenant_id | Auth returns account identity only | Tenant membership required for org access | Session/account creation separate from membership | NOT_APPLICABLE | NOT_APPLICABLE | Audit login/member actions separately | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 2 + Phase 3 |
| INV-ID-002 | FK account_id | Password hashing/verification service | NOT_APPLICABLE | Credential update isolated in Identity transaction | COMPARE_AND_SET/rotation policy | NOT_APPLICABLE | Audit credential lifecycle without secret | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 2 |
| INV-ID-003 | token_hash UNIQUE | Consume-once use case validates hash/status/expiry | NOT_APPLICABLE | Consume transition transaction | COMPARE_AND_SET status consume | NOT_APPLICABLE | Audit token consumption without token value | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 2 |
| INV-ID-004 | refresh/session hash unique | Refresh rotation and reuse detection | Tenant selection via active membership only | Rotate/revoke in transaction | COMPARE_AND_SET token status | NOT_APPLICABLE | Audit refresh/reuse events | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 2 |
| INV-TEN-001 | UNIQUE(organization_id,account_id) | Membership create/accept checks existing membership | Admin or invite accept guard | Membership accept transaction | UNIQUE + ROW_LOCK on accept | Optional notification event | Audit membership transition | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 3 |
| INV-TEN-002 | membership status CHECK/index | Tenant-context resolver verifies active membership each request | M04 receives active context only | NOT_APPLICABLE | Cache invalidation/reload on revoke | NOT_APPLICABLE | Audit revoke/suspend | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 3 |
| INV-TEN-003 | FK session/account + membership relation planned | Context resolver ignores body/header tenantId as authority | Deny if no active membership | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | Audit tenant switch | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 3 |
| INV-TEN-004 | tenant/org FK or parent-derived FK | Repository/query contract always scopes tenant | M04 tenant + relationship guard | Use case-owned transaction | NOT_APPLICABLE | NOT_APPLICABLE | Audit cross-tenant denies where required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 3 onward |
| INV-TEN-005 | UNIQUE(org,email,active) | Accept/revoke invitation use cases | Invite admin permission | Accept transaction creates/links membership | COMPARE_AND_SET invite status | Notification optional | Audit invite lifecycle | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 3 |
| INV-AUTH-001 | role/permission/scope FK and status checks | Policy contract returns allow only with full context | Deny-by-default middleware/policy | NOT_APPLICABLE | Cache invalidation on revoke | NOT_APPLICABLE | Audit denied/critical allowed actions | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 4 onward |
| INV-AUTH-002 | FK/unique | Role assignment command checks actor target and permission | Admin scope required; student denied | Transaction for assignment mutation | NOT_APPLICABLE | Outbox notification optional | Audit role/structure mutation | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 4/5 |
| INV-AUTH-003 | FK role_assignment_id | Scope validation policy | M04 policy guard | Assignment transaction | UNIQUE | NOT_APPLICABLE | Audit assignment changes | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 4 |
| INV-AUTH-004 | status/effective window fields/indexes | Permission resolver reloads/checks revocation state | Deny revoked state | Revocation transaction | Cache version/short TTL | Optional revoke notification | Audit revocation | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 4 onward |
| INV-AUTH-005 | FK references only | Resource module supplies context to policy | M04 evaluates permission with context | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | Audit critical auth decisions where needed | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 4 onward |
| INV-ACD-001 | No DB-only guarantee | Academic unit create command checks role/scope | Student denied; admin/coordinator allowed | Create/update transaction | NOT_APPLICABLE | NOT_APPLICABLE | Audit structure mutation | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 5 |
| INV-ACD-002 | FK parent_id | Hierarchy service validates type and cycle | Scoped admin permission | Hierarchy mutation transaction | ROW_LOCK/COMPARE_AND_SET on hierarchy path | NOT_APPLICABLE | Audit hierarchy mutation | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 5 |
| INV-ACD-003 | FK profile/unit | Placement command appends/ends records | Profile management permission | Placement update transaction | EXCLUSION/ROW_LOCK or policy check | NOT_APPLICABLE | Audit placement changes | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 5 |
| INV-CAM-001 | UQ(template,version) | Publish/update commands branch new version | Campaign admin/coordinator permission | Publish transaction | OPTIMISTIC_VERSION/COMPARE_AND_SET | Outbox for publish optional | Audit publish/update | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 6 |
| INV-CAM-002 | FK campaign_template_version_id | Campaign create/open uses pinned version read model | Scoped campaign permission | Campaign create transaction | NOT_APPLICABLE | Outbox optional | Audit campaign create/open | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 6 |
| INV-CAM-003 | state CHECK | State machine guard | Campaign relationship/state authorization | Campaign transition transaction | OPTIMISTIC_VERSION | Lifecycle notifications after commit | Audit required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 6 |
| INV-CAM-004 | UQ(campaign,membership) | Eligibility/snapshot service | Participant management permission | Participant mutation transaction | UNIQUE + ROW_LOCK | Notification optional | Audit participant changes | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 6 |
| INV-TOP-001 | UNIQUE(source_proposal_id) or equivalent | Approve use case materializes idempotently | Topic approval permission | Proposal decision + topic create in one transaction | UNIQUE + ROW_LOCK | Outbox for approval optional/required by notification | Audit decision required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 7 |
| INV-TOP-002 | append decision row | Decision command requires reason where policy says | Approver permission | Decision transaction | NOT_APPLICABLE | Outbox optional | Audit/decision evidence required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 7 |
| INV-TOP-003 | Registration FK targets only approved CampaignTopic | M09 queries M08 approved topic contract | Registration permission + topic visibility | Registration transaction checks approved topic | NOT_APPLICABLE | Outbox optional | Audit rejected attempts optional | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 7/8 |
| INV-PRJ-001 | UNIQUE(source_registration_id) | Approve registration use case owns project creation | Coordinator/admin permission + relationship/state | Registration approve + Project create in one transaction | UNIQUE + ROW_LOCK | Outbox required for downstream notifications | Audit required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 8 |
| INV-PRJ-002 | UQ(registration,membership) | Registration command validates team/capacity/eligibility | Participant/project permission | Registration submit/approve transaction | UNIQUE | Outbox optional | Audit registration transitions | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 8 |
| INV-PRJ-003 | UQ(project,membership) | Membership command manages official team | Project relationship authorization | Membership mutation transaction | UNIQUE | Notification optional | Audit membership changes | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 9 |
| INV-PRJ-004 | UQ active(project,lecturer,role) | Supervisor assignment command validates lecturer/capacity | Coordinator/admin permission | Assignment transaction | ROW_LOCK on lecturer capacity | Notification optional | Audit assignment/revoke | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 9 |
| INV-WRK-001 | FK project/milestone/author | Progress command appends update | Project member/supervisor permission | Update transaction | NOT_APPLICABLE | Notification optional | Audit important updates optional | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 9 |
| INV-DOC-001 | object_key UNIQUE | Upload session builder scopes key | Reauthorize project/document access | Upload/session transaction | NOT_APPLICABLE | Outbox optional | Audit access where required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 10 |
| INV-DOC-002 | UQ(document,version_no) | Complete use case validates status/checksum/MIME/size/expiry | Uploader/project permission | Upload state + version create transaction | COMPARE_AND_SET upload status + UNIQUE | Outbox optional | Audit complete/abort | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 10 |
| INV-DOC-003 | UQ(document,version_no) | No update path for finalized version metadata | Document owner/project permission | Version create transaction | OPTIMISTIC_VERSION on document version counter | Outbox optional | Audit version creation | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 10 |
| INV-DOC-004 | upload_session expiry/size/checksum fields | Presigned URL issue/complete flow | Upload/download authorization | Complete transaction after object HEAD/check | COMPARE_AND_SET upload status | Outbox optional | Audit complete/abort | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 10 |
| INV-DOC-005 | NOT_APPLICABLE DB-only | Download command re-checks authorization before presign | Document relationship authorization | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | Audit sensitive downloads if required; redact URL | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 10 |
| INV-SUB-001 | FK document_version_id | Submission create uses version id snapshot | Project submit permission | Submission create transaction | UNIQUE + ROW_LOCK deadline/attempt | Outbox for official submission | Audit required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 11 |
| INV-SUB-002 | UQ(project,requirement,attempt) | Submission policy validates attempt/deadline | Submit permission | Submission transaction | UNIQUE + clock policy | Outbox optional | Audit submit/withdraw | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 11 |
| INV-FB-001 | FK target/version | Feedback create/resolution use case | Project/document relationship authorization | Feedback create transaction | NOT_APPLICABLE | Notification optional | Audit important revision requests | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 11 |
| INV-REV-001 | UQ(rubric,version) | Rubric publish creates new version | Rubric admin/coordinator permission | Publish transaction | OPTIMISTIC_VERSION | Outbox optional | Audit publish/update | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-REV-002 | FK submission_id/reviewer/rubric_version | Assignment command pins IDs | Reviewer assignment permission | Assignment transaction | UNIQUE | Notification optional | Audit assignment | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-REV-003 | FK review_assignment_id | Review draft/submit checks assigned reviewer | Reviewer relationship authorization | Review transaction | OPTIMISTIC_VERSION on review draft | Outbox submit optional | Audit submit | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-REV-004 | status CHECK | State machine forbids edit after submit/lock | Reviewer/admin policy per correction | Submit/lock transaction | OPTIMISTIC_VERSION | Outbox optional | Audit correction/submit | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-REV-005 | CHECK score range | Score validation and deterministic aggregation | Reviewer assignment authorization | Review submit transaction validates all scores | NOT_APPLICABLE | Outbox optional | Audit submit/final aggregate | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-EVA-001 | UQ(project,round) | Finalize guard checks reviews/quorum/COI/rubric | Finalize permission | Finalize transaction | ROW_LOCK/COMPARE_AND_SET evaluation state | Outbox final result | Audit required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-EVA-002 | state CHECK | No direct update path after finalize | Evaluation admin/coordinator policy | Finalize transaction | COMPARE_AND_SET state | Outbox final result | Audit required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-EVA-003 | FK evaluation | Appeal submit/decision use case | Appeal/decision permission | Appeal decision transaction | NOT_APPLICABLE | Outbox optional | Audit required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-EVA-004 | UQ(evaluation,sequence) | Amendment command appends only | Authorized correction permission | Amendment transaction | UNIQUE sequence + ROW_LOCK | Outbox correction event | Audit required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-EVA-005 | visibility/release state fields planned | Result query checks visibility policy | Project/student relationship authorization | NOT_APPLICABLE | NOT_APPLICABLE | Notification optional | Audit visibility changes if critical | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 12 |
| INV-NOT-001 | notification status/dedupe fields | Notification worker consumes event after commit | Recipient visibility for notification read | Notification delivery transaction separate from business commit | Retry state/dedupe | Primary delivery mechanism | Audit only for operational evidence if needed | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 13 |
| INV-AUD-001 | audit_logs append row | Owner use case writes audit record | Actor/context required | Same transaction as critical mutation when required | NOT_APPLICABLE | Outbox separate when side effect exists | PRIMARY | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 13 hardening; applied earlier where critical |
| INV-AUD-002 | append-only policy | Audit writer redacts sensitive fields | Audit read authorization | Audit write in owner transaction | NOT_APPLICABLE | NOT_APPLICABLE | PRIMARY | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | Phase 13 |
| INV-SRCH-001 | Optional read model only | Permission-filtered indexing/query | M04/provider authorization | NOT_APPLICABLE | Reindex idempotency if adopted | NOT_APPLICABLE | Audit search access if required | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | After Phase 13 gate |
| INV-AI-001 | Optional run/evidence table only if approved | Advisory service refuses without evidence | Permission-aware retrieval | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | Audit AI assistance if adopted | Unit:PLANNED; Integration:PLANNED; API:PLANNED; E2E:PLANNED | After Phase 13 gate |

## Database Enforcement Audit

| Invariant ID | Expected DB Evidence | Runtime DB Evidence | Status | Finding |
|---|---|---|---|---|
| INV-FND-001 | FK/aggregate refs; status CHECK; append/retention policy planned | Runtime inspected read-only; no full DB/test evidence in Phase 0. | PARTIALLY_ENFORCED | F-DB-008; MODULE_DEPENDENCIES RT-009 |
| INV-FND-002 | UNIQUE(scope,key,operation) and request_hash/status fields planned; runtime has `@@unique([scope,key])` only | Runtime inspected read-only; no full DB/test evidence in Phase 0. | PARTIALLY_ENFORCED | DATABASE_MANIFEST_AUDIT F-DB-010; runtime idempotencyKey.test observes header validation only |
| INV-FND-003 | UNIQUE/FK/CHECK per flow | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | DATABASE_MANIFEST_AUDIT F-DB-007 |
| INV-FND-004 | NOT_APPLICABLE | Runtime inspected read-only; no full DB/test evidence in Phase 0. | PARTIALLY_ENFORCED | runtime `errorHandler.test.ts`; no full log-redaction proof |
| INV-FND-005 | Allowed SQL only for owned operational rows | Runtime inspected read-only; no full DB/test evidence in Phase 0. | PARTIALLY_ENFORCED | F-DB-008; MODULE_DEPENDENCIES RT-009 |
| INV-ID-001 | accounts no tenant_id; tenant_memberships UNIQUE(org,account) | Runtime inspected read-only; no full DB/test evidence in Phase 0. | VIOLATED_BY_RUNTIME | F-DB-002; F-DB-003; users.tenant_id |
| INV-ID-002 | FK account_id; hash non-null; no tenant auth column | Runtime inspected read-only; no full DB/test evidence in Phase 0. | PARTIALLY_ENFORCED | runtime password/token helpers; schema merged into users |
| INV-ID-003 | token_hash UNIQUE; status/expiry CHECK | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-002 |
| INV-ID-004 | refresh/session hash unique; status/expiry; no fixed tenant authority | Runtime inspected read-only; no full DB/test evidence in Phase 0. | VIOLATED_BY_RUNTIME | F-DB-002; F-DB-003; refresh_tokens.tenant_id |
| INV-TEN-001 | UNIQUE(organization_id,account_id); status history/audit | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007; F-DB-002 name mismatch |
| INV-TEN-002 | membership status CHECK/index | Runtime inspected read-only; no full DB/test evidence in Phase 0. | PARTIALLY_ENFORCED | auth repository filters tenant active, but no membership model |
| INV-TEN-003 | FK session/account + membership relation planned | Runtime inspected read-only; no full DB/test evidence in Phase 0. | VIOLATED_BY_RUNTIME | INV-ID-001/F-DB-003; token contains tenantId |
| INV-TEN-004 | tenant/org FK or parent-derived FK; indexes | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | DATABASE_MANIFEST_AUDIT tenant scope audit |
| INV-TEN-005 | UNIQUE(org,email,active); expiry/status CHECK | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-AUTH-001 | role/permission/scope FK and status checks | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | MODULE_DEPENDENCIES RT-004 auth coupling risk |
| INV-AUTH-002 | FK/unique; no DB-only guarantee | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-AUTH-003 | FK role_assignment_id; UQ(assign,scope_type,scope_id); tenant scope check | Runtime inspected read-only; no full DB/test evidence in Phase 0. | VIOLATED_BY_RUNTIME | F-DB-005; runtime user_roles inline scopes |
| INV-AUTH-004 | status/effective window fields/indexes | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-AUTH-005 | FK references only; no ownership transfer | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | MODULE_DEPENDENCIES FDM-003 |
| INV-ACD-001 | No DB-only guarantee | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | OD-002; F-DB-007 |
| INV-ACD-002 | FK parent_id; UQ(org,parent,type,code); cycle guard via app/recursive check | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-ACD-003 | FK profile/unit; valid_from/to; EXCLUSION or app overlap guard planned | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007; policy detail needs approval if overlap allowed |
| INV-CAM-001 | UQ(template,version); published status immutable policy | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-CAM-002 | FK campaign_template_version_id; NOT NULL | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-CAM-003 | state CHECK; optimistic version planned | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-CAM-004 | UQ(campaign,membership); snapshot fields | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-TOP-001 | UNIQUE(source_proposal_id) or equivalent | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-TOP-002 | append decision row; FK proposal/actor | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-TOP-003 | Registration FK targets only approved CampaignTopic | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | MODULE_DEPENDENCIES FDM-005 |
| INV-PRJ-001 | UNIQUE(source_registration_id); FK campaign/topic; state CHECK | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-PRJ-002 | UQ(registration,membership); capacity check policy | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-PRJ-003 | UQ(project,membership); status check | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-PRJ-004 | UQ active(project,lecturer,role); status/effective fields | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007; policy detail may need approval |
| INV-WRK-001 | FK project/milestone/author; append row; status CHECK | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-DOC-001 | object_key UNIQUE; tenant/project path metadata | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-013; MinIO/S3 no runtime evidence |
| INV-DOC-002 | UQ(document,version_no); upload status/expiry CHECK | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-DOC-003 | UQ(document,version_no); immutable row policy | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-DOC-004 | upload_session expiry/size/checksum fields | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-013 |
| INV-DOC-005 | NOT_APPLICABLE DB-only | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-013 |
| INV-SUB-001 | FK document_version_id; UQ(project,requirement,attempt); immutable target | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-SUB-002 | UQ(project,requirement,attempt); deadline fields | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-FB-001 | FK target/version; parent_id FK; immutable target policy | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-001 | UQ(rubric,version); UQ(rubric_version,criterion_code); immutable published policy | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-002 | FK submission_id/reviewer/rubric_version; UQ(target,reviewer,round) | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-003 | FK review_assignment_id; UQ assignment/attempt | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-004 | status CHECK; FK score review/criterion; no direct update policy | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-REV-005 | CHECK score range; FK criterion; app verifies criterion belongs pinned version | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-001 | UQ(project,round); state CHECK | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-002 | state CHECK; immutable finalized policy | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-003 | FK evaluation; status CHECK; decision evidence fields | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-004 | UQ(evaluation,sequence); append-only row | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-EVA-005 | visibility/release state fields planned | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007 |
| INV-NOT-001 | notification status/dedupe fields | Runtime inspected read-only; no full DB/test evidence in Phase 0. | NOT_IMPLEMENTED | F-DB-007; F-DB-008 for outbox foundation |
| INV-AUD-001 | audit_logs append row; FK/resource refs; redaction policy | Runtime inspected read-only; no full DB/test evidence in Phase 0. | PARTIALLY_ENFORCED | audit_logs runtime table observed; no critical use case evidence |
| INV-AUD-002 | append-only policy; no update path; retention policy | Runtime inspected read-only; no full DB/test evidence in Phase 0. | PARTIALLY_ENFORCED | audit_logs runtime table exists; update policy/test missing |
| INV-SRCH-001 | Optional read model only | Runtime inspected read-only; no full DB/test evidence in Phase 0. | DEFERRED | OD-008; no runtime observed |
| INV-AI-001 | Optional run/evidence table only if approved | Runtime inspected read-only; no full DB/test evidence in Phase 0. | DEFERRED | OD-009; no runtime observed |

## Application Enforcement Audit

| Invariant ID | Expected Application Guard | Observed Artifact | Runtime Status | Follow-up |
|---|---|---|---|---|
| INV-FND-001 | Outbox writer in owning use case | No owner use case observed yet. | PARTIALLY_ENFORCED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-FND-002 | Idempotency middleware/use case check payload hash and cached result | `apps/api/src/common/idempotency/idempotencyKey.ts`; `apps/api/tests/idempotencyKey.test.ts` validate key shape only. | PARTIALLY_ENFORCED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-FND-003 | State machine guard in owner use case | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-FND-004 | Logger/error handler redaction policy | `errorHandler.test.ts`, security middleware tests; no complete log redaction proof. | PARTIALLY_ENFORCED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-FND-005 | Worker jobs call public contracts for business actions | `apps/worker/src/index.ts` touches `outbox_events` only. | PARTIALLY_ENFORCED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-ID-001 | Auth returns account identity only; tenant context resolved separately | `apps/api/src/common/auth/token.ts`; `apps/api/src/modules/auth/auth.repository.ts` show tenant-bound runtime auth. | VIOLATED_BY_RUNTIME | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-ID-002 | Password hashing/verification service | No owner use case observed yet. | PARTIALLY_ENFORCED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-ID-003 | Consume-once use case validates hash/status/expiry | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-ID-004 | Refresh rotation and reuse detection | `apps/api/src/common/auth/token.ts`; `apps/api/src/modules/auth/auth.repository.ts` show tenant-bound runtime auth. | VIOLATED_BY_RUNTIME | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-TEN-001 | Membership create/accept checks existing membership | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-TEN-002 | Tenant-context resolver verifies active membership each request | No owner use case observed yet. | PARTIALLY_ENFORCED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-TEN-003 | Context resolver ignores body/header tenantId as authority | `apps/api/src/common/auth/token.ts`; `apps/api/src/modules/auth/auth.repository.ts` show tenant-bound runtime auth. | VIOLATED_BY_RUNTIME | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-TEN-004 | Repository/query contract always scopes tenant | No owner use case observed yet. | NEEDS_TEST_EVIDENCE | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-TEN-005 | Accept/revoke invitation use cases | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-AUTH-001 | Policy contract returns allow only with full context | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-AUTH-002 | Role assignment command checks actor target and permission | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-AUTH-003 | Scope validation policy | `apps/api/prisma/schema.prisma` runtime `UserRole` inline scope fields. | VIOLATED_BY_RUNTIME | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-AUTH-004 | Permission resolver reloads/checks revocation state | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-AUTH-005 | Resource module supplies context to policy | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-ACD-001 | Academic unit create command checks role/scope | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-ACD-002 | Hierarchy service validates type and cycle | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-ACD-003 | Placement command appends/ends records | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-CAM-001 | Publish/update commands branch new version | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-CAM-002 | Campaign create/open uses pinned version read model | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-CAM-003 | State machine guard | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-CAM-004 | Eligibility/snapshot service | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-TOP-001 | Approve use case materializes idempotently | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-TOP-002 | Decision command requires reason where policy says | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-TOP-003 | M09 queries M08 approved topic contract | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-PRJ-001 | Approve registration use case owns project creation | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-PRJ-002 | Registration command validates team/capacity/eligibility | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-PRJ-003 | Membership command manages official team | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-PRJ-004 | Supervisor assignment command validates lecturer/capacity | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-WRK-001 | Progress command appends update | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-DOC-001 | Upload session builder scopes key | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-DOC-002 | Complete use case validates status/checksum/MIME/size/expiry | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-DOC-003 | No update path for finalized version metadata | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-DOC-004 | Presigned URL issue/complete flow | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-DOC-005 | Download command re-checks authorization before presign | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-SUB-001 | Submission create uses version id snapshot | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-SUB-002 | Submission policy validates attempt/deadline | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-FB-001 | Feedback create/resolution use case | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-REV-001 | Rubric publish creates new version | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-REV-002 | Assignment command pins IDs | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-REV-003 | Review draft/submit checks assigned reviewer | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-REV-004 | State machine forbids edit after submit/lock | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-REV-005 | Score validation and deterministic aggregation | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-EVA-001 | Finalize guard checks reviews/quorum/COI/rubric | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-EVA-002 | No direct update path after finalize | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-EVA-003 | Appeal submit/decision use case | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-EVA-004 | Amendment command appends only | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-EVA-005 | Result query checks visibility policy | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-NOT-001 | Notification worker consumes event after commit | No owner use case observed yet. | NOT_IMPLEMENTED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-AUD-001 | Owner use case writes audit record | No owner use case observed yet. | PARTIALLY_ENFORCED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-AUD-002 | Audit writer redacts sensitive fields | No owner use case observed yet. | PARTIALLY_ENFORCED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-SRCH-001 | Permission-filtered indexing/query | No Search/AI runtime observed. | DEFERRED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |
| INV-AI-001 | Advisory service refuses without evidence | No Search/AI runtime observed. | DEFERRED | P0-017 or implementation phase; P0-010 traces FR/API/UI. |

## Transaction and Concurrency Matrix

| Flow | Invariants | Transaction Owner | Required Atomic Changes | Concurrency Hazard | Planned Control | Evidence Phase |
|---|---|---|---|---|---|---|
| Topic approval → TopicDecision + CampaignTopic + audit + outbox | INV-TOP-001; INV-TOP-002; INV-FND-001; INV-AUD-001 | M08 Topic | TopicDecision outcome, CampaignTopic materialization, audit/outbox intent | Concurrent approval/retry | UNIQUE source proposal + ROW_LOCK + scoped idempotency | Phase 7 |
| Registration approval → Project + membership basis + audit + outbox | INV-PRJ-001; INV-PRJ-002; INV-FND-003 | M09 Project | Registration approved, Project created, membership basis, audit/outbox | Double approval | UNIQUE source_registration_id + transaction lock | Phase 8 |
| Upload complete → DocumentVersion + upload state | INV-DOC-002; INV-DOC-003 | M11 Documents | UploadSession complete, DocumentVersion row | Replay complete / concurrent complete | COMPARE_AND_SET upload status + UNIQUE version | Phase 10 |
| Submission create → version pin + audit/outbox | INV-SUB-001; INV-SUB-002 | M11 Documents | Submission row pins DocumentVersion | Duplicate attempt / deadline race | UNIQUE attempt + transaction clock policy | Phase 11 |
| Review submit → Review state + scores/validation + audit | INV-REV-003; INV-REV-004; INV-REV-005 | M13 Review | Review SUBMITTED, scores validated | Double submit / score version conflict | OPTIMISTIC_VERSION + rubric version checks | Phase 12 |
| Evaluation finalize → finalized result + audit + outbox | INV-EVA-001; INV-EVA-002 | M14 Evaluation | Evaluation FINALIZED | Concurrent finalize / quorum drift | ROW_LOCK/COMPARE_AND_SET + policy guard | Phase 12 |
| Appeal decision → appeal state + evidence | INV-EVA-003 | M14 Evaluation | Appeal accepted/rejected with reason | Concurrent decisions | COMPARE_AND_SET appeal status | Phase 12 |
| Amendment → append-only amendment + audit/outbox | INV-EVA-004 | M14 Evaluation | New amendment sequence | Sequence conflict | UNIQUE(evaluation,sequence)+ROW_LOCK | Phase 12 |
| Role/membership revoke → authorization effect | INV-AUTH-004; INV-TEN-002 | M03/M04 | Revoked membership/role/scope | Stale permission cache/session | Status/effective window + request-time reload | Phase 3/4 |
| Notification delivery → outbox claim/retry | INV-NOT-001; INV-FND-001; INV-FND-005 | M01/M15 | Outbox claim, notification delivery state | Duplicate delivery | FOR UPDATE SKIP LOCKED + dedupe/idempotent consumer | Phase 13 |

## Test Evidence Matrix

| Invariant ID | Unit Test | Integration Test | API/Security Test | E2E Test | Evidence Status |
|---|---|---|---|---|---|
| INV-FND-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-FND-002 | ARTIFACT_OBSERVED | PLANNED | PLANNED | PLANNED | ARTIFACT_OBSERVED |
| INV-FND-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-FND-004 | ARTIFACT_OBSERVED | PLANNED | ARTIFACT_OBSERVED | PLANNED | ARTIFACT_OBSERVED |
| INV-FND-005 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-ID-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-ID-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-ID-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-ID-004 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-TEN-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-TEN-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-TEN-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-TEN-004 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-TEN-005 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-AUTH-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-AUTH-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-AUTH-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-AUTH-004 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-AUTH-005 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-ACD-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-ACD-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-ACD-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-CAM-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-CAM-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-CAM-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-CAM-004 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-TOP-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-TOP-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-TOP-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-PRJ-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-PRJ-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-PRJ-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-PRJ-004 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-WRK-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-DOC-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-DOC-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-DOC-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-DOC-004 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-DOC-005 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-SUB-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-SUB-002 | PLANNED | PLANNED | PLANNED | PLANNED | NEEDS_APPROVAL |
| INV-FB-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-REV-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-REV-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-REV-003 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-REV-004 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-REV-005 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-EVA-001 | PLANNED | PLANNED | PLANNED | PLANNED | NEEDS_APPROVAL |
| INV-EVA-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-EVA-003 | PLANNED | PLANNED | PLANNED | PLANNED | NEEDS_APPROVAL |
| INV-EVA-004 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-EVA-005 | PLANNED | PLANNED | PLANNED | PLANNED | NEEDS_APPROVAL |
| INV-NOT-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-AUD-001 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-AUD-002 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED |
| INV-SRCH-001 | PLANNED | PLANNED | PLANNED | PLANNED | NOT_IMPLEMENTED |
| INV-AI-001 | PLANNED | PLANNED | PLANNED | PLANNED | NOT_IMPLEMENTED |

Required future coverage includes transaction rollback, idempotency replay, concurrent approval, cross-tenant deny, IDOR, permission/scope intersection, hierarchy cycle, placement overlap, template/rubric immutability, one Project per registration, object key isolation, upload expiry/replay/checksum, Submission V1 pinning after V2, feedback exact target, submitted Review immutability, score version conflict, quorum/COI, finalized Evaluation immutability, Appeal non-mutation, Amendment append-only, outbox retry/duplicate delivery and audit redaction.

## Runtime Mismatch Register

| Finding ID | Invariant ID | Runtime Artifact | Expected Rule | Observed State | Severity | Resolution Phase | Status |
|---|---|---|---|---|---|---|---|
| F-DB-003 | INV-ID-001; INV-TEN-003 | `apps/api/prisma/schema.prisma` `User.tenantId`; `token.ts` tenantId | Account global; tenant context from active membership | tenant-bound user/token context | HIGH | P0-017 / Phase 2-3 | OPEN |
| F-DB-002 | INV-ID-002; INV-ID-004 | `users`, `refresh_tokens` | accounts/credentials/tokens/sessions split | runtime merged/renamed structure | HIGH | P0-017 | OPEN |
| F-DB-005 | INV-AUTH-003 | `user_roles` | role_assignments + role_assignment_scopes normalized | inline scope fields | MEDIUM | P0-017 / Phase 4 | OPEN |
| F-DB-009 | INV-ID-001; INV-AUTH-003 | `apps/api/prisma/seed.ts` | seed follows source-aligned demo data later | runtime seed uses tenant/user/userRole | MEDIUM | P0-017 / demo phases | OPEN |
| F-DB-010 | INV-FND-003 | migration files | migration applied only after DB verification | files exist; applied DB not inspected | INFORMATIONAL | implementation validation | ACCEPTED_BASELINE |
| F-DB-013 | INV-DOC-001; INV-DOC-004; INV-DOC-005 | MinIO/S3 runtime absence | document/object security in Phase 10 | no M11 storage runtime evidence | INFORMATIONAL | Phase 10 | NON_BLOCKING |
| F-DB-008 | INV-FND-001; INV-FND-005; INV-NOT-001 | `apps/worker/src/index.ts` | worker limited to M01 outbox or owner contract | SQL touches `outbox_events` only | LOW | P0-017 / Phase 13 | NON_BLOCKING |
| F-DB-007 | many future-phase invariants | source-only P5-P13 tables | future phase implementation | not implemented yet | INFORMATIONAL | Phase 5-13 | NON_BLOCKING |

## Open Policy Decisions

| Open Decision | Related Invariants | Current Baseline | Missing Decision | Blocks Current P0-009? | Blocks Which Phase? |
|---|---|---|---|---|---|
| OD-002 Class/Cohort | INV-ACD-001; INV-ACD-003 | Class/Cohort OPTIONAL | Whether class/cohort becomes CORE and placement scope impact | No | Phase 5 |
| OD-003 Appeal/deadline | INV-SUB-002; INV-EVA-003; INV-EVA-005 | Policy baseline noted, detail unapproved | Deadline/timezone, appeal flow, result release | No | Phase 11/12 |
| OD-004 File scanning | INV-DOC-004; INV-DOC-005 | Deferred/manual unless toolchain real | Scanner depth and malware policy | No | Phase 10 |
| OD-005 Rubric policy | INV-REV-001; INV-REV-005; INV-EVA-001 | Rubric/version pinning locked; scoring detail open | Rubric workflow/weight/aggregation detail | No | Phase 12 |
| OD-006 Quorum | INV-EVA-001 | NEEDS_APPROVAL | Reviewer/quorum requirement | No | Phase 12 |
| OD-007 Conflict-of-interest | INV-EVA-001; INV-REV-002 | NEEDS_APPROVAL | COI rule for assignment/finalize | No | Phase 12 |
| OD-008 Search gate | INV-SRCH-001 | After Phase 13 gate only | Go/no-go Search | No | After Phase 13 |
| OD-009 AI/RAG gate | INV-AI-001 | After Phase 13 gate only | Go/no-go AI/RAG | No | After Phase 13 |

## Invariant-to-Phase Matrix

| Phase | Invariants Introduced | Required Before Phase Starts | Evidence Required Before Phase Done |
|---|---|---|---|
| Phase 1 | INV-FND-001..005; INV-AUD foundation minimum | Stack/foundation rules locked | Outbox/idempotency/redaction/worker tests or evidence |
| Phase 2 | INV-ID-001..004 | Global Account baseline | Auth/session/token tests, no tenant-bound Account |
| Phase 3 | INV-TEN-001..005 | Identity context from Phase 2 | membership/tenant context/cross-tenant deny tests |
| Phase 4 | INV-AUTH-001..005 | M03 active membership | deny-by-default, scope/revoke/resource context tests |
| Phase 5 | INV-ACD-001..003 | authorization contract | hierarchy cycle/placement overlap tests |
| Phase 6 | INV-CAM-001..004 | academic profile/context | template immutable/campaign pin/state tests |
| Phase 7 | INV-TOP-001..003 | campaign lifecycle | topic approval idempotency/decision evidence tests |
| Phase 8 | INV-PRJ-001..002 | approved campaign topic | one Project per registration/concurrency tests |
| Phase 9 | INV-PRJ-003..004; INV-WRK-001 | Project aggregate | membership/supervision/progress evidence tests |
| Phase 10 | INV-DOC-001..005 | project relationship/authorization | object key isolation/upload/version/download tests |
| Phase 11 | INV-SUB-001..002; INV-FB-001 | document version | submission pinning/feedback target tests |
| Phase 12 | INV-REV-001..005; INV-EVA-001..005 | submission/review targets and policy approvals | rubric/review/evaluation/appeal/amendment tests |
| Phase 13 | INV-NOT-001; INV-AUD-001..002; hardening E2E | core workflow complete | notification/audit/redaction/E2E hardening |
| After Phase 13 gate | INV-SRCH-001; INV-AI-001 | approved OD-008/OD-009 | permission-aware Search/AI evidence |

## Failure and Error Direction

| Invariant ID | Violation Category | Expected Error Direction | HTTP Direction | Retry Safe? |
|---|---|---|---|---|
| INV-FND-001 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-FND-002 | IDEMPOTENCY_CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-FND-003 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-FND-004 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-FND-005 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-ID-001 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-ID-002 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-ID-003 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-ID-004 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-TEN-001 | TENANT_CONTEXT_INVALID | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | Yes if idempotency key and same payload; otherwise no |
| INV-TEN-002 | TENANT_CONTEXT_INVALID | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-TEN-003 | TENANT_CONTEXT_INVALID | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-TEN-004 | TENANT_CONTEXT_INVALID | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-TEN-005 | TENANT_CONTEXT_INVALID | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | Yes if idempotency key and same payload; otherwise no |
| INV-AUTH-001 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-AUTH-002 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | Yes if idempotency key and same payload; otherwise no |
| INV-AUTH-003 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-AUTH-004 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-AUTH-005 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-ACD-001 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-ACD-002 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-ACD-003 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-CAM-001 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-CAM-002 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-CAM-003 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-CAM-004 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-TOP-001 | IDEMPOTENCY_CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-TOP-002 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-TOP-003 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-PRJ-001 | CONCURRENCY_CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-PRJ-002 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-PRJ-003 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-PRJ-004 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-WRK-001 | TARGET_IMMUTABLE | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-DOC-001 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-DOC-002 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-DOC-003 | TARGET_IMMUTABLE | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-DOC-004 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-DOC-005 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-SUB-001 | TARGET_IMMUTABLE | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-SUB-002 | POLICY_NOT_SATISFIED | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | Yes if idempotency key and same payload; otherwise no |
| INV-FB-001 | TARGET_IMMUTABLE | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-REV-001 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-REV-002 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-REV-003 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | Yes if idempotency key and same payload; otherwise no |
| INV-REV-004 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-REV-005 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-EVA-001 | POLICY_NOT_SATISFIED | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | Yes if idempotency key and same payload; otherwise no |
| INV-EVA-002 | POLICY_NOT_SATISFIED | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | Yes if idempotency key and same payload; otherwise no |
| INV-EVA-003 | POLICY_NOT_SATISFIED | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | Yes if idempotency key and same payload; otherwise no |
| INV-EVA-004 | TARGET_IMMUTABLE | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-EVA-005 | FORBIDDEN | P0-012 defines final code/envelope; keep invariant-specific direction here | 403 Forbidden | No unless operation explicitly idempotent |
| INV-NOT-001 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | Yes if idempotency key and same payload; otherwise no |
| INV-AUD-001 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-AUD-002 | TARGET_IMMUTABLE | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-SRCH-001 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |
| INV-AI-001 | INVALID_STATE/CONFLICT | P0-012 defines final code/envelope; keep invariant-specific direction here | 409 Conflict | No unless operation explicitly idempotent |

## Handoff to P0-010

P0-010 Traceability Audit must receive:
- Master Invariant Register with 57 IDs.
- Invariant-to-module mapping.
- Invariant-to-table mapping.
- Invariant-to-phase mapping.
- Invariant-to-test mapping.
- Runtime mismatch register.
- Open policy decisions.
- Failure/error direction requirements.
- Missing traceability markers for FR/API/UI currently marked `NEEDS_TRACE_P0-010`.

P0-009 intentionally does not perform full FR/API/UI traceability. P0-010 must identify missing FR, API, UI, table, phase or test evidence per invariant.

## Change Control

| Change ID | Invariant ID | Requested Change | Current Rule | Proposed Rule | Module Impact | Database Impact | API/UI Impact | Test Impact | Approval Status |
|---|---|---|---|---|---|---|---|---|---|
| INV-CHG-TEMPLATE | INV-XXX-NNN | Describe requested invariant change | Current invariant | Proposed invariant | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | NEEDS_APPROVAL |
| INV-CHG-001 | INV-ID-001 | Accept tenant-bound user identity | Account has no tenantId | Runtime `users.tenant_id` accepted | High | High | High | High | NEEDS_APPROVAL |
| INV-CHG-002 | INV-AUTH-003 | Accept inline role scope | Normalized RoleAssignmentScope | Inline fields/JSON scope accepted | High | High | Medium | High | NEEDS_APPROVAL |

Approval required to delete/weaken invariant, move owner, change transaction boundary, make immutable data mutable, remove audit/outbox, change tenant scope, promote optional policy or alter version-pinning behavior.

## Validation Checklist

| Check | Result | Evidence |
|---|---|---|
| Có Master Invariant Register | PASS | This artifact and validation commands |
| Có detail card cho mọi invariant bắt buộc | PASS | This artifact and validation commands |
| Account không có tenantId được ghi rõ | PASS | This artifact and validation commands |
| users.tenant_id mismatch được liên kết | PASS | This artifact and validation commands |
| Tenant context từ active membership được ghi | PASS | This artifact and validation commands |
| Deny-by-default được ghi | PASS | This artifact and validation commands |
| Student không tạo academic structure được ghi | PASS | This artifact and validation commands |
| Published CampaignTemplateVersion immutable | PASS | This artifact and validation commands |
| Published RubricVersion immutable | PASS | This artifact and validation commands |
| Campaign pin template version | PASS | This artifact and validation commands |
| Approval topic idempotent | PASS | This artifact and validation commands |
| Registration approval tạo đúng một Project | PASS | This artifact and validation commands |
| DocumentVersion immutable | PASS | This artifact and validation commands |
| Submission pin exact DocumentVersion | PASS | This artifact and validation commands |
| Feedback pin exact target | PASS | This artifact and validation commands |
| ReviewAssignment pin Submission/RubricVersion/reviewer/round | PASS | This artifact and validation commands |
| Submitted Review immutable | PASS | This artifact and validation commands |
| Evaluation finalized immutable | PASS | This artifact and validation commands |
| Appeal không sửa Evaluation | PASS | This artifact and validation commands |
| Amendment append-only | PASS | This artifact and validation commands |
| Critical transition audit/outbox cùng transaction | PASS | This artifact and validation commands |
| Audit khác outbox | PASS | This artifact and validation commands |
| Worker không tự mutate aggregate | PASS | This artifact and validation commands |
| Search/AI không mutate state | PASS | This artifact and validation commands |
| Có Enforcement Matrix | PASS | This artifact and validation commands |
| Có Database Enforcement Audit | PASS | This artifact and validation commands |
| Có Application Enforcement Audit | PASS | This artifact and validation commands |
| Có Transaction/Concurrency Matrix | PASS | This artifact and validation commands |
| Có Test Evidence Matrix | PASS | This artifact and validation commands |
| Có Runtime Mismatch Register | PASS | This artifact and validation commands |
| Có Open Policy Decisions | PASS | This artifact and validation commands |
| Có Handoff P0-010 | PASS | This artifact and validation commands |
| Không ghi VERIFIED thiếu evidence | PASS | This artifact and validation commands |
| Không tự approve Open Decisions | PASS | This artifact and validation commands |
| Không sửa runtime | PASS | This artifact and validation commands |
| Không tạo P0-010 artifact | PASS | This artifact and validation commands |
| Không tuyên bố Phase 0 DONE | PASS | This artifact and validation commands |
| Không đánh dấu Phase 1 IN_PROGRESS | PASS | This artifact and validation commands |
| Có Source References | PASS | This artifact and validation commands |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — Chapter 2: multi-tenant, authorization, versioning, transaction/concurrency, outbox, idempotency, direct upload, AI/RAG.
- `docs/BaoCaoKhoaLuan.docx` — Chapter 3.5 Business Invariants.
- `docs/BaoCaoKhoaLuan.docx` — Chapter 4 module/data ownership, worker/security boundary.
- `docs/BaoCaoKhoaLuan.docx` — Chapter 5 database history/integrity rules and Database Capability Manifest.
- `docs/BaoCaoKhoaLuan.docx` — Chapter 6 FR/API/Permission/Error direction for P0-010 handoff.
- `docs/BaoCaoKhoaLuan.docx` — Chapter 7 phase detail, tests and evidence.
- `docs/phase-0/SOURCE_HIERARCHY.md` — source priority and evidence rules.
- `docs/phase-0/SCOPE_FREEZE.md` — scope split, deferred roadmap and open decisions.
- `docs/phase-0/STACK_LOCK.md` — locked stack, transaction/raw SQL/worker/security rules.
- `docs/phase-0/MODULE_BOUNDARIES.md` — module owners and P0-006 ownership matrix.
- `docs/phase-0/MODULE_DEPENDENCIES.md` — dependency, worker, transaction and runtime findings.
- `docs/phase-0/DATABASE_MANIFEST_AUDIT.md` — manifest counts, schema/seed/migration/worker findings.
