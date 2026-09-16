package com.englishflow.progress.dto;

import com.englishflow.content.dto.ContentSummaryDto;
import com.englishflow.progress.entity.ContentProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {
    private Long id;
    private ContentSummaryDto content;
    private Float progressPercentage;
    private Integer lastPositionSeconds;
    private Boolean isCompleted;
    private LocalDateTime updatedAt;

    public static ProgressResponse fromEntity(ContentProgress cp) {
        return ProgressResponse.builder()
                .id(cp.getId())
                .content(ContentSummaryDto.fromEntity(cp.getContent()))
                .progressPercentage(cp.getProgressPercentage())
                .lastPositionSeconds(cp.getLastPositionSeconds())
                .isCompleted(cp.getIsCompleted())
                .updatedAt(cp.getUpdatedAt())
                .build();
    }
}
