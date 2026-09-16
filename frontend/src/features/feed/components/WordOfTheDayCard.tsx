import React from 'react';
import { Volume2, ArrowRight } from 'lucide-react';
import { WordOfTheDay } from '../../../shared/mock/mockFeedData';

interface WordOfTheDayCardProps {
  data: WordOfTheDay;
  onViewDetails?: () => void;
}

export const WordOfTheDayCard: React.FC<WordOfTheDayCardProps> = ({ data, onViewDetails }) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(data.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)',
      marginBottom: '18px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)',
        }}>
          TỪ VỰNG HÔM NAY
        </span>

        <button
          onClick={handleSpeak}
          title="Nghe phát âm chuẩn"
          className="interactive-scale"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            background: 'var(--color-green-50)',
            color: 'var(--color-green-700)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          <Volume2 size={14} />
          <span>Nghe</span>
        </button>
      </div>

      {/* Headword & IPA */}
      <div style={{ marginBottom: '6px' }}>
        <h3 style={{
          fontSize: '1.35rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          display: 'inline-block',
          marginRight: '8px',
        }}>
          {data.word}
        </h3>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {data.ipa} · <em>{data.pos}</em>
        </span>
      </div>

      {/* Vietnamese Meaning */}
      <p style={{
        fontSize: '0.95rem',
        fontWeight: 700,
        color: 'var(--color-primary)',
        marginBottom: '10px',
      }}>
        {data.vietnameseMeaning}
      </p>

      {/* Example Sentence */}
      <div style={{
        background: 'var(--bg-app)',
        padding: '10px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.84rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.4,
        marginBottom: '12px',
        borderLeft: '3px solid var(--color-primary)',
      }}>
        "{data.exampleSentence}"
      </div>

      <button
        onClick={onViewDetails}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
        }}
      >
        <span>Xem chi tiết từ vựng</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};
