# Feature Specification: Administrator CMS & Content Publishing

> **Tên hệ thống:** EnglishFlow 🌿 | **UI Brand:** Flowling (*"Good content. Better you."*)  
> **Liên kết kỹ thuật:**  
> - 🎨 Màn hình thiết kế: [`docs/design/admin/DASHBOARD.md`](../design/admin/DASHBOARD.md), [`docs/design/admin/ARTICLE_EDITOR.md`](../design/admin/ARTICLE_EDITOR.md), [`docs/design/admin/MEDIA_EDITOR.md`](../design/admin/MEDIA_EDITOR.md), [`docs/design/admin/TRANSCRIPT_EDITOR.md`](../design/admin/TRANSCRIPT_EDITOR.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `articles`, `transcript_segments` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#7-stealth-ielts-curriculum-strategy)  
> - 💻 Frontend Code: `frontend/src/admin/`, `frontend/src/layouts/AdminLayout.tsx`  
> - ☕ Backend Service: `com.englishflow.admin.service.AdminContentService`

---

## 1. Overview
The Admin CMS enables editors and content creators to publish high-quality Articles, Podcasts, and Videos. It provides media uploaders, category management, and a timestamped transcript editor.

---

## 2. Admin Content Workflows (MVP 0 Foundation)

### 2.1 Unified Content Management
- Content types supported: `ARTICLE`, `PODCAST`, `VIDEO`.
- Common metadata fields:
  - Title & URL Slug
  - Short description / teaser (for feed card)
  - 16:9 Cover thumbnail image upload
  - Difficulty: `EASY`, `INTERMEDIATE`, `ADVANCED`
  - Stealth IELTS Academic Topic: `Science`, `Technology`, `Environment`, `Psychology`, `Health`, `Economics`, `Society`, `Culture`
  - Status: `DRAFT` / `PUBLISHED`

### 2.2 Article Authoring ([`docs/design/admin/ARTICLE_EDITOR.md`](../design/admin/ARTICLE_EDITOR.md))
- English body markdown / rich-text editor.
- Full Vietnamese translation editor (for Vietnamese reading mode).
- Automatic vocabulary headword extraction assistant.

### 2.3 Podcast & Video Authoring ([`docs/design/admin/MEDIA_EDITOR.md`](../design/admin/MEDIA_EDITOR.md))
- **Audio Upload:** Upload `.mp3` or `.m4a` files with waveform preview and auto-extracted duration.
- **Video Reference:** Video streaming URL or embedded video link.

### 2.4 Timestamped Transcript Segment Editor ([`docs/design/admin/TRANSCRIPT_EDITOR.md`](../design/admin/TRANSCRIPT_EDITOR.md))
- Visual editor to enter or import timestamped segments:
  ```text
  [00:00.000 - 00:04.250]
  EN: "Today we're going to talk about why people often procrastinate."
  VI: "Hôm nay chúng ta sẽ nói về lý do tại sao mọi người thường trì hoãn."

  [00:04.250 - 00:09.100]
  EN: "One explanation involves the way our brain evaluates rewards."
  VI: "Một lời giải thích liên quan đến cách bộ não đánh giá phần thưởng."
  ```
- Split / Merge segment tools.
- Test playback with live highlighting.

---

## 3. Endpoints (Protected with `ROLE_ADMIN`)
- `POST /api/v1/admin/contents`: Create new Article, Podcast, or Video.
- `PUT /api/v1/admin/contents/{id}`: Update content metadata and body.
- `POST /api/v1/admin/contents/{id}/segments`: Bulk upload / replace `TranscriptSegment` items.
- `POST /api/v1/admin/media/upload`: Upload thumbnail images and audio files.
- `PATCH /api/v1/admin/contents/{id}/status`: Toggle `DRAFT` or `PUBLISHED`.

## Frontend demo implementation — 2026-09-10

Dashboard, content/media and transcript editors is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/admin/`](../../frontend/src/features/admin/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
- Screen index: [UI specifications](../design/) and [demo route matrix](../FRONTEND_DEMO.md#screen-coverage).
