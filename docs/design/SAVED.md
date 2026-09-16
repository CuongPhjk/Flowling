# Màn Hình: Nội Dung Đã Lưu (Saved)

> **Mô tả:** Màn hình quản lý các bài đọc, podcast và video mà người dùng đã bookmark lại để thưởng thức khi có thời gian rảnh.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/FEED.md`](../features/FEED.md)  
> - 🗄️ Bảng dữ liệu: `saved_contents`, `contents` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#1-content-first-feed--navigation-rules)  
> - 💻 Frontend Code: `frontend/src/features/feed/`, `frontend/src/layouts/MainLayout.tsx`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Bố Cục Giao Diện

- **Thanh Tiêu Đề & Bộ Lọc:**
  - Tiêu đề: `Nội Dung Đã Lưu` (Hiển thị số lượng: *18 bài viết & podcast đã lưu*).
  - Bộ lọc định dạng: `Tất cả`, `Bài đọc 📖`, `Podcast 🎧`, `Video 🎬`.
  - Ô tìm kiếm nhanh trong danh sách đã lưu.
  - Sắp xếp: `Mới lưu gần đây`, `Thời lượng ngắn trước`.

---

## 2. Lưới Nội Dung Đã Lưu (Saved Card Grid)

Các thẻ card kế thừa hoàn toàn từ card ở Trang chủ:
- Ảnh thumbnail 16:10 sắc nét, tag loại nội dung và thời lượng.
- Tiêu đề in đậm 2 dòng, phần mô tả ngắn gọn.
- Tag chủ đề pastel (`Khoa học`, `Tâm lý`, `Môi trường`).
- Nút Bookmark có trạng thái kích hoạt (Filled icon 🔖 màu xanh lá). Nhấp vào để gỡ khỏi danh sách đã lưu.
- Nút hành động nhanh: `Đọc ngay →` hoặc `▶ Nghe ngay`.

---

## 3. Trạng Thái Khi Chưa Có Nội Dung (Empty State)

Nếu danh sách trống:
- Minh họa chiếc bookmark thân thiện với mầm cây xanh.
- Dòng chữ: *"Bạn chưa lưu nội dung nào. Khi lướt feed, hãy bấm icon 🔖 để lưu lại những nội dung bạn thích nhé!"*.
- Nút bấm: `Khám phá Feed ngay` (Pill xanh lá chủ đạo).

## Frontend demo implementation — 2026-09-10

/#/saved is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/feed/`](../../frontend/src/features/feed/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
