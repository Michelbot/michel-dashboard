# BRIEF DÉVELOPPEMENT - Michel Dashboard

## 🎯 MISSION

Développer un dashboard de gestion de projets **identique** à Nim's Dashboard.

## 📋 DOCUMENTS À LIRE (dans l'ordre)

1. **COMPARAISON-NIM.md** - Analyse des manques vs référence
2. **USER-STORIES.md** - 28 stories détaillées + roadmap
3. **DESIGN-SPECS.md** - Specs design pixel-perfect

## 🚀 SPRINT 1 (2h) - MVP FONCTIONNEL

### Objectifs
- Sidebar complète (US-001 à US-006)
- Main dashboard (US-007 à US-011)
- Kanban 6 colonnes basique (US-012)
- Tout en FRANÇAIS (US-028)

### Stack
- Next.js 14 App Router ✅ (déjà installé)
- TypeScript strict
- Tailwind CSS
- @dnd-kit/core + @dnd-kit/sortable (drag & drop)
- Zustand (state management)
- lucide-react (icônes)
- date-fns (dates en français)

### Composants à créer

#### 1. Sidebar (Left)
- Avatar avec badge doré
- Status "• En ligne" + XP bar
- Section STATUS avec border cyan
- WORKSPACE FILES (7 fichiers + timestamps)
- MEMORY/ (31 FILES) collapsible
- SESSION STATS (Messages: 619, Tools: 7)

#### 2. Main Dashboard
- Header "Michel Dashboard" + badge "DEVELOPMENT"
- Grande carte salutation (gradient purple→pink)
- 3 stats cards (Active/En Cours/Terminé)
- Section "⚡ Travail en Cours"
- Section "🔋 État Système" (3 indicateurs)

#### 3. Kanban 6 Colonnes
- 💡 Idées/Plans
- 📋 Backlog
- 📝 À Faire
- ⚡ En Cours
- 🔍 Révision
- ✅ Terminé

Compteur + bouton + sur chaque colonne

#### 4. Cards Basiques
Pour ce sprint : titre, description, tags, date, assigné (pas encore subtasks/links)

## ⚠️ CONTRAINTES CRITIQUES

### Design
- **Couleurs exactes** : Background #0a0e1a, Cards #1a1f2e, Orange #f97316
- **Spacing précis** : Voir DESIGN-SPECS.md
- **Animations smooth** : 200ms ease-in-out
- **Pixel-perfect** vs screenshots Nim

### Traduction
- ❌ "Good evening" → ✅ "Bonsoir"
- ❌ "Active Tasks" → ✅ "Tâches Actives"
- ❌ "In Progress" → ✅ "En Cours"
- ❌ "Done" → ✅ "Terminé"
- Timestamps : "il y a 2h", "il y a 1j"

### Data Initiale
Utilise les vrais fichiers workspace de Michel :
- HEARTBEAT.md, USER.md, TOOLS.md, MEMORY.md, IDENTITY.md, AGENTS.md, SOUL.md
- Stats session : 619 messages, 7 tools
- 3 projets exemple : Extensions Chrome, Affiliation, Dashboard

## 📐 ARCHITECTURE

```
michel-dashboard/
├── app/
│   ├── layout.tsx          ← Layout global dark
│   ├── page.tsx            ← Dashboard principal
│   └── globals.css         ← Styles Tailwind
├── components/
│   ├── Sidebar.tsx         ← Sidebar complète
│   ├── MainDashboard.tsx   ← Dashboard central
│   ├── KanbanBoard.tsx     ← Board 6 colonnes
│   ├── KanbanColumn.tsx    ← Colonne
│   └── TaskCard.tsx        ← Carte basique
├── lib/
│   ├── store.ts            ← Zustand store
│   ├── types.ts            ← Types TypeScript
│   └── data.ts             ← Data initiale
└── public/
```

## 🎯 CHECKLIST SPRINT 1

- [ ] Install packages (dnd-kit, zustand, date-fns, lucide-react)
- [ ] Setup types.ts avec interfaces
- [ ] Créer data.ts avec données Michel
- [ ] Sidebar complète avec 6 sections
- [ ] Main dashboard avec 5 sections
- [ ] Kanban 6 colonnes fonctionnel
- [ ] Cards basiques drag & drop
- [ ] Tout en français
- [ ] Couleurs exactes
- [ ] `npm run dev` fonctionne
- [ ] Screenshot final

## ✅ DEFINITION OF DONE

Sprint 1 est DONE quand :
1. Dashboard démarre sans erreur
2. Toutes les sections visibles
3. Drag & drop fonctionne
4. Design proche de Nim (pas pixel-perfect encore)
5. Textes en français
6. LocalStorage sauvegarde

## 🚀 COMMENCE MAINTENANT

1. Lis les 3 docs
2. Install packages manquants
3. Code les composants
4. Test en continu
5. Screenshot final

**GO !** ⚡
