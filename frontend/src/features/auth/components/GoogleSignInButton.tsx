import { useEffect, useRef, useState } from "react";
import { Modal } from "../../../shared/components/ui";

const GOOGLE_SCRIPT_ID = "google-identity-services";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

export function GoogleSignInButton({
  onCredential,
  disabled = false,
}: {
  onCredential: (credential: string) => Promise<void>;
  disabled?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [showGuide, setShowGuide] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  callbackRef.current = onCredential;

  useEffect(() => {
    if (!clientId) {
      setStatus("error");
      return;
    }

    let active = true;
    const render = () => {
      if (!active || !window.google?.accounts?.id || !containerRef.current)
        return;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }: GoogleCredentialResponse) =>
            void callbackRef.current(credential),
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        containerRef.current.replaceChildren();
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          locale: "vi",
          width: Math.min(400, Math.max(240, containerRef.current.clientWidth)),
        });
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    if (window.google?.accounts?.id) {
      render();
      return () => {
        active = false;
      };
    }

    let script = document.getElementById(
      GOOGLE_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client?hl=vi";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render, { once: true });
    const fail = () => active && setStatus("error");
    script.addEventListener("error", fail, { once: true });
    return () => {
      active = false;
      script?.removeEventListener("load", render);
      script?.removeEventListener("error", fail);
    };
  }, [clientId]);

  return (
    <>
      <div className={`google-signin ${disabled ? "disabled" : ""}`}>
        <div ref={containerRef} aria-live="polite" />
        {status === "loading" && (
          <div className="google-signin-placeholder">Đang tải Google…</div>
        )}
        {status === "error" && (
          <div className="google-fallback-wrap">
            <button
              type="button"
              className="google-fallback-btn"
              onClick={() => setShowGuide(true)}
              disabled={disabled}
              aria-label="Tiếp tục với Google"
            >
              <GoogleIcon />
              <span>Tiếp tục với Google</span>
            </button>
            <p className="google-config-note" role="status">
              {clientId
                ? "Không tải được Google Sign-In. Kiểm tra kết nối rồi thử lại."
                : "Google Sign-In chưa được cấu hình cho môi trường này."}
            </p>
          </div>
        )}
        {disabled && <span className="google-busy-mask">Đang xác thực…</span>}
      </div>

      {showGuide && (
        <Modal
          title="Cấu hình Google Sign-In"
          onClose={() => setShowGuide(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Để kích hoạt đăng nhập bằng Google, ứng dụng cần được kết nối với <strong>Google OAuth Client ID</strong>:
            </p>
            <ol style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <li>
                Truy cập{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--color-primary, #16a34a)", textDecoration: "underline", fontWeight: 500 }}
                >
                  Google Cloud Console → Credentials
                </a>{" "}
                để tạo OAuth 2.0 Client ID (loại <em>Web application</em>).
              </li>
              <li>
                Thêm <code>http://localhost:5173</code> (hoặc port đang chạy) vào <strong>Authorized JavaScript origins</strong>.
              </li>
              <li>
                Mở file <code>frontend/.env</code> và khai báo:
                <pre style={{
                  background: "var(--bg-canvas, #f3f4f6)",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  overflowX: "auto",
                  marginTop: "6px",
                  border: "1px solid var(--border-color, #e5e7eb)"
                }}>
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
                </pre>
              </li>
              <li>
                Khởi động lại frontend dev server (<code>npm run dev</code>).
              </li>
            </ol>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                type="button"
                className="btn primary"
                onClick={() => setShowGuide(false)}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
