import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Eye,
  Plus,
  FileText,
  Headphones,
  Video,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useDemo } from "../../../app/providers";
import {
  PageHeading,
  SearchBox,
  Tabs,
  typeTabs,
  typeLabel,
  Cover,
  contentPath,
  Modal,
  Empty,
} from "../../../shared/components/ui";
import { topics } from "../../../shared/mock/seed";
import { validateSegments } from "../services/transcript";
import { adminApi, AdminStats, toDemoContent } from "../../../shared/api";
import type { Content } from "../../../shared/types/demo";

export function DashboardPage() {
  const { state, saveContent, deleteContent, notify } = useDemo();
  const [query, setQuery] = useState(""),
    [type, setType] = useState("ALL"),
    [status, setStatus] = useState("ALL"),
    [page, setPage] = useState(0),
    [remove, setRemove] = useState("");

  const [cloudItems, setCloudItems] = useState<Content[] | null>(null);
  const [cloudStats, setCloudStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCloudData = async () => {
    setLoading(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi
          .listContents({
            size: 50,
            status: status === "ALL" ? undefined : status,
            type: type === "ALL" ? undefined : type,
            keyword: query.trim() || undefined,
          })
          .catch(() => null),
      ]);
      if (statsRes) setCloudStats(statsRes);
      if (listRes && listRes.items) {
        setCloudItems(listRes.items.map(toDemoContent));
      }
    } catch (err) {
      console.warn("Lỗi tải dữ liệu từ Cloud, sử dụng dữ liệu cục bộ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudData();
  }, [type, status, query]);

  const handleDelete = async (id: string) => {
    try {
      const numId = Number(id);
      if (!isNaN(numId)) {
        await adminApi.deleteContent(numId);
      }
    } catch (err: any) {
      console.warn("Lỗi khi xóa từ server:", err);
    }
    deleteContent(id);
    setCloudItems((prev) => (prev ? prev.filter((c) => c.id !== id) : null));
    notify("Đã xóa nội dung thành công");
    setRemove("");
    fetchCloudData();
  };

  const handleTogglePublish = async (c: Content) => {
    if (c.status === "DRAFT") {
      const error =
        c.type === "ARTICLE"
          ? !c.title.trim() ||
            !c.paragraphs.length ||
            c.paragraphs.some((p) => !p.en.trim() || !p.vi.trim())
            ? "Bổ sung nội dung và bản dịch trước khi đăng."
            : ""
          : !c.mediaUrl
            ? "Thêm media trước khi đăng."
            : validateSegments(c.segments, c.duration, true);
      if (error) {
        notify(error);
        return;
      }
    }

    const numId = Number(c.id);
    if (!isNaN(numId)) {
      try {
        await adminApi.togglePublish(numId);
      } catch (err: any) {
        console.warn("Lỗi cập nhật trạng thái xuất bản trên server:", err);
      }
    }

    const nextStatus = c.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    saveContent({
      ...c,
      status: nextStatus,
      publishedAt: Date.now(),
    });
    setCloudItems((prev) =>
      prev
        ? prev.map((item) =>
            item.id === c.id ? { ...item, status: nextStatus } : item,
          )
        : null,
    );
    notify(
      nextStatus === "PUBLISHED"
        ? "Đã xuất bản lên Feed"
        : "Đã chuyển về bản nháp",
    );
  };

  const localFiltered = state.contents.filter(
    (c) =>
      (type === "ALL" || c.type === type) &&
      (status === "ALL" || c.status === status) &&
      c.title.toLowerCase().includes(query.toLowerCase()),
  );

  const items = cloudItems !== null ? cloudItems : localFiltered;
  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(items.length / 6) - 1),
  );
  return (
    <>
      <PageHeading
        eyebrow="FLOWLING EDITORIAL STUDIO"
        title="Những câu chuyện bắt đầu từ đây."
        description="Chọn lọc nội dung hay, mang thế giới đến gần hơn."
        action={
          <div className="row" style={{ gap: "8px", flexWrap: "wrap" }}>
            <Link className="btn primary" to="/admin/article/new">
              <Plus size={16} /> Viết bài đọc
            </Link>
            <Link className="btn" to="/admin/media/new?type=PODCAST">
              <Headphones size={16} /> Thêm podcast
            </Link>
            <Link className="btn" to="/admin/media/new?type=VIDEO">
              <Video size={16} /> Thêm video
            </Link>
          </div>
        }
      />
      <div className="stats-grid four">
        {[
          {
            type: "ARTICLE",
            label: "Bài đọc",
            Icon: FileText,
            color: "var(--color-primary)",
            bg: "var(--color-primary-light)",
          },
          {
            type: "PODCAST",
            label: "Podcast",
            Icon: Headphones,
            color: "#0284c7",
            bg: "#e0f2fe",
          },
          {
            type: "VIDEO",
            label: "Video",
            Icon: Video,
            color: "#7c3aed",
            bg: "#f3e8ff",
          },
        ].map(({ type, label, Icon, color, bg }) => {
          const total = cloudStats
            ? type === "ARTICLE"
              ? cloudStats.articlesCount
              : type === "PODCAST"
                ? cloudStats.podcastsCount
                : cloudStats.videosCount
            : items.filter((c) => c.type === type).length;
          const drafts = items.filter(
            (c) => c.type === type && c.status === "DRAFT",
          ).length;
          const published = total - drafts;
          return (
            <div className="panel admin-stat-card" key={type}>
              <div className="admin-stat-header">
                <div
                  className="admin-stat-icon"
                  style={{ color, background: bg }}
                >
                  <Icon size={18} />
                </div>
                <span className="admin-stat-label">{label}</span>
              </div>
              <strong className="admin-stat-value">{total}</strong>
              <div className="admin-stat-meta">
                <span className="pill green-pill">{published} đã đăng</span>
                {drafts > 0 ? (
                  <span className="pill neutral-pill">{drafts} bản nháp</span>
                ) : (
                  <span className="small muted">Hoàn tất</span>
                )}
              </div>
            </div>
          );
        })}
        <div className="panel admin-stat-card">
          <div className="admin-stat-header">
            <div
              className="admin-stat-icon"
              style={{ color: "#d97706", background: "#fef3c7" }}
            >
              <Sparkles size={18} />
            </div>
            <span className="admin-stat-label">Từ vựng quan tâm</span>
          </div>
          <strong className="admin-stat-value">
            {state.vocabulary.length} từ
          </strong>
          <p className="small muted admin-stat-keywords">
            {state.vocabulary
              .map((v) => ({
                word: v.word,
                count: state.accounts.reduce(
                  (n, a) =>
                    n +
                    a.data.words.filter((w) => w.vocabularyId === v.id).length,
                  0,
                ),
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map((v) => v.word)
              .join(" · ") || "Đang thu thập từ khóa"}
          </p>
        </div>
      </div>
      <section className="panel admin-table-panel">
        <div className="row spread">
          <h2>Thư viện nội dung</h2>
          <span className="tag">{items.length} nội dung</span>
        </div>
        <SearchBox
          value={query}
          onChange={(s) => {
            setQuery(s);
            setPage(0);
          }}
        />
        <div className="filter-bar">
          <Tabs
            items={typeTabs}
            value={type}
            onChange={(s) => {
              setType(s);
              setPage(0);
            }}
          />
          <select
            aria-label="Trạng thái"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="ALL">Mọi trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="DRAFT">Bản nháp</option>
          </select>
        </div>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nội dung</th>
                <th>Chủ đề</th>
                <th>Độ khó</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(currentPage * 6, currentPage * 6 + 6).map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="table-title">
                      <div className="table-cover-wrap">
                        <Cover src={c.thumbnail} alt="" />
                        <span
                          className={`table-type-badge ${c.type.toLowerCase()}`}
                          title={typeLabel[c.type]}
                        >
                          {c.type === "ARTICLE" ? (
                            <FileText size={11} />
                          ) : c.type === "PODCAST" ? (
                            <Headphones size={11} />
                          ) : (
                            <Video size={11} />
                          )}
                        </span>
                      </div>
                      <div>
                        <strong>{c.title}</strong>
                        <small>
                          {typeLabel[c.type]} ·{" "}
                          {c.type === "ARTICLE"
                            ? `${Math.round(c.duration / 60)} phút đọc`
                            : `${Math.floor(c.duration / 60)}:${String(Math.floor(c.duration % 60)).padStart(2, "0")}`}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="tag">
                      {topics.find((t) => t.id === c.category)?.label || c.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`diff-badge diff-${c.difficulty.toLowerCase()}`}
                    >
                      {c.difficulty}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-pill ${c.status === "PUBLISHED" ? "published" : "draft"}`}
                      title="Nhấp để chuyển đổi xuất bản / bản nháp"
                      onClick={() => handleTogglePublish(c)}
                    >
                      <span className="status-dot" />
                      {c.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}
                    </button>
                  </td>
                  <td>
                    <div className="row" style={{ gap: "4px" }}>
                      <Link
                        className="icon-btn"
                        aria-label={`Sửa ${c.title}`}
                        title="Chỉnh sửa"
                        to={`/admin/${c.type === "ARTICLE" ? "article" : "media"}/${c.id}`}
                      >
                        <Pencil size={15} />
                      </Link>
                      {c.type !== "ARTICLE" && (
                        <Link
                          className="icon-btn"
                          aria-label={`Transcript ${c.title}`}
                          title="Biên tập Transcript"
                          to={`/admin/transcript/${c.id}`}
                        >
                          <FileText size={15} />
                        </Link>
                      )}
                      <Link
                        className="icon-btn"
                        aria-label={`Xem trước ${c.title}`}
                        title="Xem trước"
                        to={contentPath(c)}
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        className="icon-btn danger-hover"
                        aria-label={`Xóa ${c.title}`}
                        title="Xóa nội dung"
                        onClick={() => setRemove(c.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && <Empty title="Chưa có nội dung phù hợp" />}
        <div className="row spread pagination">
          <span className="small muted">
            Trang {currentPage + 1} / {Math.max(1, Math.ceil(items.length / 6))}
          </span>
          <div className="row">
            <button
              className="btn"
              disabled={!currentPage}
              onClick={() => setPage(currentPage - 1)}
            >
              ← Trước
            </button>
            <button
              className="btn"
              disabled={(currentPage + 1) * 6 >= items.length}
              onClick={() => setPage(currentPage + 1)}
            >
              Sau →
            </button>
          </div>
        </div>
      </section>
      {remove && (
        <Modal title="Xóa nội dung này?" onClose={() => setRemove("")}>
          <p>Nội dung sẽ được gỡ khỏi thư viện và feed mẫu.</p>
          <div className="actions">
            <button className="btn" onClick={() => setRemove("")}>
              Hủy
            </button>
            <button
              className="btn danger"
              onClick={() => handleDelete(remove)}
            >
              Xóa nội dung
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
