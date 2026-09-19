import React, { useState } from "react";
import { Key, ShieldCheck, Check, Sparkles, AlertCircle } from "lucide-react";
import { Modal } from "../../../shared/components/ui";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  selectedModel,
  onSelectModel,
}: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [modelInput, setModelInput] = useState(selectedModel || "gemini-2.5-flash");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(keyInput.trim());
    onSelectModel(modelInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setKeyInput("");
    onSaveKey("");
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <Modal title="Cài đặt Gemini AI Key" onClose={onClose}>
      <form onSubmit={handleSave} className="readflow-api-modal">
        <div className="modal-banner-info">
          <Sparkles size={20} className="text-green" />
          <p>
            Nhập <strong>Google Gemini API Key</strong> riêng để dịch thuật bài đọc không giới hạn và tra cứu từ vựng siêu tốc. Key được lưu an toàn trực tiếp trên trình duyệt của bạn (LocalStorage).
          </p>
        </div>

        <label className="field" style={{ marginTop: "16px" }}>
          <span>Gemini API Key</span>
          <div className="input-with-icon">
            <Key size={16} className="input-icon" />
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="styled-input"
            />
          </div>
          <small className="muted">
            Chưa có API Key? Bạn có thể lấy miễn phí tại{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="green"
            >
              Google AI Studio ↗
            </a>
          </small>
        </label>

        <label className="field" style={{ marginTop: "12px" }}>
          <span>Mô hình AI Gemini</span>
          <select
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            className="styled-select"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Khuyên dùng - Nhanh & Chuẩn xác)</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Tiết kiệm Token)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Dịch thuật chuyên sâu)</option>
          </select>
        </label>

        <div className="security-notice">
          <ShieldCheck size={16} className="text-green" />
          <span>API Key của bạn được bảo mật trên máy cục bộ và không được gửi tới bên thứ ba nào khác.</span>
        </div>

        <div className="modal-actions-row">
          {apiKey && (
            <button
              type="button"
              className="btn"
              onClick={handleClear}
              style={{ color: "#EF4444" }}
            >
              Xóa Key
            </button>
          )}
          <button
            type="submit"
            className="btn primary"
            style={{ marginLeft: "auto", minWidth: "120px" }}
          >
            {savedSuccess ? (
              <>
                <Check size={16} /> Đã lưu
              </>
            ) : (
              "Lưu cấu hình"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
