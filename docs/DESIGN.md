# EnglishFlow / Flowling - Global Design System

> **Visual Philosophy:** A modern, breathable, light-first interface with soothing botanical green accents (`#16A34A` / `#22C55E`), a multi-tonal pastel category taxonomy, clean typography, and tactile rounded surfaces.  
> **Brand Identity:** *"Good content. Better you."*

---

## 1. Color Palette & Tokens (Colors)

### 1.1 Canvas & Surface Tokens (Light Theme Default)
```css
:root {
  /* Canvas & Card Surfaces */
  --bg-app: #F8F9FA;                  /* Soft neutral light canvas */
  --bg-surface: #FFFFFF;              /* Pure white card surface */
  --bg-surface-hover: #F8FAFC;        /* Subtle hover surface */
  --bg-surface-active: #F1F5F9;       /* Active card state */
  --bg-input: #F1F3F5;                /* Search bar & pill inputs */

  /* Borders & Dividers */
  --border-subtle: #F1F3F5;           /* Card border (1px ultra-clean) */
  --border-default: #E5E7EB;          /* Regular dividers */
  --border-focus: #16A34A;            /* Focused inputs & active rings */

  /* Text Hierarchy */
  --text-primary: #0F172A;            /* Deep slate for high-contrast titles */
  --text-secondary: #475569;          /* Subtitles, body teasers */
  --text-muted: #94A3B8;              /* Timestamps, secondary labels */
  --text-inverse: #FFFFFF;            /* Text on dark hero cards / buttons */
}
```

### 1.2 Soothing Botanical Green (Primary Brand & Nature Tone)
Carefully tuned green tones designed for extended reading without eye fatigue:
```css
:root {
  --color-green-50:  #EBF7EE;  /* Background for inspiration quote cards & nature tags */
  --color-green-100: #DCFCE7;  /* Soft badge outline */
  --color-green-200: #BBF7D0;  /* Tag border */
  --color-green-400: #4ADE80;  /* Interactive highlights */
  --color-green-500: #22C55E;  /* Fresh green brand accent */
  --color-green-600: #16A34A;  /* Primary brand buttons, active indicators */
  --color-green-700: #15803D;  /* Dark green interactive states */
  --color-green-800: #166534;  /* Forest green text on quote cards & pills */
  --color-green-900: #14532D;  /* Deep green text */
}
```

### 1.3 Multi-Tonal Pastel Category Palette
Every academic/content topic is paired with a gentle pastel background and high-contrast text:

| Category | Background (`bg`) | Text Color | Icon Color | Meaning / Tone |
|---|---|---|---|---|
| **Môi trường / Thiên nhiên** | `#EBF7EE` | `#166534` | `#16A34A` | Environment, Nature |
| **Khoa học / Không gian** | `#E8F0FE` | `#1967D2` | `#3B82F6` | Science, Mars, Discoveries |
| **Tâm lý / Bản thân** | `#F3E8FF` | `#6B21A8` | `#8B5CF6` | Psychology, Self-growth |
| **Sức khỏe / Đời sống** | `#FEE2E2` | `#991B1B` | `#EF4444` | Health, Medicine, Sleep |
| **Công nghệ / AI** | `#E0F2FE` | `#0369A1` | `#0EA5E9` | Tech, Digital Future |
| **Kinh tế / Tài chính** | `#FEF3C7` | `#92400E` | `#F59E0B` | Economics, Money, Work |
| **Văn hóa / Nghệ thuật** | `#FCE7F3` | `#9D174D` | `#EC4899` | Culture, Society, Arts |
| **Giáo dục / Kỹ năng** | `#ECFDF5` | `#065F46` | `#10B981` | Education, Linguistics |
| **Xã hội / Đời sống** | `#EDE9FE` | `#5B21B6` | `#7C3AED` | Society, Urban Living |

### 1.4 Functional Brand Accents
- **Streak Flame:** `#F97316` (Warm Orange) | Pill: `#FFF7ED`
- **SRS Review / Brain:** `#5842BD` (Royal Violet) | Surface: `#F5F3FF`
- **Video Play:** `#EF4444` (Ruby Red) | Surface: `#FEE2E2`
- **Podcast Audio:** `#0284C7` (Teal Blue) | Surface: `#E0F2FE`

---

## 2. Typography

- **Primary Font Family:** `'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif`
- **Reading Serif Option (Article Reader):** `'Newsreader', 'Merriweather', Georgia, serif`

### Type Scale Hierarchy
| Level | Font Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `Display / H1` | 32px (2rem) | 1.25 | 700 (Bold) | Main Hero Titles, Marketing Headlines |
| `H2 / Greeting` | 24px (1.5rem) | 1.3 | 700 (Bold) | `Chào mừng trở lại, Minh! 👋` |
| `Hero Headline` | 26px (1.625rem)| 1.25 | 700 (Bold) | `Why Do We Dream?` (Continue Banner) |
| `H3 / Section` | 20px (1.25rem) | 1.35 | 700 (Bold) | `Dành cho bạn`, `Từ vựng hôm nay` |
| `Card Title` | 16px (1rem) | 1.4 | 600 (SemiBold)| Content headlines (Max 2 lines clamp) |
| `Body Large` | 17px (1.0625rem)| 1.7 | 400 (Regular)| Article reading canvas body text |
| `Body Regular`| 14px (0.875rem) | 1.5 | 400 (Regular)| Card teasers, word definitions |
| `Caption / Meta`| 12px (0.75rem)| 1.4 | 500 (Medium) | Duration (`5 phút`), author, categories |
| `Micro / Pill` | 11px (0.6875rem)| 1.2 | 600 (SemiBold)| `TIẾP TỤC`, `Bài đọc`, `Podcast` pills |

---

## 3. Spacing Grid (Spacing)

The spacing scale is built on a 4px/8px modular base:

```css
:root {
  --space-1: 4px;   /* Micro spacing, pill internal padding */
  --space-2: 8px;   /* Tag gaps, icon margins */
  --space-3: 12px;  /* Compact card inner padding, input padding */
  --space-4: 16px;  /* Standard container padding, card body padding */
  --space-5: 20px;  /* Medium card gaps */
  --space-6: 24px;  /* Section gutters, grid gaps */
  --space-8: 32px;  /* Layout column spacing */
  --space-10: 40px; /* Header vertical spacing */
  --space-12: 48px; /* Large section margins */
  --space-16: 64px; /* Page layout top/bottom margins */
}
```

---

## 4. Buttons & Interactive Controls (Buttons)

### 4.1 Button Variants & States

#### 1. Primary Solid Pill Button (CTA / Continue):
- **Styles:** `background: var(--color-green-600)`, `color: #FFFFFF`, `border-radius: 9999px`, `padding: 10px 22px`, `font-weight: 600`, `font-size: 14px`.
- **Hover:** `background: var(--color-green-700)`, `box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25)`.
- **Active:** `transform: scale(0.98)`.

#### 2. White Glass Pill Button (Hero Continue):
- **Styles:** `background: #FFFFFF`, `color: #0F172A`, `border-radius: 9999px`, `padding: 10px 20px`, `font-weight: 600`, `font-size: 13px`.
- **Hover:** `background: #F8FAFC`, `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15)`.

#### 3. Royal Violet Button (SRS Review CTA):
- **Styles:** `background: #5842BD`, `color: #FFFFFF`, `border-radius: 9999px`, `padding: 12px 24px`, `font-weight: 600`, `font-size: 14px`, `width: 100%`.
- **Hover:** `background: #4A35AC`, `box-shadow: 0 4px 14px rgba(88, 66, 189, 0.3)`.

#### 4. Ghost / Text Action Button:
- **Styles:** `background: transparent`, `color: #475569`, `padding: 6px 12px`, `border-radius: 8px`.
- **Hover:** `background: #F1F3F5`, `color: #0F172A`.

#### 5. Circular Icon Button:
- **Styles:** `width: 36px`, `height: 36px`, `border-radius: 50%`, `display: flex`, `align-items: center`, `justify-content: center`.
- **Hover:** `background: #F1F3F5`.

---

## 5. Cards & Elevation (Cards)

```css
:root {
  /* Border Radii */
  --radius-xs: 4px;
  --radius-sm: 8px;      /* Small chips, micro badges */
  --radius-md: 12px;     /* Small widget items */
  --radius-lg: 16px;     /* Content cards, right sidebar widgets */
  --radius-xl: 20px;     /* Hero Continue panoramic banner */
  --radius-full: 9999px; /* Pill buttons, search bars, tag badges */

  /* Soft Ambient Shadows */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02);
  --shadow-card-hover: 0 6px 20px rgba(0, 0, 0, 0.08);
  --shadow-popover: 0 10px 30px -4px rgba(0, 0, 0, 0.12);
}
```

### Card Anatomy Standards:
- **Standard Feed Card:** Pure white `#FFFFFF`, `border-radius: 16px`, `border: 1px solid var(--border-subtle)`, transition `transform 0.2s ease, box-shadow 0.2s ease`. Hover: `translateY(-3px)` with `--shadow-card-hover`.
- **Panoramic Hero Card:** 16:6 aspect ratio, `border-radius: 20px`, dark landscape photography with smooth linear gradient overlay.
- **Botanical Mindset Card:** `background: var(--color-green-50)`, `border: 1px solid var(--color-green-100)`, text `var(--color-green-800)`.

---

## 6. Responsive Layout Rules (Responsive Rules)

```text
Desktop (> 1200px)         Tablet (768px - 1200px)           Mobile (< 768px)
┌─────┬───────────┬─────┐  ┌─────────────┬─────────────┐     ┌─────────────────────┐
│Left │  Center   │Right│  │ Left (Mini) │ Main Feed   │     │ Header (Logo+Streak)│
│240px│   Flex    │320px│  │ 72px / Drawer   Flex      │     ├─────────────────────┤
└─────┴───────────┴─────┘  └─────────────┴─────────────┘     │ Main Content (1 Col)│
                                                             ├─────────────────────┤
                                                             │ Bottom Nav (5 Icons)│
                                                             └─────────────────────┘
```

1. **Desktop (> 1200px):**
   - 3-column fixed layout: Left Sidebar (240px) + Main Content (Flex) + Right Sidebar (320px).
   - Feed card grid renders in **3 columns**.
2. **Tablet (768px - 1200px):**
   - 2-column layout: Left navigation collapses into icon-only rail (72px) or hamburger drawer; Right widgets stack under hero banner or move to secondary tabs.
   - Feed card grid renders in **2 columns**.
3. **Mobile (< 768px):**
   - 1-column single stream layout.
   - Top Bar: Logo, Streak 🔥, Search 🔍, Avatar.
   - Bottom Sticky Navigation: `Trang chủ`, `Khám phá`, `Đã lưu`, `Ôn tập`, `Hồ sơ`.
   - Feed card grid renders in **1 column** full-width cards.
