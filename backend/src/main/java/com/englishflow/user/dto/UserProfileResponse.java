package com.englishflow.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String avatarUrl;
    private Integer currentStreak;
    private Integer totalXp;
    private long learningWordsCount;
    private long masteredWordsCount;
    private long completedContentsCount;
    private long savedContentsCount;
    private LocalDateTime createdAt;
}
