# Màn Hình Admin: Tổng Quan (Dashboard)

> **Mô tả:** Màn hình quản trị nội dung dành cho Biên tập viên và Quản trị viên hệ thống (MVP 0 Foundation).  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/ADMIN.md`](../../features/ADMIN.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `users`, `vocabularies` ([`docs/DATA_MODEL.md`](../../DATA_MODEL.md))  
> - 💻 Frontend Code: `frontend/src/admin/dashboard/`, `frontend/src/layouts/AdminLayout.tsx`  
> - ☕ Backend Service: `com.englishflow.admin.service.AdminDashboardService`

---

## 1. Các Thẻ Chỉ Số Tổng Quan (Metric Cards)

Lưới 4 thẻ thống kê ở đầu trang (nền trắng, viền mỏng, bo góc 16px):
1. **Tổng Bài Đọc (Articles):** `142` bài (kèm tag: *12 bài bản nháp*).
2. **Tổng Podcast Audio:** `86` tập (kèm tag: *100% có transcript có timestamp*).
3. **Tổng Video:** `54` video.
4. **Từ Vựng Được Lưu Nhiều Nhất:** Top từ vựng: `perspective`, `remarkable`, `significant`.

---

## 2. Thanh Tác Vụ Nhanh (Quick Actions)

- Nút: `+ Tạo Bài Viết Mới` (Xanh lá chủ đạo `#16A34A`).
- Nút: `+ Upload Podcast Audio` (Xanh dương `#0284C7`).
- Nút: `+ Thêm Video Mới` (Đỏ san hô `#EF4444`).

---

## 3. Bảng Quản Lý Danh Sách Nội Dung (Content Management Table)

Bảng quản lý phân trang với bộ lọc theo loại (`Article`, `Podcast`, `Video`) và trạng thái (`Draft`, `Published`):
- **Cột 1:** Thumbnail + Tiêu đề nội dung + Loại hình.
- **Cột 2:** Chủ đề (Science, Tech, Health,...) theo chiến lược IELTS ngầm.
- **Cột 3:** Độ khó (`Easy`, `Intermediate`, `Advanced`).
- **Cột 4:** Trạng thái (`Xuất bản` - Badge xanh lá, `Bản nháp` - Badge xám).
- **Cột 5:** Thao tác: Nút sửa ✏️, Soạn transcript 🎙️, Xóa 🗑️, Xem trước 👁️.

## Frontend demo implementation — 2026-09-10

/#/admin is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/admin/`](../../../frontend/src/features/admin/).
- Domain reference: [Data model](../../DATA_MODEL.md) and [Business rules](../../BUSINESS_RULES.md).
