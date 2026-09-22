import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useDemo } from "../../../app/providers";
import {
  PageHeading,
  SearchBox,
  Tabs,
  Speak,
  Empty,
  Modal,
  contentPath,
} from "../../../shared/components/ui";
import { ContextDrawer } from "../components/WordTools";
import { vocabularyApi } from "../../../shared/api";

export function VocabularyPage() {
  const { state, data, saveWord, updatePersonal } = useDemo();
  const [q, setQ] = useState(""),
    [filter, setFilter] = useState("ALL"),
    [sort, setSort] = useState("new"),
    [drawer, setDrawer] = useState(""),
    [remove, setRemove] = useState(""),
    [tab, setTab] = useState("words");

  useEffect(() => {
    const token = localStorage.getItem("flowling_jwt_token");
    if (!token) return;
    vocabularyApi
      .getWordBank({ size: 100 })
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          res.items.forEach((item) => {
            saveWord(
              {
                id: `v-${item.vocabularyId}`,
                word: item.term,
                meaning: item.meaningVi,
                ipa: item.phonetic || "",
                pos: item.partOfSpeech || "word",
              },
              {
                contentId: item.contexts[0]?.contentId
                  ? String(item.contexts[0].contentId)
                  : "cloud-sync",
                sentence: item.contexts[0]?.sentence || item.term,
                translation: item.contexts[0]?.translation || item.meaningVi,
                note: "",
              },
            );
          });
        }
      })
      .catch((err) => {
        console.warn("Lỗi tải sổ từ vựng từ server:", err);
      });
  }, []);

  const handleDeleteWord = async (wordId: string) => {
    const numId = Number(wordId);
    if (!isNaN(numId)) {
      try {
        await vocabularyApi.deleteWord(numId);
      } catch (err) {
        console.warn("Lỗi xóa từ vựng trên server:", err);
      }
    }
    updatePersonal((p) => ({
      ...p,
      words: p.words.filter((w) => w.id !== wordId),
      contexts: p.contexts.filter((c) => c.userVocabularyId !== wordId),
    }));
    setRemove("");
  };

  const list = data.words
    .filter((w) => {
      const v = state.vocabulary.find((x) => x.id === w.vocabularyId);
      return (
        v &&
        (filter === "ALL" || w.status === filter) &&
        `${v.word} ${v.meaning} ${data.contexts
          .filter((c) => c.userVocabularyId === w.id)
          .map((c) => c.sentence)
          .join(" ")}`
          .toLowerCase()
          .includes(q.toLowerCase())
      );
    })
    .sort((a, b) =>
      sort === "due"
        ? a.nextReviewAt - b.nextReviewAt
        : sort === "seen"
          ? data.contexts.filter((c) => c.userVocabularyId === b.id).length -
            data.contexts.filter((c) => c.userVocabularyId === a.id).length
          : b.createdAt - a.createdAt,
    );
  return (
    <>
      <PageHeading
        eyebrow="WORDS WITH A STORY"
        title="Sổ từ của bạn."
        description={`${data.words.length} từ đã lưu · ${data.words.filter((w) => w.status === "MASTERED").length} từ đã thuộc. Mỗi từ là một câu chuyện.`}
        action={
          <Link className="btn primary" to="/review">
            Ôn tập →
          </Link>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "words", label: "Từ & cụm từ" },
          { id: "sentences", label: "Câu tâm đắc" },
        ]}
      />
      {tab === "sentences" ? (
        <div className="stack">
          {data.sentences.map((s) => {
            const c = state.contents.find((c) => c.id === s.contentId);
            const segment = c?.segments.find((x) => x.id === s.segmentId);
            return c && segment ? (
              <article className="panel" key={`${s.contentId}-${s.segmentId}`}>
                <blockquote>{segment.englishText}</blockquote>
                <p className="muted">{segment.vietnameseText}</p>
                <div className="actions">
                  <Link
                    to={`${contentPath(c)}?t=${segment.startMs / 1000}`}
                    className="btn"
                  >
                    Nghe lại · {c.title}
                  </Link>
                  <button
                    className="icon-btn"
                    aria-label="Gỡ câu đã lưu"
                    onClick={() =>
                      updatePersonal((p) => ({
                        ...p,
                        sentences: p.sentences.filter((x) => x !== s),
                      }))
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ) : null;
          })}
          {!data.sentences.length && (
            <Empty title="Những câu đáng nhớ sẽ ở đây" />
          )}
        </div>
      ) : (
        <>
          <SearchBox
            value={q}
            onChange={setQ}
            placeholder="Tìm từ, nghĩa hoặc ngữ cảnh…"
          />
          <div className="filter-bar">
            <Tabs
              items={[
                { id: "ALL", label: "Tất cả" },
                { id: "LEARNING", label: "Đang học" },
                { id: "MASTERED", label: "Đã thuộc" },
              ]}
              value={filter}
              onChange={setFilter}
            />
            <select
              aria-label="Sắp xếp từ"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="new">Mới lưu gần đây</option>
              <option value="seen">Gặp nhiều nhất</option>
              <option value="due">Đến hạn ôn tập</option>
            </select>
          </div>
          <div className="vocab-grid">
            {list.map((w) => {
              const v = state.vocabulary.find((x) => x.id === w.vocabularyId)!;
              const contexts = data.contexts.filter(
                (c) => c.userVocabularyId === w.id,
              );
              return (
                <article className="panel word-card" key={w.id}>
                  <div className="row spread">
                    <button
                      className="word-title"
                      onClick={() => setDrawer(w.id)}
                    >
                      {v.word}
                    </button>
                    <Speak text={v.word} />
                  </div>
                  <p className="muted small">
                    {v.pos} · {v.ipa}
                  </p>
                  <p>{v.meaning}</p>
                  <blockquote>
                    {contexts[contexts.length - 1]?.sentence ||
                      "Thêm ngữ cảnh khi bạn gặp lại từ này."}
                  </blockquote>
                  <div className="row spread">
                    <button
                      className="tag green"
                      onClick={() => setDrawer(w.id)}
                    >
                      Đã gặp {contexts.length} lần ↗
                    </button>
                    <button
                      className="icon-btn"
                      aria-label={`Xóa từ ${v.word}`}
                      onClick={() => setRemove(w.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <small className="muted">
                    {w.status === "MASTERED"
                      ? "Đã thuộc"
                      : w.nextReviewAt <= Date.now()
                        ? "Đến hạn hôm nay"
                        : `Ôn tiếp ${new Date(w.nextReviewAt).toLocaleDateString("vi-VN")}`}
                  </small>
                </article>
              );
            })}
          </div>
          {!list.length && <Empty title="Chưa có từ phù hợp" />}
        </>
      )}
      {drawer && (
        <ContextDrawer wordId={drawer} onClose={() => setDrawer("")} />
      )}
      {remove && (
        <Modal
          title="Xóa từ và các ngữ cảnh đã lưu?"
          onClose={() => setRemove("")}
        >
          <p>Bạn có thể lưu lại từ này khi gặp trên feed.</p>
          <div className="actions">
            <button className="btn" onClick={() => setRemove("")}>
              Hủy
            </button>
            <button
              className="btn danger"
              onClick={() => handleDeleteWord(remove)}
            >
              Xóa từ
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
