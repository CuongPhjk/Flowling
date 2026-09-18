# EnglishFlow - Project Task Board & MVP Roadmap

This document tracks milestones, deliverables, and actionable tasks for EnglishFlow (UI: Flowling), connecting every task directly with its **Feature Specification**, **UI Screen Design**, and **Source Code Directories**.

---

## 🚀 Current Milestone: MVP 0 — Admin CMS & Content Foundation

### Status Legend
- [ ] ⏳ **Todo / Backlog**
- [/] 🔄 **In Progress**
- [x] ✅ **Completed**

---

## 📌 Phase Overview & Epics

```text
MVP 0 (Admin & Content CMS)
  └──> MVP 1 (Content Consumption & Player)
         └──> MVP 2 (Learning Layer & SRS)
                └──> MVP 3 (Habit, Motivation & In-Feed Nudge)
```

---

### 🔹 MVP 0: Admin CMS & Content Foundation ([`docs/features/ADMIN.md`](./docs/features/ADMIN.md))
*Goal: Provide editors with robust authoring tools, media uploaders, and timestamped transcript segment editors before launching to learners.*

- [x] **Infrastructure & Database Setup:**
  - [x] Base project layout, Docker compose, and environment configuration
  - [x] Frontend modular folder structure initialized (`frontend/src/app`, `layouts`, `features`, `shared`, `styles`)
  - [x] Complete JPA schema entities and repositories: `users`, `contents`, `articles`, `transcript_segments`, `vocabularies`, `user_vocabularies`, `vocabulary_contexts`, `content_progress`, `saved_contents` ([`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md))
- [x] **Admin Authentication & Access Control:**
  - [x] Role-based access control with `@PreAuthorize("hasRole('ROLE_ADMIN')")`
  - [x] Stateless JWT authentication and security filter chain
- [x] **Admin CMS Dashboard & APIs ([`docs/design/admin/DASHBOARD.md`](./docs/design/admin/DASHBOARD.md)):**
  - [x] Content overview stats and management APIs with filters and status badges (`DRAFT` / `PUBLISHED`)
- [x] **Unified Content CRUD & Article Editor ([`docs/design/admin/ARTICLE_EDITOR.md`](./docs/design/admin/ARTICLE_EDITOR.md)):**
  - [x] Admin APIs for polymorphic content management (`ARTICLE`, `PODCAST`, `VIDEO`)
  - [x] Stealth academic category tagger (Science, Tech, Health, Psychology, Culture, etc.)
  - [x] English markdown body & Vietnamese translation management
- [x] **Timestamped Transcript Segment Editor ([`docs/design/admin/TRANSCRIPT_EDITOR.md`](./docs/design/admin/TRANSCRIPT_EDITOR.md)):**
  - [x] Millisecond transcript segment batch APIs (`startMs`, `endMs`, English text, Vietnamese translation)
  - [x] Synchronized segment storage and retrieval
- [x] **Seed Data & Environment:**
  - [x] DataInitializer seeding demo reader (`minh@flowling.demo`), editor (`admin@flowling.demo`), sample articles, podcasts with millisecond transcripts, and 1:N:N vocabularies

---

### 🔹 MVP 1: Content Consumption & Unified Feed ([`docs/features/FEED.md`](./docs/features/FEED.md))
*Goal: A frictionless, high-engagement content feed and multimedia players.*

- [x] **User Authentication & Profiles ([`docs/features/AUTH.md`](./docs/features/AUTH.md) | [`docs/design/AUTH.md`](./docs/design/AUTH.md)):**
  - [x] Backend User registration, login with JWT tokens (`POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/auth/me`)
  - [x] Google Identity Services login with server-side ID token verification (`POST /api/v1/auth/google`)
- [x] **Screen 1: Home Feed Backend & API ([`docs/design/HOME.md`](./docs/design/HOME.md)):**
  - [x] Polymorphic feed API (`GET /api/v1/feed?page=0&size=10`) interleaving Articles, Podcasts, Videos
  - [x] Progress tracking and saved bookmarks integration
  - [ ] 3-column layout matching mockup (`frontend/src/layouts/MainLayout.tsx`)
  - [ ] Hero "Tiếp tục" panoramic banner (`TIẾP TỤC`, title, progress bar, `▶ Tiếp tục nghe`)
  - [ ] 6 navigation items: `Trang chủ`, `Khám phá`, `Đã lưu`, `Ôn tập` (badge `12`), `Lịch sử`, `Hồ sơ`
- [ ] **Screen 2: Article Reader UI ([`docs/design/ARTICLE_READER.md`](./docs/design/ARTICLE_READER.md) | [`docs/features/ARTICLE.md`](./docs/features/ARTICLE.md)):**
  - [ ] Tri-mode switcher: `English` (Default), `Bilingual`, `Vietnamese` (`frontend/src/features/article/`)
  - [ ] Clean typographical canvas (max-width 720px) with reading progress heartbeat
- [ ] **Screen 3: Podcast Player & Transcript Sync ([`docs/design/PODCAST_PLAYER.md`](./docs/design/PODCAST_PLAYER.md) | [`docs/features/LISTENING.md`](./docs/features/LISTENING.md)):**
  - [ ] Audio playback controls (play/pause, `-10s`, `+10s`, `0.75x`, `1.0x`, `1.25x`) (`frontend/src/features/listening/`)
  - [ ] `useTranscriptSync` hook for millisecond segment highlight (`#EBF7EE`) and auto-scroll
  - [ ] Transcript mode toggle: `[ EN ]`, `[ EN + VI ]`, `[ Hide ]`
- [ ] **Screen 4: Video Player UI ([`docs/design/VIDEO_PLAYER.md`](./docs/design/VIDEO_PLAYER.md) | [`docs/features/VIDEO.md`](./docs/features/VIDEO.md)):**
  - [ ] Video playback paired with shared `TranscriptSegment` subtitles and scrollable transcript
- [ ] **Screen 5: History Timeline ([`docs/design/HISTORY.md`](./docs/design/HISTORY.md)):**
  - [ ] Reading scroll tracking and media playback heartbeat (`POST /api/v1/contents/{id}/progress`)

---

### 🔹 MVP 2: Implicit Learning Layer & Spaced Repetition ([`docs/features/VOCABULARY.md`](./docs/features/VOCABULARY.md), [`docs/features/FLASHCARD.md`](./docs/features/FLASHCARD.md))
*Goal: Background vocabulary capture without breaking content immersion.*

- [ ] **Interactive Word & Phrase Lookup:**
  - [ ] Click-to-lookup popover (headword, POS, Vietnamese definition, audio 🔊, contextual translation in this sentence)
  - [ ] One-click `+ Lưu vào sổ từ` action
  - [ ] Phrase selection drag menu (`Save phrase`, `Translate`, `Add note`)
- [ ] **1:N:N Normalized Vocabulary & Context Tracking ([`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md)):**
  - [ ] Store user vocabulary with sentence and source content in `vocabulary_contexts`
  - [ ] Signature UX: Re-encounter badge **"✓ Đang học • Bạn đã gặp từ này X lần"**
  - [ ] Context drawer displaying all historical occurrences across past articles and podcasts
- [ ] **Screen 6: Vocabulary Word Bank ([`docs/design/VOCABULARY.md`](./docs/design/VOCABULARY.md)):**
  - [ ] Filterable word bank (`All`, `Learning`, `Mastered`) with search and Web Speech API audio (`frontend/src/features/vocabulary/`)
- [ ] **Screen 7: Fast SRS Flashcard Review ([`docs/design/REVIEW.md`](./docs/design/REVIEW.md)):**
  - [ ] SuperMemo-2 (SM-2) scheduling algorithm implementation (`com.englishflow.review.SrsReviewService`)
  - [ ] 3D flip card UI: Front (word + IPA + audio + cloze hint) -> Back (meaning + original context) (`frontend/src/features/flashcard/`)
  - [ ] 4 rating buttons: `Quên` (Again), `Khó` (Hard), `Tốt` (Good), `Dễ` (Easy)
  - [ ] Fast 3-5 minute micro-sessions with completion celebration and immediate return to feed

---

### 🔹 MVP 3: Habit, Motivation & In-Feed Nudge ([`docs/DESIGN.md`](./docs/DESIGN.md), [`docs/BUSINESS_RULES.md`](./docs/BUSINESS_RULES.md))
*Goal: Sustainable retention and habitual practice without academic stress.*

- [ ] **Streak & XP Gamification (Ambient 20%):**
  - [ ] Daily streak tracking (`🔥 7 ngày`) based on qualifying actions (reading, listening, reviewing)
  - [ ] Botanical mindset card (`#EBF7EE`, 🌱, *"Learn from the world around you."*)
  - [ ] Lightweight XP awards for finished content and completed card reviews
- [ ] **Signature UX: In-Feed Review Nudge ([`docs/BUSINESS_RULES.md`](./docs/BUSINESS_RULES.md#5-in-feed-review-nudge-signature-ux-rule)):**
  - [ ] Feed dwell timer hook triggering after 10-15 minutes of scrolling
  - [ ] Inline friendly review prompt card with 2-minute quick review modal
- [ ] **Screen 8: Explore & Topic Discovery ([`docs/design/EXPLORE.md`](./docs/design/EXPLORE.md)):**
  - [ ] 9 pastel topic categories (Science, Tech, Health, Psychology, Culture, Environment, etc.)
  - [ ] Difficulty filter: `Easy`, `Intermediate`, `Advanced`
  - [ ] 5-minute quick content filter
- [ ] **Screen 9: Saved Content (Bookmarks) ([`docs/design/SAVED.md`](./docs/design/SAVED.md)):**
  - [ ] Bookmark collection tab for Articles, Podcasts, and Videos
- [ ] **Screen 10: Profile & Preferences ([`docs/design/PROFILE.md`](./docs/design/PROFILE.md)):**
  - [ ] User profile, streak statistics, 30-day activity heatmap, and light/dark theme toggle (`frontend/src/features/profile/`)

## Frontend Mock Milestone — 2026-09-10

Requested scope: complete interactive pages using mock data. [Coverage, routes and limitations](docs/FRONTEND_DEMO.md). These checks describe the frontend demo; existing API/production milestones above are not marked complete.

- [x] Six primary navigation pages and vocabulary bank; responsive light/dark UI and local covers.
- [x] Shared persisted bookmarks, likes, filters, recent progress and history.
- [x] English-first article reader, bilingual modes, lookup/phrases, notes and normalized vocabulary contexts.
- [x] Local audio/video playback, synchronized millisecond transcript, seeking/looping, saved quotes and resume.
- [x] Bounded SRS sessions, four grades, Again requeue, mastery, XP and feed return.
- [x] Profile, activity heatmap, preferences and local demo account flows.
- [x] Admin CRUD, drafts/publishing, cover/media uploads, preview and waveform.
- [x] Transcript split/merge/import and publishing validation.
- [x] Build, domain tests and browser flow verification.
- [ ] Replace mock state with backend API/auth/media services before production.
