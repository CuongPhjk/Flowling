# Feature Specification: Podcast Audio & Synchronized Transcript

> **Tên hệ thống:** EnglishFlow 🌿 | **UI Brand:** Flowling (*"Good content. Better you."*)  
> **Liên kết kỹ thuật:**  
> - 🎨 Màn hình thiết kế: [`docs/design/PODCAST_PLAYER.md`](../design/PODCAST_PLAYER.md), [`docs/design/admin/TRANSCRIPT_EDITOR.md`](../design/admin/TRANSCRIPT_EDITOR.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `transcript_segments`, `content_progress` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#4-multimedia-player--timestamped-transcript-rules)  
> - 💻 Frontend Code: `frontend/src/features/listening/`, `hooks/useTranscriptSync.ts`  
> - ☕ Backend Service: `com.englishflow.content.service.MediaService`, `com.englishflow.progress.service.ProgressService`

---

## 1. Overview
The Podcast module provides an interactive audio listening experience paired with millisecond-accurate synchronized transcripts, allowing users to build auditory vocabulary and natural pronunciation without cognitive overload.

---

## 2. Player Controls & UI Layout

```text
Why We Procrastinate

──────────── [ THUMBNAIL ] ────────────

             02:31 / 08:42
     ━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━

       -10s        ▶        +10s

          0.75x   1.0x   1.25x

Transcript
[ EN ]  [ EN + VI ]  [ Ẩn ]

Why do we constantly put things off?
Tại sao chúng ta liên tục trì hoãn?

██████████████████████████████████████
One explanation involves the way
our brain evaluates immediate rewards.
██████████████████████████████████████
Một lời giải thích liên quan đến cách
bộ não đánh giá phần thưởng trước mắt.
```

### 2.1 Audio Controls
- **Scrubber & Timeline:** Precise millisecond seeking with visual progress.
- **Skip Buttons:** Quick `-10s` and `+10s` jumps.
- **Speed Pitch Preservation:** `0.75x`, `1.0x`, `1.25x` without robotic pitch distortion.

---

## 3. Synchronized Transcript Engine

### 3.1 Millisecond Segments (`TranscriptSegment`)
Transcripts are divided into discrete sentence segments:
```json
{
  "id": 101,
  "startMs": 2400,
  "endMs": 6800,
  "englishText": "One explanation involves the way our brain evaluates immediate rewards.",
  "vietnameseText": "Một lời giải thích liên quan đến cách bộ não đánh giá phần thưởng trước mắt.",
  "position": 2
}
```

### 3.2 Real-Time Highlighting & Auto-Scroll
- As audio plays, the active segment where `startMs <= currentTimeMs < endMs` is highlighted with an emerald tint (`background: #EBF7EE`) and a green border indicator (`border-left: 3px solid #16A34A`).
- The viewport automatically scrolls smoothly to keep the active sentence vertically centered.

### 3.3 Interactive Segment Actions
Clicking or hovering on any transcript segment presents three quick actions:
- **`Nghe lại câu này`**: Loops audio playback strictly from `startMs` to `endMs`.
- **`Lưu câu`**: Stores the sentence and its audio timestamp into the user's notebook.
- **`Dịch nghĩa`**: Toggles individual Vietnamese translation for this segment.

### 3.4 Interactive Word Lookup
Every English word inside the transcript is interactive: clicking opens the standard vocabulary popover (`+ Lưu vào sổ từ`, definition, IPA 🔊, contextual translation).

---

## 4. Endpoints
- `GET /api/v1/contents/{slug}`: Retrieves podcast metadata and audio file URL (`.mp3`).
- `GET /api/v1/contents/{id}/segments`: Returns chronological array of `TranscriptSegment` items.
- `POST /api/v1/contents/{id}/progress`: Heartbeat updating audio playback position (`last_position_seconds`) and completion flag.

## Frontend demo implementation — 2026-09-10

Podcast player is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/listening/`](../../frontend/src/features/listening/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
- Screen index: [UI specifications](../design/) and [demo route matrix](../FRONTEND_DEMO.md#screen-coverage).
