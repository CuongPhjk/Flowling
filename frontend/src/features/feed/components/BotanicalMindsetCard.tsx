import React from 'react';
import { Sprout } from 'lucide-react';

export const BotanicalMindsetCard: React.FC = () => {
  return (
    <div style={{
      background: 'var(--color-green-50)',
      border: '1px solid var(--color-green-100)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      marginBottom: '18px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-green-600)',
        flexShrink: 0,
        marginTop: '2px',
      }}>
        <Sprout size={18} />
      </div>

      <div>
        <p style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--color-green-900)',
          lineHeight: 1.35,
          marginBottom: '2px',
        }}>
          "Learn from the world around you."
        </p>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-green-800)', opacity: 0.85 }}>
          Khám phá tiếng Anh tự nhiên qua góc nhìn cuộc sống.
        </span>
      </div>
    </div>
  );
};
