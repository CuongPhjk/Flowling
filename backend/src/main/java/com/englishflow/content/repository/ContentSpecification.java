package com.englishflow.content.repository;

import com.englishflow.content.entity.Content;
import com.englishflow.content.entity.ContentStatus;
import com.englishflow.content.entity.ContentType;
import com.englishflow.content.entity.Difficulty;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public final class ContentSpecification {

    private ContentSpecification() {}

    public static Specification<Content> withFilters(
            ContentStatus status,
            ContentType type,
            Difficulty difficulty,
            String category,
            String keyword
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (difficulty != null) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }
            if (StringUtils.hasText(category)) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.trim().toLowerCase()));
            }
            if (StringUtils.hasText(keyword)) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
