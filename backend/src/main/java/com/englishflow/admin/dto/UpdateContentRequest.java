package com.englishflow.admin.dto;

import com.englishflow.content.dto.TranscriptSegmentDto;
import com.englishflow.content.entity.ContentStatus;
import com.englishflow.content.entity.ContentType;
import com.englishflow.content.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateContentRequest {
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

    // For Article
    private String englishBody;
    private String vietnameseBody;

    // For Podcast/Video
    private List<TranscriptSegmentDto> transcriptSegments;
}
