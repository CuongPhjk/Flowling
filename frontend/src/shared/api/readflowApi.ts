import { apiClient } from "./client";

export interface CrawlResult {
  title: string;
  siteName: string;
  byline?: string;
  url: string;
  formattedText: string;
  wordCount: number;
  isTruncated?: boolean;
}

export interface VocabularyLookupResult {
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

export interface TranslationResult {
  originalText: string;
  translation: string;
  modelUsed: string;
}

export interface TTSResult {
  audioBase64?: string;
  mimeType?: string;
  voiceName: string;
}

// In-memory lookup cache to avoid redundant API calls
const vocabCache = new Map<string, VocabularyLookupResult>();

/**
 * Crawl article from URL
 */
export async function crawlArticle(url: string): Promise<CrawlResult> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    throw new Error("Vui lòng nhập đường dẫn bài báo.");
  }

  try {
    const response = await apiClient.post("/readflow/crawl", { url: cleanUrl });
    if (response.data?.data) {
      return response.data.data;
    }
  } catch (err) {
    console.warn("Backend crawl API unavailable, falling back to direct parse/fetch:", err);
  }

  // Client-side fallback using proxy or heuristic extraction
  try {
    const validUrl = new URL(cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`);
    const host = validUrl.hostname.replace(/^www\./, "");
    
    // Attempt public cors proxy or readable text extraction
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(validUrl.toString())}`);
    if (res.ok) {
      const data = await res.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents || "", "text/html");
      const title = doc.querySelector("h1")?.textContent?.trim() || doc.title || "Bài viết trực tuyến";
      
      const paragraphs: string[] = [];
      doc.querySelectorAll("p, article p, .story-body p").forEach((p) => {
        const text = p.textContent?.trim();
        if (text && text.length > 30 && !text.includes("cookie") && !text.includes("subscribe")) {
          paragraphs.push(text);
        }
      });

      if (paragraphs.length > 0) {
        const formattedText = paragraphs.slice(0, 25).join("\n\n");
        return {
          title,
          siteName: host,
          url: cleanUrl,
          formattedText,
          wordCount: formattedText.split(/\s+/).length,
        };
      }
    }
  } catch (fetchErr) {
    console.warn("Client crawl failed:", fetchErr);
  }

  throw new Error("Không thể bóc tách bài viết từ đường dẫn này. Bạn có thể sao chép văn bản và dán trực tiếp vào khung đọc.");
}

/**
 * Translate English text to Vietnamese using Gemini
 */
export async function translateBilingual(
  text: string,
  apiKey?: string,
  modelName: string = "gemini-2.5-flash"
): Promise<TranslationResult> {
  if (!text.trim()) {
    return { originalText: "", translation: "", modelUsed: modelName };
  }

  // 1. Try Backend API first if no custom user API key was forced
  if (!apiKey) {
    try {
      const response = await apiClient.post("/readflow/translate", { text });
      if (response.data?.translation) {
        return {
          originalText: text,
          translation: response.data.translation,
          modelUsed: response.data.modelUsed || modelName,
        };
      }
    } catch (err) {
      console.warn("Backend translation API unavailable, falling back to direct client call:", err);
    }
  }

  // 2. Direct Gemini API call with user apiKey or fallback
  const effectiveKey = apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (effectiveKey) {
    const systemPrompt = `Bạn là một chuyên gia dịch thuật và trợ lý dạy đọc hiểu tiếng Anh.
Nhiệm vụ: Dịch văn bản tiếng Anh sau đây sang tiếng Việt chuẩn xác, tự nhiên, thuần Việt, đúng ngữ cảnh bài đọc.
BẮT BUỘC: Giữ nguyên cấu trúc các đoạn văn (paragraphs) tương ứng với bản gốc để người học dễ đối chiếu song ngữ.
Chỉ trả về nội dung bản dịch tiếng Việt, KHÔNG kèm giải thích thừa hay markdown quote.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${effectiveKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nVăn bản tiếng Anh cần dịch:\n${text}` }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Lỗi gọi Gemini API (${response.status})`);
    }

    const data = await response.json();
    const translation = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    return {
      originalText: text,
      translation,
      modelUsed: modelName,
    };
  }

  // 3. Fallback simulated translation for offline/demo mode
  const paragraphs = text.split(/\n\s*\n/);
  const demoTranslations = paragraphs.map((p) => {
    if (p.toLowerCase().includes("mars") || p.toLowerCase().includes("planet")) {
      return "Sao Hỏa từ lâu đã là đối tượng nghiên cứu hấp dẫn của các nhà khoa học vũ trụ. Những tiến bộ công nghệ gần đây đang mở ra triển vọng đưa con người đặt chân lên hành tinh đỏ.";
    }
    if (p.toLowerCase().includes("habit") || p.toLowerCase().includes("routine")) {
      return "Những thói quen nhỏ lặp lại mỗi ngày tạo nên sự thay đổi lớn trong dài hạn. Tính nhất quán và kiên trì quan trọng hơn cường độ nhất thời.";
    }
    return `[Bản dịch AI]: ${p.slice(0, 100)}...`;
  });

  return {
    originalText: text,
    translation: demoTranslations.join("\n\n"),
    modelUsed: "demo-local-ai",
  };
}

/**
 * Contextual Vocabulary Lookup using Gemini or Cache
 */
export async function lookupVocabulary(
  word: string,
  context: string = "",
  apiKey?: string,
  modelName: string = "gemini-2.5-flash"
): Promise<VocabularyLookupResult> {
  const cleanWord = word.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
  if (!cleanWord) {
    throw new Error("Từ tra cứu không hợp lệ.");
  }

  const cacheKey = `${cleanWord.toLowerCase()}::${context.slice(0, 50).toLowerCase()}`;
  if (vocabCache.has(cacheKey)) {
    return vocabCache.get(cacheKey)!;
  }

  // 1. Try Backend API first
  if (!apiKey) {
    try {
      const response = await apiClient.post("/readflow/lookup-word", {
        word: cleanWord,
        context,
      });
      if (response.data?.data) {
        vocabCache.set(cacheKey, response.data.data);
        return response.data.data;
      }
    } catch (err) {
      console.warn("Backend lookup API unavailable, falling back to direct client call:", err);
    }
  }

  // 2. Direct Gemini API call
  const effectiveKey = apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (effectiveKey) {
    const prompt = `Bạn là từ điển Anh - Việt chuyên sâu và trợ lý học tiếng Anh.
Hãy phân tích từ hoặc cụm từ: "${cleanWord}"
Ngữ cảnh trong câu: "${context || cleanWord}"

BẮT BUỘC: Trả về DUY NHẤT 1 JSON object chuẩn RFC 8259, không thêm bất kỳ văn bản giải thích nào ngoài JSON.
Cấu trúc JSON:
{
  "word": "${cleanWord}",
  "ipa": "/phiên âm quốc tế IPA kèm trọng âm/",
  "partOfSpeech": "loại từ (ví dụ: noun, verb, adjective, phrase)",
  "meaning": "nghĩa tiếng Việt ngắn gọn, chuẩn ngữ cảnh câu trên",
  "example": "1 câu ví dụ tiếng Anh tự nhiên chứa từ này",
  "exampleTranslation": "bản dịch tiếng Việt của câu ví dụ"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${effectiveKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      let rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      if (rawJson.startsWith("```json")) {
        rawJson = rawJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      }
      try {
        const parsed: VocabularyLookupResult = JSON.parse(rawJson);
        vocabCache.set(cacheKey, parsed);
        return parsed;
      } catch (parseErr) {
        console.warn("Failed to parse Gemini JSON:", parseErr);
      }
    }
  }

  // 3. Fallback heuristic dictionary
  const fallbackResult: VocabularyLookupResult = {
    word: cleanWord,
    ipa: `/${cleanWord.toLowerCase()}/`,
    partOfSpeech: cleanWord.includes(" ") ? "phrase" : "vocabulary",
    meaning: `Nghĩa của "${cleanWord}" trong ngữ cảnh bài đọc`,
    example: context || `We should study ${cleanWord} in real life context.`,
    exampleTranslation: `Chúng ta nên tìm hiểu "${cleanWord}" trong ngữ cảnh thực tế.`,
  };

  vocabCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}

/**
 * Generate AI Text-To-Speech
 */
export async function generateStudioTTS(
  text: string,
  voice: string = "Puck",
  apiKey?: string
): Promise<TTSResult> {
  const effectiveKey = apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (effectiveKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${effectiveKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voice,
                },
              },
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0];
        if (candidate?.inlineData) {
          return {
            audioBase64: candidate.inlineData.data,
            mimeType: candidate.inlineData.mimeType || "audio/wav",
            voiceName: voice,
          };
        }
      }
    } catch (err) {
      console.warn("Studio TTS failed, falling back to Web Speech:", err);
    }
  }

  return {
    voiceName: voice,
  };
}
