package com.englishflow.vocabulary.entity;

import com.englishflow.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_vocabularies",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_vocabulary", columnNames = {"user_id", "vocabulary_id"})
    },
    indexes = {
        @Index(name = "idx_user_vocab_due", columnList = "user_id, next_review_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVocabulary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vocabulary_id", nullable = false)
    private Vocabulary vocabulary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VocabStatus status = VocabStatus.LEARNING;

    @Column(name = "ease_factor", nullable = false)
    @Builder.Default
    private Float easeFactor = 2.5f;

    @Column(name = "interval_days", nullable = false)
    @Builder.Default
    private Integer intervalDays = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer repetitions = 0;

    @Column(name = "next_review_at", nullable = false)
    private LocalDateTime nextReviewAt;

    @Column(name = "last_reviewed_at")
    private LocalDateTime lastReviewedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
