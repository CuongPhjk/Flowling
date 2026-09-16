# EnglishFlow - System Architecture & Technical Design

This document details the system design, layered boundaries, module decomposition, and full 2-way cross-referencing between backend domains, database models, frontend code modules, and UI design specifications.

---

## 1. High-Level Architecture Overview

EnglishFlow follows a clean, decoupled client-server architecture:

```
                    ┌─────────────────────────────────────────┐
                    │      Browser Client (Flowling UI)       │
                    │         React 18 + Vite + TS            │
                    │     Botanical Emerald / Sage Green      │
                    └────────────────────┬────────────────────┘
                                         │
                                         │ HTTPS / REST / JSON
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │            Spring Boot 3 API            │
                    │        (Security, JWT, JPA 3.x)         │
                    └────────────────────┬────────────────────┘
                                         │
           ┌─────────────────────────────┴─────────────────────────────┐
           ▼                                                           ▼
┌──────────────────────────────┐                         ┌──────────────────────────────┐
│        PostgreSQL 16         │                         │      Media Object Store      │
│ (Relational Data, Segments,  │                         │ (Audio .mp3, Cover Images,   │
│ 1:N:N Vocabulary Contexts)   │                         │  Video Streams / Embeds)     │
└──────────────────────────────┘                         └──────────────────────────────┘
```

---

## 2. Master Cross-Reference Architecture Matrix

This matrix provides 2-way coherence between **Business Feature Specifications**, **UI Screen Designs**, **Database Tables**, **Frontend Code Paths**, and **Backend Domains**:

| Module / Screen | Feature Spec (`docs/features/`) | UI Screen Design (`docs/design/`) | Database Entities (`docs/DATA_MODEL.md`) | Frontend Code Path (`frontend/src/`) | Backend Service (`com.englishflow.*`) |
|---|---|---|---|---|---|
| **Trang chủ (Home Feed)** | [`FEED.md`](./features/FEED.md) | [`HOME.md`](./design/HOME.md) | `contents`, `content_progress` | `features/feed/`, `layouts/MainLayout.tsx` | `content.ContentService`, `progress.ProgressService` |
| **Khám phá (Explore / Search)**| [`FEED.md`](./features/FEED.md) | [`EXPLORE.md`](./design/EXPLORE.md) | `contents` | `features/search/` | `content.ContentService` |
| **Đọc bài (Article Reader)** | [`ARTICLE.md`](./features/ARTICLE.md) | [`ARTICLE_READER.md`](./design/ARTICLE_READER.md) | `contents`, `articles`, `vocabulary_contexts` | `features/article/` | `content.ArticleService`, `vocabulary.VocabularyService` |
| **Nghe Podcast (Podcast Player)**| [`LISTENING.md`](./features/LISTENING.md) | [`PODCAST_PLAYER.md`](./design/PODCAST_PLAYER.md) | `contents`, `transcript_segments` | `features/listening/` | `content.MediaService`, `progress.ProgressService` |
| **Xem Video (Video Player)** | [`VIDEO.md`](./features/VIDEO.md) | [`VIDEO_PLAYER.md`](./design/VIDEO_PLAYER.md) | `contents`, `transcript_segments` | `features/listening/` (Shared Media) | `content.MediaService` |
| **Sổ từ vựng (Word Bank)** | [`VOCABULARY.md`](./features/VOCABULARY.md) | [`VOCABULARY.md`](./design/VOCABULARY.md) | `vocabularies`, `user_vocabularies`, `vocabulary_contexts` | `features/vocabulary/` | `vocabulary.UserVocabularyService` |
| **Ôn tập (Flashcard Review)** | [`FLASHCARD.md`](./features/FLASHCARD.md) | [`REVIEW.md`](./design/REVIEW.md) | `user_vocabularies`, `vocabulary_contexts` | `features/flashcard/` | `review.SrsReviewService` |
| **Đã lưu (Saved Bookmarks)** | [`FEED.md`](./features/FEED.md) | [`SAVED.md`](./design/SAVED.md) | `saved_contents`, `contents` | `features/feed/`, `layouts/MainLayout.tsx` | `progress.SavedContentService` |
| **Lịch sử (History Timeline)** | [`FEED.md`](./features/FEED.md) | [`HISTORY.md`](./design/HISTORY.md) | `content_progress`, `contents` | `features/feed/` | `progress.ProgressService` |
| **Hồ sơ (Profile & Progress)** | [`AUTH.md`](./features/AUTH.md) | [`PROFILE.md`](./design/PROFILE.md) | `users`, `user_vocabularies` | `features/profile/` | `user.UserService` |
| **Xác thực (Auth / Login / Register)**| [`AUTH.md`](./features/AUTH.md) | [`AUTH.md`](./design/AUTH.md) | `users` | `features/auth/`, `layouts/AuthLayout.tsx` | `user.AuthService`, `security.JwtTokenProvider` |
| **Admin CMS Dashboard** | [`ADMIN.md`](./features/ADMIN.md) | [`admin/DASHBOARD.md`](./design/admin/DASHBOARD.md) | `contents`, `users`, `vocabularies` | `admin/dashboard/`, `layouts/AdminLayout.tsx` | `admin.AdminDashboardService` |
| **Admin Article Editor** | [`ADMIN.md`](./features/ADMIN.md) | [`admin/ARTICLE_EDITOR.md`](./design/admin/ARTICLE_EDITOR.md) | `contents`, `articles` | `admin/content/` | `admin.AdminContentService` |
| **Admin Media Uploader** | [`ADMIN.md`](./features/ADMIN.md) | [`admin/MEDIA_EDITOR.md`](./design/admin/MEDIA_EDITOR.md) | `contents` | `admin/content/` | `admin.MediaUploadService` |
| **Admin Transcript Synchronizer**| [`ADMIN.md`](./features/ADMIN.md) | [`admin/TRANSCRIPT_EDITOR.md`](./design/admin/TRANSCRIPT_EDITOR.md)| `transcript_segments` | `admin/content/` | `admin.TranscriptSegmentService` |

---

## 3. Backend Domain Decomposition (`backend/src/main/java/com/englishflow`)

The backend is organized into clean domain packages:

```
com.englishflow
├── common/             # Global response envelope, global exception handler, pagination
├── config/             # SecurityConfig, CorsConfig, StorageConfig, JpaAuditingConfig
├── security/           # JwtAuthenticationFilter, JwtTokenProvider, CustomUserDetailsService
│
├── user/               # User authentication, registration, profile & habit statistics
│   ├── entity/User.java
│   ├── repository/UserRepository.java
│   ├── service/UserService.java, AuthService.java
│   └── controller/AuthController.java, UserController.java
│
├── content/            # Unified Content Catalog (Articles, Podcasts, Videos)
│   ├── entity/Content.java (type: ARTICLE, PODCAST, VIDEO)
│   ├── entity/Article.java
│   ├── entity/TranscriptSegment.java
│   ├── repository/ContentRepository.java, TranscriptSegmentRepository.java
│   ├── service/ContentService.java, MediaService.java
│   └── controller/ContentController.java, TranscriptController.java
│
├── progress/           # Continue listening/reading, completion heartbeat, streak logic
│   ├── entity/ContentProgress.java
│   ├── entity/SavedContent.java
│   ├── repository/ContentProgressRepository.java, SavedContentRepository.java
│   ├── service/ProgressService.java, SavedContentService.java
│   └── controller/ProgressController.java
│
├── vocabulary/         # 1:N:N Normalized Lexicon and Context Tracking
│   ├── entity/Vocabulary.java
│   ├── entity/UserVocabulary.java
│   ├── entity/VocabularyContext.java
│   ├── repository/VocabularyRepository.java, UserVocabularyRepository.java, VocabularyContextRepository.java
│   ├── service/VocabularyService.java, UserVocabularyService.java
│   └── controller/VocabularyController.java
│
├── review/             # Fast Spaced Repetition (SuperMemo-2) Engine
│   ├── service/SrsReviewService.java
│   └── controller/ReviewController.java
│
└── admin/              # Back-office CMS, media uploader, transcript segment editor
    ├── service/AdminContentService.java, MediaUploadService.java
    └── controller/AdminContentController.java, AdminMediaController.java
```

---

## 4. Frontend Code Architecture (`frontend/src`)

The client code follows a strict feature-based modular design:

```
frontend/src/
├── app/                # App initialization & root configuration
│   ├── App.tsx         # Root component mounting providers and router
│   ├── router.tsx      # Route definitions matching the 10 Core Screens & Admin
│   ├── providers.tsx   # React Query, AuthContext, ThemeProvider wrappers
│   └── config.ts       # Environment constants and API base URLs
│
├── layouts/            # Page layouts matching docs/design/
│   ├── MainLayout.tsx  # 3-column desktop layout (Left Nav, Center Stream, Right Widgets)
│   ├── AuthLayout.tsx  # Split-screen modern authentication canvas
│   └── AdminLayout.tsx # CMS admin sidebar & toolbar layout
│
├── features/           # Domain feature modules (Self-contained)
│   ├── auth/           # Login, Register, Forgot Password, Google OAuth2
│   ├── feed/           # Home stream, Continue card, FeedCard grid, In-feed review prompt
│   ├── article/        # Tri-mode ArticleReader, Word lookup popover, Phrase selection
│   ├── listening/      # PodcastPlayer, VideoPlayer, Synchronized transcript engine
│   ├── vocabulary/     # Word bank list, "Seen X times" ContextHistoryDrawer
│   ├── flashcard/      # Fast 3-5m SRS review modal & screen (4 buttons Again/Hard/Good/Easy)
│   ├── search/         # Explore page, 9 topic cards, difficulty filters (Easy/Med/Hard)
│   └── profile/        # User profile, Streak Flame 🔥, 30-day activity heatmap
│
├── shared/             # Reusable foundation across all features
│   ├── api/            # Central Axios HTTP client with JWT interceptors
│   ├── components/     # Atom & molecule UI (Button, Card, Modal, Badge, Input)
│   ├── hooks/          # Shared hooks (useDebounce, useSpeech, useLocalStorage)
│   ├── utils/          # Date formatters, time parser, text helpers
│   ├── constants/      # Topic taxonomy, navigation items, difficulty tiers
│   └── types/          # Common ApiResponse, PaginatedResult, UserSummary
│
├── assets/             # Media assets (images/, icons/, fonts/)
│
└── styles/             # Design tokens & global CSS (docs/DESIGN.md)
    ├── variables.css   # Color palette (Botanical green, pastel categories, canvas)
    ├── globals.css     # CSS reset, typography base, scrollbars
    └── animations.css  # 3D card flip, smooth modal fade, badge pulses
```

---

## 5. Key End-to-End Data & Interaction Flows

### 5.1 Content Feed & Continue Bar Flow
```text
User opens Web (Flowling UI)
   │
   ├─► GET /api/v1/feed?page=0&size=10
   │     └─► ContentService queries contents table (Interleaved Article, Podcast, Video)
   │
   ├─► GET /api/v1/progress/recent
   │     └─► ProgressService checks content_progress table for 0% < progress < 100%
   │     └─► If found: Render Hero "Tiếp tục" panoramic card (e.g. "Why Do We Dream? 62%")
   │
   ▼
User browses 3-column feed with pastel topic badges
```

### 5.2 Context-Preserving Vocabulary & "Seen X Times" Flow
```text
User clicks a word in Article Reader or Podcast Transcript
   │
   ├─► GET /api/v1/user-vocabularies/check?word=significant
   │
   ├─► Case A: Word not yet saved
   │     └─► Popup displays definition, IPA 🔊, contextual meaning in this sentence
   │     └─► User clicks [+ Lưu vào sổ từ]
   │     └─► POST /api/v1/user-vocabularies (creates user_vocabularies + vocabulary_contexts)
   │
   └─► Case B: Word already saved previously
         └─► Popup displays "✓ Đang học • Bạn đã gặp từ này 4 lần"
         └─► User clicks to view ContextHistoryDrawer
         └─► GET /api/v1/user-vocabularies/{id}/contexts
         └─► Displays all 4 historical sentences from past articles/podcasts
```

### 5.3 Millisecond Audio/Video Transcript Synchronization Flow
```text
User plays Podcast / Video
   │
   ├─► GET /api/v1/contents/{slug}/segments (sorted by position ASC)
   │
   ▼
Media playback fires onTimeUpdate: currentTimeMs
   │
   ▼
useTranscriptSync evaluates: startMs <= currentTimeMs < endMs
   │
   ├─► Applies active highlight: background #EBF7EE + border-left 3px #16A34A
   └─► Auto-scrolls smoothly to keep sentence centered in viewport
```
# Current frontend implementation

The browser-only implementation now covers the specified user and Admin screens. [Frontend Demo](FRONTEND_DEMO.md) maps every route to the specifications, documents persistence and mock service boundaries, and lists the verification commands. Feature pages are under `frontend/src/features/`, shared UI/data under `frontend/src/shared/`, and account/domain state under `frontend/src/app/providers.tsx`.
