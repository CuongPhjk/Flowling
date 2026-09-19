import React, { useRef, useState } from "react";
import {
  Edit3,
  BookOpen,
  Volume2,
  VolumeX,
  Clipboard,
  Trash2,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { generateStudioTTS } from "../../../shared/api/readflowApi";

const TTS_VOICES = [
  { id: "Puck", label: "Puck (Nam - Sinh động, Tự nhiên)" },
  { id: "Charon", label: "Charon (Nam - Trầm ấm, Điềm tĩnh)" },
  { id: "Kore", label: "Kore (Nữ - Dịu dàng, Thư giãn)" },
  { id: "Fenrir", label: "Fenrir (Nam - Mạnh mẽ, Dứt khoát)" },
  { id: "Aoede", label: "Aoede (Nữ - Trong trẻo, Du dương)" },
];

interface SourcePaneProps {
  text: string;
  onChangeText: (newText: string) => void;
  isReaderMode: boolean;
  setIsReaderMode: (mode: boolean) => void;
  fontSize: number;
  isSerif: boolean;
  onLookupWord: (word: string, context: string, position: { x: number; y: number }) => void;
  apiKey?: string;
  paragraphs: string[];
}

export function SourcePane({
  text,
  onChangeText,
  isReaderMode,
  setIsReaderMode,
  fontSize,
  isSerif,
  onLookupWord,
  apiKey,
  paragraphs,
}: SourcePaneProps) {
  const [selectedVoice, setSelectedVoice] = useState("Puck");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Handle text selection in Reader Mode
  const handleMouseUp = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (!selectedText) return;

    const cleanWord = selectedText.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
    if (cleanWord.length > 0 && cleanWord.length < 100) {
      // Find sentence context
      const anchorNode = selection?.anchorNode;
      const fullSentence = anchorNode?.textContent || selectedText;
      onLookupWord(cleanWord, fullSentence, { x: e.clientX, y: e.clientY });
    }
  };

  // Handle clicking a specific word
  const handleWordClick = (
    e: React.MouseEvent,
    wordToken: string,
    paragraphText: string
  ) => {
    e.stopPropagation();
    const cleanWord = wordToken.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
    if (cleanWord) {
      onLookupWord(cleanWord, paragraphText, { x: e.clientX, y: e.clientY });
    }
  };

  // Handle Audio Narration (Gemini Studio TTS or Web Speech API)
  const handleTogglePlayAudio = async () => {
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    if (!text.trim()) return;

    setIsLoadingAudio(true);
    try {
      // Try Gemini Studio TTS
      const result = await generateStudioTTS(text.slice(0, 2000), selectedVoice, apiKey);
      if (result.audioBase64) {
        const audioSrc = `data:${result.mimeType || "audio/wav"};base64,${result.audioBase64}`;
        if (audioRef.current) {
          audioRef.current.src = audioSrc;
          audioRef.current.play();
          setIsPlayingAudio(true);
          setIsLoadingAudio(false);
          return;
        }
      }
    } catch (err) {
      console.warn("TTS studio fetch failed, falling back to Web Speech:", err);
    }

    // Web Speech API fallback
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setIsLoadingAudio(false);
      };
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsLoadingAudio(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        onChangeText(clipText);
      }
    } catch (err) {
      console.warn("Could not read clipboard", err);
    }
  };

  const handleClear = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ văn bản đang đọc?")) {
      onChangeText("");
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="readflow-pane readflow-source-pane">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => setIsPlayingAudio(false)}
      />

      <div className="pane-header">
        <div className="pane-title-group">
          <span className="pane-badge en-badge">English (Gốc)</span>
          <span className="pane-stats">
            {wordCount} từ · {charCount} ký tự
          </span>
        </div>

        <div className="pane-actions-group">
          <div className="mode-toggle-pill">
            <button
              type="button"
              className={`mode-btn ${!isReaderMode ? "active" : ""}`}
              onClick={() => setIsReaderMode(false)}
              title="Chế độ chỉnh sửa / dán văn bản"
            >
              <Edit3 size={14} /> Chỉnh sửa
            </button>
            <button
              type="button"
              className={`mode-btn ${isReaderMode ? "active" : ""}`}
              onClick={() => setIsReaderMode(true)}
              title="Chế độ đọc & tra cứu từ vựng"
            >
              <BookOpen size={14} /> Đọc hiểu
            </button>
          </div>

          <button
            type="button"
            className="pane-icon-action"
            onClick={handlePasteClipboard}
            title="Dán từ Clipboard"
          >
            <Clipboard size={15} />
          </button>
          <button
            type="button"
            className="pane-icon-action"
            onClick={handleClear}
            title="Xóa trắng"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Audio Narration Bar */}
      <div className="source-narration-bar">
        <div className="voice-select-wrap">
          <Volume2 size={15} className="text-green" />
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="voice-select"
            disabled={isPlayingAudio || isLoadingAudio}
          >
            {TTS_VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`btn narration-play-btn ${isPlayingAudio ? "playing" : ""}`}
          onClick={handleTogglePlayAudio}
          disabled={isLoadingAudio || !text.trim()}
        >
          {isPlayingAudio ? (
            <>
              <Pause size={15} /> Tạm dừng đọc
            </>
          ) : (
            <>
              <Play size={15} /> Đọc bài văn (AI Voice)
            </>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div
        className={`pane-body-container ${isSerif ? "font-serif" : "font-sans"}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {!isReaderMode ? (
          <textarea
            className="source-textarea"
            placeholder="Dán hoặc gõ đoạn văn tiếng Anh vào đây để bắt đầu đọc..."
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
          />
        ) : (
          <div
            ref={readerContainerRef}
            className="source-reader-view"
            onMouseUp={handleMouseUp}
          >
            {paragraphs.length > 0 ? (
              paragraphs.map((p, pIndex) => (
                <p key={pIndex} className="reader-paragraph">
                  {p.split(/([\p{L}\p{N}]+(?:['’-][\p{L}]+)*)/u).map((token, tIndex) => {
                    const isWord = /^[\p{L}\p{N}]/u.test(token);
                    if (!isWord) return <span key={tIndex}>{token}</span>;
                    return (
                      <span
                        key={tIndex}
                        className="interactive-word-token"
                        onClick={(e) => handleWordClick(e, token, p)}
                        role="button"
                        tabIndex={0}
                      >
                        {token}
                      </span>
                    );
                  })}
                </p>
              ))
            ) : (
              <div className="empty-reader-hint">
                <BookOpen size={32} className="text-muted" />
                <p>Chưa có nội dung bài đọc.</p>
                <small>Dán link bài báo ở thanh trên hoặc chuyển sang chế độ Chỉnh sửa để dán văn bản.</small>
              </div>
            )}
          </div>
        )}
      </div>

      {isReaderMode && paragraphs.length > 0 && (
        <div className="reader-hint-footer">
          <Sparkles size={13} className="text-green" />
          <span>Mẹo: Nhấp vào từ hoặc bôi đen một cụm từ để tra cứu nghĩa theo ngữ cảnh.</span>
        </div>
      )}
    </div>
  );
}
