package com.englishflow.admin.controller;

import com.englishflow.admin.dto.AdminStatsResponse;
import com.englishflow.admin.dto.CreateContentRequest;
import com.englishflow.admin.dto.UpdateContentRequest;
import com.englishflow.common.dto.ApiResponse;
import com.englishflow.common.dto.PageResponse;
import com.englishflow.content.dto.ContentDetailDto;
import com.englishflow.content.dto.ContentSummaryDto;
import com.englishflow.content.dto.TranscriptSegmentDto;
import com.englishflow.content.entity.ContentStatus;
import com.englishflow.content.entity.ContentType;
import com.englishflow.admin.service.AdminContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
public class AdminContentController {

    private final AdminContentService adminContentService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        AdminStatsResponse stats = adminContentService.getStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/contents")
    public ResponseEntity<ApiResponse<PageResponse<ContentSummaryDto>>> listContents(
            @RequestParam(required = false) ContentStatus status,
            @RequestParam(required = false) ContentType type,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageResponse<ContentSummaryDto> result = adminContentService.listContents(status, type, keyword, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/contents")
    public ResponseEntity<ApiResponse<ContentDetailDto>> createContent(@Valid @RequestBody CreateContentRequest request) {
        ContentDetailDto created = adminContentService.createContent(request);
        return ResponseEntity.ok(ApiResponse.ok("Content created successfully", created));
    }

    @PutMapping("/contents/{id}")
    public ResponseEntity<ApiResponse<ContentDetailDto>> updateContent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateContentRequest request
    ) {
        ContentDetailDto updated = adminContentService.updateContent(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Content updated successfully", updated));
    }

    @PutMapping("/contents/{id}/publish")
    public ResponseEntity<ApiResponse<ContentSummaryDto>> togglePublish(@PathVariable Long id) {
        ContentSummaryDto updated = adminContentService.togglePublish(id);
        return ResponseEntity.ok(ApiResponse.ok("Content status updated", updated));
    }

    @PutMapping("/contents/{id}/transcripts")
    public ResponseEntity<ApiResponse<List<TranscriptSegmentDto>>> updateTranscripts(
            @PathVariable Long id,
            @RequestBody List<TranscriptSegmentDto> segments
    ) {
        List<TranscriptSegmentDto> updated = adminContentService.updateTranscripts(id, segments);
        return ResponseEntity.ok(ApiResponse.ok("Transcripts updated successfully", updated));
    }

    @DeleteMapping("/contents/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContent(@PathVariable Long id) {
        adminContentService.deleteContent(id);
        return ResponseEntity.ok(ApiResponse.ok("Content deleted successfully", null));
    }
}
