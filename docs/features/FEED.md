# Feature Specification: Unified Content Feed (Home & Discovery)

> **Tên hệ thống:** EnglishFlow 🌿 | **UI Brand:** Flowling (*"Good content. Better you."*)  
> **Liên kết kỹ thuật:**  
> - 🎨 Màn hình thiết kế: [`docs/design/HOME.md`](../design/HOME.md), [`docs/design/EXPLORE.md`](../design/EXPLORE.md), [`docs/design/SAVED.md`](../design/SAVED.md), [`docs/design/HISTORY.md`](../design/HISTORY.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `content_progress`, `saved_contents` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#1-content-first-feed--navigation-rules)  
> - 💻 Frontend Code: `frontend/src/features/feed/`, `frontend/src/layouts/MainLayout.tsx`  
> - ☕ Backend Service: `com.englishflow.content.service.ContentService`, `com.englishflow.progress.service.ProgressService`

---

## 1. Overview
The Home Feed is the core entry point of Flowling. Rather than presenting learners with an educational syllabus or course dashboard, the Feed functions like a social media stream of captivating English content, organically mixing **Articles**, **Podcasts**, and **Videos**.

Learning occurs silently in the background: users scroll because the content is genuinely interesting; unfamiliar vocabulary is captured with a single click.

---

## 2. Key Capabilities & Layout

### 2.1 Aesthetic Balance: The 80/20 Rule
- **80% Content Immersion:** Large cover thumbnails, compelling headlines, brief teasers, topic pills, and natural duration indicators.
- **20% Ambient Habit:** Header with subtle streak counter (`🔥 7 ngày`), profile avatar, and the "Continue" card.

### 2.2 Feed Top Section: "Continue" Card (Hero Panoramic Banner)
If the user has an active article, podcast, or video in progress (`0% < progress < 100%`), a panoramic 16:6 card appears at the top:
```text
Chào mừng trở lại, Minh! 👋                          "A better you is a collection
Mỗi chút mỗi ngày, bạn đang tiến bộ hơn.               of small efforts, repeated daily."

TIẾP TỤC
┌─────────────────────────────────────────────────────────────────┐
│ Why Do We Dream?                                                │
│ 🎧 Podcast · 5 phút                                             │
│ ██████████░░░░░░  Đã nghe 62%                                   │
│                                                                 │
│ [ ▶ Tiếp tục nghe ]               "Curiosity takes you further." │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Unified Mixed Content Stream (3-Column Grid)
Articles, Podcasts, and Videos are interleaved seamlessly in a single scrolling stream:
```text
Dành cho bạn       [ Tất cả ]  [ Bài đọc ]  [ Podcast ]  [ Video ]       Mới nhất ▾

┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│ [ THUMBNAIL ]         │  │ [ THUMBNAIL ]         │  │ [ THUMBNAIL ]         │
│ Bài đọc · 5 phút      │  │ 🎧 Podcast · 8 phút   │  │ 🎬 Video · 4:31       │
│                       │  │                       │  │                       │
│ Could Humans Really   │  │ The Power of Small    │  │ Why the Ocean         │
│ Live on Mars?         │  │ Habits                │  │ Matters               │
│                       │  │                       │  │                       │
│ Khoa học  Khám phá    │  │ Tâm lý  Bản thân      │  │ Môi trường  Thiên nhiên│
│ ♡ 1.2K   🔖   ···    │  │ ♡ 2.4K   🔖   ···    │  │ ♡ 3.1K   🔖   ···    │
└───────────────────────┘  └───────────────────────┘  └───────────────────────┘
```

### 2.4 Signature UX: In-Feed Review Nudge
When a user has scrolled for >= 10-15 minutes and has at least 3 cards due for review, an unobtrusive card is inserted into the feed:
```text
┌─────────────────────────────────────────────────────────┐
│ ⏱️ You've been scrolling for 12 minutes.                 │
│ 🧠 5 words are ready for review.                       │
│                                                         │
│ [ Review in 2 min → ]                       Maybe later │
└─────────────────────────────────────────────────────────┘
```
- Clicking **"Review in 2 min"** launches a focused 5-card SRS modal ([`docs/design/REVIEW.md`](../design/REVIEW.md)).
- Once finished: Celebratory toast (`"All done ✓ +15 XP"`), and user returns instantly to where they were scrolling.

---

## 3. Data & API Requirements
- `GET /api/v1/feed?page=0&size=10`: Returns mixed polymorphic content items with author, thumbnail, type (`ARTICLE`, `PODCAST`, `VIDEO`), duration, difficulty (`EASY`, `INTERMEDIATE`, `ADVANCED`), and category.
- `GET /api/v1/progress/recent`: Retrieves the most recently consumed content in progress for the "Tiếp tục" card.
- `POST /api/v1/contents/{id}/save`: Toggle bookmark in `saved_contents`.

## Frontend demo implementation — 2026-09-10

Home, Explore, Saved and History is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/feed/`](../../frontend/src/features/feed/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
- Screen index: [UI specifications](../design/) and [demo route matrix](../FRONTEND_DEMO.md#screen-coverage).
