# Màn Hình: Trình Đọc Bài Viết (Article Reader)

> **Mô tả:** Giao diện đọc bài viết tiếng Anh chuẩn Typography cao cấp (tương tự Medium / Substack), tích hợp tính năng đổi 3 chế độ đọc, tra từ tức thì bằng 1 click và lưu ngữ cảnh vào bộ nhớ.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/ARTICLE.md`](../features/ARTICLE.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `articles`, `vocabulary_contexts` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#2-article-reader-rules--modes)  
> - 💻 Frontend Code: `frontend/src/features/article/`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Bố Cục Giao Diện Trình Đọc

- **Thanh Đọc Trên Cùng (Sticky Reading Header):**
  - Nút quay lại feed: `← Quay lại` (Pill mờ).
  - Thanh tiến trình đọc (Reading Progress Bar): Dày 3px, màu xanh lá `--color-green-500` chạy dọc mép trên cùng màn hình khi cuộn trang.
  - **Bộ Chuyển Đổi 3 Chế Độ (Tri-Mode Switcher):**
    - `[ English ]` (Mặc định bắt buộc — Tránh phản xạ chỉ đọc tiếng Việt)
    - `[ Bilingual ]` (Song ngữ từng đoạn)
    - `[ Vietnamese ]` (Chỉ bản dịch tiếng Việt)
  - Nút tuỳ chỉnh phông chữ & kích thước `Aa`, nút lưu bài viết 🔖.

---

## 2. Thân Bài Viết (Reading Canvas)

- Độ rộng vùng đọc tối ưu: Max-width `720px`, căn giữa màn hình, lề thoáng.
- **Tiêu đề bài viết:** Font 32px, Bold, Line-height 1.3 (`#0F172A`).
- **Meta thông tin:** Tác giả, ngày đăng, thời lượng đọc `📖 4 phút đọc`, tag chủ đề `Khoa học`.
- **Ảnh bìa bài viết:** Tỷ lệ 16:9 sắc nét, bo góc `16px`.
- **Nội dung văn bản (Body):**
  - Font size: `17px`, line-height `1.75` (tối ưu thị giác).
  - Khoảng cách giữa các đoạn văn: `24px`.
  - Từ vựng đã từng lưu: Gạch chân nhẹ màu xanh lá nhạt (`border-bottom: 2px solid #4ADE80`).

---

## 3. Popup Tra Từ Tức Thì (Word Lookup Popover)

Khi người dùng click vào bất kỳ từ tiếng Anh nào (VD: `remarkably`):
Một popover nổi lên ngay trên/dưới từ đó:

```text
┌──────────────────────────────────────────────┐
│ remarkably                             🔊    │
│ adv. · /rɪˈmɑːrkəbli/                        │
│                                              │
│ một cách đáng kể / đáng chú ý                │
│                                              │
│ Trong câu này:                               │
│ "remarkably consistent"                      │
│ → nhất quán một cách đáng chú ý              │
│                                              │
│ [ + Lưu vào sổ từ ]                         │
└──────────────────────────────────────────────┘
```

- **Nếu từ đã được lưu trước đó:** Nút bấm đổi thành badge:
  `✓ Đang học • Bạn đã gặp từ này 4 lần` (Bấm vào để mở Drawer xem lại 4 câu ngữ cảnh trong quá khứ).

---

## 4. Menu Bôi Đen Cụm Từ (Phrase Selection Menu)

Khi người dùng bôi đen kéo chuột chọn 1 cụm từ (VD: `remarkably consistent`):
Thanh công cụ mini màu đen/xanh đậm hiện lên ngay phía trên:
- `Lưu cụm từ` (Tạo từ vựng loại 'phrase').
- `Dịch câu` (Hiện dịch nhanh cả câu).
- `Ghi chú` (Thêm ghi chú riêng).

## Frontend demo implementation — 2026-09-10

/#/article/:slug is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/article/`](../../frontend/src/features/article/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
