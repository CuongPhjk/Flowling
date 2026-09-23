package com.englishflow.vocabulary.repository;

import com.englishflow.vocabulary.entity.UserVocabulary;
import com.englishflow.vocabulary.entity.VocabStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserVocabularyRepository extends JpaRepository<UserVocabulary, Long>, JpaSpecificationExecutor<UserVocabulary> {

    Optional<UserVocabulary> findByUserIdAndVocabularyId(Long userId, Long vocabularyId);

    @Query("SELECT uv FROM UserVocabulary uv JOIN FETCH uv.vocabulary v " +
           "WHERE uv.user.id = :userId AND uv.nextReviewAt <= :cutoff " +
           "ORDER BY uv.nextReviewAt ASC")
    List<UserVocabulary> findDueReviews(
            @Param("userId") Long userId,
            @Param("cutoff") LocalDateTime cutoff,
            Pageable pageable
    );

    default Page<UserVocabulary> findUserWordBank(
            Long userId,
            VocabStatus status,
            String query,
            Pageable pageable
    ) {
        return findAll(UserVocabularySpecification.withFilters(userId, status, query), pageable);
    }

    long countByUserIdAndStatus(Long userId, VocabStatus status);

    long countByUserId(Long userId);
}
