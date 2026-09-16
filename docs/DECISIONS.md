# EnglishFlow - Architecture Decision Records (ADRs)

This document records the architectural and technology choices made for EnglishFlow.

---

## ADR-001: Backend Framework Selection
- **Status:** Accepted
- **Context:** Need a strongly typed, enterprise-grade backend with robust relational data handling, security, and concurrency.
- **Decision:** Selected **Java 21 + Spring Boot 3.x**.
- **Consequences:** Solid Spring Security JWT mechanism, Spring Data JPA abstractions, predictable thread execution, and smooth Docker containerization.

---

## ADR-002: Relational Database Selection
- **Status:** Accepted
- **Context:** Complex relational queries required: Users, Unified Contents, Timestamped Segments, and 1:N:N Vocabulary Context occurrences.
- **Decision:** Selected **PostgreSQL 16**.
- **Consequences:** ACID guarantees, foreign key cascades, efficient composite indexes for feed and due flashcard queries.

---

## ADR-003: Frontend Architecture & Build System
- **Status:** Accepted
- **Context:** Fast developer iteration, rich interactive audio/video players, inline text popovers, and smooth mobile touch UX.
- **Decision:** Selected **React 18 + TypeScript + Vite**.
- **Consequences:** Instant Hot Module Replacement (HMR), granular component reusability, and small production bundle footprint.

---

## ADR-004: Spaced Repetition Algorithm Selection
- **Status:** Accepted
- **Context:** Need an evidence-based memory retention algorithm that fits fast 3-5 minute micro-sessions.
- **Decision:** Selected **SuperMemo-2 (SM-2)** with 4 user ratings (`Again`, `Hard`, `Good`, `Easy`).
- **Consequences:** Proven mathematical model; calculates ease factor, repetition count, and interval days without heavy computation.

---

## ADR-005: Content-First Social Feed vs Traditional LMS Architecture
- **Status:** Accepted
- **Context:** Traditional English apps fail because users dread "entering a site to study lessons" (Course -> Unit -> Lesson -> Exercise -> Exam).
- **Decision:** Position EnglishFlow as a **content feed in English** (Articles, Podcasts, Videos) where learning occurs implicitly in the background. Maintain an **80/20 ratio** (80% content immersion, 20% ambient gamification).
- **Consequences:** Eliminates study fatigue; boosts retention through organic curiosity. Home is a unified feed rather than a syllabus dashboard.

---

## ADR-006: Context-Decoupled Vocabulary Architecture (1:N:N)
- **Status:** Accepted
- **Context:** When users encounter words multiple times across different articles and podcasts, storing words in flat duplicate tables loses contextual richness.
- **Decision:** Split vocabulary into three tiers:
  1. `Vocabulary`: Global dictionary definition.
  2. `UserVocabulary`: User-specific SRS state.
  3. `VocabularyContext`: Specific sentence and source content where the user encountered the word.
- **Consequences:** Enables the signature **"✓ Learning • You have seen this word 4 times"** UX, revealing all past sentences and showing users how frequently words appear in authentic media.

---

## ADR-007: Unified Timestamped Segments (`TranscriptSegment`) for Audio & Video
- **Status:** Accepted
- **Context:** Audio podcasts and video clips both need real-time line-by-line subtitle highlighting, click-to-seek, and sentence replay.
- **Decision:** Share a single `TranscriptSegment` table (`start_ms`, `end_ms`, `english_text`, `vietnamese_text`, `position`) across both podcasts and videos.
- **Consequences:** Highly normalized backend schema; unified frontend `useTranscriptSync` hook and synchronized subtitle UI for both media types.

---

## ADR-008: Stealth IELTS Curriculum & Jargon-Free UX
- **Status:** Accepted
- **Context:** Labeling content with test tags ("IELTS 6.5", "Exam Drill") triggers anxiety and repels casual learners.
- **Decision:** Completely eliminate visible academic test labels from the client UI. Display only `Easy`, `Intermediate`, `Advanced`. Administrate IELTS readiness covertly through curated topics (Environment, Technology, Science, Psychology, Society).
- **Consequences:** Users experience the enjoyment of authentic content while stealthily acquiring the lexical resources and listening stamina needed for high academic test bands.

---

## ADR-009: Soothing Emerald / Sage Green Design System
- **Status:** Accepted
- **Context:** Extended reading and listening sessions cause eye strain if bright neon colors or aggressive alarms are used.
- **Decision:** Adopt a calming, botanical emerald/sage green palette (`--color-primary-600: #16A34A`, `--color-primary-500: #22C55E`) paired with cinematic dark slate backgrounds (`#0B0F12`, `#131A1E`).
- **Consequences:** Refreshing, high-contrast, comfortable visual tone that encourages long dwell times without visual fatigue.
