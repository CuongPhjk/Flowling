package com.englishflow.content.dto;

import com.englishflow.content.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDto {
    private String englishBody;
    private String vietnameseBody;

    public static ArticleDto fromEntity(Article article) {
        if (article == null) return null;
        return ArticleDto.builder()
                .englishBody(article.getEnglishBody())
                .vietnameseBody(article.getVietnameseBody())
                .build();
    }
}
