import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <section className="auth-art">
        <Link className="brand" to="/">
          <Sprout />
          Flowling.
        </Link>
        <div>
          <span className="eyebrow">GOOD CONTENT. BETTER YOU.</span>
          <h1>
            Mở một câu chuyện.
            <br />
            Mở một thế giới.
          </h1>
          <p>
            Đọc những gì bạn thích.
            <br />
            Khám phá tiếng Anh theo cách tự nhiên nhất.
          </p>
        </div>
        <small>Mỗi chút mỗi ngày, bạn đang tiến bộ hơn. 🌱</small>
      </section>
      {children}
    </div>
  );
}
