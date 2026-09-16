# Màn Hình Admin: Biên Tập Transcript Có Timestamp (Transcript Editor)

> **Mô tả:** Công cụ then chốt trong MVP 0, cho phép Admin chia nhỏ audio/video thành từng segment có mốc thời gian chuẩn mili-giây (`TranscriptSegment`), nhập tiếng Anh và bản dịch tiếng Việt, kiểm tra highlight đồng bộ trước khi xuất bản.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/ADMIN.md`](../../features/ADMIN.md), [`docs/features/LISTENING.md`](../../features/LISTENING.md), [`docs/features/VIDEO.md`](../../features/VIDEO.md)  
> - 🗄️ Bảng dữ liệu: `transcript_segments`, `contents` ([`docs/DATA_MODEL.md`](../../DATA_MODEL.md))  
> - 💻 Frontend Code: `frontend/src/admin/content/`  
> - ☕ Backend Service: `com.englishflow.content.service.TranscriptController`

---

## 1. Bố Cục Giao Diện

- **Thanh Player Kiểm Thử Trực Tiếp (Top Audio/Video Scrubber):**
  - Trình phát mini gắn cố định trên cùng màn hình.
  - Dạng sóng âm (Waveform) kèm hai thanh trỏ đánh dấu mốc `[ Start ]` và `[ End ]`.
  - Phím tắt tiện dụng: `Space` (Play/Pause), `Ctrl + Enter` (Cắt đoạn mới).

---

## 2. Bảng Biên Tập Phân Đoạn (Segment Editor Table)

Danh sách các phân đoạn được đánh số thứ tự (`position`: 0, 1, 2,...):

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ #1  [ 00:00.000 - 00:04.250 ]  ▶ Nghe thử đoạn này   ✂️ Cắt đoạn  🗑️ Xóa    │
│ EN: "Today we're going to talk about why people often procrastinate."       │
│ VI: "Hôm nay chúng ta sẽ nói về lý do tại sao mọi người thường trì hoãn."   │
├─────────────────────────────────────────────────────────────────────────────┤
│ #2  [ 00:04.250 - 00:09.100 ]  ▶ Nghe thử đoạn này   ✂️ Cắt đoạn  🗑️ Xóa    │
│ EN: "One explanation involves the way our brain evaluates rewards."         │
│ VI: "Một lời giải thích liên quan đến cách bộ não đánh giá phần thưởng."    │
├─────────────────────────────────────────────────────────────────────────────┤
│ + Thêm phân đoạn mới                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Các Tính Năng Nâng Cao

1. **Nhập File Có Sẵn (Bulk Import):**
   - Hỗ trợ tải lên file `.vtt`, `.lrc` hoặc `.srt` để hệ thống tự động tách câu và mốc mili-giây.
2. **Gợi Ý Dịch Tự Động (AI Translate Helper):**
   - Nút `Tự động dịch sang Tiếng Việt` cho các câu chưa có bản dịch. Admin chỉ việc duyệt lại cho mượt mà.
3. **Chế Độ Chạy Thử (Test Highlight Mode):**
   - Chạy thử toàn bộ bài từ đầu: giao diện sẽ highlight từng câu đúng như màn hình của người dùng thực tế.
4. **Nút Hoàn Tất:**
   - `Lưu & Xuất bản lên Feed (Publish)`.

## Frontend demo implementation — 2026-09-10

/#/admin/transcript/:id is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/admin/`](../../../frontend/src/features/admin/).
- Domain reference: [Data model](../../DATA_MODEL.md) and [Business rules](../../BUSINESS_RULES.md).
