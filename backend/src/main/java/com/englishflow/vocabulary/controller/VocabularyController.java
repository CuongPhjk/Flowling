package com.englishflow.vocabulary.controller;

import com.englishflow.common.dto.ApiResponse;
import com.englishflow.common.dto.PageResponse;
import com.englishflow.security.UserPrincipal;
import com.englishflow.vocabulary.dto.SaveVocabRequest;
import com.englishflow.vocabulary.dto.UserVocabResponse;
import com.englishflow.vocabulary.entity.VocabStatus;
import com.englishflow.vocabulary.entity.Vocabulary;
import com.englishflow.vocabulary.service.VocabularyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/vocabulary")
@RequiredArgsConstructor
public class VocabularyController {

    private final VocabularyService vocabularyService;

    @GetMapping("/lookup")
    public ResponseEntity<ApiResponse<Vocabulary>> lookup(@RequestParam String term) {
        return vocabularyService.lookup(term)
                .map(v -> ResponseEntity.ok(ApiResponse.ok(v)))
                .orElse(ResponseEntity.ok(ApiResponse.ok("Word not in global dictionary yet", null)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserVocabResponse>> saveWord(
            @Valid @RequestBody SaveVocabRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UserVocabResponse response = vocabularyService.saveVocabulary(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Vocabulary saved", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserVocabResponse>>> getWordBank(
            @RequestParam(required = false) VocabStatus status,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        PageResponse<UserVocabResponse> response = vocabularyService.getUserWordBank(principal.getId(), status, query, pageRequest);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWord(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        vocabularyService.deleteUserVocabulary(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Vocabulary deleted", null));
    }
}
