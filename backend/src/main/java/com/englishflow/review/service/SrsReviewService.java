package com.englishflow.review.service;

import com.englishflow.common.exception.AppException;
import com.englishflow.common.exception.ErrorCode;
import com.englishflow.review.dto.ReviewCardDto;
import com.englishflow.review.dto.ReviewGrade;
import com.englishflow.review.dto.ReviewSubmitResponse;
import com.englishflow.user.entity.User;
import com.englishflow.user.repository.UserRepository;
import com.englishflow.vocabulary.entity.UserVocabulary;
import com.englishflow.vocabulary.entity.VocabStatus;
import com.englishflow.vocabulary.entity.VocabularyContext;
import com.englishflow.vocabulary.repository.UserVocabularyRepository;
import com.englishflow.vocabulary.repository.VocabularyContextRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SrsReviewService {

    private final UserVocabularyRepository userVocabularyRepository;
    private final VocabularyContextRepository vocabularyContextRepository;
    private final UserRepository userRepository;

    private static final int XP_PER_REVIEW = 5;

    @Transactional(readOnly = true)
    public List<ReviewCardDto> getDueReviews(Long userId, int limit) {
        LocalDateTime now = LocalDateTime.now();
        List<UserVocabulary> dueList = userVocabularyRepository.findDueReviews(
                userId,
                now,
                PageRequest.of(0, limit)
        );

        return dueList.stream().map(uv -> {
            List<VocabularyContext> contexts = vocabularyContextRepository.findByUserVocabularyIdOrderByCreatedAtDesc(uv.getId());
            String sentence = contexts.isEmpty() ? null : contexts.get(0).getSentence();
            String translation = contexts.isEmpty() ? null : contexts.get(0).getTranslation();
            return ReviewCardDto.fromEntity(uv, sentence, translation);
        }).collect(Collectors.toList());
    }

    @Transactional
    public ReviewSubmitResponse submitReview(Long userId, Long userVocabId, ReviewGrade grade) {
        UserVocabulary uv = userVocabularyRepository.findById(userVocabId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_VOCABULARY_NOT_FOUND));

        if (!uv.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        float ease = uv.getEaseFactor();
        double interval = uv.getIntervalDays();
        int repetitions = uv.getRepetitions();

        switch (grade) {
            case AGAIN -> {
                interval = 1;
                repetitions = 0;
                ease -= 0.2f;
            }
            case HARD -> {
                interval = Math.max(1.0, interval * 1.2);
                ease -= 0.15f;
            }
            case GOOD -> {
                if (repetitions == 0) {
                    interval = 1;
                } else if (repetitions == 1) {
                    interval = 6;
                } else {
                    interval = interval * ease;
                }
                repetitions++;
            }
            case EASY -> {
                interval = Math.max(4.0, interval * ease * 1.3);
                ease += 0.15f;
                repetitions++;
            }
        }

        int finalInterval = (int) Math.round(interval);
        float finalEase = Math.max(1.3f, ease);
        VocabStatus newStatus = (repetitions >= 6 && finalInterval >= 30) ? VocabStatus.MASTERED : VocabStatus.LEARNING;

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextReview = now.plusDays(finalInterval);

        uv.setIntervalDays(finalInterval);
        uv.setEaseFactor(finalEase);
        uv.setRepetitions(repetitions);
        uv.setStatus(newStatus);
        uv.setNextReviewAt(nextReview);
        uv.setLastReviewedAt(now);

        userVocabularyRepository.save(uv);

        // Award XP to user
        User user = uv.getUser();
        user.setTotalXp(user.getTotalXp() + XP_PER_REVIEW);
        userRepository.save(user);

        return ReviewSubmitResponse.builder()
                .userVocabId(uv.getId())
                .status(newStatus)
                .intervalDays(finalInterval)
                .easeFactor(finalEase)
                .repetitions(repetitions)
                .nextReviewAt(nextReview)
                .xpEarned(XP_PER_REVIEW)
                .totalXp(user.getTotalXp())
                .build();
    }
}
