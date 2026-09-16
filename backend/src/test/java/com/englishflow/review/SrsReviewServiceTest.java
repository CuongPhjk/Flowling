package com.englishflow.review;

import com.englishflow.review.dto.ReviewGrade;
import com.englishflow.review.dto.ReviewSubmitResponse;
import com.englishflow.review.service.SrsReviewService;
import com.englishflow.user.entity.User;
import com.englishflow.user.repository.UserRepository;
import com.englishflow.vocabulary.entity.UserVocabulary;
import com.englishflow.vocabulary.entity.VocabStatus;
import com.englishflow.vocabulary.entity.Vocabulary;
import com.englishflow.vocabulary.repository.UserVocabularyRepository;
import com.englishflow.vocabulary.repository.VocabularyContextRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SrsReviewServiceTest {

    @Mock
    private UserVocabularyRepository userVocabularyRepository;

    @Mock
    private VocabularyContextRepository vocabularyContextRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SrsReviewService srsReviewService;

    private User user;
    private Vocabulary vocabulary;
    private UserVocabulary establishedWord;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("test@flowling.demo")
                .totalXp(100)
                .build();

        vocabulary = Vocabulary.builder()
                .id(10L)
                .term("perspective")
                .meaningVi("góc nhìn")
                .build();

        establishedWord = UserVocabulary.builder()
                .id(100L)
                .user(user)
                .vocabulary(vocabulary)
                .status(VocabStatus.LEARNING)
                .easeFactor(2.5f)
                .intervalDays(15)
                .repetitions(5)
                .nextReviewAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testAgainResetsProgressAndFloorEaseAtOnePointThree() {
        UserVocabulary masteredWord = UserVocabulary.builder()
                .id(101L)
                .user(user)
                .vocabulary(vocabulary)
                .status(VocabStatus.MASTERED)
                .easeFactor(1.3f)
                .intervalDays(30)
                .repetitions(8)
                .nextReviewAt(LocalDateTime.now())
                .build();

        when(userVocabularyRepository.findById(101L)).thenReturn(Optional.of(masteredWord));
        when(userVocabularyRepository.save(any(UserVocabulary.class))).thenAnswer(i -> i.getArgument(0));

        ReviewSubmitResponse res = srsReviewService.submitReview(1L, 101L, ReviewGrade.AGAIN);

        assertEquals(1, res.getIntervalDays());
        assertEquals(0, res.getRepetitions());
        assertEquals(1.3f, res.getEaseFactor());
        assertEquals(VocabStatus.LEARNING, res.getStatus());
        assertEquals(105, res.getTotalXp());
    }

    @Test
    void testGoodPromotesToMasteredWhenThresholdsMet() {
        when(userVocabularyRepository.findById(100L)).thenReturn(Optional.of(establishedWord));
        when(userVocabularyRepository.save(any(UserVocabulary.class))).thenAnswer(i -> i.getArgument(0));

        // establishedWord has repetitions=5, interval=15, ease=2.5.
        // GOOD: repetitions becomes 6, interval becomes round(15 * 2.5) = 38 >= 30.
        ReviewSubmitResponse res = srsReviewService.submitReview(1L, 100L, ReviewGrade.GOOD);

        assertEquals(6, res.getRepetitions());
        assertEquals(38, res.getIntervalDays());
        assertEquals(VocabStatus.MASTERED, res.getStatus());
    }

    @Test
    void testGoodKeepsLearningWhenThresholdsNotMet() {
        establishedWord.setIntervalDays(2);
        when(userVocabularyRepository.findById(100L)).thenReturn(Optional.of(establishedWord));
        when(userVocabularyRepository.save(any(UserVocabulary.class))).thenAnswer(i -> i.getArgument(0));

        ReviewSubmitResponse res = srsReviewService.submitReview(1L, 100L, ReviewGrade.GOOD);

        assertEquals(VocabStatus.LEARNING, res.getStatus());
    }

    @Test
    void testFourGradesIntervalCalculations() {
        // AGAIN -> 1
        when(userVocabularyRepository.findById(100L)).thenReturn(Optional.of(establishedWord));
        ReviewSubmitResponse resAgain = srsReviewService.submitReview(1L, 100L, ReviewGrade.AGAIN);
        assertEquals(1, resAgain.getIntervalDays());

        // HARD -> round(15 * 1.2) = 18
        establishedWord.setIntervalDays(15);
        establishedWord.setEaseFactor(2.5f);
        establishedWord.setRepetitions(5);
        ReviewSubmitResponse resHard = srsReviewService.submitReview(1L, 100L, ReviewGrade.HARD);
        assertEquals(18, resHard.getIntervalDays());

        // GOOD -> round(15 * 2.5) = 38
        establishedWord.setIntervalDays(15);
        establishedWord.setEaseFactor(2.5f);
        establishedWord.setRepetitions(5);
        ReviewSubmitResponse resGood = srsReviewService.submitReview(1L, 100L, ReviewGrade.GOOD);
        assertEquals(38, resGood.getIntervalDays());

        // EASY -> round(15 * 2.5 * 1.3) = 49
        establishedWord.setIntervalDays(15);
        establishedWord.setEaseFactor(2.5f);
        establishedWord.setRepetitions(5);
        ReviewSubmitResponse resEasy = srsReviewService.submitReview(1L, 100L, ReviewGrade.EASY);
        assertEquals(49, resEasy.getIntervalDays());
    }
}
