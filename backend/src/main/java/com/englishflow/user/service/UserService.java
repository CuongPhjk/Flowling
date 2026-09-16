package com.englishflow.user.service;

import com.englishflow.common.exception.AppException;
import com.englishflow.common.exception.ErrorCode;
import com.englishflow.progress.repository.ContentProgressRepository;
import com.englishflow.progress.repository.SavedContentRepository;
import com.englishflow.user.dto.UserProfileResponse;
import com.englishflow.user.entity.User;
import com.englishflow.user.repository.UserRepository;
import com.englishflow.vocabulary.entity.VocabStatus;
import com.englishflow.vocabulary.repository.UserVocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserVocabularyRepository userVocabularyRepository;
    private final ContentProgressRepository contentProgressRepository;
    private final SavedContentRepository savedContentRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        long learningCount = userVocabularyRepository.countByUserIdAndStatus(userId, VocabStatus.LEARNING);
        long masteredCount = userVocabularyRepository.countByUserIdAndStatus(userId, VocabStatus.MASTERED);
        long completedCount = contentProgressRepository.countByUserIdAndIsCompletedTrue(userId);
        long savedCount = savedContentRepository.countByUserId(userId);

        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .currentStreak(user.getCurrentStreak())
                .totalXp(user.getTotalXp())
                .learningWordsCount(learningCount)
                .masteredWordsCount(masteredCount)
                .completedContentsCount(completedCount)
                .savedContentsCount(savedCount)
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional
    public void awardXp(Long userId, int xp) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setTotalXp(user.getTotalXp() + xp);
        userRepository.save(user);
    }

    @Transactional
    public void updateStreak(Long userId, int newStreak) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setCurrentStreak(newStreak);
        userRepository.save(user);
    }
}
