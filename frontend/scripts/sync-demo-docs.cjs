const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
const mapping = {
  "features/FEED.md": ["feed", "Home, Explore, Saved and History"],
  "features/ARTICLE.md": ["article", "Article reader"],
  "features/LISTENING.md": ["listening", "Podcast player"],
  "features/VIDEO.md": ["listening", "Video player"],
  "features/VOCABULARY.md": [
    "vocabulary",
    "Vocabulary bank and context drawer",
  ],
  "features/FLASHCARD.md": ["flashcard", "Review and quick-review modal"],
  "features/AUTH.md": ["auth", "Authentication and profile"],
  "features/ADMIN.md": [
    "admin",
    "Dashboard, content/media and transcript editors",
  ],
  "design/HOME.md": ["feed", "/#/"],
  "design/EXPLORE.md": ["feed", "/#/explore"],
  "design/SAVED.md": ["feed", "/#/saved"],
  "design/HISTORY.md": ["feed", "/#/history"],
  "design/ARTICLE_READER.md": ["article", "/#/article/:slug"],
  "design/PODCAST_PLAYER.md": ["listening", "/#/podcast/:slug"],
  "design/VIDEO_PLAYER.md": ["listening", "/#/video/:slug"],
  "design/VOCABULARY.md": ["vocabulary", "/#/vocabulary"],
  "design/REVIEW.md": ["flashcard", "/#/review"],
  "design/AUTH.md": ["auth", "/#/login, /#/register, /#/forgot-password"],
  "design/PROFILE.md": ["profile", "/#/profile"],
  "design/admin/DASHBOARD.md": ["admin", "/#/admin"],
  "design/admin/ARTICLE_EDITOR.md": ["admin", "/#/admin/article/:id"],
  "design/admin/MEDIA_EDITOR.md": ["admin", "/#/admin/media/:id"],
  "design/admin/TRANSCRIPT_EDITOR.md": ["admin", "/#/admin/transcript/:id"],
};
for (const [file, [feature, screen]] of Object.entries(mapping)) {
  const target = path.join(root, "docs", file);
  let body = fs.readFileSync(target, "utf8");
  const deep = file.startsWith("design/admin/");
  const up = deep ? "../../" : "../";
  const code = deep ? "../../../" : "../../";
  const marker = "## Frontend demo implementation — 2026-09-10";
  body = body.split("\n" + marker)[0].trimEnd();
  body += `\n\n${marker}\n\n${screen} is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](${up}FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.\n\n- Frontend: [\`frontend/src/features/${feature}/\`](${code}frontend/src/features/${feature}/).\n- Domain reference: [Data model](${up}DATA_MODEL.md) and [Business rules](${up}BUSINESS_RULES.md).\n`;
  if (file.startsWith("features/"))
    body += `- Screen index: [UI specifications](${up}design/) and [demo route matrix](${up}FRONTEND_DEMO.md#screen-coverage).\n`;
  fs.writeFileSync(target, body);
}
const taskPath = path.join(root, "TASKS.md");
let tasks = fs.readFileSync(taskPath, "utf8");
const taskMarker = "## Frontend Mock Milestone — 2026-09-10";
tasks = tasks.split("\n" + taskMarker)[0].trimEnd();
tasks += `\n\n${taskMarker}\n\nRequested scope: complete interactive pages using mock data. [Coverage, routes and limitations](docs/FRONTEND_DEMO.md). These checks describe the frontend demo; existing API/production milestones above are not marked complete.\n\n- [x] Six primary navigation pages and vocabulary bank; responsive light/dark UI and local covers.\n- [x] Shared persisted bookmarks, likes, filters, recent progress and history.\n- [x] English-first article reader, bilingual modes, lookup/phrases, notes and normalized vocabulary contexts.\n- [x] Local audio/video playback, synchronized millisecond transcript, seeking/looping, saved quotes and resume.\n- [x] Bounded SRS sessions, four grades, Again requeue, mastery, XP and feed return.\n- [x] Profile, activity heatmap, preferences and local demo account flows.\n- [x] Admin CRUD, drafts/publishing, cover/media uploads, preview and waveform.\n- [x] Transcript split/merge/import and publishing validation.\n- [x] Build, domain tests and browser flow verification.\n- [ ] Replace mock state with backend API/auth/media services before production.\n`;
fs.writeFileSync(taskPath, tasks);
