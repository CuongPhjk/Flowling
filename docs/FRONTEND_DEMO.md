# Flowling — Frontend demo

This is the interactive frontend requested with mock data. It runs independently of the Spring Boot API. Existing backend milestones in [TASKS.md](../TASKS.md) remain separate from this implementation.

## Run and sign in

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Hash-based routes also work on static hosting without server rewrite rules.

| Role | Email | Password |
| --- | --- | --- |
| Reader | `minh@flowling.demo` | `Flowling123!` |
| Editor | `admin@flowling.demo` | `Flowling123!` |

The initial session opens as the demo reader. Use **Không gian biên tập** in the sidebar, or `/#/login?admin=1`, to sign in as the editor. Account registration creates an independent, initially empty personal library. Google account selection and password recovery are explicitly simulated; no email is sent and no external Google session is accessed.

## Screen coverage

| Screen / route | Implemented frontend behavior | Specifications |
| --- | --- | --- |
| Home `/#/` | Mixed feed, type/search/sort filters, likes, persistent bookmarks, recent continue card, load more, review nudge after 8 visible cards or 10 minutes; 30-minute snooze and 5-card modal | [Feed](features/FEED.md), [Home](design/HOME.md) |
| Explore `/#/explore` | Nine topics, URL topic filter, search suggestions, Ctrl/Cmd K, difficulty and duration filters, empty state | [Explore](design/EXPLORE.md) |
| Saved `/#/saved` | Shared bookmarks, removal, search, format and duration sorting | [Saved](design/SAVED.md) |
| Article `/#/article/:slug` | English-first reader, three language modes, font size, headings/bold/emphasis subset, word lookup, phrase selection, context notes, reading heartbeat and scroll position | [Article](features/ARTICLE.md), [Reader](design/ARTICLE_READER.md) |
| Podcast `/#/podcast/:slug` | Local narrated audio, pause/play, seek, ±10 seconds, speed, bilingual transcript, highlighting, auto-scroll, sentence loop, saved quotes and vocabulary | [Listening](features/LISTENING.md), [Player](design/PODCAST_PLAYER.md) |
| Video `/#/video/:slug` | Local narrated video, native controls, subtitle overlay, shared transcript interaction, theater layout | [Video](features/VIDEO.md), [Player](design/VIDEO_PLAYER.md) |
| Vocabulary `/#/vocabulary` | Word/meaning/context search; Learning/Mastered filters; recent/frequency/due sorting; pronunciation; delete confirmation; context drawer; editable notes; saved sentences with time links | [Vocabulary](features/VOCABULARY.md), [Word bank](design/VOCABULARY.md) |
| Review `/#/review` | Due cards; 3D flip and Space; four grades with 1–4 shortcuts; Again requeue; bounded session; persisted schedules; XP and return to feed | [Flashcards](features/FLASHCARD.md), [Review](design/REVIEW.md) |
| History `/#/history` | Date groups; incomplete/completed filters; resume; saved context counts; clear confirmation | [History](design/HISTORY.md) |
| Profile `/#/profile` | Name/avatar editing, 30-day heatmap, streak/XP/word/time totals, theme, media speed, reading preference and logout | [Profile](design/PROFILE.md) |
| Login / register / forgot password | Email/password form validation, visibility toggle, remembered or session-only login, separate account data, demo role guards, simulated Google selection/reset | [Auth](features/AUTH.md), [Screen](design/AUTH.md) |
| Admin `/#/admin` | Live totals, filters/search/pagination, preview, status toggle, edit, transcript entry and delete confirmation | [Admin](features/ADMIN.md), [Dashboard](design/admin/DASHBOARD.md) |
| Article editor `/#/admin/article/new` or `:id` | Auto slug, English/VI paragraphs, lightweight Markdown, preview, cover upload, topic/difficulty/author/teaser, word count and keywords, draft/publish | [Article editor](design/admin/ARTICLE_EDITOR.md) |
| Media editor `/#/admin/media/new?type=PODCAST` or `VIDEO` / `:id` | File upload/drop, persistent media assets, direct URL input, native preview, decoded audio waveform, duration extraction, save and continue to transcript | [Media editor](design/admin/MEDIA_EDITOR.md) |
| Transcript editor `/#/admin/transcript/:id` | Millisecond inputs; add/delete/split/merge; SRT/VTT/LRC import; known-sentence translation suggestions; playback highlighting; time bounds/overlap/bilingual validation; draft/publish | [Transcript editor](design/admin/TRANSCRIPT_EDITOR.md) |

## Data and architecture

- [Router](../frontend/src/app/router.tsx), [state provider](../frontend/src/app/providers.tsx), [types](../frontend/src/shared/types/demo.ts), [seed](../frontend/src/shared/mock/seed.ts).
- [Main layout](../frontend/src/layouts/MainLayout.tsx) and [page styles](../frontend/src/styles/pages.css) provide responsive navigation, light/dark tokens, keyboard focus, dialogs with focus trapping and reduced-motion support.
- Global vocabulary, user vocabulary schedules and historical contexts remain separate. Contexts are deduplicated by user vocabulary + content + sentence. Reopening a page does not increase the encounter count for an identical context.
- Reader state is stored per account in `localStorage` under `flowling-demo-v1`. Uploaded media is stored in IndexedDB `flowling-media`; generated object URLs are released after use. Avatar files are limited to 1 MB, cover files to 2 MB, media to 100 MB.
- [SRS scheduling](../frontend/src/features/flashcard/services/srs.ts) applies 4 grades, an ease floor of 1.3 and both mastery thresholds. The initial Good intervals are 1 and 6 days before multiplying by ease. Sessions end at 5 minutes / 20 total attempts, or 2 minutes for the quick modal. XP is awarded once per distinct word per session; Again retries do not award extra XP.
- [Transcript synchronization](../frontend/src/features/listening/hooks/useTranscriptSync.ts) uses the media clock and `[startMs, endMs)` bounds. [Import/validation](../frontend/src/features/admin/services/transcript.ts) is shared with publishing checks.
- Articles open in English, following the stricter business rule even if a bilingual preference is saved. The other modes remain one click away.
- Original local vector covers and locally generated narrated WAV/MP4 clips make the seeded content independent of remote media availability. [Cover generator](../frontend/scripts/generate-covers.cjs); [narration generator](../frontend/scripts/generate-media.ps1) uses Windows SAPI + FFmpeg. Media segments are short demo excerpts; their displayed duration is the actual duration.

## Mock boundaries

This implementation provides browser interactions and local state, not production authentication, API synchronization, database migrations or server RBAC. Password hashing is a demo convenience; client-side role checks are not a security boundary. Replacing the mock store with API-backed services is a subsequent backend integration task.

The local dictionary covers sample vocabulary. An unknown word can be saved with a user-entered meaning and the available sentence translation. Translation suggestions match the supplied sample sentences; they do not invoke an AI translation service. The article editor supports headings, bold and emphasis, rather than a full Markdown engine. Media synchronization currently supports native audio/video files and direct media URLs; YouTube iframe / Cloudflare embed SDK integration is outside this local demo.

Clear this site's browser storage to restore the seed (this also removes locally created accounts/content). No production data is used.

## Verification

```bash
cd frontend
npm run build
npm test
npm run test:e2e
```

Browser tests use installed Chrome by default; set `PLAYWRIGHT_CHANNEL=msedge` to use Edge. The suite covers routes, mobile overflow, bookmarks, vocabulary deduplication, flashcards, media, accounts, and Admin publishing. Screenshots are written into ignored `frontend/test-results/`.

Cross-references: [Architecture](ARCHITECTURE.md), [data model](DATA_MODEL.md), [business rules](BUSINESS_RULES.md), [design system](DESIGN.md), [task board](../TASKS.md).
