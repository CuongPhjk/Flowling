import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDemo, uid } from "../../../app/providers";
import type { Content, Vocabulary } from "../../../shared/types/demo";
import { Modal, Speak, contentPath } from "../../../shared/components/ui";
import { InlineMarkdown } from "../../../shared/components/Markdown";
export function ContextDrawer({
  wordId,
  onClose,
}: {
  wordId: string;
  onClose: () => void;
}) {
  const { state, data, updatePersonal } = useDemo();
  const uv = data.words.find((w) => w.id === wordId);
  const word = state.vocabulary.find((w) => w.id === uv?.vocabularyId);
  if (!word || !uv) return null;
  const contexts = data.contexts
    .filter((c) => c.userVocabularyId === uv.id)
    .sort((a, b) => b.createdAt - a.createdAt);
  return (
    <Modal drawer title={word.word} onClose={onClose}>
      <div className="row">
        <p className="muted">
          {word.pos} · {word.ipa}
        </p>
        <Speak text={word.word} />
      </div>
      <h3>{word.meaning}</h3>
      <p className="tag green">
        ✓ {uv.status === "MASTERED" ? "Đã thuộc" : "Đang học"} · Bạn đã gặp từ
        này {contexts.length} lần
      </p>
      <div className="context-list">
        {contexts.map((c, i) => {
          const source = state.contents.find((x) => x.id === c.contentId);
          return (
            <article key={c.id}>
              <span className="context-number">{i + 1}</span>
              <blockquote>{c.sentence}</blockquote>
              <p className="muted">{c.translation}</p>
              {source ? (
                <Link
                  className="green small"
                  onClick={onClose}
                  to={`${contentPath(source)}${c.startMs !== undefined ? `?t=${c.startMs / 1000}` : ""}`}
                >
                  {source.title} ↗
                </Link>
              ) : (
                <span className="muted small">Nội dung nguồn đã được xóa</span>
              )}
              <label className="field">
                Ghi chú của bạn
                <textarea
                  value={c.note}
                  onChange={(e) =>
                    updatePersonal((p) => ({
                      ...p,
                      contexts: p.contexts.map((x) =>
                        x.id === c.id ? { ...x, note: e.target.value } : x,
                      ),
                    }))
                  }
                  placeholder="Điều khiến bạn nhớ từ này…"
                />
              </label>
            </article>
          );
        })}
      </div>
      <p className="small muted">
        Lần ôn tiếp: {new Date(uv.nextReviewAt).toLocaleDateString("vi-VN")}
      </p>
    </Modal>
  );
}
export function WordTools({
  text,
  translation,
  content,
  onLookup,
}: {
  text: string;
  translation: string;
  content: Content;
  onLookup?: () => void;
}) {
  const { state, data, saveWord, notify } = useDemo();
  const [selected, setSelected] = useState("");
  const [meaning, setMeaning] = useState("");
  const [note, setNote] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [drawer, setDrawer] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const segment = content.segments.find((s) => s.englishText === text);
  const timing =
    segment && content.type !== "ARTICLE"
      ? { startMs: segment.startMs, endMs: segment.endMs }
      : {};
  const entry = state.vocabulary.find(
    (v) => v.word.toLowerCase() === selected.toLowerCase(),
  );
  const uv = data.words.find((w) => w.vocabularyId === entry?.id);
  const wordsInText = state.vocabulary.filter(
    (v) =>
      data.words.some((w) => w.vocabularyId === v.id) &&
      new RegExp(
        `\\b${v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i",
      ).test(text),
  );
  const encountered = useRef("");
  useEffect(() => {
    const signature =
      wordsInText.map((w) => w.id).join(",") + content.id + text;
    if (signature === encountered.current) return;
    encountered.current = signature;
    wordsInText.forEach((word) =>
      saveWord(word, {
        contentId: content.id,
        sentence: text,
        translation,
        note: "",
        ...timing,
      }),
    );
  }, [wordsInText.map((w) => w.id).join(","), content.id, text]);
  const choose = (word: string) => {
    const value = word
      .trim()
      .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
      .slice(0, 150);
    if (!value) return;
    setSelected(value.toLowerCase());
    setNote("");
    setMeaning("");
    setShowTranslation(false);
    onLookup?.();
  };
  return (
    <>
      <span
        ref={ref}
        className="interactive-text"
        onMouseUp={() => {
          const selection = window.getSelection();
          const value = selection?.toString().trim();
          if (
            value &&
            value.split(/\s+/).length > 1 &&
            ref.current?.contains(selection?.anchorNode || null)
          )
            choose(value);
        }}
      >
        <InlineMarkdown
          text={text}
          render={(part) =>
            part.split(/([\p{L}\p{N}]+(?:['’-][\p{L}]+)*)/u).map((token, i) =>
              /^[\p{L}\p{N}]/u.test(token) ? (
                <span
                  key={i}
                  role="button"
                  tabIndex={0}
                  className={
                    wordsInText.some(
                      (w) => w.word.toLowerCase() === token.toLowerCase(),
                    )
                      ? "known-word"
                      : ""
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") choose(token);
                  }}
                  onClick={() => {
                    if (!window.getSelection()?.toString().trim())
                      choose(token);
                  }}
                >
                  {token}
                </span>
              ) : (
                token
              ),
            )
          }
        />
      </span>
      {selected && (
        <Modal title={selected} onClose={() => setSelected("")}>
          <div className="row spread">
            <span className="muted">
              {entry
                ? `${entry.pos} · ${entry.ipa}`
                : selected.includes(" ")
                  ? "phrase"
                  : "Từ mới"}
            </span>
            <Speak text={selected} />
          </div>
          {entry ? (
            <h3>{entry.meaning}</h3>
          ) : (
            <label className="field">
              Nghĩa bạn muốn ghi nhớ
              <input
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Nhập nghĩa tiếng Việt"
              />
              <small>
                Bộ từ điển mẫu chưa có mục này. Bản dịch câu bên dưới giúp bạn
                đối chiếu.
              </small>
            </label>
          )}
          <blockquote>{text}</blockquote>
          <button
            className="text-button green"
            onClick={() => setShowTranslation((x) => !x)}
          >
            Dịch câu {showTranslation ? "↑" : "↓"}
          </button>
          {showTranslation && (
            <p className="translation">
              {translation || "Nội dung này chưa có bản dịch."}
            </p>
          )}
          <label className="field">
            Ghi chú
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thêm cách hiểu của bạn…"
            />
          </label>
          {uv ? (
            <button
              className="btn primary"
              onClick={() => {
                if (entry && note.trim())
                  saveWord(entry, {
                    contentId: content.id,
                    sentence: text,
                    translation,
                    note,
                    ...timing,
                  });
                setDrawer(uv.id);
                setSelected("");
              }}
            >
              ✓ {uv.status === "MASTERED" ? "Đã thuộc" : "Đang học"} · Đã gặp{" "}
              {data.contexts.filter((c) => c.userVocabularyId === uv.id).length}{" "}
              lần →
            </button>
          ) : (
            <button
              className="btn primary"
              disabled={!entry && !meaning.trim()}
              onClick={() => {
                const value: Vocabulary = entry || {
                  id: uid(),
                  word: selected,
                  meaning: meaning.trim(),
                  ipa: "",
                  pos: selected.includes(" ") ? "phrase" : "word",
                };
                saveWord(value, {
                  contentId: content.id,
                  sentence: text,
                  translation,
                  note,
                  ...timing,
                });
                notify("Đã lưu vào sổ từ cùng ngữ cảnh");
                setSelected("");
              }}
            >
              + {selected.includes(" ") ? "Lưu cụm từ" : "Lưu vào sổ từ"}
            </button>
          )}
        </Modal>
      )}
      {drawer && (
        <ContextDrawer wordId={drawer} onClose={() => setDrawer("")} />
      )}
    </>
  );
}
