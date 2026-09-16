import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bookmark, ArrowLeft } from "lucide-react";
import { useDemo } from "../../../app/providers";
import { Cover, Empty, Tabs } from "../../../shared/components/ui";
import { topics } from "../../../shared/mock/seed";
import { WordTools } from "../../vocabulary/components/WordTools";
import {
  MarkdownBlock,
  InlineMarkdown,
} from "../../../shared/components/Markdown";
export function ArticlePage() {
  const { slug } = useParams();
  const { state, account, data, toggleSave, track } = useDemo();
  const content = state.contents.find(
    (c) =>
      c.slug === slug &&
      c.type === "ARTICLE" &&
      (c.status === "PUBLISHED" || account?.role === "ADMIN"),
  );
  const [mode, setMode] = useState("English"),
    [size, setSize] = useState(18);
  const reader = useRef<HTMLElement>(null);
  const [percent, setPercent] = useState(0);
  const trackRef = useRef(track);
  trackRef.current = track;
  useEffect(() => {
    if (!content) return;
    let elapsed = 0;
    let percent = 0;
    const old = data.progress.find((p) => p.contentId === content.id);
    const scroll = () => {
      const rect = reader.current?.getBoundingClientRect();
      if (!rect) return;
      percent = Math.max(
        0,
        Math.min(100, ((window.innerHeight - rect.top) / rect.height) * 100),
      );
      setPercent(percent);
    };
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") elapsed++;
      if (elapsed >= 5) {
        trackRef.current(content, percent, window.scrollY, elapsed);
        elapsed = 0;
      }
    }, 1000);
    const restore = setTimeout(() => {
      if (old && old.percent < 100) window.scrollTo(0, old.position);
      scroll();
    }, 100);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      clearInterval(interval);
      clearTimeout(restore);
      window.removeEventListener("scroll", scroll);
      trackRef.current(content, percent, window.scrollY, elapsed);
    };
  }, [content?.id]);
  if (!content) return <Empty title="Không tìm thấy bài viết" />;
  return (
    <>
      <div className="reading-toolbar">
        <Link className="btn" to="/">
          <ArrowLeft size={16} /> Quay lại
        </Link>
        <Tabs
          items={["English", "Bilingual", "Vietnamese"].map((x) => ({
            id: x,
            label: x,
          }))}
          value={mode}
          onChange={setMode}
        />
        <button
          className="btn"
          aria-label="Đổi kích thước chữ"
          onClick={() => setSize((s) => (s === 22 ? 16 : s + 2))}
        >
          Aa {size}
        </button>
        <button
          className="icon-btn"
          aria-label="Lưu bài viết"
          aria-pressed={data.saved.includes(content.id)}
          onClick={() => toggleSave(content.id)}
        >
          <Bookmark
            fill={data.saved.includes(content.id) ? "currentColor" : "none"}
          />
        </button>
        <div className="reading-progress" style={{ width: `${percent}%` }} />
      </div>
      <article className="reader" ref={reader}>
        <span className={`tag cat-${content.category}`}>
          {topics.find((t) => t.id === content.category)?.label} ·{" "}
          {content.difficulty}
        </span>
        <h1>{content.title}</h1>
        <p className="muted">
          {content.author} ·{" "}
          {new Date(content.publishedAt).toLocaleDateString("vi-VN")} ·{" "}
          {Math.ceil(content.duration / 60)} phút đọc
        </p>
        <Cover
          className="reader-cover"
          src={content.thumbnail}
          alt={content.title}
        />
        <p className="reader-deck">{content.teaser}</p>
        <div className="reader-body" style={{ fontSize: size }}>
          {content.paragraphs.map((p, i) => (
            <section key={i}>
              {mode !== "Vietnamese" && (
                <MarkdownBlock text={p.en}>
                  <WordTools
                    text={p.en.replace(/^#{1,3}\s+/, "")}
                    translation={p.vi}
                    content={content}
                  />
                </MarkdownBlock>
              )}
              {mode !== "English" && (
                <MarkdownBlock
                  text={p.vi}
                  className={mode === "Bilingual" ? "translation" : ""}
                >
                  <InlineMarkdown text={p.vi.replace(/^#{1,3}\s+/, "")} />
                </MarkdownBlock>
              )}
            </section>
          ))}
        </div>
        <div className="reader-end">
          <span>✦</span>
          <h3>Một góc nhìn mới, để mang theo.</h3>
          <p>Chạm vào từ để tra nghĩa, hoặc bôi đen một cụm từ để lưu.</p>
          <Link className="btn primary" to="/">
            Tiếp tục khám phá →
          </Link>
        </div>
      </article>
    </>
  );
}
