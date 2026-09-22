import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDemo, uid } from "../../../app/providers";
import { adminApi } from "../../../shared/api";
import type { Segment } from "../../../shared/types/demo";
import { PageHeading, Empty, formatTime } from "../../../shared/components/ui";
import { importTranscript, validateSegments, translateSegments } from "../services/transcript";
import { MediaPreview } from "../components/MediaPreview";
import { stories } from "../../../shared/mock/seed";
export function TranscriptEditorPage() {
  const { id } = useParams();
  const { state, saveContent, notify } = useDemo();
  const content = state.contents.find(
    (c) => c.id === id && c.type !== "ARTICLE",
  );
  const navigate = useNavigate();
  const [rows, setRows] = useState<Segment[]>(content?.segments || []),
    [time, setTime] = useState(0),
    [seek, setSeek] = useState<number>(),
    [error, setError] = useState(""),
    [duration, setDuration] = useState(content?.duration || 0),
    [translating, setTranslating] = useState(false),
    [translateProgress, setTranslateProgress] = useState<{
      current: number;
      total: number;
    } | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const add = () =>
    setRows((s) => [
      ...s,
      {
        id: uid(),
        position: s.length,
        startMs: s[s.length - 1]?.endMs || Math.round(time * 1000),
        endMs: (s[s.length - 1]?.endMs || Math.round(time * 1000)) + 5000,
        englishText: "",
        vietnameseText: "",
      },
    ]);
  const split = (index: number, at?: number) =>
    setRows((s) => {
      const old = s[index];
      const splitTime =
        at && at > old.startMs && at < old.endMs
          ? at
          : Math.round((old.startMs + old.endMs) / 2);
      const words = old.englishText.split(" "),
        vi = old.vietnameseText.split(" ");
      const middle = Math.ceil(words.length / 2),
        viMiddle = Math.ceil(vi.length / 2);
      return [
        ...s.slice(0, index),
        {
          ...old,
          endMs: splitTime,
          englishText: words.slice(0, middle).join(" "),
          vietnameseText: vi.slice(0, viMiddle).join(" "),
        },
        {
          ...old,
          id: uid(),
          startMs: splitTime,
          englishText: words.slice(middle).join(" "),
          vietnameseText: vi.slice(viMiddle).join(" "),
        },
        ...s.slice(index + 1),
      ].map((r, i) => ({ ...r, position: i }));
    });
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        const i = rows.findIndex(
          (s) => s.startMs < time * 1000 && time * 1000 < s.endMs,
        );
        if (i >= 0) split(i, Math.round(time * 1000));
        else add();
      }
      if (
        e.code === "Space" &&
        !(e.target as HTMLElement).closest("input,textarea,button,select")
      ) {
        e.preventDefault();
        const media = container.current?.querySelector(
          "audio,video",
        ) as HTMLMediaElement;
        if (media)
          media.paused ? void media.play().catch(() => {}) : media.pause();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  if (!content) return <Empty title="Không tìm thấy media" />;
  const update = (index: number, patch: Partial<Segment>) =>
    setRows((s) => s.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  const save = (publish: boolean) => {
    if (publish && (!content.mediaUrl || !duration)) {
      setError("Thêm media phát được trước khi xuất bản.");
      return;
    }
    const error = validateSegments(rows, duration, publish);
    if (error) {
      setError(error);
      return;
    }
    const numId = Number(id);
    if (!isNaN(numId)) {
      adminApi
        .updateTranscripts(
          numId,
          rows.map((r, i) => ({
            startMs: r.startMs,
            endMs: r.endMs,
            englishText: r.englishText,
            vietnameseText: r.vietnameseText,
            position: i,
          })),
        )
        .catch((err) => console.warn("Lỗi lưu transcripts lên server:", err));
    }
    saveContent({
      ...content,
      duration,
      segments: rows.map((r, i) => ({ ...r, position: i })),
      status: publish ? "PUBLISHED" : "DRAFT",
      publishedAt: publish ? Date.now() : content.publishedAt,
    });
    notify(
      publish ? "Đã xuất bản nội dung và transcript" : "Đã lưu transcript",
    );
    navigate("/admin");
  };
  return (
    <div ref={container}>
      <Link className="subtle-link" to={`/admin/media/${id}`}>
        ← Thiết lập media
      </Link>
      <PageHeading
        eyebrow="TRANSCRIPT STUDIO"
        title="Từng câu, đúng khoảnh khắc."
        description={content.title}
      />
      <div className="transcript-editor-player panel">
        <MediaPreview
          source={content.mediaUrl}
          video={content.type === "VIDEO"}
          onTime={setTime}
          onDuration={setDuration}
          seekTo={seek}
        />
        <div className="row spread">
          <span className="tag green">
            {formatTime(time)} / {formatTime(duration)}
          </span>
          <small className="muted">
            Space: phát/dừng · Ctrl Enter: cắt tại vị trí phát
          </small>
        </div>
      </div>
      <div className="filter-bar">
        <label className="btn">
          Nhập SRT / VTT / LRC
          <input
            type="file"
            className="sr-only"
            accept=".srt,.vtt,.lrc"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const parsed = importTranscript(await file.text());
                setRows(parsed);
                setError("");
                notify(
                  `Đã nhập ${parsed.length} phân đoạn. Đang tự động dịch sang tiếng Việt...`,
                );
                setTranslating(true);
                setTranslateProgress({ current: 0, total: parsed.length });

                try {
                  const translated = await translateSegments(
                    parsed,
                    (current, total) => {
                      setTranslateProgress({ current, total });
                    },
                  );
                  setRows(translated);
                  notify(
                    `Đã tự động dịch xong ${translated.length} phân đoạn sang tiếng Việt!`,
                  );
                } catch (tErr) {
                  console.warn("Auto translation warning:", tErr);
                  notify("Đã nhập phân đoạn. Vui lòng kiểm tra bản dịch.");
                } finally {
                  setTranslating(false);
                  setTranslateProgress(null);
                }
              } catch (e) {
                setError((e as Error).message);
              }
              e.target.value = "";
            }}
          />
        </label>
        <button
          className="btn"
          disabled={translating || !rows.length}
          onClick={async () => {
            const dictionary = Object.values(stories).flat();
            let matched = 0;
            const withDict = rows.map((r) => {
              const found = dictionary.find((p) => p.en === r.englishText);
              if (found && !r.vietnameseText) {
                matched++;
                return { ...r, vietnameseText: found.vi };
              }
              return r;
            });

            const needsTrans = withDict.filter(
              (r) => !r.vietnameseText?.trim(),
            );
            if (!needsTrans.length) {
              setRows(withDict);
              notify(
                matched
                  ? `Đã điền ${matched} bản dịch mẫu`
                  : "Tất cả các phân đoạn đều đã có bản dịch tiếng Việt.",
              );
              return;
            }

            setTranslating(true);
            setTranslateProgress({ current: 0, total: needsTrans.length });
            notify(
              `Đang tự động dịch ${needsTrans.length} phân đoạn sang tiếng Việt...`,
            );

            try {
              const translated = await translateSegments(
                withDict,
                (current, total) => {
                  setTranslateProgress({ current, total });
                },
              );
              setRows(translated);
              notify("Đã hoàn tất tự động dịch toàn bộ sang tiếng Việt!");
            } catch (err) {
              notify("Không thể hoàn tất dịch tự động.");
            } finally {
              setTranslating(false);
              setTranslateProgress(null);
            }
          }}
        >
          {translating ? "🌱 Đang dịch..." : "🌐 Tự động dịch sang tiếng Việt"}
        </button>
        <button className="btn" onClick={() => setSeek(time === 0 ? 0.001 : 0)}>
          Chạy thử từ đầu
        </button>
      </div>
      {translating && (
        <div
          className="panel row center gap-sm"
          style={{
            background: "var(--color-bg-secondary, #EBF7EE)",
            border: "1px solid var(--color-primary-light, #22C55E33)",
            padding: "10px 16px",
            borderRadius: "8px",
            margin: "12px 0",
            color: "var(--color-primary-dark, #16A34A)",
            fontWeight: 500,
          }}
        >
          <span>
            🌱 Đang tự động dịch sang tiếng Việt...{" "}
            {translateProgress
              ? `(${translateProgress.current}/${translateProgress.total} đoạn)`
              : ""}
          </span>
        </div>
      )}
      <p className="small muted">
        Mốc thời gian tính bằng mili-giây. Sau khi cắt/gộp, kiểm tra lại câu và
        bản dịch trước khi đăng.
      </p>
      <div className="stack">
        {rows.map((row, index) => (
          <section
            className={`panel segment-editor ${row.startMs <= time * 1000 && time * 1000 < row.endMs ? "active-segment" : ""}`}
            key={row.id}
          >
            <div className="row spread wrap">
              <strong>Đoạn {index + 1}</strong>
              <div className="row">
                <label className="small">
                  Bắt đầu (ms)
                  <input
                    aria-label={`Bắt đầu đoạn ${index + 1}`}
                    type="number"
                    min={0}
                    step={1}
                    value={row.startMs}
                    onChange={(e) =>
                      update(index, { startMs: Number(e.target.value) })
                    }
                  />
                </label>
                <span>→</span>
                <label className="small">
                  Kết thúc (ms)
                  <input
                    aria-label={`Kết thúc đoạn ${index + 1}`}
                    type="number"
                    min={1}
                    step={1}
                    value={row.endMs}
                    onChange={(e) =>
                      update(index, { endMs: Number(e.target.value) })
                    }
                  />
                </label>
              </div>
              <div className="row">
                <button
                  className="text-button green"
                  onClick={() =>
                    setSeek(
                      row.startMs / 1000 +
                        (seek === row.startMs / 1000 ? 0.001 : 0),
                    )
                  }
                >
                  ▶ Nghe thử
                </button>
                <button className="text-button" onClick={() => split(index)}>
                  Cắt đôi
                </button>
                <button
                  className="text-button"
                  disabled={index === rows.length - 1}
                  onClick={() =>
                    setRows((s) =>
                      s.flatMap((r, i) =>
                        i === index
                          ? [
                              {
                                ...r,
                                endMs: s[i + 1].endMs,
                                englishText:
                                  r.englishText + " " + s[i + 1].englishText,
                                vietnameseText:
                                  r.vietnameseText +
                                  " " +
                                  s[i + 1].vietnameseText,
                              },
                            ]
                          : i === index + 1
                            ? []
                            : [r],
                      ),
                    )
                  }
                >
                  Gộp tiếp
                </button>
                <button
                  className="text-button danger-text"
                  onClick={() =>
                    setRows((s) => s.filter((r) => r.id !== row.id))
                  }
                >
                  Xóa
                </button>
              </div>
            </div>
            <div className="translation-grid">
              <label className="field">
                English
                <textarea
                  value={row.englishText}
                  onChange={(e) =>
                    update(index, { englishText: e.target.value })
                  }
                />
              </label>
              <label className="field">
                Vietnamese
                <textarea
                  value={row.vietnameseText}
                  onChange={(e) =>
                    update(index, { vietnameseText: e.target.value })
                  }
                />
              </label>
            </div>
          </section>
        ))}
      </div>
      <button className="btn full" onClick={add}>
        + Thêm phân đoạn
      </button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <button className="btn" onClick={() => save(false)}>
          Lưu nháp
        </button>
        <button className="btn primary" onClick={() => save(true)}>
          Lưu & Xuất bản lên Feed →
        </button>
      </div>
    </div>
  );
}
