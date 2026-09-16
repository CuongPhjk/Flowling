import React from 'react';
import { Search } from 'lucide-react';

interface FeedTopBarProps {
  userName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FeedTopBar: React.FC<FeedTopBarProps> = ({
  userName,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-input)',
        borderRadius: 'var(--radius-full)',
        padding: '10px 18px',
        maxWidth: '520px',
        marginBottom: '20px',
        border: '1px solid transparent',
        transition: 'all 0.2s ease',
      }}>
        <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px', flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm bài viết, podcast, video..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            width: '100%',
            fontSize: '0.92rem',
            color: 'var(--text-primary)',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0 4px' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Greeting & Daily Quote */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Chào mừng trở lại, {userName}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Mỗi chút mỗi ngày, bạn đang tiến bộ hơn.
          </p>
        </div>

        <div style={{
          maxWidth: '380px',
          textAlign: 'right',
          fontStyle: 'italic',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          lineHeight: 1.4,
        }}>
          "A better you is a collection of small efforts, repeated daily."
        </div>
      </div>
    </div>
  );
};
