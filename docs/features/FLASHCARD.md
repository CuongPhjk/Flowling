# Feature Specification: Fast Spaced Repetition Flashcards (SRS)

> **Tên hệ thống:** EnglishFlow 🌿 | **UI Brand:** Flowling (*"Good content. Better you."*)  
> **Liên kết kỹ thuật:**  
> - 🎨 Màn hình thiết kế: [`docs/design/REVIEW.md`](../design/REVIEW.md)  
> - 🗄️ Bảng dữ liệu: `user_vocabularies`, `vocabulary_contexts` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#6-fast-spaced-repetition-srs-review-rules)  
> - 💻 Frontend Code: `frontend/src/features/flashcard/`  
> - ☕ Backend Service: `com.englishflow.review.service.SrsReviewService`

---

## 1. Overview
Flashcard Review is the only screen in Flowling with a deliberate "study" feel, but it is engineered for speed, high focus, and zero burnout. Sessions are capped at 3 to 5 minutes, allowing learners to solidify vocabulary and immediately return to content browsing.

---

## 2. Review Session Mechanics

### 2.1 Starting the Session
- Accessible via the **`Ôn tập`** tab in the main navigation (with red badge indicator `12`), via the **Right Sidebar widget**, or triggered via the **In-Feed Review Nudge** ([`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#5-in-feed-review-nudge-signature-ux-rule)).
- Banner indicator: `"Ôn tập · 12 thẻ đang chờ"`.

### 2.2 Card Anatomy & Interaction

#### Front of Card (Recall Challenge):
```text
┌─────────────────────────────────────────────────────────┐
│ Thẻ 4 / 12                                           🔊 │
│                                                         │
│                      remarkably                         │
│                                                         │
│               [ /rɪˈmɑːrkəbli/ ]                        │
│                                                         │
│   "The findings were [...] consistent across groups."   │
│                                                         │
│             (Chạm để lật xem nghĩa và câu)              │
└─────────────────────────────────────────────────────────┘
```

#### Back of Card (Flipped):
```text
┌─────────────────────────────────────────────────────────┐
│                      remarkably                         │
│            một cách đáng kể / đáng chú ý                │
│                                                         │
│ Câu ngữ cảnh gốc:                                       │
│ "The findings were remarkably consistent                │
│ across different age groups."                           │
│                                                         │
│ 📖 Trích từ: Why Your Brain Needs Deep Sleep            │
└─────────────────────────────────────────────────────────┘
  [ Quên ]        [ Khó ]        [ Tốt ]        [ Dễ ]
  (Again - 1d)   (Hard - 2d)   (Good - 6d)   (Easy - 10d)
```

### 2.3 Four-Button Rating System (SuperMemo-2)
- **`Quên` (Again - Nút đỏ):** Quên từ. Lùi interval về 1 ngày, repetitions = 0. Thẻ xuất hiện lại ở cuối phiên.
- **`Khó` (Hard - Nút cam):** Nhớ khó khăn. Interval nhân 1.2, giảm nhẹ easeFactor.
- **`Tốt` (Good - Nút xanh lá):** Nhớ chuẩn. Tăng interval theo easeFactor.
- **`Dễ` (Easy - Nút xanh dương):** Nhớ tức thì. Tăng interval mạnh mẽ.

---

## 3. Completion & Quick Return to Feed

After completing the batch (~3-5 minutes):
```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                   Tuyệt vời! Bạn đã xong 🎉             │
│                                                         │
│                     12 từ đã được củng cố               │
│                            +35 XP                       │
│                                                         │
│                  [ Quay lại Feed lướt tiếp → ]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
The session never traps the user in endless drills. Once finished, they are cleanly guided right back to the Home content feed ([`docs/design/HOME.md`](../design/HOME.md)).

---

## 4. Endpoints
- `GET /api/v1/reviews/due?limit=20`: Fetch due cards for the current session.
- `POST /api/v1/reviews/{userVocabId}`: Submit recall rating (`AGAIN`, `HARD`, `GOOD`, `EASY`) and calculate new interval.

## Frontend demo implementation — 2026-09-10

Review and quick-review modal is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/flashcard/`](../../frontend/src/features/flashcard/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
- Screen index: [UI specifications](../design/) and [demo route matrix](../FRONTEND_DEMO.md#screen-coverage).
