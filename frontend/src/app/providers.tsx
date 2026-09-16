import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPersonal, createSeed, dayKey } from "../shared/mock/seed";
import { schedule } from "../features/flashcard/services/srs";
import type {
  Content,
  DemoState,
  Grade,
  PersonalData,
  Vocabulary,
  VocabularyContext,
} from "../shared/types/demo";
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
      return { ...value, currentAccountId: session || value.currentAccountId };
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
  const data = account?.data;
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
    const found = state.accounts.find(
      (a) => a.email === email.trim().toLowerCase(),
    );
    if (
      !found ||
      (found.passwordHash === "demo"
        ? password !== "Flowling123!"
        : found.passwordHash !== (await digest(password)))
    )
      throw Error("Email hoặc mật khẩu chưa đúng.");
    localStorage.setItem("flowling-remember", remember ? "yes" : "no");
    sessionStorage.setItem("flowling-session", found.id);
    setState((s) => ({ ...s, currentAccountId: found.id }));
    return found.role;
  };
  const register = async (name: string, email: string, password: string) => {
    if (!name.trim()) throw Error("Nhập tên hiển thị của bạn.");
    if (password.length < 8) throw Error("Mật khẩu cần ít nhất 8 ký tự.");
    email = email.trim().toLowerCase();
    if (state.accounts.some((a) => a.email === email))
      throw Error("Email này đã có tài khoản.");
    const id = uid(),
      passwordHash = await digest(password);
    setState((s) => ({
      ...s,
      currentAccountId: id,
      accounts: [
        ...s.accounts,
        {
          id,
          email,
          passwordHash,
          role: "USER",
          data: createPersonal(name.trim(), email, false),
        },
      ],
    }));
    sessionStorage.setItem("flowling-session", id);
  };
  const logout = () => {
    sessionStorage.removeItem("flowling-session");
    setState((s) => ({ ...s, currentAccountId: null }));
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
