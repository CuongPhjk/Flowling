package com.englishflow.content.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "transcript_segments",
    indexes = {
        @Index(name = "idx_segments_content_pos", columnList = "content_id, position ASC"),
        @Index(name = "idx_segments_time", columnList = "content_id, start_ms, end_ms")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranscriptSegment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(name = "start_ms", nullable = false)
    private Integer startMs;

    @Column(name = "end_ms", nullable = false)
    private Integer endMs;

    @Column(name = "english_text", nullable = false, columnDefinition = "TEXT")
    private String englishText;

    @Column(name = "vietnamese_text", nullable = false, columnDefinition = "TEXT")
    private String vietnameseText;

    @Column(nullable = false)
    private Integer position;
}
