import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";

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
    <div className={`google-signin ${disabled ? "disabled" : ""}`}>
      <div ref={containerRef} aria-live="polite" />
      {status === "loading" && (
        <div className="google-signin-placeholder">Đang tải Google…</div>
      )}
      {status === "error" && (
        <p className="google-config-note" role="status">
          {clientId
            ? "Không tải được Google Sign-In. Kiểm tra kết nối rồi thử lại."
            : "Google Sign-In chưa được cấu hình cho môi trường này."}
        </p>
      )}
      {disabled && <span className="google-busy-mask">Đang xác thực…</span>}
    </div>
  );
}
