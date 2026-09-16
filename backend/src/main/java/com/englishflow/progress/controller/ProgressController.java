package com.englishflow.progress.controller;

import com.englishflow.common.dto.ApiResponse;
import com.englishflow.common.dto.PageResponse;
import com.englishflow.progress.dto.ProgressResponse;
import com.englishflow.progress.dto.ProgressUpdateRequest;
import com.englishflow.progress.service.ProgressService;
import com.englishflow.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/{contentId}")
    public ResponseEntity<ApiResponse<ProgressResponse>> updateProgress(
            @PathVariable Long contentId,
            @Valid @RequestBody ProgressUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ProgressResponse response = progressService.updateProgress(principal.getId(), contentId, request);
        return ResponseEntity.ok(ApiResponse.ok("Progress updated", response));
    }

    @GetMapping("/continue")
    public ResponseEntity<ApiResponse<ProgressResponse>> getContinue(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return progressService.getContinue(principal.getId())
                .map(res -> ResponseEntity.ok(ApiResponse.ok(res)))
                .orElse(ResponseEntity.ok(ApiResponse.ok("No active content", null)));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<PageResponse<ProgressResponse>>> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        PageResponse<ProgressResponse> history = progressService.getHistory(principal.getId(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
