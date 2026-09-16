# EnglishFlow - Data Model & Database Schema

> **Hệ thống:** EnglishFlow 🌿 (UI Brand: Flowling)  
> Tài liệu này định nghĩa cấu trúc cơ sở dữ liệu quan hệ PostgreSQL 16, được tối ưu hóa cho luồng feed đa hình (Article, Podcast, Video), phụ đề transcript chuẩn mili-giây, và mô hình lưu trữ ngữ cảnh từ vựng tách rời **1:N:N** (`Vocabulary` ── `UserVocabulary` ── `VocabularyContext`).

---

## 1. Entity-Relationship Overview & Feature Mapping

```text
                      [users]
                      │     │
            1         │     │         1
       ┌──────────────┘     └──────────────┐
       │ N                                 │ N
[content_progress]                 [user_vocabularies] ── N : 1 ── [vocabularies]
       │ N                                 │ 1
       │                                   │
       │ 1                                 │ N
   [contents] (ARTICLE, PODCAST, VIDEO)    [vocabulary_contexts]
    │       │                              │
    │ 1     │ 1                            │ N : 1 (optional)
    │       └──────────────────────────────┘
    │ 1
    ├── 1 : 1 ── [articles]
    └── 1 : N ── [transcript_segments]
```

### Bảng Liên Kết Thực Thể & Tính Năng:
- **`contents` + `articles`:** [`docs/features/ARTICLE.md`](./features/ARTICLE.md) | Màn hình: [`docs/design/ARTICLE_READER.md`](./design/ARTICLE_READER.md)
- **`contents` + `transcript_segments`:** [`docs/features/LISTENING.md`](./features/LISTENING.md), [`docs/features/VIDEO.md`](./features/VIDEO.md) | Màn hình: [`docs/design/PODCAST_PLAYER.md`](./design/PODCAST_PLAYER.md), [`docs/design/VIDEO_PLAYER.md`](./design/VIDEO_PLAYER.md)
- **`vocabularies` + `user_vocabularies` + `vocabulary_contexts`:** [`docs/features/VOCABULARY.md`](./features/VOCABULARY.md) | Màn hình: [`docs/design/VOCABULARY.md`](./design/VOCABULARY.md) ("Seen X times" Drawer)
- **`user_vocabularies` (SRS):** [`docs/features/FLASHCARD.md`](./features/FLASHCARD.md) | Màn hình: [`docs/design/REVIEW.md`](./design/REVIEW.md)
- **`content_progress`:** [`docs/features/FEED.md`](./features/FEED.md) | Màn hình: [`docs/design/HOME.md`](./design/HOME.md) (Thanh "Tiếp tục"), [`docs/design/HISTORY.md`](./design/HISTORY.md)
- **`saved_contents`:** [`docs/features/FEED.md`](./features/FEED.md) | Màn hình: [`docs/design/SAVED.md`](./design/SAVED.md)
- **`users`:** [`docs/features/AUTH.md`](./features/AUTH.md) | Màn hình: [`docs/design/AUTH.md`](./design/AUTH.md), [`docs/design/PROFILE.md`](./design/PROFILE.md)

---

## 2. Chi Tiết Các Bảng Dữ Liệu

### 2.1 `users`
Lưu trữ hồ sơ người dùng, thông tin xác thực JWT và chỉ số thói quen.  
*Entity Java:* `com.englishflow.user.entity.User`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | BIGSERIAL | PK | Mã định danh người dùng |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập |
| `password_hash` | VARCHAR(255) | NOT NULL | Mật khẩu băm BCrypt |
| `full_name` | VARCHAR(100) | NOT NULL | Tên hiển thị (VD: Minh Nguyễn) |
| `avatar_url` | VARCHAR(500) | NULL | Đường dẫn ảnh đại diện |
| `role` | VARCHAR(20) | NOT NULL DEFAULT 'ROLE_USER' | `ROLE_USER` hoặc `ROLE_ADMIN` |
| `current_streak` | INT | NOT NULL DEFAULT 0 | Chuỗi ngày liên tục (`🔥 7 ngày`) |
| `total_xp` | INT | NOT NULL DEFAULT 0 | Tổng điểm kinh nghiệm |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT NOW() | Ngày tạo tài khoản |
| `updated_at` | TIMESTAMP | NOT NULL DEFAULT NOW() | Lần cập nhật cuối |

---

### 2.2 `contents`
Bảng danh mục chung đa hình cho cả 3 loại nội dung: Bài đọc, Podcast, và Video.  
*Entity Java:* `com.englishflow.content.entity.Content`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | BIGSERIAL | PK | ID nội dung |
| `type` | VARCHAR(20) | NOT NULL | `ARTICLE`, `PODCAST`, `VIDEO` |
| `title` | VARCHAR(255) | NOT NULL | Tiêu đề nội dung |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | Đường dẫn URL (VD: `why-do-we-dream`) |
| `description` | TEXT | NOT NULL | Tóm tắt 2 dòng hiển thị trên Feed card |
| `thumbnail_url` | VARCHAR(500) | NOT NULL | Ảnh bìa 16:10 / 16:9 |
| `media_url` | VARCHAR(500) | NULL | URL file audio (.mp3) hoặc link stream video |
| `duration_seconds`| INT | NOT NULL DEFAULT 0 | Thời lượng đọc hoặc độ dài media tính bằng giây |
| `difficulty` | VARCHAR(20) | NOT NULL DEFAULT 'INTERMEDIATE'| `EASY`, `INTERMEDIATE`, `ADVANCED` |
| `category` | VARCHAR(50) | NOT NULL | 9 chủ đề pastel (`Science`, `Tech`, `Health`,...) |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'DRAFT' | `DRAFT` hoặc `PUBLISHED` |
| `published_at` | TIMESTAMP | NULL | Thời điểm xuất bản |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT NOW() | Thời điểm tạo |
| `updated_at` | TIMESTAMP | NOT NULL DEFAULT NOW() | Lần cập nhật cuối |

*Chỉ mục (Indexes):*
- `idx_contents_feed`: `(status, published_at DESC)` — Tối ưu hóa truy vấn Feed trang chủ.
- `idx_contents_type_diff`: `(type, difficulty, status)` — Tối ưu hóa bộ lọc Khám phá.

---

### 2.3 `articles`
Bảng mở rộng dành riêng cho nội dung văn bản (`ARTICLE`).  
*Entity Java:* `com.englishflow.content.entity.Article`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `content_id` | BIGINT | PK, FK -> contents(id) ON DELETE CASCADE | Khóa ngoại nối với bảng `contents` |
| `english_body` | TEXT | NOT NULL | Nội dung tiếng Anh gốc cho English/Bilingual mode |
| `vietnamese_body`| TEXT | NOT NULL | Bản dịch tiếng Việt hoàn chỉnh cho Vietnamese mode |

---

### 2.4 `transcript_segments`
Bảng phụ đề chia đoạn theo mili-giây dùng chung cho cả Podcast và Video.  
*Entity Java:* `com.englishflow.content.entity.TranscriptSegment`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | BIGSERIAL | PK | ID phân đoạn |
| `content_id` | BIGINT | FK -> contents(id) ON DELETE CASCADE | Thuộc về Podcast hoặc Video nào |
| `start_ms` | INT | NOT NULL | Mốc bắt đầu (mili-giây, VD: 2400ms = 00:02.40) |
| `end_ms` | INT | NOT NULL | Mốc kết thúc (mili-giây, VD: 6800ms = 00:06.80) |
| `english_text` | TEXT | NOT NULL | Câu nói tiếng Anh |
| `vietnamese_text`| TEXT | NOT NULL | Bản dịch tiếng Việt của riêng câu đó |
| `position` | INT | NOT NULL | Số thứ tự câu (0, 1, 2, ...) |

*Chỉ mục (Indexes):*
- `idx_segments_content_pos`: `(content_id, position ASC)`
- `idx_segments_time`: `(content_id, start_ms, end_ms)`

---

### 2.5 `vocabularies`
Từ điển chung chuẩn hóa toàn hệ thống.  
*Entity Java:* `com.englishflow.vocabulary.entity.Vocabulary`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | BIGSERIAL | PK | ID từ vựng |
| `term` | VARCHAR(100) | UNIQUE, NOT NULL | Từ gốc chuẩn hóa (VD: `perspective`, `remarkable`) |
| `part_of_speech` | VARCHAR(50) | NOT NULL | `noun`, `verb`, `adjective`, `adverb`, `phrase` |
| `meaning_vi` | TEXT | NOT NULL | Nghĩa tiếng Việt cốt lõi |
| `phonetic` | VARCHAR(100) | NULL | Phiên âm quốc tế IPA (VD: `/pərˈspektɪv/`) |
| `audio_url` | VARCHAR(500) | NULL | File audio phát âm chuẩn bản xứ |

---

### 2.6 `user_vocabularies` (Trạng Thái SRS Của Từng Người Dùng)
Lưu trữ trạng thái ghi nhớ theo thuật toán SuperMemo-2 (SM-2).  
*Entity Java:* `com.englishflow.vocabulary.entity.UserVocabulary`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | BIGSERIAL | PK | Khóa chính quan hệ User - Vocab |
| `user_id` | BIGINT | FK -> users(id) ON DELETE CASCADE | Người học |
| `vocabulary_id` | BIGINT | FK -> vocabularies(id) ON DELETE CASCADE | Từ vựng đang học |
| `status` | VARCHAR(20) | NOT NULL DEFAULT 'LEARNING' | `LEARNING`, `MASTERED` |
| `ease_factor` | FLOAT | NOT NULL DEFAULT 2.5 | Hệ số nhân độ dễ của thuật toán SM-2 |
| `interval_days` | INT | NOT NULL DEFAULT 1 | Khoảng cách ngày đến lần ôn tiếp theo |
| `repetitions` | INT | NOT NULL DEFAULT 0 | Số lần ôn tập thành công liên tiếp |
| `next_review_at`| TIMESTAMP | NOT NULL DEFAULT NOW() | Thời điểm đến hạn ôn tập flashcard |
| `last_reviewed_at`| TIMESTAMP | NULL | Thời điểm hoàn thành ôn tập gần nhất |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT NOW() | Ngày đầu tiên người dùng lưu từ này |

*Ràng buộc (Constraints):*
- `uq_user_vocabulary`: UNIQUE (`user_id`, `vocabulary_id`)
- `idx_user_vocab_due`: `(user_id, next_review_at)` — Phục vụ truy vấn nhanh danh sách thẻ chờ ôn.

---

### 2.7 `vocabulary_contexts` (Lưu Trữ Mọi Ngữ Cảnh Tái Gặp 1:N:N)
*Entity Java:* `com.englishflow.vocabulary.entity.VocabularyContext`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | BIGSERIAL | PK | ID ngữ cảnh |
| `user_vocabulary_id`| BIGINT | FK -> user_vocabularies(id) ON DELETE CASCADE | Thuộc về từ vựng của user nào |
| `content_id` | BIGINT | FK -> contents(id) ON DELETE SET NULL | Nguồn bài đọc/podcast bắt gặp từ này |
| `sentence` | TEXT | NOT NULL | Câu văn hoàn chỉnh chứa từ vựng |
| `translation` | TEXT | NULL | Bản dịch tiếng Việt của câu văn |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT NOW() | Thời điểm bắt gặp từ này |

*Ý nghĩa kiến trúc:*
Khi người dùng gặp lại từ ở bài số 2, số 3, hay số 4:
- Hệ thống không tạo thêm `user_vocabularies` mới.
- Hệ thống chèn thêm 1 bản ghi vào `vocabulary_contexts`.
- Đếm `COUNT(vocabulary_contexts)` để hiển thị huy hiệu: **"✓ Đang học • Bạn đã gặp từ này 4 lần"** kèm danh sách câu ngữ cảnh.

---

### 2.8 `content_progress`
Theo dõi tiến trình đọc / nghe, phục vụ thanh Hero "Tiếp tục" và trang Lịch sử.  
*Entity Java:* `com.englishflow.progress.entity.ContentProgress`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | BIGSERIAL | PK | ID tiến trình |
| `user_id` | BIGINT | FK -> users(id) ON DELETE CASCADE | Người dùng |
| `content_id` | BIGINT | FK -> contents(id) ON DELETE CASCADE | Nội dung đã tiêu thụ |
| `progress_percentage`| FLOAT | NOT NULL DEFAULT 0.0 | Tỷ lệ hoàn thành (VD: 62.0%) |
| `last_position_seconds`| INT | NOT NULL DEFAULT 0 | Mốc thời gian nghe dở (giây) hoặc vị trí cuộn |
| `is_completed` | BOOLEAN | NOT NULL DEFAULT FALSE | True nếu đã hoàn thành bài |
| `updated_at` | TIMESTAMP | NOT NULL DEFAULT NOW() | Lần xem/nghe gần nhất |

*Ràng buộc (Constraints):*
- `uq_user_content_progress`: UNIQUE (`user_id`, `content_id`)

---

### 2.9 `saved_contents` (Bookmarks)
*Entity Java:* `com.englishflow.progress.entity.SavedContent`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | BIGSERIAL | PK | ID bookmark |
| `user_id` | BIGINT | FK -> users(id) ON DELETE CASCADE | Người dùng |
| `content_id` | BIGINT | FK -> contents(id) ON DELETE CASCADE | Nội dung được lưu lại |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT NOW() | Ngày lưu bookmark |

*Ràng buộc (Constraints):*
- `uq_user_saved_content`: UNIQUE (`user_id`, `content_id`)
