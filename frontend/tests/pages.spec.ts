import { test, expect } from "@playwright/test";
import path from "node:path";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
});

test("uploaded media survives reload and can be published with imported transcript", async ({
  page,
}) => {
  await page.goto("/#/login?admin=1");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Flowling123!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.goto("/#/admin/media/new?type=PODCAST");
  await page.getByLabel("Tiêu đề", { exact: true }).fill("Local Upload Story");
  await page
    .locator('input[type=file][accept="audio/*,video/mp4,video/webm"]')
    .setInputFiles(path.resolve("public/media/pod-habits.wav"));
  await expect
    .poll(() =>
      page.locator("audio").evaluate((el: HTMLAudioElement) => el.duration),
    )
    .toBeGreaterThan(10);
  await page.getByRole("button", { name: "Lưu & Soạn transcript →" }).click();
  await expect(page).toHaveURL(/admin\/transcript\//);
  await page
    .locator('input[type=file][accept=".srt,.vtt,.lrc"]')
    .setInputFiles({
      name: "story.srt",
      mimeType: "text/plain",
      buffer: Buffer.from(
        "1\n00:00:00,000 --> 00:00:05,000\nA short sample sentence.\n\n2\n00:00:05,000 --> 00:00:10,000\nA second sample sentence.",
      ),
    });
  await page
    .locator(".segment-editor")
    .nth(0)
    .getByLabel("Vietnamese", { exact: true })
    .fill("Một câu mẫu ngắn.");
  await page
    .locator(".segment-editor")
    .nth(1)
    .getByLabel("Vietnamese", { exact: true })
    .fill("Một câu mẫu thứ hai.");
  await page
    .locator(".segment-editor")
    .first()
    .getByRole("button", { name: "Cắt đôi", exact: true })
    .click();
  await expect(page.locator(".segment-editor")).toHaveCount(3);
  await page
    .locator(".segment-editor")
    .first()
    .getByRole("button", { name: "Gộp tiếp", exact: true })
    .click();
  await expect(page.locator(".segment-editor")).toHaveCount(2);
  await page.screenshot({
    path: "test-results/transcript-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Lưu & Xuất bản lên Feed →" }).click();
  await expect(page).toHaveURL(/#\/admin$/);
  await page.goto("/#/podcast/local-upload-story");
  await page.reload();
  await expect
    .poll(() =>
      page.locator("audio").evaluate((el: HTMLAudioElement) => el.readyState),
    )
    .toBeGreaterThan(0);
  await expect(page.locator(".transcript-segment")).toHaveCount(2);
});

test("profile theme persists and authentication recovery has a working demo flow", async ({
  page,
}) => {
  await page.goto("/#/profile");
  await page.getByLabel("Giao diện", { exact: false }).selectOption("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({
    path: "test-results/profile-dark.png",
    fullPage: true,
  });
  await page.goto("/#/forgot-password");
  await page.getByLabel("Email", { exact: true }).fill("minh@flowling.demo");
  await page
    .getByRole("button", { name: "Tiếp tục đặt lại mật khẩu", exact: true })
    .click();
  await page.getByLabel("Mật khẩu mới", { exact: true }).fill("Updated123!");
  await page
    .getByRole("button", { name: "Lưu mật khẩu mới", exact: true })
    .click();
  await expect(page).toHaveURL(/login/);
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Updated123!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(/#\/$/);
});

test("Google Sign-In gives a clear setup state when no client ID is configured", async ({
  page,
}) => {
  await page.goto("/#/login");
  await expect(
    page.getByText("Google Sign-In chưa được cấu hình cho môi trường này."),
  ).toBeVisible();
});
test("all user pages render, browser back works, mobile has no horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/",
    "/explore",
    "/readflow",
    "/saved",
    "/history",
    "/review",
    "/vocabulary",
    "/profile",
    "/article/art-mars",
    "/podcast/pod-habits",
    "/video/vid-ocean",
  ]) {
    await page.goto("/#" + route);
    await expect(page.locator("main h1")).toBeVisible();
  }
  await page.goto("/#/");
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Khám phá", exact: true }).click();
  await expect(page).toHaveURL(/explore/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/$/);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/explore",
    "/readflow",
    "/vocabulary",
    "/profile",
    "/article/art-mars",
    "/video/vid-ocean",
  ]) {
    await page.goto("/#" + route);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBeTruthy();
  }
  await page.goto("/#/");
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("bookmarks persist across routes and reload, Explore filters by topic", async ({
  page,
}) => {
  await page
    .getByRole("button", {
      name: "Lưu Could Humans Really Live on Mars?",
      exact: true,
    })
    .click();
  await page.goto("/#/saved");
  await expect(
    page
      .locator(".content-card")
      .filter({ hasText: "Could Humans Really Live on Mars?" }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page
      .locator(".content-card")
      .filter({ hasText: "Could Humans Really Live on Mars?" }),
  ).toHaveCount(0);
  await page.goto("/#/explore?topic=science");
  await expect(page.locator(".content-card")).toHaveCount(1);
  await expect(page.locator(".content-card")).toContainText("Mars");
});
test("article modes, vocabulary context deduplication, new word save and drawer", async ({
  page,
}) => {
  await page.goto("/#/article/art-mars");
  await page.getByRole("button", { name: "Bilingual", exact: true }).click();
  await expect(page.locator(".reader-body .translation").first()).toBeVisible();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page
    .locator('.reader-body [role="button"]')
    .filter({ hasText: /^perspective$/ })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Đã gặp/ })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Bạn đã gặp từ này");
  await page.getByRole("button", { name: "Đóng", exact: true }).click();
  const before = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("flowling-demo-v1")!).accounts[0].data
        .contexts.length,
  );
  await page.reload();
  await expect(page.locator(".reader-body")).toBeVisible();
  const after = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("flowling-demo-v1")!).accounts[0].data
        .contexts.length,
  );
  expect(after).toBe(before);
  await page
    .locator('.reader-body [role="button"]')
    .filter({ hasText: /^sky$/ })
    .first()
    .click();
  await page.getByPlaceholder("Nhập nghĩa tiếng Việt").fill("bầu trời");
  await page
    .getByRole("button", { name: "+ Lưu vào sổ từ", exact: true })
    .click();
  await page.goto("/#/vocabulary");
  await page.getByPlaceholder("Tìm từ, nghĩa hoặc ngữ cảnh…").fill("sky");
  await expect(
    page
      .locator(".word-card")
      .filter({ has: page.getByRole("button", { name: "sky", exact: true }) }),
  ).toContainText("bầu trời");
});
test("review has gated grades, Again requeues and completion updates due count", async ({
  page,
}) => {
  await page.goto("/#/review");
  await page.getByRole("button", { name: "Bắt đầu ôn tập →" }).click();
  await expect(page.locator(".grade-good")).toBeDisabled();
  await page.locator(".flashcard").click();
  await page.locator(".grade-again").click();
  await expect(page.locator(".review-session")).toContainText("Thẻ 2 / 13");
  for (let i = 0; i < 12; i++) {
    await page.locator(".flashcard").click();
    await page.waitForTimeout(220);
    await page.locator(".grade-good").click();
  }
  await expect(page.locator(".review-complete")).toContainText("+24 XP");
  await page.getByRole("button", { name: "Quay lại Feed lướt tiếp →" }).click();
  await expect(page).toHaveURL(/#\/$/);
  await page.goto("/#/review");
  await expect(page.locator(".review-intro")).toContainText("Bạn đã sẵn sàng");
});
test("podcast plays, seeks, translates, loops and saves sentence", async ({
  page,
}) => {
  await page.goto("/#/podcast/pod-habits?t=0");
  await expect
    .poll(() =>
      page.locator("audio").evaluate((el: HTMLAudioElement) => el.readyState),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Phát", exact: true }).click();
  await expect
    .poll(() =>
      page.locator("audio").evaluate((el: HTMLAudioElement) => el.currentTime),
    )
    .toBeGreaterThan(0.2);
  await page.getByRole("button", { name: "EN + VI", exact: true }).click();
  await expect(page.locator(".translation").first()).toBeVisible();
  await page
    .locator(".transcript-segment")
    .nth(1)
    .locator(".timestamp")
    .click();
  await expect(page.locator(".transcript-segment").nth(1)).toHaveClass(
    /active-segment/,
  );
  await page
    .locator(".transcript-segment")
    .nth(1)
    .getByRole("button", { name: "↻ Nghe lại câu" })
    .click();
  await expect(
    page.getByRole("button", { name: /Đang lặp câu/ }),
  ).toBeVisible();
  await page
    .locator(".transcript-segment")
    .nth(1)
    .getByRole("button", { name: "＋ Lưu câu" })
    .click();
  await page.goto("/#/vocabulary");
  await page.getByRole("button", { name: "Câu tâm đắc", exact: true }).click();
  await expect(page.locator("main")).toContainText(
    "Consistency matters more than intensity.",
  );
});
test("registration, profile, logout and login preserve account-specific data", async ({
  page,
}) => {
  await page.goto("/#/register");
  await page.getByLabel("Tên của bạn", { exact: true }).fill("An Demo");
  await page.getByLabel("Email", { exact: true }).fill("an@example.test");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Example123!");
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await expect(page.locator("main h1")).toContainText("An");
  await page.goto("/#/profile");
  await page.getByRole("button", { name: "Chỉnh sửa hồ sơ" }).click();
  await page.getByLabel("Tên hiển thị").fill("An Mới");
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await page
    .getByRole("button", { name: "Đăng xuất", exact: true })
    .last()
    .click();
  await expect(page).toHaveURL(/login/);
  await page.getByLabel("Email", { exact: true }).fill("an@example.test");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Example123!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.goto("/#/profile");
  await expect(page.locator(".profile-banner")).toContainText("An Mới");
});
test("admin guard, article CRUD, draft visibility and transcript validation", async ({
  page,
}) => {
  await page.goto("/#/admin");
  await expect(page).toHaveURL(/login\?admin/);
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Flowling123!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(/#\/admin$/);
  await page.screenshot({
    path: "test-results/admin-desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Tạo bài viết", exact: true }).click();
  await page.getByLabel("Tiêu đề", { exact: true }).fill("A Brand New Story");
  await page
    .getByLabel("Nội dung English", { exact: true })
    .fill("A new perspective makes life remarkable.");
  await page
    .getByLabel("Bản dịch Vietnamese", { exact: true })
    .fill("Một góc nhìn mới khiến cuộc sống đáng chú ý.");
  await page
    .getByLabel("Mô tả ngắn", { exact: true })
    .fill("A story created in the editor.");
  await page.getByRole("button", { name: "Lưu nháp", exact: true }).click();
  await expect(page.locator("tbody")).toContainText("A Brand New Story");
  await page.goto("/#/");
  await expect(
    page.locator(".content-card").filter({ hasText: "A Brand New Story" }),
  ).toHaveCount(0);
  await page.goto("/#/admin");
  await page
    .locator("tr")
    .filter({ hasText: "A Brand New Story" })
    .getByRole("button", { name: "Bản nháp", exact: true })
    .click();
  await page.goto("/#/");
  await expect(
    page.locator(".content-card").filter({ hasText: "A Brand New Story" }),
  ).toBeVisible();
  await page.goto("/#/admin/transcript/pod-habits");
  await page.getByLabel("Kết thúc đoạn 1", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Lưu & Xuất bản lên Feed →" }).click();
  await expect(page.getByRole("alert")).toContainText("bắt đầu");
  await page.goto("/#/admin");
  await page
    .getByRole("button", { name: "Xóa A Brand New Story", exact: true })
    .click();
  await page.getByRole("button", { name: "Xóa nội dung", exact: true }).click();
  await expect(page.locator("tbody")).not.toContainText("A Brand New Story");
});

test("readflow bilingual assistant, sample selection, word popup lookup and api key modal work", async ({
  page,
}) => {
  await page.goto("/#/readflow");
  await expect(page.locator("h1")).toContainText("ReadFlow");
  await expect(page.locator(".readflow-source-pane")).toBeVisible();
  await expect(page.locator(".readflow-target-pane")).toBeVisible();

  // Test Sample Article Picker
  await page.getByRole("button", { name: "Bài mẫu", exact: true }).click();
  await expect(page.locator(".sample-menu-dropdown")).toBeVisible();
  await page.getByText("How Small Daily Habits Create Remarkable Changes").click();
  await expect(page.locator(".source-reader-view")).toContainText("Changes that seem small");

  // Test Font Size & Serif
  await page.getByRole("button", { name: "Đổi cỡ chữ", exact: true }).click();
  await page.getByRole("button", { name: "Chuyển đổi kiểu chữ Sách / Tiêu chuẩn", exact: true }).click();
  await expect(page.locator(".readflow-source-pane .font-serif")).toBeVisible();

  // Test Word Lookup Popup
  await page
    .locator('.source-reader-view [role="button"]')
    .filter({ hasText: /^habits$/ })
    .first()
    .click();
  await expect(page.locator(".readflow-vocab-popup")).toBeVisible();
  await expect(page.locator(".popup-word-title")).toContainText("habits");
  
  // Test Save to Vocabulary
  await page.locator(".btn-save-vocab").click();
  await expect(page.locator(".btn-save-vocab")).toContainText("Đã có trong sổ từ");
  await page.locator(".popup-close-icon").click();
  await expect(page.locator(".readflow-vocab-popup")).not.toBeVisible();

  // Test API Key Modal
  await page.getByRole("button", { name: "Cài đặt Google Gemini API Key", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Cài đặt Gemini AI Key");
  await page.getByPlaceholder("AIzaSy...").fill("AIzaSy_Demo_Test_Key_123");
  await page.getByRole("button", { name: "Lưu cấu hình", exact: true }).click();
  await expect(page.getByRole("button", { name: /Gemini Key/ })).toBeVisible();

  // Test Mode Switching (Editor vs Reader)
  await page.getByRole("button", { name: "Chỉnh sửa", exact: true }).click();
  await expect(page.locator(".source-textarea")).toBeVisible();
  await page.getByRole("button", { name: "Đọc hiểu", exact: true }).click();
  await expect(page.locator(".source-reader-view")).toBeVisible();

  // Test screenshot
  await page.screenshot({
    path: "test-results/readflow-desktop.png",
    fullPage: true,
  });
});

