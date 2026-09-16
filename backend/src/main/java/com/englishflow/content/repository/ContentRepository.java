package com.englishflow.content.repository;

import com.englishflow.content.entity.Content;
import com.englishflow.content.entity.ContentStatus;
import com.englishflow.content.entity.ContentType;
import com.englishflow.content.entity.Difficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {

    Optional<Content> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("SELECT c FROM Content c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:type IS NULL OR c.type = :type) AND " +
           "(:difficulty IS NULL OR c.difficulty = :difficulty) AND " +
           "(:category IS NULL OR LOWER(c.category) = LOWER(:category)) AND " +
           "(:keyword IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Content> findWithFilters(
            @Param("status") ContentStatus status,
            @Param("type") ContentType type,
            @Param("difficulty") Difficulty difficulty,
            @Param("category") String category,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(ContentStatus status);
}
