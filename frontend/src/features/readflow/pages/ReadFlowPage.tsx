import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Type,
  Key,
  Languages,
  BookOpen,
  Share2,
  Check,
  RotateCcw,
} from "lucide-react";
import { useDemo } from "../../../app/providers";
import {
  crawlArticle,
  translateBilingual,
  lookupVocabulary,
  CrawlResult,
  VocabularyLookupResult,
} from "../../../shared/api/readflowApi";
import { UrlBar, SAMPLE_ARTICLES, SampleArticle } from "../components/UrlBar";
import { SourcePane } from "../components/SourcePane";
import { TargetPane } from "../components/TargetPane";
import { WordPopup } from "../components/WordPopup";
import { ApiKeyModal } from "../components/ApiKeyModal";

const STORAGE_KEY = "flowling_readflow_session_v1";

const DEFAULT_INITIAL_TEXT = `Changes that seem small and unimportant at first will compound into remarkable results if you are willing to stick with them for years. We all deal with setbacks, but in the long run, the quality of our lives often depends on the quality of our habits.

With the same habits, you’ll end up with the same results. But with better habits, anything is possible.

Success is the product of daily habits—not once-in-a-lifetime transformations. You should be far more concerned with your current trajectory than with your current results. If you want to predict where you’ll end up in life, all you have to do is follow the curve of tiny gains or tiny losses, and see how your daily choices will compound ten or twenty years down the line.

Time magnifies the margin between success and failure. It will multiply whatever you feed it. Good habits make time your ally. Bad habits make time your enemy.`;

export function ReadFlowPage() {
  const { notify } = useDemo();

  // Settings State
  const [fontSize, setFontSize] = useState<number>(17);
  const [isSerif, setIsSerif] = useState<boolean>(false);
  const [autoTranslate, setAutoTranslate] = useState<boolean>(true);
  const [isReaderMode, setIsReaderMode] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Content State
  const [url, setUrl] = useState<string>("");
  const [sourceText, setSourceText] = useState<string>(DEFAULT_INITIAL_TEXT);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [articleMeta, setArticleMeta] = useState<CrawlResult | null>(null);

  // Loading States
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Word Popup State
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const [popupWord, setPopupWord] = useState<string>("");
  const [popupContext, setPopupContext] = useState<string>("");
  const [popupData, setPopupData] = useState<VocabularyLookupResult | null>(null);
  const [popupLoading, setPopupLoading] = useState<boolean>(false);
  const [popupError, setPopupError] = useState<string | null>(null);

  // Load initial state from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sourceText) setSourceText(parsed.sourceText);
        if (parsed.translatedText) setTranslatedText(parsed.translatedText);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.isSerif !== undefined) setIsSerif(parsed.isSerif);
        if (parsed.autoTranslate !== undefined) setAutoTranslate(parsed.autoTranslate);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.selectedModel) setSelectedModel(parsed.selectedModel);
        if (parsed.articleMeta) setArticleMeta(parsed.articleMeta);
      }
    } catch (e) {
      console.warn("Could not parse saved readflow session", e);
    }
  }, []);

  // Save session changes to LocalStorage
  useEffect(() => {
    try {
      const payload = {
        sourceText,
        translatedText,
        fontSize,
        isSerif,
        autoTranslate,
        apiKey,
        selectedModel,
        articleMeta,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not save readflow session", e);
    }
  }, [
    sourceText,
    translatedText,
    fontSize,
    isSerif,
    autoTranslate,
    apiKey,
    selectedModel,
    articleMeta,
  ]);

  // Compute paragraph lists
  const sourceParagraphs = useMemo(() => {
    return sourceText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [sourceText]);

  const targetParagraphs = useMemo(() => {
    return translatedText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [translatedText]);

  // Handle translation
  const handleTranslate = async (textToTranslate?: string) => {
    const raw = textToTranslate !== undefined ? textToTranslate : sourceText;
    if (!raw.trim()) {
      notify("Vui lòng nhập hoặc dán nội dung tiếng Anh trước khi dịch.");
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateBilingual(raw, apiKey, selectedModel);
      setTranslatedText(result.translation);
      notify("Đã dịch xong bài đọc song ngữ ✨");
    } catch (err: any) {
      console.error("Translation error:", err);
      notify(err.message || "Không thể dịch bài viết. Vui lòng kiểm tra lại kết nối hoặc API Key.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle Crawling Article from URL
  const handleFetchArticle = async (customUrl?: string) => {
    const targetUrl = customUrl || url;
    if (!targetUrl.trim()) return;

    setIsCrawling(true);
    try {
      const crawlRes = await crawlArticle(targetUrl);
      setArticleMeta(crawlRes);
      setSourceText(crawlRes.formattedText);
      setIsReaderMode(true);
      notify(`Đã nạp bài viết thành công từ ${crawlRes.siteName || "trang web"}! 📖`);

      if (autoTranslate) {
        handleTranslate(crawlRes.formattedText);
      }
    } catch (err: any) {
      console.error("Crawl error:", err);
      notify(err.message || "Không thể bóc tách bài viết từ URL này.");
    } finally {
      setIsCrawling(false);
    }
  };

  // Handle Selecting a Sample Article
  const handleSelectSample = (sample: SampleArticle) => {
    setUrl(sample.url);
    setSourceText(sample.text);
    setArticleMeta({
      title: sample.title,
      siteName: new URL(sample.url).hostname.replace(/^www\./, ""),
      url: sample.url,
      formattedText: sample.text,
      wordCount: sample.text.split(/\s+/).length,
    });
    setIsReaderMode(true);
    notify(`Đã mở bài mẫu: ${sample.title}`);

    if (autoTranslate) {
      handleTranslate(sample.text);
    }
  };

  // Handle Contextual Vocabulary Lookup
  const handleLookupWord = async (
    word: string,
    context: string,
    position: { x: number; y: number }
  ) => {
    setPopupWord(word);
    setPopupContext(context);
    setPopupPos(position);
    setPopupOpen(true);
    setPopupLoading(true);
    setPopupError(null);
    setPopupData(null);

    try {
      const result = await lookupVocabulary(word, context, apiKey, selectedModel);
      setPopupData(result);
    } catch (err: any) {
      console.error("Lookup error:", err);
      setPopupError(err.message || "Không thể tra cứu từ vựng lúc này.");
    } finally {
      setPopupLoading(false);
    }
  };

  // Cycle Font Size
  const handleCycleFontSize = () => {
    setFontSize((prev) => {
      if (prev >= 23) return 15;
      return prev + 2;
    });
  };

  return (
    <div className="readflow-page-root">
      {/* Top Header Toolbar */}
      <div className="readflow-top-nav">
        <div className="nav-left-group">
          <Link to="/" className="btn back-btn" title="Quay lại Trang chủ">
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </Link>
          <div className="readflow-brand-title">
            <span className="brand-icon-chip">
              <Sparkles size={16} className="text-green" />
            </span>
            <div className="brand-title-text">
              <h1>ReadFlow</h1>
              <span className="brand-sub">Trợ lý đọc & luyện dịch song ngữ AI</span>
            </div>
          </div>
        </div>

        <div className="nav-right-actions">
          {/* Font Size Button */}
          <button
            type="button"
            className="btn font-size-btn"
            onClick={handleCycleFontSize}
            title="Đổi cỡ chữ"
            aria-label="Đổi cỡ chữ"
          >
            <Type size={14} />
            <span>{fontSize}px</span>
          </button>

          {/* Serif Toggle */}
          <button
            type="button"
            className={`btn serif-toggle-btn ${isSerif ? "active" : ""}`}
            onClick={() => setIsSerif((prev) => !prev)}
            title="Chuyển đổi kiểu chữ Sách / Tiêu chuẩn"
            aria-label="Chuyển đổi kiểu chữ Sách / Tiêu chuẩn"
          >
            {isSerif ? "Serif" : "Sans"}
          </button>

          {/* API Key Settings */}
          <button
            type="button"
            className={`btn api-key-trigger-btn ${apiKey ? "has-key" : ""}`}
            onClick={() => setIsApiKeyModalOpen(true)}
            title="Cài đặt Google Gemini API Key"
            aria-label={apiKey ? "Gemini Key đã lưu" : "Cài đặt Google Gemini API Key"}
          >
            <Key size={14} className={apiKey ? "text-green" : ""} />
            <span>{apiKey ? "Gemini Key ✓" : "Cài đặt AI Key"}</span>
          </button>

          {/* Main Translate CTA Button */}
          <button
            type="button"
            className="btn primary main-translate-cta"
            onClick={() => handleTranslate()}
            disabled={isTranslating || !sourceText.trim()}
            aria-label="Dịch song ngữ"
          >
            <Languages size={15} />
            <span>{isTranslating ? "Đang dịch..." : "Dịch song ngữ"}</span>
          </button>
        </div>
      </div>

      {/* URL Scraper Bar */}
      <UrlBar
        url={url}
        setUrl={setUrl}
        isLoading={isCrawling}
        onFetchArticle={handleFetchArticle}
        autoTranslate={autoTranslate}
        setAutoTranslate={setAutoTranslate}
        articleMeta={articleMeta}
        onSelectSample={handleSelectSample}
      />

      {/* Split Pane View */}
      <div className="readflow-split-layout">
        <SourcePane
          text={sourceText}
          onChangeText={setSourceText}
          isReaderMode={isReaderMode}
          setIsReaderMode={setIsReaderMode}
          fontSize={fontSize}
          isSerif={isSerif}
          onLookupWord={handleLookupWord}
          apiKey={apiKey}
          paragraphs={sourceParagraphs}
        />

        <TargetPane
          translationText={translatedText}
          isTranslating={isTranslating}
          onTranslate={() => handleTranslate()}
          fontSize={fontSize}
          isSerif={isSerif}
          paragraphs={targetParagraphs}
          sourceParagraphsCount={sourceParagraphs.length}
        />
      </div>

      {/* Floating Word Lookup Popup */}
      <WordPopup
        isOpen={popupOpen}
        position={popupPos}
        word={popupWord}
        contextSentence={popupContext}
        data={popupData}
        isLoading={popupLoading}
        error={popupError}
        onClose={() => setPopupOpen(false)}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={setApiKey}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />
    </div>
  );
}
