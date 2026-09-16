package com.englishflow.review.dto;

import com.englishflow.vocabulary.entity.UserVocabulary;
import com.englishflow.vocabulary.entity.VocabStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCardDto {
    private Long userVocabId;
    private Long vocabularyId;
    private String term;
    private String partOfSpeech;
    private String meaningVi;
    private String phonetic;
    private String audioUrl;
    private VocabStatus status;
    private Integer repetitions;
    private Integer intervalDays;
    private Float easeFactor;
    private String sampleSentence;
    private String sampleTranslation;

    public static ReviewCardDto fromEntity(UserVocabulary uv, String sentence, String translation) {
        return ReviewCardDto.builder()
                .userVocabId(uv.getId())
                .vocabularyId(uv.getVocabulary().getId())
                .term(uv.getVocabulary().getTerm())
                .partOfSpeech(uv.getVocabulary().getPartOfSpeech())
                .meaningVi(uv.getVocabulary().getMeaningVi())
                .phonetic(uv.getVocabulary().getPhonetic())
                .audioUrl(uv.getVocabulary().getAudioUrl())
                .status(uv.getStatus())
                .repetitions(uv.getRepetitions())
                .intervalDays(uv.getIntervalDays())
                .easeFactor(uv.getEaseFactor())
                .sampleSentence(sentence)
                .sampleTranslation(translation)
                .build();
    }
}
