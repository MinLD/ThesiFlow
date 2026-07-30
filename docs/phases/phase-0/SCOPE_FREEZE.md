# APLP Scope Freeze

## Purpose

Đóng băng phạm vi APLP ở Phase 0 để ngăn scope creep, giữ Product Vision không bị thu hẹp thành demo, giữ Core Implementation không bị phình thành enterprise platform, và buộc mọi phiên sau phân biệt thiết kế với implementation evidence.

## Status

DONE for P0-003 — Scope Freeze

- Chỉ P0-003 hoàn tất.
- Phase 0 tổng thể vẫn IN_PROGRESS.
- Chưa có Phase 0 sign-off.
- Không có quyền bắt đầu Phase 1 chỉ dựa trên file này.

## Last Updated

2026-07-28 08:48 Asia/Ho_Chi_Minh

## Scope Interpretation Rules

- Product Scope không đồng nghĩa Implementation Scope.
- Demo Scope không thay thế Product Scope.
- Deferred không có nghĩa là bị loại bỏ hoặc technical debt.
- Một capability có trong báo cáo không đồng nghĩa đã được triển khai.
- Code tồn tại sớm không được dùng để tự động mở rộng scope.
- Mọi thay đổi scope phải qua change control.
- Detailed specification thắng overview.
- Phase detail thắng roadmap summary.
- Business invariant thắng implementation convenience.
- Database Manifest, FR Catalog, API Catalog, UI Catalog và Roadmap phải được đối chiếu cùng nhau.

## 1. Full Product Vision

APLP là nền tảng quản lý vòng đời dự án học thuật cho nhiều organization: trường đại học, trung tâm đào tạo, viện nghiên cứu hoặc tổ chức giáo dục. Product Vision hỗ trợ nhiều academic unit và nhiều loại dự án bằng campaign/template và versioned policy, không hard-code toàn hệ thống cho riêng THESIS.

Cấu trúc tổng quát được đóng băng là `Platform → Organization → Academic Unit → Member`. Trong implementation chi tiết, Academic Unit có thể mở rộng thành Faculty, Department, Academic Program, Class/Cohort theo source. Account là danh tính toàn cục; TenantMembership là tư cách trong từng organization.

Các loại dự án trong Product Vision gồm THESIS, GRADUATION_PROJECT, SPECIALIZED_PROJECT, COURSE_PROJECT, CAPSTONE, STUDENT_RESEARCH, LECTURER_RESEARCH, INDUSTRY_PROJECT, INTERDISCIPLINARY_PROJECT. Loại dự án mới phải được hỗ trợ qua template/policy thay vì tạo workflow hard-code riêng.

| Capability | Included in Product Vision | Implementation Commitment | Notes |
|---|---|---|---|
| Multi-organization platform | Yes | Core supports tenant boundaries in thesis scope | Demo one organization does not limit product scope |
| Multiple academic units | Yes | Core models necessary academic hierarchy and scope checks | Depth follows phased implementation |
| Multiple project types | Yes | Campaign/template/policy model supports extensibility | Full E2E commitment is THESIS first |
| THESIS workflow | Yes | Primary graduation vertical slice | Not the only product type |
| New project type through template/policy | Yes | Architecture must avoid hard-coded global workflow | Advanced policy UI may be phased |
| Global Account | Yes | Must remain separate from tenant membership | Business invariant |
| TenantMembership | Yes | Core tenancy concept | Account membership can vary per organization |
| Evidence-driven workflow | Yes | Core implementation priority | Prefer invariant depth over shallow CRUD volume |
| Enterprise integrations | Yes, future product direction | Deferred | Requires provider sandbox and governance |
| Search/AI | Yes, optional future capability | Not core before Phase 13 gate | Advisory-only if later approved |

## 2. Core Implementation Scope

Core Implementation Scope is the Phase 0–13 roadmap under Modular Monolith First. The core vertical slice focuses on an end-to-end THESIS workflow. M01 to M16 create the core workflow, with M10, M15 and M16 intentionally minimal where source says CORE-MIN. Search and AI/RAG are not core implementation before the Phase 13 gate.

Core scope optimizes for business invariants and a defensible workflow over many shallow CRUD screens. Modules are not required to reach the same enterprise-grade depth.

| Module | Scope Level | Core Commitment | Explicit Limitation |
|---|---|---|---|
| M01 Platform/Foundation | CORE | Request lifecycle, config, idempotency, outbox, error envelope, worker baseline | No Kafka/Redis/Kubernetes; no domain CRUD in Phase 1 |
| M02 Identity | CORE | Global account, authentication, secure session | Must not bind account identity permanently to one tenant |
| M03 Tenancy | CORE | Organization and TenantMembership boundary | Demo tenant count does not limit product scope |
| M04 Authorization | CORE | RBAC, scope, relationship and state-aware deny-by-default checks | No enterprise SSO/SCIM in core |
| M05 Academic Organization | CORE | Academic structure needed for faculty/department/program scope | Class/Cohort final status tracked in open decision |
| M06 Academic Profiles | CORE | Academic profile and historical placement | No full SIS replacement |
| M07 Campaign | CORE | Campaign template/version, lifecycle, participant eligibility | No one-off hard-coded THESIS-only platform |
| M08 Topic | CORE | Topic proposal, change request, approval, official catalog | No marketplace or external topic ecosystem |
| M09 Project | CORE | Registration, idempotent Project creation, team/supervision basis | No general project-management clone |
| M10 Work Progress | CORE-MIN | Minimal milestone/progress for thesis workflow | Not Jira clone; no advanced planning suite |
| M11 Documents | CORE | Direct upload, immutable DocumentVersion, submission pinning | No general-purpose file drive; scanning may be limited |
| M12 Feedback | CORE | Feedback tied to exact resource/version target | No realtime chat |
| M13 Review | CORE | Assignment, rubric version pinning, review lifecycle and score | No AI grading |
| M14 Evaluation | CORE | Official result, finalize guard, append-only amendment | No direct mutation of finalized evaluation |
| M15 Communication/Notification | CORE-MIN | Action-required notifications for critical workflow events | No realtime chat or presence |
| M16 Audit/Operations | CORE-MIN | Audit trail and operational evidence needed for defense | No enterprise observability platform |
| M17 Search | OPTIONAL | PostgreSQL permission-aware search only if core gate allows | No OpenSearch before adoption trigger |
| M18 AI/RAG | OPTIONAL | Advisory checklist/Q&A with citation only if approved after core gate | No vector DB or dedicated RAG infrastructure in core |

## 3. Graduation Vertical Slice

Target THESIS workflow for implementation evidence:

1. Organization và academic structure.
2. Account, membership, role và scope.
3. Campaign template/version và campaign lifecycle.
4. Topic proposal, request changes và approval.
5. Registration và idempotent Project creation.
6. Project membership, supervisor và milestone tối thiểu.
7. Direct upload và immutable DocumentVersion.
8. Submission pin đúng DocumentVersion.
9. Feedback/revision request đúng target.
10. Review assignment pin Submission và RubricVersion.
11. Evaluation finalize theo guard.
12. Amendment append-only.
13. Notification, audit timeline và cross-tenant deny evidence.

Đây là mục tiêu implementation slice. Không được tuyên bố các bước này đã được code chỉ vì có trong tài liệu. Implementation evidence sẽ được đánh giá riêng bằng artifact, migration, test, run output hoặc demo evidence.

## 4. Demo Data Scope

Demo Data Scope là tập dữ liệu bảo vệ và kiểm chứng workflow, không phải định nghĩa Product Scope.

| Demo Item | Quantity/Scope | Purpose | Not a Product Limitation |
|---|---|---|---|
| Main organization | 1 organization, “Đại học APLP Demo” hoặc tên tương đương | Demo tenant chính | Product supports many organizations |
| Faculty/department samples | 2 units | Show academic scope and cross-unit authorization | Product supports broader hierarchy |
| THESIS campaign | 1 full E2E campaign | Main defense workflow | Product is not THESIS-only |
| SPECIALIZED_PROJECT template | 1 seed template | Show configurable project type | No full E2E commitment |
| STUDENT_RESEARCH template | 1 seed template | Show research-type extensibility | No full E2E commitment |
| Organization Admin | Demo role | Tenant administration and setup | Role catalog may expand later |
| Coordinator | Demo role | Campaign/topic/project coordination | Not the only admin workflow |
| Student | Demo role | Registration, upload, submission, appeal | Supports other participant types later |
| Supervisor | Demo role | Topic/project guidance and feedback | Not full HR/SIS model |
| Reviewer | Demo role | Review assignment and scoring | Committee policy remains open |
| Auditor | Demo role | Audit and evidence review | Not enterprise audit platform |
| Platform Admin or Committee/Evaluator | Optional if demo needs | Setup/evaluation scenario support | Does not widen core scope automatically |
| Second tenant | Minimal tenant for tests | Cross-tenant isolation evidence | UI demo remains focused on main tenant |

Demo một organization không có nghĩa Product Scope chỉ phục vụ một trường.

## 5. Deferred Roadmap

Deferred capabilities remain valid roadmap items. They are not canceled and not automatically technical debt.

### Distributed Infrastructure

| Capability | Status | Adoption Trigger | Reason Deferred |
|---|---|---|---|
| Redis/BullMQ | DEFERRED | Measured queue/SLO need or worker bottleneck | PostgreSQL/outbox is sufficient baseline |
| Kafka/NATS | DEFERRED | Independent scaling/topology requirement with evidence | Adds distributed complexity too early |
| Kubernetes | DEFERRED | Deployment topology and operations team require it | Docker/local deployment enough for thesis |
| Microservices | DEFERRED | Bounded context extraction justified by load/team ownership | Modular monolith preserves ACID and simplicity |
| Multi-region | DEFERRED | Availability/SLO and data residency demand it | Not needed for graduation demo |

### Enterprise Capabilities

| Capability | Status | Adoption Trigger | Reason Deferred |
|---|---|---|---|
| SSO/SCIM | DEFERRED | Enterprise customer/governance requirement | Core auth/RBAC must stabilize first |
| Billing | DEFERRED | Commercialization and pricing validation | Thesis focuses academic workflow |
| Marketplace | DEFERRED | Extension ecosystem and governance approved | Scope creep risk |
| Extension SDK | DEFERRED | Stable module/API boundary and partner need | Premature before core workflow evidence |

### External Integrations

| Capability | Status | Adoption Trigger | Reason Deferred |
|---|---|---|---|
| SIS | DEFERRED | Provider sandbox, data owner and reconciliation plan | Avoid becoming SIS clone |
| LMS | DEFERRED | Integration owner and course workflow evidence | Avoid LMS clone |
| Calendar | DEFERRED | Scheduling requirements exceed in-app deadlines | Not required for THESIS E2E |
| Drive connector ecosystem | DEFERRED | Provider integration plan and security model | Avoid general-purpose file drive |

### Advanced Search and AI

| Capability | Status | Adoption Trigger | Reason Deferred |
|---|---|---|---|
| OpenSearch | DEFERRED | PostgreSQL search fails benchmark or scale evidence | M17 is optional PostgreSQL baseline only |
| Vector database | DEFERRED | Approved AI/RAG scope and evaluation need | M18 optional after core gate |
| Dedicated RAG infrastructure | DEFERRED | AI/RAG go decision plus citations/eval plan | Not core thesis infrastructure |
| AI evaluation infrastructure | DEFERRED | AI/RAG pilot requires measurable eval | Core workflow comes first |

### Advanced Collaboration

| Capability | Status | Adoption Trigger | Reason Deferred |
|---|---|---|---|
| Realtime chat | DEFERRED | User need plus retention/moderation policy | Notifications cover core action flow |
| Presence | DEFERRED | Realtime collaboration requirement | Not needed for evidence workflow |
| Mobile/offline | DEFERRED | Field usage validates device/offline need | Web demo scope is sufficient |

## 6. Explicitly Forbidden Core Scope

Core Thesis không được tự ý bổ sung:

- NestJS.
- Microservices.
- Redis/BullMQ.
- Kafka/NATS.
- Kubernetes.
- Multi-region.
- Realtime chat.
- Billing.
- Marketplace.
- SSO/SCIM.
- OpenSearch.
- Vector database.
- Dedicated RAG infrastructure.
- Enterprise integration ecosystem.
- Jira clone.
- LMS clone.
- General-purpose file drive.

Nếu capability không nằm trong Core Scope thì không được triển khai chỉ vì runtime code có thể hỗ trợ.

## 7. Scope Boundaries by Phase

| Phase | Capability Boundary | Forbidden Scope | Handoff |
|---|---|---|---|
| Phase 0 | Freeze Product/Core/Demo/Deferred, source hierarchy, invariants, module boundary, manifest and evidence plan | Runtime code, migration, route, UI, stack change | Phase 1 receives stack lock, module map, naming, error contract, ownership |
| Phase 1 | Foundation, monorepo, PostgreSQL, worker, outbox, idempotency, health/readiness/meta, test foundation | Account/tenant/domain CRUD; Kafka/Redis/Kubernetes | Phase 2 receives foundation primitives |
| Phase 2 | Global account authentication and secure session | Tenant-hard-coded identity; enterprise SSO/SCIM | Phase 3 receives authenticated account/session context |
| Phase 3 | Organization/Tenant onboarding and membership boundary | Academic hierarchy depth beyond onboarding | Phase 4 receives tenant/membership context |
| Phase 4 | RBAC and resource authorization by tenant, permission, scope, relationship, state | Allow-by-default shortcuts; broad admin bypass | Phase 5 receives authorization contract |
| Phase 5 | Academic organization/profile and placement history | SIS clone; unresolved Class/Cohort overreach | Phase 6 receives academic context |
| Phase 6 | Campaign framework, campaign type/template/version and lifecycle | Hard-coded single THESIS workflow | Phase 7 receives open campaign/policy snapshot |
| Phase 7 | Topic proposal/catalog/change request/approval | Marketplace or external topic ecosystem | Phase 8 receives stable CampaignTopic |
| Phase 8 | Registration and idempotent Project creation | Duplicate project creation; broad project management suite | Phase 9 receives project aggregate |
| Phase 9 | Project membership, supervision and minimal progress | Jira clone; advanced workload planning | Phase 10 receives project relationships |
| Phase 10 | Direct upload, upload session, immutable DocumentVersion | Public object URL; general file drive; mandatory production scanning without toolchain | Phase 11 receives immutable versions |
| Phase 11 | Submission and feedback pinned to exact version/target | Retargeting official submission; untargeted feedback | Phase 12 receives official submission |
| Phase 12 | Review, rubric version, scoring, evaluation finalize, appeal/amendment | AI grading; direct finalized mutation; advanced committee optimization | Phase 13 receives critical events |
| Phase 13 | Notification, audit, hardening and E2E evidence matrix | Chat, billing, Kafka, Kubernetes, AI before core pass | Optional Search/AI only after go/no-go review |

## 8. Open Scope Decisions

| Decision ID | Current Baseline | Options | Impact | Blocks P0-003? | Blocks Phase 1? |
|---|---|---|---|---|---|
| OD-001 Graduation Implementation Slice cuối cùng | THESIS full E2E as primary slice | Keep THESIS slice; adjust by advisor/committee | Affects demo script and later handoff depth | No | No; resolve before domain execution if changed |
| OD-002 Class/Cohort CORE hay OPTIONAL | Treat Class/Cohort as optional/detail unless source section requires core use | Keep optional; promote limited core fields | Affects academic schema and Phase 5 | No | No |
| OD-003 Appeal/deadline policy | Keep policy minimal until Phase 12 | Simple deadline; richer appeal workflow | Affects evaluation rules and tests | No | No |
| OD-004 File scanning | Do not claim production scanning without evidence | Manual/controlled demo; scanner integration later | Affects Phase 10 security evidence | No | No |
| OD-005 Rubric policy | RubricVersion pinning required; advanced policy open | Simple rubric; quorum/COI-aware rubric rules | Affects Phase 12 scoring | No | No |
| OD-006 Quorum | Quorum details open | 1 reviewer; 2 reviewers; committee quorum | Affects review/evaluation finalization | No | No |
| OD-007 Conflict-of-interest | COI policy open | Minimal deny list; full COI workflow | Affects review assignment authorization | No | No |
| OD-008 Search gate | M17 optional after Phase 13 core gate | Skip; PostgreSQL search; later OpenSearch | Affects optional roadmap only | No | No |
| OD-009 AI/RAG gate | M18 optional after Phase 13 core gate | Skip; advisory-only; later RAG | Affects optional roadmap only | No | No |

No Open Decision is approved by this file.

## 9. Change Control

Any scope change after this freeze requires this record:

| Change ID | Requested Change | Reason | Source/Owner | Product Scope Impact | Core Scope Impact | Demo Scope Impact | Database Impact | API/UI Impact | Roadmap Impact | Test/Evidence Impact | Approval Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CHG-TEMPLATE | Describe requested change | Why change is needed | Requester or source | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | Required checks/evidence | NEEDS_APPROVAL |

Không được thay scope bằng cách âm thầm sửa code.

## 10. Known Mismatches

| ID | Mismatch | Evidence | Handling | Status |
|---|---|---|---|---|
| KM-001 | Runtime code, migration và Docker đã tồn tại trước Phase 0 sign-off | `git status --short` shows pre-existing runtime changes; `docs/PROJECT_STATUS.md` BI-002 | Preserve; audit at P0-017; do not count as automatic core acceptance | NON_BLOCKING_REVIEW_P0-017 |
| KM-002 | Pre-existing runtime artifacts may not match final Account/TenantMembership invariant | Source says Account is global and TenantMembership is per organization | Audit during P0-017 and refactor only in implementation phase | OPEN |
| KM-003 | Phase 0 artifacts after P0-003 still incomplete | `docs/PROJECT_STATUS.md` task table | Continue P0-004 next; do not start Phase 1 | OPEN |

Không sửa hoặc xóa runtime code trong P0-003.

## 11. Validation Checklist

| Check | Result | Evidence |
|---|---|---|
| Có đủ bốn lớp phạm vi | PASS | Sections 1, 2, 4, 5 cover Product/Core/Demo/Deferred |
| Product Scope không bị thu hẹp thành Demo Scope | PASS | Demo section explicitly says one organization is not product limit |
| Core Scope không chứa Search/AI trước gate | PASS | M17/M18 optional; deferred advanced Search/AI |
| Demo Scope không được mô tả là toàn bộ sản phẩm | PASS | Demo table includes Not a Product Limitation column |
| Deferred capability không bị mô tả là đã bị loại bỏ | PASS | Deferred section says not canceled |
| Không có NestJS trong Core Scope | PASS | NestJS appears only in Explicitly Forbidden Core Scope |
| Không có microservices trong Core Scope | PASS | Microservices appears only deferred/forbidden |
| THESIS là vertical slice chính | PASS | Graduation Vertical Slice section |
| M17 và M18 là OPTIONAL | PASS | Core module table |
| Không tuyên bố implementation đã hoàn thành | PASS | Evidence rules and known mismatches prevent this |
| Không tuyên bố hoàn tất toàn Phase 0 | PASS | Status limits completion to P0-003 only |
| Không sửa runtime code | PASS | P0-003 commands write docs only |
| Open Decisions chưa bị tự phê duyệt | PASS | Open decisions remain NEEDS_APPROVAL or baseline-only |
| Có Source References | PASS | Source References section |

## 12. Source References

- `docs/BaoCaoKhoaLuan.docx` — Executive Summary: separates Product Scope, Implementation Scope, Demo Scope, Deferred Roadmap and notes Search/AI after core gate.
- `docs/BaoCaoKhoaLuan.docx` — Product Scope: multi-organization, multiple project types, Account vs TenantMembership, campaign/template policy.
- `docs/BaoCaoKhoaLuan.docx` — Implementation Scope: 18 modules; M01–M16 core/minimal; M17 Search and M18 AI/RAG optional.
- `docs/BaoCaoKhoaLuan.docx` — Demo Scope: one demo organization, two faculty/department samples, THESIS full E2E, additional templates not full E2E.
- `docs/BaoCaoKhoaLuan.docx` — Deferred Roadmap: distributed infrastructure, enterprise capabilities, integrations, Search/AI, collaboration.
- `docs/BaoCaoKhoaLuan.docx` — Module catalog: module names, scope levels and roles for M01–M18.
- `docs/BaoCaoKhoaLuan.docx` — Roadmap Phase 0–13: phase boundaries and handoff strategy.
- `docs/BaoCaoKhoaLuan.docx` — Graduation vertical slice: THESIS workflow and evidence expectations.
- `docs/BaoCaoKhoaLuan.docx` — Risk register: scope creep, foundation time, Search/AI delay, file scanning limitations.
- `docs/phase-0/SOURCE_HIERARCHY.md` — source priority, evidence rules and mismatch handling.
