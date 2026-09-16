# Màn Hình Admin: Quản Lý & Upload Media (Media Editor)

> **Mô tả:** Trình upload và thiết lập file âm thanh Podcast (.mp3) hoặc Video (.mp4 / embed) trước khi tiến hành khớp timestamp cho phụ đề transcript.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/ADMIN.md`](../../features/ADMIN.md), [`docs/features/LISTENING.md`](../../features/LISTENING.md), [`docs/features/VIDEO.md`](../../features/VIDEO.md)  
> - 🗄️ Bảng dữ liệu: `contents` ([`docs/DATA_MODEL.md`](../../DATA_MODEL.md))  
> - 💻 Frontend Code: `frontend/src/admin/content/`  
> - ☕ Backend Service: `com.englishflow.admin.service.MediaUploadService`

---

## 1. Bố Cục Giao Diện

- **Chọn Định Dạng:** Nút chuyển đổi `[ 🎧 Podcast Audio ]` hoặc `[ 🎬 Video Clip ]`.
- **Khu Vực Upload File Chính:**
  - **Với Podcast:**
    - Khung kéo thả file âm thanh `.mp3` hoặc `.m4a`.
    - Thanh hiển thị dạng sóng âm thanh (Audio Waveform Preview).
    - Hệ thống tự động trích xuất thời lượng chính xác (VD: `08:42`).
  - **Với Video:**
    - Khung tải file `.mp4` trực tiếp hoặc ô dán link video (YouTube / Cloudflare Stream).
    - Khung xem trước video trực tiếp.
- **Khu Vực Thông Tin Đi Kèm:**
  - Tiêu đề tập podcast / video.
  - Ảnh bìa thumbnail 16:9 (kèm khung preview).
  - Tóm tắt nội dung (Teaser hiển thị trên card).
  - Chủ đề và phân loại độ khó (`Easy`, `Intermediate`, `Advanced`).
- **Nút Chuyển Tiếp:**
  - Nút lớn màu xanh lá: `Lưu & Chuyển Sang Soạn Transcript 🎙️ →` (Dẫn thẳng sang màn hình Transcript Editor).

## Frontend demo implementation — 2026-09-10

/#/admin/media/:id is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/admin/`](../../../frontend/src/features/admin/).
- Domain reference: [Data model](../../DATA_MODEL.md) and [Business rules](../../BUSINESS_RULES.md).
