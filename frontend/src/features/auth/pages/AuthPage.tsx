import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sprout, Eye, EyeOff } from "lucide-react";
import { useDemo, digest } from "../../../app/providers";
import { Modal } from "../../../shared/components/ui";
import { AuthLayout } from "../../../layouts/AuthLayout";
export function AuthPage({
  mode = "login",
}: {
  mode?: "login" | "register" | "forgot";
}) {
  const { state, setState, login, register, notify } = useDemo();
  const [params] = useSearchParams();
  const admin = params.has("admin");
  const navigate = useNavigate();
  const [email, setEmail] = useState(
      admin ? "admin@flowling.demo" : "minh@flowling.demo",
    ),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [show, setShow] = useState(false),
    [remember, setRemember] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [google, setGoogle] = useState(false),
    [reset, setReset] = useState(false),
    [newPassword, setNewPassword] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "forgot") {
        if (!state.accounts.some((a) => a.email === email.trim().toLowerCase()))
          throw Error("Email này chưa có trong dữ liệu mẫu.");
        setReset(true);
        return;
      }
      if (mode === "register") {
        await register(name, email, password);
        navigate("/");
      } else {
        const role = await login(email, password, remember);
        navigate(admin && role === "ADMIN" ? "/admin" : "/");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthLayout>
      <main className="auth-form">
        <Link className="green" to="/">
          ← Về Flowling
        </Link>
        <span className="demo-pill">Bản trải nghiệm bằng dữ liệu mẫu</span>
        <h1>
          {mode === "register"
            ? "Bắt đầu một hành trình mới."
            : mode === "forgot"
              ? "Tìm lại lối vào của bạn."
              : admin
                ? "Chào người kể chuyện."
                : "Chào mừng bạn trở lại!"}
        </h1>
        <p className="muted">
          {mode === "forgot"
            ? "Đặt lại mật khẩu của tài khoản trong trình duyệt này."
            : "Những câu chuyện thú vị đang chờ bạn."}
        </p>
        {mode !== "forgot" && (
          <>
            <button className="btn google-btn" onClick={() => setGoogle(true)}>
              <b aria-hidden="true">G</b> Tiếp tục với Google
            </button>
            <div className="divider">hoặc với email</div>
          </>
        )}
        <form onSubmit={submit}>
          {mode === "register" && (
            <label className="field">
              Tên của bạn
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                autoComplete="name"
              />
            </label>
          )}
          <label className="field">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          {mode !== "forgot" && (
            <label className="field">
              Mật khẩu
              <div className="password-field">
                <input
                  required
                  minLength={mode === "register" ? 8 : 1}
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                />
                <button
                  type="button"
                  aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  onClick={() => setShow((x) => !x)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
          )}
          {mode === "login" && (
            <div className="row spread small">
              <label className="row">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Ghi nhớ đăng nhập
              </label>
              <Link className="green" to="/forgot-password">
                Quên mật khẩu?
              </Link>
            </div>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn primary full">
            {busy
              ? "Đang xử lý…"
              : mode === "register"
                ? "Tạo tài khoản"
                : mode === "forgot"
                  ? "Tiếp tục đặt lại mật khẩu"
                  : "Đăng nhập"}
          </button>
        </form>
        <p className="small center">
          {mode === "register" ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
          <Link
            className="green"
            to={mode === "register" ? "/login" : "/register"}
          >
            {mode === "register" ? "Đăng nhập" : "Đăng ký miễn phí"}
          </Link>
        </p>
        <div className="demo-credentials">
          <strong>Tài khoản trải nghiệm</strong>
          <p>
            Người dùng: minh@flowling.demo
            <br />
            Biên tập: admin@flowling.demo
            <br />
            Mật khẩu: <code>Flowling123!</code>
          </p>
          <small>Đăng nhập và khôi phục được mô phỏng trên thiết bị này.</small>
        </div>
      </main>
      {google && (
        <Modal
          title="Chọn tài khoản Google mẫu"
          onClose={() => setGoogle(false)}
        >
          <p>Luồng trải nghiệm không kết nối tài khoản Google thật.</p>
          <button
            className="btn full"
            onClick={() => {
              setState((s) => ({ ...s, currentAccountId: "demo-user" }));
              sessionStorage.setItem("flowling-session", "demo-user");
              setGoogle(false);
              navigate("/");
            }}
          >
            M · Minh Nguyễn · minh@flowling.demo
          </button>
        </Modal>
      )}
      {reset && (
        <Modal title="Đặt lại mật khẩu mẫu" onClose={() => setReset(false)}>
          <p>
            Trong bản trải nghiệm, bạn đặt lại trực tiếp tại đây; không có email
            được gửi.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const hash = await digest(newPassword);
                setState((s) => ({
                  ...s,
                  accounts: s.accounts.map((a) =>
                    a.email === email.trim().toLowerCase()
                      ? { ...a, passwordHash: hash }
                      : a,
                  ),
                }));
                notify("Đã đặt lại mật khẩu mẫu");
                setReset(false);
                navigate("/login");
              } catch {
                setError("Không thể đặt lại mật khẩu.");
              }
            }}
          >
            <label className="field">
              Mật khẩu mới
              <input
                type="password"
                minLength={8}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            <button className="btn primary">Lưu mật khẩu mới</button>
          </form>
        </Modal>
      )}
    </AuthLayout>
  );
}
