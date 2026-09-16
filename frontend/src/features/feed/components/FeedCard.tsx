import React, { useState } from 'react';
import { Heart, Bookmark, MoreHorizontal, Headphones, Video, BookOpen } from 'lucide-react';
import { FeedItem } from '../../../shared/mock/mockFeedData';

interface FeedCardProps {
  item: FeedItem;
  onCardClick?: (item: FeedItem) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({ item, onCardClick }) => {
  const [isLiked, setIsLiked] = useState(item.isLiked || false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [isBookmarked, setIsBookmarked] = useState(item.isBookmarked || false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  // Pastel tag styling based on category
  const getCategoryStyles = (slug: string) => {
    switch (slug) {
      case 'science':
        return { bg: 'var(--cat-science-bg)', text: 'var(--cat-science-text)' };
      case 'psychology':
        return { bg: 'var(--cat-psychology-bg)', text: 'var(--cat-psychology-text)' };
      case 'environment':
        return { bg: 'var(--cat-environment-bg)', text: 'var(--cat-environment-text)' };
      case 'tech':
        return { bg: 'var(--cat-tech-bg)', text: 'var(--cat-tech-text)' };
      case 'culture':
        return { bg: 'var(--cat-culture-bg)', text: 'var(--cat-culture-text)' };
      case 'economy':
        return { bg: 'var(--cat-economy-bg)', text: 'var(--cat-economy-text)' };
      case 'health':
        return { bg: 'var(--cat-health-bg)', text: 'var(--cat-health-text)' };
      default:
        return { bg: 'var(--color-green-50)', text: 'var(--color-green-800)' };
    }
  };

  const catStyle = getCategoryStyles(item.categorySlug);

  return (
    <div
      onClick={() => onCardClick?.(item)}
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* 16:10 Thumbnail */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 10',
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
      }}>
        <img
          src={item.thumbnail}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          loading="lazy"
        />

        {/* Format Badge (Top Left) */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          background: item.type === 'ARTICLE' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.82)',
          color: item.type === 'ARTICLE' ? '#0F172A' : '#FFFFFF',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 700,
          backdropFilter: 'blur(6px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        }}>
          {item.type === 'ARTICLE' && <BookOpen size={13} color="var(--color-green-600)" />}
          {item.type === 'PODCAST' && <Headphones size={13} color="#38BDF8" />}
          {item.type === 'VIDEO' && <Video size={13} color="#F87171" />}
          <span>{item.type === 'ARTICLE' ? 'Bài đọc' : item.type === 'PODCAST' ? 'Podcast' : 'Video'}</span>
        </div>

        {/* Duration Badge (Top Right) */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '4px 8px',
          background: 'rgba(15, 23, 42, 0.72)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 600,
          backdropFilter: 'blur(6px)',
        }}>
          {item.duration}
        </div>
      </div>

      {/* Content Body */}
      <div style={{
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
      }}>
        <div>
          {/* Title */}
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.title}
          </h3>

          {/* Teaser */}
          <p style={{
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.teaser}
          </p>
        </div>

        <div>
          {/* Pastel Tags */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '14px',
          }}>
            <span style={{
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.74rem',
              fontWeight: 600,
              backgroundColor: catStyle.bg,
              color: catStyle.text,
            }}>
              {item.category}
            </span>

            {item.tags.slice(1, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Card Footer Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
          }}>
            {/* Likes */}
            <button
              onClick={handleLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: isLiked ? '#EF4444' : 'var(--text-muted)',
                fontWeight: isLiked ? 700 : 500,
                transition: 'color 0.15s ease',
              }}
            >
              <Heart
                size={16}
                fill={isLiked ? '#EF4444' : 'none'}
                color={isLiked ? '#EF4444' : 'currentColor'}
              />
              <span>{likesCount.toLocaleString()}</span>
            </button>

            {/* Bookmark & Options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleBookmark}
                title="Lưu vào danh sách"
                style={{
                  color: isBookmarked ? 'var(--color-primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s ease',
                }}
              >
                <Bookmark
                  size={16}
                  fill={isBookmarked ? 'var(--color-primary)' : 'none'}
                  color={isBookmarked ? 'var(--color-primary)' : 'currentColor'}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Tùy chọn cho bài viết: "${item.title}"`);
                }}
                style={{
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
