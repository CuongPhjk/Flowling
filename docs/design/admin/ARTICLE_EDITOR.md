# Màn Hình Admin: Soạn Thảo Bài Viết (Article Editor)

> **Mô tả:** Trình soạn thảo bài viết chuyên sâu dành cho Admin/Editor, hỗ trợ văn bản tiếng Anh gốc và bản dịch tiếng Việt song song.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/ADMIN.md`](../../features/ADMIN.md), [`docs/features/ARTICLE.md`](../../features/ARTICLE.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `articles` ([`docs/DATA_MODEL.md`](../../DATA_MODEL.md))  
> - 💻 Frontend Code: `frontend/src/admin/content/`  
> - ☕ Backend Service: `com.englishflow.admin.service.AdminContentService`

---

## 1. Bố Cục Giao Diện Soạn Thảo

Chia làm 2 cột:
- **Cột Trái (2/3 chiều rộng — Content Canvas):**
  - Ô nhập Tiêu đề bài viết (Headline).
  - Slug đường dẫn tự động tạo (VD: `could-humans-really-live-on-mars`).
  - **Tab Soạn Thảo:**
    - `Nội dung Tiếng Anh (English Body)`: Markdown / Rich text editor.
    - `Bản dịch Tiếng Việt (Vietnamese Body)`: Bản dịch hoàn chỉnh phục vụ chế độ đọc Vietnamese mode.
- **Cột Phải (1/3 chiều rộng — Metadata & Publishing Settings):**
  - **Ảnh bìa (Thumbnail Upload):** Khung kéo thả tải ảnh 16:9 kèm preview.
  - **Mô tả ngắn (Teaser):** Tóm tắt 2 dòng hiển thị trên Feed card.
  - **Chủ đề học thuật:** Chọn 1 trong 9 chủ đề (`Khoa học`, `Môi trường`, `Tâm lý`,...).
  - **Độ khó:** `Easy` (A1-A2), `Intermediate` (B1-B2), `Advanced` (C1-C2).
  - **Thời lượng đọc dự tính:** Tự động tính dựa trên số từ (VD: `4 phút đọc`).
  - **Trạng thái:** Switch toggle `Lưu nháp (Draft)` hoặc `Xuất bản (Publish)`.
  - **Nút hành động:** `Lưu nháp`, `Xem trước bài đọc 👁️`, `Đăng bài`.

## Frontend demo implementation — 2026-09-10

/#/admin/article/:id is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/admin/`](../../../frontend/src/features/admin/).
- Domain reference: [Data model](../../DATA_MODEL.md) and [Business rules](../../BUSINESS_RULES.md).
