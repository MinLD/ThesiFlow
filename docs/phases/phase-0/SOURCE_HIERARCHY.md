# Source Hierarchy

## Purpose

Thiết lập thứ tự ưu tiên nguồn cho Phase 0 của Academic Project Lifecycle Platform (APLP), để các phiên làm việc sau đọc cùng một source of truth, phân biệt rõ thiết kế với bằng chứng triển khai, và xử lý mismatch mà không tự ý sửa báo cáo gốc.

## Status

DONE for P0-002 — Source Hierarchy.

Chỉ P0-002 được hoàn tất trong file này. Tổng thể phase vẫn IN_PROGRESS và chưa có sign-off.

## Last Updated

2026-07-28 08:36 Asia/Ho_Chi_Minh

## Source of Truth

`docs/BaoCaoKhoaLuan.docx` là source of truth chính thức trong repository.

Tên `BaoCaoKhoaLuan(4).docx` chỉ là tên file upload trước đây, không phải tên bắt buộc trong repository. Mọi phiên sau phải tham chiếu source thực tế bằng đường dẫn `docs/BaoCaoKhoaLuan.docx`.

## Source Hierarchy

| Priority | Source | Role | Rule |
|---|---|---|---|
| 1 | `docs/BaoCaoKhoaLuan.docx` | Source of truth chính | Quyết định scope, architecture, module, database catalog, FR/API/UI, roadmap, test/evidence strategy |
| 2 | Detailed sections inside `docs/BaoCaoKhoaLuan.docx` | Specification detail | Detailed specification thắng overview khi có khác biệt |
| 3 | Catalogs inside `docs/BaoCaoKhoaLuan.docx` | Cross-check sources | Database Manifest, FR Catalog, API Catalog, UI Catalog và Roadmap phải được đối chiếu cùng nhau, không đọc tách rời |
| 4 | `docs/phase-0/*` | Derived Phase 0 artifacts | Chỉ diễn giải, đóng băng, audit hoặc handoff từ source of truth; không được mở rộng scope |
| 5 | Repository runtime artifacts | Implementation evidence candidate | Chỉ chứng minh đã triển khai khi artifact tồn tại và đã được kiểm tra bằng validation phù hợp |
| 6 | Future auxiliary docs | Supporting context | Chỉ dùng khi được ghi trong status hoặc được owner xác nhận; không được vượt source of truth |

## Quy Tắc Ưu Tiên Khi Các Phần Trong Tài Liệu Mâu Thuẫn

1. Detailed specification thắng executive summary, overview hoặc bảng tóm tắt.
2. Phase detail thắng roadmap summary khi xác định done criteria hoặc forbidden scope của phase.
3. Database Manifest, FR Catalog, API Catalog, UI Catalog và Roadmap phải được reconcile cùng nhau; nếu một phần thiếu hoặc lệch, ghi vào audit thay vì tự chọn im lặng.
4. Business invariants thắng convenience implementation; code hiện có không tự động thay đổi invariant đã khóa.
5. Deferred Roadmap không được đưa vào Core Implementation nếu chưa có approval hoặc adoption trigger.
6. Khi source of truth mâu thuẫn nội bộ, không sửa `docs/BaoCaoKhoaLuan.docx`; tạo mục trong audit hoặc `OPEN_DECISIONS.md`.

## Quy Tắc Phân Biệt Design Artifact Và Implementation Evidence

| Loại | Ví dụ | Được dùng để chứng minh |
|---|---|---|
| Design artifact | `docs/BaoCaoKhoaLuan.docx`, `docs/phase-0/*.md`, ADR | Quyết định thiết kế, scope, boundary, roadmap, rule |
| Implementation artifact | Source code, Prisma schema, migration, Dockerfile, test, build output | Việc đã triển khai khi artifact tồn tại và đã được kiểm tra |
| Evidence artifact | Test report, migration output, screenshot, generated OpenAPI, inspection log | Việc đã chạy/được xác minh tại thời điểm cụ thể |

Quy tắc bắt buộc:

- Repository artifact chỉ chứng minh đã triển khai khi artifact tồn tại và đã được kiểm tra.
- Code hiện có không tự động thay đổi kiến trúc hoặc scope đã khóa.
- Runtime code tồn tại trước Phase 0 được giữ nguyên và ghi nhận là pre-existing implementation artifact cần audit ở P0-017.
- Không tuyên bố migration, test, benchmark, pilot hoặc deployment đã hoàn tất nếu chưa có artifact kiểm chứng.
- Không dùng design artifact để thay thế implementation evidence.

## Quy Tắc Xử Lý File Hoặc Tài Liệu Phụ Trong Tương Lai

1. Ghi mọi tài liệu phụ vào `docs/PROJECT_STATUS.md` trước khi dùng làm evidence.
2. Phân loại tài liệu phụ là source, derived artifact, evidence hoặc note.
3. Nếu tài liệu phụ mâu thuẫn với `docs/BaoCaoKhoaLuan.docx`, ưu tiên source of truth và ghi mismatch vào audit/open decision.
4. Không đổi Product Scope, Implementation Scope, Demo Scope hoặc Deferred Roadmap chỉ vì có code hoặc tài liệu phụ mới.
5. Không sửa source of truth trực tiếp khi phát hiện mismatch; tạo audit entry hoặc open decision.
6. File upload có tên khác chỉ được dùng sau khi owner xác nhận mapping sang path trong repository.

## Known Mismatches

| ID | Mismatch | Decision | Status | Impact |
|---|---|---|---|---|
| KM-001 | Prompt trước dùng tên `BaoCaoKhoaLuan(4).docx`, repository chỉ có `docs/BaoCaoKhoaLuan.docx` | User xác nhận `docs/BaoCaoKhoaLuan.docx` là source of truth thực tế | RESOLVED | BI-001 resolved; không chặn P0-002 |
| KM-002 | Repository đã có runtime code, migration, Docker trước Phase 0 sign-off | Giữ nguyên; ghi nhận là pre-existing implementation artifact cần audit sau này | NON_BLOCKING_REVIEW_P0-017 | Không chặn P0-002; không được dùng để mark Phase 1 DONE |
| KM-003 | `docs/phase-0/*` chưa tồn tại trước P0-002 | Tạo lần lượt đúng thứ tự P0 | IN_PROGRESS | Chặn Phase 0 sign-off cho đến P0-018 |

## Validation Checklist

| Check | Result | Evidence |
|---|---|---|
| `docs/BaoCaoKhoaLuan.docx` exists | PASS | File present in repository |
| `docs/phase-0/SOURCE_HIERARCHY.md` exists | PASS | This file |
| File is non-empty | PASS | This file has required sections |
| Purpose section present | PASS | `## Purpose` |
| Status section present | PASS | `## Status` |
| Last Updated section present | PASS | `## Last Updated` |
| Source of Truth section present | PASS | `## Source of Truth` |
| Source hierarchy section present | PASS | `## Source Hierarchy` |
| Conflict priority rules present | PASS | `## Quy Tắc Ưu Tiên Khi Các Phần Trong Tài Liệu Mâu Thuẫn` |
| Design vs implementation evidence rules present | PASS | `## Quy Tắc Phân Biệt Design Artifact Và Implementation Evidence` |
| Future auxiliary docs rules present | PASS | `## Quy Tắc Xử Lý File Hoặc Tài Liệu Phụ Trong Tương Lai` |
| Known mismatches present | PASS | `## Known Mismatches` |
| Validation checklist present | PASS | `## Validation Checklist` |
| Source References present | PASS | `## Source References` |
| No full-phase completion claim | PASS | Status says only P0-002 is complete; overall phase remains IN_PROGRESS |
| Runtime code untouched by P0-002 | PASS | P0-002 writes docs only |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — metadata: reconciliation V1.1, architecture `MODULAR MONOLITH FIRST`, backend Express.js + TypeScript, frontend Next.js + TypeScript, data PostgreSQL + Prisma.
- `docs/BaoCaoKhoaLuan.docx` — status/source declaration: document does not claim code, migration, test, benchmark, pilot or deployment without real artifacts.
- `docs/BaoCaoKhoaLuan.docx` — scope split: Product Scope, Implementation Scope, Demo Scope, Deferred Roadmap.
- `docs/BaoCaoKhoaLuan.docx` — Phase 0: Architecture reconciliation và scope freeze; forbidden scope says no runtime code/migration/API/UI in Phase 0.
- `docs/BaoCaoKhoaLuan.docx` — Phase 1 handoff expects stack lock, module map, naming, error contract and ownership from Phase 0.
- User confirmation on 2026-07-28: `docs/BaoCaoKhoaLuan.docx` is actual repository source of truth; `(4)` upload name is not required.
