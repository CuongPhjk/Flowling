import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Search,
  Volume2,
  ArrowUpRight,
  Bookmark,
  Heart,
  BookOpen,
  Headphones,
  Play,
} from "lucide-react";
import type { Content } from "../types/demo";
import { topics } from "../mock/seed";
import { useDemo } from "../../app/providers";
export const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
export const contentPath = (c: Content) =>
  `/${c.type === "ARTICLE" ? "article" : c.type === "PODCAST" ? "podcast" : "video"}/${c.slug}`;
export const typeLabel = {
  ARTICLE: "Bài đọc",
  PODCAST: "Podcast",
  VIDEO: "Video",
};
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}
export function Empty({
  title = "Chưa có nội dung",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty panel">
      <BookOpen size={38} />
      <h2>{title}</h2>
      <p>{description || "Thử đổi bộ lọc hoặc khám phá một nội dung mới."}</p>
      {action || (
        <Link className="btn primary" to="/explore">
          Khám phá ngay <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function SearchBox({
  value,
  onChange,
  placeholder = "Tìm kiếm nội dung…",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <label className="search-box">
      <Search size={19} />
      <input
        ref={ref}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value ? (
        <button aria-label="Xóa tìm kiếm" onClick={() => onChange("")}>
          <X size={16} />
        </button>
      ) : (
        <kbd>Ctrl K</kbd>
      )}
    </label>
  );
}
export function Tabs({
  items,
  value,
  onChange,
}: {
  items: readonly { id: string; label: string }[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="tabs" role="group">
      {items.map((t) => (
        <button
          key={t.id}
          className={value === t.id ? "active" : ""}
          aria-pressed={value === t.id}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
export const typeTabs = [
  { id: "ALL", label: "Tất cả" },
  { id: "ARTICLE", label: "Bài đọc" },
  { id: "PODCAST", label: "Podcast" },
  { id: "VIDEO", label: "Video" },
];
export function Cover({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      loading="lazy"
      className={className}
      src={src || "/cover.svg"}
      alt={alt}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/cover.svg";
      }}
    />
  );
}
export function ContentCard({ content: c }: { content: Content }) {
  const { data, toggleSave, toggleLike } = useDemo();
  const Icon =
    c.type === "ARTICLE" ? BookOpen : c.type === "PODCAST" ? Headphones : Play;
  return (
    <article className="content-card">
      <Link className="card-image" to={contentPath(c)}>
        <Cover src={c.thumbnail} alt={c.title} />
        <span className="media-label">
          <Icon size={13} />
          {typeLabel[c.type]} ·{" "}
          {c.type === "ARTICLE"
            ? `${Math.ceil(c.duration / 60)} phút`
            : formatTime(c.duration)}
        </span>
      </Link>
      <div className="card-body">
        <div className="row spread">
          <span className={`tag cat-${c.category}`}>
            {topics.find((t) => t.id === c.category)?.label}
          </span>
          <span className="muted small">{c.difficulty}</span>
        </div>
        <Link to={contentPath(c)}>
          <h3>{c.title}</h3>
        </Link>
        <p className="teaser">{c.teaser}</p>
        <div className="card-footer">
          <button
            className={data.liked.includes(c.id) ? "liked" : ""}
            aria-label={`Thích ${c.title}`}
            aria-pressed={data.liked.includes(c.id)}
            onClick={() => toggleLike(c.id)}
          >
            <Heart
              size={16}
              fill={data.liked.includes(c.id) ? "currentColor" : "none"}
            />
            {(c.likes + (data.liked.includes(c.id) ? 1 : 0)).toLocaleString()}
          </button>
          <button
            aria-label={`Lưu ${c.title}`}
            aria-pressed={data.saved.includes(c.id)}
            className={data.saved.includes(c.id) ? "green" : ""}
            onClick={() => toggleSave(c.id)}
          >
            <Bookmark
              size={18}
              fill={data.saved.includes(c.id) ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
export function Speak({ text }: { text: string }) {
  const { notify } = useDemo();
  return (
    <button
      className="icon-btn"
      aria-label={`Nghe phát âm ${text}`}
      onClick={() => {
        if (!("speechSynthesis" in window)) {
          notify("Trình duyệt này chưa hỗ trợ phát âm.");
          return;
        }
        speechSynthesis.cancel();
        const voice = new SpeechSynthesisUtterance(text);
        voice.lang = "en-US";
        voice.rate = 0.9;
        speechSynthesis.speak(voice);
      }}
    >
      <Volume2 size={19} />
    </button>
  );
}
export function Modal({
  title,
  children,
  onClose,
  drawer = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null),
    closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        const elements = ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),a[href],input,select,textarea,[tabindex="0"]',
        );
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className={`modal-backdrop ${drawer ? "drawer-backdrop" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${drawer ? "drawer" : ""}`}
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="row spread modal-title">
          <h2>{title}</h2>
          <button className="icon-btn" aria-label="Đóng" onClick={onClose}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
