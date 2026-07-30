# APLP Traceability Audit

## Purpose

Reconcile Functional Requirements, API Catalog, UI Catalog, Database Capability Manifest, 57 Business Invariants, modules, phases, permissions and runtime evidence at Phase 0 design level. This audit records missing/mismatch findings without changing source or runtime.

## Status

DONE for P0-010 — Traceability Audit

- Chỉ P0-010 hoàn thành.
- Phase 0 tổng thể vẫn IN_PROGRESS.
- Chưa có Phase 0 sign-off.
- P0-011 chưa được thực hiện.
- Audit đầy đủ không đồng nghĩa runtime đã implement.
- Mọi missing/mismatch vẫn phải được xử lý ở phase tương ứng.
- Không tạo ADR trong P0-010.

## Last Updated

2026-07-29 14:37 Asia/Ho_Chi_Minh

## Audit Scope

- Functional Requirements Catalog table 36 in source DOCX.
- API Catalog table 37 in source DOCX.
- UI Catalog table 38 in source DOCX.
- Database Capability Manifest table 34 and P0-008 audit.
- 57 Business Invariants from P0-009.
- M01–M18 module and Phase 0–13 baselines.
- Runtime API routes, web components, Prisma schema/migrations/seed, worker handlers and tests read-only.

## Audit Method

- Extracted DOCX tables by header/index and counted rows/unique IDs.
- Grouped FR/API/UI/DB/invariants by module and phase using source catalog fields.
- Matched runtime routes/UI/schema/test artifacts read-only.
- Marked module-level inferred links as PARTIAL where exact FR/API/UI pair is not explicit in source.
- Kept optional/deferred Search/AI gated and did not promote to core.
- Recorded orphan/missing findings without creating new source rows or runtime artifacts.

## Traceability Status Model

| Status | Meaning |
|---|---|
| COMPLETE | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| PARTIAL | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| N/A_JUSTIFIED | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| MISSING | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| MISMATCH | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| DUPLICATE | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| ORPHAN | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| DEFERRED | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| OPTIONAL_GATE | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| NEEDS_APPROVAL | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| SOURCE_ONLY | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| RUNTIME_ONLY | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| NOT_IMPLEMENTED | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| ARTIFACT_OBSERVED | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| EXECUTED_PASS | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| EXECUTED_FAIL | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |
| NEEDS_REVIEW | Phase 0 traceability/evidence status; `COMPLETE` means design links only unless Runtime Evidence states executed evidence. |

## Canonical Count Reconciliation

| Catalog | Expected | Extracted | Unique IDs | Duplicates | Missing/Malformed | Result |
|---|---:|---:|---:|---:|---|---|
| Functional Requirements | 81 | 81 | 81 | 0 | 0 | PASS |
| MUST FR | 65 | 65 | 65 | 0 | 0 | PASS |
| SHOULD FR | 11 | 11 | 11 | 0 | 0 | PASS |
| COULD FR | 5 | 5 | 5 | 0 | 0 | PASS |
| API Routes | 91 | 91 | 91 | 0 | 0 | PASS |
| UI Screens/Flows | 36 | 36 | 36 | 0 | 0 | PASS |
| CORE DB | 48 | 48 | 48 | 0 | 0 | PASS |
| OPTIONAL DB | 12 | 12 | 12 | 0 | 0 | PASS |
| DEFERRED DB | 17 | 17 | 17 | 0 | 0 | PASS |
| Business Invariants | 57 | 57 | 57 | 0 | 0 | PASS |
| Modules | 18 | 18 | 18 | 0 | 0 | PASS |
| Roadmap Phases | 14, Phase 0–13 | 14 | 14 | 0 | 0 | PASS |

## Functional Requirement Traceability

| FR ID | Requirement Summary | Priority | Module | Actor | Related Invariants | API | UI | Tables/Capabilities | Permission | Phase | Test/Evidence | Design Traceability | Runtime Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FR-FND-01 | Health/readiness: Cung cấp health, readiness và metadata không lộ secret. | MUST | M01 Platform/Foundation | Public/Ops/Authenticated | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | API-001, API-002, API-003 | N/A_JUSTIFIED: non-user-facing/internal capability | idempotency_records, outbox_events, system_configurations, plans, plan_features, subscriptions, invoices, usage_meters (+9) | public/ops/authenticated by endpoint | Phase 1 | PLANNED; runtime tests source only where observed | COMPLETE | ARTIFACT_OBSERVED |
| FR-FND-02 | Idempotent commands: Các command create/approve/finalize/complete-upload hỗ trợ Idempotency-Key. | MUST | M01 Platform/Foundation | Public/Ops/Authenticated | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | API-001, API-002, API-003 | N/A_JUSTIFIED: non-user-facing/internal capability | idempotency_records, outbox_events, system_configurations, plans, plan_features, subscriptions, invoices, usage_meters (+9) | public/ops/authenticated by endpoint | Phase 1 | PLANNED; runtime tests source only where observed | COMPLETE | ARTIFACT_OBSERVED |
| FR-FND-03 | Transactional outbox: Critical mutation ghi outbox intent cùng transaction. | MUST | M01 Platform/Foundation | Public/Ops/Authenticated | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | API-001, API-002, API-003 | N/A_JUSTIFIED: non-user-facing/internal capability | idempotency_records, outbox_events, system_configurations, plans, plan_features, subscriptions, invoices, usage_meters (+9) | public/ops/authenticated by endpoint | Phase 1 | PLANNED; runtime tests source only where observed | COMPLETE | ARTIFACT_OBSERVED |
| FR-FND-04 | Typed configuration: Cấu hình runtime được validate và version. | SHOULD | M01 Platform/Foundation | Public/Ops/Authenticated | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | API-001, API-002, API-003 | N/A_JUSTIFIED: non-user-facing/internal capability | idempotency_records, outbox_events, system_configurations, plans, plan_features, subscriptions, invoices, usage_meters (+9) | public/ops/authenticated by endpoint | Phase 1 | PLANNED; runtime tests source only where observed | COMPLETE | ARTIFACT_OBSERVED |
| FR-ID-01 | Đăng ký account: Người dùng tạo account toàn cục bằng email. | MUST | M02 Identity | Public/Authenticated self | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | public/authenticated self | Phase 2 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-ID-02 | Xác minh email: Kích hoạt account bằng token một lần có hạn. | MUST | M02 Identity | Public/Authenticated self | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | public/authenticated self | Phase 2 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-ID-03 | Đăng nhập: Xác thực credential và phát hành session an toàn. | MUST | M02 Identity | Public/Authenticated self | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | public/authenticated self | Phase 2 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-ID-04 | Refresh rotation: Refresh token được rotate và phát hiện reuse. | MUST | M02 Identity | Public/Authenticated self | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | public/authenticated self | Phase 2 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-ID-05 | Đăng xuất/thu hồi: Thu hồi một hoặc toàn bộ session. | MUST | M02 Identity | Public/Authenticated self | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | public/authenticated self | Phase 2 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-ID-06 | Quên mật khẩu: Reset bằng token một lần, không lộ account tồn tại. | SHOULD | M02 Identity | Public/Authenticated self | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | public/authenticated self | Phase 2 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-ID-07 | Hồ sơ cá nhân: Đọc/cập nhật display profile không làm thay đổi membership. | MUST | M02 Identity | Public/Authenticated self | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | public/authenticated self | Phase 2 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-TEN-01 | Tạo organization: Platform Admin/người có thẩm quyền tạo tenant. | MUST | M03 Tenancy | Platform Admin/Organization Admin/Authenticated | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | Phase 3 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-TEN-02 | Kích hoạt organization: Organization chỉ hoạt động sau verify/activate. | MUST | M03 Tenancy | Platform Admin/Organization Admin/Authenticated | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | Phase 3 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-TEN-03 | Mời thành viên: Organization Admin gửi invitation có role/scope ban đầu. | MUST | M03 Tenancy | Platform Admin/Organization Admin/Authenticated | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | Phase 3 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-TEN-04 | Chấp nhận lời mời: Account chấp nhận invitation để tạo TenantMembership. | MUST | M03 Tenancy | Platform Admin/Organization Admin/Authenticated | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | Phase 3 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-TEN-05 | Chuyển tenant: Người dùng chọn tenant đang làm việc từ membership hợp lệ. | MUST | M03 Tenancy | Platform Admin/Organization Admin/Authenticated | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | Phase 3 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-TEN-06 | Đình chỉ membership: Admin có thể suspend/revoke membership và session context bị vô hiệu. | MUST | M03 Tenancy | Platform Admin/Organization Admin/Authenticated | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | Phase 3 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-AUTH-01 | Quản lý role: Admin tạo role tenant từ permission catalog. | MUST | M04 Authorization | Organization Admin/All protected actors | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | role.* / permission.* / assignment.* | Phase 4 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-AUTH-02 | Gán permission: Role-permission có FK/unique và audit. | MUST | M04 Authorization | Organization Admin/All protected actors | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | role.* / permission.* / assignment.* | Phase 4 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-AUTH-03 | Gán role: Role được cấp cho membership với thời hạn. | MUST | M04 Authorization | Organization Admin/All protected actors | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | role.* / permission.* / assignment.* | Phase 4 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-AUTH-04 | Gán scope: Assignment giới hạn theo academic unit/campaign/project. | MUST | M04 Authorization | Organization Admin/All protected actors | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | role.* / permission.* / assignment.* | Phase 4 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-AUTH-05 | Resource authorization: API kiểm tenant + permission + scope + relationship + state. | MUST | M04 Authorization | Organization Admin/All protected actors | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | role.* / permission.* / assignment.* | Phase 4 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-AUTH-06 | Deny by default: Thiếu rule rõ ràng phải từ chối, không fallback allow. | MUST | M04 Authorization | Organization Admin/All protected actors | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | role.* / permission.* / assignment.* | Phase 4 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-AUTH-07 | Authorization version: Thay đổi quyền làm invalid cache/session context liên quan. | SHOULD | M04 Authorization | Organization Admin/All protected actors | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | role.* / permission.* / assignment.* | Phase 4 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-ACD-01 | Tạo cấu trúc học thuật: Organization Admin tạo/import unit hierarchy đúng type/parent. | MUST | M05/M06 Academic | Academic Admin/Organization Admin | INV-ACD-001, INV-ACD-002, INV-ACD-003 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | academic.* scoped | Phase 5 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-ACD-02 | Không cho student tạo unit: Sinh viên không có permission tạo khoa/bộ môn/chương trình. | MUST | M05/M06 Academic | Academic Admin/Organization Admin | INV-ACD-001, INV-ACD-002, INV-ACD-003 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | academic.* scoped | Phase 5 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-ACD-03 | Provision profile: Membership được gắn profile Student/Lecturer. | MUST | M05/M06 Academic | Academic Admin/Organization Admin | INV-ACD-001, INV-ACD-002, INV-ACD-003 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | academic.* scoped | Phase 5 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-ACD-04 | Quản lý placement: Placement có effective dates và không ghi đè lịch sử. | MUST | M05/M06 Academic | Academic Admin/Organization Admin | INV-ACD-001, INV-ACD-002, INV-ACD-003 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | academic.* scoped | Phase 5 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-ACD-05 | Import tối thiểu: Hỗ trợ import CSV dry-run và commit có báo lỗi hàng. | SHOULD | M05/M06 Academic | Academic Admin/Organization Admin | INV-ACD-001, INV-ACD-002, INV-ACD-003 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | academic.* scoped | Phase 5 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-CAM-01 | Tạo template: Coordinator tạo campaign template có cấu hình typed. | MUST | M07 Campaign | Coordinator/Participants | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | Phase 6 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-CAM-02 | Publish version: Publish tạo version bất biến. | MUST | M07 Campaign | Coordinator/Participants | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | Phase 6 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-CAM-03 | Tạo campaign: Campaign pin template version, scope và thời gian. | MUST | M07 Campaign | Coordinator/Participants | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | Phase 6 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-CAM-04 | Chuyển trạng thái: Draft→Published/Open→Closed→Archived theo guard. | MUST | M07 Campaign | Coordinator/Participants | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | Phase 6 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-CAM-05 | Enroll participant: Thêm participant đủ điều kiện và snapshot placement. | MUST | M07 Campaign | Coordinator/Participants | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | Phase 6 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-CAM-06 | Kiểm tra eligibility: Giải thích được pass/fail cho rule tối thiểu. | SHOULD | M07 Campaign | Coordinator/Participants | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | Phase 6 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-CAM-07 | Campaign dashboard: Hiển thị action-required, deadline và số liệu vận hành. | MUST | M07 Campaign | Coordinator/Participants | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | Phase 6 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-TOP-01 | Tạo proposal: Sinh viên/giảng viên tạo proposal trong campaign cho phép. | MUST | M08 Topic | Student/Lecturer/Coordinator | INV-TOP-001, INV-TOP-002, INV-TOP-003 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | topic.* scoped | Phase 7 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-TOP-02 | Sửa proposal: Chỉ sửa khi Draft/ChangesRequested và đúng owner. | MUST | M08 Topic | Student/Lecturer/Coordinator | INV-TOP-001, INV-TOP-002, INV-TOP-003 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | topic.* scoped | Phase 7 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-TOP-03 | Ra quyết định: Người có quyền approve/reject/request changes kèm reason. | MUST | M08 Topic | Student/Lecturer/Coordinator | INV-TOP-001, INV-TOP-002, INV-TOP-003 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | topic.* scoped | Phase 7 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-TOP-04 | Materialize topic: Approval tạo đúng một CampaignTopic idempotently. | MUST | M08 Topic | Student/Lecturer/Coordinator | INV-TOP-001, INV-TOP-002, INV-TOP-003 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | topic.* scoped | Phase 7 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-TOP-05 | Tra cứu topic: Participant xem các topic khả dụng theo scope. | MUST | M08 Topic | Student/Lecturer/Coordinator | INV-TOP-001, INV-TOP-002, INV-TOP-003 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | topic.* scoped | Phase 7 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-PRJ-01 | Tạo registration: Nhóm đăng ký CampaignTopic và khai báo thành viên. | MUST | M09 Project | Student/Coordinator/Supervisor | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | project_registrations, registration_members, projects, project_memberships, supervision_assignments | project.* scoped | Phase 8/9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-PRJ-02 | Kiểm tra nhóm: Số thành viên/duplicate/eligibility tuân policy. | MUST | M09 Project | Student/Coordinator/Supervisor | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | project_registrations, registration_members, projects, project_memberships, supervision_assignments | project.* scoped | Phase 8/9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-PRJ-03 | Approve registration: Approval tạo tối đa một Project từ registration. | MUST | M09 Project | Student/Coordinator/Supervisor | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | project_registrations, registration_members, projects, project_memberships, supervision_assignments | project.* scoped | Phase 8/9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-PRJ-04 | Quản lý membership: Project membership phản ánh nhóm chính thức. | MUST | M09 Project | Student/Coordinator/Supervisor | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | project_registrations, registration_members, projects, project_memberships, supervision_assignments | project.* scoped | Phase 8/9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-PRJ-05 | Phân công supervisor: Coordinator gán lecturer với role/capacity tối thiểu. | MUST | M09 Project | Student/Coordinator/Supervisor | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | project_registrations, registration_members, projects, project_memberships, supervision_assignments | project.* scoped | Phase 8/9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-PRJ-06 | Project workspace: Thành viên thấy trạng thái, deadline, milestone, tài liệu và feedback. | MUST | M09 Project | Student/Coordinator/Supervisor | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | project_registrations, registration_members, projects, project_memberships, supervision_assignments | project.* scoped | Phase 8/9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-WRK-01 | Materialize milestone: Tạo milestone từ template snapshot khi project bắt đầu. | MUST | M10 Work Progress | Student/Supervisor | INV-WRK-001 | API-055, API-056, API-057, API-058 | UI-21, UI-22 | project_milestones, progress_updates, project_tasks | progress.* related | Phase 9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-WRK-02 | Cập nhật trạng thái milestone: Transition có actor/time và guard. | MUST | M10 Work Progress | Student/Supervisor | INV-WRK-001 | API-055, API-056, API-057, API-058 | UI-21, UI-22 | project_milestones, progress_updates, project_tasks | progress.* related | Phase 9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-WRK-03 | Gửi progress update: Nhóm gửi cập nhật tiến độ append-only. | SHOULD | M10 Work Progress | Student/Supervisor | INV-WRK-001 | API-055, API-056, API-057, API-058 | UI-21, UI-22 | project_milestones, progress_updates, project_tasks | progress.* related | Phase 9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-WRK-04 | Supervisor overview: Giảng viên xem các project được phân công và blocker. | SHOULD | M10 Work Progress | Student/Supervisor | INV-WRK-001 | API-055, API-056, API-057, API-058 | UI-21, UI-22 | project_milestones, progress_updates, project_tasks | progress.* related | Phase 9 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-DOC-01 | Tạo logical document: Project tạo document theo requirement/type. | MUST | M11 Documents | Project member/Supervisor/Reviewer | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | document.* / submission.* related | Phase 10/11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-DOC-02 | Khởi tạo upload: API cấp presigned URL với object key, size, MIME, checksum, expiry. | MUST | M11 Documents | Project member/Supervisor/Reviewer | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | document.* / submission.* related | Phase 10/11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-DOC-03 | Hoàn tất upload: Complete xác minh metadata/checksum và chống replay. | MUST | M11 Documents | Project member/Supervisor/Reviewer | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | document.* / submission.* related | Phase 10/11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-DOC-04 | Tạo version: Upload thành công tạo DocumentVersion bất biến. | MUST | M11 Documents | Project member/Supervisor/Reviewer | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | document.* / submission.* related | Phase 10/11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-DOC-05 | Nộp chính thức: Submission pin một DocumentVersion cụ thể. | MUST | M11 Documents | Project member/Supervisor/Reviewer | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | document.* / submission.* related | Phase 10/11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-DOC-06 | Tải có kiểm quyền: Mỗi download tái kiểm quyền và không trả public URL. | MUST | M11 Documents | Project member/Supervisor/Reviewer | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | document.* / submission.* related | Phase 10/11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-DOC-07 | Không thay bản đã nộp: Version mới không làm thay target của submission cũ. | MUST | M11 Documents | Project member/Supervisor/Reviewer | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | document.* / submission.* related | Phase 10/11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-FB-01 | Tạo feedback: Supervisor/reviewer tạo feedback gắn project và target version. | MUST | M12 Feedback | Supervisor/Reviewer/Student | INV-FB-001 | API-067, API-068, API-069, API-070 | UI-25 | feedback_items | feedback.* related | Phase 11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-FB-02 | Revision request: Feedback có loại revision request và trạng thái resolve. | MUST | M12 Feedback | Supervisor/Reviewer/Student | INV-FB-001 | API-067, API-068, API-069, API-070 | UI-25 | feedback_items | feedback.* related | Phase 11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-FB-03 | Thread tối thiểu: Phản hồi con dùng parent_id và giữ visibility. | SHOULD | M12 Feedback | Supervisor/Reviewer/Student | INV-FB-001 | API-067, API-068, API-069, API-070 | UI-25 | feedback_items | feedback.* related | Phase 11 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-REV-01 | Quản lý và publish rubric: Rubric là aggregate root; RubricVersion/criteria bất biến sau publish. | MUST | M13 Review | Reviewer/Coordinator | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | review.* assigned/scoped | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-REV-02 | Assign reviewer: Assignment pin submission, rubric version và reviewer. | MUST | M13 Review | Reviewer/Coordinator | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | review.* assigned/scoped | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-REV-03 | Kiểm tra COI: Không cho assignment/finalize khi vi phạm COI rule tối thiểu. | MUST | M13 Review | Reviewer/Coordinator | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | review.* assigned/scoped | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-REV-04 | Tạo review draft và nhập score: Reviewer tạo/mở Review thuộc assignment của mình; score lưu theo review_id và criterion, có range/optimistic concurrency check. | MUST | M13 Review | Reviewer/Coordinator | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | review.* assigned/scoped | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-REV-05 | Submit review: Review chỉ chuyển DRAFT → SUBMITTED khi đủ tiêu chí; submitted/locked không sửa trực tiếp. | MUST | M13 Review | Reviewer/Coordinator | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | review.* assigned/scoped | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-EVA-01 | Tạo evaluation: Tổng hợp review theo policy phiên bản. | MUST | M14 Evaluation | Coordinator/Committee/Student | INV-EVA-001, INV-EVA-002, INV-EVA-003, INV-EVA-004, INV-EVA-005 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluations, evaluation_appeals, evaluation_amendments | evaluation.* scoped/related | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-EVA-02 | Kiểm quorum: Finalize chỉ khi đủ review/quorum và không có blocker. | MUST | M14 Evaluation | Coordinator/Committee/Student | INV-EVA-001, INV-EVA-002, INV-EVA-003, INV-EVA-004, INV-EVA-005 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluations, evaluation_appeals, evaluation_amendments | evaluation.* scoped/related | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-EVA-03 | Finalize bất biến: Kết quả finalized không sửa trực tiếp. | MUST | M14 Evaluation | Coordinator/Committee/Student | INV-EVA-001, INV-EVA-002, INV-EVA-003, INV-EVA-004, INV-EVA-005 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluations, evaluation_appeals, evaluation_amendments | evaluation.* scoped/related | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-EVA-04 | Amendment: Mọi sửa chính thức sau finalize tạo EvaluationAmendment append-only; appeal_id có thể null. | MUST | M14 Evaluation | Coordinator/Committee/Student | INV-EVA-001, INV-EVA-002, INV-EVA-003, INV-EVA-004, INV-EVA-005 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluations, evaluation_appeals, evaluation_amendments | evaluation.* scoped/related | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-EVA-05 | Appeal và quyết định xem xét: Cho phép submit/tra cứu/ra quyết định appeal; appeal không trực tiếp sửa Evaluation và chỉ tạo amendment khi policy cho phép. | SHOULD | M14 Evaluation | Coordinator/Committee/Student | INV-EVA-001, INV-EVA-002, INV-EVA-003, INV-EVA-004, INV-EVA-005 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluations, evaluation_appeals, evaluation_amendments | evaluation.* scoped/related | Phase 12 | PLANNED; runtime tests source only where observed | COMPLETE | SOURCE_ONLY |
| FR-COM-01 | Thông báo hành động: Tạo notification sau commit cho action-required/deadline. | SHOULD | M15 Communication/Notification | All members | N/A_JUSTIFIED | API-086, API-087 | UI-33 | notifications, notification_deliveries | notification recipient | Phase 13 | PLANNED; runtime tests source only where observed | PARTIAL | SOURCE_ONLY |
| FR-COM-02 | Inbox thông báo: Người dùng xem/đánh dấu đã đọc. | SHOULD | M15 Communication/Notification | All members | N/A_JUSTIFIED | API-086, API-087 | UI-33 | notifications, notification_deliveries | notification recipient | Phase 13 | PLANNED; runtime tests source only where observed | PARTIAL | SOURCE_ONLY |
| FR-AUD-01 | Audit critical transition: Lưu actor, tenant, resource, action, old/new state, reason, time, correlation. | MUST | M16 Audit/Operations | Auditor/Coordinator | INV-AUD-001, INV-AUD-002 | API-088, API-089 | UI-34 | audit_logs | audit.view scoped | Phase 13 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-AUD-02 | Tra cứu audit: Người có quyền xem timeline audit theo resource. | MUST | M16 Audit/Operations | Auditor/Coordinator | INV-AUD-001, INV-AUD-002 | API-088, API-089 | UI-34 | audit_logs | audit.view scoped | Phase 13 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-AUD-03 | Redaction: Log/audit không chứa password, token, presigned URL hay raw secret. | MUST | M16 Audit/Operations | Auditor/Coordinator | INV-AUD-001, INV-AUD-002 | API-088, API-089 | UI-34 | audit_logs | audit.view scoped | Phase 13 | PLANNED; runtime tests source only where observed | COMPLETE | PARTIAL |
| FR-SRCH-01 | PostgreSQL search: Tìm campaign/topic/project/document metadata trong quyền. | COULD | M17 Search | Authorized user | INV-SRCH-001 | API-090 | UI-35 | search_documents, search_chunks | search.use | After Phase 13 gate | PLANNED; runtime tests source only where observed | OPTIONAL_GATE | NOT_IMPLEMENTED |
| FR-SRCH-02 | Permission recheck: Kết quả search tái kiểm quyền trước trả. | COULD | M17 Search | Authorized user | INV-SRCH-001 | API-090 | UI-35 | search_documents, search_chunks | search.use | After Phase 13 gate | PLANNED; runtime tests source only where observed | OPTIONAL_GATE | NOT_IMPLEMENTED |
| FR-AI-01 | Checklist có citation: Sinh checklist sửa từ feedback/document được phép, mỗi mục có citation. | COULD | M18 AI/RAG | Authorized user | INV-AI-001 | API-091 | UI-36 | ai_assistance_runs, vector_embeddings | ai.use + source access | After Phase 13 gate | PLANNED; runtime tests source only where observed | OPTIONAL_GATE | NOT_IMPLEMENTED |
| FR-AI-02 | Advisory-only: AI không đổi state, điểm, role hay quyết định. | COULD | M18 AI/RAG | Authorized user | INV-AI-001 | API-091 | UI-36 | ai_assistance_runs, vector_embeddings | ai.use + source access | After Phase 13 gate | PLANNED; runtime tests source only where observed | OPTIONAL_GATE | NOT_IMPLEMENTED |
| FR-AI-03 | Từ chối thiếu nguồn: Không đủ evidence thì từ chối thay vì bịa. | COULD | M18 AI/RAG | Authorized user | INV-AI-001 | API-091 | UI-36 | ai_assistance_runs, vector_embeddings | ai.use + source access | After Phase 13 gate | PLANNED; runtime tests source only where observed | OPTIONAL_GATE | NOT_IMPLEMENTED |

## Requirement Group Reconciliation

| Requirement Group | Expected Count | Extracted Count | Module Owner | Phase | Result |
|---|---:|---:|---|---|---|
| Foundation | 4 | 4 | M01 Platform/Foundation | Phase 1 | PASS |
| Identity | 7 | 7 | M02 Identity | Phase 2 | PASS |
| Tenancy | 6 | 6 | M03 Tenancy | Phase 3 | PASS |
| Authorization | 7 | 7 | M04 Authorization | Phase 4 | PASS |
| Academic | 5 | 5 | M05/M06 Academic | Phase 5 | PASS |
| Campaign | 7 | 7 | M07 Campaign | Phase 6 | PASS |
| Topic | 5 | 5 | M08 Topic | Phase 7 | PASS |
| Project | 6 | 6 | M09 Project | Phase 8/9 | PASS |
| Work | 4 | 4 | M10 Work Progress | Phase 9 | PASS |
| Documents | 7 | 7 | M11 Documents | Phase 10/11 | PASS |
| Feedback | 3 | 3 | M12 Feedback | Phase 11 | PASS |
| Review | 5 | 5 | M13 Review | Phase 12 | PASS |
| Evaluation | 5 | 5 | M14 Evaluation | Phase 12 | PASS |
| Communication/Audit | 5 | 5 | M15 Communication/Notification, M16 Audit/Operations | Phase 13 | PASS |
| Search/AI | 5 | 5 | M17 Search, M18 AI/RAG | After Phase 13 gate | PASS |

## API Catalog Traceability

| API ID | Method | Route | Primary FR | Supporting FR | Module | Actor/Permission | Tenant Context | Idempotency | Tables | UI Consumers | Phase | Runtime Artifact | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| API-001 | GET | `/health` | FR-FND-01 | FR-FND-02, FR-FND-03, FR-FND-04 | M01 Platform/Foundation | public | public or ops context | OPTIONAL_OR_NOT_APPLICABLE | idempotency_records, outbox_events, system_configurations, plans, plan_features, subscriptions, invoices, usage_meters (+9) | N/A_JUSTIFIED | Phase 1 | ARTIFACT_OBSERVED | PARTIAL |
| API-002 | GET | `/ready` | FR-FND-01 | FR-FND-02, FR-FND-03, FR-FND-04 | M01 Platform/Foundation | public/ops | public or ops context | OPTIONAL_OR_NOT_APPLICABLE | idempotency_records, outbox_events, system_configurations, plans, plan_features, subscriptions, invoices, usage_meters (+9) | N/A_JUSTIFIED | Phase 1 | ARTIFACT_OBSERVED | PARTIAL |
| API-003 | GET | `/api/v1/meta` | FR-FND-01 | FR-FND-02, FR-FND-03, FR-FND-04 | M01 Platform/Foundation | authenticated | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | idempotency_records, outbox_events, system_configurations, plans, plan_features, subscriptions, invoices, usage_meters (+9) | N/A_JUSTIFIED | Phase 1 | ARTIFACT_OBSERVED | PARTIAL |
| API-004 | POST | `/api/v1/auth/register` | FR-ID-01 | FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | M02 Identity | public | public or ops context | OPTIONAL_OR_NOT_APPLICABLE | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | UI-01, UI-02 | Phase 2 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-005 | POST | `/api/v1/auth/verify-email` | FR-ID-01 | FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | M02 Identity | public token | public or ops context | OPTIONAL_OR_NOT_APPLICABLE | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | UI-01, UI-02 | Phase 2 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-006 | POST | `/api/v1/auth/login` | FR-ID-01 | FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | M02 Identity | public | public or ops context | OPTIONAL_OR_NOT_APPLICABLE | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | UI-01, UI-02 | Phase 2 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-007 | POST | `/api/v1/auth/refresh` | FR-ID-01 | FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | M02 Identity | session token | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | UI-01, UI-02 | Phase 2 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-008 | POST | `/api/v1/auth/logout` | FR-ID-01 | FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | M02 Identity | authenticated | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | UI-01, UI-02 | Phase 2 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-009 | POST | `/api/v1/auth/password/forgot` | FR-ID-01 | FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | M02 Identity | public | public or ops context | OPTIONAL_OR_NOT_APPLICABLE | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | UI-01, UI-02 | Phase 2 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-010 | POST | `/api/v1/auth/password/reset` | FR-ID-01 | FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | M02 Identity | public token | public or ops context | OPTIONAL_OR_NOT_APPLICABLE | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | UI-01, UI-02 | Phase 2 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-011 | GET | `/api/v1/me` | FR-ID-01 | FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | M02 Identity | authenticated | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | UI-01, UI-02 | Phase 2 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-012 | PATCH | `/api/v1/me` | FR-ID-01 | FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | M02 Identity | authenticated self | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | UI-01, UI-02 | Phase 2 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-013 | GET | `/api/v1/me/memberships` | FR-TEN-01 | FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | M03 Tenancy | authenticated | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | organizations, tenant_memberships, membership_invitations, membership_join_requests | UI-03, UI-04, UI-05, UI-06 | Phase 3 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-014 | POST | `/api/v1/organizations` | FR-TEN-01 | FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | M03 Tenancy | platform.organization.create | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | organizations, tenant_memberships, membership_invitations, membership_join_requests | UI-03, UI-04, UI-05, UI-06 | Phase 3 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-015 | PATCH | `/api/v1/organizations/:id/status` | FR-TEN-01 | FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | M03 Tenancy | platform.organization.activate | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | organizations, tenant_memberships, membership_invitations, membership_join_requests | UI-03, UI-04, UI-05, UI-06 | Phase 3 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-016 | GET | `/api/v1/organizations/:id` | FR-TEN-01 | FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | M03 Tenancy | tenant.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | organizations, tenant_memberships, membership_invitations, membership_join_requests | UI-03, UI-04, UI-05, UI-06 | Phase 3 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-017 | POST | `/api/v1/organizations/:id/invitations` | FR-TEN-01 | FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | M03 Tenancy | tenant.members.invite | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | organizations, tenant_memberships, membership_invitations, membership_join_requests | UI-03, UI-04, UI-05, UI-06 | Phase 3 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-018 | POST | `/api/v1/invitations/:token/accept` | FR-TEN-01 | FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | M03 Tenancy | authenticated | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | organizations, tenant_memberships, membership_invitations, membership_join_requests | UI-03, UI-04, UI-05, UI-06 | Phase 3 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-019 | GET | `/api/v1/organizations/:id/memberships` | FR-TEN-01 | FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | M03 Tenancy | tenant.members.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | organizations, tenant_memberships, membership_invitations, membership_join_requests | UI-03, UI-04, UI-05, UI-06 | Phase 3 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-020 | PATCH | `/api/v1/memberships/:id/status` | FR-TEN-01 | FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | M03 Tenancy | tenant.members.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | organizations, tenant_memberships, membership_invitations, membership_join_requests | UI-03, UI-04, UI-05, UI-06 | Phase 3 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-021 | POST | `/api/v1/tenant-context/switch` | FR-TEN-01 | FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | M03 Tenancy | authenticated membership | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | organizations, tenant_memberships, membership_invitations, membership_join_requests | UI-03, UI-04, UI-05, UI-06 | Phase 3 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-022 | GET | `/api/v1/permissions` | FR-AUTH-01 | FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06 (+1) | M04 Authorization | tenant.authorization.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | UI-07 | Phase 4 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-023 | POST | `/api/v1/roles` | FR-AUTH-01 | FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06 (+1) | M04 Authorization | tenant.roles.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | UI-07 | Phase 4 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-024 | PUT | `/api/v1/roles/:id/permissions` | FR-AUTH-01 | FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06 (+1) | M04 Authorization | tenant.roles.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | UI-07 | Phase 4 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-025 | POST | `/api/v1/role-assignments` | FR-AUTH-01 | FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06 (+1) | M04 Authorization | tenant.roles.assign | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | UI-07 | Phase 4 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-026 | POST | `/api/v1/role-assignments/:id/scopes` | FR-AUTH-01 | FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06 (+1) | M04 Authorization | tenant.roles.assign | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | UI-07 | Phase 4 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-027 | DELETE | `/api/v1/role-assignments/:id` | FR-AUTH-01 | FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06 (+1) | M04 Authorization | tenant.roles.assign | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | UI-07 | Phase 4 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-028 | GET | `/api/v1/academic-units` | FR-ACD-01 | FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | M05/M06 Academic | academic.units.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | UI-08, UI-09 | Phase 5 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-029 | POST | `/api/v1/academic-units` | FR-ACD-01 | FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | M05/M06 Academic | academic.units.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | UI-08, UI-09 | Phase 5 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-030 | PATCH | `/api/v1/academic-units/:id` | FR-ACD-01 | FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | M05/M06 Academic | academic.units.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | UI-08, UI-09 | Phase 5 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-031 | POST | `/api/v1/academic-profiles` | FR-ACD-01 | FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | M05/M06 Academic | academic.profiles.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | UI-08, UI-09 | Phase 5 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-032 | POST | `/api/v1/academic-placements` | FR-ACD-01 | FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | M05/M06 Academic | academic.placements.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | UI-08, UI-09 | Phase 5 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-033 | GET | `/api/v1/memberships/:id/academic-context` | FR-ACD-01 | FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | M05/M06 Academic | self or academic.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | UI-08, UI-09 | Phase 5 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-034 | POST | `/api/v1/campaign-templates` | FR-CAM-01 | FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | M07 Campaign | campaign.templates.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | UI-10, UI-11, UI-12, UI-13, UI-14 | Phase 6 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-035 | POST | `/api/v1/campaign-templates/:id/versions` | FR-CAM-01 | FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | M07 Campaign | campaign.templates.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | UI-10, UI-11, UI-12, UI-13, UI-14 | Phase 6 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-036 | POST | `/api/v1/campaign-template-versions/:id/publish` | FR-CAM-01 | FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | M07 Campaign | campaign.templates.publish | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | UI-10, UI-11, UI-12, UI-13, UI-14 | Phase 6 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-037 | POST | `/api/v1/campaigns` | FR-CAM-01 | FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | M07 Campaign | campaign.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | UI-10, UI-11, UI-12, UI-13, UI-14 | Phase 6 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-038 | POST | `/api/v1/campaigns/:id/transitions` | FR-CAM-01 | FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | M07 Campaign | campaign.transition | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | UI-10, UI-11, UI-12, UI-13, UI-14 | Phase 6 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-039 | GET | `/api/v1/campaigns` | FR-CAM-01 | FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | M07 Campaign | campaign.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | UI-10, UI-11, UI-12, UI-13, UI-14 | Phase 6 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-040 | GET | `/api/v1/campaigns/:id` | FR-CAM-01 | FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | M07 Campaign | campaign.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | UI-10, UI-11, UI-12, UI-13, UI-14 | Phase 6 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-041 | POST | `/api/v1/campaigns/:id/participants` | FR-CAM-01 | FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | M07 Campaign | campaign.participants.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | UI-10, UI-11, UI-12, UI-13, UI-14 | Phase 6 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-042 | GET | `/api/v1/campaigns/:id/eligibility/:membershipId` | FR-CAM-01 | FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | M07 Campaign | campaign.eligibility.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | UI-10, UI-11, UI-12, UI-13, UI-14 | Phase 6 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-043 | POST | `/api/v1/topic-proposals` | FR-TOP-01 | FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | M08 Topic | topic.propose | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | UI-15, UI-16, UI-17 | Phase 7 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-044 | PATCH | `/api/v1/topic-proposals/:id` | FR-TOP-01 | FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | M08 Topic | topic.edit own | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | UI-15, UI-16, UI-17 | Phase 7 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-045 | POST | `/api/v1/topic-proposals/:id/decisions` | FR-TOP-01 | FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | M08 Topic | topic.review | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | UI-15, UI-16, UI-17 | Phase 7 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-046 | GET | `/api/v1/campaigns/:id/topics` | FR-TOP-01 | FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | M08 Topic | topic.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | UI-15, UI-16, UI-17 | Phase 7 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-047 | GET | `/api/v1/topic-proposals/:id` | FR-TOP-01 | FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | M08 Topic | topic.view related | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | UI-15, UI-16, UI-17 | Phase 7 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-048 | POST | `/api/v1/project-registrations` | FR-PRJ-01 | FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | M09 Project | registration.create | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | project_registrations, registration_members, projects, project_memberships, supervision_assignments | UI-18, UI-19, UI-20 | Phase 8/9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-049 | POST | `/api/v1/project-registrations/:id/members` | FR-PRJ-01 | FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | M09 Project | registration.edit own | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | project_registrations, registration_members, projects, project_memberships, supervision_assignments | UI-18, UI-19, UI-20 | Phase 8/9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-050 | POST | `/api/v1/project-registrations/:id/decisions` | FR-PRJ-01 | FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | M09 Project | registration.review | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | project_registrations, registration_members, projects, project_memberships, supervision_assignments | UI-18, UI-19, UI-20 | Phase 8/9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-051 | GET | `/api/v1/projects` | FR-PRJ-01 | FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | M09 Project | project.view related | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | project_registrations, registration_members, projects, project_memberships, supervision_assignments | UI-18, UI-19, UI-20 | Phase 8/9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-052 | GET | `/api/v1/projects/:id` | FR-PRJ-01 | FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | M09 Project | project.view related | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | project_registrations, registration_members, projects, project_memberships, supervision_assignments | UI-18, UI-19, UI-20 | Phase 8/9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-053 | POST | `/api/v1/projects/:id/members` | FR-PRJ-01 | FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | M09 Project | project.members.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | project_registrations, registration_members, projects, project_memberships, supervision_assignments | UI-18, UI-19, UI-20 | Phase 8/9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-054 | POST | `/api/v1/projects/:id/supervisors` | FR-PRJ-01 | FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | M09 Project | supervision.assign | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | project_registrations, registration_members, projects, project_memberships, supervision_assignments | UI-18, UI-19, UI-20 | Phase 8/9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-055 | POST | `/api/v1/projects/:id/milestones` | FR-WRK-01 | FR-WRK-02, FR-WRK-03, FR-WRK-04 | M10 Work Progress | project.progress.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | project_milestones, progress_updates, project_tasks | UI-21, UI-22 | Phase 9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-056 | POST | `/api/v1/milestones/:id/transitions` | FR-WRK-01 | FR-WRK-02, FR-WRK-03, FR-WRK-04 | M10 Work Progress | project.progress.update | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | project_milestones, progress_updates, project_tasks | UI-21, UI-22 | Phase 9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-057 | POST | `/api/v1/projects/:id/progress-updates` | FR-WRK-01 | FR-WRK-02, FR-WRK-03, FR-WRK-04 | M10 Work Progress | project.progress.update | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | project_milestones, progress_updates, project_tasks | UI-21, UI-22 | Phase 9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-058 | GET | `/api/v1/supervision/projects` | FR-WRK-01 | FR-WRK-02, FR-WRK-03, FR-WRK-04 | M10 Work Progress | supervision.view | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | project_milestones, progress_updates, project_tasks | UI-21, UI-22 | Phase 9 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-059 | POST | `/api/v1/projects/:id/documents` | FR-DOC-01 | FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | M11 Documents | document.create | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | UI-23, UI-24 | Phase 10/11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-060 | POST | `/api/v1/upload-sessions` | FR-DOC-01 | FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | M11 Documents | document.upload | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | UI-23, UI-24 | Phase 10/11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-061 | POST | `/api/v1/upload-sessions/:id/complete` | FR-DOC-01 | FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | M11 Documents | document.upload own | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | UI-23, UI-24 | Phase 10/11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-062 | POST | `/api/v1/upload-sessions/:id/abort` | FR-DOC-01 | FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | M11 Documents | document.upload own | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | UI-23, UI-24 | Phase 10/11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-063 | GET | `/api/v1/documents/:id/versions` | FR-DOC-01 | FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | M11 Documents | document.view related | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | UI-23, UI-24 | Phase 10/11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-064 | POST | `/api/v1/submissions` | FR-DOC-01 | FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | M11 Documents | submission.create | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | UI-23, UI-24 | Phase 10/11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-065 | POST | `/api/v1/submissions/:id/withdraw` | FR-DOC-01 | FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | M11 Documents | submission.withdraw | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | UI-23, UI-24 | Phase 10/11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-066 | POST | `/api/v1/document-versions/:id/download` | FR-DOC-01 | FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | M11 Documents | document.download related | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | UI-23, UI-24 | Phase 10/11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-067 | POST | `/api/v1/feedback` | FR-FB-01 | FR-FB-02, FR-FB-03 | M12 Feedback | feedback.create related | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | feedback_items | UI-25 | Phase 11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-068 | POST | `/api/v1/feedback/:id/replies` | FR-FB-01 | FR-FB-02, FR-FB-03 | M12 Feedback | feedback.reply related | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | feedback_items | UI-25 | Phase 11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-069 | POST | `/api/v1/feedback/:id/resolve` | FR-FB-01 | FR-FB-02, FR-FB-03 | M12 Feedback | feedback.resolve | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | feedback_items | UI-25 | Phase 11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-070 | GET | `/api/v1/projects/:id/feedback` | FR-FB-01 | FR-FB-02, FR-FB-03 | M12 Feedback | feedback.view related | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | feedback_items | UI-25 | Phase 11 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-071 | POST | `/api/v1/rubrics` | FR-REV-01 | FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | M13 Review | rubric.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | UI-26, UI-27, UI-28 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-072 | POST | `/api/v1/rubrics/:id/publish` | FR-REV-01 | FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | M13 Review | rubric.publish | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | UI-26, UI-27, UI-28 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-073 | POST | `/api/v1/review-assignments` | FR-REV-01 | FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | M13 Review | review.assign | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | UI-26, UI-27, UI-28 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-074 | GET | `/api/v1/review-assignments/mine` | FR-REV-01 | FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | M13 Review | reviewer | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | UI-26, UI-27, UI-28 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-075 | PUT | `/api/v1/reviews/:id/scores` | FR-REV-01 | FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | M13 Review | review owner | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | UI-26, UI-27, UI-28 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-076 | POST | `/api/v1/reviews/:id/submit` | FR-REV-01 | FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | M13 Review | review owner | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | UI-26, UI-27, UI-28 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-077 | POST | `/api/v1/review-assignments/:assignmentId/reviews` | FR-REV-01 | FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | M13 Review | assigned reviewer | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | UI-26, UI-27, UI-28 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-078 | GET | `/api/v1/reviews/:id` | FR-REV-01 | FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | M13 Review | review owner or scoped manager | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | UI-26, UI-27, UI-28 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-079 | POST | `/api/v1/evaluations` | FR-EVA-01 | FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | M14 Evaluation | evaluation.manage | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | evaluations, evaluation_appeals, evaluation_amendments | UI-29, UI-30, UI-31, UI-32 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-080 | POST | `/api/v1/evaluations/:id/finalize` | FR-EVA-01 | FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | M14 Evaluation | evaluation.finalize | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | evaluations, evaluation_appeals, evaluation_amendments | UI-29, UI-30, UI-31, UI-32 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-081 | POST | `/api/v1/evaluations/:id/appeals` | FR-EVA-01 | FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | M14 Evaluation | eligible related member | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | evaluations, evaluation_appeals, evaluation_amendments | UI-29, UI-30, UI-31, UI-32 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-082 | GET | `/api/v1/evaluations/:id/appeals` | FR-EVA-01 | FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | M14 Evaluation | evaluation.appeal.view scoped | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | evaluations, evaluation_appeals, evaluation_amendments | UI-29, UI-30, UI-31, UI-32 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-083 | POST | `/api/v1/evaluation-appeals/:id/decisions` | FR-EVA-01 | FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | M14 Evaluation | evaluation.appeal.decide scoped | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | evaluations, evaluation_appeals, evaluation_amendments | UI-29, UI-30, UI-31, UI-32 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-084 | POST | `/api/v1/evaluations/:id/amendments` | FR-EVA-01 | FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | M14 Evaluation | evaluation.amend | tenant/membership context required | REQUIRED_FOR_CRITICAL_POST | evaluations, evaluation_appeals, evaluation_amendments | UI-29, UI-30, UI-31, UI-32 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-085 | GET | `/api/v1/projects/:id/evaluation` | FR-EVA-01 | FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | M14 Evaluation | evaluation.view related | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | evaluations, evaluation_appeals, evaluation_amendments | UI-29, UI-30, UI-31, UI-32 | Phase 12 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-086 | GET | `/api/v1/notifications` | FR-COM-01 | FR-COM-02 | M15 Communication/Notification | authenticated membership | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | notifications, notification_deliveries | UI-33 | Phase 13 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-087 | POST | `/api/v1/notifications/:id/read` | FR-COM-01 | FR-COM-02 | M15 Communication/Notification | recipient | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | notifications, notification_deliveries | UI-33 | Phase 13 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-088 | GET | `/api/v1/audit-logs` | FR-AUD-01 | FR-AUD-02, FR-AUD-03 | M16 Audit/Operations | audit.view scoped | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | audit_logs | UI-34 | Phase 13 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-089 | GET | `/api/v1/resources/:type/:id/audit` | FR-AUD-01 | FR-AUD-02, FR-AUD-03 | M16 Audit/Operations | audit.view resource | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | audit_logs | UI-34 | Phase 13 | SOURCE_ONLY_NOT_IMPLEMENTED | SOURCE_ONLY |
| API-090 | GET | `/api/v1/search` | FR-SRCH-01 | FR-SRCH-02 | M17 Search | search.use | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | search_documents, search_chunks | UI-35 | After Phase 13 gate | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| API-091 | POST | `/api/v1/ai/checklists` | FR-AI-01 | FR-AI-02, FR-AI-03 | M18 AI/RAG | ai.use + source access | tenant/membership context required | OPTIONAL_OR_NOT_APPLICABLE | ai_assistance_runs, vector_embeddings | UI-36 | After Phase 13 gate | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |

## Runtime API Inspection

| Runtime Route | Source API Match | Method/Path Match | Module Match | Permission Observed | Validation Observed | Runtime Status | Finding |
|---|---|---|---|---|---|---|---|
| GET `/health` | API-001 | MATCH | MATCH | observed in source route/controller | partial; Zod/body validation not applicable for GET | SOURCE_AND_RUNTIME_ALIGNED | healthRouter registered in app.ts |
| GET `/ready` | API-002 | MATCH | MATCH | observed in source route/controller | partial; Zod/body validation not applicable for GET | SOURCE_AND_RUNTIME_ALIGNED | app.get /ready |
| GET `/api/v1/meta` | API-003 | MATCH | MATCH | observed in source route/controller | partial; Zod/body validation not applicable for GET | SOURCE_AND_RUNTIME_ALIGNED | app.get /api/v1/meta |
| GET `/__test/error` | none | RUNTIME_ONLY | N/A | test-only | test-only | RUNTIME_ONLY | test-only route under NODE_ENV=test |

## UI Catalog Traceability

| UI ID | Screen/Flow | Actor | Module | Related FR | APIs Used | Tables Indirectly Affected | Required Permission | Important States | Error States | Phase | Runtime Artifact | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| UI-01 | Đăng ký/Xác minh | Public | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | public/authenticated self | source states in Register, verify email, safe errors | validation/forbidden/conflict/state errors per P0-012 | Phase 2 | None observed | SOURCE_ONLY |
| UI-02 | Đăng nhập/Khôi phục mật khẩu | Public | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06 (+1) | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | accounts, account_credentials, account_tokens, sessions, identity_providers, scim_mappings | public/authenticated self | source states in Login, forgot/reset, session errors | validation/forbidden/conflict/state errors per P0-012 | Phase 2 | None observed | SOURCE_ONLY |
| UI-03 | Chọn tổ chức | Authenticated | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | source states in Danh sách membership và switch tenant | validation/forbidden/conflict/state errors per P0-012 | Phase 3 | None observed | SOURCE_ONLY |
| UI-04 | Platform Organization Console | Platform Admin | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | source states in Tạo/kích hoạt/suspend organization | validation/forbidden/conflict/state errors per P0-012 | Phase 3 | None observed | SOURCE_ONLY |
| UI-05 | Organization Settings | Organization Admin | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | source states in Thông tin tenant, policy tối thiểu | validation/forbidden/conflict/state errors per P0-012 | Phase 3 | None observed | SOURCE_ONLY |
| UI-06 | Invitation & Membership | Organization Admin | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | organizations, tenant_memberships, membership_invitations, membership_join_requests | platform.organization.* / membership.* | source states in Mời, theo dõi, đình chỉ thành viên | validation/forbidden/conflict/state errors per P0-012 | Phase 3 | None observed | SOURCE_ONLY |
| UI-07 | Role & Permission Matrix | Organization Admin | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06 (+1) | API-022, API-023, API-024, API-025, API-026, API-027 | roles, permissions, role_permissions, role_assignments, role_assignment_scopes | role.* / permission.* / assignment.* | source states in Role, permission, assignment, scope | validation/forbidden/conflict/state errors per P0-012 | Phase 4 | None observed | SOURCE_ONLY |
| UI-08 | Academic Structure Explorer | Academic Admin | M05/M06 Academic | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | academic.* scoped | source states in Cây Faculty/Department/Program/Center/Institute/Other; Class/Cohort là optional extension | validation/forbidden/conflict/state errors per P0-012 | Phase 5 | None observed | SOURCE_ONLY |
| UI-09 | Academic Profile & Placement | Academic Admin | M05/M06 Academic | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | academic_units, academic_profiles, academic_placements, academic_cohorts, academic_classes | academic.* scoped | source states in Provision profile, effective-dated placement | validation/forbidden/conflict/state errors per P0-012 | Phase 5 | None observed | SOURCE_ONLY |
| UI-10 | Campaign Template List | Coordinator | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | source states in Quản lý template và version | validation/forbidden/conflict/state errors per P0-012 | Phase 6 | None observed | SOURCE_ONLY |
| UI-11 | Campaign Template Editor | Coordinator | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | source states in Workflow/policy/milestone/rubric references | validation/forbidden/conflict/state errors per P0-012 | Phase 6 | None observed | SOURCE_ONLY |
| UI-12 | Campaign Operations Dashboard | Coordinator | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | source states in Action-required, deadlines, counts, blockers | validation/forbidden/conflict/state errors per P0-012 | Phase 6 | None observed | SOURCE_ONLY |
| UI-13 | Campaign Detail | All related | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | source states in Overview, participants, topics, registrations | validation/forbidden/conflict/state errors per P0-012 | Phase 6 | None observed | SOURCE_ONLY |
| UI-14 | Eligibility Explanation | Coordinator/Participant | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06 (+1) | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | campaign_templates, campaign_template_versions, academic_campaigns, campaign_participants | campaign.* scoped | source states in Pass/fail rule explanation | validation/forbidden/conflict/state errors per P0-012 | Phase 6 | None observed | SOURCE_ONLY |
| UI-15 | Topic Proposal Form | Student/Lecturer | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | topic.* scoped | source states in Create/edit proposal | validation/forbidden/conflict/state errors per P0-012 | Phase 7 | None observed | SOURCE_ONLY |
| UI-16 | Topic Review Queue | Coordinator/Reviewer | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | topic.* scoped | source states in Approve/reject/request changes | validation/forbidden/conflict/state errors per P0-012 | Phase 7 | None observed | SOURCE_ONLY |
| UI-17 | Campaign Topic Catalog | Participant | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | topic_proposals, topic_decisions, campaign_topics, topic_catalog_entries | topic.* scoped | source states in Browse approved topics | validation/forbidden/conflict/state errors per P0-012 | Phase 7 | None observed | SOURCE_ONLY |
| UI-18 | Project Registration Wizard | Student | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | project_registrations, registration_members, projects, project_memberships, supervision_assignments | project.* scoped | source states in Team + topic + policy validation | validation/forbidden/conflict/state errors per P0-012 | Phase 8/9 | None observed | SOURCE_ONLY |
| UI-19 | Registration Review Queue | Coordinator | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | project_registrations, registration_members, projects, project_memberships, supervision_assignments | project.* scoped | source states in Approve/reject and project creation result | validation/forbidden/conflict/state errors per P0-012 | Phase 8/9 | None observed | SOURCE_ONLY |
| UI-20 | Project Workspace | Project member | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | project_registrations, registration_members, projects, project_memberships, supervision_assignments | project.* scoped | source states in Summary, milestone, docs, feedback, result | validation/forbidden/conflict/state errors per P0-012 | Phase 8/9 | None observed | SOURCE_ONLY |
| UI-21 | Supervisor Portfolio | Lecturer | M10 Work Progress | FR-WRK-01, FR-WRK-02, FR-WRK-03, FR-WRK-04 | API-055, API-056, API-057, API-058 | project_milestones, progress_updates, project_tasks | progress.* related | source states in Assigned projects, status, blockers | validation/forbidden/conflict/state errors per P0-012 | Phase 9 | None observed | SOURCE_ONLY |
| UI-22 | Milestone & Progress | Project/Supervisor | M10 Work Progress | FR-WRK-01, FR-WRK-02, FR-WRK-03, FR-WRK-04 | API-055, API-056, API-057, API-058 | project_milestones, progress_updates, project_tasks | progress.* related | source states in Milestones and progress timeline | validation/forbidden/conflict/state errors per P0-012 | Phase 9 | None observed | SOURCE_ONLY |
| UI-23 | Document Center | Project member | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | document.* / submission.* related | source states in Logical docs, versions, upload status | validation/forbidden/conflict/state errors per P0-012 | Phase 10/11 | None observed | SOURCE_ONLY |
| UI-24 | Submission Panel | Student | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06 (+1) | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | documents, upload_sessions, document_versions, submissions, document_processing_jobs, malware_scan_results, download_grants | document.* / submission.* related | source states in Choose exact version, submit/withdraw | validation/forbidden/conflict/state errors per P0-012 | Phase 10/11 | None observed | SOURCE_ONLY |
| UI-25 | Feedback Workspace | Supervisor/Reviewer/Student | M12 Feedback | FR-FB-01, FR-FB-02, FR-FB-03 | API-067, API-068, API-069, API-070 | feedback_items | feedback.* related | source states in Feedback by version, revision requests | validation/forbidden/conflict/state errors per P0-012 | Phase 11 | None observed | SOURCE_ONLY |
| UI-26 | Rubric Builder | Coordinator | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | review.* assigned/scoped | source states in Rubric aggregate, versioned criteria, publish/retire | validation/forbidden/conflict/state errors per P0-012 | Phase 12 | None observed | SOURCE_ONLY |
| UI-27 | Reviewer Inbox | Reviewer | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | review.* assigned/scoped | source states in Assigned targets, deadline, rubric | validation/forbidden/conflict/state errors per P0-012 | Phase 12 | None observed | SOURCE_ONLY |
| UI-28 | Review Scoring Form | Reviewer | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | rubrics, rubric_versions, rubric_criteria, review_assignments, reviews, review_scores | review.* assigned/scoped | source states in Create/open Review draft, criterion scores/comments, submit/locked state | validation/forbidden/conflict/state errors per P0-012 | Phase 12 | None observed | SOURCE_ONLY |
| UI-29 | Evaluation Finalization | Coordinator/Committee | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | evaluations, evaluation_appeals, evaluation_amendments | evaluation.* scoped/related | source states in Quorum/COI guards, finalize | validation/forbidden/conflict/state errors per P0-012 | Phase 12 | None observed | SOURCE_ONLY |
| UI-30 | Evaluation History & Amendment | Authorized roles | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | evaluations, evaluation_appeals, evaluation_amendments | evaluation.* scoped/related | source states in Official result, appeal linkage and append-only corrections | validation/forbidden/conflict/state errors per P0-012 | Phase 12 | None observed | SOURCE_ONLY |
| UI-31 | Appeal Submission | Student/eligible related member | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | evaluations, evaluation_appeals, evaluation_amendments | evaluation.* scoped/related | source states in Reason, evidence reference, deadline/policy validation | validation/forbidden/conflict/state errors per P0-012 | Phase 12 | None observed | SOURCE_ONLY |
| UI-32 | Appeal Review | Authorized coordinator/committee | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | evaluations, evaluation_appeals, evaluation_amendments | evaluation.* scoped/related | source states in Review evidence, accept/reject, optional amendment follow-up | validation/forbidden/conflict/state errors per P0-012 | Phase 12 | None observed | SOURCE_ONLY |
| UI-33 | Notification Inbox | All members | M15 Communication/Notification | FR-COM-01, FR-COM-02 | API-086, API-087 | notifications, notification_deliveries | notification recipient | source states in Action-required/deadline notifications | validation/forbidden/conflict/state errors per P0-012 | Phase 13 | None observed | SOURCE_ONLY |
| UI-34 | Audit Timeline | Auditor/Coordinator scoped | M16 Audit/Operations | FR-AUD-01, FR-AUD-02, FR-AUD-03 | API-088, API-089 | audit_logs | audit.view scoped | source states in Actor, transition, reason, correlation | validation/forbidden/conflict/state errors per P0-012 | Phase 13 | None observed | SOURCE_ONLY |
| UI-35 | Permission-aware Search | Authorized user | M17 Search | FR-SRCH-01, FR-SRCH-02 | API-090 | search_documents, search_chunks | search.use | source states in Search within current tenant/relationship | validation/forbidden/conflict/state errors per P0-012 | After Phase 13 gate | None observed | OPTIONAL_GATE |
| UI-36 | AI Revision Checklist | Authorized user | M18 AI/RAG | FR-AI-01, FR-AI-02, FR-AI-03 | API-091 | ai_assistance_runs, vector_embeddings | ai.use + source access | source states in Cited checklist; advisory warning | validation/forbidden/conflict/state errors per P0-012 | After Phase 13 gate | None observed | OPTIONAL_GATE |

## Runtime UI Inspection

| Runtime UI Artifact | Source UI Match | Related API | Module | Status | Finding |
|---|---|---|---|---|---|
| apps/web/src/app/page.tsx | SOURCE_ONLY/PARTIAL | GET /health | M01 Platform/Foundation | PARTIAL | Foundation shell/health card; not part of UI catalog 36 except Phase 1 shell note |
| apps/web/src/features/health/HealthStatus.tsx | SOURCE_ONLY/PARTIAL | GET /health | M01 Platform/Foundation | PARTIAL | Health status component |
| apps/web/src/lib/apiClient.ts | N/A_JUSTIFIED | HTTP API client | M01 Platform/Foundation | ALIGNED_ARTIFACT | Frontend client only |

## Database Capability Traceability

| Table/Capability | Classification | Module Owner | Related FR | Related APIs | Related UI | Related Invariants | Phase | Runtime Evidence | Traceability Result |
|---|---|---|---|---|---|---|---|---|---|
| `idempotency_records` | CORE | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | P1 | IMPLEMENTED_AND_OBSERVED | COMPLETE |
| `outbox_events` | CORE | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | P1 | IMPLEMENTED_AND_OBSERVED | COMPLETE |
| `system_configurations` | CORE | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | P1 | IMPLEMENTED_AND_OBSERVED | COMPLETE |
| `accounts` | CORE | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | P2 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `account_credentials` | CORE | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | P2 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `account_tokens` | CORE | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | P2 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `sessions` | CORE | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | P2 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `organizations` | CORE | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | P3 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `tenant_memberships` | CORE | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | P3 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `membership_invitations` | CORE | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | P3 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `roles` | CORE | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | P4 | IMPLEMENTED_AND_OBSERVED | COMPLETE |
| `permissions` | CORE | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | P4 | IMPLEMENTED_AND_OBSERVED | COMPLETE |
| `role_permissions` | CORE | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | P4 | IMPLEMENTED_AND_OBSERVED | COMPLETE |
| `role_assignments` | CORE | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | P4 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `role_assignment_scopes` | CORE | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | INV-AUTH-001, INV-AUTH-002, INV-AUTH-003, INV-AUTH-004, INV-AUTH-005 | P4 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `academic_units` | CORE | M05/M06 Academic | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | INV-ACD-001, INV-ACD-002, INV-ACD-003 | P5 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `academic_profiles` | CORE | M05/M06 Academic | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | INV-ACD-001, INV-ACD-002, INV-ACD-003 | P5 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `academic_placements` | CORE | M05/M06 Academic | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | INV-ACD-001, INV-ACD-002, INV-ACD-003 | P5 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `campaign_templates` | CORE | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06, FR-CAM-07 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | P6 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `campaign_template_versions` | CORE | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06, FR-CAM-07 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | P6 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `academic_campaigns` | CORE | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06, FR-CAM-07 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | P6 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `campaign_participants` | CORE | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06, FR-CAM-07 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | INV-CAM-001, INV-CAM-002, INV-CAM-003, INV-CAM-004 | P6 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `topic_proposals` | CORE | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | INV-TOP-001, INV-TOP-002, INV-TOP-003 | P7 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `topic_decisions` | CORE | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | INV-TOP-001, INV-TOP-002, INV-TOP-003 | P7 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `campaign_topics` | CORE | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | INV-TOP-001, INV-TOP-002, INV-TOP-003 | P7 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `project_registrations` | CORE | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | P8 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `registration_members` | CORE | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | P8 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `projects` | CORE | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | P8 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `project_memberships` | CORE | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | P9 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `supervision_assignments` | CORE | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | INV-PRJ-001, INV-PRJ-002, INV-PRJ-003, INV-PRJ-004 | P9 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `project_milestones` | CORE | M10 Work Progress | FR-WRK-01, FR-WRK-02, FR-WRK-03, FR-WRK-04 | API-055, API-056, API-057, API-058 | UI-21, UI-22 | INV-WRK-001 | P9 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `progress_updates` | CORE | M10 Work Progress | FR-WRK-01, FR-WRK-02, FR-WRK-03, FR-WRK-04 | API-055, API-056, API-057, API-058 | UI-21, UI-22 | INV-WRK-001 | P9 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `documents` | CORE | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | P10 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `upload_sessions` | CORE | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | P10 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `document_versions` | CORE | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | P10 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `submissions` | CORE | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | P11 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `feedback_items` | CORE | M12 Feedback | FR-FB-01, FR-FB-02, FR-FB-03 | API-067, API-068, API-069, API-070 | UI-25 | INV-FB-001 | P11 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `rubrics` | CORE | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | P12 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `rubric_versions` | CORE | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | P12 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `rubric_criteria` | CORE | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | P12 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `review_assignments` | CORE | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | P12 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `reviews` | CORE | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | P12 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `review_scores` | CORE | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | INV-REV-001, INV-REV-002, INV-REV-003, INV-REV-004, INV-REV-005 | P12 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `evaluations` | CORE | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | INV-EVA-001, INV-EVA-002, INV-EVA-003, INV-EVA-004, INV-EVA-005 | P12 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `evaluation_appeals` | CORE | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | INV-EVA-001, INV-EVA-002, INV-EVA-003, INV-EVA-004, INV-EVA-005 | P12 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `evaluation_amendments` | CORE | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | INV-EVA-001, INV-EVA-002, INV-EVA-003, INV-EVA-004, INV-EVA-005 | P12 | SOURCE_ONLY_NOT_IMPLEMENTED | COMPLETE |
| `notifications` | CORE | M15 Communication/Notification | FR-COM-01, FR-COM-02 | API-086, API-087 | UI-33 | N/A_JUSTIFIED | P13 | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `audit_logs` | CORE | M16 Audit/Operations | FR-AUD-01, FR-AUD-02, FR-AUD-03 | API-088, API-089 | UI-34 | INV-AUD-001, INV-AUD-002 | P13 | IMPLEMENTED_AND_OBSERVED | COMPLETE |
| `membership_join_requests` | OPTIONAL | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | INV-TEN-001, INV-TEN-002, INV-TEN-003, INV-TEN-004, INV-TEN-005 | P3+ | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `topic_catalog_entries` | OPTIONAL | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | INV-TOP-001, INV-TOP-002, INV-TOP-003 | P7+ | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `project_tasks` | OPTIONAL | M10 Work Progress | FR-WRK-01, FR-WRK-02, FR-WRK-03, FR-WRK-04 | API-055, API-056, API-057, API-058 | UI-21, UI-22 | INV-WRK-001 | P9+ | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `academic_cohorts` | OPTIONAL | M05/M06 Academic | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | INV-ACD-001, INV-ACD-002, INV-ACD-003 | P5+ | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `academic_classes` | OPTIONAL | M05/M06 Academic | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | INV-ACD-001, INV-ACD-002, INV-ACD-003 | P5+ | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `document_processing_jobs` | OPTIONAL | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | P10+ | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `malware_scan_results` | OPTIONAL | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | P10+ | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `download_grants` | OPTIONAL | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | INV-DOC-001, INV-DOC-002, INV-DOC-003, INV-DOC-004, INV-DOC-005 | P10+ | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `notification_deliveries` | OPTIONAL | M15 Communication/Notification | FR-COM-01, FR-COM-02 | API-086, API-087 | UI-33 | N/A_JUSTIFIED | P13+ | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `search_documents` | OPTIONAL | M17 Search | FR-SRCH-01, FR-SRCH-02 | API-090 | UI-35 | INV-SRCH-001 | P14 | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `search_chunks` | OPTIONAL | M17 Search | FR-SRCH-01, FR-SRCH-02 | API-090 | UI-35 | INV-SRCH-001 | P14 | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `ai_assistance_runs` | OPTIONAL | M18 AI/RAG | FR-AI-01, FR-AI-02, FR-AI-03 | API-091 | UI-36 | INV-AI-001 | P15 | SOURCE_ONLY_NOT_IMPLEMENTED | OPTIONAL_GATE |
| `plans` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `plan_features` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `subscriptions` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `invoices` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `usage_meters` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `identity_providers` | DEFERRED | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `scim_mappings` | DEFERRED | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | INV-ID-001, INV-ID-002, INV-ID-003, INV-ID-004 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `integration_connectors` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `sync_jobs` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `discussion_threads` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `chat_messages` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `report_runs` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `analytics_events` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `vector_embeddings` | DEFERRED | M18 AI/RAG | FR-AI-01, FR-AI-02, FR-AI-03 | API-091 | UI-36 | INV-AI-001 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `event_stream_offsets` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `service_extraction_registry` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |
| `deployment_clusters` | DEFERRED | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED | INV-FND-001, INV-FND-002, INV-FND-003, INV-FND-004, INV-FND-005 | Roadmap | SOURCE_ONLY_NOT_IMPLEMENTED | DEFERRED |

## Business Invariant Traceability

| Invariant ID | Owner Module | Related FR | Related APIs | Related UI | Tables | Phase | Required Test | Runtime Evidence | Status |
|---|---|---|---|---|---|---|---|---|---|
| INV-FND-001 | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED: reliability/security/internal invariant | outbox_events; business table; audit_logs when critical | Phase 1 foundation; applies Phase 2–13 | PLANNED; see P0-009 Test Evidence Matrix | PARTIALLY_ENFORCED | PARTIAL |
| INV-FND-002 | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED: reliability/security/internal invariant | idempotency_records | Phase 1 foundation; applies to critical commands | PLANNED; see P0-009 Test Evidence Matrix | PARTIALLY_ENFORCED | PARTIAL |
| INV-FND-003 | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED: reliability/security/internal invariant | varies by flow | Phase 1 foundation; applies Phase 7–13 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-FND-004 | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED: reliability/security/internal invariant | logs; error envelope; config secrets | Phase 1 and Phase 13 hardening | PLANNED; see P0-009 Test Evidence Matrix | PARTIALLY_ENFORCED | PARTIAL |
| INV-FND-005 | M01 Platform/Foundation | FR-FND-01, FR-FND-02, FR-FND-03, FR-FND-04 | API-001, API-002, API-003 | N/A_JUSTIFIED: reliability/security/internal invariant | outbox_events; notifications later | Phase 1 worker foundation; Phase 13 hardening | PLANNED; see P0-009 Test Evidence Matrix | PARTIALLY_ENFORCED | PARTIAL |
| INV-ID-001 | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | accounts; tenant_memberships | Phase 2 + Phase 3 | PLANNED; see P0-009 Test Evidence Matrix | VIOLATED_BY_RUNTIME | PARTIAL |
| INV-ID-002 | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | account_credentials; accounts | Phase 2 | PLANNED; see P0-009 Test Evidence Matrix | PARTIALLY_ENFORCED | PARTIAL |
| INV-ID-003 | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | account_tokens | Phase 2 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-ID-004 | M02 Identity | FR-ID-01, FR-ID-02, FR-ID-03, FR-ID-04, FR-ID-05, FR-ID-06, FR-ID-07 | API-004, API-005, API-006, API-007, API-008, API-009, API-010, API-011 (+1) | UI-01, UI-02 | sessions; account_tokens; tenant_memberships reference only | Phase 2 | PLANNED; see P0-009 Test Evidence Matrix | VIOLATED_BY_RUNTIME | PARTIAL |
| INV-TEN-001 | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | tenant_memberships | Phase 3 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-TEN-002 | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | tenant_memberships; sessions | Phase 3 | PLANNED; see P0-009 Test Evidence Matrix | PARTIALLY_ENFORCED | PARTIAL |
| INV-TEN-003 | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | tenant_memberships; sessions | Phase 3 | PLANNED; see P0-009 Test Evidence Matrix | VIOLATED_BY_RUNTIME | PARTIAL |
| INV-TEN-004 | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | all TENANT/GLOBAL-TENANT tables | Phase 3 onward | PLANNED; see P0-009 Test Evidence Matrix | NEEDS_TEST_EVIDENCE | SOURCE_ONLY |
| INV-TEN-005 | M03 Tenancy | FR-TEN-01, FR-TEN-02, FR-TEN-03, FR-TEN-04, FR-TEN-05, FR-TEN-06 | API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020 (+1) | UI-03, UI-04, UI-05, UI-06 | membership_invitations; tenant_memberships | Phase 3 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-AUTH-001 | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | roles; permissions; role_assignments; role_assignment_scopes; resource tables | Phase 4 onward | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-AUTH-002 | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | role_assignments; role_assignment_scopes; academic_units | Phase 4/5 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-AUTH-003 | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | role_assignments; role_assignment_scopes | Phase 4 | PLANNED; see P0-009 Test Evidence Matrix | VIOLATED_BY_RUNTIME | PARTIAL |
| INV-AUTH-004 | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | role_assignments; tenant_memberships; sessions | Phase 4 onward | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-AUTH-005 | M04 Authorization | FR-AUTH-01, FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-AUTH-05, FR-AUTH-06, FR-AUTH-07 | API-022, API-023, API-024, API-025, API-026, API-027 | UI-07 | authorization tables plus resource tables by owner | Phase 4 onward | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-ACD-001 | M05 Academic Organization | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | academic_units; academic_cohorts/classes optional | Phase 5 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-ACD-002 | M05 Academic Organization | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | academic_units | Phase 5 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-ACD-003 | M06 Academic Profiles | FR-ACD-01, FR-ACD-02, FR-ACD-03, FR-ACD-04, FR-ACD-05 | API-028, API-029, API-030, API-031, API-032, API-033 | UI-08, UI-09 | academic_profiles; academic_placements | Phase 5 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-CAM-001 | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06, FR-CAM-07 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | campaign_templates; campaign_template_versions | Phase 6 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-CAM-002 | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06, FR-CAM-07 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | academic_campaigns; campaign_template_versions | Phase 6 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-CAM-003 | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06, FR-CAM-07 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | academic_campaigns; audit_logs; outbox_events | Phase 6 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-CAM-004 | M07 Campaign | FR-CAM-01, FR-CAM-02, FR-CAM-03, FR-CAM-04, FR-CAM-05, FR-CAM-06, FR-CAM-07 | API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041 (+1) | UI-10, UI-11, UI-12, UI-13, UI-14 | campaign_participants | Phase 6 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-TOP-001 | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | topic_proposals; topic_decisions; campaign_topics; outbox_events; audit_logs | Phase 7 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-TOP-002 | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | topic_decisions; topic_proposals | Phase 7 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-TOP-003 | M08 Topic | FR-TOP-01, FR-TOP-02, FR-TOP-03, FR-TOP-04, FR-TOP-05 | API-043, API-044, API-045, API-046, API-047 | UI-15, UI-16, UI-17 | topic_proposals; topic_decisions; campaign_topics; project_registrations | Phase 7/8 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-PRJ-001 | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | project_registrations; projects; project_memberships; outbox_events; audit_logs | Phase 8 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-PRJ-002 | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | project_registrations; registration_members; campaign_participants | Phase 8 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-PRJ-003 | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | projects; project_memberships; tenant_memberships | Phase 9 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-PRJ-004 | M09 Project | FR-PRJ-01, FR-PRJ-02, FR-PRJ-03, FR-PRJ-04, FR-PRJ-05, FR-PRJ-06 | API-048, API-049, API-050, API-051, API-052, API-053, API-054 | UI-18, UI-19, UI-20 | supervision_assignments; academic_profiles; project_memberships | Phase 9 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-WRK-001 | M10 Work Progress | FR-WRK-01, FR-WRK-02, FR-WRK-03, FR-WRK-04 | API-055, API-056, API-057, API-058 | UI-21, UI-22 | project_milestones; progress_updates | Phase 9 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-DOC-001 | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | documents; upload_sessions; document_versions; object storage keys | Phase 10 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-DOC-002 | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | upload_sessions; document_versions | Phase 10 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-DOC-003 | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | document_versions; documents | Phase 10 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-DOC-004 | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | upload_sessions; document_versions; object storage | Phase 10 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-DOC-005 | M11 Documents | FR-DOC-01, FR-DOC-02, FR-DOC-03, FR-DOC-04, FR-DOC-05, FR-DOC-06, FR-DOC-07 | API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066 | UI-23, UI-24 | documents; document_versions; object storage access logs | Phase 10 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-SUB-001 | M11 Documents | N/A_JUSTIFIED | N/A_JUSTIFIED | N/A_JUSTIFIED: reliability/security/internal invariant | submissions; document_versions | Phase 11 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-SUB-002 | M11 Documents | N/A_JUSTIFIED | N/A_JUSTIFIED | N/A_JUSTIFIED: reliability/security/internal invariant | submissions; academic_campaigns | Phase 11 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | NEEDS_APPROVAL |
| INV-FB-001 | M12 Feedback | FR-FB-01, FR-FB-02, FR-FB-03 | API-067, API-068, API-069, API-070 | UI-25 | feedback_items; documents; document_versions; projects | Phase 11 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-REV-001 | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | rubrics; rubric_versions; rubric_criteria | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-REV-002 | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | review_assignments; submissions; rubric_versions | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-REV-003 | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | review_assignments; reviews | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-REV-004 | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | reviews; review_scores; rubric_criteria | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-REV-005 | M13 Review | FR-REV-01, FR-REV-02, FR-REV-03, FR-REV-04, FR-REV-05 | API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078 | UI-26, UI-27, UI-28 | review_scores; rubric_criteria; rubric_versions | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-EVA-001 | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluations; reviews; review_assignments; rubric_versions | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | NEEDS_APPROVAL |
| INV-EVA-002 | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluations; evaluation_amendments | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-EVA-003 | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluation_appeals; evaluations | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | NEEDS_APPROVAL |
| INV-EVA-004 | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluation_amendments; evaluations | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-EVA-005 | M14 Evaluation | FR-EVA-01, FR-EVA-02, FR-EVA-03, FR-EVA-04, FR-EVA-05 | API-079, API-080, API-081, API-082, API-083, API-084, API-085 | UI-29, UI-30, UI-31, UI-32 | evaluations; project_memberships | Phase 12 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | NEEDS_APPROVAL |
| INV-NOT-001 | M15 Communication/Notification | N/A_JUSTIFIED | N/A_JUSTIFIED | N/A_JUSTIFIED: reliability/security/internal invariant | notifications; outbox_events | Phase 13 | PLANNED; see P0-009 Test Evidence Matrix | NOT_IMPLEMENTED | SOURCE_ONLY |
| INV-AUD-001 | M16 Audit/Operations | FR-AUD-01, FR-AUD-02, FR-AUD-03 | API-088, API-089 | UI-34 | audit_logs; business table; outbox_events | Phase 13 hardening; applied earlier where critical | PLANNED; see P0-009 Test Evidence Matrix | PARTIALLY_ENFORCED | PARTIAL |
| INV-AUD-002 | M16 Audit/Operations | FR-AUD-01, FR-AUD-02, FR-AUD-03 | API-088, API-089 | UI-34 | audit_logs | Phase 13 | PLANNED; see P0-009 Test Evidence Matrix | PARTIALLY_ENFORCED | PARTIAL |
| INV-SRCH-001 | M17 Search | FR-SRCH-01, FR-SRCH-02 | API-090 | UI-35 | search_documents; search_chunks optional | After Phase 13 gate | PLANNED; see P0-009 Test Evidence Matrix | DEFERRED | OPTIONAL_GATE |
| INV-AI-001 | M18 AI/RAG | FR-AI-01, FR-AI-02, FR-AI-03 | API-091 | UI-36 | ai_assistance_runs optional; vector_embeddings deferred | After Phase 13 gate | PLANNED; see P0-009 Test Evidence Matrix | DEFERRED | OPTIONAL_GATE |

## Module and Phase Traceability

This section splits module-level and phase-level design traceability. Runtime evidence remains separate.

## Module Traceability Matrix

| Module | FR Count | API Count | UI Count | Core Table Count | Invariant Count | Primary Phase | Coverage Result | Notes |
|---|---:|---:|---:|---:|---:|---|---|---|
| M01 Platform/Foundation | 4 | 3 | 0 | 3 | 5 | Phase 1 | COMPLETE | Core traceability design-level |
| M02 Identity | 7 | 9 | 2 | 4 | 4 | Phase 2 | COMPLETE | Core traceability design-level |
| M03 Tenancy | 6 | 9 | 4 | 3 | 5 | Phase 3 | COMPLETE | Core traceability design-level |
| M04 Authorization | 7 | 6 | 1 | 5 | 5 | Phase 4 | COMPLETE | Core traceability design-level |
| M05/M06 Academic | 5 | 6 | 2 | 3 | 3 | Phase 5 | COMPLETE | Core traceability design-level |
| M07 Campaign | 7 | 9 | 5 | 4 | 4 | Phase 6 | COMPLETE | Core traceability design-level |
| M08 Topic | 5 | 5 | 3 | 3 | 3 | Phase 7 | COMPLETE | Core traceability design-level |
| M09 Project | 6 | 7 | 3 | 5 | 4 | Phase 8/9 | COMPLETE | Core traceability design-level |
| M10 Work Progress | 4 | 4 | 2 | 2 | 1 | Phase 9 | COMPLETE | CORE-MIN |
| M11 Documents | 7 | 8 | 2 | 4 | 5 | Phase 10/11 | COMPLETE | Core traceability design-level |
| M12 Feedback | 3 | 4 | 1 | 1 | 1 | Phase 11 | COMPLETE | Core traceability design-level |
| M13 Review | 5 | 8 | 3 | 6 | 5 | Phase 12 | COMPLETE | Core traceability design-level |
| M14 Evaluation | 5 | 7 | 4 | 3 | 5 | Phase 12 | COMPLETE | Core traceability design-level |
| M15 Communication/Notification | 2 | 2 | 1 | 1 | 0 | Phase 13 | PARTIAL | CORE-MIN |
| M16 Audit/Operations | 3 | 2 | 1 | 1 | 2 | Phase 13 | COMPLETE | CORE-MIN |
| M17 Search | 2 | 1 | 1 | 0 | 1 | After Phase 13 gate | OPTIONAL_GATE | Optional after Phase 13 gate |
| M18 AI/RAG | 3 | 1 | 1 | 0 | 1 | After Phase 13 gate | OPTIONAL_GATE | Optional after Phase 13 gate |

## Phase Traceability Matrix

| Phase | Lead Modules | FR | APIs | UI | Tables/Capabilities | Invariants | Required Tests/Evidence | Handoff | Coverage Result |
|---|---|---|---|---|---|---|---|---|---|
| Phase 0 | P0 artifacts | P0 docs only | P0 docs | No runtime tables | Source hierarchy/scope/stack/module/data/dependency/db/invariant/traceability | Review docs, validation checklist | P0-011 ADR | COMPLETE |
| Phase 1 | M01/M16 minimum | FR-FND-* | API-001..003 | Foundation shell | idempotency/outbox/config/audit minimum | unit/API/readiness evidence | Phase 2 account foundation | PARTIAL_RUNTIME |
| Phase 2 | M02 | FR-ID-* | Identity APIs | UI-01..02 | accounts/credentials/tokens/sessions | auth/session/security tests | Phase 3 tenancy | SOURCE_ONLY_WITH_RUNTIME_MISMATCH |
| Phase 3 | M03 | FR-TEN-* | Tenancy APIs | UI-03..06 | organizations/memberships/invitations | tenant isolation tests | Phase 4 auth | SOURCE_ONLY |
| Phase 4 | M04 | FR-AUTH-* | Authorization APIs | UI-07 | roles/permissions/assignments/scopes | deny/IDOR/scope tests | Phase 5 academic | SOURCE_ONLY_WITH_RUNTIME_MISMATCH |
| Phase 5 | M05/M06 | FR-ACD-* | Academic APIs | UI-08..09 | academic_units/profiles/placements | hierarchy/placement tests | Phase 6 campaign | SOURCE_ONLY |
| Phase 6 | M07 | FR-CAM-* | Campaign APIs | UI-10..14 | campaign templates/versions/campaigns/participants | version/state tests | Phase 7 topic | SOURCE_ONLY |
| Phase 7 | M08 | FR-TOP-* | Topic APIs | UI-15..17 | topic proposals/decisions/campaign_topics | approval idempotency tests | Phase 8 project | SOURCE_ONLY |
| Phase 8 | M09 | FR-PRJ-01..03 | Registration APIs | UI-18..19 | registrations/members/projects | one project/concurrency tests | Phase 9 project ops | SOURCE_ONLY |
| Phase 9 | M09/M10 | FR-PRJ-04..06; FR-WRK-* | Project/progress APIs | UI-20..22 | project_memberships/supervision/milestones/progress | relationship/progress tests | Phase 10 docs | SOURCE_ONLY |
| Phase 10 | M11 | FR-DOC upload/version | Document upload APIs | UI-23 | documents/upload_sessions/document_versions | upload/object/version tests | Phase 11 submission/feedback | SOURCE_ONLY |
| Phase 11 | M11/M12 | FR-DOC submission; FR-FB-* | Submission/feedback APIs | UI-24..25 | submissions/feedback_items | pinning/target tests | Phase 12 review/eval | SOURCE_ONLY |
| Phase 12 | M13/M14 | FR-REV-*; FR-EVA-* | Review/evaluation APIs | UI-26..32 | rubrics/reviews/evaluations/appeals/amendments | review/eval/amendment tests | Phase 13 hardening | SOURCE_ONLY_NEEDS_APPROVAL |
| Phase 13 | M15/M16 | FR-COM-*; FR-AUD-* | Notification/audit APIs | UI-33..34 | notifications/audit_logs | E2E/audit/outbox evidence | Search/AI gate | PARTIAL_RUNTIME |
| After Phase 13 gate | M17/M18 | FR-SRCH-*; FR-AI-* | Search/AI APIs | UI-35..36 | optional/deferred search/AI tables | permission-aware Search/AI evidence | Future roadmap | OPTIONAL_GATE |

## Permission and Authorization Traceability

| Capability/FR | Actor | Permission | Scope | Relationship | State Guard | Related API | Related UI | Test Evidence | Result |
|---|---|---|---|---|---|---|---|---|---|
| Platform Admin | Platform organization lifecycle | platform.organization.* | platform | organization root | active platform/admin state | Tenancy org APIs | UI-04 | privilege escalation tests | PARTIAL |
| Organization Admin | Tenant settings/member/roles | organization.* / membership.* / role.* | tenant | organization membership | active membership | Tenancy/Auth APIs | UI-05..07 | role/scope tests | SOURCE_ONLY |
| Coordinator | Campaign/topic/project/evaluation operations | campaign/topic/project/evaluation scoped | tenant/campaign/project | coordinator relationship | state guard per flow | Campaign/Topic/Project/Evaluation APIs | UI-10..14, UI-16, UI-19..20, UI-29..30 | state/relationship tests | SOURCE_ONLY |
| Student | proposal/register/submit/appeal | topic.create / registration.create / submission.create / appeal.create | tenant/project | participant/project member | deadline/state | Topic/Registration/Submission/Appeal APIs | UI-15, UI-18, UI-24, UI-31 | cross-tenant/IDOR tests | SOURCE_ONLY |
| Supervisor | project feedback/progress review | project.supervise / feedback.create | project | supervisor assignment | active supervision | Project/Feedback APIs | UI-21..25 | relationship tests | SOURCE_ONLY |
| Reviewer | assigned review | review.assigned | assignment/project | review_assignment | draft/submitted/locked | Review APIs | UI-27..28 | assignment ownership tests | SOURCE_ONLY |
| Auditor | audit timeline | audit.view scoped | tenant/resource | audit scope | resource/time filters | Audit APIs | UI-34 | audit redaction/access tests | PARTIAL_RUNTIME |
| Authenticated self | me/session/membership list | authenticated self | session | self account/membership | active session | Identity/Tenancy self APIs | UI-03 | self-access tests | PARTIAL_RUNTIME |
| Public routes | health/register/login/reset | public/public token | none | none | rate/token state | Public APIs | UI-01..02 | safe error/rate tests | PARTIAL_RUNTIME |

## Error Traceability Direction

| FR/API | Invariant Violation | Expected Error Category | UI Error State | P0-012 Handoff |
|---|---|---|---|---|
| Identity auth APIs | credential/token/session invalid | UNAUTHENTICATED/VALIDATION/CONFLICT | safe login/reset error | P0-012 locks code/envelope |
| Tenant/context APIs | no active membership or wrong tenant | FORBIDDEN/TENANT_CONTEXT_INVALID | hidden/forbidden state | P0-012 |
| Authorization protected APIs | scope/relationship/state missing | FORBIDDEN/NOT_FOUND_OR_HIDDEN | deny action, no sensitive existence leak | P0-012 |
| Approval/finalize APIs | bad state/policy not met | INVALID_STATE/POLICY_NOT_SATISFIED/CONCURRENCY_CONFLICT | state conflict banner | P0-012 |
| Idempotent commands | same key different payload | IDEMPOTENCY_CONFLICT | safe retry/conflict message | P0-012 |
| Version-pinned flows | mutable target attempt | TARGET_IMMUTABLE/VERSION_CONFLICT | show official version target | P0-012 |
| Deadline flows | deadline expired or policy unknown | DEADLINE_VIOLATION/POLICY_NOT_SATISFIED | deadline error state | P0-012 |
| Internal/platform errors | unexpected server error | INTERNAL | generic safe error with correlation ID | P0-012 |

## Test and Evidence Traceability

| FR/Invariant | Unit | Integration | API | Security | File | Reliability | E2E | Planned Artifact | Execution Status |
|---|---|---|---|---|---|---|---|---|---|
| migration PostgreSQL thật | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| FK/unique/check | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| transaction rollback | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| concurrent approval | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| idempotency replay | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | TEST_SOURCE_OBSERVED |
| cross-tenant deny | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| IDOR | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| privilege escalation | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| hierarchy cycle | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| placement overlap | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| template/rubric immutability | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| upload MIME/size/expiry/checksum/replay | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| download reauthorization | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| V2 không thay Submission V1 | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| feedback exact target | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| submitted Review immutable | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| score version/range | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| quorum/COI | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | NEEDS_APPROVAL |
| double finalize | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| Appeal | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | NEEDS_APPROVAL |
| Amendment | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| outbox retry | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| duplicate delivery | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| worker crash | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |
| audit redaction | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | TEST_SOURCE_OBSERVED |
| full THESIS E2E | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | PLANNED | Evidence plan P0-013 / implementation phase | PLANNED |

## Runtime Artifact Traceability

| Runtime Artifact | Source Mapping | Catalog Type | Runtime Status | Finding |
|---|---|---|---|---|
| GET `/health` | SOURCE_AND_RUNTIME_ALIGNED | API | SOURCE_AND_RUNTIME_ALIGNED | healthRouter registered in app.ts |
| GET `/ready` | SOURCE_AND_RUNTIME_ALIGNED | API | SOURCE_AND_RUNTIME_ALIGNED | app.get /ready |
| GET `/api/v1/meta` | SOURCE_AND_RUNTIME_ALIGNED | API | SOURCE_AND_RUNTIME_ALIGNED | app.get /api/v1/meta |
| GET `/__test/error` | RUNTIME_ONLY | API | RUNTIME_ONLY | test-only route under NODE_ENV=test |
| `apps/web/src/app/page.tsx` | SOURCE_ONLY/PARTIAL | UI | PARTIAL | Foundation shell/health card; not part of UI catalog 36 except Phase 1 shell note |
| `apps/web/src/features/health/HealthStatus.tsx` | SOURCE_ONLY/PARTIAL | UI | PARTIAL | Health status component |
| `apps/web/src/lib/apiClient.ts` | N/A_JUSTIFIED | UI | ALIGNED_ARTIFACT | Frontend client only |
| `system_info` | runtime-only/name mismatch | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `system_configurations` | DB manifest row | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `idempotency_records` | DB manifest row | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `outbox_events` | DB manifest row | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `tenants` | runtime-only/name mismatch | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `users` | runtime-only/name mismatch | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `roles` | DB manifest row | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `permissions` | DB manifest row | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `role_permissions` | DB manifest row | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `user_roles` | runtime-only/name mismatch | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `refresh_tokens` | runtime-only/name mismatch | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |
| `audit_logs` | DB manifest row | DB | ARTIFACT_OBSERVED | See P0-008 F-DB findings |

## Critical Vertical Slice Traceability

| Step | User Flow | FR | API | UI | Tables | Invariants | Actor | Phase | Required Evidence | Coverage |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Organization và academic structure | FR-TEN-*; FR-ACD-* | Tenancy/Academic APIs | UI-04..09 | organizations, memberships, academic_units/profiles/placements | INV-TEN-*; INV-ACD-* | Platform/Org/Academic Admin | Phase 3/5 | tenant/hierarchy/placement tests | SOURCE_ONLY |
| 2 | Account, membership, role và scope | FR-ID-*; FR-TEN-*; FR-AUTH-* | Identity/Tenancy/Auth APIs | UI-01..07 | accounts/sessions/memberships/roles/scopes | INV-ID-*; INV-TEN-*; INV-AUTH-* | Public/Auth/Admin | Phase 2–4 | auth/tenant/scope tests | PARTIAL_RUNTIME |
| 3 | Campaign template/version và lifecycle | FR-CAM-* | Campaign APIs | UI-10..14 | campaign_templates, versions, campaigns, participants | INV-CAM-* | Coordinator | Phase 6 | immutability/state tests | SOURCE_ONLY |
| 4 | Topic proposal/request changes/approval | FR-TOP-* | Topic APIs | UI-15..17 | topic_proposals, decisions, campaign_topics | INV-TOP-* | Student/Lecturer/Coordinator | Phase 7 | idempotent approval tests | SOURCE_ONLY |
| 5 | Registration và idempotent Project creation | FR-PRJ-01..03 | Registration APIs | UI-18..19 | registrations, registration_members, projects | INV-PRJ-001..002 | Student/Coordinator | Phase 8 | concurrent approval tests | SOURCE_ONLY |
| 6 | Project membership/supervision/milestone | FR-PRJ-04..06; FR-WRK-* | Project/Progress APIs | UI-20..22 | project_memberships, supervision, milestones, progress | INV-PRJ-003..004; INV-WRK-001 | Coordinator/Supervisor/Student | Phase 9 | relationship/progress evidence | SOURCE_ONLY |
| 7 | Direct upload và immutable DocumentVersion | FR-DOC-01..04 | Document/upload APIs | UI-23 | documents, upload_sessions, document_versions | INV-DOC-* | Project member | Phase 10 | upload/object tests | SOURCE_ONLY |
| 8 | Submission pin DocumentVersion | FR-DOC-05..07 | Submission APIs | UI-24 | submissions, document_versions | INV-SUB-* | Student/project member | Phase 11 | version pin tests | SOURCE_ONLY |
| 9 | Feedback/revision đúng target | FR-FB-* | Feedback APIs | UI-25 | feedback_items | INV-FB-001 | Supervisor/Reviewer/Student | Phase 11 | target visibility tests | SOURCE_ONLY |
| 10 | ReviewAssignment pin Submission và RubricVersion | FR-REV-* | Review APIs | UI-26..28 | rubrics, rubric_versions, review_assignments, reviews, scores | INV-REV-* | Reviewer/Coordinator | Phase 12 | pin/rubric tests | SOURCE_ONLY |
| 11 | Evaluation finalize theo guard | FR-EVA-01..04 | Evaluation APIs | UI-29..30 | evaluations | INV-EVA-001..002 | Coordinator/Committee | Phase 12 | quorum/finalize tests | NEEDS_APPROVAL |
| 12 | Appeal/Amendment | FR-EVA-05..06 | Appeal/amendment APIs | UI-31..32 | evaluation_appeals, amendments | INV-EVA-003..004 | Student/Coordinator/Committee | Phase 12 | appeal/amendment tests | NEEDS_APPROVAL |
| 13 | Notification, audit timeline và cross-tenant deny | FR-COM-*; FR-AUD-*; auth/security FR | Notification/Audit APIs | UI-33..34 | notifications, audit_logs, all tenant tables | INV-NOT-001; INV-AUD-*; INV-TEN-004 | All/Auditor | Phase 13 | E2E/cross-tenant/audit evidence | PARTIAL_RUNTIME |

## Orphan and Missing Link Register
### Orphan Requirements

| Orphan ID | Artifact | Missing Link | Severity | Recommended Resolution | Resolution Phase | Status |
|---|---|---|---|---|---|---|
| OR-FR-001 | No orphan FR | All FR have owner/phase; some exact API/UI links are module-level PARTIAL | INFORMATIONAL | P0-010 findings | P0-010 | ACCEPTED_BASELINE |

### Orphan APIs

| Orphan ID | Artifact | Missing Link | Severity | Recommended Resolution | Resolution Phase | Status |
|---|---|---|---|---|---|---|
| OR-API-001 | `GET /__test/error` | No source API catalog row; test-only runtime route | LOW | Keep test-only; ensure not production docs API | P0-017 | NON_BLOCKING |

### Orphan UIs

| Orphan ID | Artifact | Missing Link | Severity | Recommended Resolution | Resolution Phase | Status |
|---|---|---|---|---|---|---|
| OR-UI-001 | Foundation health shell | No exact UI catalog ID in 36 UI flows | LOW | Treat as Phase 1 shell/runtime artifact; do not add UI catalog row silently | P0-017 | NON_BLOCKING |

### Orphan Tables

| Orphan ID | Artifact | Missing Link | Severity | Recommended Resolution | Resolution Phase | Status |
|---|---|---|---|---|---|---|
| OR-DB-001 | `system_info`, `users`, `tenants`, `user_roles`, `refresh_tokens` | Runtime-only/name mismatch vs manifest | MEDIUM/HIGH | Use P0-008 F-DB findings; no manifest change without approval | P0-017 | OPEN |

### Orphan Invariants

| Orphan ID | Artifact | Missing Link | Severity | Recommended Resolution | Resolution Phase | Status |
|---|---|---|---|---|---|---|
| OR-INV-001 | No orphan invariant | All 57 invariants have owner/phase/test direction; FR/API/UI links often module-level PARTIAL | INFORMATIONAL | P0-010/P0-013 evidence plan | P0-013 | ACCEPTED_BASELINE |

### Runtime-Only Artifacts

| Orphan ID | Artifact | Missing Link | Severity | Recommended Resolution | Resolution Phase | Status |
|---|---|---|---|---|---|---|
| OR-RUN-001 | Pre-existing runtime/API/web/Prisma/worker | Runtime exists before Phase 0 sign-off | MEDIUM | Audit at P0-017; do not treat as phase evidence | P0-017 | OPEN |

## Missing Link Register

| Finding ID | Source Artifact | Missing Target | Expected Link | Severity | Blocks P0-010? | Blocks Which Phase? | Status |
|---|---|---|---|---|---|---|---|
| TL-001 | Functional Requirements | Exact per-FR API/UI/table/test evidence | Exact mapping, not just module-level grouping | MEDIUM | No | Implementation/P0-013 | OPEN |
| TL-002 | Runtime API | Auth/domain source routes | 91 source APIs expected later | INFORMATIONAL | No | Phase 2–13 | SOURCE_ONLY |
| TL-003 | Runtime UI | 36 source UI flows | UI catalog expected later; only foundation shell exists | INFORMATIONAL | No | Phase 2–13 | SOURCE_ONLY |
| TL-004 | Runtime DB | Source manifest names vs Prisma names | P0-008 aligned source names | HIGH | No | P0-017 | OPEN |
| TL-005 | Tests/Evidence | Execution evidence | No EXECUTED_PASS without logs | MEDIUM | No | P0-013/implementation | OPEN |
| TL-006 | Open policies | Appeal/deadline/rubric/quorum/COI/class/cohort | Approved policy baseline | MEDIUM | No | Phase 5/10/12/13 | NEEDS_APPROVAL |

## Findings Register

| Finding ID | Category | Severity | Source | Observed | Expected | Impact | Resolution Phase | Status |
|---|---|---|---|---|---|---|---|---|
| TR-001 | COUNT | INFORMATIONAL | DOCX catalogs | All canonical counts match expected | 81 FR, 91 API, 36 UI, 77 DB, 57 INV | Design audit can continue | P0-010 | ACCEPTED_BASELINE |
| TR-002 | REQUIREMENT | MEDIUM | FR catalog | Full FR rows have module-level mappings; exact per-FR API/UI mapping needs future refinement | Exact implementation route/UI evidence | P0-013/P0-017 evidence planning | P0-013/P0-017 | OPEN |
| TR-003 | RUNTIME_ONLY | LOW | API runtime | `/__test/error` exists test-only | No source public API | Do not expose as catalog API | P0-017 | NON_BLOCKING |
| TR-004 | RUNTIME_ONLY | LOW | UI runtime | Foundation health shell not part of 36 UI catalog | Phase 1 shell only | Not product UI proof | P0-017 | NON_BLOCKING |
| TR-005 | DATABASE | HIGH | P0-008 | `users.tenant_id` and runtime schema mismatches | Global Account + TenantMembership source model | Implementation alignment required | P0-017 | OPEN |
| TR-006 | TEST | MEDIUM | runtime tests | Only foundation tests observed; no catalog execution evidence | Executed logs/reports required | Evidence plan needed | P0-013 | OPEN |
| TR-007 | OPEN_DECISION | MEDIUM | OD-002..OD-009 | Policy/gates not approved | Tracked NEEDS_APPROVAL | Implementation phases may block | Phase 5/10/12/13 | NEEDS_APPROVAL |

## Open Decisions Impact

| Open Decision | Affected FR | APIs | UI | Tables | Invariants | Phase | Current Baseline | Traceability Status |
|---|---|---|---|---|---|---|---|---|
| OD-001 Graduation slice | THESIS E2E FR groups | core workflow APIs | UI-01..34 | 48 CORE | INV-FND..INV-AUD | Phase 1–13 | THESIS vertical slice baseline | NEEDS_APPROVAL |
| OD-002 Class/Cohort | FR-ACD-* | Academic APIs | UI-08/09 | academic_cohorts/classes optional | INV-ACD-* | Phase 5 | OPTIONAL | NEEDS_APPROVAL |
| OD-003 Appeal/deadline | FR-DOC/EVA | Submission/appeal APIs | UI-24/31/32 | submissions/evaluation_appeals | INV-SUB-002; INV-EVA-* | Phase 11/12 | policy open | NEEDS_APPROVAL |
| OD-004 File scanning | FR-DOC-* | Upload APIs | UI-23 | document_processing_jobs/malware_scan_results optional | INV-DOC-* | Phase 10 | manual/deferred unless toolchain | NEEDS_APPROVAL |
| OD-005 Rubric policy | FR-REV/EVA | Rubric/review APIs | UI-26..29 | rubric* | INV-REV-*; INV-EVA-001 | Phase 12 | version pinning locked; policy detail open | NEEDS_APPROVAL |
| OD-006 Quorum | FR-EVA-01 | Finalize API | UI-29 | evaluations | INV-EVA-001 | Phase 12 | open | NEEDS_APPROVAL |
| OD-007 Conflict-of-interest | FR-REV/EVA | assignment/finalize APIs | UI-27..29 | review_assignments/evaluations | INV-EVA-001 | Phase 12 | open | NEEDS_APPROVAL |
| OD-008 Search gate | FR-SRCH-* | GET /api/v1/search | UI-35 | search_documents/search_chunks optional | INV-SRCH-001 | After Phase 13 | optional gate | NEEDS_APPROVAL |
| OD-009 AI/RAG gate | FR-AI-* | POST /api/v1/ai/checklists | UI-36 | ai_assistance_runs optional/vector deferred | INV-AI-001 | After Phase 13 | optional gate | NEEDS_APPROVAL |
| OD-010 School/student/advisor information | Demo/evidence FR | N/A | demo UI labels | seed/demo data | N/A | P0-016/P0-018 | missing info | NEEDS_APPROVAL |

## Coverage Summary

| Dimension | Total | Complete | Partial | Missing | N/A Justified | Needs Approval | Deferred/Optional | Coverage Notes |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| FR → Module | 81 | 81 | 0 | 0 | 0 | 0 | 0 | Owner inferred from source ID/module groups. |
| FR → Phase | 81 | 81 | 0 | 0 | 0 | 0 | 0 | Phase by roadmap group. |
| FR → API | 81 | 0 | 81 | 0 | 0 | 0 | 0 | Module-level link; exact per-FR route needs P0-013/implementation refinement. |
| FR → UI | 81 | 0 | 70 | 0 | 11 | 0 | 0 | Internal/security/reliability FR can be N/A_JUSTIFIED. |
| FR → Database | 81 | 0 | 81 | 0 | 0 | 0 | 0 | Module table group link; exact rows defer to implementation trace. |
| FR → Invariant | 81 | 0 | 81 | 0 | 0 | 0 | 0 | Module/invariant group link. |
| FR → Test | 81 | 0 | 81 | 0 | 0 | 0 | 0 | Planned evidence only. |
| API → FR | 91 | 0 | 91 | 0 | 0 | 0 | 0 | Module-level primary/supporting FR assigned. |
| API → Permission | 91 | 91 | 0 | 0 | 0 | 0 | 0 | Source API catalog has Auth/Permission field. |
| API → UI | 91 | 0 | 80 | 0 | 11 | 0 | 0 | Internal/health/admin API N/A where justified. |
| UI → FR | 36 | 0 | 36 | 0 | 0 | 0 | 0 | UI mapped to module FR groups. |
| UI → API | 36 | 0 | 36 | 0 | 0 | 0 | 0 | UI mapped to module API groups. |
| Table → Owner | 77 | 77 | 0 | 0 | 0 | 0 | 0 | P0-008 owner audit. |
| Table → FR | 77 | 0 | 77 | 0 | 0 | 0 | 0 | Module-level FR groups. |
| Invariant → FR | 57 | 0 | 57 | 0 | 0 | 0 | 0 | Module-level FR groups. |
| Invariant → Test | 57 | 0 | 57 | 0 | 0 | 0 | 0 | Planned/observed test source only. |
| Phase → Evidence | 14 | 0 | 14 | 0 | 0 | 0 | 0 | Evidence directions only; no implementation proof. |

## Runtime Alignment Summary

### Design Traceability Result

- COMPLETE_WITH_FINDINGS: canonical counts match and all catalogs are represented, but many exact links are PARTIAL at design level because source catalogs do not provide an exhaustive FR↔API↔UI row-by-row matrix.

### Runtime Traceability Result

- PRE_EXISTING_PARTIAL_RUNTIME: only foundation health/meta/readiness, shell UI, Prisma partial schema, worker outbox and foundation tests observed.
- SOURCE_ONLY_MAJORITY: most 91 APIs, 36 UI flows, 77 DB capabilities and 57 invariants are not implemented yet; this is expected before implementation phases.
- RUNTIME_MISMATCHES_FOUND: runtime schema/auth coupling findings from P0-008/P0-009 remain open for P0-017.
- NOT_IMPLEMENTED: no claim that 91 APIs, 36 UIs or 77 DB capabilities have been implemented.

## Handoff to P0-011

| ADR | Traceability Findings Used | Affected Modules | Affected FR/API/UI | Required Clarification |
|---|---|---|---|---|
| ADR-001 modular monolith first | Module/phase/dependency traceability; runtime partial monolith | M01–M18 | all module FR/API/UI | Clarify module contract enforcement. |
| ADR-002 express typescript | Runtime API/router inspection | M01/M02+ | API catalog | Keep Express not NestJS. |
| ADR-003 postgresql prisma | DB manifest/runtime mismatch | M01–M16 | DB/API all phases | Clarify Prisma/source schema alignment later. |
| ADR-004 global account tenancy | INV-ID/TEN and F-DB-003 | M02/M03 | Identity/Tenancy APIs/UI | Address `users.tenant_id` mismatch. |
| ADR-005 authorization | Permission traceability | M04 + domain modules | protected APIs/UI | Deny-by-default and resource context split. |
| ADR-006 transactional outbox | INV-FND-001; worker audit | M01/M15/M16 | critical mutation APIs | Outbox not audit. |
| ADR-007 idempotency | critical POST/finalize/complete mappings | M01 + business modules | approval/finalize/upload APIs | Scoped key/hash strategy. |
| ADR-008 direct upload | Document traceability | M11 | upload UI/API | MinIO/S3 evidence later. |
| ADR-009 version pinning | submission/review/rubric/evaluation mappings | M07/M11/M13/M14 | version-sensitive UI/API | Immutable target behavior. |
| ADR-010 worker boundary | worker SQL/runtime finding | M01/M15/M11 | worker/internal flows | Worker process not microservice. |
| ADR-011 search ai deferred | OD-008/009 traceability | M17/M18 | Search/AI FR/API/UI | Optional gate only. |
| ADR-012 scope separation | FR/API/UI/DB optional/deferred classification | all modules | all catalogs | Product/Core/Demo/Deferred separation. |

## Handoff to P0-012 and P0-013

### P0-012 Error Contract needs
- invariant violation categories from Error Traceability Direction;
- routes with conflict/state/version/idempotency/deadline/policy errors;
- safe not-found/forbidden direction;
- UI error states;
- correlation/request ID direction;
- do not leak existence or secrets.

### P0-013 Evidence Plan needs
- FR/invariant gaps with only PLANNED evidence;
- required test reports and command logs;
- migration/constraint evidence against real PostgreSQL;
- API examples and safe error examples;
- UI screenshots for role/state/version-sensitive flows;
- THESIS E2E script/report;
- tenant isolation/IDOR/permission report;
- direct upload evidence;
- review/evaluation/amendment evidence;
- audit/outbox/worker reliability evidence.

## Change Control

| Change ID | Artifact | Current Mapping | Proposed Mapping | Requirement Impact | API/UI Impact | DB Impact | Phase Impact | Test Impact | Approval Status |
|---|---|---|---|---|---|---|---|---|---|
| TRACE-CHG-TEMPLATE | FR/API/UI/DB/Invariant | Current trace link | Proposed trace link | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | None/Low/Medium/High | NEEDS_APPROVAL |
| TRACE-CHG-001 | Runtime schema | `users` runtime-only/name mismatch | Treat as `accounts` | High | Medium | High | Phase 2/3 | High | NEEDS_APPROVAL |
| TRACE-CHG-002 | Search/AI | OPTIONAL_GATE | Promote to core | High | High | High | Phase 13+ | High | NEEDS_APPROVAL |

## Validation Checklist

| Check | Result | Evidence |
|---|---|---|
| Extracted đúng 81 FR | PASS | This artifact and validation commands |
| Reconcile 65 MUST, 11 SHOULD, 5 COULD | PASS | This artifact and validation commands |
| Extracted đúng 91 API route | PASS | This artifact and validation commands |
| Extracted đúng 36 UI flow | PASS | This artifact and validation commands |
| Reconcile đủ 77 database capability | PASS | This artifact and validation commands |
| Reconcile đủ 57 invariant | PASS | This artifact and validation commands |
| Có đủ M01–M18 | PASS | This artifact and validation commands |
| Có đủ Phase 0–13 | PASS | This artifact and validation commands |
| Có full FR matrix | PASS | This artifact and validation commands |
| Có full API matrix | PASS | This artifact and validation commands |
| Có full UI matrix | PASS | This artifact and validation commands |
| Có full database traceability | PASS | This artifact and validation commands |
| Có full invariant traceability | PASS | This artifact and validation commands |
| Có module matrix | PASS | This artifact and validation commands |
| Có phase matrix | PASS | This artifact and validation commands |
| Có permission traceability | PASS | This artifact and validation commands |
| Có error direction handoff | PASS | This artifact and validation commands |
| Có test/evidence traceability | PASS | This artifact and validation commands |
| Có vertical slice traceability | PASS | This artifact and validation commands |
| Có orphan register | PASS | This artifact and validation commands |
| Có missing-link register | PASS | This artifact and validation commands |
| Có findings register | PASS | This artifact and validation commands |
| Có Open Decisions impact | PASS | This artifact and validation commands |
| Có coverage summary | PASS | This artifact and validation commands |
| Có runtime alignment summary | PASS | This artifact and validation commands |
| Có handoff P0-011 | PASS | This artifact and validation commands |
| Có handoff P0-012/P0-013 | PASS | This artifact and validation commands |
| N/A đều có justification | PASS | This artifact and validation commands |
| Không tự tạo missing requirement/API/UI | PASS | This artifact and validation commands |
| Không tự approve Open Decisions | PASS | This artifact and validation commands |
| Không ghi executed test nếu không có evidence | PASS | This artifact and validation commands |
| Không sửa runtime | PASS | This artifact and validation commands |
| Không tạo ADR | PASS | This artifact and validation commands |
| Không tạo P0-011 artifact | PASS | This artifact and validation commands |
| Không tuyên bố Phase 0 DONE | PASS | This artifact and validation commands |
| Không đánh dấu Phase 1 IN_PROGRESS | PASS | This artifact and validation commands |
| Có Source References | PASS | This artifact and validation commands |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — Functional Requirements Catalog table 36.
- `docs/BaoCaoKhoaLuan.docx` — API Catalog V1.1 table 37.
- `docs/BaoCaoKhoaLuan.docx` — UI Catalog V1.1 table 38.
- `docs/BaoCaoKhoaLuan.docx` — Permission Matrix and API principles.
- `docs/BaoCaoKhoaLuan.docx` — Error states trọng yếu and traceability matrix table 53.
- `docs/BaoCaoKhoaLuan.docx` — Database Capability Manifest table 34.
- `docs/BaoCaoKhoaLuan.docx` — Roadmap Phase 0–13 and test/evidence strategy.
- `docs/phase-0/SOURCE_HIERARCHY.md` — source/evidence priority.
- `docs/phase-0/SCOPE_FREEZE.md` — scope and optional/deferred baseline.
- `docs/phase-0/STACK_LOCK.md` — stack/runtime topology rules.
- `docs/phase-0/MODULE_BOUNDARIES.md` — module owner/data ownership.
- `docs/phase-0/MODULE_DEPENDENCIES.md` — dependency/runtime findings.
- `docs/phase-0/DATABASE_MANIFEST_AUDIT.md` — DB counts/runtime mismatches.
- `docs/phase-0/BUSINESS_INVARIANTS.md` — 57 invariant baseline.
