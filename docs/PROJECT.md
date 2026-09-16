# EnglishFlow - Project Charter & Product Definition

> **"Đừng để người dùng cảm giác họ đang 'vào web để học'. Họ vào vì có content thú vị để scroll; việc học diễn ra tự nhiên ở phía sau."**  
> **Tên hệ thống:** EnglishFlow 🌿 | **Tên hiển thị thương hiệu trên UI:** **Flowling** (Tagline: *"Good content. Better you."*)

---

## 1. Product Vision & Definition

EnglishFlow được định nghĩa là:
> **Một content feed bằng tiếng Anh, nơi người dùng đọc bài, nghe podcast, xem video như đang dùng mạng xã hội; gặp từ/câu không hiểu thì xem tiếng Việt và lưu lại, sau đó hệ thống tự đưa chúng vào vòng lặp flashcard củng cố.**

### Triết lý cốt lõi:
1. **Content First, Study Later:** Flashcard **không phải** là nơi bắt đầu học. Nội dung thực tế, hấp dẫn mới là điểm khởi đầu. Flashcard chỉ là hệ thống củng cố (consolidation engine) chạy ngầm phía sau ([`docs/features/FLASHCARD.md`](./features/FLASHCARD.md)).
2. **80% Content / 20% Gamification:** 80% không gian thị giác dành cho nội dung chất lượng cao; 20% dành cho động lực nhẹ nhàng (streak, thanh tiến trình, review prompt thân thiện).
3. **Stealth Curriculum (Không IELTS hóa giao diện):** Tuyệt đối không xuất hiện các từ khóa học thuật như *"IELTS 5.0"*, *"IELTS vocabulary"*, *"Exam Prep"*, hay *"Lesson/Study"*. Độ khó chỉ hiển thị là `Easy`, `Intermediate`, `Advanced` (hoặc CEFR `A1 - C1`). Tinh thần IELTS nằm trọn vẹn trong chiến lược biên tập chủ đề của Admin (Science, Technology, Psychology, Environment, Society, Culture,...). Xem chi tiết tại [`docs/BUSINESS_RULES.md`](./BUSINESS_RULES.md#7-stealth-ielts-curriculum-strategy).
4. **Hệ Thống Thiết Kế Thảo Mộc Xanh Dịu:** Tông xanh lá không chói kết hợp cùng nền sáng tinh tế và hệ thẻ pastel cho 9 chủ đề ([`docs/DESIGN.md`](./DESIGN.md)).

---

## 2. The Core Learning Loop

```text
       Mở Web (Flowling)
         ↓
    Scroll Feed (Dành cho bạn)
         ↓
  Thấy content thú vị
         ↓
  Đọc / Nghe / Xem (Article / Podcast / Video)
         ↓
   Gặp từ chưa biết
         ↓
  Xem nghĩa / Tiếng Việt (Popup dịch ngữ cảnh)
         ↓
   Save Vocabulary (Kèm câu gốc)
         ↓
   Tiếp tục Content (Không đứt đoạn cảm xúc)
         ↓
   Một lúc khác / Giữa lúc scroll feed
         ↓
  Flashcard nhắc lại (SRS 3-5 phút)
         ↓
 Gặp lại từ đó trong content mới ("Seen 4 times")
         ↓
     Nhớ từ tự nhiên
```

---

## 3. Product Loop Architecture

```text
              CONTENT FEED (Article + Podcast + Video)
                                 ↑
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
               READ                            LISTEN
             (Article)                    (Podcast / Video)
                 │                               │
                 └────────── Vocabulary ─────────┘
                                 │
                                 ↓
                              REVIEW
                       (Fast 3-5m SRS Decks)
                                 │
                                 ↓
                            Remembered
                                 │
                                 ↓
                    Re-encountered in New Content
                     ("Seen 4 times" Highlight)
                                 │
                                 ↓
                            CONTENT FEED
```

---

## 4. Ba Loại Content & Trải Nghiệm Home Feed

Hệ thống hỗ trợ 3 định dạng content chuẩn:
- 📖 **ARTICLE:** Bài đọc với chế độ đọc 3 mode, tra từ 1 chạm, bôi đen lưu cụm từ ([`docs/design/ARTICLE_READER.md`](./design/ARTICLE_READER.md)).
- 🎧 **PODCAST:** Audio đính kèm transcript timestamped chuẩn từng mili-giây, highlight theo giọng đọc ([`docs/design/PODCAST_PLAYER.md`](./design/PODCAST_PLAYER.md)).
- 🎬 **VIDEO:** Video clip ngắn/dài kèm transcript segment tương tự podcast ([`docs/design/VIDEO_PLAYER.md`](./design/VIDEO_PLAYER.md)).

### Trải nghiệm Home Feed:
- Home **không phải** là dashboard học tập chia bài hay khóa học.
- Toàn bộ nội dung (Article, Podcast, Video) được **trộn lẫn trong một Feed duy nhất (Dành cho bạn)** ([`docs/design/HOME.md`](./design/HOME.md)).
- Người dùng lướt như mạng xã hội: thấy podcast nghe thử, thấy bài đọc ngắn thì đọc, thấy video thú vị thì bấm xem.
- Explore tab ([`docs/design/EXPLORE.md`](./design/EXPLORE.md)) vẫn cho phép lọc theo 9 chủ đề và độ khó khi cần, nhưng Home luôn là unified stream.

---

## 5. Mười Màn Hình Cốt Lõi (10 Core Screens)

Mỗi màn hình được đặc tả chi tiết tại thư mục [`docs/design/`](./design/) và kết nối với tài liệu tính năng [`docs/features/`](./features/):

1. **Xác thực (Auth / Login / Register):** Đăng ký, đăng nhập nhanh với Email/Password hoặc Google OAuth2 ([`docs/design/AUTH.md`](./design/AUTH.md) | [`docs/features/AUTH.md`](./features/AUTH.md)).
2. **Trang chủ (Home Feed):** Bố cục 3 cột, Hero banner "Tiếp tục", Feed card hỗn hợp, và widgets thói quen ([`docs/design/HOME.md`](./design/HOME.md) | [`docs/features/FEED.md`](./features/FEED.md)).
3. **Khám phá (Explore):** Lọc theo 9 chủ đề pastel, thời lượng dưới 5 phút, và độ khó `Easy/Medium/Hard` ([`docs/design/EXPLORE.md`](./design/EXPLORE.md) | [`docs/features/FEED.md`](./features/FEED.md)).
4. **Trình đọc bài viết (Article Reader):** Trình đọc 3 chế độ (`English` mặc định, `Bilingual`, `Vietnamese`), popup tra từ 1-click, lưu cụm từ ([`docs/design/ARTICLE_READER.md`](./design/ARTICLE_READER.md) | [`docs/features/ARTICLE.md`](./features/ARTICLE.md)).
5. **Trình phát Podcast (Podcast Player):** Trình phát audio kèm thanh tiến trình, chỉnh tốc độ (0.75x - 1.25x), transcript timestamped tự động highlight ([`docs/design/PODCAST_PLAYER.md`](./design/PODCAST_PLAYER.md) | [`docs/features/LISTENING.md`](./features/LISTENING.md)).
6. **Trình phát Video (Video Player):** Trình phát video tích hợp phụ đề tương tác trên màn hình và transcript cuộn đồng bộ ([`docs/design/VIDEO_PLAYER.md`](./design/VIDEO_PLAYER.md) | [`docs/features/VIDEO.md`](./features/VIDEO.md)).
7. **Sổ từ vựng (Vocabulary Bank):** Quản lý từ vựng cá nhân, Drawer "Seen X times" hiển thị toàn bộ câu ngữ cảnh quá khứ ([`docs/design/VOCABULARY.md`](./design/VOCABULARY.md) | [`docs/features/VOCABULARY.md`](./features/VOCABULARY.md)).
8. **Ôn tập Flashcard (Review):** Ôn tập SRS tốc độ cao (3-5 phút), 4 nút bấm (`Again`, `Hard`, `Good`, `Easy`), tự động quay về feed ([`docs/design/REVIEW.md`](./design/REVIEW.md) | [`docs/features/FLASHCARD.md`](./features/FLASHCARD.md)).
9. **Nội dung đã lưu (Saved Content):** Quản lý bài đọc, podcast, video đã bookmark để xem lại khi rảnh ([`docs/design/SAVED.md`](./design/SAVED.md) | [`docs/features/FEED.md`](./features/FEED.md)).
10. **Lịch sử tiêu thụ (History):** Dòng thời gian các nội dung đang xem dở dang và đã hoàn thành ([`docs/design/HISTORY.md`](./design/HISTORY.md) | [`docs/features/FEED.md`](./features/FEED.md)).
11. **Hồ sơ cá nhân (Profile & Progress):** Thống kê streak 🔥 7 ngày, heatmap hoạt động 30 ngày, XP, và cài đặt ([`docs/design/PROFILE.md`](./design/PROFILE.md) | [`docs/features/AUTH.md`](./features/AUTH.md)).

---

## 6. Lộ Trình Triển Khai MVP (4 Phases)

Lộ trình chi tiết và tiến độ từng task được quản lý tại [`TASKS.md`](../TASKS.md):

### 🔹 MVP 0 — Admin CMS & Content Foundation ([`docs/features/ADMIN.md`](./features/ADMIN.md))
*Mục tiêu: Đảm bảo có nội dung chuẩn và công cụ quản trị trước khi phục vụ người dùng.*
- Admin Dashboard ([`docs/design/admin/DASHBOARD.md`](./design/admin/DASHBOARD.md)).
- Article Editor ([`docs/design/admin/ARTICLE_EDITOR.md`](./design/admin/ARTICLE_EDITOR.md)).
- Media Uploader ([`docs/design/admin/MEDIA_EDITOR.md`](./design/admin/MEDIA_EDITOR.md)).
- Transcript Segment Editor ([`docs/design/admin/TRANSCRIPT_EDITOR.md`](./design/admin/TRANSCRIPT_EDITOR.md)).
- Database migrations: `contents`, `articles`, `transcript_segments` ([`docs/DATA_MODEL.md`](./DATA_MODEL.md)).

### 🔹 MVP 1 — Content Consumption ([`docs/features/FEED.md`](./features/FEED.md))
*Mục tiêu: Trải nghiệm tiêu thụ nội dung mượt mà, gây nghiện, không lỗi.*
- Đăng ký / Đăng nhập / Profile cơ bản (`frontend/src/features/auth/`).
- Home Feed 3 cột (`frontend/src/features/feed/`).
- Article Reader hoàn chỉnh (`frontend/src/features/article/`).
- Podcast Player & Video Player đồng bộ transcript (`frontend/src/features/listening/`).
- Lịch sử xem / đọc, thanh "Tiếp tục nghe/đọc" (`content_progress`).

### 🔹 MVP 2 — Learning Layer ([`docs/features/VOCABULARY.md`](./features/VOCABULARY.md), [`docs/features/FLASHCARD.md`](./features/FLASHCARD.md))
*Mục tiêu: Kích hoạt cơ chế học ngầm mà không làm phiền trải nghiệm đọc.*
- Click từ: Popup tra từ tức thì kèm câu ngữ cảnh.
- Menu bôi đen cụm từ (`Save phrase`).
- Vocabulary Contexts 1:N:N (`vocabularies` -> `user_vocabularies` -> `vocabulary_contexts`).
- Signature UX: Hiển thị badge `✓ Đang học • Bạn đã gặp từ này X lần`.
- Flashcard Review: Trình ôn tập Anki/SM-2 siêu nhanh (3-5 phút).

### 🔹 MVP 3 — Habit & Discovery Layer ([`docs/DESIGN.md`](./DESIGN.md))
*Mục tiêu: Giữ chân người dùng và tạo thói quen bền vững.*
- Chuỗi ngày hoạt động (Streak 🔥) và điểm XP nhẹ nhàng.
- Signature UX: **In-Feed Review Prompt** (Gợi ý ôn 5 từ trong 2 phút khi lướt feed quá 10-15 phút).
- Explore page nâng cao (Bộ lọc 9 chủ đề, nội dung 5 phút, trending).
- Danh sách Saved Bookmarks.

---

## 7. Signature UX Features

1. **Re-encounter Context Badge ("Seen X times"):**  
   Khi người dùng gặp lại từ đã lưu trong một bài viết hoặc podcast mới, từ vựng được gạch chân nhẹ. Click vào sẽ mở Drawer xem lại toàn bộ ngữ cảnh trong quá khứ ([`docs/design/VOCABULARY.md`](./design/VOCABULARY.md)).
2. **In-Feed Review Nudge:**  
   Khi đang lướt feed khoảng 10-15 phút:  
   > *"⏱️ You've been scrolling for 12 minutes. 🧠 5 words are ready for review. [Review 2 min] | Maybe later"*  
   Nhẹ nhàng, không ép buộc. Xong 2 phút là quay lại feed ngay lập tức ([`docs/BUSINESS_RULES.md`](./BUSINESS_RULES.md#5-in-feed-review-nudge-signature-ux-rule)).
