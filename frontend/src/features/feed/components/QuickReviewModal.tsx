import React, { useState } from 'react';
import { X, Volume2, CheckCircle2, RotateCcw } from 'lucide-react';
import { ReviewWord } from '../../../shared/mock/mockFeedData';

interface QuickReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: ReviewWord[];
}

export const QuickReviewModal: React.FC<QuickReviewModalProps> = ({
  isOpen,
  onClose,
  words,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentWord = words[currentIndex];

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGrade = (_grade: 'again' | 'hard' | 'good' | 'easy') => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  return (
    <div
      className="animate-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '520px',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 22px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Ôn tập nhanh (SRS 3-5 phút)
            </h3>
            {!isFinished && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Thẻ {currentIndex + 1} trên {words.length}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px 26px' }}>
          {isFinished ? (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <CheckCircle2 size={54} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                Tuyệt vời! Hoàn thành ôn tập 🎉
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
                Bạn vừa củng cố <strong>{words.length} từ vựng</strong> vào trí nhớ dài hạn. Nhận được <strong>+15 XP</strong>!
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={handleRestart}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                  }}
                >
                  <RotateCcw size={15} />
                  Ôn lại lần nữa
                </button>

                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 22px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  Tiếp tục lướt Feed
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Flashcard Body */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  minHeight: '220px',
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentWord.word);
                  }}
                  title="Nghe phát âm"
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    padding: '8px',
                    borderRadius: 'var(--radius-full)',
                    background: '#FFFFFF',
                    color: 'var(--color-primary)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  }}
                >
                  <Volume2 size={18} />
                </button>

                <span style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}>
                  {currentWord.word}
                </span>

                <span style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-muted)',
                  marginBottom: '16px',
                }}>
                  {currentWord.ipa} · <em>{currentWord.pos}</em>
                </span>

                {isFlipped ? (
                  <div className="animate-fade-in" style={{ width: '100%' }}>
                    <div style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: '12px',
                    }}>
                      {currentWord.meaning}
                    </div>

                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic',
                      lineHeight: 1.4,
                      background: 'var(--bg-surface)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}>
                      "{currentWord.contextSentence}"
                    </p>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    (Bấm vào thẻ để xem nghĩa và ngữ cảnh)
                  </span>
                )}
              </div>

              {/* SM-2 4 Grade Buttons */}
              <div style={{ marginTop: '20px' }}>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  marginBottom: '8px',
                }}>
                  Đánh giá mức độ ghi nhớ của bạn:
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                }}>
                  <button
                    onClick={() => handleGrade('again')}
                    className="interactive-scale"
                    style={{
                      padding: '10px 6px',
                      borderRadius: 'var(--radius-md)',
                      background: '#FEE2E2',
                      color: '#991B1B',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textAlign: 'center',
                    }}
                  >
                    Chưa nhớ
                  </button>

                  <button
                    onClick={() => handleGrade('hard')}
                    className="interactive-scale"
                    style={{
                      padding: '10px 6px',
                      borderRadius: 'var(--radius-md)',
                      background: '#FFEDD5',
                      color: '#9A3412',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textAlign: 'center',
                    }}
                  >
                    Khó
                  </button>

                  <button
                    onClick={() => handleGrade('good')}
                    className="interactive-scale"
                    style={{
                      padding: '10px 6px',
                      borderRadius: 'var(--radius-md)',
                      background: '#DCFCE7',
                      color: '#166534',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textAlign: 'center',
                    }}
                  >
                    Nhớ được
                  </button>

                  <button
                    onClick={() => handleGrade('easy')}
                    className="interactive-scale"
                    style={{
                      padding: '10px 6px',
                      borderRadius: 'var(--radius-md)',
                      background: '#E0F2FE',
                      color: '#075985',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textAlign: 'center',
                    }}
                  >
                    Rất dễ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
