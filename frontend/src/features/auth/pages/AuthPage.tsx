import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [google, setGoogle] = useState(false);
  const [reset, setReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (mode === "forgot") {
        const found = state.accounts.some((a) => a.email === email.trim().toLowerCase());
        if (!found) {
          throw new Error("Không tìm thấy tài khoản với email này.");
        }
        setReset(true);
        return;
      }

      // Check return location from state (e.g. video, podcast, article or personal tab)
      const from = (location.state as any)?.from?.pathname
        ? ((location.state as any).from.pathname + ((location.state as any).from.search || ""))
        : (admin ? "/admin" : "/");

      if (mode === "register") {
        await register(name, email, password);
        notify("Đăng ký tài khoản thành công!");
        navigate(from, { replace: true });
      } else {
        const role = await login(email, password, remember);
        notify("Đăng nhập thành công!");
        const target = admin && role === "ADMIN" ? "/admin" : from;
        navigate(target, { replace: true });
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
            ? "Nhập email của bạn để thiết lập mật khẩu mới."
            : "Những câu chuyện và nội dung thú vị đang chờ bạn."}
        </p>

        {mode !== "forgot" && (
          <>
            <button
              type="button"
              className="btn google-btn"
              onClick={() => setGoogle(true)}
            >
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
                placeholder="Ví dụ: Hoàng Nam"
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
              placeholder="name@example.com"
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
                  placeholder={mode === "register" ? "Tối thiểu 6 ký tự" : "Nhập mật khẩu"}
                  minLength={mode === "register" ? 6 : 1}
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
      </main>

      {google && (
        <Modal
          title="Đăng nhập Google"
          onClose={() => setGoogle(false)}
        >
          <p>
            Tính năng đăng nhập trực tiếp một chạm qua tài khoản Google OAuth 2.0 đang được kết nối trong bản cập nhật tới.
          </p>
          <p className="muted small">
            Hiện tại, bạn có thể đăng ký và đăng nhập nhanh chóng bằng Email & Mật khẩu ở form bên dưới.
          </p>
          <button
            className="btn primary full"
            onClick={() => setGoogle(false)}
          >
            Tôi hiểu rồi
          </button>
        </Modal>
      )}

      {reset && (
        <Modal title="Đặt lại mật khẩu" onClose={() => setReset(false)}>
          <p>
            Nhập mật khẩu mới cho tài khoản <strong>{email}</strong>:
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
                notify("Đã cập nhật mật khẩu mới thành công!");
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
                minLength={6}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            <button className="btn primary full">Lưu mật khẩu mới</button>
          </form>
        </Modal>
      )}
    </AuthLayout>
  );
}
