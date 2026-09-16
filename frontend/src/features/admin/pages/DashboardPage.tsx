import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Eye,
  Plus,
  FileText,
  Headphones,
  Video,
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
export function DashboardPage() {
  const { state, saveContent, deleteContent, notify } = useDemo();
  const [query, setQuery] = useState(""),
    [type, setType] = useState("ALL"),
    [status, setStatus] = useState("ALL"),
    [page, setPage] = useState(0),
    [remove, setRemove] = useState("");
  const items = state.contents.filter(
    (c) =>
      (type === "ALL" || c.type === type) &&
      (status === "ALL" || c.status === status) &&
      c.title.toLowerCase().includes(query.toLowerCase()),
  );
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
          <Link className="btn primary" to="/admin/article/new">
            <Plus size={17} /> Tạo bài viết
          </Link>
        }
      />
      <div className="stats-grid four">
        {[
          { type: "ARTICLE", label: "Bài đọc", Icon: FileText },
          { type: "PODCAST", label: "Podcast", Icon: Headphones },
          { type: "VIDEO", label: "Video", Icon: Video },
        ].map(({ type, label, Icon }) => (
          <div className="panel" key={type}>
            <Icon className="green" size={23} />
            <strong>
              {state.contents.filter((c) => c.type === type).length}
            </strong>
            <p>
              {label} ·{" "}
              {
                state.contents.filter(
                  (c) => c.type === type && c.status === "DRAFT",
                ).length
              }{" "}
              bản nháp
            </p>
          </div>
        ))}
        <div className="panel">
          <span className="eyebrow">TỪ ĐƯỢC QUAN TÂM</span>
          <h3>
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
              .join(" · ")}
          </h3>
          <p>Từ sổ từ trong bản mẫu</p>
        </div>
      </div>
      <div className="actions">
        <Link className="btn" to="/admin/media/new?type=PODCAST">
          + Upload Podcast
        </Link>
        <Link className="btn" to="/admin/media/new?type=VIDEO">
          + Thêm Video
        </Link>
      </div>
      <section className="panel">
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
          <table>
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
                      <Cover src={c.thumbnail} alt="" />
                      <div>
                        <strong>{c.title}</strong>
                        <small>{typeLabel[c.type]}</small>
                      </div>
                    </div>
                  </td>
                  <td>{topics.find((t) => t.id === c.category)?.label}</td>
                  <td>{c.difficulty}</td>
                  <td>
                    <button
                      className={`tag ${c.status === "PUBLISHED" ? "green" : ""}`}
                      onClick={() => {
                        if (c.status === "DRAFT") {
                          const error =
                            c.type === "ARTICLE"
                              ? !c.title.trim() ||
                                !c.paragraphs.length ||
                                c.paragraphs.some(
                                  (p) => !p.en.trim() || !p.vi.trim(),
                                )
                                ? "Bổ sung nội dung và bản dịch trước khi đăng."
                                : ""
                              : !c.mediaUrl
                                ? "Thêm media trước khi đăng."
                                : validateSegments(
                                    c.segments,
                                    c.duration,
                                    true,
                                  );
                          if (error) {
                            notify(error);
                            return;
                          }
                        }
                        saveContent({
                          ...c,
                          status:
                            c.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
                          publishedAt: Date.now(),
                        });
                      }}
                    >
                      {c.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}
                    </button>
                  </td>
                  <td>
                    <div className="row">
                      <Link
                        className="icon-btn"
                        aria-label={`Sửa ${c.title}`}
                        to={`/admin/${c.type === "ARTICLE" ? "article" : "media"}/${c.id}`}
                      >
                        <Pencil size={16} />
                      </Link>
                      {c.type !== "ARTICLE" && (
                        <Link
                          className="icon-btn"
                          aria-label={`Transcript ${c.title}`}
                          to={`/admin/transcript/${c.id}`}
                        >
                          <FileText size={16} />
                        </Link>
                      )}
                      <Link
                        className="icon-btn"
                        aria-label={`Xem trước ${c.title}`}
                        to={contentPath(c)}
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        className="icon-btn"
                        aria-label={`Xóa ${c.title}`}
                        onClick={() => setRemove(c.id)}
                      >
                        <Trash2 size={16} />
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
              onClick={() => {
                deleteContent(remove);
                setRemove("");
                notify("Đã xóa nội dung");
              }}
            >
              Xóa nội dung
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
