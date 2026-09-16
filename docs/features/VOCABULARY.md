# Feature Specification: Vocabulary Notebook & Context Engine (1:N:N)

> **Tên hệ thống:** EnglishFlow 🌿 | **UI Brand:** Flowling (*"Good content. Better you."*)  
> **Liên kết kỹ thuật:**  
> - 🎨 Màn hình thiết kế: [`docs/design/VOCABULARY.md`](../design/VOCABULARY.md)  
> - 🗄️ Bảng dữ liệu: `vocabularies`, `user_vocabularies`, `vocabulary_contexts` ([`docs/DATA_MODEL.md`](../DATA_MODEL.md))  
> - ⚖️ Quy tắc nghiệp vụ: [`docs/BUSINESS_RULES.md`](../BUSINESS_RULES.md#3-vocabulary-re-encounter--context-tracking-rules-1nn)  
> - 💻 Frontend Code: `frontend/src/features/vocabulary/`  
> - ☕ Backend Service: `com.englishflow.vocabulary.service.UserVocabularyService`

---

## 1. Overview
The Vocabulary system serves as each learner's personal vocabulary bank. It departs fundamentally from traditional dictionary apps by anchoring every single word to the authentic sentences and multimedia where it was encountered.

---

## 2. Context-Preserving Architecture (1:N:N Model)

Unlike naive systems that duplicate words per encounter or strip away context, EnglishFlow utilizes a strict 3-tier model:

```text
    [vocabularies] (Từ điển chung chuẩn hóa toàn cầu)
         │
         │ 1 : N
         ▼
  [user_vocabularies] (Trạng thái SRS của User: status, easeFactor, interval, nextReviewAt)
         │
         │ 1 : N
         ▼
[vocabulary_contexts] (Ngữ cảnh 1: "A significant increase in renewable energy was recorded...")
                      (Ngữ cảnh 2: "There was a significant difference in memory recall...")
                      (Ngữ cảnh 3: "This could have a significant impact on exploration...")
```

---

## 3. The Signature "Seen X Times" Re-encounter UX

Khi người dùng bắt gặp lại một từ đã lưu trong bài đọc hoặc podcast mới:
1. Từ vựng được gạch chân xanh lá dịu mắt (`border-bottom: 2px solid #4ADE80`).
2. Nhấp vào từ sẽ mở Drawer xem lại toàn bộ ngữ cảnh quá khứ ([`docs/design/VOCABULARY.md`](../design/VOCABULARY.md)):
   ```text
   significant                              🔊
   adj. · một cách đáng kể / quan trọng

   ✓ Đang học
   Bạn đã gặp từ này 4 lần trên feed:

   [1] "A significant increase in renewable energy adoption was recorded."
       📖 Bài đọc: Climate Solutions 2026

   [2] "There was a significant difference in memory recall rates."
       🎧 Podcast: The Science of Sleep

   [3] "This discovery could have a significant impact on medicine."
       🎬 Video: Deep Sea Discoveries

   [4] "A remarkably significant achievement for the space program."
       📖 Bài đọc: Humans on Mars (Hiện tại)
   ```
3. **Tác Động Tâm Lý:** Thấy từ xuất hiện 3-4 lần ở các ngữ cảnh thực tế khác nhau là bằng chứng xác thực giúp não bộ tự động củng cố trí nhớ dài hạn.

---

## 4. Personal Word Bank Screen

Users can view and manage their vocabulary bank from the `Review` or `Profile` screen:
- **Filters:** All, `Đang học` (Learning), `Đã thuộc` (Mastered).
- **Search:** Real-time search across English headwords, Vietnamese meanings, and context sentences.
- **Context Drawer:** Clicking any card expands all historical contexts where the user saw the word.
- **Audio:** Native pronunciation audio playback button 🔊 on every card (Web Speech API).

---

## 5. Endpoints
- `GET /api/v1/user-vocabularies?status=LEARNING&page=0&size=20`: Paginated list of user's saved words.
- `POST /api/v1/user-vocabularies`: Save a new word along with its first `VocabularyContext`.
- `GET /api/v1/user-vocabularies/{vocabId}/contexts`: Retrieve all context sentences for a word.
- `DELETE /api/v1/user-vocabularies/{id}`: Remove a word from the notebook.

## Frontend demo implementation — 2026-09-10

Vocabulary bank and context drawer is implemented with shared mock data and persistent browser interactions. See [Frontend demo coverage and limitations](../FRONTEND_DEMO.md) for the exact scope, accounts, routes and verification. Production API work remains tracked separately.

- Frontend: [`frontend/src/features/vocabulary/`](../../frontend/src/features/vocabulary/).
- Domain reference: [Data model](../DATA_MODEL.md) and [Business rules](../BUSINESS_RULES.md).
- Screen index: [UI specifications](../design/) and [demo route matrix](../FRONTEND_DEMO.md#screen-coverage).
