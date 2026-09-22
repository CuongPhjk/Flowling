import { ContentDetail, ContentSummary } from "./contentApi";
import { CreateContentPayload } from "./adminApi";
import type { Content, Difficulty, Segment } from "../types/demo";

export function toDemoContent(c: ContentSummary): Content {
  const diffMap: Record<string, Difficulty> = {
    EASY: "Easy",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
  };
  return {
    id: String(c.id),
    slug: c.slug,
    title: c.title,
    teaser: c.description,
    type: c.type,
    category: (c.category || "science").toLowerCase(),
    difficulty: diffMap[c.difficulty] || "Easy",
    thumbnail: c.thumbnailUrl,
    duration: c.durationSeconds || 0,
    likes: 0,
    author: "Flowling Editorial",
    publishedAt: c.publishedAt ? new Date(c.publishedAt).getTime() : Date.now(),
    status: c.status,
    paragraphs: [],
    segments: [],
    mediaUrl: c.mediaUrl || "",
  };
}

export function toDemoDetail(c: ContentDetail): Content {
  const base = toDemoContent(c);
  if (c.article) {
    const english = (c.article.englishBody || "")
      .split(/\n\s*\n/)
      .filter((p) => p.trim());
    const vietnamese = (c.article.vietnameseBody || "").split(/\n\s*\n/);
    base.paragraphs = english.map((en, i) => ({
      en: en.trim(),
      vi: (vietnamese[i] || "").trim(),
    }));
  }
  if (c.transcriptSegments && c.transcriptSegments.length > 0) {
    base.segments = c.transcriptSegments.map((s) => ({
      id: String(s.id),
      startMs: s.startMs,
      endMs: s.endMs,
      englishText: s.englishText,
      vietnameseText: s.vietnameseText || "",
      position: s.position,
    }));
  }
  return base;
}

export function toCreateContentPayload(
  content: Content,
  enBody: string,
  viBody: string,
): CreateContentPayload {
  const diffMap: Record<string, "EASY" | "INTERMEDIATE" | "ADVANCED"> = {
    easy: "EASY",
    intermediate: "INTERMEDIATE",
    advanced: "ADVANCED",
  };

  const payload: CreateContentPayload = {
    type: content.type,
    title: content.title.trim(),
    slug: content.slug.trim(),
    description: (content.teaser || content.title).trim(),
    thumbnailUrl:
      content.thumbnail ||
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800",
    mediaUrl: content.mediaUrl || undefined,
    durationSeconds: content.duration || 0,
    difficulty: diffMap[content.difficulty.toLowerCase()] || "EASY",
    category: content.category || "Science",
    status: content.status || "DRAFT",
  };

  if (content.type === "ARTICLE") {
    payload.englishBody = enBody;
    payload.vietnameseBody = viBody;
  } else if (content.segments && content.segments.length > 0) {
    payload.transcriptSegments = content.segments.map((s, idx) => ({
      startMs: s.startMs,
      endMs: s.endMs,
      englishText: s.englishText,
      vietnameseText: s.vietnameseText,
      position: idx,
    }));
  }

  return payload;
}
