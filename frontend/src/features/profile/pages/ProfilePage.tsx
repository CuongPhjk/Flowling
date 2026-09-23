import { useState } from "react";
import { Link } from "react-router-dom";
import { useDemo } from "../../../app/providers";
import { dayKey } from "../../../shared/mock/seed";
import { PageHeading, Modal } from "../../../shared/components/ui";
export function ProfilePage() {
  const { account, data, updatePersonal, notify, logout } = useDemo();
  const [edit, setEdit] = useState(false),
    [name, setName] = useState(data.profile.name),
    [avatar, setAvatar] = useState(data.profile.avatar);
  return (
    <>
      <PageHeading
        eyebrow="YOUR LITTLE CORNER"
        title="Mỗi ngày, một chút mới."
        description="Nhìn lại hành trình và tạo không gian phù hợp với bạn."
        action={
          account ? (
            <button className="btn" onClick={() => logout()}>
              Đăng xuất
            </button>
          ) : (
            <Link className="btn primary" to="/login">
              Đăng nhập / Đăng ký
            </Link>
          )
        }
      />
      {!account && (
        <div className="panel" style={{ padding: "24px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--c-surface)" }}>
          <div>
            <h3>Bạn đang trải nghiệm với tư cách Khách 🌱</h3>
            <p className="muted" style={{ margin: "4px 0 0" }}>Đăng nhập để đồng bộ tiến độ học, từ vựng và bài đã lưu trên mọi thiết bị.</p>
          </div>
          <Link className="btn primary" to="/login">
            Bắt đầu ngay →
          </Link>
        </div>
      )}
      <div className="profile-banner panel">
        <div className="profile-avatar">
          {data.profile.avatar ? (
            <img src={data.profile.avatar} alt="Ảnh đại diện" />
          ) : (
            data.profile.name[0] || "U"
          )}
        </div>
        <div>
          <span className="eyebrow">{account ? "THÀNH VIÊN FLOWLING" : "KHÁCH VÃNG LAI"}</span>
          <h2>{data.profile.name}</h2>
          <p className="muted">{account ? data.profile.email : "Chưa đăng nhập"}</p>
          <Link className="green" to="/vocabulary">
            Sổ từ cá nhân →
          </Link>
        </div>
        {account && (
          <button className="btn" onClick={() => setEdit(true)}>
            Chỉnh sửa hồ sơ
          </button>
        )}
      </div>
      <div className="stats-grid">
        <div className="panel">
          <span className="muted">Thời gian khám phá</span>
          <strong>
            {(data.progress.reduce((n, p) => n + p.seconds, 0) / 3600).toFixed(
              1,
            )}{" "}
            <small>giờ</small>
          </strong>
        </div>
        <div className="panel">
          <span className="muted">Từ vựng tích lũy</span>
          <strong>
            {data.words.length} <small>từ</small>
          </strong>
        </div>
        <div className="panel">
          <span className="muted">Những bước tiến nhỏ</span>
          <strong>
            {data.profile.xp.toLocaleString()} <small>XP</small>
          </strong>
        </div>
      </div>
      <section className="panel activity-panel">
        <div className="row spread">
          <div>
            <h2>🔥 {data.profile.streak} ngày liên tục</h2>
            <p className="muted">Sự đều đặn tạo nên những thay đổi nhỏ.</p>
          </div>
          <span className="tag green">30 ngày qua</span>
        </div>
        <div className="heatmap">
          {Array.from({ length: 30 }, (_, i) => {
            const date = new Date(Date.now() - (29 - i) * 86400000),
              key = dayKey(date),
              points = data.profile.activity[key] || 0;
            return (
              <div
                className={points > 10 ? "strong" : points ? "light" : ""}
                key={key}
                title={`${date.toLocaleDateString("vi-VN")}: ${points ? `${points} điểm hoạt động` : "Chưa hoạt động"}`}
              >
                <span>{date.getDate()}</span>
              </div>
            );
          })}
        </div>
      </section>
      <section className="panel preferences">
        <h2>Không gian theo cách của bạn</h2>
        <label>
          <span>
            <strong>Chế độ đọc yêu thích</strong>
            <small>
              Bài viết luôn mở bằng English; bạn có thể chuyển khi đọc.
            </small>
          </span>
          <select
            value={data.profile.reading}
            onChange={(e) =>
              updatePersonal((p) => ({
                ...p,
                profile: {
                  ...p.profile,
                  reading: e.target.value as "English" | "Bilingual",
                },
              }))
            }
          >
            <option>English</option>
            <option>Bilingual</option>
          </select>
        </label>
        <label>
          <span>
            <strong>Tốc độ nghe mặc định</strong>
            <small>Áp dụng khi mở podcast hoặc video.</small>
          </span>
          <select
            value={data.profile.speed}
            onChange={(e) =>
              updatePersonal((p) => ({
                ...p,
                profile: { ...p.profile, speed: Number(e.target.value) },
              }))
            }
          >
            {[0.75, 1, 1.25, 1.5].map((n) => (
              <option value={n} key={n}>
                {n}×
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>
            <strong>Giao diện</strong>
            <small>Một màu sắc phù hợp với thời điểm của bạn.</small>
          </span>
          <select
            value={data.profile.theme}
            onChange={(e) =>
              updatePersonal((p) => ({
                ...p,
                profile: {
                  ...p.profile,
                  theme: e.target.value as "light" | "dark",
                },
              }))
            }
          >
            <option value="light">Sáng</option>
            <option value="dark">Tối</option>
          </select>
        </label>
      </section>
      {edit && (
        <Modal title="Chỉnh sửa hồ sơ" onClose={() => setEdit(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              updatePersonal((p) => ({
                ...p,
                profile: { ...p.profile, name: name.trim(), avatar },
              }));
              notify("Đã cập nhật hồ sơ");
              setEdit(false);
            }}
          >
            <label className="field">
              Tên hiển thị
              <input
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="field">
              Ảnh đại diện
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 1024 * 1024) {
                    notify("Chọn ảnh nhỏ hơn 1 MB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => setAvatar(String(reader.result));
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            <button className="btn primary" type="submit">
              Lưu thay đổi
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
