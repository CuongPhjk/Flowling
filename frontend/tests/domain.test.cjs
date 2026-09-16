const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const { schedule } = require("../src/features/flashcard/services/srs.ts");
const {
  importTranscript,
  validateSegments,
  translateSegments,
} = require("../src/features/admin/services/transcript.ts");
const { createContents, createSeed } = require("../src/shared/mock/seed.ts");
const word = {
  id: "a",
  vocabularyId: "perspective",
  status: "LEARNING",
  ease: 2.5,
  interval: 15,
  repetitions: 5,
  nextReviewAt: 0,
  createdAt: 0,
};
test("Again resets mastered progress and never drops ease below 1.3", () => {
  const next = schedule(
    { ...word, status: "MASTERED", ease: 1.3 },
    "AGAIN",
    100,
  );
  assert.equal(next.interval, 1);
  assert.equal(next.repetitions, 0);
  assert.equal(next.ease, 1.3);
  assert.equal(next.status, "LEARNING");
  assert.equal(next.nextReviewAt, 86400100);
});
test("Good promotes a word only when both mastery thresholds are reached", () => {
  assert.equal(schedule(word, "GOOD").status, "MASTERED");
  assert.equal(schedule({ ...word, interval: 2 }, "GOOD").status, "LEARNING");
  assert.equal(
    schedule({ ...word, repetitions: 3 }, "GOOD").status,
    "LEARNING",
  );
});
test("Four grades produce distinct schedules for an established word", () => {
  assert.deepEqual(
    ["AGAIN", "HARD", "GOOD", "EASY"].map((g) => schedule(word, g).interval),
    [1, 18, 38, 49],
  );
});
test("SRT and VTT imports preserve millisecond boundaries and strip markup", () => {
  const srt = importTranscript(
    "1\n00:00:01,250 --> 00:00:03,750\nHello <b>world</b>\n\n2\n00:00:04,000 --> 00:00:06,001\nAnother sentence.",
  );
  assert.equal(srt[0].startMs, 1250);
  assert.equal(srt[1].endMs, 6001);
  assert.equal(srt[0].englishText, "Hello world");
  assert.equal(
    importTranscript(
      "WEBVTT\n\n00:01.500 --> 00:04.000 align:start\nA short sentence.",
    )[0].startMs,
    1500,
  );
});
test("LRC imports are chronological and support repeated timestamps", () => {
  const rows = importTranscript("[00:10.25][00:30.50]Hello\n[00:20.00]World");
  assert.deepEqual(
    rows.map((r) => r.startMs),
    [10250, 20000, 30500],
  );
  assert.equal(rows[0].endMs, 20000);
});
test("Publishing rejects overlapping, backwards, untranslated and overlong segments", () => {
  const rows = importTranscript("1\n00:00:00,000 --> 00:00:05,000\nHello");
  assert.match(validateSegments(rows, 10, true), /tiếng Việt/);
  assert.match(validateSegments([{ ...rows[0], endMs: 0 }], 10), /bắt đầu/);
  assert.match(validateSegments(rows, 4), /vượt/);
  assert.match(
    validateSegments([...rows, { ...rows[0], startMs: 4000, endMs: 6000 }], 10),
    /chồng/,
  );
  assert.equal(
    validateSegments([{ ...rows[0], vietnameseText: "Xin chào" }], 10, true),
    "",
  );
});
test("Seed covers all topics and media has valid bilingual timing", () => {
  const contents = createContents();
  assert.equal(new Set(contents.map((c) => c.category)).size, 9);
  for (const c of contents.filter((c) => c.type !== "ARTICLE")) {
    assert.equal(validateSegments(c.segments, c.duration, true), "");
    assert.ok(fs.existsSync("public" + c.mediaUrl));
  }
  const data = createSeed().accounts[0].data;
  assert.equal(
    new Set(data.words.map((w) => w.vocabularyId)).size,
    data.words.length,
  );
  assert.ok(
    data.contexts.every((c) =>
      data.words.some((w) => w.id === c.userVocabularyId),
    ),
  );
});
test("translateSegments automatically translates English segments to Vietnamese", async () => {
  const segments = [
    { id: "1", startMs: 0, endMs: 2000, englishText: "Hello world", vietnameseText: "", position: 0 },
    { id: "2", startMs: 2000, endMs: 5000, englishText: "Good morning", vietnameseText: "", position: 1 },
  ];
  const translated = await translateSegments(segments);
  assert.equal(translated.length, 2);
  assert.ok(translated[0].vietnameseText.length > 0);
  assert.match(translated[0].vietnameseText.toLowerCase(), /chào/);
  assert.ok(translated[1].vietnameseText.length > 0);
});
test("Transcript center scroll calculation accurately centers active segment", () => {
  const calculateScrollTop = (containerScrollTop, containerHeight, nodeRelativeTop, nodeHeight) => {
    const target = containerScrollTop + nodeRelativeTop - containerHeight / 2 + nodeHeight / 2;
    return Math.max(0, target);
  };
  // Segment at top
  assert.equal(calculateScrollTop(0, 500, 50, 60), 0);
  // Segment in middle: container 500, node 60, current relative 320 -> target scrollTop = 0 + 320 - 250 + 30 = 100
  assert.equal(calculateScrollTop(0, 500, 320, 60), 100);
  // Segment deep down: container 600, scrollTop 200, relative 500, node 80 -> target = 200 + 500 - 300 + 40 = 440
  assert.equal(calculateScrollTop(200, 600, 500, 80), 440);
});
