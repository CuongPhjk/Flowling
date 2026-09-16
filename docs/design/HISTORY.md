# Màn Hình: Lịch Sử Tiêu Thụ (History)

> **Mô tả:** Màn hình xem lại toàn bộ các bài viết đã đọc, podcast đã nghe và video đã xem, giúp người dùng dễ dàng tiếp tục những nội dung đang dở dang.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/FEED.md`](../features/FEED.md)  
> - 🗄️ Bảng dữ liệu: `content_progress`, `contents` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#1-content-first-feed--navigation-rules)  
> - 💻 Frontend Code: `frontend/src/features/feed/`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Bố Cục Giao Diện

- **Thanh Tiêu Đề:**
  - Tiêu đề: `Lịch Sử Xem & Nghe`.
  - Bộ lọc: `Tất cả`, `Đang dở dang`, `Đã hoàn thành`.
  - Nút: `Xóa lịch sử` (Ghost button màu xám).

---

## 2. Dòng Thời Gian (Timeline Layout)

Danh sách được nhóm gọn gàng theo mốc thời gian:

### 2.1 Nhóm: Hôm Nay (Today)
- **Item 1 (Podcast - Dở dang):**
  - Ảnh cover + icon `🎧 Podcast`.
  - Tiêu đề: `Why Do We Dream?` (5 phút).
  - Thanh tiến trình: `Đã nghe 62%` (Thanh bar xanh dương).
  - Nút: `▶ Tiếp tục nghe`.
- **Item 2 (Bài đọc - Hoàn thành):**
  - Ảnh cover + icon `📖 Bài đọc`.
  - Tiêu đề: `Could Humans Really Live on Mars?`.
  - Tiến trình: `Hoàn thành ✓` (Đã đọc 100%, tích xanh lá).
  - Từ vựng đã lưu trong bài: `3 từ mới đã lưu`.

### 2.2 Nhóm: Hôm Qua & Tuần Trước
- Danh sách thu gọn dạng thẻ ngang (Horizontal compact card), hiển thị ngày xem, thời gian xem, và nút xem lại.

## Frontend demo implementation — 2026-09-10

/#/history is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/feed/`](../../frontend/src/features/feed/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
