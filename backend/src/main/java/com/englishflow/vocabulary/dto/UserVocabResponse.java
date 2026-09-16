package com.englishflow.vocabulary.dto;

import com.englishflow.vocabulary.entity.UserVocabulary;
import com.englishflow.vocabulary.entity.VocabStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserVocabResponse {
    private Long id;
    private Long vocabularyId;
    private String term;
    private String partOfSpeech;
    private String meaningVi;
    private String phonetic;
    private String audioUrl;
    private VocabStatus status;
    private Float easeFactor;
    private Integer intervalDays;
    private Integer repetitions;
    private LocalDateTime nextReviewAt;
    private LocalDateTime lastReviewedAt;
    private LocalDateTime createdAt;
    private long encounterCount;
    private List<VocabContextDto> contexts;

    public static UserVocabResponse fromEntity(UserVocabulary uv, long encounterCount, List<VocabContextDto> contexts) {
        return UserVocabResponse.builder()
                .id(uv.getId())
                .vocabularyId(uv.getVocabulary().getId())
                .term(uv.getVocabulary().getTerm())
                .partOfSpeech(uv.getVocabulary().getPartOfSpeech())
                .meaningVi(uv.getVocabulary().getMeaningVi())
                .phonetic(uv.getVocabulary().getPhonetic())
                .audioUrl(uv.getVocabulary().getAudioUrl())
                .status(uv.getStatus())
                .easeFactor(uv.getEaseFactor())
                .intervalDays(uv.getIntervalDays())
                .repetitions(uv.getRepetitions())
                .nextReviewAt(uv.getNextReviewAt())
                .lastReviewedAt(uv.getLastReviewedAt())
                .createdAt(uv.getCreatedAt())
                .encounterCount(encounterCount)
                .contexts(contexts)
                .build();
    }
}
