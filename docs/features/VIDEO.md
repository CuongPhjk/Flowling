# Feature Specification: Video Player & Synchronized Subtitles

> **Tên hệ thống:** EnglishFlow 🌿 | **UI Brand:** Flowling (*"Good content. Better you."*)  
> **Liên kết kỹ thuật:**  
> - 🎨 Màn hình thiết kế: [`docs/design/VIDEO_PLAYER.md`](../design/VIDEO_PLAYER.md), [`docs/design/admin/TRANSCRIPT_EDITOR.md`](../design/admin/TRANSCRIPT_EDITOR.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `transcript_segments`, `content_progress` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#4-multimedia-player--timestamped-transcript-rules)  
> - 💻 Frontend Code: `frontend/src/features/listening/` (Shared Media Engine)  
> - ☕ Backend Service: `com.englishflow.content.service.MediaService`

---

## 1. Overview
The Video Player enables engaging visual learning by pairing video content (native `.mp4` uploads or embedded video references) with the exact same millisecond-accurate `TranscriptSegment` engine used for Podcasts.

Backend architecture remains completely unified:
- `contents.type = 'VIDEO'`
- `contents.media_url` = Video streaming URL or reference
- Transcripts = `transcript_segments` (`start_ms`, `end_ms`, `english_text`, `vietnamese_text`)

---

## 2. Video Player Layout & UX

```text
How Your Memory Actually Works

┌─────────────────────────────────────────────────────────┐
│                                                         │
│                      [ VIDEO VIEW ]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
        01:14 / 04:31  ━━━━━━●━━━━━━━━━━━━━━  1080p  1.0x

Interactive Subtitles & Transcript
[ EN ]  [ EN + VI ]  [ Side-by-side ]

01:05 - 01:12
The hippocampus acts as a temporary holding area...
Hồi hải mã đóng vai trò như một khu vực lưu trữ tạm thời...

███████████████████████████████████████████████████████████
01:12 - 01:20
During deep sleep, these memories transfer to the cortex.
Trong giấc ngủ sâu, những ký ức này chuyển sang vỏ não.
███████████████████████████████████████████████████████████
```

---

## 3. Core Capabilities

1. **Shared Media Engine:**
   - Seamlessly uses the frontend `useTranscriptSync` hook.
   - Syncs video playback time with transcript segments.
2. **Subtitles on Video + Scrollable Transcript Beside/Below:**
   - High-contrast subtitles overlay on the video player with clean styling.
   - Below or beside the video, the full scrollable transcript auto-scrolls in sync with playback.
3. **Interactive Actions:**
   - Click any sentence in the transcript to jump video playback directly to that timestamp.
   - Click words to view definitions, hear pronunciation 🔊, and save to personal vocabulary.
   - Segment controls: `Nghe lại câu này`, `Lưu câu`, `Dịch nghĩa`.

---

## 4. Endpoints
- `GET /api/v1/contents/{slug}`: Retrieves video metadata, stream URL, and duration.
- `GET /api/v1/contents/{id}/segments`: Returns chronological array of `TranscriptSegment` items.
- `POST /api/v1/contents/{id}/progress`: Heartbeat updating current playback position in seconds.

## Frontend demo implementation — 2026-09-10

Video player is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/listening/`](../../frontend/src/features/listening/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
- Screen index: [UI specifications](../design/) and [demo route matrix](../FRONTEND_DEMO.md#screen-coverage).
