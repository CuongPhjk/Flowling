package com.englishflow.progress.service;

import com.englishflow.common.dto.PageResponse;
import com.englishflow.common.exception.AppException;
import com.englishflow.common.exception.ErrorCode;
import com.englishflow.content.dto.ContentSummaryDto;
import com.englishflow.content.entity.Content;
import com.englishflow.content.repository.ContentRepository;
import com.englishflow.progress.entity.SavedContent;
import com.englishflow.progress.repository.ContentProgressRepository;
import com.englishflow.progress.repository.SavedContentRepository;
import com.englishflow.user.entity.User;
import com.englishflow.user.repository.UserRepository;
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
public class SavedContentService {

    private final SavedContentRepository savedContentRepository;
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;
    private final ContentProgressRepository contentProgressRepository;

    @Transactional
    public Map<String, Boolean> toggleSave(Long userId, Long contentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new AppException(ErrorCode.CONTENT_NOT_FOUND));

        boolean exists = savedContentRepository.existsByUserIdAndContentId(userId, contentId);
        if (exists) {
            savedContentRepository.deleteByUserIdAndContentId(userId, contentId);
            return Map.of("isSaved", false);
        } else {
            SavedContent sc = SavedContent.builder()
                    .user(user)
                    .content(content)
                    .build();
            savedContentRepository.save(sc);
            return Map.of("isSaved", true);
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<ContentSummaryDto> getSavedContents(Long userId, Pageable pageable) {
        Page<SavedContent> page = savedContentRepository.findSavedByUserId(userId, pageable);
        List<ContentSummaryDto> dtos = page.getContent().stream().map(sc -> {
            ContentSummaryDto dto = ContentSummaryDto.fromEntity(sc.getContent());
            dto.setIsSaved(true);
            contentProgressRepository.findByUserIdAndContentId(userId, sc.getContent().getId())
                    .ifPresent(cp -> dto.setProgressPercentage(cp.getProgressPercentage()));
            return dto;
        }).collect(Collectors.toList());

        return PageResponse.of(page, dtos);
    }
}
