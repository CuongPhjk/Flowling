# Màn Hình: Khám Phá (Explore)

> **Mô tả:** Màn hình tìm kiếm và khám phá nội dung mở rộng, cho phép người dùng lọc theo 9 chủ đề, thời lượng và độ khó mà không bị áp lực bởi thuật ngữ thi cử.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/FEED.md`](../features/FEED.md)  
> - 🗄️ Bảng dữ liệu: `contents` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#7-stealth-ielts-curriculum-strategy)  
> - 💻 Frontend Code: `frontend/src/features/search/`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Bố Cục Giao Diện

Kế thừa hệ khung 3 cột nhất quán (hoặc 2 cột mở rộng nội dung chính):
- **Cột trái:** Thanh điều hướng chung (active tại `Khám phá`).
- **Cột giữa (Main Explorer):** Bộ lọc chủ đề, bộ lọc thời lượng/độ khó, và danh sách kết quả dạng lưới.
- **Cột phải:** Xu hướng tìm kiếm (Trending topics), từ khóa thịnh hành, và gợi ý cá nhân hóa.

---

## 2. Các Thành Phần Chính

### 2.1 Thanh Tìm Kiếm Mở Rộng
- Input dạng pill lớn với icon kính lúp 🔍 và phím tắt gợi ý `(Ctrl + K)`.
- Gợi ý từ khóa tìm kiếm nhanh: *"sleep habits"*, *"space exploration"*, *"climate change"*, *"psychology"*.

### 2.2 Thanh Bộ Lọc Đa Tầng (Filter Chips)
1. **Lọc Theo Độ Khó (Tuyệt đối không dùng chữ IELTS):**
   - `Tất cả`
   - `Dễ` (Easy — Xanh lá nhạt `#EBF7EE`)
   - `Trung bình` (Intermediate — Vàng cam nhạt `#FEF3C7`)
   - `Nâng cao` (Advanced — Tím nhạt `#F3E8FF`)
2. **Lọc Theo Thời Lượng (Quick Bites):**
   - `Dưới 5 phút` (Phù hợp giờ giải lao ngắn)
   - `5 - 10 phút`
   - `Trên 10 phút`
3. **Lọc Theo Định Dạng:**
   - `Tất cả` | `Bài đọc 📖` | `Podcast 🎧` | `Video 🎬`

### 2.3 Lưới 9 Chủ Đề (Topic Cards Grid)
Lưới 9 ô thẻ chủ đề với icon màu sắc pastel, ảnh nền mờ và số lượng nội dung:
- `Môi trường` (Green `#EBF7EE`) — *142 nội dung*
- `Khoa học` (Blue `#E8F0FE`) — *215 nội dung*
- `Tâm lý` (Purple `#F3E8FF`) — *189 nội dung*
- `Sức khỏe` (Coral `#FEE2E2`) — *120 nội dung*
- `Công nghệ` (Sky `#E0F2FE`) — *304 nội dung*
- `Kinh tế` (Amber `#FEF3C7`) — *98 nội dung*
- `Văn hóa` (Pink `#FCE7F3`) — *112 nội dung*
- `Giáo dục` (Emerald `#ECFDF5`) — *156 nội dung*
- `Xã hội` (Lavender `#EDE9FE`) — *175 nội dung*

### 2.4 Danh Sách Kết Quả & Section "Nội Dung 5 Phút"
- Header: `Nội dung dưới 5 phút dành cho bạn` — tập hợp các video ngắn và podcast ngắn giúp người dùng xem nhanh khi có ít thời gian.
- Lưới card 3 cột chuẩn như trang chủ.

## Frontend demo implementation — 2026-09-10

/#/explore is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/feed/`](../../frontend/src/features/feed/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
