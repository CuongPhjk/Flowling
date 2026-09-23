package com.englishflow.content.repository;

import com.englishflow.content.entity.Content;
import com.englishflow.content.entity.ContentStatus;
import com.englishflow.content.entity.ContentType;
import com.englishflow.content.entity.Difficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long>, JpaSpecificationExecutor<Content> {

    Optional<Content> findBySlug(String slug);

    boolean existsBySlug(String slug);

    default Page<Content> findWithFilters(
            ContentStatus status,
            ContentType type,
            Difficulty difficulty,
            String category,
            String keyword,
            Pageable pageable
    ) {
        return findAll(ContentSpecification.withFilters(status, type, difficulty, category, keyword), pageable);
    }

    long countByStatus(ContentStatus status);
}
