import React from 'react';
import { Flame, Check } from 'lucide-react';

interface StreakCardProps {
  daysCount: number;
  weekDays: { day: string; completed: boolean }[];
}

export const StreakCard: React.FC<StreakCardProps> = ({ daysCount, weekDays }) => {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)',
      marginBottom: '18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            background: '#FFF7ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-streak)',
          }}>
            <Flame size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              🔥 {daysCount} ngày
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Chuỗi thói quen liên tục
            </span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
        Bạn đang duy trì rất tốt! Giữ nhịp độ mỗi ngày nhé.
      </p>

      {/* Week Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '6px',
        textAlign: 'center',
      }}>
        {weekDays.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-full)',
              background: item.completed ? 'var(--color-streak)' : 'var(--bg-input)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              {item.completed ? <Check size={14} strokeWidth={3} /> : ''}
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: item.completed ? 'var(--color-streak)' : 'var(--text-muted)',
            }}>
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
