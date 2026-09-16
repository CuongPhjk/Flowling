import type { Segment } from "../../../shared/types/demo";
export function timestamp(value: string): number {
  const clean = value.trim().replace(",", ".");
  const parts = clean.split(":").map(Number);
  if (parts.some((n) => !Number.isFinite(n)))
    throw Error("Mốc thời gian không hợp lệ.");
  return Math.round(parts.reduce((sum, n) => sum * 60 + n, 0) * 1000);
}
export function importTranscript(text: string): Segment[] {
  const source = text.replace(/^\uFEFF/, "").replace(/\r/g, "");
  const rows: Segment[] = [];
  if (/\[\d+:\d+[.:]\d+\]/.test(source)) {
    for (const line of source.split("\n")) {
      const stamps = [...line.matchAll(/\[(\d+:\d+(?:[.:]\d+)?)\]/g)];
      const english = line.replace(/\[[^\]]+\]/g, "").trim();
      for (const stamp of stamps) {
        rows.push({
          id: crypto.randomUUID(),
          startMs: timestamp(
            stamp[1].replace(/:(\d+)$/, (match, dec) =>
              stamp[1].split(":").length === 3 ? `.${dec}` : match,
            ),
          ),
          endMs: 0,
          englishText: english,
          vietnameseText: "",
          position: rows.length,
        });
      }
    }
    rows.sort((a, b) => a.startMs - b.startMs);
    rows.forEach((r, i) => {
      r.endMs = rows[i + 1]?.startMs || r.startMs + 5000;
      r.position = i;
    });
  } else {
    for (const block of source.split(/\n\s*\n/)) {
      const lines = block.split("\n");
      const timeIndex = lines.findIndex((l) => l.includes("-->"));
      if (timeIndex < 0) continue;
      const [start, end] = lines[timeIndex].split("-->");
      rows.push({
        id: crypto.randomUUID(),
        startMs: timestamp(start.trim()),
        endMs: timestamp(end.trim().split(/\s+/)[0]),
        englishText: lines
          .slice(timeIndex + 1)
          .join(" ")
          .replace(/<[^>]*>/g, "")
          .trim(),
        vietnameseText: "",
        position: rows.length,
      });
    }
  }
  if (!rows.length)
    throw Error("Không tìm thấy phân đoạn. Chọn tệp SRT, VTT hoặc LRC hợp lệ.");
  return rows;
}
export function validateSegments(
  rows: Segment[],
  duration: number,
  requireTranslation = false,
): string {
  if (!rows.length) return "Thêm ít nhất một phân đoạn trước khi xuất bản.";
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (
      !Number.isInteger(r.startMs) ||
      !Number.isInteger(r.endMs) ||
      r.startMs < 0 ||
      r.endMs <= r.startMs
    )
      return `Đoạn ${i + 1}: cần 0 ≤ bắt đầu < kết thúc (mili-giây).`;
    if (i && r.startMs < rows[i - 1].endMs)
      return `Đoạn ${i + 1}: thời gian chồng lên đoạn trước.`;
    if (duration && r.endMs > duration * 1000 + 100)
      return `Đoạn ${i + 1}: vượt thời lượng media.`;
    if (
      !r.englishText.trim() ||
      (requireTranslation && !r.vietnameseText.trim())
    )
      return `Đoạn ${i + 1}: bổ sung nội dung ${!r.englishText.trim() ? "tiếng Anh" : "tiếng Việt"}.`;
  }
  return "";
}

export async function translateSingleText(text: string): Promise<string> {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";

  // 1. Google Translate GTX
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((chunk: any) => chunk[0]).join("").trim();
        if (translated) return translated;
      }
    }
  } catch (err) {
    // Fallback below
  }

  // 2. MyMemory Translation Fallback
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|vi`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        return data.responseData.translatedText.trim();
      }
    }
  } catch (err) {
    // Continue
  }

  return "";
}

export async function translateSegments(
  segments: Segment[],
  onProgress?: (completed: number, total: number) => void,
): Promise<Segment[]> {
  const result: Segment[] = segments.map((s) => ({ ...s }));
  const toTranslateIndices: number[] = [];

  for (let i = 0; i < result.length; i++) {
    if (!result[i].vietnameseText?.trim() && result[i].englishText?.trim()) {
      toTranslateIndices.push(i);
    }
  }

  if (toTranslateIndices.length === 0) {
    onProgress?.(segments.length, segments.length);
    return result;
  }

  const BATCH_SIZE = 15;
  let completed = 0;

  for (let b = 0; b < toTranslateIndices.length; b += BATCH_SIZE) {
    const batchIndices = toTranslateIndices.slice(b, b + BATCH_SIZE);
    const batchTexts = batchIndices.map((idx) =>
      result[idx].englishText.replace(/\s+/g, " ").trim(),
    );

    let batchSuccess = false;
    try {
      const combinedText = batchTexts.join("\n");
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(combinedText)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translatedCombined = data[0]
            .map((chunk: any) => chunk[0])
            .join("");
          const translatedLines = translatedCombined
            .split("\n")
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0);

          if (translatedLines.length === batchIndices.length) {
            for (let i = 0; i < batchIndices.length; i++) {
              result[batchIndices[i]].vietnameseText = translatedLines[i];
            }
            batchSuccess = true;
          }
        }
      }
    } catch {
      batchSuccess = false;
    }

    if (!batchSuccess) {
      await Promise.all(
        batchIndices.map(async (idx) => {
          const trans = await translateSingleText(result[idx].englishText);
          if (trans) {
            result[idx].vietnameseText = trans;
          }
        }),
      );
    }

    completed += batchIndices.length;
    onProgress?.(completed, toTranslateIndices.length);
  }

  return result;
}

