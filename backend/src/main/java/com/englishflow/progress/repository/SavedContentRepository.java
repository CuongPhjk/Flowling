package com.englishflow.progress.repository;

import com.englishflow.progress.entity.SavedContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedContentRepository extends JpaRepository<SavedContent, Long> {

    Optional<SavedContent> findByUserIdAndContentId(Long userId, Long contentId);

    boolean existsByUserIdAndContentId(Long userId, Long contentId);

    void deleteByUserIdAndContentId(Long userId, Long contentId);

    @Query("SELECT sc FROM SavedContent sc JOIN FETCH sc.content c " +
           "WHERE sc.user.id = :userId " +
           "ORDER BY sc.createdAt DESC")
    Page<SavedContent> findSavedByUserId(@Param("userId") Long userId, Pageable pageable);

    long countByUserId(Long userId);
}
