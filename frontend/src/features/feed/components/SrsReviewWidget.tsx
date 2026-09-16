import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';

interface SrsReviewWidgetProps {
  dueCount: number;
  onStartReview: () => void;
}

export const SrsReviewWidget: React.FC<SrsReviewWidgetProps> = ({ dueCount, onStartReview }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
      border: '1px solid #DDD6FE',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-full)',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-review-btn)',
          boxShadow: '0 2px 8px rgba(88, 66, 189, 0.15)',
        }}>
          <Brain size={20} />
        </div>

        <div>
          <h4 style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#4C1D95',
            lineHeight: 1.2,
          }}>
            {dueCount} từ chờ ôn tập
          </h4>
          <span style={{ fontSize: '0.78rem', color: '#6D28D9' }}>
            Phương pháp lặp lại ngắt quãng (SRS)
          </span>
        </div>
      </div>

      <p style={{
        fontSize: '0.84rem',
        color: '#5B21B6',
        lineHeight: 1.4,
        marginBottom: '16px',
      }}>
        Chỉ mất 3-5 phút ôn tập để ngăn chặn đường cong quên lãng của não bộ.
      </p>

      <button
        onClick={onStartReview}
        className="interactive-scale"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '11px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-review-btn)',
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: '0.88rem',
          boxShadow: '0 4px 12px rgba(88, 66, 189, 0.25)',
          transition: 'all 0.2s ease',
        }}
      >
        <span>Bắt đầu ôn tập</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
