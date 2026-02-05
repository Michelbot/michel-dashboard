# DESIGN SPECS - Michel Dashboard (d'après Nim's Dashboard)

## 🎨 COULEURS

### Background
- Main background: `#0a0e1a` (très dark blue-gray)
- Sidebar background: `#0f1419` (dark slate)
- Cards background: `#1a1f2e` (slate-800 équivalent)

### Accents
- Primary: `#f97316` (orange-500) → Pour Michel
- Cyan/Blue: `#06b6d4` ou `#3b82f6` → Stats numbers
- Purple: `#8b5cf6` → Gradients
- Pink: `#ec4899` → Gradients
- Green: `#10b981` → Success/checkmarks

### Text
- Primary text: `#f8fafc` (slate-50)
- Secondary text: `#94a3b8` (slate-400)
- Muted text: `#64748b` (slate-500)

### Borders
- Subtle borders: `#1e293b` (slate-700)
- Accent borders: `#334155` (slate-600)

---

## 📐 LAYOUT

### Sidebar (Left)
- Width: `256px` (16rem)
- Fixed position
- Sections spacing: `16px` (1rem)
- Padding: `16px` (1rem)

### Main Content
- Margin-left: `256px`
- Margin-right: `320px` (if right panel)
- Padding: `24px` (1.5rem)

### Right Panel
- Width: `320px` (20rem)
- Fixed position right
- Padding: `16px`

---

## 🧩 COMPOSANTS

### Sidebar - Avatar
```
┌─────────────────┐
│   ╭───────╮     │
│   │  NIM  │ 🟡  │ ← Badge doré coin
│   ╰───────╯     │
│      Nim        │
│   • Online      │ ← Point vert
│  ┌───────┐      │
│  ███████░  50%  │ ← XP bar
│  └───────┘      │
└─────────────────┘
```

### Sidebar - Status Card
```
┌─────────────────────────┐
│ 💬 STATUS               │
│ ┌─────────────────────┐ │
│ │ ║ Building something │ │ ← Border gauche bleue
│ │ ║ amazing...         │ │ ← Texte italique
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Sidebar - Workspace Files
```
┌──────────────────────────┐
│ 📁 WORKSPACE FILES       │
├──────────────────────────┤
│ ❤️  HEARTBEAT.md   1h ago │
│ 👤 USER.md       23h ago │
│ 🔧 TOOLS.md        1d ago │
│ 🧠 MEMORY.md       2d ago │
│ 🆔 IDENTITY.md     3d ago │
│ 📋 AGENTS.md       3d ago │
│ ✨ SOUL.md         3d ago │
├──────────────────────────┤
│ ▶ 📁 MEMORY/ (31 FILES)  │
└──────────────────────────┘
```

### Sidebar - Session Stats
```
┌────────────────────────┐
│ 📊 SESSION STATS       │
├───────────┬────────────┤
│ MESSAGES  │ TOOLS USED │
│   619     │     7      │ ← Chiffres cyan
└───────────┴────────────┘
```

### Main - Greeting Card
```
┌─────────────────────────────────────────┐
│ ╭─────────────────────────────────────╮ │
│ │     🌙 Good evening, Michel         │ │
│ │  Your personal workspace & command  │ │
│ │              center                 │ │
│ │                                     │ │
│ │  [🧠 On My Mind] [📊] [⚙️]          │ │
│ ╰─────────────────────────────────────╯ │
└─────────────────────────────────────────┘
Gradient: purple-900/50 to pink-900/50
```

### Main - Stats Cards (3 horizontal)
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│     📋      │  │     ⚡      │  │     ✅      │
│ ACTIVE TASKS│  │ IN PROGRESS │  │  COMPLETED  │
│     10      │  │      0      │  │      0      │
│  13 total   │  │Working on..│  │  All time   │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Main - Currently Working On
```
┌──────────────────────────────────────────┐
│ ⚡🔥 Currently Working On                 │
├──────────────────────────────────────────┤
│                                          │
│         No active task                   │
│   Start working on a task to see it here │
│                                          │
│         [View All Tasks >]               │
└──────────────────────────────────────────┘
```

### Main - System Status
```
┌──────────────────────────────────────────┐
│ 🔋 System Status                         │
├──────────────────────────────────────────┤
│  ✅ API Connected                        │
│  ✅ WebSocket Active                     │
│  ✅ Database Healthy                     │
└──────────────────────────────────────────┘
```

### Right Panel - Top Actions
```
┌─────────────────────────────────────────┐
│ [Archive Completed]    [+ New Task]     │
│   (gray-700)           (orange-500)     │
└─────────────────────────────────────────┘
```

### Right Panel - Mental State Card
```
┌─────────────────────────────────────────┐
│ ╔═══════════════════════════════════╗   │
│ ║ ❤️ Mental State    Updated 7s ago ║   │ ← Gradient orange→red
│ ║                               ▲   ║   │ ← Border purple
│ ╠═══════════════════════════════════╣   │
│ ║ 📊 Active Projects         🟠1    ║   │
│ ║                                   ║   │
│ ║ ┌───────────────────────────────┐ ║   │
│ ║ │ Nim Dashboard      [PLANNING] │ ║   │
│ ║ │ 📊 Phase 3 - Model Status...  │ ║   │
│ ║ │ ✅ **COMPLETE!**              │ ║   │
│ ║ │                               │ ║   │
│ ║ │ 66 of 81 milestones       81% │ ║   │
│ ║ │ ████████████░░░               │ ║   │ ← Orange progress
│ ║ │                               │ ║   │
│ ║ │ 📅 Started: 1/30/2026         │ ║   │
│ ║ │ 🚀 Version: v1.3.0-dev        │ ║   │
│ ║ │                               │ ║   │
│ ║ │ Next Steps:                   │ ║   │
│ ║ │ • **6-Column Kanban:**        │ ║   │
│ ║ │ • **Enhanced Task Cards:**    │ ║   │
│ ║ │ • **Active Work Monitoring:** │ ║   │
│ ║ └───────────────────────────────┘ ║   │
│ ╚═══════════════════════════════════╝   │
└─────────────────────────────────────────┘
```

### Right Panel - Idle Mode Card
```
┌─────────────────────────────────────────┐
│ ╔═══════════════════════════════════╗   │
│ ║ ✨ Idle Mode               7s ago ║   │ ← Gradient purple
│ ║ Not focused on a specific task    ║   │
│ ╠═══════════════════════════════════╣   │
│ ║ Ready to work? Here are some      ║   │
│ ║ quick actions:                    ║   │
│ ║                                   ║   │
│ ║ ┌─────────────────────────────┐   ║   │
│ ║ │ 📋 Check To Do              │   ║   │
│ ║ │    7 tasks waiting          │   ║   │
│ ║ └─────────────────────────────┘   ║   │
│ ║                                   ║   │
│ ║ ┌─────────────────────────────┐   ║   │
│ ║ │ 💡 Review Ideas             │   ║   │
│ ║ │    1 items to explore       │   ║   │
│ ║ └─────────────────────────────┘   ║   │
│ ║                                   ║   │
│ ║ ╔═══════════════════════════════╗ ║   │
│ ║ ║ ⚙️ Start something new       ║ ║   │ ← CTA button
│ ║ ╚═══════════════════════════════╝ ║   │
│ ╚═══════════════════════════════════╝   │
└─────────────────────────────────────────┘
```

---

## 🎭 ANIMATIONS

### Hover Effects
- Cards: `transform: translateY(-2px)` + `shadow-xl`
- Buttons: `scale(1.05)` + `shadow-lg`
- Files list: `bg-slate-700` + `translate-x(2px)`

### Transitions
- Duration: `200ms` (fast and snappy)
- Easing: `ease-in-out`
- Properties: `all` ou `transform, shadow, background`

### Drag & Drop
- Dragging: `opacity: 0.5` + `scale(1.05)`
- Drop zone: `border-dashed` + `bg-accent/10`

---

## 📏 SPACING

### Sections
- Between sections: `24px` (1.5rem)
- Section header margin-bottom: `16px` (1rem)

### Cards
- Padding: `16px` (1rem)
- Gap between cards: `16px`
- Border-radius: `8px` (0.5rem)

### Text
- Headings margin-bottom: `12px`
- Paragraphs margin-bottom: `8px`
- Line-height: `1.5`

---

## 🔤 TYPOGRAPHY

### Font Family
- Primary: Inter (Next.js default)
- Monospace: Geist Mono

### Font Sizes
- H1 (Dashboard title): `24px` (1.5rem) — font-bold
- H2 (Section headers): `14px` (0.875rem) — font-semibold uppercase tracking-wider
- H3 (Card titles): `16px` (1rem) — font-semibold
- Body: `14px` (0.875rem) — font-normal
- Small: `12px` (0.75rem) — font-medium
- Tiny: `10px` (0.625rem) — font-medium

### Font Weights
- Bold: 700
- Semibold: 600
- Medium: 500
- Normal: 400

---

## 🎯 ICONS

### Sources
- Lucide React (primary)
- Emojis pour accents colorés

### Tailles
- Small: 16px
- Medium: 20px
- Large: 24px

### Couleurs
- Match avec accent colors
- Use color classes: `text-orange-500`, `text-cyan-500`, etc.

---

## 📱 RESPONSIVE

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Mobile
- Sidebar: Hidden (bottom nav)
- Right panel: Hidden (tabs)
- Main: Full width
- Stack cards vertically

### Tablet
- Sidebar: Collapsible
- Right panel: Hidden
- Main: Full width - sidebar

### Desktop
- All panels visible
- 3-column layout

---

## ✨ POLISH

### Shadows
- Small: `shadow-sm`
- Medium: `shadow-md`
- Large: `shadow-xl`
- With accent: `shadow-xl shadow-orange-500/10`

### Borders
- Subtle: `border border-slate-700`
- Accent: `border-2 border-orange-500/20`
- Left accent: `border-l-4 border-cyan-500`

### Gradients
- Header card: `bg-gradient-to-br from-purple-900/50 to-pink-900/50`
- Mental state: `from-orange-900/30 to-red-900/30`
- Avatar: `from-orange-500 to-orange-600`

---

## 🎪 ÉTAT DES COMPOSANTS

### Active State
- Border accent
- Background slightly lighter
- Shadow increased

### Hover State
- Transform slight
- Shadow enhanced
- Color shift

### Disabled State
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

### Loading State
- Skeleton screens
- Pulse animation
- Shimmer effect

---

**Ce document sert de référence pour l'implémentation pixel-perfect du dashboard.**
