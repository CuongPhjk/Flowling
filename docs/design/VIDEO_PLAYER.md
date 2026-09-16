# Màn Hình: Trình Phát Video (Video Player)

> **Mô tả:** Giao diện xem video tiếng Anh (video upload trực tiếp hoặc embed YouTube) tích hợp phụ đề tương tác trên màn hình và transcript cuộn đồng bộ bên cạnh.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/VIDEO.md`](../features/VIDEO.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `transcript_segments`, `content_progress` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#4-multimedia-player--timestamped-transcript-rules)  
> - 💻 Frontend Code: `frontend/src/features/listening/` (Shared Media Engine)  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Bố Cục Giao Diện

- **Khu Vực Khung Hình Video (16:9 Viewport):**
  - Màn hình phát video độ phân giải cao, bo góc `16px`.
  - Phụ đề tương tác phủ trực tiếp trên video (Interactive Overlay Subtitles): chữ trắng có viền mờ tối, có thể click trực tiếp vào từ trên phụ đề để dừng video và tra từ.
- **Khu Vực Phụ Đề & Transcript Cuộn Bên Cạnh (Side Transcript Pane):**
  - Danh sách toàn bộ các câu trong video sắp xếp theo mốc thời gian (VD: `01:12 - 01:20`).
  - Đồng bộ tự động theo thời gian phát video (dùng chung hook `useTranscriptSync` với Podcast).
  - Bấm vào bất kỳ câu nào trong danh sách để tua video ngay đến đoạn đó.

---

## 2. Tính Năng & Tương Tác

- **Bộ Chế Độ Transcript:** `[ EN ]`, `[ Song ngữ EN + VI ]`, `[ Chỉ tiếng Việt ]`.
- **Tốc Độ Phát:** `0.75x`, `1.0x`, `1.25x`, `1.5x`.
- **Chế Độ Rạp Chiếu (Theater Mode):** Mở rộng khung video chiếm trọn chiều ngang, đẩy transcript xuống phía dưới.
- **Lưu Từ Vựng:** Click từ vựng trên phụ đề hoặc transcript để lưu vào sổ từ cá nhân kèm câu ngữ cảnh.

## Frontend demo implementation — 2026-09-10

/#/video/:slug is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/listening/`](../../frontend/src/features/listening/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
