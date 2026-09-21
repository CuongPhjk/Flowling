# YÊU CẦU TÍCH HỢP TÍNH NĂNG MỚI: TRÌNH ĐỌC & LUYỆN ĐỌC HIỂU SONG NGỮ AI (READFLOW)

> **Hướng dẫn sử dụng file này**: Đây là bản đặc tả kỹ thuật và hướng dẫn đóng gói toàn bộ tính năng. Bạn có thể copy toàn bộ nội dung file này và gửi cho AI với câu lệnh:
> 
> *"Đây là tính năng mới, hãy giúp tôi tạo tính năng này vào website của tôi theo đúng hướng dẫn kỹ thuật chi tiết bên dưới."*

---

## 1. TỔNG QUAN TÍNH NĂNG (FEATURE OVERVIEW)

Tính năng **ReadFlow - Trợ lý đọc hiểu & dịch thuật song ngữ thông minh** giúp người dùng luyện đọc các bài báo, tài liệu, sách tiếng Anh một cách trực quan, liền mạch và hiệu quả cao nhờ tích hợp AI.

### Các khả năng cốt lõi:
1. **Cào & Bóc tách bài báo từ URL (Smart Article Web Scraper)**:
   - Người dùng chỉ cần dán đường link bài báo tiếng Anh (BBC, CNN, Medium, NYTimes, TechCrunch,...).
   - Hệ thống tự động bóc tách tiêu đề, tác giả, tên trang và nội dung bài viết sạch (loại bỏ quảng cáo, menu, rác web).
2. **Dịch thuật song ngữ song song theo đoạn (Paragraph Bilingual Split-View)**:
   - Giao diện chia đôi màn hình (Split Pane): Cột trái tiếng Anh (Gốc), Cột phải tiếng Việt (Bản dịch AI).
   - Bản dịch giữ nguyên từng đoạn văn bản tương ứng giúp người học dễ dàng đối chiếu song ngữ.
3. **Tra cứu từ vựng thông minh theo ngữ cảnh (Contextual Vocabulary Popup)**:
   - Người dùng bôi đen (highlight) bất kỳ từ hoặc cụm từ nào trên bài đọc.
   - Popup nổi tự căn vị trí thông minh hiển thị: Phiên âm quốc tế (IPA), Loại từ (Part of Speech), Nghĩa tiếng Việt chuẩn ngữ cảnh câu, Câu ví dụ và Nút nghe phát âm chuẩn bản xứ.
4. **Đọc bài văn bằng giọng đọc AI Studio chất lượng cao (Google Studio AI Text-to-Speech)**:
   - Tích hợp mô hình TTS chuyên nghiệp của Google Gemini Studio với nhiều giọng đọc tự nhiên (Puck, Charon, Kore, Fenrir, Aoede).
   - Hỗ trợ nghe bài đọc trực tiếp trên trình duyệt.
5. **Cá nhân hóa trải nghiệm đọc (Reader Experience)**:
   - Chế độ Đọc tập trung (Reader Mode) / Chế độ Chỉnh sửa (Editor Mode).
   - Đổi giao diện Dark Mode / Light Mode.
   - Tăng / Giảm kích thước chữ, chuyển đổi Font Serif (đọc sách) hoặc Sans-serif.
   - Hỗ trợ lưu trữ cấu hình và bản dịch vào `localStorage`.
   - Cho phép người dùng nhập API Key Gemini riêng hoặc dùng API Key mặc định của server.

---

## 2. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (TECH STACK)

### 2.1. Backend (Node.js / Express)
- **Runtime**: Node.js (ES Modules `type: module`).
- **Thư viện chính**:
  - `express`: RESTful API framework.
  - `cors`: Cấu hình chia sẻ tài nguyên giữa client và server.
  - `dotenv`: Quản lý biến môi trường (`GEMINI_API_KEY`, `PORT`).
  - `@google/generative-ai`: Google Gemini SDK cho dịch thuật và tra từ vựng.
  - `@mozilla/readability` & `jsdom`: Thuật toán bóc tách bài báo từ HTML.

### 2.2. Frontend (React / Vite)
- **Framework**: React (Vite hoặc Next.js).
- **Icons**: `lucide-react`.
- **CSS**: Vanilla CSS hiện đại (Variables, Glassmorphism, CSS Grid, Flexbox, Responsive, Dark/Light Themes).
- **Web APIs**: Web Speech API (`window.speechSynthesis`), Clipboard API (`navigator.clipboard`).

---

## 3. THIẾT KẾ BACKEND & CÁC API ENDPOINTS

### 3.1. Cấu hình Biến Môi Trường (`.env`)
```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

---

### 3.2. Chi tiết các API Endpoints

#### 1. Kiểm tra Server Health (`GET /api/health`)
- **Mục đích**: Kiểm tra server hoạt động và đã nạp API Key chưa.
- **Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-09-18T06:00:00.000Z",
  "hasApiKey": true
}
```

---

#### 2. Dịch văn bản tiếng Anh sang tiếng Việt (`POST /api/translate`)
- **Request Body**:
```json
{
  "text": "English paragraph here...",
  "apiKey": "optional_user_custom_gemini_api_key"
}
```
- **System Instruction cho AI**:
```text
Bạn là một chuyên gia dịch thuật và trợ lý dạy đọc hiểu tiếng Anh (Reading Assistant).
Nhiệm vụ của bạn là dịch đoạn văn bản tiếng Anh sau đây sang tiếng Việt.
Yêu cầu:
1. Bản dịch tiếng Việt phải chuẩn xác, tự nhiên, thuần Việt, đúng ngữ cảnh bài đọc nhưng không làm mất ý gốc.
2. Giữ nguyên cấu trúc các đoạn văn (paragraphs) tương ứng với bản gốc để người học dễ dàng đối chiếu song ngữ khi đọc.
3. Chỉ trả về nội dung bản dịch tiếng Việt, KHÔNG kèm các lời giải thích thừa, KHÔNG bọc trong markdown quote.
```
- **Response**:
```json
{
  "success": true,
  "originalText": "...",
  "translation": "...",
  "modelUsed": "gemini-2.5-flash"
}
```

---

#### 3. Cào & Bóc tách nội dung bài báo (`POST /api/crawl`)
- **Request Body**:
```json
{
  "url": "https://example.com/article-slug"
}
```
- **Xử lý Backend**:
  1. Gửi request `fetch` với Header giả lập trình duyệt (Chrome User-Agent).
  2. Dùng `jsdom` nạp HTML và `@mozilla/readability` để parse nội dung chính:
     ```js
     import { JSDOM } from 'jsdom';
     import { Readability } from '@mozilla/readability';

     const doc = new JSDOM(html, { url: targetUrl });
     const reader = new Readability(doc.window.document, { charThreshold: 50 });
     const article = reader.parse();
     ```
  3. Lọc lấy các thẻ `p`, `h2`, `h3`, `blockquote`, định dạng thành các đoạn cách nhau bởi `\n\n`.
- **Response**:
```json
{
  "success": true,
  "data": {
    "title": "Article Title",
    "siteName": "example.com",
    "byline": "Author Name",
    "url": "https://example.com/article-slug",
    "formattedText": "Paragraph 1\n\nParagraph 2\n\nParagraph 3",
    "wordCount": 450,
    "isTruncated": false
  }
}
```

---

#### 4. Tra cứu từ vựng theo ngữ cảnh (`POST /api/lookup-word`)
- **Request Body**:
```json
{
  "word": "resilience",
  "context": "The company showed remarkable resilience during the crisis.",
  "apiKey": "optional_api_key"
}
```
- **Prompt & JSON Schema cho Gemini**:
```text
System Instruction:
Bạn là một từ điển Anh - Việt chuyên sâu và trợ lý học tiếng Anh.
Nhiệm vụ: Phân tích từ hoặc cụm từ tiếng Anh được cung cấp và trả về thông tin chi tiết.
Bắt buộc: Chỉ trả về một JSON object duy nhất, không thêm bất kỳ văn bản nào khác.

Cấu trúc JSON:
{
  "word": "từ/cụm từ đang tra cứu",
  "ipa": "phiên âm quốc tế IPA kèm dấu trọng âm (ví dụ: /rɪˈzɪl.jəns/)",
  "partOfSpeech": "loại từ (ví dụ: noun (danh từ), verb (động từ))",
  "meaning": "nghĩa tiếng Việt chuẩn ngữ cảnh",
  "example": "1 câu ví dụ tiếng Anh tự nhiên chứa từ đó",
  "exampleTranslation": "bản dịch tiếng Việt của câu ví dụ"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "word": "resilience",
    "ipa": "/rɪˈzɪl.jəns/",
    "partOfSpeech": "noun (danh từ)",
    "meaning": "khả năng phục hồi, tính kiên cường",
    "example": "The company showed remarkable resilience during the crisis.",
    "exampleTranslation": "Công ty đã thể hiện khả năng phục hồi đáng kinh ngạc trong suốt cuộc khủng hoảng."
  }
}
```

---

#### 5. Đọc bài văn AI Studio TTS (`POST /api/tts`)
- **Request Body**:
```json
{
  "text": "English text to speak...",
  "voice": "Puck",
  "apiKey": "optional_api_key"
}
```
- **Danh sách giọng đọc hỗ trợ**:
  - `Puck`: Nam - Tự nhiên, sinh động (Playful & Energetic).
  - `Charon`: Nam - Trầm ấm, điềm tĩnh (Deep & Calm).
  - `Kore`: Nữ - Dịu dàng, thư giãn (Warm & Soothing).
  - `Fenrir`: Nam - Mạnh mẽ, dứt khoát (Bold & Direct).
  - `Aoede`: Nữ - Trong trẻo, du dương (Melodic & Friendly).
- **Backend TTS Engine (Gemini 2.5 Flash TTS + PCM to WAV Converter)**:
  - Gọi Google AI Studio Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`
  - Modality: `AUDIO`, Speech Config: `prebuiltVoiceConfig: { voiceName }`.
  - Hàm ghép header RIFF WAV cho dữ liệu PCM 24000Hz 16-bit Mono:
    ```js
    function pcmToWav(pcmData, sampleRate = 24000) {
      const numChannels = 1;
      const bitDepth = 16;
      const bytesPerSample = bitDepth / 8;
      const blockAlign = numChannels * bytesPerSample;
      const byteRate = sampleRate * blockAlign;
      const dataSize = pcmData.length;
      const buffer = Buffer.alloc(44 + dataSize);

      buffer.write('RIFF', 0);
      buffer.writeUInt32LE(36 + dataSize, 4);
      buffer.write('WAVE', 8);
      buffer.write('fmt ', 12);
      buffer.writeUInt32LE(16, 16);
      buffer.writeUInt16LE(1, 20); // PCM
      buffer.writeUInt16LE(numChannels, 22);
      buffer.writeUInt32LE(sampleRate, 24);
      buffer.writeUInt32LE(byteRate, 28);
      buffer.writeUInt16LE(blockAlign, 32);
      buffer.writeUInt16LE(bitDepth, 34);
      buffer.write('data', 36);
      buffer.writeUInt32LE(dataSize, 40);
      pcmData.copy(buffer, 44);
      return buffer;
    }
    ```
- **Response**:
```json
{
  "success": true,
  "audioBase64": "UklGR...",
  "mimeType": "audio/wav",
  "voiceName": "Puck"
}
```

---

## 4. THIẾT KẾ FRONTEND & GIAO DIỆN NGƯỜI DÙNG

### 4.1. Cấu trúc Component
```text
client/src/
├── components/
│   ├── Navbar.jsx          # Thanh điều hướng trên cùng (Logo, nút Theme, cỡ chữ, font Serif, API Key)
│   ├── UrlBar.jsx          # Thanh dán link bài báo, nút cào nội dung, toggle Auto-Translate, chip metadata
│   ├── SourcePane.jsx      # Cột văn bản tiếng Anh (Textarea/Reader mode, toolbar TTS, chip bài mẫu, chọn từ tra cứu)
│   ├── TargetPane.jsx      # Cột bản dịch tiếng Việt (Hiển thị từng đoạn, Shimmer Loading, nút Copy, nút đọc tiếng Việt)
│   ├── WordPopup.jsx       # Floating Popup tra từ vựng khi bôi đen (IPA, Type, Nghĩa, Ví dụ, Âm thanh)
│   └── ApiKeyModal.jsx     # Modal cấu hình Custom Gemini API Key lưu trên trình duyệt
├── services/
│   └── api.js              # Fetch handlers (Translate, Crawl, Lookup có in-memory cache, TTS)
├── App.jsx                 # Main state, LocalStorage sync, Split Screen layout
└── index.css               # Design System (Colors, Dark/Light mode, Glassmorphism, Animations)
```

---

### 4.2. Quản lý Trạng Thái & Tương Tác Quan Trọng

1. **Bôi đen từ vựng để mở Popup (`SourcePane.jsx` -> `WordPopup.jsx`)**:
   - Bắt sự kiện `onMouseUp`: Lấy `window.getSelection()` hoặc selection từ `textarea`.
   - Làm sạch ký tự đặc biệt ở đầu/cuối: `cleanWord = selected.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')`.
   - Lấy câu chứa từ đó làm `context` để gửi kèm vào API tra từ vựng.
   - Tính tọa độ `x, y` của con trỏ chuột để định vị popup nổi, tự động đảo vị trí lên trên hoặc xuống dưới để không tràn màn hình.
2. **Cào bài báo tự động dịch (`UrlBar.jsx`)**:
   - Khi người dùng bấm "Lấy bài đọc" hoặc ấn Enter, gọi API `/api/crawl`.
   - Cập nhật văn bản vào `sourceText`. Nếu bật checkbox `Tự động dịch`, kích hoạt ngay hàm `handleTranslate()`.
3. **Phát âm từ vựng & Bản dịch**:
   - Từ tiếng Anh trong Popup: Sử dụng Web Speech API `SpeechSynthesisUtterance(word, { lang: 'en-US', rate: 0.9 })`.
   - Toàn bộ bài đọc tiếng Anh: Gọi Google Studio AI TTS để nhận file WAV chất lượng cao và phát qua `new Audio(audioUrl)`.
   - Bản dịch tiếng Việt: Sử dụng Web Speech API `SpeechSynthesisUtterance(translation, { lang: 'vi-VN' })`.

---

## 5. MÃ NGUỒN MẪU ĐỂ TRIỂN KHAI (CORE IMPLEMENTATION)

### 5.1. Backend Service: Gemini Translation & Word Lookup (`geminiService.js`)
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function translateEnglishToVietnamese(text, customApiKey) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Chưa cấu hình Gemini API Key.');

  const genAI = new GoogleGenerativeAI(apiKey);
  const candidateModels = [process.env.GEMINI_MODEL || 'gemini-2.5-flash', 'gemini-1.5-flash'];

  const systemInstruction = `Bạn là một chuyên gia dịch thuật và trợ lý dạy đọc hiểu tiếng Anh.
Nhiệm vụ: Dịch văn bản tiếng Anh sang tiếng Việt chuẩn xác, tự nhiên, đúng ngữ cảnh.
Giữ nguyên cấu trúc các đoạn văn (paragraphs) tương ứng với bản gốc để tiện đối chiếu song ngữ.
Chỉ trả về nội dung bản dịch tiếng Việt.`;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
      const result = await model.generateContent(`Hãy dịch văn bản tiếng Anh sau sang tiếng Việt:\n\n${text}`);
      return { translation: result.response.text().trim(), modelUsed: modelName };
    } catch (err) {
      console.warn(`Fallback từ model ${modelName}:`, err.message);
    }
  }
  throw new Error('Không thể dịch văn bản.');
}

export async function lookupVocabulary(word, context = '', customApiKey) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Chưa cấu hình Gemini API Key.');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    systemInstruction: `Bạn là từ điển Anh - Việt chuyên sâu. Trả về DUY NHẤT 1 JSON object có cấu trúc:
{"word":"...","ipa":"...","partOfSpeech":"...","meaning":"...","example":"...","exampleTranslation":"..."}`,
    generationConfig: { responseMimeType: 'application/json' }
  });

  let prompt = `Tra cứu từ vựng: "${word}"`;
  if (context) prompt += `\nNgữ cảnh trong câu: "${context}"`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  return JSON.parse(text);
}
```

---

### 5.2. Backend Service: Web Crawler (`crawlerService.js`)
```javascript
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function extractArticleFromUrl(targetUrl) {
  let cleanUrl = targetUrl.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) cleanUrl = 'https://' + cleanUrl;
  const validUrl = new URL(cleanUrl);

  const response = await fetch(validUrl.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) throw new Error(`Lỗi tải trang (${response.status}): Không thể cào bài viết.`);

  const html = await response.text();
  const doc = new JSDOM(html, { url: validUrl.toString() });
  const reader = new Readability(doc.window.document, { charThreshold: 50 });
  const article = reader.parse();

  let title = article?.title || doc.window.document.title || '';
  let paragraphs = [];

  if (article?.content) {
    const articleDoc = new JSDOM(article.content);
    articleDoc.window.document.querySelectorAll('p, h2, h3, blockquote').forEach((el) => {
      const t = el.textContent.trim();
      if (t.length > 20) paragraphs.push(t);
    });
  }

  if (paragraphs.length === 0) throw new Error('Không tìm thấy nội dung bài viết.');

  const formattedText = (title ? title + '\n\n' : '') + paragraphs.slice(0, 30).join('\n\n');
  return {
    title,
    siteName: validUrl.hostname.replace(/^www\./, ''),
    formattedText,
    wordCount: formattedText.split(/\s+/).length,
  };
}
```

---

### 5.3. Floating Word Popup Component (`WordPopup.jsx`)
```jsx
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, X, Sparkles, Loader2 } from 'lucide-react';

export default function WordPopup({ isOpen, position, word, data, isLoading, error, onClose }) {
  const popupRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(data?.word || word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const top = position.y - 12 < 60 ? position.y + 24 : position.y - 12;

  return (
    <div
      ref={popupRef}
      className="vocab-popup"
      style={{ top: `${top}px`, left: `${Math.min(window.innerWidth - 180, Math.max(180, position.x))}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="popup-header">
        <div className="popup-word-group">
          <span className="popup-word">{data?.word || word}</span>
          <button className={`popup-sound-btn ${isPlayingAudio ? 'playing' : ''}`} onClick={handlePlayAudio}>
            <Volume2 size={16} />
          </button>
        </div>
        <button className="popup-close-btn" onClick={onClose}><X size={15} /></button>
      </div>

      <div className="popup-body">
        {isLoading ? (
          <div className="popup-loading"><Loader2 size={18} className="spin" /><span>Đang tra cứu từ vựng...</span></div>
        ) : error ? (
          <div className="popup-error"><span>{error}</span></div>
        ) : data ? (
          <>
            <div className="popup-meta-row">
              {data.ipa && <span className="popup-ipa">{data.ipa}</span>}
              {data.partOfSpeech && <span className="popup-pos-badge">{data.partOfSpeech}</span>}
            </div>
            <div className="popup-meaning">
              <strong>Nghĩa: </strong><span>{data.meaning}</span>
            </div>
            {data.example && (
              <div className="popup-example-box">
                <div className="example-en">"{data.example}"</div>
                {data.exampleTranslation && <div className="example-vi">{data.exampleTranslation}</div>}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
```

---

## 6. HƯỚNG DẪN CÁC BƯỚC TÍCH HỢP TÍNH NĂNG VÀO WEBSITE CỦA BẠN (INTEGRATION STEPS)

Khi cung cấp tài liệu này cho AI khác, hãy yêu cầu AI thực hiện theo các bước sau:

1. **Bước 1: Cài đặt Dependencies**
   - Backend: `npm install express cors dotenv @google/generative-ai @mozilla/readability jsdom`
   - Frontend: `npm install lucide-react`
2. **Bước 2: Tạo các API Services phía Backend**
   - Thêm `crawlerService.js` (xử lý cào bài báo từ URL).
   - Thêm `geminiService.js` (xử lý dịch song ngữ và tra từ vựng qua Google Gemini).
   - Thêm `ttsService.js` (xử lý Google AI Studio TTS và convert PCM sang WAV).
   - Đăng ký các endpoints trong `server.js` hoặc Router chính (`/api/translate`, `/api/crawl`, `/api/lookup-word`, `/api/tts`, `/api/voices`, `/api/health`).
3. **Bước 3: Tạo các Components phía Frontend**
   - `UrlBar.jsx`: Thanh nhập URL và nút cào dữ liệu.
   - `SourcePane.jsx`: Cột bài đọc tiếng Anh, hỗ trợ Textarea & Reader Mode, bắt sự kiện bôi đen từ vựng và chọn giọng đọc AI.
   - `TargetPane.jsx`: Cột hiển thị bản dịch tiếng Việt song song theo từng đoạn văn bản.
   - `WordPopup.jsx`: Popup nổi thông minh hiển thị phiên âm, nghĩa, loại từ, câu ví dụ và nút phát âm.
   - `ApiKeyModal.jsx`: Modal nhập Custom API Key.
4. **Bước 4: Tích hợp State & Style**
   - Đặt Split Pane layout (2 cột bằng nhau trên Desktop, xếp chồng trên Mobile).
   - Đồng bộ lưu trạng thái (`fontSize`, `isSerif`, `theme`, `sourceText`, `translatedText`, `apiKey`) vào `localStorage`.
   - Thêm hiệu ứng Skeleton Shimmer khi đang chờ AI dịch bài.
5. **Bước 5: Kiểm thử (Verification)**
   - Thử dán một link bài báo tiếng Anh (ví dụ: BBC/CNN) -> Kiểm tra bài viết hiển thị sạch sẽ.
   - Bấm "Dịch sang tiếng Việt" -> Kiểm tra hai bên chia đúng từng đoạn văn.
   - Bôi đen một từ tiếng Anh -> Kiểm tra Popup tra nghĩa, phiên âm và nút nghe phát âm.
   - Bấm "Nghe bài đọc" -> Kiểm tra giọng đọc AI Studio phát âm mượt mà.

---
*Tài liệu được đóng gói hoàn chỉnh sẵn sàng cung cấp cho bất kỳ AI nào để tạo mới hoặc tích hợp tính năng ReadFlow vào website mục tiêu.*
