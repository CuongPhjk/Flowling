package com.englishflow.admin.service;

import com.englishflow.admin.dto.AdminStatsResponse;
import com.englishflow.admin.dto.CreateContentRequest;
import com.englishflow.admin.dto.UpdateContentRequest;
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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminContentService {

    private final ContentRepository contentRepository;
    private final ArticleRepository articleRepository;
    private final TranscriptSegmentRepository transcriptSegmentRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public static String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long total = contentRepository.count();
        long published = contentRepository.countByStatus(ContentStatus.PUBLISHED);
        long drafts = contentRepository.countByStatus(ContentStatus.DRAFT);

        return AdminStatsResponse.builder()
                .totalContents(total)
                .publishedCount(published)
                .draftCount(drafts)
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<ContentSummaryDto> listContents(
            ContentStatus status,
            ContentType type,
            String keyword,
            Pageable pageable
    ) {
        Page<Content> page = contentRepository.findWithFilters(status, type, null, null, keyword, pageable);
        List<ContentSummaryDto> dtos = page.getContent().stream()
                .map(ContentSummaryDto::fromEntity)
                .collect(Collectors.toList());
        return PageResponse.of(page, dtos);
    }

    @Transactional
    public ContentDetailDto createContent(CreateContentRequest request) {
        String slug = StringUtils.hasText(request.getSlug()) ? request.getSlug().trim() : toSlug(request.getTitle());
        if (contentRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Content content = Content.builder()
                .type(request.getType())
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .mediaUrl(request.getMediaUrl())
                .durationSeconds(request.getDurationSeconds() != null ? request.getDurationSeconds() : 0)
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : Difficulty.INTERMEDIATE)
                .category(StringUtils.hasText(request.getCategory()) ? request.getCategory() : "General")
                .status(request.getStatus() != null ? request.getStatus() : ContentStatus.DRAFT)
                .publishedAt(request.getStatus() == ContentStatus.PUBLISHED ? LocalDateTime.now() : null)
                .build();

        content = contentRepository.save(content);

        ArticleDto articleDto = null;
        if (request.getType() == ContentType.ARTICLE && StringUtils.hasText(request.getEnglishBody())) {
            Article article = Article.builder()
                    .content(content)
                    .contentId(content.getId())
                    .englishBody(request.getEnglishBody())
                    .vietnameseBody(StringUtils.hasText(request.getVietnameseBody()) ? request.getVietnameseBody() : "")
                    .build();
            article = articleRepository.save(article);
            articleDto = ArticleDto.fromEntity(article);
        }

        List<TranscriptSegmentDto> segmentDtos = new ArrayList<>();
        if ((request.getType() == ContentType.PODCAST || request.getType() == ContentType.VIDEO)
                && request.getTranscriptSegments() != null) {
            final Content savedContent = content;
            List<TranscriptSegment> segments = request.getTranscriptSegments().stream().map(dto ->
                    TranscriptSegment.builder()
                            .content(savedContent)
                            .startMs(dto.getStartMs())
                            .endMs(dto.getEndMs())
                            .englishText(dto.getEnglishText())
                            .vietnameseText(dto.getVietnameseText() != null ? dto.getVietnameseText() : "")
                            .position(dto.getPosition() != null ? dto.getPosition() : 0)
                            .build()
            ).collect(Collectors.toList());
            segments = transcriptSegmentRepository.saveAll(segments);
            segmentDtos = segments.stream().map(TranscriptSegmentDto::fromEntity).collect(Collectors.toList());
        }

        return ContentDetailDto.fromEntity(content, articleDto, segmentDtos);
    }

    @Transactional
    public ContentDetailDto updateContent(Long id, UpdateContentRequest request) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CONTENT_NOT_FOUND));

        if (StringUtils.hasText(request.getTitle())) content.setTitle(request.getTitle());
        if (StringUtils.hasText(request.getDescription())) content.setDescription(request.getDescription());
        if (StringUtils.hasText(request.getThumbnailUrl())) content.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getMediaUrl() != null) content.setMediaUrl(request.getMediaUrl());
        if (request.getDurationSeconds() != null) content.setDurationSeconds(request.getDurationSeconds());
        if (request.getDifficulty() != null) content.setDifficulty(request.getDifficulty());
        if (StringUtils.hasText(request.getCategory())) content.setCategory(request.getCategory());

        if (request.getStatus() != null && request.getStatus() != content.getStatus()) {
            content.setStatus(request.getStatus());
            if (request.getStatus() == ContentStatus.PUBLISHED && content.getPublishedAt() == null) {
                content.setPublishedAt(LocalDateTime.now());
            }
        }

        final Content savedContent = contentRepository.save(content);

        ArticleDto articleDto = null;
        if (savedContent.getType() == ContentType.ARTICLE) {
            Article article = articleRepository.findByContentId(savedContent.getId())
                    .orElseGet(() -> Article.builder().content(savedContent).contentId(savedContent.getId()).build());
            if (request.getEnglishBody() != null) article.setEnglishBody(request.getEnglishBody());
            if (request.getVietnameseBody() != null) article.setVietnameseBody(request.getVietnameseBody());
            article = articleRepository.save(article);
            articleDto = ArticleDto.fromEntity(article);
        }

        List<TranscriptSegmentDto> segmentDtos = null;
        if (savedContent.getType() == ContentType.PODCAST || savedContent.getType() == ContentType.VIDEO) {
            if (request.getTranscriptSegments() != null) {
                segmentDtos = updateTranscripts(id, request.getTranscriptSegments());
            } else {
                segmentDtos = transcriptSegmentRepository.findByContentIdOrderByPositionAsc(id)
                        .stream().map(TranscriptSegmentDto::fromEntity).collect(Collectors.toList());
            }
        }

        return ContentDetailDto.fromEntity(savedContent, articleDto, segmentDtos);
    }

    @Transactional
    public List<TranscriptSegmentDto> updateTranscripts(Long contentId, List<TranscriptSegmentDto> newSegments) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new AppException(ErrorCode.CONTENT_NOT_FOUND));

        transcriptSegmentRepository.deleteByContentId(contentId);

        List<TranscriptSegment> entities = new ArrayList<>();
        for (int i = 0; i < newSegments.size(); i++) {
            TranscriptSegmentDto dto = newSegments.get(i);
            entities.add(TranscriptSegment.builder()
                    .content(content)
                    .startMs(dto.getStartMs())
                    .endMs(dto.getEndMs())
                    .englishText(dto.getEnglishText())
                    .vietnameseText(dto.getVietnameseText() != null ? dto.getVietnameseText() : "")
                    .position(i)
                    .build());
        }

        entities = transcriptSegmentRepository.saveAll(entities);
        return entities.stream().map(TranscriptSegmentDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void deleteContent(Long id) {
        if (!contentRepository.existsById(id)) {
            throw new AppException(ErrorCode.CONTENT_NOT_FOUND);
        }
        contentRepository.deleteById(id);
    }

    @Transactional
    public ContentSummaryDto togglePublish(Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CONTENT_NOT_FOUND));

        if (content.getStatus() == ContentStatus.PUBLISHED) {
            content.setStatus(ContentStatus.DRAFT);
        } else {
            content.setStatus(ContentStatus.PUBLISHED);
            if (content.getPublishedAt() == null) {
                content.setPublishedAt(LocalDateTime.now());
            }
        }
        content = contentRepository.save(content);
        return ContentSummaryDto.fromEntity(content);
    }
}
