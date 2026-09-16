package com.englishflow.content.repository;

import com.englishflow.content.entity.TranscriptSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranscriptSegmentRepository extends JpaRepository<TranscriptSegment, Long> {
    List<TranscriptSegment> findByContentIdOrderByPositionAsc(Long contentId);
    void deleteByContentId(Long contentId);
}
