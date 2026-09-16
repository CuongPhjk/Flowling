package com.englishflow.vocabulary.repository;

import com.englishflow.vocabulary.entity.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {
    Optional<Vocabulary> findByTermIgnoreCase(String term);
    boolean existsByTermIgnoreCase(String term);
}
