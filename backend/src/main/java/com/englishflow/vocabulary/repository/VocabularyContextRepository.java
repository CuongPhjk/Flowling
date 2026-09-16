package com.englishflow.vocabulary.repository;

import com.englishflow.vocabulary.entity.VocabularyContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularyContextRepository extends JpaRepository<VocabularyContext, Long> {

    List<VocabularyContext> findByUserVocabularyIdOrderByCreatedAtDesc(Long userVocabularyId);

    long countByUserVocabularyId(Long userVocabularyId);

    boolean existsByUserVocabularyIdAndSentence(Long userVocabularyId, String sentence);
}
