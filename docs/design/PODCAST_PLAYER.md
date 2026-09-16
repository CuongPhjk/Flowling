# Màn Hình: Trình Phát Podcast (Podcast Player)

> **Mô tả:** Giao diện nghe audio podcast kết hợp đồng bộ phụ đề transcript thời gian thực chuẩn từng mili-giây, cho phép người dùng vừa nghe vừa theo dõi chữ và tra từ vựng tức thì.  
> **Liên kết kỹ thuật:**  
> - 📄 Feature Spec: [`docs/features/LISTENING.md`](../features/LISTENING.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `transcript_segments`, `content_progress` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#4-multimedia-player--timestamped-transcript-rules)  
> - 💻 Frontend Code: `frontend/src/features/listening/`  
> - 🎨 Design System: [`docs/DESIGN.md`](../DESIGN.md)

---

## 1. Bố Cục Giao Diện Trình Phát

Giao diện chia làm 2 khu vực chính:
1. **Khu vực điều khiển Audio (Player Canvas):** Nằm bên trái hoặc trên cùng.
2. **Khu vực Transcript đồng bộ (Synchronized Transcript View):** Nằm bên phải hoặc bên dưới, có thanh cuộn mượt mà.

---

## 2. Chi Tiết Trình Phát Audio (Audio Controls)

- **Ảnh Bìa Podcast:** Vuông hoặc 16:9 sắc nét, bo góc `16px`.
- **Thông tin bài:** Tiêu đề (VD: *Why We Procrastinate*), giọng đọc, chủ đề *Tâm lý*.
- **Thanh Tiến Trình (Timeline Scrubber):**
  - Thời gian hiện tại / Tổng thời lượng: `02:31 / 08:42`.
  - Thanh timeline màu xám nhạt với vệt xanh lá `--color-green-500` lướt theo nút kéo tròn.
- **Nút Điều Khiển:**
  - Nút lùi 10 giây `-10s` & tiến 10 giây `+10s`.
  - Nút Play/Pause: Nút tròn lớn màu xanh lá chủ đạo (`#16A34A`), icon trắng, có bóng mờ êm dịu.
  - Bộ chỉnh tốc độ phát: `0.75x`, `1.0x` (mặc định), `1.25x` (giữ nguyên cao độ giọng đọc).

---

## 3. Khu Vực Transcript Đồng Bộ Thời Gian Thực

### 3.1 Bộ Chuyển Chế Độ Transcript
Thanh pill switcher trên đầu vùng transcript:
- `[ EN ]`: Chỉ hiện tiếng Anh (Tối ưu luyện nghe phản xạ).
- `[ EN + VI ]`: Hiện song song tiếng Anh và bản dịch tiếng Việt dưới từng câu.
- `[ Ẩn ]`: Ẩn toàn bộ để nghe chay.

### 3.2 Cơ Chế Highlight Câu Đang Đọc (Active Segment)
- Câu khớp với thời gian `startMs <= currentTime < endMs` sẽ tự động:
  - Bật nền màu xanh lá dịu mắt: `background: #EBF7EE`.
  - Đường viền trái dày 3px màu xanh lá: `border-left: 3px solid #16A34A`.
  - Tự động cuộn mượt (Smooth Auto-scroll) để đưa câu đang phát về trung tâm tầm mắt.

### 3.3 Menu Tương Tác Từng Câu
Khi hover hoặc tap vào câu trong transcript:
- **`Nghe lại câu này`:** Vòng lặp phát lại đoạn audio từ `startMs` đến `endMs`.
- **`Lưu câu`:** Lưu câu và đoạn audio vào danh sách trích dẫn yêu thích.
- **`Dịch nghĩa`:** Bật bản dịch tiếng Việt của riêng câu đó.
- **`Tra từ trong câu`:** Từng từ trong câu đều có thể click để mở popup tra từ vựng như trong bài đọc.

## Frontend demo implementation — 2026-09-10

/#/podcast/:slug is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/listening/`](../../frontend/src/features/listening/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
