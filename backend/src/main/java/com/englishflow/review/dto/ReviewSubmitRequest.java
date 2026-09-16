package com.englishflow.review.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSubmitRequest {
    @NotNull(message = "Grade is required")
    private ReviewGrade grade;
}
