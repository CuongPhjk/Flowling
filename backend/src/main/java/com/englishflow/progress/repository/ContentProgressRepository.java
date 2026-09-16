package com.englishflow.progress.repository;

import com.englishflow.progress.entity.ContentProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContentProgressRepository extends JpaRepository<ContentProgress, Long> {

    Optional<ContentProgress> findByUserIdAndContentId(Long userId, Long contentId);

    @Query("SELECT cp FROM ContentProgress cp JOIN FETCH cp.content c " +
           "WHERE cp.user.id = :userId " +
           "ORDER BY cp.updatedAt DESC")
    Page<ContentProgress> findHistoryByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT cp FROM ContentProgress cp JOIN FETCH cp.content c " +
           "WHERE cp.user.id = :userId AND cp.isCompleted = false " +
           "ORDER BY cp.updatedAt DESC")
    Page<ContentProgress> findLatestIncomplete(@Param("userId") Long userId, Pageable pageable);

    long countByUserIdAndIsCompletedTrue(Long userId);
}
