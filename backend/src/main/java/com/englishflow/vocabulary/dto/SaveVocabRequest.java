package com.englishflow.vocabulary.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaveVocabRequest {
    @NotBlank(message = "Term is required")
    private String term;

    private String partOfSpeech;
    private String meaningVi;
    private String phonetic;
    private String audioUrl;

    private Long contentId;
    private String sentence;
    private String translation;
}
