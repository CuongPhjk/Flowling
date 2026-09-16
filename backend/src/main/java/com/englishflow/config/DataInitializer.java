package com.englishflow.config;

import com.englishflow.content.entity.*;
import com.englishflow.content.repository.ArticleRepository;
import com.englishflow.content.repository.ContentRepository;
import com.englishflow.content.repository.TranscriptSegmentRepository;
import com.englishflow.user.entity.User;
import com.englishflow.user.repository.UserRepository;
import com.englishflow.vocabulary.entity.UserVocabulary;
import com.englishflow.vocabulary.entity.VocabStatus;
import com.englishflow.vocabulary.entity.Vocabulary;
import com.englishflow.vocabulary.entity.VocabularyContext;
import com.englishflow.vocabulary.repository.UserVocabularyRepository;
import com.englishflow.vocabulary.repository.VocabularyContextRepository;
import com.englishflow.vocabulary.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final ArticleRepository articleRepository;
    private final TranscriptSegmentRepository transcriptSegmentRepository;
    private final VocabularyRepository vocabularyRepository;
    private final UserVocabularyRepository userVocabularyRepository;
    private final VocabularyContextRepository vocabularyContextRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial seeding.");
            return;
        }

        log.info("Seeding initial EnglishFlow demo data...");

        // 1. Users
        User reader = User.builder()
                .email("minh@flowling.demo")
                .passwordHash(passwordEncoder.encode("Flowling123!"))
                .fullName("Minh Nguyễn")
                .role("ROLE_USER")
                .currentStreak(7)
                .totalXp(340)
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .build();
        reader = userRepository.save(reader);

        User admin = User.builder()
                .email("admin@flowling.demo")
                .passwordHash(passwordEncoder.encode("Flowling123!"))
                .fullName("Biên tập viên Flowling")
                .role("ROLE_ADMIN")
                .currentStreak(14)
                .totalXp(850)
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                .build();
        admin = userRepository.save(admin);

        // 2. Sample Contents - Article 1: Science
        Content dreamArticle = Content.builder()
                .type(ContentType.ARTICLE)
                .title("Why Do We Dream?")
                .slug("why-do-we-dream")
                .description("Every night, our brain builds vivid worlds. Explore the science behind human dreams and memory consolidation.")
                .thumbnailUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800")
                .durationSeconds(240)
                .difficulty(Difficulty.EASY)
                .category("Science")
                .status(ContentStatus.PUBLISHED)
                .publishedAt(LocalDateTime.now().minusDays(2))
                .build();
        dreamArticle = contentRepository.save(dreamArticle);

        Article dreamBody = Article.builder()
                .content(dreamArticle)
                .contentId(dreamArticle.getId())
                .englishBody("""
The night sky gives us a new perspective on our place in the universe. Mars is a distant world, but curiosity brings it closer. Scientists look for water beneath its dusty surface.

Building a home on Mars would require significant changes to the way we live. People would need reliable shelter, clean water, and a renewable source of energy. Every resource would matter.

Exploration is also a lesson in patience. Small experiments help researchers understand complex problems. The journey encourages us to protect the remarkable planet we already call home.
""")
                .vietnameseBody("""
Bầu trời đêm cho ta góc nhìn mới về vị trí của mình trong vũ trụ. Sao Hỏa là một thế giới xa xôi, nhưng sự tò mò đưa nó đến gần hơn. Các nhà khoa học tìm nước bên dưới bề mặt đầy bụi.

Xây nhà trên Sao Hỏa đòi hỏi những thay đổi đáng kể trong cách sống. Con người cần nơi trú ẩn đáng tin cậy, nước sạch và nguồn năng lượng tái tạo. Mọi nguồn tài nguyên đều quan trọng.

Khám phá cũng dạy ta sự kiên nhẫn. Những thí nghiệm nhỏ giúp nhà nghiên cứu hiểu các vấn đề phức tạp. Hành trình này khuyến khích ta bảo vệ hành tinh phi thường mà chúng ta gọi là nhà.
""")
                .build();
        articleRepository.save(dreamBody);

        // Article 2: Psychology
        Content habitArticle = Content.builder()
                .type(ContentType.ARTICLE)
                .title("The Power of Atomic Habits")
                .slug("the-power-of-atomic-habits")
                .description("How tiny, regular adjustments in daily routines accumulate into life-defining personal growth.")
                .thumbnailUrl("https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800")
                .durationSeconds(180)
                .difficulty(Difficulty.INTERMEDIATE)
                .category("Psychology")
                .status(ContentStatus.PUBLISHED)
                .publishedAt(LocalDateTime.now().minusDays(1))
                .build();
        habitArticle = contentRepository.save(habitArticle);

        Article habitBody = Article.builder()
                .content(habitArticle)
                .contentId(habitArticle.getId())
                .englishBody("""
Small habits can make a significant difference. A quiet morning gives your brain space to focus. Instead of changing everything at once, choose one simple action that you can repeat.

Consistency matters more than intensity. A short walk, a page of a book, or a conversation with a friend can become a reliable part of your day. Make the first step easy.

Progress is rarely a straight line. Be curious about what works for you. With patience and a fresh perspective, small efforts become a meaningful part of everyday life.
""")
                .vietnameseBody("""
Những thói quen nhỏ có thể tạo ra khác biệt đáng kể. Một buổi sáng yên tĩnh cho não bộ không gian tập trung. Thay vì thay đổi mọi thứ cùng lúc, hãy chọn một hành động đơn giản để lặp lại.

Sự đều đặn quan trọng hơn cường độ. Đi bộ ngắn, đọc một trang sách hoặc trò chuyện cùng bạn bè có thể trở thành phần ổn định trong ngày. Hãy làm bước đầu tiên thật dễ dàng.

Tiến bộ hiếm khi là đường thẳng. Hãy tò mò về những gì phù hợp với bạn. Với sự kiên nhẫn và góc nhìn mới, nỗ lực nhỏ trở thành phần ý nghĩa của cuộc sống hằng ngày.
""")
                .build();
        articleRepository.save(habitBody);

        // Content 3: Podcast with transcripts
        Content slowLivingPodcast = Content.builder()
                .type(ContentType.PODCAST)
                .title("The Art of Slow Living")
                .slug("the-art-of-slow-living")
                .description("A soothing exploration into creating intentional pauses, mindful breathing, and enjoying everyday moments.")
                .thumbnailUrl("https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800")
                .mediaUrl("https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg")
                .durationSeconds(180)
                .difficulty(Difficulty.EASY)
                .category("Culture")
                .status(ContentStatus.PUBLISHED)
                .publishedAt(LocalDateTime.now().minusHours(12))
                .build();
        slowLivingPodcast = contentRepository.save(slowLivingPodcast);

        List<TranscriptSegment> segments = List.of(
                TranscriptSegment.builder()
                        .content(slowLivingPodcast)
                        .startMs(0)
                        .endMs(4200)
                        .englishText("Welcome back to Flowling audio stories.")
                        .vietnameseText("Chào mừng bạn quay trở lại với những mẩu chuyện âm thanh của Flowling.")
                        .position(0)
                        .build(),
                TranscriptSegment.builder()
                        .content(slowLivingPodcast)
                        .startMs(4200)
                        .endMs(9500)
                        .englishText("Today, we explore the gentle practice of slowing down in a hurried world.")
                        .vietnameseText("Hôm nay, chúng ta cùng khám phá thói quen sống chậm lại trong một thế giới vội vã.")
                        .position(1)
                        .build(),
                TranscriptSegment.builder()
                        .content(slowLivingPodcast)
                        .startMs(9500)
                        .endMs(16000)
                        .englishText("Taking time for yourself gives you a fresh perspective on life and deepens consistency.")
                        .vietnameseText("Dành thời gian cho bản thân cho bạn góc nhìn mới về cuộc sống và làm sâu sắc hơn sự kiên định.")
                        .position(2)
                        .build()
        );
        transcriptSegmentRepository.saveAll(segments);

        // 3. Vocabulary & User Vocabulary with Contexts (1:N:N)
        Vocabulary perspective = Vocabulary.builder()
                .term("perspective")
                .partOfSpeech("noun")
                .meaningVi("góc nhìn, quan điểm")
                .phonetic("/pərˈspektɪv/")
                .build();
        perspective = vocabularyRepository.save(perspective);

        Vocabulary remarkable = Vocabulary.builder()
                .term("remarkable")
                .partOfSpeech("adjective")
                .meaningVi("đáng chú ý, phi thường")
                .phonetic("/rɪˈmɑːrkəbl/")
                .build();
        remarkable = vocabularyRepository.save(remarkable);

        Vocabulary consistency = Vocabulary.builder()
                .term("consistency")
                .partOfSpeech("noun")
                .meaningVi("sự nhất quán, kiên định")
                .phonetic("/kənˈsɪstənsi/")
                .build();
        consistency = vocabularyRepository.save(consistency);

        // UserVocab for reader
        UserVocabulary uvPerspective = UserVocabulary.builder()
                .user(reader)
                .vocabulary(perspective)
                .status(VocabStatus.LEARNING)
                .easeFactor(2.5f)
                .intervalDays(1)
                .repetitions(2)
                .nextReviewAt(LocalDateTime.now().minusHours(1)) // Due for review!
                .build();
        uvPerspective = userVocabularyRepository.save(uvPerspective);

        // Multiple contexts for perspective (1:N:N proof)
        VocabularyContext ctx1 = VocabularyContext.builder()
                .userVocabulary(uvPerspective)
                .content(dreamArticle)
                .sentence("The night sky gives us a new perspective on our place in the universe.")
                .translation("Bầu trời đêm cho ta góc nhìn mới về vị trí của mình trong vũ trụ.")
                .build();
        vocabularyContextRepository.save(ctx1);

        VocabularyContext ctx2 = VocabularyContext.builder()
                .userVocabulary(uvPerspective)
                .content(habitArticle)
                .sentence("With patience and a fresh perspective, small efforts become a meaningful part of everyday life.")
                .translation("Với sự kiên nhẫn và góc nhìn mới, nỗ lực nhỏ trở thành phần ý nghĩa của cuộc sống hằng ngày.")
                .build();
        vocabularyContextRepository.save(ctx2);

        VocabularyContext ctx3 = VocabularyContext.builder()
                .userVocabulary(uvPerspective)
                .content(slowLivingPodcast)
                .sentence("Taking time for yourself gives you a fresh perspective on life and deepens consistency.")
                .translation("Dành thời gian cho bản thân cho bạn góc nhìn mới về cuộc sống và làm sâu sắc hơn sự kiên định.")
                .build();
        vocabularyContextRepository.save(ctx3);

        UserVocabulary uvRemarkable = UserVocabulary.builder()
                .user(reader)
                .vocabulary(remarkable)
                .status(VocabStatus.LEARNING)
                .easeFactor(2.5f)
                .intervalDays(2)
                .repetitions(1)
                .nextReviewAt(LocalDateTime.now().minusMinutes(30)) // Due for review!
                .build();
        uvRemarkable = userVocabularyRepository.save(uvRemarkable);

        VocabularyContext ctxRemarkable = VocabularyContext.builder()
                .userVocabulary(uvRemarkable)
                .content(dreamArticle)
                .sentence("The journey encourages us to protect the remarkable planet we already call home.")
                .translation("Hành trình này khuyến khích ta bảo vệ hành tinh phi thường mà chúng ta gọi là nhà.")
                .build();
        vocabularyContextRepository.save(ctxRemarkable);

        log.info("Seeding completed successfully! Demo accounts and initial articles/podcasts/vocabularies ready.");
    }
}
