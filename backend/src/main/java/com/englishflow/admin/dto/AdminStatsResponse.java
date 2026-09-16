package com.englishflow.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalContents;
    private long draftCount;
    private long publishedCount;
    private long articlesCount;
    private long podcastsCount;
    private long videosCount;
}
