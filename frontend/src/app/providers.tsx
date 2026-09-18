import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPersonal, createSeed, dayKey } from "../shared/mock/seed";
import { schedule } from "../features/flashcard/services/srs";
import { authApi } from "../shared/api/authApi";
import type {
  Content,
  DemoState,
  Grade,
  PersonalData,
  Vocabulary,
  VocabularyContext,
} from "../shared/types/demo";

export const GUEST_PERSONAL: PersonalData = {
  profile: {
    name: "Khách",
    email: "",
    avatar: "",
    streak: 0,
    xp: 0,
    activity: {},
    speed: 1,
    theme: "light",
    reading: "English",
  },
  saved: [],
  liked: [],
  words: [],
  contexts: [],
  progress: [],
  sentences: [],
  snoozeUntil: 0,
  reviewsToday: {},
};

const STORAGE_KEY = "flowling-demo-v1";
export const uid = () => crypto.randomUUID();
export async function digest(value: string) {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
function load(): DemoState {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (
      value?.version === 1 &&
      Array.isArray(value.accounts) &&
      Array.isArray(value.contents) &&
      Array.isArray(value.vocabulary)
    ) {
      const session = sessionStorage.getItem("flowling-session");
      const remembered = localStorage.getItem("flowling-remember") === "yes";
      const token = localStorage.getItem("flowling_jwt_token");
      const activeId = session || (remembered && token ? value.currentAccountId : null);
      return { 
        ...value, 
        currentAccountId: activeId && activeId !== "demo-user" ? activeId : null 
      };
    }
  } catch {}
  return createSeed();
}
function reward(
  data: PersonalData,
  xp: number,
  qualifies = false,
): PersonalData {
  const today = dayKey(),
    yesterday = dayKey(new Date(Date.now() - 86400000));
  const first = qualifies && !data.profile.activity[today];
  return {
    ...data,
    profile: {
      ...data.profile,
      xp: data.profile.xp + xp,
      streak: first
        ? data.profile.activity[yesterday]
          ? data.profile.streak + 1
          : 1
        : data.profile.streak,
      activity: qualifies
        ? {
            ...data.profile.activity,
            [today]: (data.profile.activity[today] || 0) + Math.max(1, xp),
          }
        : data.profile.activity,
    },
  };
}
function useDemoState() {
  const [state, setState] = useState<DemoState>(load);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState("");
  const account = state.accounts.find((a) => a.id === state.currentAccountId);
  const data = account?.data || GUEST_PERSONAL;
  useEffect(() => {
    try {
      const persist = localStorage.getItem("flowling-remember") !== "no";
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...state,
          currentAccountId: persist ? state.currentAccountId : null,
        }),
      );
      setStorageError("");
    } catch {
      setStorageError(
        "Bộ nhớ trình duyệt đã đầy. Thay đổi hiện tại chỉ được giữ trong phiên này.",
      );
    }
  }, [state]);
  useEffect(() => {
    document.documentElement.dataset.theme = data?.profile.theme || "light";
  }, [data?.profile.theme]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  const updatePersonal = (fn: (p: PersonalData) => PersonalData) =>
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) =>
        a.id === s.currentAccountId ? { ...a, data: fn(a.data) } : a,
      ),
    }));
  const toggleSave = (id: string) =>
    updatePersonal((p) => ({
      ...p,
      saved: p.saved.includes(id)
        ? p.saved.filter((x) => x !== id)
        : [id, ...p.saved],
    }));
  const toggleLike = (id: string) =>
    updatePersonal((p) => ({
      ...p,
      liked: p.liked.includes(id)
        ? p.liked.filter((x) => x !== id)
        : [...p.liked, id],
    }));
  const saveWord = (
    entry: Vocabulary,
    context: Omit<VocabularyContext, "id" | "userVocabularyId" | "createdAt">,
  ) => {
    setState((s) => {
      const normalized = entry.word.trim().toLowerCase();
      const global = s.vocabulary.find(
        (v) => v.word.toLowerCase() === normalized,
      ) || { ...entry, id: uid(), word: normalized };
      return {
        ...s,
        vocabulary: s.vocabulary.some((v) => v.id === global.id)
          ? s.vocabulary
          : [...s.vocabulary, global],
        accounts: s.accounts.map((a) => {
          if (a.id !== s.currentAccountId) return a;
          let p = a.data;
          const existing = p.words.find((w) => w.vocabularyId === global.id);
          const word = existing || {
            id: uid(),
            vocabularyId: global.id,
            status: "LEARNING" as const,
            ease: 2.5,
            interval: 1,
            repetitions: 0,
            nextReviewAt: Date.now(),
            createdAt: Date.now(),
          };
          const repeated = p.contexts.some(
            (c) =>
              c.userVocabularyId === word.id &&
              c.contentId === context.contentId &&
              c.sentence === context.sentence,
          );
          if (!existing) p = reward({ ...p, words: [word, ...p.words] }, 5);
          return {
            ...a,
            data: {
              ...p,
              contexts: repeated
                ? p.contexts.map((c) =>
                    c.userVocabularyId === word.id &&
                    c.contentId === context.contentId &&
                    c.sentence === context.sentence
                      ? {
                          ...c,
                          ...(context.note.trim()
                            ? { note: context.note }
                            : {}),
                          ...(context.startMs !== undefined
                            ? { startMs: context.startMs, endMs: context.endMs }
                            : {}),
                        }
                      : c,
                  )
                : [
                    ...p.contexts,
                    {
                      ...context,
                      id: uid(),
                      userVocabularyId: word.id,
                      createdAt: Date.now(),
                    },
                  ],
            },
          };
        }),
      };
    });
  };
  const track = (
    content: Content,
    percent: number,
    position: number,
    seconds: number,
  ) =>
    updatePersonal((p) => {
      const old = p.progress.find((x) => x.contentId === content.id);
      const totalSeconds = (old?.seconds || 0) + seconds;
      const qualifies =
        content.type === "ARTICLE"
          ? percent > 80 && totalSeconds > 45
          : percent > 50;
      let next = {
        ...p,
        progress: [
          ...p.progress.filter((x) => x.contentId !== content.id),
          {
            contentId: content.id,
            percent: Math.max(old?.percent || 0, percent),
            position,
            seconds: totalSeconds,
            updatedAt: Date.now(),
            rewarded: old?.rewarded || qualifies,
          },
        ],
      };
      if (qualifies && !old?.rewarded)
        next = reward(next, content.type === "ARTICLE" ? 20 : 25, true);
      return next;
    });
  const grade = (id: string, value: Grade, award = true) =>
    updatePersonal((p) => {
      const today = dayKey();
      const count = (p.reviewsToday[today] || 0) + (award ? 1 : 0);
      return reward(
        {
          ...p,
          words: p.words.map((w) => (w.id === id ? schedule(w, value) : w)),
          reviewsToday: { ...p.reviewsToday, [today]: count },
        },
        award ? 2 : 0,
        count >= 5,
      );
    });
  const login = async (email: string, password: string, remember: boolean) => {
    const normalizedEmail = email.trim().toLowerCase();
    let userRole: "USER" | "ADMIN" = "USER";
    let accountId = "";
    let userName = "";

    try {
      const authRes = await authApi.login({ email: normalizedEmail, password });
      userRole = authRes.role === "ADMIN" ? "ADMIN" : "USER";
      accountId = String(authRes.id);
      userName = authRes.fullName || authRes.email.split("@")[0];
    } catch (apiErr: any) {
      const found = state.accounts.find((a) => a.email === normalizedEmail);
      if (
        !found ||
        (found.passwordHash === "demo"
          ? password !== "Flowling123!"
          : found.passwordHash !== (await digest(password)))
      ) {
        const message =
          apiErr?.response?.data?.message || "Email hoặc mật khẩu chưa đúng.";
        throw new Error(message);
      }
      userRole = found.role;
      accountId = found.id;
      userName = found.data.profile.name;
    }

    localStorage.setItem("flowling-remember", remember ? "yes" : "no");
    sessionStorage.setItem("flowling-session", accountId);

    setState((s) => {
      const existing = s.accounts.find(
        (a) => a.id === accountId || a.email === normalizedEmail
      );
      if (existing) {
        return {
          ...s,
          currentAccountId: existing.id,
          accounts: s.accounts.map((a) =>
            a.id === existing.id ? { ...a, role: userRole } : a
          ),
        };
      } else {
        const newAcc = {
          id: accountId,
          email: normalizedEmail,
          passwordHash: "",
          role: userRole,
          data: createPersonal(userName || normalizedEmail, normalizedEmail, false),
        };
        return {
          ...s,
          currentAccountId: accountId,
          accounts: [...s.accounts, newAcc],
        };
      }
    });

    return userRole;
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name.trim()) throw new Error("Nhập tên hiển thị của bạn.");
    if (password.length < 6) throw new Error("Mật khẩu cần ít nhất 6 ký tự.");
    const normalizedEmail = email.trim().toLowerCase();

    let accountId: string = uid();
    let userRole: "USER" | "ADMIN" = "USER";

    try {
      const authRes = await authApi.register({
        fullName: name.trim(),
        email: normalizedEmail,
        password,
      });
      accountId = String(authRes.id);
      userRole = authRes.role === "ADMIN" ? "ADMIN" : "USER";
    } catch (apiErr: any) {
      if (apiErr?.response?.data?.message) {
        throw new Error(apiErr.response.data.message);
      }
      if (state.accounts.some((a) => a.email === normalizedEmail)) {
        throw new Error("Email này đã có tài khoản.");
      }
    }

    const passwordHash = await digest(password);
    sessionStorage.setItem("flowling-session", accountId);
    localStorage.setItem("flowling-remember", "yes");

    setState((s) => ({
      ...s,
      currentAccountId: accountId,
      accounts: [
        ...s.accounts.filter((a) => a.email !== normalizedEmail),
        {
          id: accountId,
          email: normalizedEmail,
          passwordHash,
          role: userRole,
          data: createPersonal(name.trim(), normalizedEmail, false),
        },
      ],
    }));
  };

  const googleLogin = async (credential: string, remember: boolean) => {
    let authRes;
    try {
      authRes = await authApi.googleLogin({ credential });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.code === "ERR_NETWORK"
          ? "Không kết nối được máy chủ xác thực. Hãy khởi động backend rồi thử lại."
          : "Không thể đăng nhập bằng Google. Vui lòng thử lại.");
      throw new Error(message);
    }

    const accountId = String(authRes.id);
    const normalizedEmail = authRes.email.toLowerCase();
    const role: "USER" | "ADMIN" =
      authRes.role === "ROLE_ADMIN" || authRes.role === "ADMIN"
        ? "ADMIN"
        : "USER";

    localStorage.setItem("flowling-remember", remember ? "yes" : "no");
    sessionStorage.setItem("flowling-session", accountId);
    setState((current) => {
      const existing = current.accounts.find(
        (candidate) =>
          candidate.id === accountId || candidate.email === normalizedEmail,
      );
      if (existing) {
        return {
          ...current,
          currentAccountId: existing.id,
          accounts: current.accounts.map((candidate) =>
            candidate.id === existing.id
              ? {
                  ...candidate,
                  role,
                  data: {
                    ...candidate.data,
                    profile: {
                      ...candidate.data.profile,
                      name: authRes.fullName || candidate.data.profile.name,
                      email: normalizedEmail,
                      avatar:
                        authRes.avatarUrl || candidate.data.profile.avatar,
                      streak:
                        authRes.currentStreak ?? candidate.data.profile.streak,
                      xp: authRes.totalXp ?? candidate.data.profile.xp,
                    },
                  },
                }
              : candidate,
          ),
        };
      }

      return {
        ...current,
        currentAccountId: accountId,
        accounts: [
          ...current.accounts,
          {
            id: accountId,
            email: normalizedEmail,
            passwordHash: "",
            role,
            data: {
              ...createPersonal(
                authRes.fullName || normalizedEmail.split("@")[0],
                normalizedEmail,
                false,
              ),
              profile: {
                ...createPersonal(
                  authRes.fullName || normalizedEmail.split("@")[0],
                  normalizedEmail,
                  false,
                ).profile,
                avatar: authRes.avatarUrl || "",
                streak: authRes.currentStreak || 0,
                xp: authRes.totalXp || 0,
              },
            },
          },
        ],
      };
    });
    return role;
  };

  const logout = () => {
    authApi.logout();
    window.google?.accounts.id.disableAutoSelect();
    sessionStorage.removeItem("flowling-session");
    localStorage.removeItem("flowling-remember");
    setState((s) => ({ ...s, currentAccountId: null }));
    setNotice("Đã đăng xuất");
  };
  const saveContent = (content: Content) =>
    setState((s) =>
      s.accounts.find((a) => a.id === s.currentAccountId)?.role === "ADMIN"
        ? {
            ...s,
            contents: s.contents.some((c) => c.id === content.id)
              ? s.contents.map((c) => (c.id === content.id ? content : c))
              : [content, ...s.contents],
          }
        : s,
    );
  const deleteContent = (id: string) =>
    setState((s) =>
      s.accounts.find((a) => a.id === s.currentAccountId)?.role === "ADMIN"
        ? { ...s, contents: s.contents.filter((c) => c.id !== id) }
        : s,
    );
  return {
    state,
    setState,
    account,
    data: data!,
    notice,
    storageError,
    notify: setNotice,
    updatePersonal,
    toggleSave,
    toggleLike,
    saveWord,
    track,
    grade,
    login,
    register,
    googleLogin,
    logout,
    saveContent,
    deleteContent,
  };
}
const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const value = useDemoState();
  return (
    <DemoContext.Provider value={value}>
      {children}
      {value.notice && (
        <div className="toast" role="status">
          ✓ {value.notice}
        </div>
      )}
      {value.storageError && (
        <div className="storage-error" role="alert">
          {value.storageError}
        </div>
      )}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw Error("DemoProvider missing");
  return context;
}
