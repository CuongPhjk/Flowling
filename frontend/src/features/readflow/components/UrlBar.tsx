import React, { useState } from "react";
import {
  Globe,
  ArrowRight,
  Loader2,
  Sparkles,
  BookOpen,
  FileText,
  Clock,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { CrawlResult } from "../../../shared/api/readflowApi";

export interface SampleArticle {
  title: string;
  topic: string;
  url: string;
  text: string;
}

export const SAMPLE_ARTICLES: SampleArticle[] = [
  {
    title: "How Small Daily Habits Create Remarkable Changes",
    topic: "Tâm lý / Thói quen",
    url: "https://jamesclear.com/atomic-habits",
    text: `Changes that seem small and unimportant at first will compound into remarkable results if you are willing to stick with them for years. We all deal with setbacks, but in the long run, the quality of our lives often depends on the quality of our habits.

With the same habits, you’ll end up with the same results. But with better habits, anything is possible.

Success is the product of daily habits—not once-in-a-lifetime transformations. You should be far more concerned with your current trajectory than with your current results. If you want to predict where you’ll end up in life, all you have to do is follow the curve of tiny gains or tiny losses, and see how your daily choices will compound ten or twenty years down the line.

Time magnifies the margin between success and failure. It will multiply whatever you feed it. Good habits make time your ally. Bad habits make time your enemy.`,
  },
  {
    title: "Could Humans Really Live on Mars in Our Lifetime?",
    topic: "Khoa học / Vũ trụ",
    url: "https://www.nationalgeographic.com/science/article/mars-colony",
    text: `For centuries, humanity has gazed at the crimson glow of Mars and wondered whether life could thrive upon its dusty plains. Today, with advancements in propulsion, autonomous robotics, and life-support technology, that distant dream is inching closer to reality.

However, surviving on Mars presents extraordinary biological and psychological hurdles. The Martian atmosphere is thin and primarily composed of carbon dioxide, offering minimal protection against cosmic radiation. Colonists would need subterranean habitats or habitats built from Martian regolith.

Furthermore, sustaining a self-sufficient ecosystem requires recycling virtually all water and producing oxygen through electrolysis and synthetic biology. The journey will not merely test our technological prowess, but our resilience and collective curiosity as a species.`,
  },
  {
    title: "The Silent Symphony of Trees: How Forests Communicate",
    topic: "Thiên nhiên / Môi trường",
    url: "https://www.nature.com/articles/forest-wood-wide-web",
    text: `Beneath the quiet forest floor lies a bustling underground network of fungal threads known as mycorrhizae. Through this 'Wood Wide Web', trees exchange carbon, water, and vital nutrients with neighboring plants in need.

When a tree is attacked by insects, it can send chemical alarm signals through the fungal network, warning nearby trees to produce defensive compounds before the pests arrive. 

Older 'mother trees' act as central hubs in the forest network, actively nurturing younger seedlings by channeling extra sugars and minerals. Forests are not merely collections of individual trees competing for sunlight, but sophisticated, collaborative communities that thrive through mutual support.`,
  },
  {
    title: "The Rise of Artificial Intelligence in Everyday Life",
    topic: "Công nghệ / AI",
    url: "https://www.technologyreview.com/ai-impact",
    text: `Artificial intelligence is rapidly shifting from experimental research labs into the fabric of daily human experience. From language models assisting creative writing to predictive algorithms optimizing renewable energy grids, intelligent systems are augmenting human capabilities.

Yet, as AI models become more pervasive, questions surrounding algorithmic bias, data privacy, and ethical governance become paramount. Ensuring that artificial intelligence remains aligned with human values requires thoughtful collaboration across engineers, philosophers, and policy makers worldwide.`,
  },
];

interface UrlBarProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  onFetchArticle: (customUrl?: string) => void;
  autoTranslate: boolean;
  setAutoTranslate: (val: boolean) => void;
  articleMeta: CrawlResult | null;
  onSelectSample: (sample: SampleArticle) => void;
}

export function UrlBar({
  url,
  setUrl,
  isLoading,
  onFetchArticle,
  autoTranslate,
  setAutoTranslate,
  articleMeta,
  onSelectSample,
}: UrlBarProps) {
  const [showSamples, setShowSamples] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onFetchArticle();
    }
  };

  return (
    <div className="readflow-url-bar-container">
      <form onSubmit={handleSubmit} className="readflow-url-form">
        <div className="url-input-wrapper">
          <Globe size={18} className="url-icon text-green" />
          <input
            type="text"
            placeholder="Dán đường link bài báo tiếng Anh (BBC, CNN, Medium, TechCrunch...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="url-input"
            disabled={isLoading}
          />
          {url && (
            <button
              type="button"
              className="url-clear-btn"
              onClick={() => setUrl("")}
              disabled={isLoading}
              title="Xóa link"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn primary url-fetch-btn"
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="spin" /> Đang bóc tách...
            </>
          ) : (
            <>
              Lấy bài đọc <ArrowRight size={16} />
            </>
          )}
        </button>

        <div className="sample-dropdown-container">
          <button
            type="button"
            className="btn sample-picker-btn"
            onClick={() => setShowSamples((prev) => !prev)}
          >
            <BookOpen size={16} className="text-green" />
            <span>Bài mẫu</span>
            <ChevronDown size={14} />
          </button>

          {showSamples && (
            <>
              <div
                className="dropdown-overlay"
                onClick={() => setShowSamples(false)}
              />
              <div className="sample-menu-dropdown">
                <div className="dropdown-header">
                  <Sparkles size={15} className="text-green" />
                  <span>Chọn bài đọc song ngữ mẫu</span>
                </div>
                {SAMPLE_ARTICLES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="sample-menu-item"
                    onClick={() => {
                      onSelectSample(sample);
                      setShowSamples(false);
                    }}
                  >
                    <div className="sample-item-top">
                      <span className="sample-item-topic">{sample.topic}</span>
                    </div>
                    <strong className="sample-item-title">{sample.title}</strong>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </form>

      <div className="url-bar-footer-row">
        <label className="auto-translate-toggle">
          <input
            type="checkbox"
            checked={autoTranslate}
            onChange={(e) => setAutoTranslate(e.target.checked)}
          />
          <span>Tự động dịch sang tiếng Việt khi nạp bài</span>
        </label>

        {articleMeta && (
          <div className="article-meta-chips">
            <span className="meta-chip">
              <Globe size={13} /> {articleMeta.siteName || "Web Article"}
            </span>
            <span className="meta-chip">
              <FileText size={13} /> {articleMeta.wordCount} từ
            </span>
            <span className="meta-chip">
              <Clock size={13} /> ~{Math.max(1, Math.ceil(articleMeta.wordCount / 180))} phút đọc
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
