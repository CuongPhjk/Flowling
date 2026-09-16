import { MOCK_FEED_ITEMS, MOCK_TOPICS } from "./mockFeedData";
import type {
  Content,
  DemoState,
  Paragraph,
  PersonalData,
  Vocabulary,
} from "../types/demo";
import mediaTiming from "./media-timing.json";
export const topics = MOCK_TOPICS;
export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const stories: Record<string, Paragraph[]> = {
  science: [
    {
      en: "The night sky gives us a new perspective on our place in the universe. Mars is a distant world, but curiosity brings it closer. Scientists look for water beneath its dusty surface.",
      vi: "Bầu trời đêm cho ta góc nhìn mới về vị trí của mình trong vũ trụ. Sao Hỏa là một thế giới xa xôi, nhưng sự tò mò đưa nó đến gần hơn. Các nhà khoa học tìm nước bên dưới bề mặt đầy bụi.",
    },
    {
      en: "Building a home on Mars would require significant changes to the way we live. People would need reliable shelter, clean water, and a renewable source of energy. Every resource would matter.",
      vi: "Xây nhà trên Sao Hỏa đòi hỏi những thay đổi đáng kể trong cách sống. Con người cần nơi trú ẩn đáng tin cậy, nước sạch và nguồn năng lượng tái tạo. Mọi nguồn tài nguyên đều quan trọng.",
    },
    {
      en: "Exploration is also a lesson in patience. Small experiments help researchers understand complex problems. The journey encourages us to protect the remarkable planet we already call home.",
      vi: "Khám phá cũng dạy ta sự kiên nhẫn. Những thí nghiệm nhỏ giúp nhà nghiên cứu hiểu các vấn đề phức tạp. Hành trình này khuyến khích ta bảo vệ hành tinh phi thường mà chúng ta gọi là nhà.",
    },
  ],
  psychology: [
    {
      en: "Small habits can make a significant difference. A quiet morning gives your brain space to focus. Instead of changing everything at once, choose one simple action that you can repeat.",
      vi: "Những thói quen nhỏ có thể tạo ra khác biệt đáng kể. Một buổi sáng yên tĩnh cho não bộ không gian tập trung. Thay vì thay đổi mọi thứ cùng lúc, hãy chọn một hành động đơn giản để lặp lại.",
    },
    {
      en: "Consistency matters more than intensity. A short walk, a page of a book, or a conversation with a friend can become a reliable part of your day. Make the first step easy.",
      vi: "Sự đều đặn quan trọng hơn cường độ. Đi bộ ngắn, đọc một trang sách hoặc trò chuyện cùng bạn bè có thể trở thành phần ổn định trong ngày. Hãy làm bước đầu tiên thật dễ dàng.",
    },
    {
      en: "Progress is rarely a straight line. Be curious about what works for you. With patience and a fresh perspective, small efforts become a meaningful part of everyday life.",
      vi: "Tiến bộ hiếm khi là đường thẳng. Hãy tò mò về những gì phù hợp với bạn. Với sự kiên nhẫn và góc nhìn mới, nỗ lực nhỏ trở thành phần ý nghĩa của cuộc sống hằng ngày.",
    },
  ],
  environment: [
    {
      en: "The ocean connects every part of our planet. Beneath the waves, tiny living organisms support a remarkable variety of life. Even the smallest creature has a role in this complex ecosystem.",
      vi: "Đại dương kết nối mọi phần của hành tinh. Dưới những con sóng, các sinh vật nhỏ bé nuôi dưỡng sự sống đa dạng phi thường. Ngay cả sinh vật nhỏ nhất cũng có vai trò trong hệ sinh thái phức tạp này.",
    },
    {
      en: "Protecting the ocean begins with understanding it. Scientists observe changes in temperature and water quality. Their research offers a new perspective on the relationship between people and nature.",
      vi: "Bảo vệ đại dương bắt đầu từ việc hiểu nó. Các nhà khoa học quan sát sự thay đổi nhiệt độ và chất lượng nước. Nghiên cứu của họ mang đến góc nhìn mới về mối quan hệ giữa con người và thiên nhiên.",
    },
    {
      en: "A healthy environment is a shared responsibility. Reducing waste and protecting coastal habitats can make a significant difference. Small actions become powerful when communities work together.",
      vi: "Môi trường lành mạnh là trách nhiệm chung. Giảm rác thải và bảo vệ môi trường sống ven biển có thể tạo ra khác biệt đáng kể. Hành động nhỏ trở nên mạnh mẽ khi cộng đồng cùng hợp tác.",
    },
  ],
  tech: [
    {
      en: "Creative tools are changing the way people work. A designer can explore a new idea in minutes. Technology offers a fresh perspective, but human judgment still shapes the final result.",
      vi: "Công cụ sáng tạo đang thay đổi cách con người làm việc. Nhà thiết kế có thể khám phá ý tưởng mới trong vài phút. Công nghệ mang đến góc nhìn mới, nhưng phán đoán của con người vẫn định hình kết quả cuối cùng.",
    },
    {
      en: "A useful tool should make complex tasks easier. It should also help people understand its limits. Asking thoughtful questions is just as important as finding quick answers.",
      vi: "Công cụ hữu ích cần đơn giản hóa các việc phức tạp. Nó cũng cần giúp con người hiểu giới hạn của nó. Đặt câu hỏi thấu đáo cũng quan trọng như tìm câu trả lời nhanh.",
    },
    {
      en: "The most remarkable projects often begin with collaboration. People bring different experiences to the same challenge. Curiosity and responsibility help turn new possibilities into meaningful work.",
      vi: "Những dự án đáng chú ý nhất thường bắt đầu bằng hợp tác. Mọi người mang kinh nghiệm khác nhau đến cùng một thử thách. Sự tò mò và trách nhiệm giúp biến khả năng mới thành công việc ý nghĩa.",
    },
  ],
  culture: [
    {
      en: "A quiet garden can change your perspective. In Kyoto, wooden buildings and carefully placed stones invite visitors to slow down. The spaces between objects matter as much as the objects themselves.",
      vi: "Khu vườn yên tĩnh có thể thay đổi góc nhìn của bạn. Ở Kyoto, công trình gỗ và những viên đá được xếp cẩn thận mời du khách sống chậm lại. Khoảng trống giữa các vật cũng quan trọng như chính chúng.",
    },
    {
      en: "Traditional craft connects generations. A maker learns through observation, patience, and repeated effort. Each material brings its own texture and history to the finished work.",
      vi: "Nghề thủ công truyền thống kết nối các thế hệ. Người thợ học qua quan sát, kiên nhẫn và nỗ lực lặp lại. Mỗi vật liệu mang kết cấu và lịch sử riêng vào sản phẩm hoàn chỉnh.",
    },
    {
      en: "Preserving a place does not mean stopping change. Communities find new ways to share their heritage. The result is a remarkable conversation between the past and the present.",
      vi: "Bảo tồn một nơi không có nghĩa là ngăn thay đổi. Cộng đồng tìm cách mới để chia sẻ di sản. Kết quả là cuộc đối thoại đáng chú ý giữa quá khứ và hiện tại.",
    },
  ],
  health: [
    {
      en: "Sleep gives the brain time to rest. A consistent evening routine can help you feel ready for tomorrow. Put your phone away, dim the lights, and enjoy a quiet moment.",
      vi: "Giấc ngủ cho não bộ thời gian nghỉ ngơi. Thói quen buổi tối đều đặn có thể giúp bạn sẵn sàng cho ngày mai. Hãy cất điện thoại, giảm ánh sáng và tận hưởng khoảnh khắc yên tĩnh.",
    },
  ],
  economy: [
    {
      en: "Every purchase tells a story about what we value. Repairing an old object can save money and reduce waste. A thoughtful choice today can make a significant difference tomorrow.",
      vi: "Mỗi món mua kể câu chuyện về điều ta coi trọng. Sửa một đồ vật cũ giúp tiết kiệm và giảm rác thải. Lựa chọn thấu đáo hôm nay có thể tạo khác biệt đáng kể ngày mai.",
    },
  ],
  education: [
    {
      en: "Curiosity is a powerful starting point. When we ask a question, we open a door to a new perspective. Reading a little every day helps us connect ideas across different subjects.",
      vi: "Sự tò mò là khởi đầu mạnh mẽ. Khi đặt câu hỏi, ta mở cánh cửa đến góc nhìn mới. Đọc một chút mỗi ngày giúp kết nối ý tưởng giữa các chủ đề khác nhau.",
    },
  ],
  society: [
    {
      en: "A welcoming city makes space for everyone. Trees, public benches, and safe walking paths create opportunities for conversation. Small changes can have a significant impact on community life.",
      vi: "Thành phố thân thiện tạo không gian cho mọi người. Cây xanh, ghế công cộng và lối đi an toàn tạo cơ hội trò chuyện. Thay đổi nhỏ có thể tác động đáng kể đến đời sống cộng đồng.",
    },
  ],
};
const extra = [
  ["art-sleep", "A Slower Evening, a Better Tomorrow", "health"],
  ["art-money", "The Quiet Joy of Buying Less", "economy"],
  ["art-curiosity", "Stay Curious: A Question a Day", "education"],
  ["art-city", "What Makes a City Feel Like Home?", "society"],
] as const;
export const vocabularySeed: Vocabulary[] = [
  ["perspective", "/pərˈspektɪv/", "noun", "góc nhìn, quan điểm"],
  ["significant", "/sɪɡˈnɪfɪkənt/", "adjective", "đáng kể, quan trọng"],
  ["remarkable", "/rɪˈmɑːrkəbl/", "adjective", "đáng chú ý, phi thường"],
  ["curiosity", "/ˌkjʊriˈɒsəti/", "noun", "sự tò mò"],
  ["patience", "/ˈpeɪʃəns/", "noun", "sự kiên nhẫn"],
  ["reliable", "/rɪˈlaɪəbl/", "adjective", "đáng tin cậy"],
  ["renewable", "/rɪˈnjuːəbl/", "adjective", "có thể tái tạo"],
  ["complex", "/ˈkɒmpleks/", "adjective", "phức tạp"],
  ["consistent", "/kənˈsɪstənt/", "adjective", "nhất quán, đều đặn"],
  ["community", "/kəˈmjuːnəti/", "noun", "cộng đồng"],
  ["responsibility", "/rɪˌspɒnsəˈbɪləti/", "noun", "trách nhiệm"],
  ["meaningful", "/ˈmiːnɪŋfl/", "adjective", "có ý nghĩa"],
  ["shelter", "/ˈʃeltər/", "noun", "nơi trú ẩn"],
  ["heritage", "/ˈherɪtɪdʒ/", "noun", "di sản"],
].map(([word, ipa, pos, meaning]) => ({ id: word, word, ipa, pos, meaning }));
export function createContents(): Content[] {
  const rows = [
    ...MOCK_FEED_ITEMS,
    ...extra.map(([id, title, categorySlug]) => ({
      ...MOCK_FEED_ITEMS[0],
      id,
      title,
      categorySlug,
      type: "ARTICLE" as const,
      teaser: stories[categorySlug][0].en,
      difficulty: "Easy" as const,
      thumbnail: MOCK_FEED_ITEMS[1].thumbnail,
    })),
  ];
  return rows.map((row, index) => {
    const paragraphs = stories[row.categorySlug];
    const timing = (mediaTiming as Record<string, number[]>)[row.id] || [];
    let cursor = 0;
    const segments = paragraphs.map((p, i) => {
      const startMs = cursor;
      cursor += timing[i] || 18000;
      return {
        id: `${row.id}-${i}`,
        startMs,
        endMs: cursor,
        englishText: p.en,
        vietnameseText: p.vi,
        position: i,
      };
    });
    return {
      id: row.id,
      slug: row.id,
      title: row.title.replace("Deep Work in Practice", "Finding Your Focus"),
      teaser: row.teaser,
      type: row.type,
      category: row.categorySlug,
      difficulty: row.difficulty,
      thumbnail: `/covers/${row.categorySlug}.svg`,
      duration:
        row.type === "ARTICLE"
          ? Math.max(
              60,
              Math.ceil(
                paragraphs
                  .map((p) => p.en)
                  .join(" ")
                  .split(/\s+/).length / 180,
              ) * 60,
            )
          : cursor / 1000,
      likes: row.likes,
      author: "Flowling Editorial",
      publishedAt: Date.now() - index * 86400000,
      status: "PUBLISHED",
      paragraphs,
      segments,
      mediaUrl:
        row.type === "ARTICLE"
          ? ""
          : `/media/${row.id}.${row.type === "VIDEO" ? "mp4" : "wav"}`,
    };
  });
}
export function createPersonal(
  name = "Minh Nguyễn",
  email = "minh@flowling.demo",
  seeded = true,
): PersonalData {
  const now = Date.now();
  const words = seeded
    ? vocabularySeed.map((v, i) => ({
        id: `uv-${v.id}`,
        vocabularyId: v.id,
        status: i > 11 ? ("MASTERED" as const) : ("LEARNING" as const),
        ease: 2.5,
        interval: i > 11 ? 30 : 1,
        repetitions: i > 11 ? 6 : 0,
        nextReviewAt: i > 11 ? now + 86400000 * 30 : now - 86400000,
        createdAt: now - i * 3600000,
      }))
    : [];
  const contents = createContents();
  const contexts = words.flatMap((w) =>
    contents.flatMap((c) =>
      c.paragraphs
        .filter((p) => new RegExp(`\\b${w.vocabularyId}\\b`, "i").test(p.en))
        .slice(0, 1)
        .map((p) => ({
          id: `ctx-${w.id}-${c.id}`,
          userVocabularyId: w.id,
          contentId: c.id,
          sentence: p.en,
          translation: p.vi,
          note: "",
          createdAt: now - 86400000,
        })),
    ),
  );
  const activity: Record<string, number> = {};
  if (seeded)
    for (let i = 1; i <= 7; i++)
      activity[dayKey(new Date(now - i * 86400000))] = 20;
  return {
    profile: {
      name,
      email,
      avatar: "",
      xp: seeded ? 1240 : 0,
      streak: seeded ? 7 : 0,
      activity,
      speed: 1,
      theme: "light",
      reading: "English",
    },
    words,
    contexts,
    saved: seeded ? ["pod-habits", "vid-kyoto", "art-mars"] : [],
    liked: seeded ? ["pod-habits"] : [],
    progress: seeded
      ? [
          {
            contentId: "pod-habits",
            percent: 42,
            position: 22,
            seconds: 22,
            updatedAt: now - 3600000,
            rewarded: false,
          },
          {
            contentId: "art-mars",
            percent: 100,
            position: 0,
            seconds: 80,
            updatedAt: now - 86400000,
            rewarded: true,
          },
        ]
      : [],
    sentences: [],
    snoozeUntil: 0,
    reviewsToday: {},
  };
}
export function createSeed(): DemoState {
  return {
    version: 1,
    contents: createContents(),
    vocabulary: vocabularySeed,
    accounts: [
      {
        id: "demo-user",
        email: "minh@flowling.demo",
        passwordHash: "demo",
        role: "USER",
        data: createPersonal(),
      },
      {
        id: "demo-admin",
        email: "admin@flowling.demo",
        passwordHash: "demo",
        role: "ADMIN",
        data: createPersonal("Biên tập viên", "admin@flowling.demo"),
      },
    ],
    currentAccountId: "demo-user",
  };
}
