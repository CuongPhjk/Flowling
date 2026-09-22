import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Pause,
  Bookmark,
  Maximize2,
  Repeat,
  Subtitles,
  ArrowDownCircle,
} from "lucide-react";
import { useDemo } from "../../../app/providers";
import { useMediaUrl } from "../../../shared/hooks/useMediaUrl";
import { useTranscriptSync } from "../hooks/useTranscriptSync";
import {
  Cover,
  Empty,
  PageHeading,
  formatTime,
  Tabs,
} from "../../../shared/components/ui";
import { WordTools } from "../../vocabulary/components/WordTools";
import { contentApi, progressApi, toDemoDetail } from "../../../shared/api";
import type { Content } from "../../../shared/types/demo";

export function MediaPage() {
  const { slug } = useParams();
  const { state, account, data, track, toggleSave, updatePersonal, notify } =
    useDemo();
  const localContent = state.contents.find(
    (c) =>
      c.slug === slug &&
      c.type !== "ARTICLE" &&
      (c.status === "PUBLISHED" || account?.role === "ADMIN"),
  );
  const [cloudContent, setCloudContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      contentApi
        .getContentBySlug(slug)
        .then((res) => {
          if (res) {
            setCloudContent(toDemoDetail(res));
          }
        })
        .catch((err) => {
          console.warn("Lỗi tải media từ cloud:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const content = cloudContent || localContent;
  const [params] = useSearchParams();
  const { url, error } = useMediaUrl(content?.mediaUrl || "");
  const sync = useTranscriptSync(content?.segments || []);
  const [mode, setMode] = useState("EN"),
    [speed, setSpeed] = useState(data.profile.speed),
    [theater, setTheater] = useState(false),
    [translated, setTranslated] = useState<string[]>([]),
    [mediaError, setMediaError] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("flowling_subtitles_enabled");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });
  const segmentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const transcriptRef = useRef<HTMLDivElement>(null);
  const syncRef = useRef(sync);
  syncRef.current = sync;
  const trackRef = useRef(track);
  trackRef.current = track;

  const toggleSubtitles = () => {
    setSubtitlesEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("flowling_subtitles_enabled", String(next));
      } catch {
        // ignore
      }
      notify(next ? "Đã bật phụ đề video" : "Đã tắt phụ đề video");
      return next;
    });
  };

  const scrollToSegment = (segmentId: string, smooth = true) => {
    const node = segmentRefs.current[segmentId];
    const container = transcriptRef.current;
    if (node && container) {
      const containerRect = container.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const currentRelativeTop = nodeRect.top - containerRect.top;
      const targetScrollTop =
        container.scrollTop +
        currentRelativeTop -
        container.clientHeight / 2 +
        nodeRect.height / 2;

      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  useEffect(() => {
    if (autoScroll && sync.active) {
      scrollToSegment(sync.active.id, true);
    }
  }, [sync.active?.id, autoScroll]);
  useEffect(() => {
    if (sync.mediaRef.current) sync.mediaRef.current.playbackRate = speed;
  }, [speed, url]);
  useEffect(() => {
    if (!content) return;
    let elapsed = 0;
    const save = () => {
      const s = syncRef.current;
      if (s.duration) {
        trackRef.current(content, (s.time / s.duration) * 100, s.time, elapsed);
        const numId = Number(content.id);
        if (!isNaN(numId)) {
          progressApi
            .updateProgress(numId, {
              progressPercentage: Math.round((s.time / s.duration) * 100),
              lastPositionSeconds: Math.round(s.time),
              isCompleted: s.time / s.duration > 0.85,
            })
            .catch(() => {});
        }
      }
      elapsed = 0;
    };
    const interval = setInterval(() => {
      if (syncRef.current.playing) elapsed++;
      if (elapsed >= 5) save();
    }, 1000);
    return () => {
      clearInterval(interval);
      save();
    };
  }, [content?.id]);
  if (loading && !content) {
    return <div className="panel" style={{ padding: "60px", textAlign: "center" }}>Đang tải nội dung...</div>;
  }
  if (!content) return <Empty title="Không tìm thấy nội dung" />;
  const play = () =>
    sync
      .toggle()
      .catch(() =>
        setMediaError(
          "Không thể phát tệp. Hãy kiểm tra nguồn media trong trang biên tập.",
        ),
      );
  const loaded = () => {
    const media = sync.mediaRef.current;
    if (media) {
      media.playbackRate = speed;
      const requested = params.get("t");
      media.currentTime = Math.min(
        Math.max(
          0,
          requested !== null
            ? Number(requested) || 0
            : data.progress.find(
                (p) => p.contentId === content.id && p.percent < 100,
              )?.position || 0,
        ),
        Math.max(0, media.duration - 0.1),
      );
    }
  };
  return (
    <>
      <Link className="subtle-link" to="/">
        <ArrowLeft size={16} /> Quay lại Feed
      </Link>
      <PageHeading
        eyebrow={
          content.type === "VIDEO"
            ? "WATCH SOMETHING WONDERFUL"
            : "TUNE INTO A NEW PERSPECTIVE"
        }
        title={content.title}
        description={`${content.author} · ${content.difficulty} · ${formatTime(content.duration)}`}
      />
      <div className={`media-layout ${theater ? "theater" : ""}`}>
        <section className="panel media-player">
          <div className="media-viewport">
            {content.type === "VIDEO" ? (
              <video
                ref={(el) => {
                  sync.mediaRef.current = el;
                }}
                src={url || undefined}
                onLoadedMetadata={loaded}
                onError={() =>
                  setMediaError(
                    "Không tải được video. Kiểm tra lại tệp hoặc URL.",
                  )
                }
                poster={content.thumbnail}
                playsInline
                controls
              />
            ) : (
              <>
                <Cover src={content.thumbnail} alt={content.title} />
                <audio
                  ref={(el) => {
                    sync.mediaRef.current = el;
                  }}
                  src={url || undefined}
                  onLoadedMetadata={loaded}
                  onError={() =>
                    setMediaError(
                      "Không tải được audio. Kiểm tra lại tệp hoặc URL.",
                    )
                  }
                />
                <span className="audio-art-label">
                  FLOWLING ORIGINALS
                  <br />
                  <strong>Listen. Imagine. Discover.</strong>
                </span>
              </>
            )}
            {content.type === "VIDEO" && (
              <button
                type="button"
                className={`video-cc-badge ${subtitlesEnabled ? "active" : "disabled"}`}
                onClick={toggleSubtitles}
                title={
                  subtitlesEnabled
                    ? "Tắt phụ đề video (CC đang BẬT)"
                    : "Bật phụ đề video (CC đang TẮT)"
                }
                aria-label={
                  subtitlesEnabled ? "Tắt phụ đề video" : "Bật phụ đề video"
                }
              >
                <Subtitles size={14} />
                <span>{subtitlesEnabled ? "CC Bật" : "CC Tắt"}</span>
              </button>
            )}
            {content.type === "VIDEO" &&
              sync.active &&
              subtitlesEnabled &&
              mode !== "HIDE" && (
                <div className="video-subtitle">
                  {mode === "VI" ? (
                    sync.active.vietnameseText
                  ) : (
                    <WordTools
                      text={sync.active.englishText}
                      translation={sync.active.vietnameseText}
                      content={content}
                      onLookup={() => sync.mediaRef.current?.pause()}
                    />
                  )}
                </div>
              )}
          </div>
          {(error || mediaError) && (
            <p className="error" role="alert">
              {error || mediaError}
            </p>
          )}
          <div className="player-controls">
            <input
              aria-label="Tua nội dung"
              type="range"
              min={0}
              max={sync.duration || content.duration}
              step={0.001}
              value={sync.time}
              onChange={(e) => {
                sync.setLoop(null);
                sync.seek(Number(e.target.value));
              }}
            />
            <div className="row spread small muted">
              <span>{formatTime(sync.time)}</span>
              <span>{formatTime(sync.duration || content.duration)}</span>
            </div>
            <div className="playback-buttons">
              <button
                className="btn"
                onClick={() => {
                  sync.setLoop(null);
                  sync.seek(sync.time - 10);
                }}
              >
                −10s
              </button>
              <button
                aria-label={sync.playing ? "Tạm dừng" : "Phát"}
                className="play-btn"
                onClick={play}
              >
                {sync.playing ? <Pause /> : <Play />}
              </button>
              <button
                className="btn"
                onClick={() => {
                  sync.setLoop(null);
                  sync.seek(sync.time + 10);
                }}
              >
                +10s
              </button>
            </div>
            <div className="row spread">
              <select
                aria-label="Tốc độ phát"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                {[0.75, 1, 1.25, 1.5].map((n) => (
                  <option key={n} value={n}>
                    {n}×
                  </option>
                ))}
              </select>
              {content.type === "VIDEO" && (
                <button
                  type="button"
                  className={`icon-btn ${subtitlesEnabled ? "active" : ""}`}
                  aria-label={
                    subtitlesEnabled ? "Tắt phụ đề video" : "Bật phụ đề video"
                  }
                  title={
                    subtitlesEnabled
                      ? "Tắt phụ đề video (CC đang BẬT)"
                      : "Bật phụ đề video (CC đang TẮT)"
                  }
                  aria-pressed={subtitlesEnabled}
                  onClick={toggleSubtitles}
                >
                  <Subtitles size={18} />
                </button>
              )}
              <button
                className="icon-btn"
                aria-label="Lưu nội dung"
                aria-pressed={data.saved.includes(content.id)}
                onClick={() => toggleSave(content.id)}
              >
                <Bookmark
                  fill={
                    data.saved.includes(content.id) ? "currentColor" : "none"
                  }
                />
              </button>
              {content.type === "VIDEO" && (
                <button
                  className="icon-btn"
                  aria-label="Chế độ rạp chiếu"
                  aria-pressed={theater}
                  onClick={() => setTheater((v) => !v)}
                >
                  <Maximize2 />
                </button>
              )}
            </div>
            {sync.loop && (
              <button className="tag green" onClick={() => sync.setLoop(null)}>
                <Repeat size={13} /> Đang lặp câu · Bấm để tắt
              </button>
            )}
          </div>
          <p className="muted small">{content.teaser}</p>
        </section>
        <section className="transcript-panel panel">
          <div className="row spread transcript-header">
            <h2>Transcript</h2>
            <div className="row" style={{ gap: "8px", alignItems: "center" }}>
              <button
                type="button"
                className={`chip-toggle ${autoScroll ? "active" : ""}`}
                onClick={() => setAutoScroll((v) => !v)}
                title={
                  autoScroll
                    ? "Bấm để tắt tự động cuộn"
                    : "Bấm để bật tự động cuộn"
                }
                aria-label={
                  autoScroll ? "Bật tự động cuộn" : "Tắt tự động cuộn"
                }
              >
                <ArrowDownCircle size={14} />
                <span>{autoScroll ? "Cuộn tự động" : "Tắt cuộn"}</span>
              </button>
              <span className="small muted">Chạm mốc giờ để tua</span>
            </div>
          </div>
          <Tabs
            items={[
              { id: "EN", label: "EN" },
              { id: "BOTH", label: "EN + VI" },
              { id: "VI", label: "VI" },
              { id: "HIDE", label: "Ẩn" },
            ]}
            value={mode}
            onChange={setMode}
          />
          {mode === "HIDE" ? (
            <div className="empty">
              <p>Nhắm mắt lại, để câu chuyện dẫn đường.</p>
              <button className="btn" onClick={() => setMode("EN")}>
                Hiện transcript
              </button>
            </div>
          ) : (
            <div className="transcript-scroll" ref={transcriptRef}>
              {content.segments.map((segment) => (
                <div
                  ref={(el) => {
                    segmentRefs.current[segment.id] = el;
                  }}
                  key={segment.id}
                  className={`transcript-segment ${sync.active?.id === segment.id ? "active-segment" : ""}`}
                >
                  <button
                    className="timestamp"
                    onClick={() => {
                      sync.setLoop(null);
                      sync.seek(segment.startMs / 1000);
                      scrollToSegment(segment.id, true);
                    }}
                  >
                    {formatTime(segment.startMs / 1000)} –{" "}
                    {formatTime(segment.endMs / 1000)}
                  </button>
                  {mode !== "VI" && (
                    <p>
                      <WordTools
                        text={segment.englishText}
                        translation={segment.vietnameseText}
                        content={content}
                        onLookup={() => sync.mediaRef.current?.pause()}
                      />
                    </p>
                  )}
                  {(mode === "BOTH" ||
                    mode === "VI" ||
                    translated.includes(segment.id)) && (
                    <p className="translation">{segment.vietnameseText}</p>
                  )}
                  <div className="segment-actions">
                    <button
                      onClick={() => {
                        sync.setLoop(segment);
                        sync.seek(segment.startMs / 1000);
                        sync.mediaRef.current
                          ?.play()
                          .catch(() => notify("Không thể phát tệp."));
                        scrollToSegment(segment.id, true);
                      }}
                    >
                      ↻ Nghe lại câu
                    </button>
                    <button
                      onClick={() =>
                        updatePersonal((p) => ({
                          ...p,
                          sentences: p.sentences.some(
                            (s) =>
                              s.contentId === content.id &&
                              s.segmentId === segment.id,
                          )
                            ? p.sentences.filter(
                                (s) =>
                                  !(
                                    s.contentId === content.id &&
                                    s.segmentId === segment.id
                                  ),
                              )
                            : [
                                ...p.sentences,
                                {
                                  contentId: content.id,
                                  segmentId: segment.id,
                                },
                              ],
                        }))
                      }
                    >
                      {data.sentences.some(
                        (s) =>
                          s.contentId === content.id &&
                          s.segmentId === segment.id,
                      )
                        ? "✓ Đã lưu"
                        : "＋ Lưu câu"}
                    </button>
                    <button
                      onClick={() =>
                        setTranslated((s) =>
                          s.includes(segment.id)
                            ? s.filter((x) => x !== segment.id)
                            : [...s, segment.id],
                        )
                      }
                    >
                      Dịch nghĩa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
