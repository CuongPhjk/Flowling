import React from 'react';
import { Play } from 'lucide-react';
import { InProgressContent } from '../../../shared/mock/mockFeedData';

interface HeroContinueCardProps {
  content: InProgressContent;
  onContinue: (id: string) => void;
}

export const HeroContinueCard: React.FC<HeroContinueCardProps> = ({ content, onContinue }) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 28px',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-card)',
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.65) 55%, rgba(15, 23, 42, 0.4) 100%), url(${content.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {/* Top Tag */}
        <div>
          <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}>
            TIẾP TỤC
          </span>

          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '4px',
            lineHeight: 1.25,
          }}>
            {content.title}
          </h2>

          <p style={{
            fontSize: '0.88rem',
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '16px',
          }}>
            {content.durationMeta}
          </p>
        </div>

        {/* Bottom Bar: Progress & Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {/* Progress Indicator */}
          <div style={{ flex: '1 1 240px', maxWidth: '380px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '6px',
              fontWeight: 600,
            }}>
              <span>Tiến trình</span>
              <span>Đã nghe {content.progressPercent}%</span>
            </div>

            <div style={{
              height: '6px',
              background: 'rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${content.progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4ADE80, #22C55E)',
                borderRadius: 'var(--radius-full)',
              }} />
            </div>
          </div>

          {/* Action Button & Inscription */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => onContinue(content.id)}
              className="interactive-scale"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                background: '#FFFFFF',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              <Play size={16} fill="var(--text-primary)" color="var(--text-primary)" />
              Tiếp tục nghe
            </button>

            <span className="desktop-quote" style={{
              fontStyle: 'italic',
              fontSize: '0.82rem',
              color: 'rgba(255, 255, 255, 0.75)',
            }}>
              "{content.quote}"
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
