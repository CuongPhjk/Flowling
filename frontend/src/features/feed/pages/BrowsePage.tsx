import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Headphones, SlidersHorizontal } from "lucide-react";
import { useDemo } from "../../../app/providers";
import { topics } from "../../../shared/mock/seed";
import {
  ContentCard,
  PageHeading,
  SearchBox,
  Tabs,
  typeTabs,
  Empty,
  contentPath,
  Cover,
  Modal,
} from "../../../shared/components/ui";
import { ReviewSession } from "../../flashcard/pages/ReviewPage";
export function BrowsePage({
  mode = "home",
}: {
  mode?: "home" | "explore" | "saved";
}) {
  const { state, data, account, updatePersonal } = useDemo();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [difficulty, setDifficulty] = useState("ALL");
  const [duration, setDuration] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [limit, setLimit] = useState(9);
  const [quick, setQuick] = useState(false);
  const [eligible, setEligible] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<string>());
  const topic = params.get("topic") || "";
  const due = account ? data.words.filter((w) => w.nextReviewAt <= Date.now()).length : 0;
  const items = useMemo(
    () =>
      state.contents
        .filter(
          (c) =>
            c.status === "PUBLISHED" &&
            (mode !== "saved" || (data?.saved || []).includes(c.id)) &&
            (!topic || c.category === topic) &&
            (type === "ALL" || c.type === type) &&
            (difficulty === "ALL" || c.difficulty === difficulty) &&
            (duration === "ALL" ||
              (duration === "short"
                ? c.duration < 300
                : duration === "medium"
                  ? c.duration >= 300 && c.duration <= 600
                  : c.duration > 600)) &&
            `${c.title} ${c.teaser} ${topics.find((t) => t.id === c.category)?.label}`
              .toLowerCase()
              .includes(query.toLowerCase().trim()),
        )
        .sort((a, b) =>
          sort === "popular"
            ? b.likes - a.likes
            : sort === "short"
              ? a.duration - b.duration
              : mode === "saved"
                ? data.saved.indexOf(a.id) - data.saved.indexOf(b.id)
                : b.publishedAt - a.publishedAt,
        ),
    [
      state.contents,
      data.saved,
      mode,
      topic,
      type,
      difficulty,
      duration,
      query,
      sort,
    ],
  );
  useEffect(() => setLimit(9), [query, type, difficulty, duration, topic]);
  useEffect(() => {
    if (mode !== "home") return;
    const timer = setTimeout(() => setEligible(true), 600000);
    return () => clearTimeout(timer);
  }, [mode]);
  useEffect(() => {
    if (mode !== "home") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            seen.current.add((e.target as HTMLElement).dataset.contentId!);
        });
        if (seen.current.size >= 8) setEligible(true);
      },
      { threshold: 0.5 },
    );
    feedRef.current
      ?.querySelectorAll("[data-content-id]")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items, limit, mode]);
  const progress = [...data.progress]
    .filter(
      (p) =>
        p.percent > 0 &&
        p.percent < 100 &&
        Date.now() - p.updatedAt < 7 * 86400000,
    )
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .find((p) =>
      state.contents.some(
        (c) => c.id === p.contentId && c.status === "PUBLISHED",
      ),
    );
  const continuing = state.contents.find((c) => c.id === progress?.contentId);
  return (
    <>
      <PageHeading
        eyebrow={
          mode === "home"
            ? "YOUR DAILY DOSE OF DISCOVERY"
            : mode === "explore"
              ? "FOLLOW YOUR CURIOSITY"
              : "YOUR PERSONAL COLLECTION"
        }
        title={
          mode === "home"
            ? account
              ? `Chào ${data.profile.name.split(" ")[0]}, hôm nay có gì hay?`
              : "Hôm nay có gì hay?"
            : mode === "explore"
              ? "Thế giới còn nhiều điều thú vị."
              : "Những điều bạn muốn quay lại."
        }
        description={
          mode === "home"
            ? "Đọc một câu chuyện. Nghe một góc nhìn. Khám phá điều mới."
            : mode === "explore"
              ? "Bắt đầu từ điều bạn thích, để sự tò mò dẫn đường."
              : `${(data?.saved || []).filter((id) => state.contents.some((c) => c.id === id && c.status === "PUBLISHED")).length} nội dung được dành riêng cho những lúc rảnh rỗi.`
        }
      />
      <SearchBox value={query} onChange={setQuery} />
      {mode === "home" && account && continuing && progress && !query && (
        <Link className="continue-hero" to={contentPath(continuing)}>
          <Cover src={continuing.thumbnail} alt="" />
          <div>
            <span className="eyebrow">
              <Headphones size={14} /> CÂU CHUYỆN CÒN DỞ
            </span>
            <h2>{continuing.title}</h2>
            <p>Quay lại nơi bạn đã dừng · {Math.round(progress.percent)}%</p>
            <progress max={100} value={progress.percent} />
            <span className="btn white">
              Tiếp tục{" "}
              {continuing.type === "ARTICLE"
                ? "đọc"
                : continuing.type === "VIDEO"
                  ? "xem"
                  : "nghe"}{" "}
              <ArrowRight size={17} />
            </span>
          </div>
          <span className="hero-quote">
            “Curiosity takes
            <br />
            you further.”
          </span>
        </Link>
      )}
      {mode === "explore" && (
        <>
          <div className="row suggestions">
            <span className="small muted">Thử tìm:</span>
            {["ocean", "habits", "Mars", "perspective"].map((q) => (
              <button key={q} onClick={() => setQuery(q)}>
                {q} ↗
              </button>
            ))}
          </div>
          <div className="topic-grid">
            {topics.map((t) => (
              <button
                key={t.id}
                aria-pressed={topic === t.id}
                className={`topic-card cat-${t.id} ${topic === t.id ? "selected" : ""}`}
                onClick={() => setParams(topic === t.id ? {} : { topic: t.id })}
              >
                <span>{t.icon}</span>
                <strong>{t.label}</strong>
                <small>
                  {
                    state.contents.filter(
                      (c) => c.category === t.id && c.status === "PUBLISHED",
                    ).length
                  }{" "}
                  nội dung
                </small>
              </button>
            ))}
          </div>
        </>
      )}
      <div className="section-heading">
        <h2>
          {mode === "saved"
            ? "Bộ sưu tập của bạn"
            : mode === "explore"
              ? "Dành cho trí tò mò của bạn"
              : "Dành cho bạn"}{" "}
          <span className="muted small">{items.length}</span>
        </h2>
        <SlidersHorizontal size={18} />
      </div>
      <div className="filter-bar">
        <Tabs items={typeTabs} value={type} onChange={setType} />
        <select
          aria-label="Sắp xếp"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">
            {mode === "saved" ? "Mới lưu gần đây" : "Mới nhất"}
          </option>
          <option value="popular">Phổ biến</option>
          <option value="short">Thời lượng ngắn trước</option>
        </select>
      </div>
      {mode === "explore" && (
        <div className="filter-bar">
          <select
            aria-label="Độ khó"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="ALL">Mọi độ khó</option>
            {["Easy", "Intermediate", "Advanced"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label="Thời lượng"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="ALL">Mọi thời lượng</option>
            <option value="short">Dưới 5 phút</option>
            <option value="medium">5 – 10 phút</option>
            <option value="long">Trên 10 phút</option>
          </select>
          <button
            className="text-button"
            onClick={() => {
              setParams({});
              setQuery("");
              setType("ALL");
              setDifficulty("ALL");
              setDuration("ALL");
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
      <div className="content-grid" ref={feedRef}>
        {items.slice(0, limit).map((c) => (
          <div data-content-id={c.id} key={c.id}>
            <ContentCard content={c} />
          </div>
        ))}
      </div>
      {!items.length && (
        <Empty
          title={
            mode === "saved"
              ? "Chưa có nội dung đã lưu phù hợp"
              : "Chưa tìm thấy câu chuyện phù hợp"
          }
        />
      )}
      {mode === "home" &&
        account &&
        eligible &&
        due >= 3 &&
        Date.now() > data.snoozeUntil && (
          <div className="nudge">
            <div>
              <h3>Một chút dừng lại, để nhớ lâu hơn.</h3>
              <p>{Math.min(5, due)} từ quen đang chờ bạn gặp lại.</p>
            </div>
            <button className="btn primary" onClick={() => setQuick(true)}>
              Ôn trong 2 phút →
            </button>
            <button
              className="text-button"
              onClick={() =>
                updatePersonal((p) => ({
                  ...p,
                  snoozeUntil: Date.now() + 1800000,
                }))
              }
            >
              Để sau
            </button>
          </div>
        )}
      {items.length > limit && (
        <div className="center">
          <button className="btn" onClick={() => setLimit((n) => n + 9)}>
            Thêm những câu chuyện mới
          </button>
        </div>
      )}
      {quick && (
        <Modal title="Một chút ôn nhanh" onClose={() => setQuick(false)}>
          <ReviewSession limit={5} onDone={() => setQuick(false)} />
        </Modal>
      )}
    </>
  );
}
