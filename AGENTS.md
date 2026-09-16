# Agent Guidelines & Collaboration Principles for EnglishFlow

Welcome to the **EnglishFlow** repository! This document defines the architectural principles, product philosophy, design conventions, and guidelines for AI Agents and human developers contributing to this project.

---

## 1. Project Overview & Product Philosophy

- **System & Project Name:** EnglishFlow 🌿
- **User-Facing UI Brand:** **Flowling** (Tagline: *"Good content. Better you."*)
- **Mission:** An intelligent, content-first English platform where users browse articles, podcasts, and videos like a social media feed; unfamiliar vocabulary is captured seamlessly with a single click and reinforced silently in the background via lightweight Spaced Repetition (SRS).
- **Core Mantra:** *"Đừng để người dùng cảm giác họ đang 'vào web để học'. Họ vào vì có content thú vị để scroll; việc học diễn ra tự nhiên ở phía sau."*
- **Visual Identity:** Modern light-first canvas (`#F8F9FA`) with pure white cards (`#FFFFFF`), calming botanical emerald/sage green accents (`#16A34A` / `#22C55E` / `#EBF7EE`), and multi-tonal pastel tags ([`docs/DESIGN.md`](./docs/DESIGN.md)).
- **Tone & Code Quality:** Enterprise-grade, clean, maintainable, modular, and fully documented.

---

## 2. Technology Stack & Directory Boundaries

- **Backend (`backend/`):**
  - Java 21, Spring Boot 3.x
  - Spring Data JPA, Hibernate, PostgreSQL 16
  - Spring Security with stateless JWT authentication & refresh token rotation
  - Maven for build and dependency management
  - Architecture: Layered DDD aggregates (`user`, `content`, `progress`, `vocabulary`, `review`, `admin`).
- **Frontend (`frontend/`):**
  - React 18+ with TypeScript, Vite as build tool
  - Vanilla CSS design tokens based on [`docs/DESIGN.md`](./docs/DESIGN.md)
  - Lucide React for modern iconography
  - Architecture: Feature-based modular structure:
    - `src/app/` (App, router, providers, config)
    - `src/layouts/` (MainLayout, AuthLayout, AdminLayout)
    - `src/features/` (`feed`, `article`, `listening`, `vocabulary`, `flashcard`, `search`, `profile`, `auth`)
    - `src/shared/` (`components`, `hooks`, `api`, `utils`, `constants`, `types`)
    - `src/styles/` (`variables.css`, `globals.css`, `animations.css`)
- **DevOps & Infrastructure:**
  - Docker & Docker Compose (`docker-compose.yml`)

---

## 3. Agent Operating Rules (Must Strictly Follow)

1. **Never Make Assumptions About Business Logic:**
   Always consult [`docs/BUSINESS_RULES.md`](./docs/BUSINESS_RULES.md) and [`docs/features/`](./docs/features/) before designing or modifying domain behavior.
2. **Adhere to the 80/20 Rule:**
   80% of UI space and interaction focus belongs to authentic multimedia content (Articles, Podcasts, Videos). Gamification (Streak, XP, Progress) must remain ambient at 20%.
3. **No Visible "IELTS" or Academic Test Jargon on Frontend:**
   The frontend must NEVER display tags like "IELTS 6.5", "IELTS reading", or "Exam drill". Content difficulty must be labeled solely as `Easy`, `Intermediate`, or `Advanced` (or subtle CEFR `A1 - C1`). IELTS alignment is strictly an Admin content curation strategy across high-yield academic topics.
4. **Natural Navigation Conventions (6 Primary Tabs):**
   Do NOT use study-centric navigation words (`Learn`, `Study`, `Lesson`, `Course`, `Practice`). The standard navigation consists of 6 items:
   - `Trang chủ` (Home) 🏠 — [`docs/design/HOME.md`](./docs/design/HOME.md)
   - `Khám phá` (Explore) 🔍 — [`docs/design/EXPLORE.md`](./docs/design/EXPLORE.md)
   - `Đã lưu` (Saved) 🔖 — [`docs/design/SAVED.md`](./docs/design/SAVED.md)
   - `Ôn tập` (Review) 🧠 — [`docs/design/REVIEW.md`](./docs/design/REVIEW.md)
   - `Lịch sử` (History) ⏱️ — [`docs/design/HISTORY.md`](./docs/design/HISTORY.md)
   - `Hồ sơ` (Profile) 👤 — [`docs/design/PROFILE.md`](./docs/design/PROFILE.md)
5. **Preserve Context-Anchored Vocabulary Architecture (1:N:N):**
   Never store duplicate vocabulary entries per user. Follow the schema in [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md): `Vocabulary` (global) -> `UserVocabulary` (SRS state) -> `VocabularyContext` (all historical sentences across content). This powers the signature *"✓ Learning • You have seen this word 4 times"* UX ([`docs/features/VOCABULARY.md`](./docs/features/VOCABULARY.md)).
6. **Millisecond Synchronized Transcripts for Audio & Video:**
   Both Podcasts and Videos must utilize the unified `TranscriptSegment` table (`startMs`, `endMs`, `englishText`, `vietnameseText`, `position`) for synchronized highlighting and seeking ([`docs/features/LISTENING.md`](./docs/features/LISTENING.md), [`docs/features/VIDEO.md`](./docs/features/VIDEO.md)).
7. **Fast, Low-Burnout SRS Sessions:**
   Flashcard reviews are limited to 3-5 minute micro-sessions with 4 simple grades (`Again`, `Hard`, `Good`, `Easy`). Users must be immediately guided back to the content feed upon completion ([`docs/features/FLASHCARD.md`](./docs/features/FLASHCARD.md)).
8. **Maintain 2-Way Documentation Cross-Linking:**
   Every feature specification in `docs/features/` must explicitly link to its UI screen specification in `docs/design/`, its database tables in `docs/DATA_MODEL.md`, business rules in `docs/BUSINESS_RULES.md`, and frontend code folder in `frontend/src/features/`.
9. **Follow Architectural Conventions:**
   Refer to [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). Maintain strict separation of concerns (Controller -> Service -> Repository -> Entity for backend; Pages -> Components -> Hooks -> Services for frontend).
10. **Preserve Documentation Integrity:**
    Whenever a feature is added or updated, update the corresponding feature specification in `docs/features/`, design specification in `docs/design/`, and progress tracking in [`TASKS.md`](./TASKS.md).
11. **No Placeholders in Production Code:**
    Provide fully functional implementations without fake mock shortcuts unless explicitly asked for prototype stubbing.
