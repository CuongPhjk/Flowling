import { useEffect } from "react";
import {
  HashRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { DemoProvider, useDemo } from "./providers";
import { MainLayout } from "../layouts/MainLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { BrowsePage } from "../features/feed/pages/BrowsePage";
import { HistoryPage } from "../features/feed/pages/HistoryPage";
import { ArticlePage } from "../features/article/pages/ArticlePage";
import { MediaPage } from "../features/listening/pages/MediaPage";
import { VocabularyPage } from "../features/vocabulary/pages/VocabularyPage";
import { ReviewPage } from "../features/flashcard/pages/ReviewPage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { AuthPage } from "../features/auth/pages/AuthPage";
import { DashboardPage } from "../features/admin/pages/DashboardPage";
import { ContentEditorPage } from "../features/admin/pages/ContentEditorPage";
import { TranscriptEditorPage } from "../features/admin/pages/TranscriptEditorPage";
import { ReadFlowPage } from "../features/readflow/pages/ReadFlowPage";
import { Empty } from "../shared/components/ui";
function Guard({ admin = false }: { admin?: boolean }) {
  const { account } = useDemo();
  const location = useLocation();
  if (!account)
    return (
      <Navigate
        to={admin ? "/login?admin=1" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  if (admin && account.role !== "ADMIN")
    return <Navigate to="/login?admin=1" state={{ from: location }} replace />;
  return <Outlet />;
}
function Detail({ kind }: { kind: "article" | "media" }) {
  const { slug } = useParams();
  return kind === "article" ? (
    <ArticlePage key={slug} />
  ) : (
    <MediaPage key={slug} />
  );
}
function Editor({
  media = false,
  transcript = false,
}: {
  media?: boolean;
  transcript?: boolean;
}) {
  const { id } = useParams();
  return transcript ? (
    <TranscriptEditorPage key={id} />
  ) : (
    <ContentEditorPage key={id} media={media} />
  );
}
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export function AppRouter() {
  return (
    <DemoProvider>
      <HashRouter>
        <ScrollToTop />
        <a
          href="#main-content"
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("main-content")?.focus();
          }}
        >
          Đến nội dung chính
        </a>
        <Routes>
          <Route path="/login" element={<AuthPage key="login" />} />
          <Route
            path="/register"
            element={<AuthPage key="register" mode="register" />}
          />
          <Route
            path="/forgot-password"
            element={<AuthPage key="forgot" mode="forgot" />}
          />

          {/* Main Layout containing Public and Protected sub-routes */}
          <Route element={<MainLayout />}>
            {/* Public feeds */}
            <Route index element={<BrowsePage key="home" />} />
            <Route
              path="explore"
              element={<BrowsePage key="explore" mode="explore" />}
            />
            <Route path="readflow" element={<ReadFlowPage />} />

            {/* Protected features: watching/listening/reading & personal workspace */}
            <Route element={<Guard />}>
              <Route
                path="saved"
                element={<BrowsePage key="saved" mode="saved" />}
              />
              <Route path="history" element={<HistoryPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="vocabulary" element={<VocabularyPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="article/:slug" element={<Detail kind="article" />} />
              <Route path="podcast/:slug" element={<Detail kind="media" />} />
              <Route path="video/:slug" element={<Detail kind="media" />} />
            </Route>

            <Route
              path="*"
              element={
                <Empty
                  title="Trang này chưa có trên bản đồ"
                  description="Quay lại để tìm một câu chuyện mới."
                />
              }
            />
          </Route>

          <Route element={<Guard admin />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="article/:id" element={<Editor />} />
              <Route path="media/:id" element={<Editor media />} />
              <Route path="transcript/:id" element={<Editor transcript />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </DemoProvider>
  );
}
