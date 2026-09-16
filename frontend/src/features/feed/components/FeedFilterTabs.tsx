import React from 'react';

export type FeedFilterType = 'ALL' | 'ARTICLE' | 'PODCAST' | 'VIDEO';

interface FeedFilterTabsProps {
  activeTab: FeedFilterType;
  onTabChange: (tab: FeedFilterType) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const FeedFilterTabs: React.FC<FeedFilterTabsProps> = ({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
}) => {
  const tabs: { id: FeedFilterType; label: string }[] = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'ARTICLE', label: 'Bài đọc' },
    { id: 'PODCAST', label: 'Podcast' },
    { id: 'VIDEO', label: 'Video' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-default)',
      marginBottom: '24px',
      paddingBottom: '2px',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      {/* Tab Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginRight: '12px',
        }}>
          Dành cho bạn
        </span>

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                padding: '8px 14px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  left: '14px',
                  right: '14px',
                  height: '3px',
                  background: 'var(--color-primary)',
                  borderRadius: 'var(--radius-full)',
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Sort Select */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
          }}
        >
          <option value="newest">Mới nhất ▾</option>
          <option value="popular">Phổ biến nhất ▾</option>
          <option value="duration">Thời lượng ngắn nhất ▾</option>
        </select>
      </div>
    </div>
  );
};
