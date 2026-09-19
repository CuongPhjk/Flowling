import React, { useState } from "react";
import {
  Sparkles,
  Volume2,
  Copy,
  Check,
  RotateCw,
  Loader2,
  Languages,
} from "lucide-react";

interface TargetPaneProps {
  translationText: string;
  isTranslating: boolean;
  onTranslate: () => void;
  fontSize: number;
  isSerif: boolean;
  paragraphs: string[];
  sourceParagraphsCount: number;
}

export function TargetPane({
  translationText,
  isTranslating,
  onTranslate,
  fontSize,
  isSerif,
  paragraphs,
  sourceParagraphsCount,
}: TargetPaneProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isPlayingViAudio, setIsPlayingViAudio] = useState(false);

  const handleCopyAll = async () => {
    if (!translationText.trim()) return;
    try {
      await navigator.clipboard.writeText(translationText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch (err) {
      console.warn("Failed to copy", err);
    }
  };

  const handleCopyParagraph = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.warn("Failed to copy paragraph", err);
    }
  };

  const handleSpeakVietnamese = () => {
    if (!("speechSynthesis" in window) || !translationText.trim()) return;
    
    if (isPlayingViAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingViAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(translationText);
    utterance.lang = "vi-VN";
    utterance.rate = 0.95;
    utterance.onstart = () => setIsPlayingViAudio(true);
    utterance.onend = () => setIsPlayingViAudio(false);
    utterance.onerror = () => setIsPlayingViAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="readflow-pane readflow-target-pane">
      <div className="pane-header">
        <div className="pane-title-group">
          <span className="pane-badge vi-badge">Tiếng Việt (Bản dịch AI)</span>
          <span className="pane-stats">
            {paragraphs.length} đoạn song song
          </span>
        </div>

        <div className="pane-actions-group">
          <button
            type="button"
            className="pane-icon-action"
            onClick={handleSpeakVietnamese}
            title={isPlayingViAudio ? "Dừng đọc tiếng Việt" : "Nghe bản dịch tiếng Việt"}
            disabled={!translationText.trim() || isTranslating}
          >
            <Volume2 size={15} className={isPlayingViAudio ? "text-green spin-pulse" : ""} />
          </button>
          <button
            type="button"
            className="pane-icon-action"
            onClick={handleCopyAll}
            title="Sao chép toàn bộ bản dịch"
            disabled={!translationText.trim() || isTranslating}
          >
            {copiedAll ? <Check size={15} className="text-green" /> : <Copy size={15} />}
          </button>
          <button
            type="button"
            className="pane-icon-action"
            onClick={onTranslate}
            title="Dịch lại văn bản"
            disabled={isTranslating}
          >
            <RotateCw size={15} className={isTranslating ? "spin" : ""} />
          </button>
        </div>
      </div>

      {/* Target Body Area */}
      <div
        className={`pane-body-container ${isSerif ? "font-serif" : "font-sans"}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {isTranslating ? (
          <div className="translation-shimmer-list">
            <div className="shimmer-loading-header">
              <Loader2 size={18} className="spin text-green" />
              <span>Gemini AI đang dịch song ngữ theo từng đoạn...</span>
            </div>
            {Array.from({ length: Math.max(3, sourceParagraphsCount || 3) }).map((_, i) => (
              <div key={i} className="shimmer-paragraph-card">
                <div className="shimmer-line line-full" />
                <div className="shimmer-line line-90" />
                <div className="shimmer-line line-75" />
              </div>
            ))}
          </div>
        ) : paragraphs.length > 0 ? (
          <div className="target-paragraphs-list">
            {paragraphs.map((p, index) => (
              <div key={index} className="target-paragraph-item">
                <div className="paragraph-content-box">
                  <p className="target-paragraph-text">{p}</p>
                  <button
                    type="button"
                    className="btn-copy-mini"
                    onClick={() => handleCopyParagraph(p, index)}
                    title="Sao chép đoạn này"
                  >
                    {copiedIndex === index ? (
                      <Check size={12} className="text-green" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-target-state">
            <div className="empty-target-icon">
              <Languages size={32} className="text-green" />
            </div>
            <h3>Chưa có bản dịch tiếng Việt</h3>
            <p>
              Nhấn nút <strong>"Dịch bài đọc"</strong> bên dưới hoặc bật tùy chọn <strong>"Tự động dịch"</strong> để AI dịch bài song song.
            </p>
            <button
              type="button"
              className="btn primary btn-trigger-translate"
              onClick={onTranslate}
              disabled={isTranslating || sourceParagraphsCount === 0}
            >
              <Sparkles size={16} /> Dịch bài đọc ngay
            </button>
          </div>
        )}
      </div>

      <div className="target-footer-row">
        <span className="powered-by-gemini">
          <Sparkles size={12} className="text-green" /> Cung cấp bởi Google Gemini AI
        </span>
      </div>
    </div>
  );
}
