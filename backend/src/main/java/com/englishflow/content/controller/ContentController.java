package com.englishflow.content.controller;

import com.englishflow.common.dto.ApiResponse;
import com.englishflow.common.dto.PageResponse;
import com.englishflow.content.dto.ContentDetailDto;
import com.englishflow.content.dto.ContentSummaryDto;
import com.englishflow.content.entity.ContentType;
import com.englishflow.content.entity.Difficulty;
import com.englishflow.content.service.ContentService;
import com.englishflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<PageResponse<ContentSummaryDto>>> getFeed(
            @RequestParam(required = false) ContentType type,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Long userId = principal != null ? principal.getId() : null;

        PageResponse<ContentSummaryDto> feed = contentService.getFeed(type, difficulty, category, keyword, pageRequest, userId);
        return ResponseEntity.ok(ApiResponse.ok(feed));
    }

    @GetMapping("/contents/{slug}")
    public ResponseEntity<ApiResponse<ContentDetailDto>> getContent(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal != null ? principal.getId() : null;
        ContentDetailDto detail = contentService.getContentBySlug(slug, userId);
        return ResponseEntity.ok(ApiResponse.ok(detail));
    }
}
