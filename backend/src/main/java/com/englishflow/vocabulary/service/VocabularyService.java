package com.englishflow.vocabulary.service;

import com.englishflow.common.dto.PageResponse;
import com.englishflow.common.exception.AppException;
import com.englishflow.common.exception.ErrorCode;
import com.englishflow.content.entity.Content;
import com.englishflow.content.repository.ContentRepository;
import com.englishflow.user.entity.User;
import com.englishflow.user.repository.UserRepository;
import com.englishflow.vocabulary.dto.SaveVocabRequest;
import com.englishflow.vocabulary.dto.UserVocabResponse;
import com.englishflow.vocabulary.dto.VocabContextDto;
import com.englishflow.vocabulary.entity.UserVocabulary;
import com.englishflow.vocabulary.entity.VocabStatus;
import com.englishflow.vocabulary.entity.Vocabulary;
import com.englishflow.vocabulary.entity.VocabularyContext;
import com.englishflow.vocabulary.repository.UserVocabularyRepository;
import com.englishflow.vocabulary.repository.VocabularyContextRepository;
import com.englishflow.vocabulary.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VocabularyService {

    private final VocabularyRepository vocabularyRepository;
    private final UserVocabularyRepository userVocabularyRepository;
    private final VocabularyContextRepository vocabularyContextRepository;
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Optional<Vocabulary> lookup(String term) {
        return vocabularyRepository.findByTermIgnoreCase(term.trim());
    }

    @Transactional
    public UserVocabResponse saveVocabulary(Long userId, SaveVocabRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String normalizedTerm = request.getTerm().trim().toLowerCase();

        // 1. Find or create global Vocabulary
        Vocabulary vocabulary = vocabularyRepository.findByTermIgnoreCase(normalizedTerm)
                .orElseGet(() -> {
                    Vocabulary newVocab = Vocabulary.builder()
                            .term(normalizedTerm)
                            .partOfSpeech(StringUtils.hasText(request.getPartOfSpeech()) ? request.getPartOfSpeech() : "word")
                            .meaningVi(StringUtils.hasText(request.getMeaningVi()) ? request.getMeaningVi() : normalizedTerm)
                            .phonetic(request.getPhonetic())
                            .audioUrl(request.getAudioUrl())
                            .build();
                    return vocabularyRepository.save(newVocab);
                });

        // 2. Find or create UserVocabulary (SRS state)
        UserVocabulary userVocab = userVocabularyRepository.findByUserIdAndVocabularyId(userId, vocabulary.getId())
                .orElseGet(() -> {
                    UserVocabulary newUv = UserVocabulary.builder()
                            .user(user)
                            .vocabulary(vocabulary)
                            .status(VocabStatus.LEARNING)
                            .easeFactor(2.5f)
                            .intervalDays(1)
                            .repetitions(0)
                            .nextReviewAt(LocalDateTime.now())
                            .build();
                    return userVocabularyRepository.save(newUv);
                });

        // 3. Append Context (1:N:N Context tracking)
        if (StringUtils.hasText(request.getSentence())) {
            String trimmedSentence = request.getSentence().trim();
            boolean exists = vocabularyContextRepository.existsByUserVocabularyIdAndSentence(userVocab.getId(), trimmedSentence);
            if (!exists) {
                Content content = null;
                if (request.getContentId() != null) {
                    content = contentRepository.findById(request.getContentId()).orElse(null);
                }
                VocabularyContext context = VocabularyContext.builder()
                        .userVocabulary(userVocab)
                        .content(content)
                        .sentence(trimmedSentence)
                        .translation(request.getTranslation())
                        .build();
                vocabularyContextRepository.save(context);
            }
        }

        long encounterCount = vocabularyContextRepository.countByUserVocabularyId(userVocab.getId());
        List<VocabContextDto> contexts = vocabularyContextRepository
                .findByUserVocabularyIdOrderByCreatedAtDesc(userVocab.getId())
                .stream()
                .map(VocabContextDto::fromEntity)
                .collect(Collectors.toList());

        return UserVocabResponse.fromEntity(userVocab, encounterCount, contexts);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserVocabResponse> getUserWordBank(
            Long userId,
            VocabStatus status,
            String query,
            Pageable pageable
    ) {
        Page<UserVocabulary> page = userVocabularyRepository.findUserWordBank(userId, status, query, pageable);

        List<UserVocabResponse> responses = page.getContent().stream().map(uv -> {
            long count = vocabularyContextRepository.countByUserVocabularyId(uv.getId());
            List<VocabContextDto> contexts = vocabularyContextRepository
                    .findByUserVocabularyIdOrderByCreatedAtDesc(uv.getId())
                    .stream()
                    .map(VocabContextDto::fromEntity)
                    .collect(Collectors.toList());
            return UserVocabResponse.fromEntity(uv, count, contexts);
        }).collect(Collectors.toList());

        return PageResponse.of(page, responses);
    }

    @Transactional
    public void deleteUserVocabulary(Long userId, Long userVocabId) {
        UserVocabulary uv = userVocabularyRepository.findById(userVocabId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_VOCABULARY_NOT_FOUND));

        if (!uv.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        userVocabularyRepository.delete(uv);
    }
}
