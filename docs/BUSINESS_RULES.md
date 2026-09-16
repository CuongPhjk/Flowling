# EnglishFlow - Business Rules & Domain Logic

> **Tên hệ thống:** EnglishFlow 🌿 | **Tên hiển thị thương hiệu trên UI:** **Flowling** (Tagline: *"Good content. Better you."*)  
> Tài liệu này đặc tả toàn bộ quy tắc nghiệp vụ (Business Rules), thuật toán lặp lại ngắt quãng (SRS), và các ràng buộc tương tác, được liên kết 2 chiều với cơ sở dữ liệu ([`docs/DATA_MODEL.md`](./DATA_MODEL.md)), thiết kế giao diện ([`docs/design/`](./design/)), và đặc tả tính năng ([`docs/features/`](./features/)).

---

## 1. Content-First Feed & Navigation Rules

*Liên kết:* [`docs/features/FEED.md`](./features/FEED.md) | [`docs/design/HOME.md`](./design/HOME.md) | Bảng: `contents`, `content_progress`

1. **80/20 Aesthetic Ratio:**
   - 80% diện tích giao diện và sự chú ý dành trọn cho nội dung đa phương tiện hấp dẫn (Bài đọc, Podcast, Video).
   - 20% dành cho các chỉ số thói quen nhẹ nhàng (Streak counter, thanh tiến trình "Tiếp tục", thẻ nhắc ôn từ thân thiện).
2. **Thuật Toán Feed Trộn Hỗn Hợp (Dành cho bạn / For You):**
   - Feed tại Trang chủ bắt buộc phải **trộn lẫn cả 3 loại nội dung**: `ARTICLE`, `PODCAST`, `VIDEO`.
   - Tuyệt đối không ép người dùng phải chọn tab "Học đọc" hay "Học nghe" từ trang chủ.
   - Thẻ hiển thị: Ảnh thumbnail 16:10, tiêu đề in đậm 2 dòng, tóm tắt teaser 2 dòng, tag thời lượng (`🎧 5 min`, `📖 4 min read`, `🎬 6 min`), tag chủ đề pastel, và nút lưu bookmark 🔖.
3. **Thanh "Tiếp Tục" (Hero Continue Banner):**
   - Nếu người dùng có nội dung dở dang (`0% < progress_percentage < 100%`) được cập nhật trong 7 ngày gần nhất, nội dung mới nhất sẽ được ghim dạng Panorama 16:6 trên đầu Feed kèm thanh tiến trình và nút `▶ Tiếp tục nghe/đọc` (lưu tại bảng `content_progress`).
4. **Quy Chuẩn Điều Hướng 6 Mục (Không Dùng Từ Học Thuật):**
   - Tuyệt đối không dùng các từ gây áp lực học tập: `Learn`, `Study`, `Lesson`, `Course`, `Practice`, `Exam`.
   - 6 mục điều hướng chuẩn:
     - `Trang chủ` (Home) 🏠 — [`docs/design/HOME.md`](./design/HOME.md)
     - `Khám phá` (Explore) 🔍 — [`docs/design/EXPLORE.md`](./design/EXPLORE.md)
     - `Đã lưu` (Saved) 🔖 — [`docs/design/SAVED.md`](./design/SAVED.md)
     - `Ôn tập` (Review) 🧠 (Badge đỏ đếm số thẻ đến hạn) — [`docs/design/REVIEW.md`](./design/REVIEW.md)
     - `Lịch sử` (History) ⏱️ — [`docs/design/HISTORY.md`](./design/HISTORY.md)
     - `Hồ sơ` (Profile) 👤 — [`docs/design/PROFILE.md`](./design/PROFILE.md)

---

## 2. Article Reader Rules & Modes

*Liên kết:* [`docs/features/ARTICLE.md`](./features/ARTICLE.md) | [`docs/design/ARTICLE_READER.md`](./design/ARTICLE_READER.md) | Bảng: `articles`, `contents`

1. **Bộ Chuyển Đổi 3 Chế Độ (Tri-Mode Switcher):**
   - **`English` (Chế độ mặc định bắt buộc):**
     Chỉ hiển thị văn bản tiếng Anh. *Quy tắc tối quan trọng: Mặc định luôn là tiếng Anh.* Nếu bật song ngữ mặc định, người dùng Việt Nam sẽ có phản xạ tự nhiên là chỉ nhìn bản tiếng Việt, làm mất tác dụng rèn luyện phản xạ ngữ cảnh.
   - **`Bilingual` (Song ngữ):**
     Hiển thị từng đoạn tiếng Anh kèm bản dịch tiếng Việt mờ trang nhã ngay bên dưới.
   - **`Vietnamese` (Chỉ tiếng Việt):**
     Chỉ hiển thị bản dịch tiếng Việt để đối chiếu nhanh nghĩa toàn bài.
2. **Quy Tắc Tra Từ Tức Thì 1-Click (Word Lookup):**
   - Click vào bất kỳ từ tiếng Anh nào sẽ mở popover nổi ngay cạnh từ:
     - Từ gốc (Headword), loại từ (`n.`, `v.`, `adj.`, `adv.`), phiên âm IPA, nút loa phát âm 🔊.
     - Nghĩa tiếng Việt trong ngữ cảnh câu này (VD: *"Trong câu này: 'remarkably consistent' → nhất quán một cách đáng chú ý"*).
     - Nút hành động:
       - Nếu từ chưa lưu: Nút `+ Lưu vào sổ từ` (tạo `user_vocabularies` + `vocabulary_contexts`).
       - Nếu từ đã lưu: Badge `✓ Đang học • Bạn đã gặp từ này X lần` (bấm vào mở Context Drawer).
3. **Quy Tắc Bôi Đen Chọn Cụm Từ (Phrase Selection):**
   - Khi người dùng kéo chọn nhiều từ liên tiếp (VD: `remarkably consistent`):
     - Mở menu hành động mini: `Lưu cụm từ` (lưu với `part_of_speech = 'phrase'`), `Dịch câu`, `Ghi chú`.

---

## 3. Vocabulary Re-encounter & Context Tracking Rules (1:N:N)

*Liên kết:* [`docs/features/VOCABULARY.md`](./features/VOCABULARY.md) | [`docs/design/VOCABULARY.md`](./design/VOCABULARY.md) | Bảng: `vocabularies`, `user_vocabularies`, `vocabulary_contexts`

1. **Kiến Trúc Lưu Ngữ Cảnh Tách Rời (1:N:N):**
   - Không lưu trùng lặp từ vựng cho mỗi người dùng.
   - Quan hệ: `users` (1) ── (N) `user_vocabularies` (1) ── (N) `vocabulary_contexts`.
   - Mỗi khi lưu từ hoặc gặp lại từ trong một bài đọc/podcast mới, hệ thống tự động gắn thêm một bản ghi vào `vocabulary_contexts` lưu lại: `content_id`, `sentence` (câu văn chứa từ), và `translation` (bản dịch câu).
2. **Phát Hiện & Gợi Nhắc Tái Gặp ("Seen X times"):**
   - Khi tải bất kỳ bài đọc hay transcript nào:
     - Client đối chiếu văn bản với danh sách `user_vocabularies` của người dùng.
     - Các từ đã lưu nhận được nét gạch chân xanh lá dịu mắt (`border-bottom: 2px solid #4ADE80`).
   - **Trạng thái tái gặp:**
     - Popover không hiện nút `+ Lưu` nữa.
     - Hiển thị: `✓ Đang học • Bạn đã gặp từ này X lần` (X = `COUNT(vocabulary_contexts)`).
     - Bấm vào mở Drawer hiển thị thứ tự toàn bộ các câu trong quá khứ:
       1. *"A significant increase in renewable energy was recorded."* (Climate Solutions)
       2. *"There was a significant difference in memory recall."* (Science of Sleep)
       3. *"Could have a significant impact on exploration."* (Mission to Mars)
       4. *"A remarkably significant achievement."* (Tech Innovations — Bài hiện tại)
   - Tâm lý học: Thấy từ xuất hiện 3-4 lần ở các chủ đề khác nhau giúp não bộ tự động củng cố trí nhớ dài hạn.

---

## 4. Multimedia Player & Timestamped Transcript Rules

*Liên kết:* [`docs/features/LISTENING.md`](./features/LISTENING.md), [`docs/features/VIDEO.md`](./features/VIDEO.md) | [`docs/design/PODCAST_PLAYER.md`](./design/PODCAST_PLAYER.md), [`docs/design/VIDEO_PLAYER.md`](./design/VIDEO_PLAYER.md) | Bảng: `transcript_segments`, `contents`

1. **Độ Chuẩn Xác Mốc Thời Gian (Millisecond Bounds):**
   - Cả Podcast và Video đều dùng chung bảng `transcript_segments` với 2 mốc số nguyên: `start_ms` và `end_ms`.
2. **Đồng Bộ Phụ Đề & Tự Động Cuộn (Auto-Scroll):**
   - Khi audio/video phát, player bắt sự kiện `currentTimeMs`.
   - Câu thỏa mãn `start_ms <= currentTimeMs < end_ms` được gắn class `.active-segment`.
   - Giao diện áp dụng nền xanh dịu `background: #EBF7EE` và viền trái `border-left: 3px solid #16A34A`, đồng thời cuộn mượt (Smooth Auto-scroll) để đưa câu về giữa màn hình.
3. **Tương Tác Trên Từng Câu:**
   - Bấm vào bất kỳ câu nào trong transcript: Tua đầu phát media ngay đến `start_ms`.
   - Nút `Nghe lại câu này`: Vòng lặp phát đoạn từ `start_ms` đến `end_ms`.
   - Nút `Lưu câu`: Lưu câu và đoạn audio timestamp vào sổ câu tâm đắc.
   - Click từng từ vựng trong transcript: Mở popup tra từ tương tự như trong bài đọc.
4. **3 Chế Độ Transcript:**
   - `[ EN ]`: Chỉ tiếng Anh.
   - `[ EN + VI ]`: Song ngữ Anh - Việt dưới từng dòng.
   - `[ Ẩn ]`: Ẩn toàn bộ để luyện nghe phản xạ thuần túy.

---

## 5. In-Feed Review Nudge (Signature UX Rule)

*Liên kết:* [`docs/features/FLASHCARD.md`](./features/FLASHCARD.md) | [`docs/design/HOME.md`](./design/HOME.md) | Hook: `frontend/src/features/feed/hooks/useFeedPrompt.ts`

1. **Điều Kiện Kích Hoạt (Trigger Criteria):**
   - Người dùng đã lướt feed liên tục >= 10 - 15 phút (hoặc đã cuộn qua 8+ thẻ nội dung).
   - Có từ 3 thẻ flashcard trở lên đã đến hạn ôn (`next_review_at <= NOW()`).
   - Người dùng chưa bấm "Để sau" trong vòng 30 phút gần nhất.
2. **Hành Vi Thân Thiện & Không Cưỡng Ép:**
   - Chèn nhẹ nhàng một thẻ card xanh dịu vào giữa dòng cuộn feed:
     > *"⏱️ You've been scrolling for 12 minutes. 🧠 5 words are ready for review. [Review in 2 min →] | Maybe later"*
   - Bấm **"Review in 2 min"**: Bật popup modal ôn nhanh 5 thẻ ngay trên trang.
   - Hoàn thành: Hiệu ứng pháo hoa nhẹ *"All done ✓ +15 XP"*, đóng popup và người dùng tiếp tục lướt feed đúng vị trí cũ.
   - Bấm **"Maybe later"**: Thẻ tự động trượt đi và không làm phiền trong 30 phút.

---

## 6. Fast Spaced Repetition (SRS) Review Rules

*Liên kết:* [`docs/features/FLASHCARD.md`](./features/FLASHCARD.md) | [`docs/design/REVIEW.md`](./design/REVIEW.md) | Bảng: `user_vocabularies` | Thuật toán: SuperMemo-2 (SM-2)

1. **Phiên Ôn Tập Micro-Session (Không Gây Mệt Mỏi):**
   - Giới hạn từ 10 đến 20 thẻ mỗi lượt ôn (khoảng 3 đến 5 phút).
2. **Cấu Trúc Thẻ Flashcard 3D:**
   - **Mặt trước:** Từ vựng, phiên âm IPA, loa phát âm 🔊, và câu gợi ý đục lỗ (Cloze hint) ẩn từ khóa.
   - **Mặt sau (Lật 3D):** Nghĩa tiếng Việt, câu ngữ cảnh gốc có từ in đậm, và tên bài nguồn đã lưu từ này.
3. **Thang Đánh Giá 4 Nút (SuperMemo-2 Logic):**
   - **`Quên` (Again - Nút đỏ):** Quên từ. Lùi interval về 1 ngày, `repetitions = 0`, giảm `ease_factor`. Thẻ xuất hiện lại ở cuối phiên.
   - **`Khó` (Hard - Nút vàng cam):** Nhớ khó khăn. `interval = interval * 1.2`, giảm nhẹ `ease_factor`.
   - **`Tốt` (Good - Nút xanh lá):** Nhớ chuẩn. `interval = interval * ease_factor`, tăng `repetitions + 1`.
   - **`Dễ` (Easy - Nút xanh dương):** Nhớ tức thì. `interval = interval * ease_factor * 1.3`, tăng `ease_factor`.
4. **Tiêu Chuẩn Thuần Thục (Mastered):**
   - Từ vựng có `repetitions >= 6` và `interval_days >= 30` sẽ tự động chuyển trạng thái từ `LEARNING` sang `MASTERED`.

---

## 7. Stealth IELTS Curriculum Strategy

*Liên kết:* [`docs/PROJECT.md`](./PROJECT.md#1-product-vision--definition) | [`docs/design/EXPLORE.md`](./design/EXPLORE.md) | [`docs/design/admin/ARTICLE_EDITOR.md`](./design/admin/ARTICLE_EDITOR.md)

1. **Quy Tắc Frontend Tuyệt Đối:**
   - Từ khóa `"IELTS"` KHÔNG BAO GIỜ được phép hiển thị trên giao diện người dùng.
   - Không: *"IELTS 6.5"*, *"IELTS Listening"*, *"Luyện thi IELTS"*, *"Band Score"*.
   - Độ khó nội dung chỉ được dán nhãn:
     - `Dễ` (Easy — Tương đương A1-A2)
     - `Trung bình` (Intermediate — Tương đương B1-B2)
     - `Nâng cao` (Advanced — Tương đương C1-C2)
2. **Chiến Lược Biên Tập Backend/Admin:**
   - Quản trị viên lựa chọn và đăng bài theo 9 chủ đề học thuật có tần suất xuất hiện cao nhất trong kỳ thi IELTS:
     - `Môi trường & Biến đổi khí hậu (Environment)`
     - `Công nghệ & AI (Technology)`
     - `Giáo dục & Kỹ năng (Education)`
     - `Sức khỏe & Y học (Health)`
     - `Khoa học & Không gian (Science)`
     - `Xã hội & Đô thị hóa (Society)`
     - `Tâm lý & Hành vi (Psychology)`
     - `Kinh tế & Toàn cầu hóa (Economics)`
     - `Văn hóa & Nghệ thuật (Culture)`
   - Kết quả: Người dùng nghĩ rằng họ chỉ đang lướt đọc và nghe tin tức thú vị, nhưng vốn từ học thuật và khả năng đọc hiểu chuyên sâu tự động được nâng cấp chuẩn theo phổ điểm IELTS cao.

---

## 8. Streak & XP Rules (Ambient 20%)

*Liên kết:* [`docs/design/PROFILE.md`](./design/PROFILE.md) | [`docs/design/HOME.md`](./design/HOME.md) | Bảng: `users`

1. **Hành Động Đủ Điều Kiện Duy Trì Streak:**
   Người dùng hoàn thành bất kỳ **1 trong các hành động** sau trong ngày (00:00 - 23:59) sẽ được duy trì chuỗi `current_streak + 1`:
   - Đọc ít nhất 1 bài viết (>80% cuộn trang & >45 giây đọc).
   - Nghe/xem ít nhất 1 podcast/video (>50% thời lượng).
   - Ôn tập ít nhất 5 thẻ flashcard.
2. **Điểm Thưởng XP (Nhẹ nhàng):**
   - Hoàn thành bài đọc: `+20 XP`
   - Hoàn thành podcast / video: `+25 XP`
   - Ôn 1 thẻ flashcard: `+2 XP`
   - Tra và lưu 1 từ vựng mới: `+5 XP`
