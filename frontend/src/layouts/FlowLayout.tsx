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
  Languages,
  Sparkles,
} from "lucide-react";
import { useDemo } from "../app/providers";
import { topics } from "../shared/mock/seed";
import { Speak } from "../shared/components/ui";

export function FlowLayout() {
  const { data, account } = useDemo();
  const location = useLocation();
  const due = data.words.filter((w) => w.nextReviewAt <= Date.now()).length;
  const wide = /^\/(article|podcast|video|readflow)/.test(location.pathname);

  return (
    <div className={`app-shell ${wide ? "reading-shell" : ""}`}>
      <aside className="sidebar">
        <Link className="brand" to="/">
          <Sprout />
          Flowling.
        </Link>
        <span className="eyebrow">GOOD CONTENT. BETTER YOU.</span>

        <nav>
          <NavLink end to="/">
            <Home size={18} /> Trang chủ
          </NavLink>
          <NavLink to="/explore">
            <Compass size={18} /> Khám phá
          </NavLink>
          <NavLink to="/saved">
            <Bookmark size={18} /> Đã lưu
          </NavLink>
          <NavLink to="/review">
            <Brain size={18} /> Ôn tập
            {due > 0 && <span className="nav-badge">{due}</span>}
          </NavLink>
          <NavLink to="/history">
            <History size={18} /> Lịch sử
          </NavLink>
          <NavLink to="/profile">
            <User size={18} /> Hồ sơ
          </NavLink>
        </nav>

        <div className="sidebar-topics">
          <span className="eyebrow">CHỦ ĐỀ ĐÁNG CHÚ Ý</span>
          {topics.slice(0, 5).map((t) => (
            <Link to={`/explore?topic=${t.id}`} key={t.id}>
              <span>{t.icon}</span>
              {t.label}
              <ArrowUpRight size={13} />
            </Link>
          ))}
        </div>

        <div className="sidebar-bottom">
          <Link className="subtle-link" to="/readflow">
            <Sparkles size={16} className="text-green" /> Trợ lý ReadFlow AI
          </Link>
          <Link className="subtle-link" to="/vocabulary">
            <BookOpen size={17} /> Sổ từ của bạn
          </Link>
          <Link className="subtle-link" to="/admin">
            <Settings size={16} /> Không gian biên tập
          </Link>

          {account ? (
            <div className="user-mini">
              <Link className="avatar" to="/profile">
                {data.profile.avatar ? (
                  <img
                    src={data.profile.avatar}
                    alt={data.profile.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  data.profile.name[0] || "U"
                )}
              </Link>
              <Link to="/profile">
                <strong>{data.profile.name}</strong>
                <small>Luôn giữ sự tò mò 🌱</small>
              </Link>
            </div>
          ) : (
            <div className="user-mini">
              <Link
                className="btn primary"
                to="/login"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
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
                  {data.profile.avatar ? (
                    <img
                      src={data.profile.avatar}
                      alt={data.profile.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    data.profile.name[0] || "U"
                  )}
                </Link>
              </>
            ) : (
              <Link
                className="btn primary"
                to="/login"
                style={{
                  fontSize: "13px",
                  padding: "6px 14px",
                  textDecoration: "none",
                }}
              >
                Đăng nhập
              </Link>
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
                  “Little habits,
                  <br />
                  remarkable results.”
                </h2>
                <p>
                  Một mẩu chuyện nhỏ hôm nay có thể nảy mầm thành những góc nhìn
                  mới ngày mai.
                </p>
                <div className="quote-source">
                  <span>James Clear, Atomic Habits</span>
                  <Speak text="Little habits, remarkable results." />
                </div>
              </section>

              <section className="panel review-widget">
                <Brain size={24} />
                <h3>
                  {due ? `${due} từ đang chờ gặp lại` : "Bạn đã ôn xong hôm nay"}
                </h3>
                <p>Vài phút để những điều thú vị ở lại lâu hơn.</p>
                <Link className="btn primary" to="/review">
                  {due ? "Ôn nhanh một chút" : "Xem sổ từ"}{" "}
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
