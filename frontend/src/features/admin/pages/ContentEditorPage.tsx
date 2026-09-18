import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Upload, Eye, ArrowLeft } from "lucide-react";
import { useDemo, uid } from "../../../app/providers";
import type { Content, ContentType } from "../../../shared/types/demo";
import { topics } from "../../../shared/mock/seed";
import {
  PageHeading,
  Cover,
  Modal,
  Empty,
  contentPath,
} from "../../../shared/components/ui";
import { saveAsset } from "../../../shared/api/media";
import { MediaPreview } from "../components/MediaPreview";
import {
  InlineMarkdown,
  MarkdownBlock,
} from "../../../shared/components/Markdown";
const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export function ContentEditorPage({ media = false }: { media?: boolean }) {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { state, saveContent, notify } = useDemo();
  const navigate = useNavigate();
  const existing = state.contents.find((c) => c.id === id);
  const [draft, setDraft] = useState<Content>(
    () =>
      existing || {
        id: uid(),
        slug: "",
        title: "",
        teaser: "",
        type: media
          ? params.get("type") === "VIDEO"
            ? "VIDEO"
            : "PODCAST"
          : "ARTICLE",
        category: "science",
        difficulty: "Easy",
        thumbnail: "",
        duration: 0,
        likes: 0,
        author: "Flowling Editorial",
        publishedAt: Date.now(),
        status: "DRAFT",
        paragraphs: [],
        segments: [],
        mediaUrl: "",
      },
  );
  const [en, setEn] = useState(
    existing?.paragraphs.map((p) => p.en).join("\n\n") || "",
  );
  const [vi, setVi] = useState(
    existing?.paragraphs.map((p) => p.vi).join("\n\n") || "",
  );
  const [error, setError] = useState(""),
    [preview, setPreview] = useState(false),
    [busy, setBusy] = useState(false),
    [extracted, setExtracted] = useState<string[]>([]);
  const dirty = useRef(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const before = (e: BeforeUnloadEvent) => {
      if (dirty.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, []);
  useEffect(() => {
    if (id === "new" && media && !dirty.current)
      setDraft((d) => ({
        ...d,
        type: params.get("type") === "VIDEO" ? "VIDEO" : "PODCAST",
      }));
  }, [params.get("type")]);
  if (id !== "new" && !existing)
    return <Empty title="Không tìm thấy nội dung để chỉnh sửa" />;
  const change = (value: Partial<Content>) => {
    dirty.current = true;
    setDraft((d) => ({ ...d, ...value }));
  };
  const built = (): Content => {
    const english = en.split(/\n\s*\n/).filter((p) => p.trim()),
      vietnamese = vi.split(/\n\s*\n/);
    return {
      ...draft,
      slug: draft.slug || slugify(draft.title),
      paragraphs: english.map((p, i) => ({
        en: p.trim(),
        vi: vietnamese[i]?.trim() || "",
      })),
      duration: media
        ? draft.duration
        : Math.max(60, Math.ceil(en.trim().split(/\s+/).length / 180) * 60),
    };
  };
  const save = (publish = false, next = false) => {
    const content = built();
    if (!content.title.trim()) {
      setError("Nhập tiêu đề nội dung.");
      return;
    }
    if (
      !content.slug ||
      state.contents.some((c) => c.id !== content.id && c.slug === content.slug)
    ) {
      setError("Slug cần duy nhất và không được để trống.");
      return;
    }
    if (
      media &&
      content.mediaUrl &&
      !/^(https?:\/\/|asset:|\/media\/)/.test(content.mediaUrl)
    ) {
      setError("Dùng URL http/https trực tiếp hoặc tải tệp media lên.");
      return;
    }
    if (
      media &&
      (next || publish) &&
      (!content.mediaUrl || !content.duration)
    ) {
      setError("Thêm media phát được và chờ đọc thời lượng.");
      return;
    }
    if (
      publish &&
      !media &&
      (!en.trim() || !vi.trim() || content.paragraphs.some((p) => !p.vi))
    ) {
      setError(
        "Thêm nội dung và bản dịch theo cùng số đoạn, cách nhau bằng dòng trống.",
      );
      return;
    }
    saveContent({
      ...content,
      status: publish ? "PUBLISHED" : "DRAFT",
      publishedAt: publish ? Date.now() : content.publishedAt,
    });
    dirty.current = false;
    notify(publish ? "Đã xuất bản lên Feed" : "Đã lưu bản nháp");
    navigate(next ? `/admin/transcript/${content.id}` : "/admin");
  };
  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (!/^(audio|video)\//.test(file.type) || file.size > 100 * 1024 * 1024) {
      setError("Chọn tệp audio/video nhỏ hơn 100 MB.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const mediaUrl = await saveAsset(file);
      change({
        mediaUrl,
        duration: 0,
        type: file.type.startsWith("video/") ? "VIDEO" : "PODCAST",
      });
    } catch {
      setError("Không thể lưu tệp. Kiểm tra dung lượng trình duyệt.");
    } finally {
      setBusy(false);
    }
  };
  const image = (file: File | undefined) => {
    if (!file) return;
    if (
      !/^image\/(png|jpeg|webp)$/.test(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setError("Chọn ảnh PNG/JPG/WebP nhỏ hơn 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => change({ thumbnail: String(reader.result) });
    reader.readAsDataURL(file);
  };
  return (
    <>
      <Link className="subtle-link" to="/admin">
        <ArrowLeft size={16} /> Thư viện nội dung
      </Link>
      <PageHeading
        eyebrow={
          media
            ? draft.type === "VIDEO"
              ? "VIDEO STUDIO"
              : "PODCAST STUDIO"
            : "STORY EDITOR"
        }
        title={
          existing
            ? `Chăm chút: ${draft.title || "nội dung của bạn"}`
            : draft.type === "VIDEO"
              ? "Thêm video mới"
              : media
                ? "Thêm podcast mới"
                : "Một câu chuyện đáng để chia sẻ."
        }
        description={
          draft.type === "VIDEO"
            ? "Tải lên tệp hoặc dán URL video, sau đó gắn phụ đề và transcript song ngữ."
            : media
              ? "Thêm âm thanh podcast, rồi ghép từng câu với thời gian."
              : "Viết bằng tiếng Anh, mở thêm cánh cửa bằng bản dịch."
        }
        action={
          <button className="btn" onClick={() => setPreview(true)}>
            <Eye size={16} /> Xem trước
          </button>
        }
      />
      <div className="editor-grid">
        <section className="panel editor-canvas">
          <label className="field">
            Tiêu đề
            <input
              required
              value={draft.title}
              maxLength={180}
              onChange={(e) =>
                change({
                  title: e.target.value,
                  slug: existing ? draft.slug : slugify(e.target.value),
                })
              }
              placeholder="Một câu chuyện bắt đầu bằng một tiêu đề…"
            />
          </label>
          <label className="field">
            Slug
            <input
              value={draft.slug}
              onChange={(e) => change({ slug: slugify(e.target.value) })}
            />
          </label>
          {media ? (
            <>
              <label className="field">
                Định dạng
                <select
                  value={draft.type}
                  onChange={(e) => {
                    const nextType = e.target.value as ContentType;
                    change({
                      type: nextType,
                      mediaUrl: "",
                      duration: 0,
                    });
                    if (id === "new") {
                      navigate(`/admin/media/new?type=${nextType}`, {
                        replace: true,
                      });
                    }
                  }}
                >
                  <option value="PODCAST">Podcast Audio</option>
                  <option value="VIDEO">Video Clip</option>
                </select>
              </label>
              <label
                className="upload-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  void upload(e.dataTransfer.files[0]);
                }}
              >
                <Upload size={32} />
                <strong>
                  {busy ? "Đang lưu tệp…" : "Kéo thả hoặc chọn tệp media"}
                </strong>
                <span>MP3, M4A, WAV, MP4 · tối đa 100 MB</span>
                <input
                  disabled={busy}
                  type="file"
                  accept="audio/*,video/mp4,video/webm"
                  onChange={(e) => void upload(e.target.files?.[0])}
                />
              </label>
              <label className="field">
                Hoặc URL media trực tiếp
                <input
                  type="url"
                  placeholder="https://…/video.mp4"
                  value={
                    draft.mediaUrl.startsWith("asset:") ? "" : draft.mediaUrl
                  }
                  onChange={(e) => {
                    change({ mediaUrl: e.target.value, duration: 0 });
                  }}
                />
                <small>
                  Dùng tệp trực tiếp để tua và đồng bộ transcript chính xác.
                </small>
              </label>
              {draft.mediaUrl && (
                <MediaPreview
                  source={draft.mediaUrl}
                  video={draft.type === "VIDEO"}
                  onDuration={(duration) =>
                    setDraft((d) => ({ ...d, duration }))
                  }
                />
              )}
              <p className="small green">
                Thời lượng: {draft.duration.toFixed(2)} giây
              </p>
            </>
          ) : (
            <>
              <div className="row spread">
                <h3>Nội dung English</h3>
                <div className="row">
                  <button
                    className="btn small"
                    onClick={() => {
                      const el = textarea.current;
                      if (!el) return;
                      const a = el.selectionStart,
                        b = el.selectionEnd;
                      setEn(
                        en.slice(0, a) +
                          "**" +
                          en.slice(a, b) +
                          "**" +
                          en.slice(b),
                      );
                      dirty.current = true;
                    }}
                  >
                    B
                  </button>
                  <button
                    className="btn small"
                    onClick={() => {
                      setEn((s) => s + "\n\n## ");
                      dirty.current = true;
                      textarea.current?.focus();
                    }}
                  >
                    H2
                  </button>
                </div>
              </div>
              <label className="field">
                <span className="sr-only">Nội dung English</span>
                <textarea
                  ref={textarea}
                  className="body-editor"
                  value={en}
                  onChange={(e) => {
                    setEn(e.target.value);
                    dirty.current = true;
                  }}
                  placeholder="Viết nội dung… Dùng dòng trống để tách đoạn; **in đậm**, ## tiêu đề."
                />
              </label>
              <label className="field">
                Bản dịch Vietnamese
                <textarea
                  className="body-editor"
                  value={vi}
                  onChange={(e) => {
                    setVi(e.target.value);
                    dirty.current = true;
                  }}
                  placeholder="Bản dịch, cùng số đoạn với nội dung English…"
                />
              </label>
              <div className="row spread">
                <span className="muted small">
                  {en.trim() ? en.trim().split(/\s+/).length : 0} từ ·{" "}
                  {Math.max(1, Math.ceil(en.trim().split(/\s+/).length / 180))}{" "}
                  phút đọc
                </span>
                <button
                  className="btn"
                  onClick={() =>
                    setExtracted(
                      [
                        ...new Set(
                          en.toLowerCase().match(/\b[a-z]{7,}\b/g) || [],
                        ),
                      ].slice(0, 20),
                    )
                  }
                >
                  Gợi ý từ khóa
                </button>
              </div>
              {extracted.length > 0 && (
                <div className="actions">
                  {extracted.map((w) => (
                    <span className="tag green" key={w}>
                      {w}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
        <aside className="stack">
          <section className="panel">
            <h3>Thông tin câu chuyện</h3>
            <label className="field">
              Ảnh bìa
              <Cover
                className="editor-cover"
                src={draft.thumbnail}
                alt="Xem trước ảnh bìa"
              />
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => image(e.target.files?.[0])}
              />
            </label>
            <label className="field">
              Mô tả ngắn
              <textarea
                value={draft.teaser}
                maxLength={350}
                onChange={(e) => change({ teaser: e.target.value })}
              />
            </label>
            <label className="field">
              Chủ đề
              <select
                value={draft.category}
                onChange={(e) => change({ category: e.target.value })}
              >
                {topics.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Độ khó
              <select
                value={draft.difficulty}
                onChange={(e) =>
                  change({
                    difficulty: e.target.value as Content["difficulty"],
                  })
                }
              >
                {["Easy", "Intermediate", "Advanced"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Tác giả
              <input
                value={draft.author}
                onChange={(e) => change({ author: e.target.value })}
              />
            </label>
          </section>
          <section className="panel">
            <h3>Sẵn sàng chia sẻ?</h3>
            <p className="small muted">
              Kiểm tra nội dung và bản dịch trước khi xuất bản.
            </p>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <div className="stack">
              <button className="btn" disabled={busy} onClick={() => save()}>
                Lưu nháp
              </button>
              <button
                className="btn primary"
                disabled={busy}
                onClick={() => save(!media, media)}
              >
                {media ? "Lưu & Soạn transcript →" : "Đăng bài lên Feed"}
              </button>
            </div>
          </section>
        </aside>
      </div>
      {preview && (
        <Modal title="Xem trước nội dung" onClose={() => setPreview(false)}>
          <Cover className="editor-cover" src={draft.thumbnail} alt="" />
          <h2>{draft.title || "Tiêu đề câu chuyện"}</h2>
          <p className="muted">{draft.teaser}</p>
          {media
            ? draft.mediaUrl && (
                <MediaPreview
                  source={draft.mediaUrl}
                  video={draft.type === "VIDEO"}
                />
              )
            : built().paragraphs.map((p, i) => (
                <section className="preview-paragraph" key={i}>
                  <MarkdownBlock text={p.en}>
                    <InlineMarkdown text={p.en.replace(/^#{1,3}\s+/, "")} />
                  </MarkdownBlock>
                  <MarkdownBlock text={p.vi} className="translation">
                    <InlineMarkdown text={p.vi.replace(/^#{1,3}\s+/, "")} />
                  </MarkdownBlock>
                </section>
              ))}
        </Modal>
      )}
    </>
  );
}
