package com.englishflow.vocabulary.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vocabularies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vocabulary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String term;

    @Column(name = "part_of_speech", nullable = false, length = 50)
    private String partOfSpeech;

    @Column(name = "meaning_vi", nullable = false, columnDefinition = "TEXT")
    private String meaningVi;

    @Column(length = 100)
    private String phonetic;

    @Column(name = "audio_url", length = 500)
    private String audioUrl;
}
