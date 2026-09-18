import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  FileText,
  Headphones,
  Video,
  ArrowLeft,
} from "lucide-react";
import { useDemo } from "../app/providers";

export function EditorLayout() {
  const location = useLocation();
  const { state } = useDemo();
  const searchParams = new URLSearchParams(location.search);
  const mediaType = searchParams.get("type");

  const isDashboard =
    location.pathname === "/admin" || location.pathname === "/admin/";
  const isArticle = location.pathname.startsWith("/admin/article");

  // Check if viewing or editing media/transcript
  const mediaMatch = location.pathname.match(
    /^\/admin\/(?:media|transcript)\/([^/?#]+)/,
  );
  const mediaId = mediaMatch?.[1];
  const existingMedia =
    mediaId && mediaId !== "new"
      ? state.contents.find((c) => c.id === mediaId)
      : null;

  const isMediaNew = location.pathname === "/admin/media/new";
  const isPodcastActive =
    (isMediaNew && (mediaType === "PODCAST" || !mediaType)) ||
    existingMedia?.type === "PODCAST";
  const isVideoActive =
    (isMediaNew && mediaType === "VIDEO") || existingMedia?.type === "VIDEO";

  return (
    <div className="editor-shell">
      <aside className="editor-sidebar">
        <div>
          <Link className="brand" to="/">
            <Sprout />
            Flowling.
          </Link>
          <span className="eyebrow" style={{ display: "inline-block", marginTop: "6px" }}>
            EDITORIAL STUDIO
          </span>
        </div>
        <nav>
          <NavLink
            end
            to="/admin"
            className={() => (isDashboard ? "active" : "")}
          >
            <LayoutDashboard size={18} />
            Tổng quan
          </NavLink>
          <NavLink
            to="/admin/article/new"
            className={() => (isArticle ? "active" : "")}
          >
            <FileText size={18} />
            Viết câu chuyện
          </NavLink>
          <NavLink
            to="/admin/media/new?type=PODCAST"
            className={() => (isPodcastActive ? "active" : "")}
          >
            <Headphones size={18} />
            Thêm podcast
          </NavLink>
          <NavLink
            to="/admin/media/new?type=VIDEO"
            className={() => (isVideoActive ? "active" : "")}
          >
            <Video size={18} />
            Thêm video
          </NavLink>
        </nav>
        <Link className="subtle-link" to="/">
          <ArrowLeft size={16} />
          Về trang người dùng
        </Link>
        <p className="small muted">
          Không gian biên tập mẫu.
          <br />
          Thay đổi được lưu trên trình duyệt này.
        </p>
      </aside>
      <main className="editor-main">
        <Outlet />
      </main>
    </div>
  );
}
