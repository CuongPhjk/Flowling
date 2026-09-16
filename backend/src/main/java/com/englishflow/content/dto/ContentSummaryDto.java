package com.englishflow.content.dto;

import com.englishflow.content.entity.Content;
import com.englishflow.content.entity.ContentStatus;
import com.englishflow.content.entity.ContentType;
import com.englishflow.content.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentSummaryDto {
    private Long id;
    private ContentType type;
    private String title;
    private String slug;
    private String description;
    private String thumbnailUrl;
    private String mediaUrl;
    private Integer durationSeconds;
    private Difficulty difficulty;
    private String category;
    private ContentStatus status;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private Boolean isSaved;
    private Float progressPercentage;

    public static ContentSummaryDto fromEntity(Content content) {
        return ContentSummaryDto.builder()
                .id(content.getId())
                .type(content.getType())
                .title(content.getTitle())
                .slug(content.getSlug())
                .description(content.getDescription())
                .thumbnailUrl(content.getThumbnailUrl())
                .mediaUrl(content.getMediaUrl())
                .durationSeconds(content.getDurationSeconds())
                .difficulty(content.getDifficulty())
                .category(content.getCategory())
                .status(content.getStatus())
                .publishedAt(content.getPublishedAt())
                .createdAt(content.getCreatedAt())
                .build();
    }
}
