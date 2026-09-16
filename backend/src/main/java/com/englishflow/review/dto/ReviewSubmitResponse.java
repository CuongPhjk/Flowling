package com.englishflow.review.dto;

import com.englishflow.vocabulary.entity.VocabStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSubmitResponse {
    private Long userVocabId;
    private VocabStatus status;
    private Integer intervalDays;
    private Float easeFactor;
    private Integer repetitions;
    private LocalDateTime nextReviewAt;
    private int xpEarned;
    private int totalXp;
}
