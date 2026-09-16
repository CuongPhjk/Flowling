package com.englishflow.review.controller;

import com.englishflow.common.dto.ApiResponse;
import com.englishflow.review.dto.ReviewCardDto;
import com.englishflow.review.dto.ReviewSubmitRequest;
import com.englishflow.review.dto.ReviewSubmitResponse;
import com.englishflow.review.service.SrsReviewService;
import com.englishflow.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/review")
@RequiredArgsConstructor
public class ReviewController {

    private final SrsReviewService reviewService;

    @GetMapping("/due")
    public ResponseEntity<ApiResponse<List<ReviewCardDto>>> getDueReviews(
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ReviewCardDto> dueCards = reviewService.getDueReviews(principal.getId(), limit);
        return ResponseEntity.ok(ApiResponse.ok(dueCards));
    }

    @PostMapping("/{userVocabId}")
    public ResponseEntity<ApiResponse<ReviewSubmitResponse>> submitReview(
            @PathVariable Long userVocabId,
            @Valid @RequestBody ReviewSubmitRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ReviewSubmitResponse response = reviewService.submitReview(principal.getId(), userVocabId, request.getGrade());
        return ResponseEntity.ok(ApiResponse.ok("Review submitted", response));
    }
}
