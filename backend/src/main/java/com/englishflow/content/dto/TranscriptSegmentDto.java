package com.englishflow.content.dto;

import com.englishflow.content.entity.TranscriptSegment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranscriptSegmentDto {
    private Long id;
    private Integer startMs;
    private Integer endMs;
    private String englishText;
    private String vietnameseText;
    private Integer position;

    public static TranscriptSegmentDto fromEntity(TranscriptSegment segment) {
        return TranscriptSegmentDto.builder()
                .id(segment.getId())
                .startMs(segment.getStartMs())
                .endMs(segment.getEndMs())
                .englishText(segment.getEnglishText())
                .vietnameseText(segment.getVietnameseText())
                .position(segment.getPosition())
                .build();
    }
}
