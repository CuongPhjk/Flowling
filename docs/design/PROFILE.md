# Màn Hình: Hồ Sơ Cá Nhân & Tiến Trình (Profile & Progress)

> **Mô tả:** Màn hình quản lý tài khoản, theo dõi các chỉ số thói quen (Streak, Heatmap hoạt động, Thống kê từ vựng) và cài đặt trải nghiệm cá nhân.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/AUTH.md`](../features/AUTH.md)  
> - 🗄️ Bảng dữ liệu: `users`, `user_vocabularies` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#8-streak--xp-rules-ambient-20)  
> - 💻 Frontend Code: `frontend/src/features/profile/`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Bố Cục Giao Diện

- **Khu Vực Thông Tin Cá Nhân (User Header):**
  - Avatar tròn lớn (bo tròn 100%, viền trắng bóng mờ).
  - Tên hiển thị: `Minh Nguyễn` kèm email và ngày tham gia.
  - Huy hiệu cấp độ nhẹ nhàng (VD: `Người đọc tò mò · Cấp 8`).
  - Nút: `Chỉnh sửa hồ sơ`.

---

## 2. Thống Kê Thói Quen & Động Lực (Habit Metrics)

### 2.1 Chuỗi Hoạt Động (Streak & Heatmap)
- **Thẻ Streak:**
  - `🔥 7 Ngày Liên Tục` (Font 28px, Bold cam `#F97316`).
  - Câu động viên: *"Bạn đang duy trì thói quen rất đều đặn!"*.
- **Heatmap Hoạt Động 30 Ngày (Activity Heatmap):**
  - Lưới các ô vuông nhỏ tượng trưng cho 30 ngày vừa qua.
  - Ô ngày không hoạt động: Xám nhạt `#F1F3F5`.
  - Ô ngày hoạt động nhẹ: Xanh lá nhạt `#DCFCE7`.
  - Ô ngày hoạt động tích cực: Xanh lá đậm `#16A34A`.

### 2.2 Các Chỉ Số Tích Lũy
Lưới 3 thẻ chỉ số thiết kế tối giản:
1. **Tổng thời gian tiếp xúc:** `14.5 Giờ` (Đọc bài và nghe podcast).
2. **Kho từ vựng tích lũy:** `148 Từ` (36 từ đã thuần thục, 112 từ đang trong chu kỳ lặp lại).
3. **Điểm kinh nghiệm (XP):** `1,240 XP`.

---

## 3. Cài Đặt Trải Nghiệm (Preferences)

- **Chế độ đọc mặc định:** `English (Khuyên dùng)` | `Song ngữ Bilingual`.
- **Tốc độ nghe podcast mặc định:** `0.75x`, `1.0x`, `1.25x`.
- **Giao diện:** `Sáng (Light Mode - Mặc định)` | `Tối (Dark Mode)`.
- **Nút Đăng xuất:** Màu xám đỏ nhẹ ở chân trang.

## Frontend demo implementation — 2026-09-10

/#/profile is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/profile/`](../../frontend/src/features/profile/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
