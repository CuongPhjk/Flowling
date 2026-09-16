package com.englishflow.review.dto;

public enum ReviewGrade {
    AGAIN, // 1: Quên (Reset, interval = 1)
    HARD,  // 2: Khó (interval = 1.2 * interval, easeFactor down)
    GOOD,  // 3: Tốt (standard SM-2 promotion)
    EASY   // 4: Dễ (bonus interval & easeFactor up)
}
