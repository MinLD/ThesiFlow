# APLP Database Manifest Audit

## Purpose

Reconcile toàn bộ Database Capability Manifest trong `docs/BaoCaoKhoaLuan.docx` với module ownership, phase ownership, tenant scope và runtime evidence hiện có. Artifact này ghi mismatch phục vụ P0-009, P0-010 và P0-017; không sửa source hoặc runtime.

## Status

DONE for P0-008 — Database Manifest Audit

- Chỉ P0-008 hoàn thành.
- Phase 0 tổng thể vẫn IN_PROGRESS.
- Chưa có Phase 0 sign-off.
- P0-009 chưa được thực hiện.
- Audit này không thay đổi runtime schema.
- Runtime code/schema/migration/seed hiện có là pre-existing implementation artifact; không tự động được chấp nhận là source-compliant.

## Last Updated

2026-07-29 11:24 Asia/Ho_Chi_Minh

## Audit Scope

- Source manifest: Phụ lục A/B Database Capability Manifest trong `docs/BaoCaoKhoaLuan.docx`.
- Module ownership: `docs/phase-0/MODULE_BOUNDARIES.md`.
- Dependency/runtime access: `docs/phase-0/MODULE_DEPENDENCIES.md`.
- Runtime Prisma: `apps/api/prisma/schema.prisma`.
- Runtime migrations: `apps/api/prisma/migrations/*/migration.sql`.
- Runtime seed: `apps/api/prisma/seed.ts`.
- Worker SQL: `apps/worker/src/index.ts`.
- Repository/API evidence: `apps/api/src/modules/*`, `apps/api/src/database/prisma.ts`.

## Audit Method

1. Trích xuất toàn bộ manifest rows từ DOCX table có header `Table name | Module owner`.
2. Chuẩn hóa table/capability name bằng text trong manifest, không tự rename.
3. Nhóm theo `CORE`, `OPTIONAL`, `DEFERRED` và đếm thực tế.
4. Nhóm theo module owner và đối chiếu với M01–M18 trong `MODULE_BOUNDARIES.md`.
5. Đối chiếu phase bằng manifest `Phase` và Phase Ownership Matrix.
6. Đối chiếu tenant scope bằng manifest `Tenant scope` và runtime field/path khi có.
7. Đối chiếu Prisma models, `@@map`, `@map`, relation, status/version/tenant fields read-only.
8. Đối chiếu migration files; không kết luận migration applied nếu chỉ thấy file.
9. Đối chiếu raw SQL/Prisma access từ repositories, seed và worker.
10. Ghi mismatch/finding; không sửa source, schema, migration, seed hoặc worker SQL.

## Manifest Count Reconciliation

| Classification | Expected Count | Extracted Count | Result | Evidence |
|----------------|----------------|-----------------|--------|----------|
| CORE | 48 | 48 | PASS | Extracted rows from DOCX manifest table |
| OPTIONAL | 12 | 12 | PASS | Extracted rows from DOCX manifest table |
| DEFERRED | 17 | 17 | PASS | Extracted rows from DOCX manifest table |
| TOTAL | 77 | 77 | PASS | CORE + OPTIONAL + DEFERRED |

No duplicate manifest table/capability names observed in extracted rows.

## Full Manifest Register

| ID | Table/Capability | Module Owner | Business Purpose | Aggregate | Tenant Scope | Phase | Design Status | Runtime Evidence | Audit Result | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| DB-001 | `idempotency_records` | M01 Platform/Foundation | Chống lặp cho command/API quan trọng | Request execution | GLOBAL/TENANT | P1 | CORE | IMPLEMENTED_AND_OBSERVED | ALIGNED | Prisma model `IdempotencyRecord` maps `@@map("idempotency_records")`. |
| DB-002 | `outbox_events` | M01 Platform/Foundation | Lưu event intent cùng transaction nghiệp vụ | Outbox | GLOBAL/TENANT | P1 | CORE | IMPLEMENTED_AND_OBSERVED | ALIGNED | Prisma model `OutboxEvent` maps `@@map("outbox_events")`. |
| DB-003 | `system_configurations` | M01 Platform/Foundation | Cấu hình typed/versioned và feature gates | Configuration | GLOBAL/TENANT | P1 | CORE | IMPLEMENTED_AND_OBSERVED | ALIGNED | Prisma model `SystemConfiguration` maps `@@map("system_configurations")`. |
| DB-004 | `accounts` | M02 Identity | Danh tính người dùng toàn cục | Account | GLOBAL | P2 | CORE | NAME_MISMATCH | NAME_MISMATCH | Runtime concept appears merged/renamed as `users`; source name `accounts` not present. |
| DB-005 | `account_credentials` | M02 Identity | Credential hash và metadata xác thực | Account | GLOBAL | P2 | CORE | NAME_MISMATCH | NAME_MISMATCH | Runtime concept appears merged/renamed as `users`; source name `account_credentials` not present. |
| DB-006 | `account_tokens` | M02 Identity | Token một lần cho verify/reset | Account | GLOBAL | P2 | CORE | NAME_MISMATCH | NAME_MISMATCH | Runtime concept appears merged/renamed as `refresh_tokens`; source name `account_tokens` not present. |
| DB-007 | `sessions` | M02 Identity | Phiên đăng nhập và refresh rotation | Session | GLOBAL | P2 | CORE | NAME_MISMATCH | NAME_MISMATCH | Runtime concept appears merged/renamed as `refresh_tokens`; source name `sessions` not present. |
| DB-008 | `organizations` | M03 Tenancy | Biên tổ chức/tenant | Organization | GLOBAL | P3 | CORE | NAME_MISMATCH | NAME_MISMATCH | Runtime concept appears merged/renamed as `tenants`; source name `organizations` not present. |
| DB-009 | `tenant_memberships` | M03 Tenancy | Liên kết account với organization | Membership | TENANT | P3 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-010 | `membership_invitations` | M03 Tenancy | Mời người dùng vào tenant | Invitation | TENANT | P3 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-011 | `roles` | M04 Authorization | Định nghĩa role theo platform/tenant | Role | GLOBAL/TENANT | P4 | CORE | IMPLEMENTED_AND_OBSERVED | ALIGNED | Prisma model `Role` maps `@@map("roles")`. |
| DB-012 | `permissions` | M04 Authorization | Danh mục hành động chuẩn | Permission | GLOBAL | P4 | CORE | IMPLEMENTED_AND_OBSERVED | ALIGNED | Prisma model `Permission` maps `@@map("permissions")`. |
| DB-013 | `role_permissions` | M04 Authorization | Quan hệ nhiều-nhiều role-permission | Role | GLOBAL/TENANT | P4 | CORE | IMPLEMENTED_AND_OBSERVED | ALIGNED | Prisma model `RolePermission` maps `@@map("role_permissions")`. |
| DB-014 | `role_assignments` | M04 Authorization | Cấp role cho membership | Assignment | TENANT | P4 | CORE | NAME_MISMATCH | NAME_MISMATCH | Runtime concept appears merged/renamed as `user_roles`; source name `role_assignments` not present. |
| DB-015 | `role_assignment_scopes` | M04 Authorization | Giới hạn assignment tới đơn vị/campaign/project | Assignment | TENANT | P4 | CORE | NAME_MISMATCH | NAME_MISMATCH | Runtime concept appears merged/renamed as `user_roles`; source name `role_assignment_scopes` not present. |
| DB-016 | `academic_units` | M05 Academic Organization | Hierarchy tổ chức chính: Faculty/Department/Program/Center/Institute/Other | AcademicUnit | TENANT | P5 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-017 | `academic_profiles` | M06 Academic Profiles | Hồ sơ học thuật của membership | AcademicProfile | TENANT | P5 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-018 | `academic_placements` | M06 Academic Profiles | Gán profile vào unit/lớp/chương trình theo thời gian | Placement | TENANT | P5 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-019 | `campaign_templates` | M07 Campaign | Định danh template cấu hình nhiều loại dự án | CampaignTemplate | TENANT | P6 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-020 | `campaign_template_versions` | M07 Campaign | Snapshot workflow/policy/milestone/rubric refs | CampaignTemplate | TENANT | P6 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-021 | `academic_campaigns` | M07 Campaign | Một đợt học thuật cụ thể | Campaign | TENANT | P6 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-022 | `campaign_participants` | M07 Campaign | Ghi nhận người đủ điều kiện/tham gia và snapshot | CampaignParticipant | TENANT | P6 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-023 | `topic_proposals` | M08 Topic | Đề xuất đề tài có trạng thái | TopicProposal | TENANT | P7 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-024 | `topic_decisions` | M08 Topic | Quyết định approve/reject/request-change | TopicProposal | TENANT | P7 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-025 | `campaign_topics` | M08 Topic | Topic khả dụng trong campaign sau materialize | CampaignTopic | TENANT | P7 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-026 | `project_registrations` | M09 Project | Yêu cầu nhóm đăng ký campaign topic | Registration | TENANT | P8 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-027 | `registration_members` | M09 Project | Thành viên đề nghị trong registration | Registration | TENANT | P8 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-028 | `projects` | M09 Project | Đơn vị thực hiện sau registration được duyệt | Project | TENANT | P8 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-029 | `project_memberships` | M09 Project | Thành viên chính thức của project | Project | TENANT | P9 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-030 | `supervision_assignments` | M09 Project | Phân công hướng dẫn có thời hạn/trạng thái | Supervision | TENANT | P9 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-031 | `project_milestones` | M10 Work Progress | Cột mốc đã materialize cho project | Milestone | TENANT | P9 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-032 | `progress_updates` | M10 Work Progress | Bản cập nhật tiến độ có người tạo/thời điểm | ProgressUpdate | TENANT | P9 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-033 | `documents` | M11 Documents | Logical document theo loại và project | Document | TENANT | P10 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-034 | `upload_sessions` | M11 Documents | Phiên presigned direct upload có expiry/checksum | UploadSession | TENANT | P10 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-035 | `document_versions` | M11 Documents | Metadata bất biến của một file version | Document | TENANT | P10 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-036 | `submissions` | M11 Documents | Bản nộp chính thức ghim DocumentVersion | Submission | TENANT | P11 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-037 | `feedback_items` | M12 Feedback | Feedback/revision request gắn đúng target | Feedback | TENANT | P11 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-038 | `rubrics` | M13 Review | Logical aggregate root của rubric | Rubric | TENANT | P12 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-039 | `rubric_versions` | M13 Review | Snapshot/version bất biến của Rubric | Rubric | TENANT | P12 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-040 | `rubric_criteria` | M13 Review | Tiêu chí và trọng số thuộc một rubric version | Rubric | TENANT | P12 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-041 | `review_assignments` | M13 Review | Gán reviewer, target Submission, RubricVersion, round, deadline và COI | ReviewAssignment | TENANT | P12 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-042 | `reviews` | M13 Review | Review draft/submitted/locked theo assignment và attempt | Review | TENANT | P12 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-043 | `review_scores` | M13 Review | Điểm/comment theo criterion của một Review | Review | TENANT | P12 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-044 | `evaluations` | M14 Evaluation | Kết quả tổng hợp/finalized chính thức | Evaluation | TENANT | P12 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-045 | `evaluation_appeals` | M14 Evaluation | Yêu cầu xem xét lại evaluation có trạng thái và quyết định | Evaluation | TENANT | P12 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-046 | `evaluation_amendments` | M14 Evaluation | Quyết định sửa chính thức sau finalize; có thể liên kết appeal | Evaluation | TENANT | P12 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-047 | `notifications` | M15 Communication/Notification | Thông báo action-required và deadline | Notification | TENANT | P13 | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-048 | `audit_logs` | M16 Audit/Operations | Bằng chứng transition bảo mật/nghiệp vụ | AuditLog | GLOBAL/TENANT | P13 | CORE | IMPLEMENTED_AND_OBSERVED | ALIGNED | Prisma model `AuditLog` maps `@@map("audit_logs")`. |
| DB-049 | `membership_join_requests` | M03 Tenancy | Yêu cầu tự tham gia tenant có duyệt | Optional aggregate | TENANT/GLOBAL tùy owner | P3+ | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-050 | `topic_catalog_entries` | M08 Topic | Kho đề tài tái sử dụng ngoài proposal | Optional aggregate | TENANT/GLOBAL tùy owner | P7+ | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-051 | `project_tasks` | M10 Work Progress | Task chi tiết dưới milestone | Optional aggregate | TENANT/GLOBAL tùy owner | P9+ | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-052 | `academic_cohorts` | M05 Academic Organization | Cohort theo program và admission/graduation period | AcademicCohort | TENANT | P5+ | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-053 | `academic_classes` | M05 Academic Organization | Class theo program/cohort và lifecycle riêng | AcademicClass | TENANT | P5+ | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-054 | `document_processing_jobs` | M11 Documents | Theo dõi scan/extract/preview bất đồng bộ | Optional aggregate | TENANT/GLOBAL tùy owner | P10+ | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-055 | `malware_scan_results` | M11 Documents | Kết quả scan và quarantine evidence | Optional aggregate | TENANT/GLOBAL tùy owner | P10+ | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-056 | `download_grants` | M11 Documents | Grant tải xuống ngắn hạn có audit | Optional aggregate | TENANT/GLOBAL tùy owner | P10+ | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-057 | `notification_deliveries` | M15 Communication/Notification | Theo dõi từng lần email/push delivery | Optional aggregate | TENANT/GLOBAL tùy owner | P13+ | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-058 | `search_documents` | M17 Search | Projection metadata cho PostgreSQL search | Optional aggregate | TENANT/GLOBAL tùy owner | P14 | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-059 | `search_chunks` | M17 Search | Đoạn văn có quyền/citation cho retrieval | Optional aggregate | TENANT/GLOBAL tùy owner | P14 | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-060 | `ai_assistance_runs` | M18 AI/RAG | Lưu prompt/model/policy/citation/eval metadata | Optional aggregate | TENANT/GLOBAL tùy owner | P15 | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-061 | `plans` | Commercial SaaS | Định nghĩa gói dịch vụ | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-062 | `plan_features` | Commercial SaaS | Feature/quota theo gói | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-063 | `subscriptions` | Commercial SaaS | Đăng ký thuê bao tenant | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-064 | `invoices` | Commercial SaaS | Hóa đơn/thanh toán | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-065 | `usage_meters` | Commercial SaaS | Đo usage tính phí | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-066 | `identity_providers` | Enterprise Identity | Cấu hình OIDC/SAML | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-067 | `scim_mappings` | Enterprise Identity | Ánh xạ provisioning SCIM | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-068 | `integration_connectors` | Integration | Connector SIS/LMS/Drive/Calendar | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-069 | `sync_jobs` | Integration | Đồng bộ/reconciliation bền | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-070 | `discussion_threads` | Realtime Collaboration | Thảo luận tài nguyên | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-071 | `chat_messages` | Realtime Collaboration | Chat thời gian thực | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-072 | `report_runs` | Reporting | Chạy báo cáo/export bền | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-073 | `analytics_events` | Analytics | Event phân tích sản phẩm | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-074 | `vector_embeddings` | AI Infrastructure | Embedding cho semantic retrieval | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-075 | `event_stream_offsets` | Event Streaming | Consumer offset Kafka/NATS | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-076 | `service_extraction_registry` | Microservices Governance | Theo dõi bounded module đã tách | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |
| DB-077 | `deployment_clusters` | Enterprise Operations | Metadata Kubernetes/multi-region | Deferred aggregate | Tùy bounded context | Roadmap | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY | No Prisma model/table observed; expected for future phase or optional/deferred scope. |

## Core Table Ownership Audit

| Core Table | Expected Owner | Owner in MODULE_BOUNDARIES | Runtime Model/Access Owner | Result | Finding ID |
|---|---|---|---|---|---|
| `idempotency_records` | M01 Platform/Foundation | M01 Platform/Foundation | M01 Platform/Foundation | ALIGNED | none |
| `outbox_events` | M01 Platform/Foundation | M01 Platform/Foundation | M01 Platform/Foundation | ALIGNED | none |
| `system_configurations` | M01 Platform/Foundation | M01 Platform/Foundation | M01 Platform/Foundation | ALIGNED | none |
| `accounts` | M02 Identity | M02 Identity | runtime `users` under pre-existing schema | NAME_MISMATCH | F-DB-NAME-001 |
| `account_credentials` | M02 Identity | M02 Identity | runtime `users` under pre-existing schema | NAME_MISMATCH | F-DB-NAME-001 |
| `account_tokens` | M02 Identity | M02 Identity | runtime `refresh_tokens` under pre-existing schema | NAME_MISMATCH | F-DB-NAME-001 |
| `sessions` | M02 Identity | M02 Identity | runtime `refresh_tokens` under pre-existing schema | NAME_MISMATCH | F-DB-NAME-001 |
| `organizations` | M03 Tenancy | M03 Tenancy | runtime `tenants` under pre-existing schema | NAME_MISMATCH | F-DB-NAME-001 |
| `tenant_memberships` | M03 Tenancy | M03 Tenancy | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `membership_invitations` | M03 Tenancy | M03 Tenancy | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `roles` | M04 Authorization | M04 Authorization | M04 Authorization | ALIGNED | none |
| `permissions` | M04 Authorization | M04 Authorization | M04 Authorization | ALIGNED | none |
| `role_permissions` | M04 Authorization | M04 Authorization | M04 Authorization | ALIGNED | none |
| `role_assignments` | M04 Authorization | M04 Authorization | runtime `user_roles` under pre-existing schema | NAME_MISMATCH | F-DB-NAME-001 |
| `role_assignment_scopes` | M04 Authorization | M04 Authorization | runtime `user_roles` under pre-existing schema | NAME_MISMATCH | F-DB-NAME-001 |
| `academic_units` | M05 Academic Organization | M05 Academic Organization | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `academic_profiles` | M06 Academic Profiles | M06 Academic Profiles | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `academic_placements` | M06 Academic Profiles | M06 Academic Profiles | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `campaign_templates` | M07 Campaign | M07 Campaign | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `campaign_template_versions` | M07 Campaign | M07 Campaign | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `academic_campaigns` | M07 Campaign | M07 Campaign | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `campaign_participants` | M07 Campaign | M07 Campaign | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `topic_proposals` | M08 Topic | M08 Topic | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `topic_decisions` | M08 Topic | M08 Topic | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `campaign_topics` | M08 Topic | M08 Topic | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `project_registrations` | M09 Project | M09 Project | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `registration_members` | M09 Project | M09 Project | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `projects` | M09 Project | M09 Project | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `project_memberships` | M09 Project | M09 Project | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `supervision_assignments` | M09 Project | M09 Project | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `project_milestones` | M10 Work Progress | M10 Work Progress | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `progress_updates` | M10 Work Progress | M10 Work Progress | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `documents` | M11 Documents | M11 Documents | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `upload_sessions` | M11 Documents | M11 Documents | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `document_versions` | M11 Documents | M11 Documents | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `submissions` | M11 Documents | M11 Documents | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `feedback_items` | M12 Feedback | M12 Feedback | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `rubrics` | M13 Review | M13 Review | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `rubric_versions` | M13 Review | M13 Review | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `rubric_criteria` | M13 Review | M13 Review | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `review_assignments` | M13 Review | M13 Review | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `reviews` | M13 Review | M13 Review | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `review_scores` | M13 Review | M13 Review | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `evaluations` | M14 Evaluation | M14 Evaluation | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `evaluation_appeals` | M14 Evaluation | M14 Evaluation | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `evaluation_amendments` | M14 Evaluation | M14 Evaluation | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `notifications` | M15 Communication/Notification | M15 Communication/Notification | none observed | SOURCE_ONLY | F-DB-SOURCE-001 |
| `audit_logs` | M16 Audit/Operations | M16 Audit/Operations | M16 Audit/Operations | ALIGNED | none |

## Tenant Scope Audit

| Table | Expected Tenant Scope | Runtime Tenant Field/Path | Isolation Mechanism | Result | Risk |
|---|---|---|---|---|---|
| `idempotency_records` | GLOBAL/TENANT | scope | Runtime field only observed; no tenant isolation test run. | NEEDS_IMPLEMENTATION_TEST | No PASS without integration tenant-isolation test. |
| `outbox_events` | GLOBAL/TENANT | derived/none observed | Runtime field only observed; no tenant isolation test run. | NEEDS_IMPLEMENTATION_TEST | No PASS without integration tenant-isolation test. |
| `system_configurations` | GLOBAL/TENANT | derived/none observed | Runtime field only observed; no tenant isolation test run. | NEEDS_IMPLEMENTATION_TEST | No PASS without integration tenant-isolation test. |
| `accounts` | GLOBAL | runtime `users.tenant_id` observed | Should be global Account + active TenantMembership, not fixed tenantId on account. | TENANT_SCOPE_MISMATCH | HIGH: violates global Account invariant if treated as final. |
| `account_credentials` | GLOBAL | runtime `users.tenant_id` observed | Credential/session source should attach to global account and tenant membership separately. | TENANT_SCOPE_MISMATCH | HIGH/MEDIUM depending flow; needs P0-017. |
| `account_tokens` | GLOBAL | runtime `refresh_tokens.tenant_id` observed | Credential/session source should attach to global account and tenant membership separately. | TENANT_SCOPE_MISMATCH | HIGH/MEDIUM depending flow; needs P0-017. |
| `sessions` | GLOBAL | runtime `refresh_tokens.tenant_id` observed | Credential/session source should attach to global account and tenant membership separately. | TENANT_SCOPE_MISMATCH | HIGH/MEDIUM depending flow; needs P0-017. |
| `organizations` | GLOBAL | derived/none observed | Runtime field only observed; no tenant isolation test run. | NEEDS_REVIEW | No PASS without integration tenant-isolation test. |
| `tenant_memberships` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `membership_invitations` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `roles` | GLOBAL/TENANT | tenant_id | Runtime field only observed; no tenant isolation test run. | NEEDS_IMPLEMENTATION_TEST | No PASS without integration tenant-isolation test. |
| `permissions` | GLOBAL | derived/none observed | Runtime field only observed; no tenant isolation test run. | NEEDS_REVIEW | No PASS without integration tenant-isolation test. |
| `role_permissions` | GLOBAL/TENANT | derived/none observed | Runtime field only observed; no tenant isolation test run. | NEEDS_IMPLEMENTATION_TEST | No PASS without integration tenant-isolation test. |
| `role_assignments` | TENANT | tenant_id | Runtime field only observed; no tenant isolation test run. | NEEDS_IMPLEMENTATION_TEST | No PASS without integration tenant-isolation test. |
| `role_assignment_scopes` | TENANT | tenant_id | Runtime field only observed; no tenant isolation test run. | NEEDS_IMPLEMENTATION_TEST | No PASS without integration tenant-isolation test. |
| `academic_units` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `academic_profiles` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `academic_placements` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `campaign_templates` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `campaign_template_versions` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `academic_campaigns` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `campaign_participants` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `topic_proposals` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `topic_decisions` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `campaign_topics` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `project_registrations` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `registration_members` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `projects` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `project_memberships` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `supervision_assignments` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `project_milestones` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `progress_updates` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `documents` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `upload_sessions` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `document_versions` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `submissions` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `feedback_items` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `rubrics` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `rubric_versions` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `rubric_criteria` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `review_assignments` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `reviews` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `review_scores` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `evaluations` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `evaluation_appeals` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `evaluation_amendments` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `notifications` | TENANT | none observed | Design only; expected phase may not be implemented. | SOURCE_ONLY | Not current blocker in Phase 0. |
| `audit_logs` | GLOBAL/TENANT | tenant_id | Runtime field only observed; no tenant isolation test run. | NEEDS_IMPLEMENTATION_TEST | No PASS without integration tenant-isolation test. |

## Phase Ownership Audit

| Table/Capability | Expected Phase | Runtime Introduced In | Source Alignment | Result |
|---|---|---|---|---|
| `idempotency_records` | P1 | 20260728083000_phase_01_foundation_primitives | Physical table exists before Phase 0 sign-off; source phase unchanged. | PRE_EXISTING_RUNTIME_ARTIFACT |
| `outbox_events` | P1 | 20260728083000_phase_01_foundation_primitives | Physical table exists before Phase 0 sign-off; source phase unchanged. | PRE_EXISTING_RUNTIME_ARTIFACT |
| `system_configurations` | P1 | 20260728083000_phase_01_foundation_primitives | Physical table exists before Phase 0 sign-off; source phase unchanged. | PRE_EXISTING_RUNTIME_ARTIFACT |
| `accounts` | P2 | pre-existing runtime artifact via `users` in 20260718112313_phase_02_auth_tenant_rbac | Runtime analog exists under different name/structure; source phase unchanged. | NAME_MISMATCH |
| `account_credentials` | P2 | pre-existing runtime artifact via `users` in 20260718112313_phase_02_auth_tenant_rbac | Runtime analog exists under different name/structure; source phase unchanged. | NAME_MISMATCH |
| `account_tokens` | P2 | pre-existing runtime artifact via `refresh_tokens` in 20260718112313_phase_02_auth_tenant_rbac | Runtime analog exists under different name/structure; source phase unchanged. | NAME_MISMATCH |
| `sessions` | P2 | pre-existing runtime artifact via `refresh_tokens` in 20260718112313_phase_02_auth_tenant_rbac | Runtime analog exists under different name/structure; source phase unchanged. | NAME_MISMATCH |
| `organizations` | P3 | pre-existing runtime artifact via `tenants` in 20260718112313_phase_02_auth_tenant_rbac | Runtime analog exists under different name/structure; source phase unchanged. | NAME_MISMATCH |
| `tenant_memberships` | P3 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `membership_invitations` | P3 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `roles` | P4 | 20260718112313_phase_02_auth_tenant_rbac | Physical table exists before Phase 0 sign-off; source phase unchanged. | PRE_EXISTING_RUNTIME_ARTIFACT |
| `permissions` | P4 | 20260718112313_phase_02_auth_tenant_rbac | Physical table exists before Phase 0 sign-off; source phase unchanged. | PRE_EXISTING_RUNTIME_ARTIFACT |
| `role_permissions` | P4 | 20260718112313_phase_02_auth_tenant_rbac | Physical table exists before Phase 0 sign-off; source phase unchanged. | PRE_EXISTING_RUNTIME_ARTIFACT |
| `role_assignments` | P4 | pre-existing runtime artifact via `user_roles` in 20260718112313_phase_02_auth_tenant_rbac | Runtime analog exists under different name/structure; source phase unchanged. | NAME_MISMATCH |
| `role_assignment_scopes` | P4 | pre-existing runtime artifact via `user_roles` in 20260718112313_phase_02_auth_tenant_rbac | Runtime analog exists under different name/structure; source phase unchanged. | NAME_MISMATCH |
| `academic_units` | P5 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `academic_profiles` | P5 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `academic_placements` | P5 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `campaign_templates` | P6 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `campaign_template_versions` | P6 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `academic_campaigns` | P6 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `campaign_participants` | P6 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `topic_proposals` | P7 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `topic_decisions` | P7 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `campaign_topics` | P7 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `project_registrations` | P8 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `registration_members` | P8 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `projects` | P8 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `project_memberships` | P9 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `supervision_assignments` | P9 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `project_milestones` | P9 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `progress_updates` | P9 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `documents` | P10 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `upload_sessions` | P10 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `document_versions` | P10 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `submissions` | P11 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `feedback_items` | P11 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `rubrics` | P12 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `rubric_versions` | P12 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `rubric_criteria` | P12 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `review_assignments` | P12 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `reviews` | P12 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `review_scores` | P12 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `evaluations` | P12 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `evaluation_appeals` | P12 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `evaluation_amendments` | P12 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `notifications` | P13 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `audit_logs` | P13 | 20260718112313_phase_02_auth_tenant_rbac | Physical table exists before Phase 0 sign-off; source phase unchanged. | PRE_EXISTING_RUNTIME_ARTIFACT |
| `membership_join_requests` | P3+ | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `topic_catalog_entries` | P7+ | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `project_tasks` | P9+ | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `academic_cohorts` | P5+ | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `academic_classes` | P5+ | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `document_processing_jobs` | P10+ | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `malware_scan_results` | P10+ | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `download_grants` | P10+ | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `notification_deliveries` | P13+ | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `search_documents` | P14 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `search_chunks` | P14 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `ai_assistance_runs` | P15 | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `plans` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `plan_features` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `subscriptions` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `invoices` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `usage_meters` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `identity_providers` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `scim_mappings` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `integration_connectors` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `sync_jobs` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `discussion_threads` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `chat_messages` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `report_runs` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `analytics_events` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `vector_embeddings` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `event_stream_offsets` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `service_extraction_registry` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |
| `deployment_clusters` | Roadmap | not observed | No runtime artifact observed; normal for future/optional/deferred scope. | SOURCE_ONLY |

## Prisma Schema Audit

| Prisma Model | Physical Table | Expected Manifest Entry | Owner | Alignment | Notes |
|---|---|---|---|---|---|
| `SystemInfo` | `system_info` | none | Possible M01 Platform/Foundation | RUNTIME_ONLY_NOT_IN_MANIFEST | Runtime-only foundation metadata table; not in source manifest. |
| `SystemConfiguration` | `system_configurations` | `system_configurations` | M01 Platform/Foundation | ALIGNED | Manifest status CORE phase P1; constraint completeness not proven. |
| `IdempotencyRecord` | `idempotency_records` | `idempotency_records` | M01 Platform/Foundation | ALIGNED | Manifest status CORE phase P1; constraint completeness not proven. |
| `OutboxEvent` | `outbox_events` | `outbox_events` | M01 Platform/Foundation | ALIGNED | Manifest status CORE phase P1; constraint completeness not proven. |
| `Tenant` | `tenants` | `organizations` | M03 Tenancy expected as `organizations` | NAME_MISMATCH | Runtime tenant root name differs from source manifest. |
| `User` | `users` | `accounts`, plus credential/session split expected | M02 Identity expected for `accounts`, but runtime includes M03/M04 links | NAME_MISMATCH / TENANT_SCOPE_MISMATCH | `User.tenantId` conflicts with global Account invariant if final. |
| `Role` | `roles` | `roles` | M04 Authorization | ALIGNED | Manifest status CORE phase P4; constraint completeness not proven. |
| `Permission` | `permissions` | `permissions` | M04 Authorization | ALIGNED | Manifest status CORE phase P4; constraint completeness not proven. |
| `RolePermission` | `role_permissions` | `role_permissions` | M04 Authorization | ALIGNED | Manifest status CORE phase P4; constraint completeness not proven. |
| `UserRole` | `user_roles` | `role_assignments`, `role_assignment_scopes` | M04 Authorization expected as `role_assignments` + `role_assignment_scopes` | NAME_MISMATCH / STRUCTURE_MISMATCH | Scope fields are inline instead of normalized scopes table. |
| `RefreshToken` | `refresh_tokens` | `sessions`, `account_tokens` | M02 Identity expected as `sessions` and/or `account_tokens` | NAME_MISMATCH / STRUCTURE_MISMATCH | Runtime token model has `tenant_id`; source expects global account lifecycle separation. |
| `AuditLog` | `audit_logs` | `audit_logs` | M16 Audit/Operations | ALIGNED | Manifest status CORE phase P13; constraint completeness not proven. |

## Migration Audit

| Migration | Tables Created/Changed | Manifest Classification | Owner | Alignment | Notes |
|---|---|---|---|---|---|
| `20260716075317_init_foundation` | `system_info` | `system_info`:RUNTIME_ONLY | `system_info`:UNKNOWN/Possible M01-M04 | NEEDS_REVIEW | Migration file exists only; database was not inspected/applied. |
| `20260718112313_phase_02_auth_tenant_rbac` | `tenants`, `users`, `roles`, `permissions`, `role_permissions`, `user_roles`, `refresh_tokens`, `audit_logs` | `tenants`:RUNTIME_ONLY, `users`:RUNTIME_ONLY, `roles`:CORE, `permissions`:CORE, `role_permissions`:CORE, `user_roles`:RUNTIME_ONLY, `refresh_tokens`:RUNTIME_ONLY, `audit_logs`:CORE | `tenants`:UNKNOWN/Possible M01-M04, `users`:UNKNOWN/Possible M01-M04, `roles`:M04 Authorization, `permissions`:M04 Authorization, `role_permissions`:M04 Authorization, `user_roles`:UNKNOWN/Possible M01-M04, `refresh_tokens`:UNKNOWN/Possible M01-M04, `audit_logs`:M16 Audit/Operations | NEEDS_REVIEW | Migration file exists only; database was not inspected/applied. |
| `20260728083000_phase_01_foundation_primitives` | `system_configurations`, `idempotency_records`, `outbox_events` | `system_configurations`:CORE, `idempotency_records`:CORE, `outbox_events`:CORE | `system_configurations`:M01 Platform/Foundation, `idempotency_records`:M01 Platform/Foundation, `outbox_events`:M01 Platform/Foundation | PARTIAL_ALIGNMENT | Migration file exists only; database was not inspected/applied. |

## Seed Audit

| Seed Artifact | Tables/Models Used | Expected Module | Alignment | Risk |
|---|---|---|---|---|
| `apps/api/prisma/seed.ts` | `systemInfo`, `systemConfiguration`, `tenant`, `permission`, `role`, `rolePermission`, `user`, `userRole` | M01/M02/M03/M04 source-equivalent | NEEDS_REVIEW | Seed uses runtime names, includes tenant-bound user/role shape; does not prove domain implementation. |
| `apps/api/prisma/seed.ts` transaction | multiple models in `prisma.$transaction` | Application/bootstrap seed, not module owner | PRE_EXISTING_RUNTIME_ARTIFACT | Bypasses application contracts by design of seed; review later for source-aligned demo data. |

## Worker SQL Audit

| Worker File/Query | Table Accessed | Expected Owner | Read/Write | Allowed? | Finding |
|---|---|---|---|---|---|
| `apps/worker/src/index.ts` claim query | `outbox_events` | M01 Platform/Foundation | UPDATE + SELECT | Yes, limited | Worker only claims pending/failed outbox rows; keep under M01 contract later. |
| `apps/worker/src/index.ts` publish query | `outbox_events` | M01 Platform/Foundation | UPDATE | Yes, limited | Marks events published without domain aggregate mutation. |
| `apps/worker/src/index.ts` | domain tables | owning business modules | none observed | Yes | No direct mutation of business aggregate observed. |

## Optional and Deferred Audit

### Optional Capabilities

| Capability/Table | Expected Owner | Gate | Runtime Observed | Result |
|---|---|---|---|---|
| `membership_join_requests` | M03 Tenancy | P3+ / approval required | No | SOURCE_ONLY_OPTIONAL |
| `topic_catalog_entries` | M08 Topic | P7+ / approval required | No | SOURCE_ONLY_OPTIONAL |
| `project_tasks` | M10 Work Progress | P9+ / approval required | No | SOURCE_ONLY_OPTIONAL |
| `academic_cohorts` | M05 Academic Organization | P5+ / approval required | No | SOURCE_ONLY_OPTIONAL |
| `academic_classes` | M05 Academic Organization | P5+ / approval required | No | SOURCE_ONLY_OPTIONAL |
| `document_processing_jobs` | M11 Documents | P10+ / approval required | No | SOURCE_ONLY_OPTIONAL |
| `malware_scan_results` | M11 Documents | P10+ / approval required | No | SOURCE_ONLY_OPTIONAL |
| `download_grants` | M11 Documents | P10+ / approval required | No | SOURCE_ONLY_OPTIONAL |
| `notification_deliveries` | M15 Communication/Notification | P13+ / approval required | No | SOURCE_ONLY_OPTIONAL |
| `search_documents` | M17 Search | P14 / approval required | No | SOURCE_ONLY_OPTIONAL |
| `search_chunks` | M17 Search | P14 / approval required | No | SOURCE_ONLY_OPTIONAL |
| `ai_assistance_runs` | M18 AI/RAG | P15 / approval required | No | SOURCE_ONLY_OPTIONAL |

### Deferred Capabilities

| Capability/Table | Adoption Trigger | Runtime Observed | Result | Required Action |
|---|---|---|---|---|
| `plans` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `plan_features` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `subscriptions` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `invoices` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `usage_meters` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `identity_providers` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `scim_mappings` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `integration_connectors` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `sync_jobs` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `discussion_threads` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `chat_messages` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `report_runs` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `analytics_events` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `vector_embeddings` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `event_stream_offsets` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `service_extraction_registry` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |
| `deployment_clusters` | Roadmap/change approval | No | SOURCE_ONLY_DEFERRED | Do not promote to CORE; review only after adoption trigger. |

## Runtime-only Artifacts

| Runtime Artifact | Type | No Matching Manifest Entry | Possible Owner | Risk | Required Decision |
|---|---|---|---|---|---|
| `refresh_tokens` | Prisma model/table | Yes | M02 Identity analog | session/account token structure mismatch | Change request or runtime alignment decision; do not add silently. |
| `system_info` | Prisma model/table | Yes | M01 Platform/Foundation | extra foundation table not in manifest | Change request or runtime alignment decision; do not add silently. |
| `tenants` | Prisma model/table | Yes | M03 Tenancy analog | name mismatch with organizations | Change request or runtime alignment decision; do not add silently. |
| `user_roles` | Prisma model/table | Yes | M04 Authorization analog | role assignment/scope normalization mismatch | Change request or runtime alignment decision; do not add silently. |
| `users` | Prisma model/table | Yes | M02 Identity analog | Global Account/TenantMembership invariant risk | Change request or runtime alignment decision; do not add silently. |
| `TenantPlan`, `TenantStatus`, `UserStatus`, `RefreshTokenStatus`, `RoleScope`, `AuditAction`, `IdempotencyRecordStatus`, `OutboxEventStatus` | Prisma enum | Some runtime enums exceed manifest detail | M01–M04 depending enum | Enum set may leak implementation naming into source baseline. | Review during P0-017/migration alignment. |

## Source-only Capabilities

| Manifest Entry | Design Status | Runtime Evidence | Expected Phase | Is Missing Runtime a Current Problem? |
|---|---|---|---|---|
| `tenant_memberships` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P3 | Not a P0 blocker; runtime exists only partially/mismatched and needs P0-017 review. |
| `membership_invitations` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P3 | Not a P0 blocker; runtime exists only partially/mismatched and needs P0-017 review. |
| `academic_units` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P5 | No; Phase 0 is design/audit only. |
| `academic_profiles` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P5 | No; Phase 0 is design/audit only. |
| `academic_placements` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P5 | No; Phase 0 is design/audit only. |
| `campaign_templates` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P6 | No; Phase 0 is design/audit only. |
| `campaign_template_versions` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P6 | No; Phase 0 is design/audit only. |
| `academic_campaigns` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P6 | No; Phase 0 is design/audit only. |
| `campaign_participants` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P6 | No; Phase 0 is design/audit only. |
| `topic_proposals` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P7 | No; Phase 0 is design/audit only. |
| `topic_decisions` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P7 | No; Phase 0 is design/audit only. |
| `campaign_topics` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P7 | No; Phase 0 is design/audit only. |
| `project_registrations` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P8 | No; Phase 0 is design/audit only. |
| `registration_members` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P8 | No; Phase 0 is design/audit only. |
| `projects` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P8 | No; Phase 0 is design/audit only. |
| `project_memberships` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P9 | No; Phase 0 is design/audit only. |
| `supervision_assignments` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P9 | No; Phase 0 is design/audit only. |
| `project_milestones` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P9 | No; Phase 0 is design/audit only. |
| `progress_updates` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P9 | No; Phase 0 is design/audit only. |
| `documents` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P10 | No; Phase 0 is design/audit only. |
| `upload_sessions` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P10 | No; Phase 0 is design/audit only. |
| `document_versions` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P10 | No; Phase 0 is design/audit only. |
| `submissions` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P11 | No; Phase 0 is design/audit only. |
| `feedback_items` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P11 | No; Phase 0 is design/audit only. |
| `rubrics` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P12 | No; Phase 0 is design/audit only. |
| `rubric_versions` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P12 | No; Phase 0 is design/audit only. |
| `rubric_criteria` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P12 | No; Phase 0 is design/audit only. |
| `review_assignments` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P12 | No; Phase 0 is design/audit only. |
| `reviews` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P12 | No; Phase 0 is design/audit only. |
| `review_scores` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P12 | No; Phase 0 is design/audit only. |
| `evaluations` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P12 | No; Phase 0 is design/audit only. |
| `evaluation_appeals` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P12 | No; Phase 0 is design/audit only. |
| `evaluation_amendments` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P12 | No; Phase 0 is design/audit only. |
| `notifications` | CORE | SOURCE_ONLY_NOT_IMPLEMENTED | P13 | No; Phase 0 is design/audit only. |
| `membership_join_requests` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P3+ | No; Phase 0 is design/audit only. |
| `topic_catalog_entries` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P7+ | No; Phase 0 is design/audit only. |
| `project_tasks` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P9+ | No; Phase 0 is design/audit only. |
| `academic_cohorts` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P5+ | No; Phase 0 is design/audit only. |
| `academic_classes` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P5+ | No; Phase 0 is design/audit only. |
| `document_processing_jobs` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P10+ | No; Phase 0 is design/audit only. |
| `malware_scan_results` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P10+ | No; Phase 0 is design/audit only. |
| `download_grants` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P10+ | No; Phase 0 is design/audit only. |
| `notification_deliveries` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P13+ | No; Phase 0 is design/audit only. |
| `search_documents` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P14 | No; Phase 0 is design/audit only. |
| `search_chunks` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P14 | No; Phase 0 is design/audit only. |
| `ai_assistance_runs` | OPTIONAL | SOURCE_ONLY_NOT_IMPLEMENTED | P15 | No; Phase 0 is design/audit only. |
| `plans` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `plan_features` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `subscriptions` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `invoices` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `usage_meters` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `identity_providers` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `scim_mappings` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `integration_connectors` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `sync_jobs` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `discussion_threads` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `chat_messages` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `report_runs` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `analytics_events` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `vector_embeddings` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `event_stream_offsets` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `service_extraction_registry` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |
| `deployment_clusters` | DEFERRED | SOURCE_ONLY_NOT_IMPLEMENTED | Roadmap | No; Phase 0 is design/audit only. |

## Findings Register

| Finding ID | Category | Severity | Artifact | Description | Source Expected | Runtime Observed | Resolution Phase | Status |
|---|---|---|---|---|---|---|---|---|
| F-DB-001 | COUNT | INFORMATIONAL | DOCX manifest | Manifest counts reconciled exactly. | 48 CORE / 12 OPTIONAL / 17 DEFERRED / 77 total | Same extracted count | P0-008 | ACCEPTED_BASELINE |
| F-DB-002 | NAME | HIGH | Prisma schema | Runtime user identity table name/shape differs. | `accounts` global Account; credentials/tokens/sessions split | `users` has `tenant_id` and `password_hash`; `refresh_tokens` has `tenant_id` | P0-017 | DEFERRED_TO_P0-017 |
| F-DB-003 | TENANT_SCOPE | HIGH | Prisma schema | Global Account invariant not aligned if runtime schema is final. | `accounts` has no fixed tenantId; membership in M03 | `users.tenant_id` observed | P0-017 | DEFERRED_TO_P0-017 |
| F-DB-004 | NAME | MEDIUM | Prisma schema | Tenant root name differs. | `organizations` | `tenants` | P0-017 | DEFERRED_TO_P0-017 |
| F-DB-005 | STRUCTURE | MEDIUM | Prisma schema | Role assignment scope normalization differs. | `role_assignments` + `role_assignment_scopes` | `user_roles` with inline scope fields | P0-017 | DEFERRED_TO_P0-017 |
| F-DB-006 | RUNTIME_ONLY | LOW | Prisma schema | Foundation `system_info` table is not in manifest. | No manifest entry | `SystemInfo` model maps `system_info` | P0-017 | NON_BLOCKING |
| F-DB-007 | SOURCE_ONLY | INFORMATIONAL | Manifest/runtime | Most P5–P13 CORE tables are not runtime implemented yet. | Future phase implementation after sign-off | No Prisma models observed | Future phases | NON_BLOCKING |
| F-DB-008 | WORKER_SQL | LOW | Worker SQL | Worker uses raw SQL on outbox. | M01 outbox dispatcher may manipulate `outbox_events` | SQL updates `outbox_events` only | P0-017 | NON_BLOCKING |
| F-DB-009 | SEED | MEDIUM | Seed | Seed uses runtime tables/schema shape. | Demo seed should follow source owners later | Seed uses `tenant`, `user`, `userRole` | P0-017 / demo phases | DEFERRED_TO_P0-017 |
| F-DB-010 | EVIDENCE | INFORMATIONAL | Migrations | Migration files exist but applied DB not inspected. | Do not claim migration applied without DB check | Files present only | Implementation validation | ACCEPTED_BASELINE |
| F-DB-011 | OPTIONAL | INFORMATIONAL | Manifest/runtime | No optional capabilities observed in Prisma schema. | Remain optional/gated | None observed | Future approval | ACCEPTED_BASELINE |
| F-DB-012 | DEFERRED | INFORMATIONAL | Manifest/runtime | No deferred capabilities observed in Prisma schema. | Remain deferred | None observed | Future adoption trigger | ACCEPTED_BASELINE |
| F-DB-013 | EVIDENCE | MEDIUM | Storage/runtime | MinIO/S3-compatible storage stack is locked but no document/storage table runtime evidence. | M11 documents/upload/session/version in future phases | No M11 runtime models observed | Phase 10 / P0-017 | NON_BLOCKING |

## Known Mismatches

| Existing Reference | Linked Finding | Description | Status |
|---|---|---|---|
| `PROJECT_STATUS.md` BI-002 | F-DB-002..F-DB-010 | Pre-existing runtime code/migration/Docker before Phase 0 sign-off. | NON_BLOCKING_REVIEW_P0-017 |
| `MODULE_BOUNDARIES.md` KM-004 | F-DB-002/F-DB-003 | Auth repository and runtime `User` model couple identity with tenant/role graph. | DEFERRED_TO_P0-017 |
| `MODULE_BOUNDARIES.md` KM-005 | F-DB-003 | Token payload carries `tenantId`; tenant context needs active membership contract. | DEFERRED_TO_P0-017 |
| `MODULE_BOUNDARIES.md` KM-006 | F-DB-008 | Worker directly updates `outbox_events`; limited M01 alignment only. | NON_BLOCKING |
| `MODULE_BOUNDARIES.md` KM-010 | F-DB-002..F-DB-006 | Prisma runtime table names differ from source manifest. | DEFERRED_TO_P0-017 |
| `MODULE_DEPENDENCIES.md` RT-004/RT-005 | F-DB-002/F-DB-003 | M02/M03/M04 coupling risk in auth runtime. | DEFERRED_TO_P0-017 |
| `MODULE_DEPENDENCIES.md` RT-009 | F-DB-008 | Worker SQL limited to outbox operational fields. | NON_BLOCKING |

## Audit Conclusion

### Design Manifest Result

- 48 CORE rows reconciled: PASS.
- 12 OPTIONAL rows reconciled: PASS.
- 17 DEFERRED rows reconciled: PASS.
- Total 77 rows reconciled: PASS.
- Core source ownership uniqueness: PASS; every CORE row maps to exactly one source owner M01–M16.
- Optional/deferred scope: PASS; no OPTIONAL/DEFERRED row promoted to CORE.

### Runtime Alignment Result

- Runtime alignment: PARTIAL_ALIGNMENT.
- Pre-existing runtime requires P0-017: yes.
- Prisma schema mismatches found: users/accounts, tenants/organizations, user_roles/role_assignments/scopes, refresh_tokens/sessions/account_tokens, system_info runtime-only.
- Runtime does not implement full 77 manifest capabilities; this is not a Phase 0 failure.
- Migration files exist; applied database was not inspected.

## Handoff to P0-009

P0-009 Business Invariants must receive:

- table/invariant candidates: `idempotency_records`, `outbox_events`, `audit_logs`, `system_configurations`;
- tenant scope findings: global Account vs runtime `users.tenant_id`; active TenantMembership not represented by runtime schema;
- immutable/versioning findings: template/version, document_versions, submissions, rubric_versions, review assignments, evaluations/amendments are source-only now;
- outbox/audit ownership: M01 owns outbox, M16 owns audit, neither owns audited business aggregate;
- finalize/amendment tables: M14 source-only, append-only correction invariant needs future DB/app enforcement;
- submission/version pinning: M11 source-only, DB evidence missing now but expected later;
- review/rubric pinning: M13 source-only, DB evidence missing now but expected later;
- runtime mismatch needing tests/correction: M02/M03/M04 auth schema, seed, runtime-only `system_info`, worker outbox SQL contract.

P0-009 must not rewrite manifest or alter Prisma schema.

## Change Control

| Change ID | Requested Manifest Change | Table/Capability | Current Owner | Proposed Owner | Classification Impact | Phase Impact | Migration Impact | Approval Status |
|---|---|---|---|---|---|---|---|---|
| DB-CHG-TEMPLATE | Describe requested manifest change | table/capability | current owner | proposed owner | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | NEEDS_APPROVAL |
| DB-CHG-001 | Accept `users` as replacement for `accounts` | `accounts` / `users` | M02 Identity | M02 Identity plus M03 relation? | High | P2/P3 | High | NEEDS_APPROVAL |
| DB-CHG-002 | Accept `tenants` as replacement for `organizations` | `organizations` / `tenants` | M03 Tenancy | M03 Tenancy | Medium | P3 | Medium | NEEDS_APPROVAL |
| DB-CHG-003 | Accept `user_roles` as replacement for normalized assignments/scopes | `role_assignments`, `role_assignment_scopes` | M04 Authorization | M04 Authorization | High | P4 | High | NEEDS_APPROVAL |
| DB-CHG-004 | Add runtime-only `system_info` to manifest | `system_info` | none | M01 Platform/Foundation | Medium | P1 | Medium | NEEDS_APPROVAL |

Change approval required for adding/removing table, changing owner, classification, tenant scope, phase, table split/merge, or accepting runtime-only artifact into source baseline.

## Validation Checklist

| Check | Result | Evidence |
|---|---|---|
| Có đúng 48 CORE rows | PASS | Manifest count reconciliation |
| Có đúng 12 OPTIONAL rows | PASS | Manifest count reconciliation |
| Có đúng 17 DEFERRED rows | PASS | Manifest count reconciliation |
| Tổng manifest 77 rows | PASS | Manifest count reconciliation |
| Không bỏ qua OPTIONAL/DEFERRED | PASS | Optional and Deferred Audit |
| Mọi CORE table có một module owner | PASS | Core Table Ownership Audit |
| Không có duplicate ownership không giải thích | PASS | Manifest names unique and owners single-valued |
| Có tenant scope audit | PASS | Tenant Scope Audit |
| Có phase ownership audit | PASS | Phase Ownership Audit |
| Có Prisma audit | PASS | Prisma Schema Audit |
| Có migration audit | PASS | Migration Audit |
| Có seed audit | PASS | Seed Audit |
| Có worker SQL audit | PASS | Worker SQL Audit |
| Có runtime-only register | PASS | Runtime-only Artifacts |
| Có source-only register | PASS | Source-only Capabilities |
| Có findings register | PASS | Findings Register |
| Có handoff P0-009 | PASS | Handoff to P0-009 |
| Không tự sửa source | PASS | Docs-only task |
| Không sửa runtime code/schema/migration/seed | PASS | Docs-only task |
| Không tạo P0-009 artifact | PASS | `docs/phase-0/BUSINESS_INVARIANTS.md` absent at validation time |
| Không tuyên bố runtime implement đủ manifest | PASS | Audit Conclusion separates design/runtime |
| Không tuyên bố Phase 0 DONE | PASS | Status section |
| Không đánh dấu Phase 1 IN_PROGRESS | PASS | PROJECT_STATUS validation |
| Có Source References | PASS | Source References |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — Database Capability Manifest: full business/ownership table and technical view.
- `docs/BaoCaoKhoaLuan.docx` — Database audit V1.1: 48 CORE, 12 OPTIONAL, 17 DEFERRED baseline.
- `docs/BaoCaoKhoaLuan.docx` — Module ownership and 18-module catalog.
- `docs/BaoCaoKhoaLuan.docx` — Business invariants: tenant isolation, idempotency, outbox/audit, version pinning, immutable evidence.
- `docs/BaoCaoKhoaLuan.docx` — Roadmap Phase 0–13.
- `docs/BaoCaoKhoaLuan.docx` — Architecture/module boundary and worker boundary.
- `docs/phase-0/SOURCE_HIERARCHY.md` — source priority and implementation evidence rules.
- `docs/phase-0/SCOPE_FREEZE.md` — Product/Core/Demo/Deferred scope separation.
- `docs/phase-0/STACK_LOCK.md` — PostgreSQL/Prisma/raw SQL/worker rules.
- `docs/phase-0/MODULE_BOUNDARIES.md` — M01–M18 ownership and P0-006 ownership matrix.
- `docs/phase-0/MODULE_DEPENDENCIES.md` — dependency, Prisma/SQL and worker findings.
