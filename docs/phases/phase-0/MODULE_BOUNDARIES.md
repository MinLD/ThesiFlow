# APLP Module Boundaries

## Purpose

Khóa bản đồ module APLP Phase 0 cho 18 module M01–M18, bao gồm trách nhiệm, capability, boundary, dependency declaration, phase ownership, handoff và data ownership. File này ngăn module trở thành thư mục CRUD không có owner, ngăn module đọc/sửa dữ liệu của module khác tùy tiện, hoàn tất P0-006 Data Ownership, và chuẩn bị input cho P0-007 Dependency Audit và P0-008 Database Manifest Audit.

## Status

DONE for P0-005 — Module Map and P0-006 — Data Ownership

- Chỉ P0-005 hoàn thành.
- P0-006 hoàn thành trong cùng artifact theo convention hiện tại của `docs/PROJECT_STATUS.md`.
- Phase 0 tổng thể vẫn IN_PROGRESS.
- Chưa có Phase 0 sign-off.
- Không được bắt đầu Phase 1 chỉ dựa trên file này.
- P0-007 chưa được thực hiện.
- Data ownership dưới đây đã được chi tiết hóa ở mức source manifest và repository observation cho P0-006.
- Dependency declarations dưới đây chưa phải cycle audit; dependency audit deferred to P0-007.

## Last Updated

2026-07-29 10:59 Asia/Ho_Chi_Minh

## Boundary Principles

1. Một module sở hữu business rules thuộc capability của nó.
2. Module khác không được trực tiếp sửa dữ liệu thuộc ownership của module đó.
3. Cross-module interaction phải đi qua application use case, module contract, query/read contract, domain event/outbox event phù hợp hoặc transaction orchestration được xác định rõ.
4. Không được import controller, route hoặc repository nội bộ của module khác.
5. Không được gọi Prisma trực tiếp vào bảng module khác chỉ vì tiện.
6. Foreign key cross-module không đồng nghĩa module consumer có quyền sở hữu hoặc sửa aggregate được tham chiếu.
7. Module có thể đọc snapshot hoặc identifier của module khác qua contract, nhưng không được sao chép business authority.
8. Transaction xuyên nhiều module chỉ được orchestration bởi application use case có owner rõ ràng.
9. Audit và outbox là capability nền dùng chung nhưng khác mục đích: audit lưu evidence/investigation; outbox phục vụ side-effect delivery sau commit.
10. Worker dùng chung application/domain modules, không sở hữu business aggregate, không tự mutate state ngoài use case, và không được xem là module nghiệp vụ mới.
11. Authorization: M04 cung cấp authorization contract; module nghiệp vụ vẫn chịu trách nhiệm cung cấp resource context, relationship và state; không dồn toàn bộ business guard vào M04.
12. Search và AI chỉ consume permission-filtered contracts, không sở hữu canonical business data, không mutate business state và không bypass authorization.
13. Shared/common code chỉ chứa technical primitives; business logic phải có module owner rõ ràng.
14. Repository runtime hiện có không được dùng để thay đổi module boundary đã khóa.

## Module Classification

| Module ID | Module Name | Scope Level | Primary Phase | Optional Gate |
|---|---|---|---|---|
| M01 | Platform/Foundation | CORE | Phase 1 | N/A |
| M02 | Identity | CORE | Phase 2 | N/A |
| M03 | Tenancy | CORE | Phase 3 | N/A |
| M04 | Authorization | CORE | Phase 4 | N/A |
| M05 | Academic Organization | CORE | Phase 5 | N/A |
| M06 | Academic Profiles | CORE | Phase 5 | N/A |
| M07 | Campaign | CORE | Phase 6 | N/A |
| M08 | Topic | CORE | Phase 7 | N/A |
| M09 | Project | CORE | Phase 8 and Phase 9 | N/A |
| M10 | Work Progress | CORE-MIN | Phase 9 | N/A |
| M11 | Documents | CORE | Phase 10 and Phase 11 | N/A |
| M12 | Feedback | CORE | Phase 11 | N/A |
| M13 | Review | CORE | Phase 12 | N/A |
| M14 | Evaluation | CORE | Phase 12 | N/A |
| M15 | Communication/Notification | CORE-MIN | Phase 13 | N/A |
| M16 | Audit/Operations | CORE-MIN | Phase 1 foundation minimum and Phase 13 hardening | N/A |
| M17 | Search | OPTIONAL | After Phase 13 go/no-go | Core workflow must pass Phase 13 gate |
| M18 | AI/RAG | OPTIONAL | After Phase 13 go/no-go | Core workflow must pass Phase 13 gate |

## Module Detail Cards

### M01 — Platform/Foundation

- Scope Level: CORE
- Primary Phase: Phase 1
- Purpose: Provide request lifecycle and reliability primitives for all later modules.
- Responsibilities: request/correlation ID; error envelope baseline; configuration; idempotency; transactional outbox; worker foundation; logging/redaction primitives; health/readiness/meta foundation.
- Capabilities Provided: `FoundationCommand`, `IdempotencyPolicy`, `OutboxEventWriter`, `ConfigQuery`, `RequestContext`, `HealthQuery`.
- Capabilities Consumed: PostgreSQL transaction primitives; runtime configuration source.
- Aggregate/Data Ownership Summary: `idempotency_records`, `outbox_events`, `system_configurations`.
- Public Application Contracts: idempotency key validation/check/record; append outbox event in transaction; get health/readiness/meta; create request context.
- Allowed Dependencies: PostgreSQL/Prisma; Zod; worker process; logger/security primitives; no business module dependency.
- Forbidden Dependencies: M02–M18 business repositories; academic/project/document/review/evaluation aggregates; domain-specific CRUD logic.
- Business Invariants Owned: idempotency key has scope; outbox event recorded with critical mutation; request ID present; secrets not logged.
- Security Responsibilities: redaction primitives; request/correlation IDs; production-safe error envelope.
- Side Effects: outbox event persistence; logs; health/readiness checks.
- Worker Interaction: provides worker baseline and outbox contracts; worker executes side effects after commit.
- UI/API Surface Summary: `/health`, `/ready`, `/api/v1/meta`, error envelope and request ID behavior.
- Handoff In: Phase 0 stack lock, source hierarchy, scope freeze.
- Handoff Out: Phase 2 uses idempotency, transaction, outbox and error conventions.
- Explicit Non-Responsibilities: account; organization; academic domain; project; document; review; evaluation; general `common` business logic dumping ground.
- Open Questions: exact production observability depth; cleanup job scope.
- Source References: Implementation Scope module catalog; Phase 1 foundation detail; Stack Lock.

### M02 — Identity

- Scope Level: CORE
- Primary Phase: Phase 2
- Purpose: Own global account identity, credentials and authentication lifecycle.
- Responsibilities: global Account; credential; verification/recovery token; session; authentication lifecycle.
- Capabilities Provided: `IdentityCommand`, `AccountQuery`, `SessionCommand`, `AuthenticationPolicy`, `CurrentAccountReadModel`.
- Capabilities Consumed: M01 request/config/idempotency primitives; M16 audit evidence; M15 notification event after commit when needed.
- Aggregate/Data Ownership Summary: `accounts`, `account_credentials`, `account_tokens`, `sessions`.
- Public Application Contracts: register account; verify email; login; refresh session; logout/revoke session; password recovery; get profile identity.
- Allowed Dependencies: M01 primitives; M16 audit contract; M15 notification through outbox/event contract.
- Forbidden Dependencies: hard-coded tenantId from M03; role assignments from M04; academic profile from M06; direct tenant authorization.
- Business Invariants Owned: Account has no tenantId; authentication is not active membership; Identity does not grant tenant authorization.
- Security Responsibilities: password hashing; token/session lifecycle; credential recovery safety; no account enumeration.
- Side Effects: auth audit events; verification/recovery notification intents.
- Worker Interaction: worker may deliver verification/recovery notifications via M15 contracts; no direct credential mutation.
- UI/API Surface Summary: register, verify, login, refresh, logout, account profile surfaces in Phase 2.
- Handoff In: Phase 1 foundation primitives.
- Handoff Out: Phase 3 receives authenticated account and session context.
- Explicit Non-Responsibilities: organization membership; role assignment; academic profile; tenant switching authorization.
- Open Questions: final token rotation/reuse policy depth; email verification demo mechanism.
- Source References: Product Scope Account/TenantMembership invariant; FR-ID; Phase 2 detail.

### M03 — Tenancy

- Scope Level: CORE
- Primary Phase: Phase 3
- Purpose: Own organization boundary, membership lifecycle and tenant context resolution.
- Responsibilities: Organization; TenantMembership; MembershipInvitation; membership lifecycle; tenant context resolution.
- Capabilities Provided: `TenancyCommand`, `MembershipQuery`, `TenantContextPolicy`, `InvitationCommand`, `TenantReadModel`.
- Capabilities Consumed: M02 authenticated account context; M01 idempotency/outbox; M16 audit; M15 notification for invitations.
- Aggregate/Data Ownership Summary: `organizations`, `tenant_memberships`, `membership_invitations`.
- Public Application Contracts: create organization; invite member; accept invitation; resolve active tenant context; suspend/revoke membership.
- Allowed Dependencies: M02 account identity query; M01 primitives; M16 audit contract; M15 event delivery.
- Forbidden Dependencies: direct credential/session management; role permission catalog ownership; academic hierarchy ownership.
- Business Invariants Owned: tenant context derives from authenticated active membership; do not trust client-supplied tenantId alone.
- Security Responsibilities: membership activation checks; tenant isolation root; invitation token visibility.
- Side Effects: membership/invitation audit; invitation notification events.
- Worker Interaction: worker delivers membership invitation notifications via M15; does not create memberships outside use case.
- UI/API Surface Summary: organization onboarding, membership invitation/acceptance, tenant switch context.
- Handoff In: Phase 2 authenticated account/session.
- Handoff Out: Phase 4 receives tenant/membership context.
- Explicit Non-Responsibilities: global credential; RBAC catalog; academic hierarchy; project relationship.
- Open Questions: organization activation authority and invitation expiry policy.
- Source References: Product Scope tenant model; FR-TEN; Phase 3 detail.

### M04 — Authorization

- Scope Level: CORE
- Primary Phase: Phase 4
- Purpose: Provide authorization policy contracts combining tenant, role, scope, relationship and state.
- Responsibilities: Role; Permission; RolePermission; RoleAssignment; normalized RoleAssignmentScope; authorization policy contract.
- Capabilities Provided: `AuthorizationPolicy`, `PermissionQuery`, `RoleCommand`, `RoleAssignmentCommand`, `ScopePolicy`.
- Capabilities Consumed: M03 tenant membership context; resource context from business modules; M01/M16 primitives.
- Aggregate/Data Ownership Summary: `roles`, `permissions`, `role_permissions`, `role_assignments`, `role_assignment_scopes`.
- Public Application Contracts: check permission; evaluate scoped role; assign role; list permission catalog; invalidate authorization context when needed.
- Allowed Dependencies: M03 membership read model; M01 request context; business module resource context via contract.
- Forbidden Dependencies: owning project/document/review business relationships; bypassing state guard owned by domain modules; allow-by-default fallback.
- Business Invariants Owned: deny by default; authorization combines tenant + role + scope + relationship + state.
- Security Responsibilities: permission enforcement contract; scoped assignment; audit on permission/role mutation.
- Side Effects: authorization audit events; session/context invalidation signals where required.
- Worker Interaction: worker jobs must use authorization-safe use cases or scoped system policy.
- UI/API Surface Summary: role management, permission assignment, access denial/error states.
- Handoff In: Phase 3 membership context.
- Handoff Out: Phase 5+ modules use a single authorization contract.
- Explicit Non-Responsibilities: business relationship computation for projects/documents/reviews; tenant membership creation.
- Open Questions: authorization cache/version invalidation depth.
- Source References: FR-AUTH; Phase 4 detail; Security architecture.

### M05 — Academic Organization

- Scope Level: CORE
- Primary Phase: Phase 5
- Purpose: Own academic hierarchy and hierarchy validation used by campaigns, profiles and authorization scope.
- Responsibilities: academic unit hierarchy; faculty/department/program/center/institute/other structure; hierarchy validation; parent/type rules.
- Capabilities Provided: `AcademicUnitCommand`, `AcademicUnitQuery`, `AcademicHierarchyPolicy`, `AcademicUnitReadModel`.
- Capabilities Consumed: M03 tenant context; M04 authorization; M01 primitives; M16 audit.
- Aggregate/Data Ownership Summary: `academic_units`.
- Public Application Contracts: create/update academic unit; validate parent/type; resolve academic scope; read hierarchy snapshots.
- Allowed Dependencies: M03 organization boundary; M04 permission/scope check.
- Forbidden Dependencies: global account profile ownership; placement history ownership; campaign lifecycle ownership; automatic Class/Cohort promotion.
- Business Invariants Owned: hierarchy belongs to tenant; parent/type rules valid; academic scope is stable for policy checks.
- Security Responsibilities: tenant-scoped hierarchy access; protected hierarchy mutation.
- Side Effects: hierarchy change audit events.
- Worker Interaction: no direct worker ownership; worker may run cleanup/report tasks through use cases if defined.
- UI/API Surface Summary: academic unit management, hierarchy tree/read model.
- Handoff In: Phase 4 authorization contract.
- Handoff Out: Phase 6 receives academic context for campaign eligibility.
- Explicit Non-Responsibilities: SIS clone; member profile placement history; campaign participants.
- Open Questions: OD-002 Class/Cohort CORE or OPTIONAL baseline.
- Source References: Product Scope hierarchy; Open Decisions; Phase 5 detail.

### M06 — Academic Profiles

- Scope Level: CORE
- Primary Phase: Phase 5
- Purpose: Own academic profile and historical placement for members in academic context.
- Responsibilities: academic profile; academic placement; placement history; role-specific academic context.
- Capabilities Provided: `AcademicProfileCommand`, `PlacementCommand`, `AcademicProfileQuery`, `PlacementHistoryPolicy`.
- Capabilities Consumed: M02 account identifier; M03 membership context; M05 academic unit read model; M04 authorization.
- Aggregate/Data Ownership Summary: `academic_profiles`, `academic_placements`.
- Public Application Contracts: create/update academic profile; assign placement; query active/historical placement; validate overlap policy.
- Allowed Dependencies: M02 account identity reference; M03 membership reference; M05 academic unit query; M04 authorization.
- Forbidden Dependencies: credential/session handling; academic hierarchy mutation; campaign participant mutation; SIS full replacement.
- Business Invariants Owned: placement history not overwritten; overlap follows policy; profile belongs to tenant membership/account context.
- Security Responsibilities: profile visibility by tenant/scope/relationship; sensitive profile fields protected.
- Side Effects: placement/profile audit events.
- Worker Interaction: no direct worker ownership; background import only if approved later.
- UI/API Surface Summary: academic profile editor, placement history display.
- Handoff In: Phase 5 academic structure and authorization.
- Handoff Out: Phase 6 receives academic eligibility/profile context.
- Explicit Non-Responsibilities: SIS integration; organization membership lifecycle; role assignment.
- Open Questions: overlap policy specifics; optional class/cohort scope.
- Source References: Phase 5 detail; Product Scope academic hierarchy; FR-ACD.

### M07 — Campaign

- Scope Level: CORE
- Primary Phase: Phase 6
- Purpose: Own configurable campaign framework, template/version and campaign lifecycle.
- Responsibilities: CampaignTemplate; immutable CampaignTemplateVersion; AcademicCampaign; CampaignParticipant; lifecycle; eligibility baseline; participant snapshot.
- Capabilities Provided: `CampaignCommand`, `CampaignQuery`, `CampaignPolicy`, `CampaignTemplateVersionReadModel`, `ParticipantSnapshotReadModel`.
- Capabilities Consumed: M05 academic unit context; M06 profile/placement context; M04 authorization; M01 idempotency/outbox; M16 audit.
- Aggregate/Data Ownership Summary: `campaign_templates`, `campaign_template_versions`, `academic_campaigns`, `campaign_participants`.
- Public Application Contracts: create template; publish immutable version; create/open/close campaign; manage participants; evaluate eligibility baseline.
- Allowed Dependencies: M05/M06 read contracts; M04 authorization; M01/M16 primitives.
- Forbidden Dependencies: hard-coded THESIS-specific global workflow; topic/project/document ownership; template mutation after publish.
- Business Invariants Owned: campaign pins template version; published version immutable; participant snapshot not arbitrarily changed after close.
- Security Responsibilities: campaign mutation by scoped coordinator/admin; participant visibility by tenant/campaign scope.
- Side Effects: campaign lifecycle audit; notification events for important campaign changes.
- Worker Interaction: worker may dispatch lifecycle notifications through M15; no direct campaign state mutation outside use case.
- UI/API Surface Summary: Campaign Setup, Template Builder, participant management.
- Handoff In: Phase 5 academic context.
- Handoff Out: Phase 7 receives campaign OPEN and policy snapshot.
- Explicit Non-Responsibilities: topic decision; project creation; document submission; one-off THESIS-only hard code.
- Open Questions: final policy depth for eligibility and template schema.
- Source References: Module catalog; Phase 6 detail; Scope Freeze.

### M08 — Topic

- Scope Level: CORE
- Primary Phase: Phase 7
- Purpose: Own proposal-to-official-topic lifecycle within a campaign.
- Responsibilities: TopicProposal; TopicDecision; CampaignTopic; proposal lifecycle; request changes; approval evidence; official topic catalog in campaign.
- Capabilities Provided: `TopicProposalCommand`, `TopicDecisionCommand`, `CampaignTopicQuery`, `TopicPolicy`.
- Capabilities Consumed: M07 campaign state/policy; M04 authorization; M06 profile context for proposer/lecturer; M01/M16 primitives.
- Aggregate/Data Ownership Summary: `topic_proposals`, `topic_decisions`, `campaign_topics`.
- Public Application Contracts: submit proposal; request changes; approve/reject; publish campaign topic; query official topics.
- Allowed Dependencies: M07 campaign read model; M04 authorization; M06 profile read model.
- Forbidden Dependencies: registration/project creation; direct campaign lifecycle mutation; evaluator/review mutation.
- Business Invariants Owned: approved topic has decision evidence; campaign topic derives from valid proposal/decision; proposal lifecycle is traceable.
- Security Responsibilities: proposer/coordinator authorization; tenant/campaign scoped visibility.
- Side Effects: topic decision audit; notification events for request changes/approval.
- Worker Interaction: worker delivers topic notifications via M15; no direct proposal mutation.
- UI/API Surface Summary: Topic Proposal, Topic Approval, Topic Catalog.
- Handoff In: Phase 6 campaign/policy snapshot.
- Handoff Out: Phase 8 receives stable CampaignTopic.
- Explicit Non-Responsibilities: Project aggregate; registration team; review/evaluation.
- Open Questions: detailed topic change-request policy.
- Source References: Phase 7 detail; FR-TOP; API/UI catalogs for topic screens.

### M09 — Project

- Scope Level: CORE
- Primary Phase: Phase 8 and Phase 9
- Purpose: Own registration, idempotent project creation, official project team and supervision assignment.
- Responsibilities: ProjectRegistration; RegistrationMember; Project; ProjectMembership; SupervisionAssignment.
- Capabilities Provided: `ProjectRegistrationCommand`, `ProjectCommand`, `ProjectMembershipCommand`, `ProjectQuery`, `SupervisionPolicy`.
- Capabilities Consumed: M07 campaign policy; M08 campaign topic; M06 academic profile; M04 authorization; M01 idempotency/outbox; M16 audit.
- Aggregate/Data Ownership Summary: `project_registrations`, `registration_members`, `projects`, `project_memberships`, `supervision_assignments`.
- Public Application Contracts: submit registration; approve registration; create Project idempotently; manage official membership; assign supervisor.
- Allowed Dependencies: M07/M08/M06 read contracts; M04 authorization; M01 idempotency; M16 audit.
- Forbidden Dependencies: mutating TopicDecision; becoming Jira clone; document/review/evaluation ownership.
- Business Invariants Owned: one approved registration creates exactly one Project; official project membership is traceable; supervisor assignment follows policy.
- Security Responsibilities: relationship context for project authorization; project membership visibility.
- Side Effects: registration/project audit; notifications for approval/assignment.
- Worker Interaction: worker may dispatch project notifications; no direct project state mutation outside use case.
- UI/API Surface Summary: Registration Wizard, Project Workspace, Team/Supervision views.
- Handoff In: Phase 8 receives CampaignTopic and participants; Phase 9 receives Project aggregate.
- Handoff Out: Phase 10 receives project relationships for documents.
- Explicit Non-Responsibilities: milestone/task board beyond M10; document storage; review/evaluation.
- Open Questions: exact group-size, supervisor capacity and registration deadline policies.
- Source References: Phase 8 and Phase 9 details; FR-PRJ; vertical slice.

### M10 — Work Progress

- Scope Level: CORE-MIN
- Primary Phase: Phase 9
- Purpose: Provide minimal progress/milestone capability needed by the THESIS workflow.
- Responsibilities: ProjectMilestone; ProgressUpdate.
- Capabilities Provided: `ProgressCommand`, `MilestoneCommand`, `ProgressTimelineQuery`.
- Capabilities Consumed: M09 project relationship context; M04 authorization; M01/M16 primitives.
- Aggregate/Data Ownership Summary: `project_milestones`, `progress_updates`.
- Public Application Contracts: create/update minimal milestone; append progress update; query progress timeline.
- Allowed Dependencies: M09 project read model; M04 authorization; M16 audit.
- Forbidden Dependencies: general task board; sprint/backlog/workload optimizer; direct document/review/evaluation mutation.
- Business Invariants Owned: progress update actor/context is preserved; append-only update where policy requires; milestone belongs to project.
- Security Responsibilities: project relationship-based visibility and mutation control.
- Side Effects: milestone/progress audit and optional notification events.
- Worker Interaction: worker may send milestone reminders only through defined use cases/events.
- UI/API Surface Summary: minimal Milestone Timeline and Progress Update surface.
- Handoff In: Phase 9 receives project aggregate and membership.
- Handoff Out: Phase 10 can use project progress context if needed; not a hard dependency for documents.
- Explicit Non-Responsibilities: Jira clone; full project management suite; reviewer scoring.
- Open Questions: exact milestone policy and deadline behavior.
- Source References: Module catalog CORE-MIN; Phase 9 detail; Risk register scope creep.

### M11 — Documents

- Scope Level: CORE
- Primary Phase: Phase 10 and Phase 11
- Purpose: Own direct upload, immutable document versions and official submission pinning.
- Responsibilities: Document; UploadSession; DocumentVersion; Submission.
- Capabilities Provided: `DocumentCommand`, `UploadSessionCommand`, `DocumentVersionQuery`, `SubmissionCommand`, `SubmissionReadModel`.
- Capabilities Consumed: M09 project relationship; M04 authorization; M01 idempotency/outbox; MinIO/S3-compatible storage; M16 audit.
- Aggregate/Data Ownership Summary: `documents`, `upload_sessions`, `document_versions`, `submissions`.
- Public Application Contracts: create upload session; complete/abort upload; create immutable version; controlled download; submit/withdraw official submission; query submissions.
- Allowed Dependencies: M09 project relationship read model; M04 authorization; M01 idempotency/outbox; object storage adapter.
- Forbidden Dependencies: public object URL; logging presigned URL; bypassing M04 authorization; general-purpose Drive; review/evaluation mutation.
- Business Invariants Owned: object key tenant-scoped; upload completion one-time; DocumentVersion immutable; download re-authorized; Submission pins correct DocumentVersion.
- Security Responsibilities: presigned URL secrecy; tenant-scoped keys; classification/download authorization; no file proxy for large normal flow.
- Side Effects: document/submission audit; notification events for official submission.
- Worker Interaction: worker may perform cleanup or file processing only through defined use cases and real toolchain.
- UI/API Surface Summary: Document Center, upload flow, version list, Submission Panel.
- Handoff In: Phase 10 receives project relationships; Phase 11 receives immutable versions.
- Handoff Out: Phase 12 receives official Submission target.
- Explicit Non-Responsibilities: general file drive; production file scanning without toolchain; review scoring.
- Open Questions: OD-004 file scanning depth; final object storage client/version.
- Source References: Direct upload architecture; Phase 10/11 details; FR-DOC/FR-FB.

### M12 — Feedback

- Scope Level: CORE
- Primary Phase: Phase 11
- Purpose: Own feedback and revision request attached to exact resource/version target.
- Responsibilities: FeedbackItem.
- Capabilities Provided: `FeedbackCommand`, `FeedbackQuery`, `RevisionRequestPolicy`.
- Capabilities Consumed: M09 project relationship or M11 submission/document target; M04 authorization; M01/M16 primitives.
- Aggregate/Data Ownership Summary: `feedback_items`.
- Public Application Contracts: create feedback; request revision; query feedback by target; resolve feedback visibility.
- Allowed Dependencies: M09 project read model; M11 document/submission read model; M04 authorization.
- Forbidden Dependencies: realtime chat; untargeted feedback where policy requires target; modifying submitted target version.
- Business Invariants Owned: feedback target is explicit; actor/context is preserved; feedback visibility follows relationship/assignment.
- Security Responsibilities: target visibility; relationship/scope enforcement.
- Side Effects: feedback audit; revision request notifications.
- Worker Interaction: worker dispatches feedback notifications via M15; no direct feedback mutation outside use case.
- UI/API Surface Summary: Feedback Workspace, revision request thread/list.
- Handoff In: Phase 11 receives submission/version/project context.
- Handoff Out: Phase 12 can consume feedback context if policy requires, but review target remains Submission.
- Explicit Non-Responsibilities: chat/presence; document version mutation; review scoring.
- Open Questions: final feedback deadline and resolution policy.
- Source References: Phase 11 detail; FR-FB; UI Feedback Workspace.

### M13 — Review

- Scope Level: CORE
- Primary Phase: Phase 12
- Purpose: Own rubric, review assignment, review lifecycle and criterion scoring.
- Responsibilities: Rubric; RubricVersion; RubricCriterion; ReviewAssignment; Review; ReviewScore.
- Capabilities Provided: `RubricCommand`, `ReviewAssignmentCommand`, `ReviewCommand`, `ReviewQuery`, `ReviewScorePolicy`.
- Capabilities Consumed: M11 official Submission target; M07 campaign/rubric policy context; M04 authorization; M06 profile context for reviewer; M01/M16 primitives.
- Aggregate/Data Ownership Summary: `rubrics`, `rubric_versions`, `rubric_criteria`, `review_assignments`, `reviews`, `review_scores`.
- Public Application Contracts: create rubric/version; assign reviewer; create draft review; submit/lock review; query review results.
- Allowed Dependencies: M11 Submission read model; M07 campaign policy read model; M04 authorization; M06 reviewer profile reference.
- Forbidden Dependencies: modifying Submission; owning official Evaluation; AI grading; direct finalized result changes.
- Business Invariants Owned: assignment pins target Submission and RubricVersion; score belongs to Review; submitted Review immutable; reviewer only reviews assigned target.
- Security Responsibilities: assignment-scoped reviewer access; student/result release visibility follows policy.
- Side Effects: review assignment/submission audit; reviewer notification events.
- Worker Interaction: worker sends review assignment/deadline notifications via M15; no direct scoring.
- UI/API Surface Summary: Rubric Builder, Reviewer Inbox, Review Scoring.
- Handoff In: Phase 12 receives official submission and authorization contract.
- Handoff Out: M14 receives submitted/locked reviews for evaluation.
- Explicit Non-Responsibilities: final evaluation; appeal/amendment; AI scoring.
- Open Questions: OD-005 rubric policy, OD-006 quorum, OD-007 COI implications.
- Source References: Phase 12 detail; FR-REV; API/UI Review catalog.

### M14 — Evaluation

- Scope Level: CORE
- Primary Phase: Phase 12
- Purpose: Own official evaluation result, finalize guard, appeal and append-only amendment.
- Responsibilities: Evaluation; EvaluationAppeal; EvaluationAmendment.
- Capabilities Provided: `EvaluationCommand`, `EvaluationQuery`, `FinalizePolicy`, `AppealCommand`, `AmendmentCommand`.
- Capabilities Consumed: M13 submitted reviews/scores; M11 Submission target; M04 authorization; M01/M16 primitives.
- Aggregate/Data Ownership Summary: `evaluations`, `evaluation_appeals`, `evaluation_amendments`.
- Public Application Contracts: compute/finalize evaluation; release result; submit/review appeal; append amendment with reason/evidence.
- Allowed Dependencies: M13 review read model; M11 submission read model; M04 authorization; M16 audit.
- Forbidden Dependencies: mutating Review; direct mutation of finalized Evaluation; AI finalize/score; committee optimization outside scope.
- Business Invariants Owned: finalized result immutable; correction via amendment only; appeal does not directly change Evaluation; amendment append-only with evidence.
- Security Responsibilities: coordinator/committee finalize scope; student result visibility after release; appeal permission/deadline checks.
- Side Effects: evaluation/finalize/appeal/amendment audit; notifications for release/appeal.
- Worker Interaction: worker dispatches result/appeal notifications; no evaluation mutation outside use case.
- UI/API Surface Summary: Evaluation Finalization, Appeal Submission, Appeal Review, Amendment History.
- Handoff In: Phase 12 receives submitted reviews and official submission.
- Handoff Out: Phase 13 receives critical events for notification/audit hardening.
- Explicit Non-Responsibilities: review scoring; AI decisioning; direct grade edits.
- Open Questions: OD-003 appeal/deadline, OD-006 quorum, OD-007 COI.
- Source References: Phase 12 detail; FR-EVA; invariants.

### M15 — Communication/Notification

- Scope Level: CORE-MIN
- Primary Phase: Phase 13
- Purpose: Own action-required notifications and delivery state for critical workflow events.
- Responsibilities: Notification.
- Capabilities Provided: `NotificationCommand`, `NotificationQuery`, `NotificationDeliveryPolicy`, `NotificationReadModel`.
- Capabilities Consumed: M01 outbox events; event producers from M02–M14; M04 recipient visibility where applicable.
- Aggregate/Data Ownership Summary: `notifications`.
- Public Application Contracts: create notification from event; mark read; query inbox; update delivery state.
- Allowed Dependencies: M01 outbox; event contracts from domain modules; M04 authorization for recipient-scoped access.
- Forbidden Dependencies: mutating business aggregates; realtime chat; presence; social feed.
- Business Invariants Owned: recipient-only notification visibility; action-required messages tied to event/context; retry state safe.
- Security Responsibilities: no sensitive payload leakage; recipient scoping.
- Side Effects: notification delivery; retry state updates.
- Worker Interaction: primary worker consumer for outbox notification dispatch.
- UI/API Surface Summary: Notification Inbox and action-required indicators.
- Handoff In: Phase 13 receives all critical events from prior modules.
- Handoff Out: Optional future collaboration only after change approval.
- Explicit Non-Responsibilities: chat/presence; business state mutation; audit evidence ownership.
- Open Questions: delivery channels and retention period.
- Source References: Module catalog CORE-MIN; Phase 13 detail; Deferred Collaboration.

### M16 — Audit/Operations

- Scope Level: CORE-MIN
- Primary Phase: Phase 1 foundation minimum and Phase 13 hardening
- Purpose: Own audit evidence and operational timeline for critical transitions.
- Responsibilities: AuditLog; operational evidence capability; transition evidence; actor/reason/correlation timeline.
- Capabilities Provided: `AuditCommand`, `AuditQuery`, `AuditTimelineReadModel`, `OperationalEvidencePolicy`.
- Capabilities Consumed: M01 request context; critical use case events from M02–M15; M04 scoped audit query policy.
- Aggregate/Data Ownership Summary: `audit_logs`.
- Public Application Contracts: append audit event; query audit timeline; attach actor/reason/correlation metadata.
- Allowed Dependencies: M01 request context; event/evidence contracts from modules; M04 scoped access for audit query.
- Forbidden Dependencies: mutating business aggregates; acting as outbox; logging secret or presigned URL.
- Business Invariants Owned: audit append-only; critical transition evidence includes actor/reason/correlation; no sensitive logs.
- Security Responsibilities: scoped audit visibility; redaction; immutable evidence discipline.
- Side Effects: audit log persistence only.
- Worker Interaction: worker can append operational audit for job outcome through contract; no business aggregate mutation.
- UI/API Surface Summary: Audit Timeline and operational evidence views.
- Handoff In: Phase 1 foundation minimum; Phase 13 receives all critical events.
- Handoff Out: Phase 13 hardening/evidence matrix and defense artifact.
- Explicit Non-Responsibilities: side-effect delivery; notification inbox; business rule ownership.
- Open Questions: retention/export policy and backup evidence depth.
- Source References: Module catalog CORE-MIN; Phase 13 detail; security/logging requirements.

### M17 — Search

- Scope Level: OPTIONAL
- Primary Phase: After Phase 13 go/no-go
- Purpose: Provide permission-aware search if core workflow evidence passes and search is approved.
- Responsibilities: PostgreSQL permission-aware search baseline if adopted.
- Capabilities Provided: `SearchQuery`, `SearchReadModel`, `SearchIndexPolicy` if approved.
- Capabilities Consumed: permission-filtered read contracts from M03/M04 and business modules.
- Aggregate/Data Ownership Summary: no canonical business table assigned in core.
- Public Application Contracts: search query over authorized resources; return cited/linked result metadata.
- Allowed Dependencies: M04 authorization; read models from provider modules; PostgreSQL baseline if approved.
- Forbidden Dependencies: OpenSearch before adoption trigger; mutating business state; bypassing authorization; owning canonical data.
- Business Invariants Owned: search results must be permission-filtered; no data leak across tenant/scope.
- Security Responsibilities: authorization filter before result exposure; no indexing of unauthorized secrets.
- Side Effects: optional index/read model maintenance only if approved.
- Worker Interaction: optional indexing jobs only after go/no-go.
- UI/API Surface Summary: optional search surface after Phase 13 gate.
- Handoff In: Phase 13 core evidence and go/no-go decision.
- Handoff Out: optional roadmap only.
- Explicit Non-Responsibilities: canonical data ownership; workflow mutation; OpenSearch infrastructure in core.
- Open Questions: OD-008 Search gate and benchmark criteria.
- Source References: Module catalog OPTIONAL; Deferred Roadmap; Scope Freeze.

### M18 — AI/RAG

- Scope Level: OPTIONAL
- Primary Phase: After Phase 13 go/no-go
- Purpose: Provide advisory checklist/Q&A with permission-aware retrieval and citation only if approved.
- Responsibilities: advisory checklist/Q&A; permission-aware retrieval; citation; refusal when evidence is missing.
- Capabilities Provided: `AiAdvisoryQuery`, `CitationPolicy`, `EvidenceRefusalPolicy` if approved.
- Capabilities Consumed: M04 authorization; permission-filtered query/read contracts; optional M17 search if approved.
- Aggregate/Data Ownership Summary: no canonical business table assigned in core.
- Public Application Contracts: ask advisory question; get cited answer; produce checklist; refuse unsafe/unsupported answer.
- Allowed Dependencies: permission-filtered contracts; citation/evidence store after approval.
- Forbidden Dependencies: approve proposal/registration; grant role; grade; finalize evaluation; mutate business state; bypass permission; vector DB/dedicated RAG infrastructure in core.
- Business Invariants Owned: advisory-only; citation required; no authority over business decisions.
- Security Responsibilities: permission-aware retrieval; no cross-tenant leakage; refusal on missing evidence.
- Side Effects: none on business state.
- Worker Interaction: optional offline indexing/evaluation jobs only after go/no-go.
- UI/API Surface Summary: optional advisory UI after Phase 13 gate.
- Handoff In: Phase 13 core evidence and AI/RAG go/no-go.
- Handoff Out: optional roadmap only.
- Explicit Non-Responsibilities: decision authority; scoring/finalization; dedicated RAG infrastructure in core.
- Open Questions: OD-009 AI/RAG gate and evaluation design.
- Source References: Module catalog OPTIONAL; Deferred Roadmap; Scope Freeze.

## Module Interaction Matrix

| Consumer Module | Provider Module | Capability Consumed | Interaction Type | Mutation Allowed | Notes |
|---|---|---|---|---|---|
| M02 Identity | M01 Platform/Foundation | request context, config, idempotency, outbox/audit primitives | APPLICATION_COMMAND | No provider aggregate mutation except through M01 contract | Authentication lifecycle uses foundation primitives |
| M03 Tenancy | M02 Identity | authenticated account context | APPLICATION_QUERY | No | Membership attaches to Account identity reference |
| M04 Authorization | M03 Tenancy | active tenant membership context | APPLICATION_QUERY | No | Authorization starts from membership context |
| M05 Academic Organization | M03 Tenancy | organization boundary | IDENTIFIER_REFERENCE | No | Academic units belong to organization |
| M05 Academic Organization | M04 Authorization | permission/scope checks | DOMAIN_POLICY | No | M05 supplies resource context |
| M06 Academic Profiles | M03 Tenancy | membership/account context | IDENTIFIER_REFERENCE | No | Profile/placement is tenant-scoped |
| M06 Academic Profiles | M04 Authorization | profile access policy | DOMAIN_POLICY | No | M06 supplies profile/resource state |
| M06 Academic Profiles | M05 Academic Organization | academic unit reference/read model | APPLICATION_QUERY | No | Placement references academic unit |
| M07 Campaign | M05 Academic Organization | academic scope and unit read model | APPLICATION_QUERY | No | Campaign eligibility depends on unit/scope |
| M07 Campaign | M06 Academic Profiles | placement/profile read model | APPLICATION_QUERY | No | Participant snapshot uses profile context |
| M07 Campaign | M04 Authorization | campaign admin/coordinator policy | DOMAIN_POLICY | No | M07 supplies campaign state |
| M08 Topic | M07 Campaign | campaign lifecycle and template policy | APPLICATION_QUERY | No | Topic proposals require open campaign |
| M08 Topic | M04 Authorization | topic proposal/approval policy | DOMAIN_POLICY | No | M08 supplies proposal state |
| M09 Project | M07 Campaign | campaign participant/policy | APPLICATION_QUERY | No | Registration eligibility |
| M09 Project | M08 Topic | approved CampaignTopic | APPLICATION_QUERY | No | Project registration references topic |
| M09 Project | M06 Academic Profiles | student/supervisor profile context | APPLICATION_QUERY | No | Team eligibility and supervision |
| M09 Project | M04 Authorization | registration/project policy | DOMAIN_POLICY | No | M09 supplies project relationship/state |
| M10 Work Progress | M09 Project | project membership/relationship | APPLICATION_QUERY | No | Progress belongs to project |
| M10 Work Progress | M04 Authorization | progress mutation policy | DOMAIN_POLICY | No | M10 supplies milestone/progress state |
| M11 Documents | M09 Project | project relationship/context | APPLICATION_QUERY | No | Document belongs to project/submission context |
| M11 Documents | M04 Authorization | upload/download/submit policy | DOMAIN_POLICY | No | M11 supplies document/submission state |
| M11 Documents | M01 Platform/Foundation | idempotency/outbox primitives | APPLICATION_COMMAND | Only via M01 contract | Upload completion/submission commands need reliability |
| M12 Feedback | M09 Project | project relationship context | APPLICATION_QUERY | No | Feedback can target project context |
| M12 Feedback | M11 Documents | document/submission target read model | APPLICATION_QUERY | No | Feedback pins version/target |
| M12 Feedback | M04 Authorization | feedback access policy | DOMAIN_POLICY | No | M12 supplies target state |
| M13 Review | M11 Documents | official Submission target | APPLICATION_QUERY | No | Review assignment pins Submission |
| M13 Review | M07 Campaign | rubric/campaign policy context | APPLICATION_QUERY | No | Review policy comes from campaign/template snapshot |
| M13 Review | M04 Authorization | reviewer assignment access policy | DOMAIN_POLICY | No | M13 supplies assignment/review state |
| M14 Evaluation | M13 Review | submitted reviews/scores | APPLICATION_QUERY | No | Evaluation uses review read model |
| M14 Evaluation | M11 Documents | official Submission target | APPLICATION_QUERY | No | Evaluation target context |
| M14 Evaluation | M04 Authorization | finalize/appeal/amend policy | DOMAIN_POLICY | No | M14 supplies evaluation state |
| M15 Communication/Notification | M01 Platform/Foundation | outbox events | EVENT_AFTER_COMMIT | Only notification aggregate | M15 consumes events after commit |
| M15 Communication/Notification | M02–M14 producers | event payloads | EVENT_AFTER_COMMIT | No producer aggregate mutation | Notification delivery after critical events |
| M16 Audit/Operations | M01 Platform/Foundation | request/correlation context | IDENTIFIER_REFERENCE | No | Audit records actor/reason/correlation |
| M16 Audit/Operations | M02–M15 use cases | transition evidence | EVENT_AFTER_COMMIT | Only audit aggregate | Audit does not own business state |
| M17 Search | M04 Authorization | permission-filtered policy | DOMAIN_POLICY | No | Search must not bypass authorization |
| M17 Search | M02–M16 providers | permission-filtered read contracts | READ_MODEL | No | Optional search consumes read models only |
| M18 AI/RAG | M04 Authorization | permission-aware retrieval policy | DOMAIN_POLICY | No | AI/RAG must not bypass authorization |
| M18 AI/RAG | M17 Search | optional search/retrieval read model | APPLICATION_QUERY | No | Only after Search/AI gates |
| M18 AI/RAG | M02–M16 providers | permission-filtered query contracts | READ_MODEL | No | Advisory-only, no mutation |

This matrix is a dependency declaration only. P0-007 will audit dependency direction/cycles.

## Data Ownership Summary

P0-006 validates source-level ownership for the Database Capability Manifest. Detailed runtime/schema compliance remains deferred to P0-017 unless listed as a P0-006 ownership conflict. Dependency cycle audit remains deferred to P0-007.

| Module | Core Tables/Aggregates Summary | Ownership Status | Detailed Audit |
|---|---|---|---|
| M01 Platform/Foundation | `idempotency_records`, `outbox_events`, `system_configurations` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M02 Identity | `accounts`, `account_credentials`, `account_tokens`, `sessions` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M03 Tenancy | `organizations`, `tenant_memberships`, `membership_invitations` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M04 Authorization | `roles`, `permissions`, `role_permissions`, `role_assignments`, `role_assignment_scopes` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M05 Academic Organization | `academic_units` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M06 Academic Profiles | `academic_profiles`, `academic_placements` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M07 Campaign | `campaign_templates`, `campaign_template_versions`, `academic_campaigns`, `campaign_participants` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M08 Topic | `topic_proposals`, `topic_decisions`, `campaign_topics` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M09 Project | `project_registrations`, `registration_members`, `projects`, `project_memberships`, `supervision_assignments` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M10 Work Progress | `project_milestones`, `progress_updates` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M11 Documents | `documents`, `upload_sessions`, `document_versions`, `submissions` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M12 Feedback | `feedback_items` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M13 Review | `rubrics`, `rubric_versions`, `rubric_criteria`, `review_assignments`, `reviews`, `review_scores` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M14 Evaluation | `evaluations`, `evaluation_appeals`, `evaluation_amendments` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M15 Communication/Notification | `notifications` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M16 Audit/Operations | `audit_logs` | VALIDATED_SOURCE_OWNER | P0-006 checked against Database Capability Manifest |
| M17 Search | No canonical core table assigned | OPTIONAL_NO_CORE_OWNERSHIP | Optional tables only after Phase 13 Search gate |
| M18 AI/RAG | No canonical core table assigned | OPTIONAL_NO_CORE_OWNERSHIP | Optional advisory/RAG tables only after Phase 13 AI/RAG gate |

## P0-006 Detailed Ownership Matrix

| Table/Aggregate | Owner Module | Aggregate | Tenant Scope | Phase | Status | Ownership Rule | Conflict Status |
|---|---|---|---|---|---|---|---|
| `idempotency_records` | M01 Platform/Foundation | Request execution | GLOBAL/TENANT | P1 | CORE | Only M01 writes request execution records; business modules consume idempotency through M01 contract. | CLEAR_SOURCE_OWNER |
| `outbox_events` | M01 Platform/Foundation | Outbox | GLOBAL/TENANT | P1 | CORE | Use cases append event intent through M01 in the same transaction; worker dispatches only side effects. | CLEAR_SOURCE_OWNER |
| `system_configurations` | M01 Platform/Foundation | Configuration | GLOBAL/TENANT | P1 | CORE | M01 owns typed/versioned operational configuration and feature gates. | CLEAR_SOURCE_OWNER |
| `accounts` | M02 Identity | Account | GLOBAL | P2 | CORE | M02 owns global identity; no tenant ownership on Account. | CLEAR_SOURCE_OWNER |
| `account_credentials` | M02 Identity | Account | GLOBAL | P2 | CORE | M02 owns credential hash and authentication secret lifecycle. | CLEAR_SOURCE_OWNER |
| `account_tokens` | M02 Identity | Account | GLOBAL | P2 | CORE | M02 owns one-time verification/recovery tokens. | CLEAR_SOURCE_OWNER |
| `sessions` | M02 Identity | Session | GLOBAL | P2 | CORE | M02 owns session and refresh lifecycle; membership is not embedded authority. | CLEAR_SOURCE_OWNER |
| `organizations` | M03 Tenancy | Organization | GLOBAL | P3 | CORE | M03 owns tenant root; academic structure belongs to M05. | CLEAR_SOURCE_OWNER |
| `tenant_memberships` | M03 Tenancy | Membership | TENANT | P3 | CORE | M03 owns account-organization membership lifecycle. | CLEAR_SOURCE_OWNER |
| `membership_invitations` | M03 Tenancy | Invitation | TENANT | P3 | CORE | M03 owns invitations before/after account creation. | CLEAR_SOURCE_OWNER |
| `roles` | M04 Authorization | Role | GLOBAL/TENANT | P4 | CORE | M04 owns role definitions, not business relationships. | CLEAR_SOURCE_OWNER |
| `permissions` | M04 Authorization | Permission | GLOBAL | P4 | CORE | M04 owns permission catalog contract. | CLEAR_SOURCE_OWNER |
| `role_permissions` | M04 Authorization | Role | GLOBAL/TENANT | P4 | CORE | M04 owns role-permission relation. | CLEAR_SOURCE_OWNER |
| `role_assignments` | M04 Authorization | Assignment | TENANT | P4 | CORE | M04 owns role assignment to membership. | CLEAR_SOURCE_OWNER |
| `role_assignment_scopes` | M04 Authorization | Assignment | TENANT | P4 | CORE | M04 owns normalized assignment scope records. | CLEAR_SOURCE_OWNER |
| `academic_units` | M05 Academic Organization | AcademicUnit | TENANT | P5 | CORE | M05 owns academic hierarchy and parent/type rules. | CLEAR_SOURCE_OWNER |
| `academic_profiles` | M06 Academic Profiles | AcademicProfile | TENANT | P5 | CORE | M06 owns role-specific academic profile, not identity. | CLEAR_SOURCE_OWNER |
| `academic_placements` | M06 Academic Profiles | Placement | TENANT | P5 | CORE | M06 owns placement history and overlap policy evidence. | CLEAR_SOURCE_OWNER |
| `campaign_templates` | M07 Campaign | CampaignTemplate | TENANT | P6 | CORE | M07 owns project-type templates. | CLEAR_SOURCE_OWNER |
| `campaign_template_versions` | M07 Campaign | CampaignTemplate | TENANT | P6 | CORE | M07 owns immutable published policy/workflow snapshots. | CLEAR_SOURCE_OWNER |
| `academic_campaigns` | M07 Campaign | Campaign | TENANT | P6 | CORE | M07 owns campaign lifecycle. | CLEAR_SOURCE_OWNER |
| `campaign_participants` | M07 Campaign | CampaignParticipant | TENANT | P6 | CORE | M07 owns eligibility/participant snapshot for campaign. | CLEAR_SOURCE_OWNER |
| `topic_proposals` | M08 Topic | TopicProposal | TENANT | P7 | CORE | M08 owns proposal state and edit/review lifecycle. | CLEAR_SOURCE_OWNER |
| `topic_decisions` | M08 Topic | TopicProposal | TENANT | P7 | CORE | M08 owns approval/reject/request-changes evidence. | CLEAR_SOURCE_OWNER |
| `campaign_topics` | M08 Topic | CampaignTopic | TENANT | P7 | CORE | M08 owns official topic catalog materialized from approval. | CLEAR_SOURCE_OWNER |
| `project_registrations` | M09 Project | Registration | TENANT | P8 | CORE | M09 owns registration and approval orchestration. | CLEAR_SOURCE_OWNER |
| `registration_members` | M09 Project | Registration | TENANT | P8 | CORE | M09 owns registration team snapshot. | CLEAR_SOURCE_OWNER |
| `projects` | M09 Project | Project | TENANT | P8 | CORE | M09 owns idempotent Project creation from registration. | CLEAR_SOURCE_OWNER |
| `project_memberships` | M09 Project | Project | TENANT | P9 | CORE | M09 owns official project team membership. | CLEAR_SOURCE_OWNER |
| `supervision_assignments` | M09 Project | Supervision | TENANT | P9 | CORE | M09 owns supervisor assignment and capacity guard integration. | CLEAR_SOURCE_OWNER |
| `project_milestones` | M10 Work Progress | Milestone | TENANT | P9 | CORE | M10 owns minimal project milestone tracking. | CLEAR_SOURCE_OWNER |
| `progress_updates` | M10 Work Progress | ProgressUpdate | TENANT | P9 | CORE | M10 owns progress timeline/update records. | CLEAR_SOURCE_OWNER |
| `documents` | M11 Documents | Document | TENANT | P10 | CORE | M11 owns logical document lifecycle. | CLEAR_SOURCE_OWNER |
| `upload_sessions` | M11 Documents | UploadSession | TENANT | P10 | CORE | M11 owns direct-upload session and object-key authorization. | CLEAR_SOURCE_OWNER |
| `document_versions` | M11 Documents | Document | TENANT | P10 | CORE | M11 owns immutable document version metadata. | CLEAR_SOURCE_OWNER |
| `submissions` | M11 Documents | Submission | TENANT | P11 | CORE | M11 owns official submission pinned to DocumentVersion. | CLEAR_SOURCE_OWNER |
| `feedback_items` | M12 Feedback | Feedback | TENANT | P11 | CORE | M12 owns feedback/revision target records. | CLEAR_SOURCE_OWNER |
| `rubrics` | M13 Review | Rubric | TENANT | P12 | CORE | M13 owns rubric logical identity. | CLEAR_SOURCE_OWNER |
| `rubric_versions` | M13 Review | Rubric | TENANT | P12 | CORE | M13 owns immutable rubric versions. | CLEAR_SOURCE_OWNER |
| `rubric_criteria` | M13 Review | Rubric | TENANT | P12 | CORE | M13 owns criteria under a rubric version. | CLEAR_SOURCE_OWNER |
| `review_assignments` | M13 Review | ReviewAssignment | TENANT | P12 | CORE | M13 owns reviewer assignment pinned to Submission and RubricVersion. | CLEAR_SOURCE_OWNER |
| `reviews` | M13 Review | Review | TENANT | P12 | CORE | M13 owns review draft/submit lifecycle. | CLEAR_SOURCE_OWNER |
| `review_scores` | M13 Review | Review | TENANT | P12 | CORE | M13 owns score rows tied to review criteria. | CLEAR_SOURCE_OWNER |
| `evaluations` | M14 Evaluation | Evaluation | TENANT | P12 | CORE | M14 owns final evaluation state. | CLEAR_SOURCE_OWNER |
| `evaluation_appeals` | M14 Evaluation | Evaluation | TENANT | P12 | CORE | M14 owns appeal workflow and decision evidence. | CLEAR_SOURCE_OWNER |
| `evaluation_amendments` | M14 Evaluation | Evaluation | TENANT | P12 | CORE | M14 owns append-only correction records. | CLEAR_SOURCE_OWNER |
| `notifications` | M15 Communication/Notification | Notification | TENANT | P13 | CORE | M15 owns action-required notification and delivery state. | CLEAR_SOURCE_OWNER |
| `audit_logs` | M16 Audit/Operations | AuditLog | GLOBAL/TENANT | P13 | CORE | M16 owns append-only evidence/investigation log. | CLEAR_SOURCE_OWNER |

## Optional and Deferred Ownership Register

| Table/Aggregate | Source Owner | Candidate Module | Status | Ownership Rule | Adoption Control |
|---|---|---|---|---|---|
| `membership_join_requests` | Tenancy | M03 Tenancy | OPTIONAL | Optional membership request aggregate; not required for core thesis. | Needs approval before core inclusion. |
| `topic_catalog_entries` | Topic | M08 Topic | OPTIONAL | Optional catalog/search helper; canonical topic remains M08. | Needs approval before core inclusion. |
| `project_tasks` | Work Progress | M10 Work Progress | OPTIONAL | Optional task board; M10 core remains minimal milestone/progress only. | Needs approval before core inclusion. |
| `academic_cohorts` | Academic Organization | M05 Academic Organization | OPTIONAL | Optional cohort structure; Class/Cohort decision remains open. | OD-002 / later approval. |
| `academic_classes` | Academic Organization | M05 Academic Organization | OPTIONAL | Optional class structure; not promoted to core in P0-006. | OD-002 / later approval. |
| `document_processing_jobs` | Documents | M11 Documents | OPTIONAL | Optional scan/preview processing job; requires real toolchain. | OD-004 / later approval. |
| `malware_scan_results` | Documents | M11 Documents | OPTIONAL | Optional scanning result; not a core proof. | OD-004 / later approval. |
| `download_grants` | Documents | M11 Documents | OPTIONAL | Optional stronger grant tracking; core still re-authorizes download. | Needs approval before core inclusion. |
| `notification_deliveries` | Communication | M15 Communication/Notification | OPTIONAL | Optional per-channel delivery history; core only requires minimal notification state. | Needs approval before core inclusion. |
| `search_documents` | Search | M17 Search | OPTIONAL | Optional permission-aware search index/read model; no canonical ownership. | Phase 13 Search go/no-go. |
| `search_chunks` | Search | M17 Search | OPTIONAL | Optional search chunk/read model; no canonical ownership. | Phase 13 Search go/no-go. |
| `ai_assistance_runs` | AI/RAG | M18 AI/RAG | OPTIONAL | Optional advisory run evidence; no mutation authority. | Phase 13 AI/RAG go/no-go. |
| `plans` | Commercial SaaS | Deferred roadmap owner TBD | DEFERRED | Billing/commercial aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `plan_features` | Commercial SaaS | Deferred roadmap owner TBD | DEFERRED | Billing/commercial aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `subscriptions` | Commercial SaaS | Deferred roadmap owner TBD | DEFERRED | Billing/commercial aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `invoices` | Commercial SaaS | Deferred roadmap owner TBD | DEFERRED | Billing/commercial aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `usage_meters` | Commercial SaaS | Deferred roadmap owner TBD | DEFERRED | Billing/commercial aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `identity_providers` | Enterprise Identity | Deferred roadmap owner TBD | DEFERRED | Enterprise SSO aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `scim_mappings` | Enterprise Identity | Deferred roadmap owner TBD | DEFERRED | SCIM aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `integration_connectors` | Integration | Deferred roadmap owner TBD | DEFERRED | Integration ecosystem aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `sync_jobs` | Integration | Deferred roadmap owner TBD | DEFERRED | External sync aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `discussion_threads` | Realtime Collaboration | Deferred roadmap owner TBD | DEFERRED | Realtime discussion aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `chat_messages` | Realtime Collaboration | Deferred roadmap owner TBD | DEFERRED | Chat aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `report_runs` | Reporting | Deferred roadmap owner TBD | DEFERRED | Reporting job aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `analytics_events` | Analytics | Deferred roadmap owner TBD | DEFERRED | Product analytics aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `vector_embeddings` | AI Infrastructure | Deferred roadmap owner TBD | DEFERRED | Vector DB/RAG infrastructure outside Core Thesis. | Change approval and roadmap trigger. |
| `event_stream_offsets` | Event Streaming | Deferred roadmap owner TBD | DEFERRED | Kafka/NATS consumer offset aggregate outside Core Thesis. | Change approval and roadmap trigger. |
| `service_extraction_registry` | Microservices Governance | Deferred roadmap owner TBD | DEFERRED | Microservice extraction governance outside Core Thesis. | Change approval and roadmap trigger. |
| `deployment_clusters` | Enterprise Operations | Deferred roadmap owner TBD | DEFERRED | Kubernetes/multi-region metadata outside Core Thesis. | Change approval and roadmap trigger. |

## Cross-Module Ownership Rules

| Rule ID | Rule | Enforcement Expectation | Later Audit |
|---|---|---|---|
| OWN-R01 | Each core table/aggregate has exactly one source owner module. | Use table owner from P0-006 matrix unless approved change control exists. | P0-008 checks manifest/table completeness. |
| OWN-R02 | Foreign key reference does not grant mutation ownership. | Consumer may store identifiers/snapshots only through application contracts. | P0-007 checks dependency direction. |
| OWN-R03 | Cross-module write is forbidden by default. | Only owner module command/use case mutates owned aggregate. | P0-007 and P0-017 inspect runtime. |
| OWN-R04 | Transaction orchestration may touch several modules only with clear use-case owner. | Orchestrator uses module contracts; no hidden repository imports. | P0-007 dependency audit. |
| OWN-R05 | M17/M18 have no canonical business-data ownership in core. | They consume permission-filtered read contracts only after gates. | Phase 13 go/no-go. |

## P0-006 Repository Ownership Observation

Read-only inspection found a pre-existing Prisma schema that does not yet match the source Database Capability Manifest. This is not fixed in P0-006 and does not prove implementation completion.

| Observed Artifact | Source Ownership Expectation | Observation | Required Follow-up |
|---|---|---|---|
| `apps/api/prisma/schema.prisma` | Core manifest table names: `organizations`, `accounts`, `tenant_memberships`, `sessions`, role assignment tables. | Pre-existing schema has `tenants`, `users`, `user_roles`, `refresh_tokens`, and `system_info` instead of several source names. | P0-017 implementation alignment audit; later implementation phase migration review. |
| `apps/api/prisma/schema.prisma` | M02 `accounts` are global and must not carry tenant ownership. | Pre-existing `User` maps `users` and includes `tenantId`. | P0-017 alignment issue; do not treat as P0-006 source conflict. |
| `apps/api/prisma/schema.prisma` | M03 owns `organizations` and `tenant_memberships`. | Pre-existing `Tenant` maps `tenants`; no `tenant_memberships` model observed. | P0-017 alignment issue. |
| `apps/api/prisma/schema.prisma` | M04 owns `role_assignments` and `role_assignment_scopes`. | Pre-existing `UserRole` maps `user_roles` with scope fields inline. | P0-017 alignment issue; P0-007 dependency follow-up if imported across modules. |
| `apps/api/src/modules/auth/auth.repository.ts` | M02 must not own tenant authorization or role relationships. | Repository queries `prisma.user` with tenant/roles included. | P0-017 implementation alignment audit. |
| `apps/worker/src/index.ts` | M01 owns `outbox_events`; worker may dispatch side effects only. | Worker directly updates `outbox_events` with SQL. | P0-007 dependency audit and P0-017 worker alignment. |
| `apps/api/src/modules` | M05–M18 source modules are phase-gated runtime work. | Folders currently limited to `auth`, `health`, `system`; no M05–M18 folders observed. | Expected until later phases; do not create runtime modules in Phase 0. |

## P0-006 Ownership Conflicts and Decisions

| ID | Conflict / Decision Need | Evidence | Status | Blocks P0-006? | Follow-up |
|---|---|---|---|---|---|
| OWN-001 | Source manifest assigns each CORE table to exactly one module owner. | 48 CORE entries in Database Capability Manifest. | RESOLVED_FOR_SOURCE | No | P0-008 verifies manifest completeness against DB capability audit. |
| OWN-002 | Optional Class/Cohort ownership remains optional under M05, not core. | `academic_cohorts`, `academic_classes` are OPTIONAL. | NEEDS_APPROVAL | No | OD-002. |
| OWN-003 | Search/AI tables are optional/deferred and do not own canonical business data. | `search_documents`, `search_chunks`, `ai_assistance_runs`, `vector_embeddings`. | RESOLVED_FOR_CORE_SCOPE | No | Phase 13 gate decisions OD-008/OD-009. |
| OWN-004 | Runtime schema names diverge from source manifest naming/ownership. | `schema.prisma` read-only observation. | NON_BLOCKING_REVIEW_P0-017 | No | P0-017 implementation alignment audit. |
| OWN-005 | No source-approved owner for deferred SaaS/integration/realtime/analytics/infrastructure tables. | Deferred roadmap rows in manifest. | DEFERRED | No | Future change control only. |

## Phase Ownership Matrix

| Phase | Lead Modules | Supporting Modules | Capability Delivered | Handoff |
|---|---|---|---|---|
| Phase 1 | M01, M16 minimum | none | Foundation, monorepo, PostgreSQL, worker, outbox, idempotency, health/readiness/meta, basic audit/logging | Phase 2 receives foundation primitives; no account/tenant/domain CRUD |
| Phase 2 | M02 | M01, M16, M15 optional notifications | Global Account authentication and secure session | Phase 3 receives authenticated account/session context |
| Phase 3 | M03 | M02, M01, M16, M15 | Organization/Tenant onboarding and membership lifecycle | Phase 4 receives tenant/membership context |
| Phase 4 | M04 | M03, M01, M16 | RBAC and resource authorization contract | Phase 5+ modules use deny-by-default authorization |
| Phase 5 | M05, M06 | M03, M04, M16 | Academic organization, profiles and placement history | Phase 6 receives academic context |
| Phase 6 | M07 | M05, M06, M04, M16 | Campaign framework, template/version, lifecycle, participants | Phase 7 receives open campaign and policy snapshot |
| Phase 7 | M08 | M07, M04, M06, M16 | Topic proposal, request changes, approval and campaign topic catalog | Phase 8 receives stable CampaignTopic |
| Phase 8 | M09 | M07, M08, M06, M04, M01, M16 | Registration and idempotent Project creation | Phase 9 receives Project aggregate |
| Phase 9 | M09, M10 | M04, M16, M15 | Project membership, supervision assignment and minimal progress | Phase 10 receives project relationships |
| Phase 10 | M11 | M09, M04, M01, M16 | Direct upload, upload session, immutable DocumentVersion | Phase 11 receives immutable versions |
| Phase 11 | M11, M12 | M09, M04, M16, M15 | Official submission and target-pinned feedback/revision requests | Phase 12 receives official Submission target |
| Phase 12 | M13, M14 | M11, M07, M04, M06, M16, M15 | Rubric/review/evaluation/finalize/appeal/amendment workflow | Phase 13 receives critical events and evidence targets |
| Phase 13 | M15, M16 | M01–M14 | Notification, audit, hardening and workflow E2E evidence | Optional Search/AI go/no-go review |
| After Phase 13 gate | M17, M18 optional | M04 and permission-filtered provider contracts | Optional Search and AI/RAG only if approved | No core scope promotion without change control |

## Public Contract Naming Baseline

Contract naming is documentation-level guidance only. Future repository conventions may refine names through ADR, but must preserve boundary intent.

Allowed contract type examples:

- `<Module>Command`
- `<Module>Query`
- `<Module>Policy`
- `<Module>ReadModel`
- `<EventName>Event`
- `<UseCaseName>Result`

Rules:

- Public contract must be separate from internal implementation.
- Do not expose Prisma model as public module contract by default.
- Do not expose internal repository to another module.
- Do not put Express `Request`/`Response` into domain contract.
- Do not put Next.js type into backend domain contract.
- Contract changes require impact review.

## Explicit Forbidden Dependencies

- Domain module depends directly on Express router/controller of another module.
- Module imports internal Prisma repository of another module.
- Frontend imports backend implementation internals.
- M02 Identity depends on hard-coded tenantId from M03.
- M03 Tenancy handles password/session owned by M02.
- M04 Authorization owns every business relationship.
- M07 Campaign depends on hard-coded THESIS-specific logic.
- M09 Project mutates TopicDecision owned by M08.
- M11 Documents bypasses M04 authorization.
- M13 Review mutates Submission owned by M11.
- M14 Evaluation mutates Review owned by M13.
- M15 Notification mutates business aggregate.
- M16 Audit mutates business aggregate.
- M17/M18 bypass M04 or mutate core state.
- Module depends on Redis/Kafka/NATS/OpenSearch in Core Scope.
- Circular import between application modules.
- Shared/common module becomes business logic bucket without owner.

## Known Mismatches

Repository inspection is read-only. P0-006 records source ownership validation and runtime/schema observations only; it does not refactor code, change schema, or complete dependency cycle audit.

| ID | Observation | Evidence | Impact | Follow-up |
|---|---|---|---|---|
| KM-001 | Runtime scaffold exists before Phase 0 sign-off | `apps/api`, `apps/web`, `apps/worker`, Docker/Prisma files in `git status --short` | Pre-existing implementation artifact, not phase evidence | P0-017 implementation alignment audit |
| KM-002 | API folders currently include `common`, `config`, `database`, `generated`, `modules/auth`, `modules/health`, `modules/system`; not M01–M18 folders | `find apps/api/src -maxdepth 4 -type d` | Runtime layout does not yet reflect module map | P0-017 or implementation phase refactor plan |
| KM-003 | `common` contains auth/idempotency/logger/middleware/validation technical primitives | `apps/api/src/common/*` | Some M01/M02 concerns appear in common folder; could become business dumping ground if unmanaged | P0-017 alignment review; future module boundary refactor if needed |
| KM-004 | `modules/auth/auth.repository.ts` uses `prisma.user`, includes tenant/userRoles/rolePermissions | read-only `rg` inspection | Pre-existing Identity code appears tenant-bound, conflicting with Account global invariant | P0-017 implementation alignment audit |
| KM-005 | `common/auth/token.ts` includes `tenantId` in access token payload | read-only `rg` inspection | May conflate authentication with tenant context | P0-017 implementation alignment audit |
| KM-006 | Worker directly updates `outbox_events` with SQL | `apps/worker/src/index.ts` | Aligns M01 outbox worker baseline if kept restricted to outbox | P0-007 dependency audit and P0-017 implementation review |
| KM-007 | Prisma access observed in health/system/auth repositories and seed | `rg prisma\.` read-only inspection | Data access may not yet respect final ownership boundary | P0-007 dependency audit and P0-017 implementation alignment audit |
| KM-010 | Prisma schema table names differ from source manifest (`tenants`, `users`, `user_roles`, `refresh_tokens`, `system_info`) | `apps/api/prisma/schema.prisma` read-only inspection | Pre-existing schema is not accepted as final data ownership evidence | P0-017 alignment audit and later phase migration review |
| KM-008 | No source folder exists for M05–M18 business modules | `find apps/api/src/modules` | Expected because Phase 0 should not create runtime code | Implement only after Phase 0 sign-off and phase order |
| KM-009 | `apps/api/src/generated/prisma` exists while generated artifacts are ignored by `.gitignore` | `find` and `git status --short` | Generated artifact presence is pre-existing; not module evidence | P0-017 generated artifact policy review |

## Change Control

| Change ID | Requested Change | Current Module | Proposed Change | Responsibility Impact | Data Ownership Impact | Dependency Impact | Phase Impact | Migration Impact | Approval Status |
|---|---|---|---|---|---|---|---|---|---|
| MOD-CHG-TEMPLATE | Describe requested module change | Current MXX/module | Rename/grop/tách/move/promote/add dependency | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | NEEDS_APPROVAL |

Changes requiring approval: đổi tên module; gộp module; tách module; chuyển table ownership; thêm cross-module write; promote Optional thành Core; chuyển capability sang phase khác.

## Validation Checklist

| Check | Result | Evidence |
|---|---|---|
| Có đủ M01–M18 | PASS | Module Classification and Detail Cards |
| Không có module thứ 19 | PASS | Classification table lists only M01–M18 |
| Tên module đúng source | PASS | Names match Scope Freeze/source catalog |
| Scope level đúng | PASS | M01–M16 CORE/CORE-MIN, M17/M18 OPTIONAL |
| M17 và M18 vẫn OPTIONAL | PASS | Module Classification |
| M10, M15, M16 là CORE-MIN | PASS | Module Classification |
| Mỗi module có Purpose và Responsibilities | PASS | Detail Cards |
| Mỗi module có Capabilities Provided/Consumed | PASS | Detail Cards |
| Mỗi module có Allowed/Forbidden Dependencies | PASS | Detail Cards |
| Mỗi module có Explicit Non-Responsibilities | PASS | Detail Cards |
| Có Module Interaction Matrix | PASS | Interaction Matrix section |
| Có Data Ownership Summary | PASS | Summary table updated by P0-006 |
| Có P0-006 Detailed Ownership Matrix | PASS | 48 CORE manifest entries mapped to exactly one owner module |
| Có Optional and Deferred Ownership Register | PASS | 12 OPTIONAL and 17 DEFERRED manifest entries captured without promotion to core |
| Mỗi CORE table có đúng một owner | PASS | `CLEAR_SOURCE_OWNER` rows in P0-006 Detailed Ownership Matrix |
| M17/M18 không có canonical core data ownership | PASS | Optional/deferred register keeps Search/AI after gates |
| Runtime/schema mismatch được ghi nhận, không sửa | PASS | P0-006 Repository Ownership Observation and Known Mismatches |
| Có Phase Ownership Matrix | PASS | Phase Ownership Matrix section |
| Có Public Contract Naming Baseline | PASS | Contract naming section |
| Có Explicit Forbidden Dependencies | PASS | Explicit Forbidden Dependencies section |
| Có Known Mismatches | PASS | Known Mismatches section |
| Có Change Control | PASS | Change Control section |
| Có Source References | PASS | Source References section |
| Không tuyên bố runtime/schema alignment đã hoàn tất | PASS | P0-006 limits validation to source manifest ownership and read-only repository observation |
| Không tuyên bố dependency cycle audit đã hoàn tất | PASS | Interaction matrix says P0-007 deferred |
| Không tạo artifact P0-006 riêng | PASS | P0-006 updates `docs/phase-0/MODULE_BOUNDARIES.md` per current convention |
| Không tạo P0-007 artifact | PASS | No new P0-007 artifact in this task |
| Không sửa runtime code | PASS | P0-006 writes docs only |
| Không tuyên bố hoàn tất toàn Phase 0 | PASS | Status limits completion to P0-005/P0-006 only |
| Không chuyển Phase 1 sang started state | PASS | PROJECT_STATUS keeps Phase 1 NOT_STARTED |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — Implementation Scope and 18-module catalog: source module list and scope level.
- `docs/BaoCaoKhoaLuan.docx` — Architecture decision: Modular Monolith First and module boundary requirement.
- `docs/BaoCaoKhoaLuan.docx` — Module boundary and data ownership section: ownership and application contract discipline.
- `docs/BaoCaoKhoaLuan.docx` — Worker boundary: worker process, not microservice, shared modules and outbox reliability.
- `docs/BaoCaoKhoaLuan.docx` — Security architecture: tenant/scope/resource authorization and evidence requirements.
- `docs/BaoCaoKhoaLuan.docx` — Roadmap Phase 0–13: phase ownership and handoff.
- `docs/BaoCaoKhoaLuan.docx` — Database Capability Manifest: source-derived aggregate/table summaries for P0-006 input.
- `docs/BaoCaoKhoaLuan.docx` — Functional Requirements Catalog: capability confirmation where module responsibilities require it.
- `docs/BaoCaoKhoaLuan.docx` — API/UI Catalog: surface summaries for module cards.
- `docs/phase-0/SOURCE_HIERARCHY.md` — source priority and evidence rules.
- `docs/phase-0/SCOPE_FREEZE.md` — module list, scope levels, forbidden core scope and open decisions.
- `docs/phase-0/STACK_LOCK.md` — locked stack, runtime topology and worker boundary.
