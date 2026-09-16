import { useState } from "react";
import { Link } from "react-router-dom";
import { useDemo } from "../../../app/providers";
import {
  PageHeading,
  Tabs,
  Empty,
  Cover,
  contentPath,
  typeLabel,
  Modal,
} from "../../../shared/components/ui";
import { dayKey } from "../../../shared/mock/seed";
export function HistoryPage() {
  const { state, data, updatePersonal } = useDemo();
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(false);
  const items = [...data.progress]
    .filter(
      (p) =>
        state.contents.some(
          (c) => c.id === p.contentId && c.status === "PUBLISHED",
        ) &&
        (filter === "all" ||
          (filter === "done" ? p.percent >= 100 : p.percent < 100)),
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);
  const groups = [...new Set(items.map((p) => dayKey(new Date(p.updatedAt))))];
  return (
    <>
      <PageHeading
        eyebrow="PICK UP WHERE YOU LEFT OFF"
        title="Hành trình khám phá của bạn."
        description="Những câu chuyện đã đi qua, những điều còn muốn nghe tiếp."
        action={
          <button
            className="btn"
            disabled={!data.progress.length}
            onClick={() => setConfirm(true)}
          >
            Xóa lịch sử
          </button>
        }
      />
      <Tabs
        items={[
          { id: "all", label: "Tất cả" },
          { id: "progress", label: "Đang dở dang" },
          { id: "done", label: "Đã hoàn thành" },
        ]}
        value={filter}
        onChange={setFilter}
      />
      {groups.map((day) => (
        <section key={day} className="timeline-group">
          <h3>
            {day === dayKey()
              ? "Hôm nay"
              : day === dayKey(new Date(Date.now() - 86400000))
                ? "Hôm qua"
                : new Date(day).toLocaleDateString("vi-VN")}
          </h3>
          {items
            .filter((p) => dayKey(new Date(p.updatedAt)) === day)
            .map((p) => {
              const c = state.contents.find((c) => c.id === p.contentId)!;
              return (
                <article className="history-item panel" key={c.id}>
                  <Link to={contentPath(c)}>
                    <Cover src={c.thumbnail} alt={c.title} />
                  </Link>
                  <div>
                    <span className="eyebrow">{typeLabel[c.type]}</span>
                    <Link to={contentPath(c)}>
                      <h3>{c.title}</h3>
                    </Link>
                    <div className="row">
                      <progress max={100} value={p.percent} />
                      <span className="small green">
                        {p.percent >= 100
                          ? "Hoàn thành ✓"
                          : `${Math.round(p.percent)}%`}
                      </span>
                    </div>
                    <span className="small muted">
                      {data.contexts.filter((x) => x.contentId === c.id).length}{" "}
                      ngữ cảnh đã lưu
                    </span>
                  </div>
                  <Link className="btn" to={contentPath(c)}>
                    {p.percent >= 100 ? "Xem lại" : "Tiếp tục"} →
                  </Link>
                </article>
              );
            })}
        </section>
      ))}
      {!items.length && <Empty title="Một hành trình mới đang chờ" />}
      {confirm && (
        <Modal
          title="Xóa lịch sử xem và nghe?"
          onClose={() => setConfirm(false)}
        >
          <p>
            Lịch sử và vị trí đọc/nghe sẽ được xóa. Bạn có thể bắt đầu lại từ
            feed.
          </p>
          <div className="actions">
            <button className="btn" onClick={() => setConfirm(false)}>
              Hủy
            </button>
            <button
              className="btn danger"
              onClick={() => {
                updatePersonal((p) => ({ ...p, progress: [] }));
                setConfirm(false);
              }}
            >
              Xóa lịch sử
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
