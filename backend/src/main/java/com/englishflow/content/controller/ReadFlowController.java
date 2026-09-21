package com.englishflow.content.controller;

import com.englishflow.common.dto.ApiResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping({"/v1/readflow", "/readflow"})
@RequiredArgsConstructor
public class ReadFlowController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key:}")
    private String defaultGeminiApiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String defaultGeminiModel;

    @Data
    public static class CrawlRequest {
        private String url;
    }

    @Data
    public static class CrawlResponse {
        private String title;
        private String siteName;
        private String url;
        private String formattedText;
        private int wordCount;
    }

    @Data
    public static class TranslateRequest {
        private String text;
        private String apiKey;
        private String model;
    }

    @Data
    public static class TranslateResponse {
        private String originalText;
        private String translation;
        private String modelUsed;
    }

    @Data
    public static class LookupRequest {
        private String word;
        private String context;
        private String apiKey;
        private String model;
    }

    @Data
    public static class LookupResponse {
        private String word;
        private String ipa;
        private String partOfSpeech;
        private String meaning;
        private String example;
        private String exampleTranslation;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "status", "ok",
                "hasApiKey", defaultGeminiApiKey != null && !defaultGeminiApiKey.isBlank(),
                "model", defaultGeminiModel != null ? defaultGeminiModel : "gemini-2.5-flash"
        )));
    }

    @PostMapping("/crawl")
    public ResponseEntity<ApiResponse<CrawlResponse>> crawlArticle(@RequestBody CrawlRequest request) {
        if (request.getUrl() == null || request.getUrl().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng nhập URL bài viết."));
        }

        try {
            String targetUrl = request.getUrl().trim();
            if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
                targetUrl = "https://" + targetUrl;
            }

            URI uri = URI.create(targetUrl);
            HttpClient client = HttpClient.newBuilder()
                    .followRedirects(HttpClient.Redirect.ALWAYS)
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                    .timeout(Duration.ofSeconds(15))
                    .GET()
                    .build();

            HttpResponse<String> httpResponse = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            String html = httpResponse.body();

            // Extract title
            String title = "Bài viết trực tuyến";
            Matcher titleMatcher = Pattern.compile("<title>(.*?)</title>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL).matcher(html);
            if (titleMatcher.find()) {
                title = titleMatcher.group(1).replaceAll("<[^>]*>", "").trim();
            }

            // Extract paragraphs (<p> tags)
            StringBuilder textBuilder = new StringBuilder();
            Matcher pMatcher = Pattern.compile("<p[^>]*>(.*?)</p>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL).matcher(html);
            int count = 0;
            while (pMatcher.find() && count < 25) {
                String pText = pMatcher.group(1).replaceAll("<[^>]*>", "").replaceAll("&nbsp;", " ").trim();
                if (pText.length() > 30 && !pText.toLowerCase().contains("cookie") && !pText.toLowerCase().contains("subscribe")) {
                    if (!textBuilder.isEmpty()) textBuilder.append("\n\n");
                    textBuilder.append(pText);
                    count++;
                }
            }

            String formattedText = textBuilder.toString();
            if (formattedText.isBlank()) {
                formattedText = "Không tìm thấy nội dung bài viết từ trang này. Vui lòng thử sao chép văn bản và dán trực tiếp.";
            }

            CrawlResponse response = new CrawlResponse();
            response.setTitle(title);
            response.setSiteName(uri.getHost() != null ? uri.getHost().replaceFirst("^www\\.", "") : "Web Article");
            response.setUrl(targetUrl);
            response.setFormattedText(formattedText);
            response.setWordCount(formattedText.split("\\s+").length);

            return ResponseEntity.ok(ApiResponse.ok(response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi bóc tách bài viết: " + e.getMessage()));
        }
    }

    @PostMapping("/translate")
    public ResponseEntity<ApiResponse<TranslateResponse>> translate(@RequestBody TranslateRequest request) {
        if (request.getText() == null || request.getText().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng nhập văn bản cần dịch."));
        }

        String apiKey = request.getApiKey() != null && !request.getApiKey().isBlank()
                ? request.getApiKey()
                : defaultGeminiApiKey;

        String modelName = request.getModel() != null && !request.getModel().isBlank()
                ? request.getModel()
                : (defaultGeminiModel != null ? defaultGeminiModel : "gemini-2.5-flash");

        if (apiKey == null || apiKey.isBlank()) {
            TranslateResponse fallback = new TranslateResponse();
            fallback.setOriginalText(request.getText());
            fallback.setTranslation("[Bản dịch AI]: " + request.getText());
            fallback.setModelUsed("demo-local-fallback");
            return ResponseEntity.ok(ApiResponse.ok(fallback));
        }

        try {
            String systemInstruction = "Bạn là một chuyên gia dịch thuật và trợ lý dạy đọc hiểu tiếng Anh.\n"
                    + "Nhiệm vụ: Dịch văn bản tiếng Anh sang tiếng Việt chuẩn xác, tự nhiên, đúng ngữ cảnh.\n"
                    + "Giữ nguyên cấu trúc các đoạn văn (paragraphs) tương ứng với bản gốc để tiện đối chiếu song ngữ.\n"
                    + "Chỉ trả về nội dung bản dịch tiếng Việt.";

            String requestBody = objectMapper.writeValueAsString(Map.of(
                    "contents", java.util.List.of(
                            Map.of("role", "user", "parts", java.util.List.of(
                                    Map.of("text", systemInstruction + "\n\nVăn bản tiếng Anh:\n" + request.getText())
                            ))
                    )
            ));

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> httpResponse = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (httpResponse.statusCode() >= 400) {
                return ResponseEntity.status(httpResponse.statusCode()).body(ApiResponse.error("Lỗi từ Gemini API: " + httpResponse.body()));
            }

            JsonNode root = objectMapper.readTree(httpResponse.body());
            String translation = root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText().trim();

            TranslateResponse response = new TranslateResponse();
            response.setOriginalText(request.getText());
            response.setTranslation(translation);
            response.setModelUsed(modelName);

            return ResponseEntity.ok(ApiResponse.ok(response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi dịch văn bản: " + e.getMessage()));
        }
    }

    @PostMapping("/lookup-word")
    public ResponseEntity<ApiResponse<LookupResponse>> lookupWord(@RequestBody LookupRequest request) {
        if (request.getWord() == null || request.getWord().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng cung cấp từ cần tra cứu."));
        }

        String apiKey = request.getApiKey() != null && !request.getApiKey().isBlank()
                ? request.getApiKey()
                : defaultGeminiApiKey;

        String modelName = request.getModel() != null && !request.getModel().isBlank()
                ? request.getModel()
                : (defaultGeminiModel != null ? defaultGeminiModel : "gemini-2.5-flash");

        if (apiKey == null || apiKey.isBlank()) {
            LookupResponse fallback = new LookupResponse();
            fallback.setWord(request.getWord());
            fallback.setIpa("/" + request.getWord().toLowerCase() + "/");
            fallback.setPartOfSpeech(request.getWord().contains(" ") ? "phrase" : "vocabulary");
            fallback.setMeaning("Nghĩa của \"" + request.getWord() + "\" theo ngữ cảnh");
            fallback.setExample(request.getContext() != null ? request.getContext() : "We use " + request.getWord() + " in context.");
            fallback.setExampleTranslation("Chúng ta sử dụng \"" + request.getWord() + "\" trong ngữ cảnh thực tế.");
            return ResponseEntity.ok(ApiResponse.ok(fallback));
        }

        try {
            String prompt = "Bạn là từ điển Anh - Việt chuyên sâu và trợ lý học tiếng Anh.\n"
                    + "Hãy phân tích từ hoặc cụm từ: \"" + request.getWord() + "\"\n"
                    + "Ngữ cảnh trong câu: \"" + (request.getContext() != null ? request.getContext() : request.getWord()) + "\"\n\n"
                    + "BẮT BUỘC: Trả về DUY NHẤT 1 JSON object chuẩn RFC 8259 có cấu trúc:\n"
                    + "{\"word\":\"...\",\"ipa\":\"...\",\"partOfSpeech\":\"...\",\"meaning\":\"...\",\"example\":\"...\",\"exampleTranslation\":\"...\"}";

            String requestBody = objectMapper.writeValueAsString(Map.of(
                    "contents", java.util.List.of(
                            Map.of("role", "user", "parts", java.util.List.of(
                                    Map.of("text", prompt)
                            ))
                    ),
                    "generationConfig", Map.of("responseMimeType", "application/json")
            ));

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(20))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> httpResponse = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (httpResponse.statusCode() >= 400) {
                return ResponseEntity.status(httpResponse.statusCode()).body(ApiResponse.error("Lỗi từ Gemini API: " + httpResponse.body()));
            }

            JsonNode root = objectMapper.readTree(httpResponse.body());
            String jsonText = root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText().trim();
            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.replaceFirst("^```json\\s*", "").replaceFirst("\\s*```$", "");
            }

            LookupResponse response = objectMapper.readValue(jsonText, LookupResponse.class);
            return ResponseEntity.ok(ApiResponse.ok(response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi khi tra cứu từ: " + e.getMessage()));
        }
    }
}
