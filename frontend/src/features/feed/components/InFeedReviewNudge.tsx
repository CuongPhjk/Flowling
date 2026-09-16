import React, { useState } from 'react';
import { Clock, Brain, ArrowRight } from 'lucide-react';

interface InFeedReviewNudgeProps {
  dueCount: number;
  minutesScrolled?: number;
  onStartReview: () => void;
}

export const InFeedReviewNudge: React.FC<InFeedReviewNudgeProps> = ({
  dueCount,
  minutesScrolled = 12,
  onStartReview,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div style={{
      gridColumn: '1 / -1',
      background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
      border: '1px solid #DDD6FE',
      borderRadius: 'var(--radius-xl)',
      padding: '20px 24px',
      margin: '12px 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: 'var(--radius-full)',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-review-btn)',
          boxShadow: '0 2px 8px rgba(88, 66, 189, 0.15)',
          flexShrink: 0,
        }}>
          <Brain size={24} />
        </div>

        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            color: '#6B21A8',
            fontWeight: 600,
            marginBottom: '2px',
          }}>
            <Clock size={14} />
            <span>Bạn đã lướt được {minutesScrolled} phút</span>
          </div>

          <h4 style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#4C1D95',
            lineHeight: 1.25,
          }}>
            {dueCount} từ vựng đã sẵn sàng để ôn tập
          </h4>

          <p style={{ fontSize: '0.82rem', color: '#6D28D9' }}>
            Chỉ mất 2 phút củng cố trí nhớ dài hạn trước khi tiếp tục lướt bài mới.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => setDismissed(true)}
          style={{
            fontSize: '0.84rem',
            color: '#7C3AED',
            fontWeight: 600,
            padding: '8px 12px',
          }}
        >
          Để sau
        </button>

        <button
          onClick={onStartReview}
          className="interactive-scale"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--color-review-btn)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.88rem',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 4px 12px rgba(88, 66, 189, 0.25)',
          }}
        >
          <span>Ôn tập 2 phút</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
