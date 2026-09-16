package com.englishflow.vocabulary.dto;

import com.englishflow.vocabulary.entity.VocabularyContext;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VocabContextDto {
    private Long id;
    private Long contentId;
    private String contentTitle;
    private String sentence;
    private String translation;
    private LocalDateTime createdAt;

    public static VocabContextDto fromEntity(VocabularyContext context) {
        return VocabContextDto.builder()
                .id(context.getId())
                .contentId(context.getContent() != null ? context.getContent().getId() : null)
                .contentTitle(context.getContent() != null ? context.getContent().getTitle() : null)
                .sentence(context.getSentence())
                .translation(context.getTranslation())
                .createdAt(context.getCreatedAt())
                .build();
    }
}
