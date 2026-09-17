import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  Bookmark,
  Brain,
  History,
  User,
  Sprout,
  ArrowUpRight,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { useDemo } from "../app/providers";
import { topics } from "../shared/mock/seed";
import { Speak } from "../shared/components/ui";

export function FlowLayout() {
  const { data, account, logout } = useDemo();
  const location = useLocation();
  const due = account ? data.words.filter((w) => w.nextReviewAt <= Date.now()).length : 0;
  const wide = /^\/(article|podcast|video)/.test(location.pathname);

  return (
    <div className={`app-shell ${wide ? "reading-shell" : ""}`}>
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <Sprout />
          </span>
          Flowling<span className="brand-dot">.</span>
        </Link>
        <p className="brand-tagline">Good content. Better you.</p>

        <span className="nav-caption">KHÔNG GIAN CỦA BẠN</span>
        <nav>
          {[
            { to: "/", label: "Trang chủ", Icon: Home },
            { to: "/explore", label: "Khám phá", Icon: Compass },
            { to: "/saved", label: "Đã lưu", Icon: Bookmark },
            { to: "/review", label: "Ôn tập", Icon: Brain },
            { to: "/history", label: "Lịch sử", Icon: History },
            { to: "/profile", label: "Hồ sơ", Icon: User },
          ].map(({ to, label, Icon }) => (
            <NavLink end={to === "/"} key={to} to={to}>
              <Icon size={20} />
              <span>{label}</span>
              {to === "/review" && due > 0 && (
                <b className="count-badge">{due}</b>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-topics">
          <span className="nav-caption">THEO DÒNG TÒ MÒ</span>
          {topics.slice(0, 5).map((t) => (
            <Link to={`/explore?topic=${t.id}`} key={t.id}>
              <span>{t.icon}</span>
              {t.label}
              <ArrowUpRight size={13} />
            </Link>
          ))}
        </div>

        <div className="sidebar-bottom">
          <Link className="subtle-link" to="/vocabulary">
            <BookOpen size={17} /> Sổ từ của bạn
          </Link>
          <Link
            className="subtle-link"
            to={account?.role === "ADMIN" ? "/admin" : "/login?admin=1"}
          >
            <Settings size={16} /> Không gian biên tập
          </Link>

          {account ? (
            <div className="user-mini">
              <Link className="avatar" to="/profile">
                {data.profile.name[0]}
              </Link>
              <Link to="/profile">
                <strong>{data.profile.name}</strong>
                <small>Luôn giữ sự tò mò 🌱</small>
              </Link>
              <button aria-label="Đăng xuất" onClick={logout}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="user-mini-guest" style={{ padding: "8px 0" }}>
              <Link className="btn primary full" to="/login">
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <Link className="mobile-brand" to="/">
            <Sprout size={22} />
            Flowling<span className="brand-dot">.</span>
          </Link>
          <span className="small muted">Một chút khám phá, mỗi ngày.</span>

          <div className="row">
            {account ? (
              <>
                <span className="streak-pill">🔥 {data.profile.streak} ngày</span>
                <Link className="avatar small-avatar" to="/profile">
                  {data.profile.name[0]}
                </Link>
              </>
            ) : (
              <div className="row" style={{ gap: "8px" }}>
                <Link className="btn" style={{ padding: "6px 14px", fontSize: "0.88rem" }} to="/login">
                  Đăng nhập
                </Link>
                <Link className="btn primary" style={{ padding: "6px 14px", fontSize: "0.88rem" }} to="/register">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </header>

        <div className="workspace-columns">
          <main className="main-content" id="main-content" tabIndex={-1}>
            <Outlet />
          </main>

          {!wide && (
            <aside className="right-rail">
              <section className="botanical">
                <Sprout size={32} />
                <span className="eyebrow">GROW A LITTLE, EVERY DAY</span>
                <h2>
                  Đi xa hơn
                  <br />
                  cùng sự tò mò.
                </h2>
                <p>
                  Một câu chuyện mới.
                  <br />
                  Một góc nhìn khác.
                  <br />
                  Một phiên bản tốt hơn của bạn.
                </p>
                <Link to="/explore">
                  Tìm điều thú vị <ArrowUpRight size={17} />
                </Link>
                <span className="botanical-orb" />
              </section>

              <section className="panel word-day">
                <div className="row spread">
                  <span className="eyebrow">TỪ CỦA HÔM NAY</span>
                  <span>✦</span>
                </div>
                <div className="row spread">
                  <h2>perspective</h2>
                  <Speak text="perspective" />
                </div>
                <p className="muted small">noun · /pərˈspektɪv/</p>
                <p>Góc nhìn, quan điểm</p>
                <blockquote>
                  “A new story gives you a fresh perspective.”
                </blockquote>
                <Link className="green small" to="/vocabulary">
                  Mở sổ từ của bạn →
                </Link>
              </section>

              <section className="panel review-widget">
                <Brain size={24} />
                <h3>
                  {account
                    ? due
                      ? `${due} từ đang chờ gặp lại`
                      : "Bạn đã ôn xong hôm nay"
                    : "Ghi nhớ nhẹ nhàng cùng SRS"}
                </h3>
                <p>
                  {account
                    ? "Vài phút để những điều thú vị ở lại lâu hơn."
                    : "Đăng nhập để lưu từ vựng và tự động ôn tập mỗi ngày."}
                </p>
                <Link className="btn primary" to={account ? "/review" : "/login"}>
                  {account ? (due ? "Ôn nhanh một chút" : "Xem sổ từ") : "Bắt đầu ngay"}{" "}
                  <ArrowUpRight size={16} />
                </Link>
              </section>

              <p className="rail-footer">
                Flowling © 2026
                <br />
                Made for your curious mind.
              </p>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
