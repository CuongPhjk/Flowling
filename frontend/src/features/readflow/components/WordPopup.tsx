import { useEffect, useRef, useState } from "react";
import { Volume2, X, BookmarkPlus, Check, Loader2, Sparkles } from "lucide-react";
import { VocabularyLookupResult } from "../../../shared/api/readflowApi";
import { useDemo, uid } from "../../../app/providers";

interface WordPopupProps {
  isOpen: boolean;
  position: { x: number; y: number } | null;
  word: string;
  contextSentence?: string;
  data: VocabularyLookupResult | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

export function WordPopup({
  isOpen,
  position,
  word,
  contextSentence = "",
  data,
  isLoading,
  error,
  onClose,
}: WordPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { data: demoData, state, saveWord, notify } = useDemo();

  const currentWord = data?.word || word;
  
  // Check if this word is already in the user's vocabulary list
  const existingWord = state.vocabulary.find(
    (v) => v.word.toLowerCase() === currentWord.toLowerCase()
  );
  const isAlreadySaved = existingWord
    ? demoData.words.some((w) => w.vocabularyId === existingWord.id)
    : false;

  useEffect(() => {
    setIsSaved(isAlreadySaved);
  }, [isAlreadySaved, currentWord]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  const handlePlayAudio = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveToVocabulary = () => {
    if (!currentWord.trim()) return;

    const vocabEntry = existingWord || {
      id: uid(),
      word: currentWord,
      meaning: data?.meaning || "Tra cứu từ ReadFlow",
      ipa: data?.ipa || "",
      pos: data?.partOfSpeech || (currentWord.includes(" ") ? "phrase" : "word"),
    };

    saveWord(vocabEntry, {
      contentId: "readflow-custom",
      sentence: contextSentence || data?.example || currentWord,
      translation: data?.exampleTranslation || data?.meaning || "",
      note: "Được lưu từ Trợ lý đọc song ngữ ReadFlow",
    });

    setIsSaved(true);
    notify(`Đã lưu "${currentWord}" vào Sổ từ & hệ thống ôn tập SRS 🌱`);
  };

  // Safe viewport positioning
  const popupWidth = 340;
  const popupHeight = 240;
  const padding = 16;
  
  let left = Math.min(
    window.innerWidth - popupWidth - padding,
    Math.max(padding, position.x - popupWidth / 2)
  );
  
  // Position above if there is enough space, else below
  let top = position.y - popupHeight - 14;
  if (top < 70) {
    top = position.y + 24;
  }

  return (
    <div
      ref={popupRef}
      className="readflow-vocab-popup"
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="popup-header">
        <div className="popup-word-info">
          <span className="popup-word-title">{currentWord}</span>
          <button
            className={`popup-audio-btn ${isPlayingAudio ? "playing" : ""}`}
            onClick={handlePlayAudio}
            title="Nghe phát âm chuẩn bản xứ"
            aria-label="Phát âm từ vựng"
          >
            <Volume2 size={16} />
          </button>
        </div>
        <button className="popup-close-icon" onClick={onClose} aria-label="Đóng popup">
          <X size={16} />
        </button>
      </div>

      <div className="popup-content">
        {isLoading ? (
          <div className="popup-loading-state">
            <Loader2 size={20} className="spin text-green" />
            <span>AI đang phân tích từ vựng theo ngữ cảnh...</span>
          </div>
        ) : error ? (
          <div className="popup-error-state">
            <span>{error}</span>
          </div>
        ) : data ? (
          <>
            <div className="popup-meta-line">
              {data.ipa && <span className="popup-ipa-text">{data.ipa}</span>}
              {data.partOfSpeech && (
                <span className="popup-pos-pill">{data.partOfSpeech}</span>
              )}
            </div>

            <div className="popup-meaning-section">
              <span className="meaning-label">Nghĩa:</span>
              <span className="meaning-text">{data.meaning}</span>
            </div>

            {data.example && (
              <div className="popup-example-card">
                <p className="example-en">"{data.example}"</p>
                {data.exampleTranslation && (
                  <p className="example-vi">{data.exampleTranslation}</p>
                )}
              </div>
            )}

            <div className="popup-footer-action">
              <button
                className={`btn-save-vocab ${isSaved ? "saved" : ""}`}
                onClick={handleSaveToVocabulary}
              >
                {isSaved ? (
                  <>
                    <Check size={15} /> Đã có trong sổ từ
                  </>
                ) : (
                  <>
                    <BookmarkPlus size={15} /> + Lưu vào sổ từ & SRS
                  </>
                )}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
