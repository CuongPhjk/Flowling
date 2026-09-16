import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  FileText,
  Headphones,
  Video,
  ArrowLeft,
} from "lucide-react";
export function EditorLayout() {
  return (
    <div className="editor-shell">
      <aside className="editor-sidebar">
        <Link className="brand" to="/">
          <Sprout />
          Flowling.
        </Link>
        <span className="eyebrow">EDITORIAL STUDIO</span>
        <nav>
          <NavLink end to="/admin">
            <LayoutDashboard size={18} />
            Tổng quan
          </NavLink>
          <NavLink to="/admin/article/new">
            <FileText size={18} />
            Viết câu chuyện
          </NavLink>
          <NavLink to="/admin/media/new?type=PODCAST">
            <Headphones size={18} />
            Thêm podcast
          </NavLink>
          <Link to="/admin/media/new?type=VIDEO">
            <Video size={18} />
            Thêm video
          </Link>
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
