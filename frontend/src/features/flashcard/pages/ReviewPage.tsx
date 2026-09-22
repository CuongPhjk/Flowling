import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, CheckCircle2 } from "lucide-react";
import { useDemo } from "../../../app/providers";
import type { Grade } from "../../../shared/types/demo";
import { PageHeading, Speak, Empty } from "../../../shared/components/ui";
import { schedule } from "../services/srs";
import { reviewApi } from "../../../shared/api";
export function ReviewSession({
  limit = 12,
  onDone,
}: {
  limit?: number;
  onDone: () => void;
}) {
  const { state, data, grade } = useDemo();
  const [queue, setQueue] = useState(() =>
    data.words
      .filter((w) => w.nextReviewAt <= Date.now())
      .slice(0, limit)
      .map((w) => w.id),
  );
  const initial = useRef(queue.length);
  const [index, setIndex] = useState(0),
    [flipped, setFlipped] = useState(false),
    [expired, setExpired] = useState(false);
  const reviewed = useRef(new Set<string>());
  const [count, setCount] = useState(0);
  const lock = useRef(false);
  const word = data.words.find((w) => w.id === queue[index]);
  const entry = state.vocabulary.find((v) => v.id === word?.vocabularyId);
  const context = data.contexts.find((c) => c.userVocabularyId === word?.id);
  const done = index >= queue.length || expired;
  useEffect(() => {
    const timer = setTimeout(
      () => setExpired(true),
      limit === 5 ? 120000 : 300000,
    );
    return () => clearTimeout(timer);
  }, [limit]);
  const rate = (value: Grade) => {
    if (!word || !flipped || lock.current || done) return;
    lock.current = true;
    const first = !reviewed.current.has(word.id);
    grade(word.id, value, first);
    const numId = Number(word.id);
    if (!isNaN(numId)) {
      reviewApi.submitReview(numId, value).catch(() => {});
    }
    reviewed.current.add(word.id);
    setCount(reviewed.current.size);
    if (value === "AGAIN" && queue.length < Math.min(20, initial.current * 2))
      setQueue((q) => [...q, word.id]);
    setIndex((i) => i + 1);
    setFlipped(false);
    setTimeout(() => {
      lock.current = false;
    }, 200);
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).closest("button,input,textarea,select") ||
        done
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((v) => !v);
      }
      const value = (
        { 1: "AGAIN", 2: "HARD", 3: "GOOD", 4: "EASY" } as Record<string, Grade>
      )[e.key];
      if (value) rate(value);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  if (!initial.current)
    return (
      <Empty
        title="Bạn đã gặp lại tất cả từ đến hạn"
        description="Một câu chuyện mới đang chờ bạn ngoài kia."
        action={
          <button className="btn primary" onClick={onDone}>
            Quay lại Feed →
          </button>
        }
      />
    );
  if (done)
    return (
      <div className="review-complete">
        <CheckCircle2 size={58} />
        <span className="eyebrow">A LITTLE PROGRESS, EVERY DAY</span>
        <h2>
          {expired ? "Một khoảng nghỉ vừa đủ." : "Tuyệt vời, bạn đã xong!"}
        </h2>
        <p>
          {count} từ đã được ôn · +{count * 2} XP
        </p>
        <p className="muted">Giờ thì tiếp tục với những điều bạn thích.</p>
        <button className="btn primary" onClick={onDone}>
          Quay lại Feed lướt tiếp →
        </button>
      </div>
    );
  if (!entry || !word)
    return (
      <Empty
        title="Từ này không còn trong sổ"
        action={
          <button className="btn" onClick={onDone}>
            Quay lại
          </button>
        }
      />
    );
  const sentence = context?.sentence || entry.word;
  const escaped = entry.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    <div className="review-session">
      <div className="row spread">
        <span className="muted small">
          Thẻ {index + 1} / {queue.length}
        </span>
        <span className="tag green">
          {limit === 5 ? "2" : "3–5"} phút cho bạn
        </span>
      </div>
      <progress max={queue.length} value={index} />
      <div className="row spread">
        <span className="eyebrow">MỘT TỪ, MỘT CÂU CHUYỆN</span>
        <Speak text={entry.word} />
      </div>
      <button
        className={`flashcard ${flipped ? "flipped" : ""}`}
        aria-label={flipped ? "Lật về mặt trước" : "Lật thẻ xem nghĩa"}
        onClick={() => setFlipped((v) => !v)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face" aria-hidden={flipped}>
            <h2>{entry.word}</h2>
            <p className="muted">{entry.ipa}</p>
            <blockquote>
              {sentence.replace(new RegExp(escaped, "gi"), "[…]")}
            </blockquote>
            <small>Chạm hoặc nhấn Space để lật thẻ</small>
          </div>
          <div className="flashcard-face flashcard-back" aria-hidden={!flipped}>
            <h2>{entry.word}</h2>
            <h3 className="green">{entry.meaning}</h3>
            <blockquote>{sentence}</blockquote>
            <small>
              {state.contents.find((c) => c.id === context?.contentId)?.title}
            </small>
          </div>
        </div>
      </button>
      <div className="grade-grid">
        {(["AGAIN", "HARD", "GOOD", "EASY"] as Grade[]).map((value, i) => (
          <button
            key={value}
            disabled={!flipped}
            className={`grade grade-${value.toLowerCase()}`}
            onClick={() => rate(value)}
          >
            <strong>{["Quên", "Khó", "Tốt", "Dễ"][i]}</strong>
            <small>
              {schedule(word, value).interval} ngày · {i + 1}
            </small>
          </button>
        ))}
      </div>
      <p className="small muted center">
        Lật thẻ để đối chiếu trước khi đánh giá.
      </p>
    </div>
  );
}
export function ReviewPage() {
  const { data } = useDemo();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const due = data.words.filter((w) => w.nextReviewAt <= Date.now()).length;
  return (
    <>
      <PageHeading
        eyebrow="A FAMILIAR WORD, A FRESH MEMORY"
        title="Gặp lại những từ quen."
        description="Chỉ vài phút, rồi quay lại những câu chuyện bạn yêu thích."
        action={
          <Link className="btn" to="/vocabulary">
            Mở sổ từ →
          </Link>
        }
      />
      {started ? (
        <ReviewSession onDone={() => navigate("/")} />
      ) : (
        <div className="review-intro panel">
          <Brain size={48} />
          <span className="tag green">NHẸ NHÀNG MỖI NGÀY</span>
          <h2>
            {due ? `${due} từ đang chờ bạn` : "Bạn đã sẵn sàng cho điều mới"}
          </h2>
          <p>
            Mỗi từ đều gắn với câu chuyện bạn từng đọc.
            <br />
            Gặp lại một chút để nhớ lâu hơn.
          </p>
          <div className="row center">
            <span>◷ 3–5 phút</span>
            <span>✦ Tối đa 12 từ mới trong phiên</span>
          </div>
          {due ? (
            <button className="btn primary" onClick={() => setStarted(true)}>
              Bắt đầu ôn tập →
            </button>
          ) : (
            <Link className="btn primary" to="/">
              Khám phá Feed →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
