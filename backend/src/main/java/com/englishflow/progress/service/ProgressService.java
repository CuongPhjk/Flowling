package com.englishflow.progress.service;

import com.englishflow.common.dto.PageResponse;
import com.englishflow.common.exception.AppException;
import com.englishflow.common.exception.ErrorCode;
import com.englishflow.content.dto.ContentSummaryDto;
import com.englishflow.content.entity.Content;
import com.englishflow.content.repository.ContentRepository;
import com.englishflow.progress.dto.ProgressResponse;
import com.englishflow.progress.dto.ProgressUpdateRequest;
import com.englishflow.progress.entity.ContentProgress;
import com.englishflow.progress.repository.ContentProgressRepository;
import com.englishflow.progress.repository.SavedContentRepository;
import com.englishflow.user.entity.User;
import com.englishflow.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ContentProgressRepository progressRepository;
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;
    private final SavedContentRepository savedContentRepository;

    @Transactional
    public ProgressResponse updateProgress(Long userId, Long contentId, ProgressUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new AppException(ErrorCode.CONTENT_NOT_FOUND));

        ContentProgress progress = progressRepository.findByUserIdAndContentId(userId, contentId)
                .orElseGet(() -> ContentProgress.builder()
                        .user(user)
                        .content(content)
                        .build());

        progress.setProgressPercentage(request.getProgressPercentage());
        progress.setLastPositionSeconds(request.getLastPositionSeconds());

        boolean newlyCompleted = Boolean.TRUE.equals(request.getIsCompleted()) && !Boolean.TRUE.equals(progress.getIsCompleted());
        if (request.getIsCompleted() != null) {
            progress.setIsCompleted(request.getIsCompleted());
        }

        progress = progressRepository.save(progress);

        // If completed for the first time, award 10 XP
        if (newlyCompleted) {
            user.setTotalXp(user.getTotalXp() + 10);
            userRepository.save(user);
        }

        ProgressResponse res = ProgressResponse.fromEntity(progress);
        res.getContent().setIsSaved(savedContentRepository.existsByUserIdAndContentId(userId, contentId));
        return res;
    }

    @Transactional(readOnly = true)
    public Optional<ProgressResponse> getContinue(Long userId) {
        Page<ContentProgress> page = progressRepository.findLatestIncomplete(userId, PageRequest.of(0, 1));
        if (page.isEmpty()) {
            return Optional.empty();
        }
        ContentProgress cp = page.getContent().get(0);
        ProgressResponse res = ProgressResponse.fromEntity(cp);
        res.getContent().setIsSaved(savedContentRepository.existsByUserIdAndContentId(userId, cp.getContent().getId()));
        return Optional.of(res);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProgressResponse> getHistory(Long userId, Pageable pageable) {
        Page<ContentProgress> page = progressRepository.findHistoryByUserId(userId, pageable);
        List<ProgressResponse> items = page.getContent().stream().map(cp -> {
            ProgressResponse res = ProgressResponse.fromEntity(cp);
            res.getContent().setIsSaved(savedContentRepository.existsByUserIdAndContentId(userId, cp.getContent().getId()));
            return res;
        }).collect(Collectors.toList());

        return PageResponse.of(page, items);
    }
}
