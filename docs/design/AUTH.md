# Màn Hình: Xác Thực & Đăng Nhập (Auth)

> **Mô tả:** Màn hình Đăng ký, Đăng nhập và Quên mật khẩu với phong cách tối giản, tinh tế, tạo cảm giác chào đón thân thiện.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/AUTH.md`](../features/AUTH.md)  
> - 🗄️ Bảng dữ liệu: `users` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - 💻 Frontend Code: `frontend/src/features/auth/`, `frontend/src/layouts/AuthLayout.tsx`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Bố Cục Giao Diện (Split Screen hoặc Centered Card)

- **Phiên bản Desktop (Split 50/50):**
  - **Nửa trái (Visual Canvas):** Ảnh thiên nhiên tĩnh lặng (núi non, bình minh) kèm lớp phủ xanh lá dịu mắt và dòng chữ:
    > *"Đọc những gì bạn thích. Học tiếng Anh theo cách tự nhiên nhất."*  
    > *Flowling — Good content. Better you.*
  - **Nửa phải (Form Canvas):** Form nhập liệu sạch sẽ trên nền trắng `#FFFFFF`.
- **Phiên bản Mobile:** Khung form căn giữa màn hình với logo nổi bật ở đầu trang.

---

## 2. Chi Tiết Form Đăng Nhập / Đăng Ký

1. **Header:**
   - Logo `Flowling` kèm icon mầm cây xanh.
   - Tiêu đề: `Chào mừng bạn trở lại! 👋` (Font 24px, Bold).
   - Phụ đề: `Đăng nhập để tiếp tục khám phá content hay.`
2. **Nút Đăng Nhập Mạng Xã Hội (Social Login):**
   - Nút: `Tiếp tục với Google` (Icon Google chuẩn, nền trắng, viền mảnh `#E5E7EB`, bo góc tròn pill).
3. **Đường Phân Cách:** `hoặc với email` (đường kẻ mỏng màu xám nhạt).
4. **Các Trường Nhập Liệu (Input Fields):**
   - Ô nhập Email: Nền `#F8F9FA`, viền mỏng `#E5E7EB`, bo góc `12px`, padding êm ái.
   - Ô nhập Mật khẩu: Kèm icon mắt ẩn/hiện mật khẩu.
5. **Hành Động:**
   - Checkbox: `Ghi nhớ đăng nhập` & link `Quên mật khẩu?`.
   - Nút Submit: `Đăng nhập` (Nút pill xanh lá chủ đạo `#16A34A`, chữ trắng, full width).
   - Chuyển đổi tab: *"Bạn chưa có tài khoản? Đăng ký miễn phí"*.

## Frontend demo implementation — 2026-09-10

/#/login, /#/register, /#/forgot-password is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/auth/`](../../frontend/src/features/auth/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
