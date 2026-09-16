package com.englishflow.content.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article implements Persistable<Long> {

    @Id
    @Column(name = "content_id")
    private Long contentId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "content_id")
    private Content content;

    @Column(name = "english_body", nullable = false, columnDefinition = "TEXT")
    private String englishBody;

    @Column(name = "vietnamese_body", nullable = false, columnDefinition = "TEXT")
    private String vietnameseBody;

    @Transient
    @Builder.Default
    private boolean isNew = true;

    @Override
    public Long getId() {
        return contentId != null ? contentId : (content != null ? content.getId() : null);
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostLoad
    @PostPersist
    void markNotNew() {
        this.isNew = false;
    }
}
