package com.englishflow.progress.controller;

import com.englishflow.common.dto.ApiResponse;
import com.englishflow.common.dto.PageResponse;
import com.englishflow.content.dto.ContentSummaryDto;
import com.englishflow.progress.service.SavedContentService;
import com.englishflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/saved")
@RequiredArgsConstructor
public class SavedContentController {

    private final SavedContentService savedContentService;

    @PostMapping("/{contentId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> toggleSave(
            @PathVariable Long contentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Map<String, Boolean> result = savedContentService.toggleSave(principal.getId(), contentId);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ContentSummaryDto>>> getSaved(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        PageResponse<ContentSummaryDto> saved = savedContentService.getSavedContents(principal.getId(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.ok(saved));
    }
}
