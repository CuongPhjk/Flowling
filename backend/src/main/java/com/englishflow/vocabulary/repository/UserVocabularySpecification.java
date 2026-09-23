package com.englishflow.vocabulary.repository;

import com.englishflow.vocabulary.entity.UserVocabulary;
import com.englishflow.vocabulary.entity.VocabStatus;
import com.englishflow.vocabulary.entity.Vocabulary;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public final class UserVocabularySpecification {

    private UserVocabularySpecification() {}

    public static Specification<UserVocabulary> withFilters(
            Long userId,
            VocabStatus status,
            String queryText
    ) {
        return (root, query, cb) -> {
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("vocabulary", JoinType.INNER);
            }
            Join<UserVocabulary, Vocabulary> v = root.join("vocabulary", JoinType.INNER);

            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user").get("id"), userId));

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (StringUtils.hasText(queryText)) {
                String pattern = "%" + queryText.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(v.get("term")), pattern),
                        cb.like(cb.lower(v.get("meaningVi")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
