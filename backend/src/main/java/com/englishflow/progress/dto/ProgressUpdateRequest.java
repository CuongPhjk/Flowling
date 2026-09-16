package com.englishflow.progress.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUpdateRequest {
    @NotNull
    @Min(0)
    @Max(100)
    private Float progressPercentage;

    @NotNull
    @Min(0)
    private Integer lastPositionSeconds;

    private Boolean isCompleted;
}
