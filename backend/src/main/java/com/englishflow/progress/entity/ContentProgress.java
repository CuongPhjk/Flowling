package com.englishflow.progress.entity;

import com.englishflow.content.entity.Content;
import com.englishflow.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "content_progress",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_content_progress", columnNames = {"user_id", "content_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(name = "progress_percentage", nullable = false)
    @Builder.Default
    private Float progressPercentage = 0.0f;

    @Column(name = "last_position_seconds", nullable = false)
    @Builder.Default
    private Integer lastPositionSeconds = 0;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
