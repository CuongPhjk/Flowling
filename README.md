# EnglishFlow 🌿 (UI Brand: Flowling)

> **Scroll captivating English content; absorb vocabulary naturally in the background.**  
> *"Đừng để người dùng cảm giác họ đang 'vào web để học'. Họ vào vì có content thú vị để scroll; việc học diễn ra tự nhiên ở phía sau."*  
> **Brand Identity:** Flowling — *"Good content. Better you."*

EnglishFlow is a modern, content-first English platform that combines the habitual browsing pleasure of a social media feed with a silent, context-driven vocabulary acquisition engine and lightweight Spaced Repetition (SRS).

---

## 🌟 Core Highlights & Product Philosophy

- **📱 3-Column Social Content Feed:** Articles, Podcasts, and Videos seamlessly mixed in one immersive "For You" stream ([`docs/design/HOME.md`](docs/design/HOME.md)). Content occupies 80% of the UI; gamification remains ambient at 20%.
- **📖 Tri-Mode Smart Reader:** Switch effortlessly between `English` (Strict default to prevent passive skimming), `Bilingual` (parallel paragraphs), and `Vietnamese` translations ([`docs/design/ARTICLE_READER.md`](docs/design/ARTICLE_READER.md)).
- **🎧 Synchronized Audio & Video Transcripts:** Millisecond-accurate timestamped segments (`TranscriptSegment`) with real-time highlighting, sentence replay, and instant word lookup ([`docs/design/PODCAST_PLAYER.md`](docs/design/PODCAST_PLAYER.md), [`docs/design/VIDEO_PLAYER.md`](docs/design/VIDEO_PLAYER.md)).
- **🧠 Context-Anchored Vocabulary (1:N:N):** Every saved word preserves the authentic sentences where you discovered it. Encountering the word again triggers the signature badge: **"✓ Learning • You have seen this word 4 times"** with full context history ([`docs/design/VOCABULARY.md`](docs/design/VOCABULARY.md)).
- **⚡ Fast SRS Flashcards (3-5 mins):** Lightweight SuperMemo-2 micro-reviews with 4 intuitive grades (`Again`, `Hard`, `Good`, `Easy`). Zero study fatigue—swiftly returns users to the feed ([`docs/design/REVIEW.md`](docs/design/REVIEW.md)).
- **⏱️ In-Feed Review Nudge:** Injects gentle prompts into the feed after extended scrolling (*"You've been scrolling for 12 minutes. 5 words are ready for review."*).
- **🌿 Soothing Botanical Green Design System:** A calming, nature-inspired visual identity (`#16A34A` / `#22C55E` / `#EBF7EE`) with multi-tonal pastel tags crafted for long, comfortable reading and listening sessions ([`docs/DESIGN.md`](docs/DESIGN.md)).
- **🎯 Stealth IELTS Content Strategy:** Absolute ban on visible exam tags or IELTS jargon on the frontend. IELTS readiness is achieved covertly through admin curation of high-yield academic topics (Science, Technology, Psychology, Environment, Society).

---

## 🏗️ Architecture & Code Layout

```
EnglishFlow/
├── backend/    # Java 21, Spring Boot 3.x, Spring Data JPA, Spring Security (JWT), PostgreSQL 16
│   └── src/main/java/com/englishflow/ (user, content, progress, vocabulary, review, admin)
│
├── frontend/   # React 18, TypeScript, Vite, Modern CSS Design Tokens (docs/DESIGN.md)
│   └── src/
│       ├── app/        # App root, router, providers, config
│       ├── layouts/    # MainLayout (3-column), AuthLayout, AdminLayout
│       ├── features/   # feed, article, listening, vocabulary, flashcard, search, profile, auth
│       ├── shared/     # components, hooks, api, utils, constants, types
│       └── styles/     # variables.css, globals.css, animations.css
│
├── docs/       # Architecture, Design System, Data Model, Business Rules & Feature Specs
└── docker-compose.yml
```

---

## 📖 Master Documentation Index

All project documentation is fully 2-way cross-linked for seamless navigation:

### 1. Foundation & Architecture
- [Project Charter & Product Vision](docs/PROJECT.md)
- [Global Design System](docs/DESIGN.md)
- [System Architecture & Master Cross-Reference Matrix](docs/ARCHITECTURE.md)
- [Business Rules & Domain Logic](docs/BUSINESS_RULES.md)
- [Data Model & Database Schema](docs/DATA_MODEL.md)
- [Architecture Decision Records (ADRs)](docs/DECISIONS.md)
- [Project Task Board & MVP Roadmap](TASKS.md)
- [AI Agent Guidelines & Operating Rules](AGENTS.md)

### 2. UI / UX Screen Specifications ([`docs/design/`](docs/design/))
- [01. Home Feed (3-Column Dashboard)](docs/design/HOME.md)
- [02. Explore & Topic Categories](docs/design/EXPLORE.md)
- [03. Article Reader (Tri-Mode & Lookup)](docs/design/ARTICLE_READER.md)
- [04. Podcast Player & Synchronized Transcript](docs/design/PODCAST_PLAYER.md)
- [05. Video Player & Interactive Subtitles](docs/design/VIDEO_PLAYER.md)
- [06. Vocabulary Bank & Context Drawer ("Seen X Times")](docs/design/VOCABULARY.md)
- [07. Fast Spaced Repetition Review (SM-2 Flashcards)](docs/design/REVIEW.md)
- [08. Saved Bookmarks Library](docs/design/SAVED.md)
- [09. Consumption History Timeline](docs/design/HISTORY.md)
- [10. User Profile, Streak & Heatmap](docs/design/PROFILE.md)
- [11. Authentication & Social Login](docs/design/AUTH.md)
- **Admin Tooling (MVP 0 Foundation):**
  - [Admin CMS Dashboard](docs/design/admin/DASHBOARD.md)
  - [Admin Article Editor](docs/design/admin/ARTICLE_EDITOR.md)
  - [Admin Media Uploader](docs/design/admin/MEDIA_EDITOR.md)
  - [Admin Timestamped Transcript Editor](docs/design/admin/TRANSCRIPT_EDITOR.md)

### 3. Feature Domain Specifications ([`docs/features/`](docs/features/))
- [Unified Feed & Discovery](docs/features/FEED.md)
- [Interactive Article Reader](docs/features/ARTICLE.md)
- [Podcast Audio & Synchronization](docs/features/LISTENING.md)
- [Video Player & Subtitles](docs/features/VIDEO.md)
- [Vocabulary & Contexts Engine (1:N:N)](docs/features/VOCABULARY.md)
- [Spaced Repetition Flashcards](docs/features/FLASHCARD.md)
- [Administrator CMS & Content Publishing](docs/features/ADMIN.md)
- [Authentication & User Accounts](docs/features/AUTH.md)

---

## 🚀 Quick Start Guide

### Interactive frontend demo

All user and Admin screens can now be explored with shared mock data, without starting the backend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Demo accounts, routes, implemented interactions and service boundaries are documented in [Frontend Demo](docs/FRONTEND_DEMO.md). Run `npm test`, `npm run test:e2e`, and `npm run build` from `frontend/` to verify.

### Docker foundation

```bash
# 1. Copy environment variables
cp .env.example .env

# Configure Google Sign-In in .env with the same Web client ID:
# GOOGLE_CLIENT_ID=...apps.googleusercontent.com
# VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com

# 2. Start full Docker stack
docker-compose up --build

# 3. Access applications:
# Frontend App: http://localhost:3000
# Backend API:  http://localhost:8080/api
# PostgreSQL:   localhost:5432
```

For direct `npm run dev`, copy `frontend/.env.example` to `frontend/.env` and fill `VITE_GOOGLE_CLIENT_ID`. The Google Cloud OAuth Web client must allow `http://localhost:3000` as an Authorized JavaScript origin.
