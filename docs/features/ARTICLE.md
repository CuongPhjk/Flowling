# Feature Specification: Interactive Smart Article Reader

> **Tên hệ thống:** EnglishFlow 🌿 | **UI Brand:** Flowling (*"Good content. Better you."*)  
> **Liên kết kỹ thuật:**  
> - 🎨 Màn hình thiết kế: [`docs/design/ARTICLE_READER.md`](../design/ARTICLE_READER.md)  
> - 🗄️ Bảng dữ liệu: `contents`, `articles`, `vocabulary_contexts` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#2-article-reader-rules--modes)  
> - 💻 Frontend Code: `frontend/src/features/article/`  
> - ☕ Backend Service: `com.englishflow.content.service.ArticleService`, `com.englishflow.vocabulary.service.VocabularyService`

---

## 1. Overview
The Article Reader delivers an immersive reading experience where learners read authentic English articles comfortably. If they encounter unfamiliar terms, a single click provides the definition and saves the word along with its contextual sentence for spaced repetition.

---

## 2. Reading Modes (The Tri-Mode Switcher)

A persistent pill switcher sits at the top of the reading canvas:
`[ English ]` (Default) `[ Bilingual ]` `[ Vietnamese ]`

```text
Why We Dream
[ English ]  [ Bilingual ]  [ Vietnamese ]
```

### 2.1 English Mode (Strict Default)
- Displays only original English paragraphs.
- **Why default?** If bilingual mode is default, Vietnamese readers subconsciously skip the English and read only Vietnamese. English-first preserves cognitive engagement.

### 2.2 Bilingual Mode
- Displays each English paragraph followed immediately by its Vietnamese translation in a subtle, muted typography style.
- Ideal for beginners or difficult passages.

### 2.3 Vietnamese Mode
- Displays only the full Vietnamese translation for rapid comprehension checks.

---

## 3. Inline Interactive Vocabulary Lookup

### 3.1 Single Word Click
When a user clicks on any English word (e.g. `remarkably`):
A floating popover appears:
```text
┌──────────────────────────────────────────────┐
│ remarkably                             🔊    │
│ adv. · /rɪˈmɑːrkəbli/                        │
│                                              │
│ một cách đáng kể / đáng chú ý                │
│                                              │
│ Trong câu này:                               │
│ "remarkably consistent"                      │
│ → nhất quán một cách đáng chú ý              │
│                                              │
│ [ + Lưu vào sổ từ ]                         │
└──────────────────────────────────────────────┘
```

### 3.2 Multi-Word Phrase Selection
When a user drags and selects a phrase or idiom (e.g. `remarkably consistent`):
A contextual action bar opens:
- **`Save phrase`**: Saves the multi-word expression to vocabulary as a phrase.
- **`Translate`**: Displays an instant sentence-level translation.
- **`Add note`**: Allows attaching a private personal note.

---

## 4. Re-encountering Saved Words ("Seen X times")

If the reader contains words already in the user's `user_vocabularies` (e.g. `significant`):
1. The word receives a subtle emerald underline (`border-bottom: 2px solid #4ADE80`).
2. Clicking the word does **not** show `+ Lưu`.
3. Instead, it displays:
   ```text
   ┌──────────────────────────────────────────────┐
   │ significant                            🔊    │
   │ adj. · đáng kể                               │
   │                                              │
   │ ✓ Đang học • Bạn đã gặp từ này 4 lần         │
   │                                              │
   │ 1. "a significant increase in emissions..."  │
   │ 2. "a significant difference in memory..."   │
   │ 3. "significant impact on Mars..."           │
   │ 4. "significant improvement in sleep..."     │
   └──────────────────────────────────────────────┘
   ```
4. Clicking opens the Context History Drawer ([`docs/design/VOCABULARY.md`](../design/VOCABULARY.md)), psychologically reinforcing retention by showing users proof that the word appears consistently across real-world contexts.

---

## 5. Endpoints
- `GET /api/v1/contents/{slug}`: Retrieves article metadata, English text, and Vietnamese translation.
- `GET /api/v1/user-vocabularies/check?contentId={id}`: Returns list of word IDs already saved by this user in this text.
- `POST /api/v1/contents/{id}/progress`: Records reading scroll depth and dwell time.

## Frontend demo implementation — 2026-09-10

Article reader is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/article/`](../../frontend/src/features/article/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
- Screen index: [UI specifications](../design/) and [demo route matrix](../FRONTEND_DEMO.md#screen-coverage).
