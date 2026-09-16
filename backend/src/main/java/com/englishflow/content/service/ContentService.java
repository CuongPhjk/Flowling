package com.englishflow.content.service;

import com.englishflow.common.dto.PageResponse;
import com.englishflow.common.exception.AppException;
import com.englishflow.common.exception.ErrorCode;
import com.englishflow.content.dto.ArticleDto;
import com.englishflow.content.dto.ContentDetailDto;
import com.englishflow.content.dto.ContentSummaryDto;
import com.englishflow.content.dto.TranscriptSegmentDto;
import com.englishflow.content.entity.*;
import com.englishflow.content.repository.ArticleRepository;
import com.englishflow.content.repository.ContentRepository;
import com.englishflow.content.repository.TranscriptSegmentRepository;
import com.englishflow.progress.entity.ContentProgress;
import com.englishflow.progress.repository.ContentProgressRepository;
import com.englishflow.progress.repository.SavedContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentRepository contentRepository;
    private final ArticleRepository articleRepository;
    private final TranscriptSegmentRepository transcriptSegmentRepository;
    private final SavedContentRepository savedContentRepository;
    private final ContentProgressRepository contentProgressRepository;

    @Transactional(readOnly = true)
    public PageResponse<ContentSummaryDto> getFeed(
            ContentType type,
            Difficulty difficulty,
            String category,
            String keyword,
            Pageable pageable,
            Long currentUserId
    ) {
        Page<Content> contents = contentRepository.findWithFilters(
                ContentStatus.PUBLISHED,
                type,
                difficulty,
                category,
                keyword,
                pageable
        );

        List<ContentSummaryDto> dtos = contents.getContent().stream().map(c -> {
            ContentSummaryDto dto = ContentSummaryDto.fromEntity(c);
            if (currentUserId != null) {
                dto.setIsSaved(savedContentRepository.existsByUserIdAndContentId(currentUserId, c.getId()));
                contentProgressRepository.findByUserIdAndContentId(currentUserId, c.getId())
                        .ifPresent(cp -> dto.setProgressPercentage(cp.getProgressPercentage()));
            }
            return dto;
        }).collect(Collectors.toList());

        return PageResponse.of(contents, dtos);
    }

    @Transactional(readOnly = true)
    public ContentDetailDto getContentBySlug(String slug, Long currentUserId) {
        Content content = contentRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.CONTENT_NOT_FOUND));

        ArticleDto articleDto = null;
        if (content.getType() == ContentType.ARTICLE) {
            Article article = articleRepository.findByContentId(content.getId()).orElse(null);
            articleDto = ArticleDto.fromEntity(article);
        }

        List<TranscriptSegmentDto> segmentDtos = null;
        if (content.getType() == ContentType.PODCAST || content.getType() == ContentType.VIDEO) {
            segmentDtos = transcriptSegmentRepository.findByContentIdOrderByPositionAsc(content.getId())
                    .stream()
                    .map(TranscriptSegmentDto::fromEntity)
                    .collect(Collectors.toList());
        }

        ContentDetailDto detail = ContentDetailDto.fromEntity(content, articleDto, segmentDtos);

        if (currentUserId != null) {
            detail.setIsSaved(savedContentRepository.existsByUserIdAndContentId(currentUserId, content.getId()));
            contentProgressRepository.findByUserIdAndContentId(currentUserId, content.getId())
                    .ifPresent(cp -> {
                        detail.setProgressPercentage(cp.getProgressPercentage());
                        detail.setLastPositionSeconds(cp.getLastPositionSeconds());
                    });
        }

        return detail;
    }
}
