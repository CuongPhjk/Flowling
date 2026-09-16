package com.englishflow.vocabulary.repository;

import com.englishflow.vocabulary.entity.UserVocabulary;
import com.englishflow.vocabulary.entity.VocabStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserVocabularyRepository extends JpaRepository<UserVocabulary, Long> {

    Optional<UserVocabulary> findByUserIdAndVocabularyId(Long userId, Long vocabularyId);

    @Query("SELECT uv FROM UserVocabulary uv JOIN FETCH uv.vocabulary v " +
           "WHERE uv.user.id = :userId AND uv.nextReviewAt <= :cutoff " +
           "ORDER BY uv.nextReviewAt ASC")
    List<UserVocabulary> findDueReviews(
            @Param("userId") Long userId,
            @Param("cutoff") LocalDateTime cutoff,
            Pageable pageable
    );

    @Query("SELECT uv FROM UserVocabulary uv JOIN FETCH uv.vocabulary v " +
           "WHERE uv.user.id = :userId " +
           "AND (:status IS NULL OR uv.status = :status) " +
           "AND (:query IS NULL OR LOWER(v.term) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.meaningVi) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<UserVocabulary> findUserWordBank(
            @Param("userId") Long userId,
            @Param("status") VocabStatus status,
            @Param("query") String query,
            Pageable pageable
    );

    long countByUserIdAndStatus(Long userId, VocabStatus status);

    long countByUserId(Long userId);
}
