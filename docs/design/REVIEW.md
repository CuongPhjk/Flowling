# Màn Hình: Ôn Tập Flashcard SRS (Review)

> **Mô tả:** Màn hình ôn tập flashcard siêu tốc 3-5 phút theo thuật toán SuperMemo-2 (SM-2). Thiết kế tối giản, tập trung cao độ, tuyệt đối không giữ chân người dùng trong các bài học kéo dài 45 phút gây mệt mỏi.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/FLASHCARD.md`](../features/FLASHCARD.md)  
> - 🗄️ Bảng dữ liệu: `user_vocabularies`, `vocabulary_contexts` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#6-fast-spaced-repetition-srs-review-rules)  
> - 💻 Frontend Code: `frontend/src/features/flashcard/`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Cơ Chế Phiên Ôn Tập (Micro-Session)

- **Thời lượng:** Giới hạn 10 - 20 thẻ cho mỗi phiên (tương đương 3 - 5 phút).
- **Điểm truy cập:**
  - Mục `Ôn tập` trên Left Navigation (kèm badge đỏ số từ đến hạn `12`).
  - Hoặc bấm vào widget `12 từ đang chờ ôn tập` tại Right Sidebar.
  - Hoặc bấm vào thẻ nhắc ôn tập giữa chừng khi lướt feed (**In-Feed Review Nudge**).

---

## 2. Giao Diện Thẻ Flashcard 3D

Thẻ nằm chính giữa màn hình với hiệu ứng lật 3D mượt mà (CSS 3D Transform). Phía trên có thanh tiến trình mỏng: `Thẻ 4 / 12`.

### 2.1 Mặt Trước Của Thẻ (Thử Thách Gợi Nhớ)
```text
┌─────────────────────────────────────────────────────────┐
│ Thẻ 4 / 12                                           🔊 │
│                                                         │
│                      remarkably                         │
│                                                         │
│               [ /rɪˈmɑːrkəbli/ ]                        │
│                                                         │
│   "The findings were [...] consistent across groups."   │
│                                                         │
│            (Chạm hoặc bấm Spacebar để lật thẻ)          │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Mặt Sau Của Thẻ (Khi Đã Lật)
```text
┌─────────────────────────────────────────────────────────┐
│                      remarkably                         │
│            một cách đáng kể / đáng chú ý                │
│                                                         │
│ Câu ngữ cảnh gốc:                                       │
│ "The findings were remarkably consistent                │
│ across different age groups."                           │
│                                                         │
│ 📖 Trích từ bài: Why Your Brain Needs Sleep             │
└─────────────────────────────────────────────────────────┘
  [ Quên ]        [ Khó ]        [ Tốt ]        [ Dễ ]
  (Again - 1d)   (Hard - 2d)   (Good - 6d)   (Easy - 10d)
```

### 2.3 Thanh 4 Nút Đánh Giá (SM-2)
- **`Quên` (Again - Đỏ san hô `#EF4444`):** Quên từ, lùi chu kỳ về 1 ngày, thẻ sẽ xuất hiện lại ở cuối phiên.
- **`Khó` (Hard - Vàng cam `#F59E0B`):** Nhớ nhưng tốn nhiều sức, chu kỳ tăng nhẹ (1.2x).
- **`Tốt` (Good - Xanh lá tươi `#16A34A`):** Nhớ chuẩn xác (Mặc định). Chu kỳ nhân với Ease Factor.
- **`Dễ` (Easy - Xanh dương `#0EA5E9`):** Nhớ tức thì không cần suy nghĩ, chu kỳ tăng mạnh.

---

## 3. Màn Hình Hoàn Thành Phiên (Session Complete)

Sau khi ôn xong từ cuối cùng, giao diện hiển thị màn hình chúc mừng nhẹ nhàng:

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                   Tuyệt vời! Bạn đã hoàn thành 🎉       │
│                                                         │
│                     12 từ vựng đã được củng cố          │
│                              +35 XP                     │
│                                                         │
│                  [ Quay lại Feed lướt tiếp → ]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
Người dùng bấm `Quay lại Feed` sẽ lập tức được đưa trở về vị trí đang đọc/xem trước đó.

## Frontend demo implementation — 2026-09-10

/#/review is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/flashcard/`](../../frontend/src/features/flashcard/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
