# Màn Hình: Trang Chủ (Home Feed)

> **Mô tả:** Màn hình chính của Flowling / EnglishFlow, thiết kế theo bố cục 3 cột (Left Sidebar + Main Stream + Right Sidebar) chuẩn theo ảnh mẫu thiết kế.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/FEED.md`](../features/FEED.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `content_progress`, `saved_contents` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#1-content-first-feed--navigation-rules)  
> - 💻 Frontend Code: `frontend/src/features/feed/`, `frontend/src/layouts/MainLayout.tsx`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Cấu Trúc Tổng Thể (3-Column Layout)

```text
┌──────────────────┬────────────────────────────────────────────┬────────────────────────┐
│  LEFT SIDEBAR    │            MAIN CONTENT FEED               │     RIGHT SIDEBAR      │
│  (Nav & Topics)  │     (Search, Hero Banner, Mixed Grid)      │ (Habits, Vocab, Review)│
│  Width: ~240px   │            Width: Flex (Center)            │     Width: ~320px      │
└──────────────────┴────────────────────────────────────────────┴────────────────────────┘
```

---

## 2. Chi Tiết Left Sidebar (Điều Hướng & Chủ Đề)

- **Header Thương Hiệu:**
  - Icon mầm cây / dòng chảy sóng nước màu xanh lá tươi (`#22C55E`).
  - Tên ứng dụng: `Flowling` (Font bold 20px).
  - Slogan: `Good content. Better you.` (Font 12px, màu xám `#94A3B8`).
- **Menu Chính (Active Pill bo tròn):**
  - 🏠 `Trang chủ` — Trạng thái active: nền xanh nhạt / lavender nhạt (`#F0FDF4` hoặc `#EEF2FF`), chữ đậm và icon màu xanh lá / tím.
  - 🔍 `Khám phá`
  - 🔖 `Đã lưu`
  - 🧠 `Ôn tập` — Kèm huy hiệu đếm số từ chờ ôn: badge pill màu đỏ san hô (`12`).
  - ⏱️ `Lịch sử`
  - 👤 `Hồ sơ`
- **Section "Chủ đề":**
  - Tiêu đề: `Chủ đề` + link `Xem tất cả` (màu xám nhạt bên phải).
  - Danh sách 9 chủ đề kèm icon tròn pastel sinh động:
    - 💻 `Công nghệ` (Icon xanh dương `#3B82F6`)
    - 🔬 `Khoa học` (Icon chàm `#6366F1`)
    - 🧠 `Tâm lý` (Icon cam đỏ `#F43F5E`)
    - ❤️ `Sức khỏe` (Icon đỏ `#EF4444`)
    - 🌿 `Môi trường` (Icon xanh lá `#16A34A`)
    - 👥 `Xã hội` (Icon tím `#8B5CF6`)
    - 🎭 `Văn hóa` (Icon hồng `#EC4899`)
    - 📈 `Kinh tế` (Icon vàng đất `#F59E0B`)
    - 🎓 `Giáo dục` (Icon xanh ngọc `#10B981`)

---

## 3. Chi Tiết Main Stream Center (Nội Dung Chính)

### 3.1 Top Bar & Lời Chào
- **Thanh tìm kiếm (Pill bo tròn):**
  - Nền `#F1F3F5`, viền mờ, icon kính lúp 🔍.
  - Placeholder: `Tìm bài viết, podcast, video...`
- **Khu vực chào mừng:**
  - Tiêu đề: `Chào mừng trở lại, Minh! 👋` (Font 24px, Bold, `#0F172A`).
  - Phụ đề: `Mỗi chút mỗi ngày, bạn đang tiến bộ hơn.` (Font 14px, `#64748B`).
  - Bên phải: Câu châm ngôn chữ nghiêng: *"A better you is a collection of small efforts, repeated daily."* (`#94A3B8`).

### 3.2 Hero "Tiếp Tục" (Panoramic Banner)
- **Kích thước:** Tỷ lệ 16:6, bo góc `20px`, nền ảnh thiên nhiên núi non hùng vĩ với lớp gradient tối.
- **Nội dung hiển thị:**
  - Badge tag: `TIẾP TỤC` (Nền kính mờ trắng, chữ in hoa 11px).
  - Tiêu đề: `Why Do We Dream?` (Font 26px, Bold, trắng tinh khiết).
  - Meta: `🎧 Podcast · 5 phút`.
  - Tiến trình: Thanh progress bar xanh dương nhạt + text `Đã nghe 62%`.
  - Nút bấm: Pill trắng `▶ Tiếp tục nghe` (Nền trắng, chữ đen đậm `#0F172A`).
  - Góc phải dưới: Câu nói truyền cảm hứng *"Curiosity takes you further."*.

### 3.3 Danh Sách "Dành Cho Bạn" & Lưới Nội Dung 3 Cột
- **Thanh tab lọc:**
  - Tiêu đề: `Dành cho bạn` (Font 20px, Bold).
  - Các tab: `Tất cả` (Active có gạch chân đậm), `Bài đọc`, `Podcast`, `Video`.
  - Góc phải: Dropdown sắp xếp `Mới nhất ▾`.
- **Cấu trúc mỗi Content Card:**
  - **Ảnh thumbnail (16:10, bo góc 12px):**
    - Tag định dạng nổi bên trái: `Bài đọc` (pill trắng), `🎧 Podcast` (pill kính tối), `🎬 Video` (pill đỏ/tối).
    - Tag thời lượng bên phải: `5 phút`, `8 phút`, `4:31` (pill đen mờ).
  - **Tiêu đề:** In đậm 16px, giới hạn tối đa 2 dòng (VD: *Could Humans Really Live on Mars?*, *The Power of Small Habits*).
  - **Tóm tắt (Teaser):** 2 dòng ngắn gọn, màu xám `#64748B`.
  - **Hàng tag pastel:** Hiển thị 2-3 tag chủ đề (VD: `Khoa học`, `Khám phá`, `Không gian` nền xanh dương nhạt hoặc `Môi trường`, `Thiên nhiên` nền xanh lá nhạt).
  - **Footer card:** Lượt tim `♡ 1.2K`, nút bookmark 🔖 và icon menu ba chấm `···`.

---

## 4. Chi Tiết Right Sidebar (Thói Quen & Ôn Tập)

- **Header User:**
  - Chuông thông báo 🔔 có chấm đỏ.
  - Avatar người dùng kèm lời chào `Xin chào, Minh ▾`.
- **Card 1: Chuỗi Ngày (Streak Card):**
  - Tiêu đề: `🔥 7 ngày` (Bold 22px) + Phụ đề: `Bạn đang duy trì rất tốt!`.
  - Hàng 7 ngày trong tuần (`T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `CN`).
  - Ngày đã hoàn thành: Chấm tròn màu cam `#F97316` có dấu tích trắng `✓`.
- **Card 2: Cảm Hứng Xanh Dịu (Botanical Mindset):**
  - Nền xanh nhạt `#EBF7EE`, viền mỏng `#DCFCE7`.
  - Châm ngôn: *"Learn from the world around you."* (Chữ xanh rừng `#166534`).
  - Icon mầm cây xanh tươi 🌱.
- **Card 3: Từ Vựng Hôm Nay (Word of the Day):**
  - Tiêu đề: `Từ vựng hôm nay` + link `Xem tất cả`.
  - Từ vựng: `perspective` 🔊 (kèm nút loa phát âm).
  - Phiên âm & loại từ: `/pərˈspektɪv/ · noun`.
  - Nghĩa tiếng Việt: `góc nhìn, quan điểm`.
  - Câu ví dụ thực tế: *"Travel gives you a new **perspective** on life."* (in đậm từ vựng).
  - Link hành động: `Xem chi tiết →`.
- **Card 4: Widget Ôn Tập SRS (Spaced Repetition):**
  - Nền tím nhạt `#F5F3FF`, bo góc 16px.
  - Icon bộ não 🧠 trong vòng tròn tím.
  - Tiêu đề: `12 từ đang chờ ôn tập` (Bold 16px).
  - Phụ đề: `Ôn tập 5 phút để ghi nhớ lâu hơn.`.
  - Nút bấm Full-width: `Bắt đầu ôn tập` (Nút pill tím đậm `#5842BD`, chữ trắng).

## Frontend demo implementation — 2026-09-10

/#/ is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/feed/`](../../frontend/src/features/feed/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
