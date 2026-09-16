# Màn Hình: Sổ Từ Vựng Cá Nhân (Vocabulary Bank)

> **Mô tả:** Nơi người dùng quản lý kho từ vựng đã lưu. Điểm khác biệt cốt lõi: mỗi từ vựng được gắn chặt với toàn bộ các câu ngữ cảnh thực tế mà người dùng đã từng bắt gặp trên feed.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/VOCABULARY.md`](../features/VOCABULARY.md)  
> - 🗄️ Bảng dữ liệu: `vocabularies`, `user_vocabularies`, `vocabulary_contexts` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#3-vocabulary-re-encounter--context-tracking-rules-1nn)  
> - 💻 Frontend Code: `frontend/src/features/vocabulary/`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Bố Cục Giao Diện

- **Thanh Công Cụ Trên Cùng:**
  - Tiêu đề: `Sổ Từ Vựng Cá Nhân` (Kèm thống kê tổng số từ: *148 từ đã lưu · 36 đã thuộc*).
  - Ô tìm kiếm từ vựng hoặc nghĩa tiếng Việt (Search input tròn pill).
  - Bộ lọc trạng thái: `Tất cả`, `Đang học (Learning)`, `Đã thuộc (Mastered)`.
  - Sắp xếp: `Mới lưu gần đây`, `Gặp nhiều nhất`, `Đến hạn ôn tập`.

---

## 2. Danh Sách Thẻ Từ Vựng (Vocabulary Card Grid)

Mỗi thẻ từ vựng thiết kế trang nhã (nền trắng, bo góc 16px, viền mỏng):
- **Hàng 1:** Từ tiếng Anh (in đậm 18px) + Icon loa phát âm 🔊 + Badge loại từ (`noun`, `verb`, `adj`, `phrase`).
- **Hàng 2:** Phiên âm IPA `/pərˈspektɪv/` + Nghĩa tiếng Việt cốt lõi (`góc nhìn, quan điểm`).
- **Hàng 3 (Ngữ Cảnh Gần Nhất):**
  Trích dẫn câu chứa từ vựng trong bài đọc gần nhất:
  > *"Travel gives you a new **perspective** on life."*  
  *(Trích từ: Exploring the World · Bài đọc)*
- **Footer Thẻ:**
  - Badge số lần bắt gặp: `👁️ Đã gặp 4 lần` (Pill màu xanh lá nhạt `#EBF7EE`, chữ xanh `#166534`).
  - Trạng thái SRS: `Đang học` kèm ngày ôn tiếp theo.

---

## 3. Drawer Lịch Sử Ngữ Cảnh ("Seen X Times" Modal Drawer)

Khi bấm vào một thẻ từ vựng hoặc nút `Đã gặp 4 lần`:
Một Drawer trượt từ bên phải ra (Width: `420px`), hiển thị toàn bộ hành trình gặp gỡ từ vựng này:

```text
┌────────────────────────────────────────────────────────┐
│ significant                                      🔊    │
│ adj. · /sɪɡˈnɪfɪkənt/                                  │
│ Nghĩa: một cách đáng kể, quan trọng                    │
│                                                        │
│ ✓ Đang học · Bạn đã gặp từ này 4 lần trên feed:        │
│                                                        │
│ [1] "A significant increase in renewable energy was     │
│      recorded last month."                             │
│      📖 Bài đọc: Climate Solutions 2026 (02/09/2026)   │
│                                                        │
│ [2] "There was a significant difference in memory."    │
│      🎧 Podcast: The Science of Sleep (04/09/2026)     │
│                                                        │
│ [3] "Could have a significant impact on exploration."  │
│      🎬 Video: Mission to Mars (06/09/2026)            │
│                                                        │
│ [4] "A remarkably significant achievement."            │
│      📖 Bài đọc: Tech Innovations (Hôm nay)            │
└────────────────────────────────────────────────────────┘
```

> **Giá trị trải nghiệm:** Giúp người dùng tận mắt thấy từ này xuất hiện liên tục trong đời thực, kích hoạt phản xạ nhớ tự nhiên mà không cần học vẹt.

## Frontend demo implementation — 2026-09-10

/#/vocabulary is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/vocabulary/`](../../frontend/src/features/vocabulary/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
