# USER STORIES - Michel Dashboard

## 🎯 Epic : Dashboard de Gestion de Projets Michel

**En tant que** Michel (agent AI assistant)  
**Je veux** un dashboard complet de gestion de mes projets et tâches  
**Afin de** suivre mon activité, gérer mes priorités, et montrer mon état actuel à Abdessamad

---

## 📋 USER STORIES PAR COMPOSANT

### 1. SIDEBAR - Identité & Status

#### US-001 : Avatar avec Badge
**En tant que** utilisateur  
**Je veux** voir l'avatar de Michel avec un badge doré  
**Afin de** identifier rapidement l'agent et son niveau

**Critères d'acceptation** :
- ✅ Avatar circulaire affiché en haut de sidebar
- ✅ Badge doré en coin bas droite
- ✅ Nom "Michel" affiché en dessous
- ✅ Point vert "• Online" visible
- ✅ XP bar avec pourcentage (ex: 50%)

---

#### US-002 : Section Status
**En tant que** utilisateur  
**Je veux** voir le status actuel de Michel  
**Afin de** savoir ce qu'il fait en temps réel

**Critères d'acceptation** :
- ✅ Card avec border gauche cyan
- ✅ Texte en italique
- ✅ Mise à jour en temps réel
- ✅ Exemples : "Building something amazing...", "Thinking about request..."

---

#### US-003 : Current Activity
**En tant que** utilisateur  
**Je veux** voir l'activité courante de Michel  
**Afin de** comprendre sur quoi il travaille

**Critères d'acceptation** :
- ✅ Section "⚡ CURRENT ACTIVITY"
- ✅ Emoji + titre (ex: 🤔 Thinking)
- ✅ Description courte
- ✅ Bouton "🛑 Stop Nim" si activité en cours

---

### 2. SIDEBAR - Workspace Files

#### US-004 : Liste des Fichiers Workspace
**En tant que** utilisateur  
**Je veux** voir la liste des fichiers workspace  
**Afin de** accéder rapidement aux fichiers importants

**Critères d'acceptation** :
- ✅ Header "📁 WORKSPACE FILES"
- ✅ 7 fichiers listés avec icônes :
  - ❤️ HEARTBEAT.md
  - 👤 USER.md
  - 🔧 TOOLS.md
  - 🧠 MEMORY.md
  - 🆔 IDENTITY.md
  - 📋 AGENTS.md
  - ✨ SOUL.md
- ✅ Timestamps relatifs (1h ago, 2d ago...)
- ✅ Hover effect sur chaque ligne
- ✅ Click → Ouvre le fichier

---

#### US-005 : Dossier Memory Collapsible
**En tant que** utilisateur  
**Je veux** voir le dossier MEMORY/ avec compteur  
**Afin de** savoir combien de fichiers memory existent

**Critères d'acceptation** :
- ✅ Ligne "▶ 📁 MEMORY/ (31 FILES)"
- ✅ Collapsible (triangle cliquable)
- ✅ Compteur dynamique
- ✅ Expand → Liste des fichiers memory

---

### 3. SIDEBAR - Session Stats

#### US-006 : Statistiques de Session
**En tant que** utilisateur  
**Je veux** voir les stats de la session courante  
**Afin de** mesurer l'activité de Michel

**Critères d'acceptation** :
- ✅ Header "📊 SESSION STATS"
- ✅ 2 cards horizontales :
  - MESSAGES : 619 (en cyan)
  - TOOLS USED : 7 (en cyan)
- ✅ Mise à jour en temps réel
- ✅ Design slate-800 avec chiffres cyan

---

### 4. MAIN - Header Global

#### US-007 : Titre Dashboard
**En tant que** utilisateur  
**Je veux** voir le titre du dashboard en haut  
**Afin de** identifier la page

**Critères d'acceptation** :
- ✅ "Michel's Dashboard" en haut à gauche
- ✅ Badge "DEVELOPMENT" en haut à droite
- ✅ Font bold, taille 24px

---

#### US-008 : Carte Greeting
**En tant que** utilisateur  
**Je veux** voir une carte de salutation personnalisée  
**Afin de** me sentir accueilli

**Critères d'acceptation** :
- ✅ Grande carte avec gradient purple→pink
- ✅ Icon 🌙 (adapté à l'heure)
- ✅ Message : "Good evening, Michel"
- ✅ Subtitle : "Your personal workspace & command center"
- ✅ 3 boutons :
  - 🧠 On My Mind
  - 📊 Analytics
  - ⚙️ Settings

---

### 5. MAIN - Stats Cards

#### US-009 : Cards Statistiques (3 horizontales)
**En tant que** utilisateur  
**Je veux** voir 3 cards de stats principales  
**Afin de** avoir une vue d'ensemble rapide

**Critères d'acceptation** :
- ✅ 3 cards horizontales :
  1. **📋 ACTIVE TASKS** : 10 (13 total)
  2. **⚡ IN PROGRESS** : 0 (Working on now)
  3. **✅ COMPLETED** : 0 (All time)
- ✅ Icônes colorées
- ✅ Chiffres principaux grands
- ✅ Subtitles en petit
- ✅ Hover effect

---

### 6. MAIN - Currently Working On

#### US-010 : Section Travail en Cours
**En tant que** utilisateur  
**Je veux** voir sur quoi Michel travaille actuellement  
**Afin de** suivre son activité en temps réel

**Critères d'acceptation** :
- ✅ Header "⚡🔥 Currently Working On"
- ✅ Empty state si rien :
  - "No active task"
  - "Start working on a task to see it here"
- ✅ Carte task si activité en cours
- ✅ Bouton "View All Tasks >"

---

### 7. MAIN - System Status

#### US-011 : État du Système
**En tant que** utilisateur  
**Je veux** voir l'état du système  
**Afin de** m'assurer que tout fonctionne

**Critères d'acceptation** :
- ✅ Header "🔋 System Status"
- ✅ 3 indicateurs avec checkmarks :
  - ✅ API Connected
  - ✅ WebSocket Active
  - ✅ Database Healthy
- ✅ Couleur verte si OK
- ✅ Couleur rouge si erreur

---

### 8. KANBAN - Structure 6 Colonnes

#### US-012 : Board Kanban 6 Colonnes
**En tant que** utilisateur  
**Je veux** un board Kanban avec 6 colonnes  
**Afin de** gérer mes tâches par étape

**Critères d'acceptation** :
- ✅ 6 colonnes dans l'ordre :
  1. 💡 Ideas/Plans
  2. 📋 Backlog
  3. 📝 To Do
  4. ⚡ In Progress
  5. 🔍 Review
  6. ✅ Done
- ✅ Compteur par colonne (ex: 5 tasks)
- ✅ Bouton "+" sur chaque colonne
- ✅ Scroll horizontal si besoin

---

### 9. KANBAN - Cards Riches

#### US-013 : Cartes Détaillées
**En tant que** utilisateur  
**Je veux** des cartes riches avec beaucoup d'infos  
**Afin de** avoir tout le contexte d'une tâche

**Critères d'acceptation** :
- ✅ **Header card** :
  - 🔴 Status dot (rouge/jaune/vert)
  - Titre clickable
  - Project badge
  - Priority badge (high/medium/low)
- ✅ **Body** :
  - Description (2-3 lignes max)
  - Progress bar (45% - 5/11)
  - Subtasks checkables (☑️/☐)
  - Max 5 visibles, "Show more" si >5
- ✅ **Links section** :
  - 📁 Docs
  - 🔧 Memory files
  - 💬 Sessions
  - 🔀 Git repos
- ✅ **Footer** :
  - Tags pills colorés
  - Timestamps (Started, Updated)
  - Avatar assigné
  - Auto badges (🤖 Auto-created, 🔄 Auto-pickup)

---

#### US-014 : Drag & Drop Cards
**En tant que** utilisateur  
**Je veux** drag & drop les cartes entre colonnes  
**Afin de** changer leur status facilement

**Critères d'acceptation** :
- ✅ Drag smooth (opacity 0.5)
- ✅ Drop zones visibles
- ✅ Sauvegarde immédiate
- ✅ Animation fluide
- ✅ Fonctionne touch (mobile)

---

#### US-015 : Click Subtask Checkbox
**En tant que** utilisateur  
**Je veux** cocher/décocher les subtasks  
**Afin de** marquer ma progression

**Critères d'acceptation** :
- ✅ Click checkbox → Toggle state
- ✅ Progress bar update automatique
- ✅ Sauvegarde immédiate
- ✅ Animation checkmark

---

### 10. RIGHT PANEL - Actions Top

#### US-016 : Boutons Action Header
**En tant que** utilisateur  
**Je veux** des boutons d'action rapides  
**Afin de** archiver ou créer des tâches

**Critères d'acceptation** :
- ✅ 2 boutons en haut :
  - [Archive Completed] (gris)
  - [+ New Task] (orange)
- ✅ Archive → Modal confirmation
- ✅ New Task → Modal création

---

### 11. RIGHT PANEL - Mental State

#### US-017 : Carte Mental State
**En tant que** utilisateur  
**Je veux** voir l'état mental/focus de Michel  
**Afin de** comprendre sur quoi il se concentre

**Critères d'acceptation** :
- ✅ Gradient orange→rouge avec border purple
- ✅ Header :
  - ❤️ Mental State
  - "Updated 7s ago"
  - Bouton collapse
- ✅ **Active Projects** :
  - Badge avec compteur (ex: 1)
  - Liste des projets actifs
- ✅ **Project Card** :
  - Titre + badge status (PLANNING/EXECUTING/REVIEWING)
  - Phase actuelle détaillée
  - Status (✅ COMPLETE! ou en cours)
  - Progress bar avec milestones (66/81 - 81%)
  - Started date
  - Version déployée
  - **Next Steps** (3-5 bullets)
- ✅ Collapsible
- ✅ Update en temps réel

---

### 12. RIGHT PANEL - Idle Mode

#### US-018 : Carte Idle Mode
**En tant que** utilisateur  
**Je veux** voir des suggestions quand Michel est idle  
**Afin de** savoir quoi faire ensuite

**Critères d'acceptation** :
- ✅ Gradient purple/violet
- ✅ Header :
  - ✨ Idle Mode
  - "Not focused on a specific task"
  - Timestamp
- ✅ Message : "Ready to work? Here are some quick actions:"
- ✅ **2 Quick Actions cards** :
  1. 📋 Check To Do (7 tasks waiting)
  2. 💡 Review Ideas (1 items to explore)
- ✅ Cards cliquables
- ✅ **CTA button** : "⚙️ Start something new" (full width, purple gradient)

---

### 13. MODAL - Édition Task

#### US-019 : Modal Full-Screen Task
**En tant que** utilisateur  
**Je veux** un modal complet pour éditer une task  
**Afin de** modifier tous les champs

**Critères d'acceptation** :
- ✅ Click card → Modal full-screen
- ✅ Tous les champs éditables :
  - Titre
  - Description
  - Status (dropdown 6 colonnes)
  - Priority (dropdown)
  - Project (dropdown)
  - Subtasks (add/remove/reorder)
  - Links (add/remove)
  - Tags (add/remove)
  - Assigné
  - Dates
- ✅ Boutons :
  - Save
  - Cancel
  - Delete
- ✅ Validation champs requis
- ✅ Escape key → Ferme

---

### 14. INTERACTIONS - Filtering & Search

#### US-020 : Filtrer par Tag
**En tant que** utilisateur  
**Je veux** filtrer les cards par tag  
**Afin de** voir seulement certaines catégories

**Critères d'acceptation** :
- ✅ Click tag → Active filtre
- ✅ Board montre seulement cards avec ce tag
- ✅ Badge filtre actif visible
- ✅ Click badge → Désactive filtre

---

#### US-021 : Recherche Globale
**En tant que** utilisateur  
**Je veux** chercher dans toutes les tasks  
**Afin de** trouver rapidement ce que je cherche

**Critères d'acceptation** :
- ✅ Input search en header
- ✅ Recherche en temps réel
- ✅ Cherche dans : titre, description, tags
- ✅ Highlight résultats
- ✅ Keyboard shortcut : Cmd/Ctrl + K

---

### 15. CRONJOBS - Timeline Widget

#### US-022 : Timeline Cronjobs Quotidiens
**En tant que** utilisateur  
**Je veux** voir la timeline de mes cronjobs  
**Afin de** savoir quand ils s'exécutent

**Critères d'acceptation** :
- ✅ Widget dans Right Panel ou Sidebar
- ✅ Liste des 5 cronjobs :
  - 8h : Affiliation Full-Time
  - 9h : Morning Control
  - 10h : Tech Watch (L/M/V)
  - 18h30 : Affiliation Recap
  - 21h : Evening Control
- ✅ Countdown pour prochain job
- ✅ Indicateur visuel (🚀, 📊, 🔍, etc.)
- ✅ Click → Détails job

---

#### US-023 : Notifications Cronjobs
**En tant que** utilisateur  
**Je veux** être notifié quand un cronjob s'exécute  
**Afin de** suivre les tâches automatiques

**Critères d'acceptation** :
- ✅ Toast notification quand job démarre
- ✅ Toast quand job termine (success/error)
- ✅ Badge sur icon si job en cours
- ✅ Historique des 10 dernières exécutions

---

### 16. DATA & STATE

#### US-024 : Persistence LocalStorage
**En tant que** utilisateur  
**Je veux** que mes données soient sauvegardées localement  
**Afin de** ne pas perdre mon travail au refresh

**Critères d'acceptation** :
- ✅ Sauvegarde auto à chaque changement
- ✅ Restore au chargement page
- ✅ Debounce 500ms pour perf
- ✅ Gestion erreurs (quota dépassé)

---

#### US-025 : Sync Backend (Future)
**En tant que** utilisateur  
**Je veux** synchroniser avec le backend  
**Afin de** avoir mes données sur tous devices

**Critères d'acceptation** :
- ⏳ API endpoint pour sync
- ⏳ Conflict resolution
- ⏳ Offline mode
- ⏳ Real-time updates (WebSocket)

---

### 17. RESPONSIVE & MOBILE

#### US-026 : Version Mobile
**En tant que** utilisateur mobile  
**Je veux** une version optimisée mobile  
**Afin de** utiliser le dashboard sur mon téléphone

**Critères d'acceptation** :
- ✅ Sidebar → Bottom nav
- ✅ Right panel → Tabs
- ✅ Kanban → Scroll horizontal
- ✅ Cards → Stack vertical
- ✅ Touch gestures (swipe, pinch)

---

### 18. ACCESSIBILITÉ

#### US-027 : Navigation Clavier
**En tant que** utilisateur  
**Je veux** naviguer au clavier  
**Afin de** être plus rapide

**Critères d'acceptation** :
- ✅ Tab navigation
- ✅ Arrow keys (cards)
- ✅ Enter (open modal)
- ✅ Escape (close modal)
- ✅ Shortcuts documentés

---

### 19. TRADUCTION FRANÇAISE

#### US-028 : Interface en Français
**En tant que** utilisateur français  
**Je veux** une interface en français  
**Afin de** mieux comprendre

**Critères d'acceptation** :
- ✅ Tous les textes traduits :
  - "Michel Dashboard" (pas "Michel's")
  - "Tableau de Bord"
  - "Bonsoir, Michel" (pas "Good evening")
  - "Tâches Actives" (pas "Active Tasks")
  - "En Cours" (pas "In Progress")
  - "Terminé" (pas "Done")
  - Etc.
- ✅ Dates en format français
- ✅ Timestamps en français (il y a 2h, il y a 1j)

---

## 📊 PRIORISATION

### 🔴 CRITICAL (Must-have - Phase 1)
- US-001 à US-006 : Sidebar complète
- US-007 à US-011 : Main dashboard
- US-012 à US-015 : Kanban 6 colonnes + cards riches
- US-028 : Traduction française

### 🟡 HIGH (Should-have - Phase 2)
- US-016 à US-018 : Right Panel complet
- US-019 : Modal édition
- US-022 à US-023 : Cronjobs
- US-024 : LocalStorage

### 🟢 MEDIUM (Nice-to-have - Phase 3)
- US-020 à US-021 : Filtering & Search
- US-026 : Mobile responsive
- US-027 : Accessibilité

### 🔵 LOW (Future)
- US-025 : Backend sync

---

## 🎯 DEFINITION OF DONE

Une user story est DONE quand :

1. ✅ **Code implémenté** et testé manuellement
2. ✅ **Design pixel-perfect** vs screenshots Nim
3. ✅ **Animations smooth** (60fps)
4. ✅ **Responsive** (desktop + tablet minimum)
5. ✅ **Textes en français**
6. ✅ **Aucun bug critique**
7. ✅ **Screenshot validé** par Abdessamad

---

## 📈 ROADMAP

### Sprint 1 (2h) - MVP Fonctionnel
- Sidebar complète (US-001 à US-006)
- Main dashboard (US-007 à US-011)
- Kanban 6 colonnes basique (US-012)
- Français partout (US-028)

### Sprint 2 (2h) - Cards Riches
- Cards détaillées (US-013)
- Drag & drop (US-014)
- Subtasks (US-015)

### Sprint 3 (1h30) - Right Panel
- Top actions (US-016)
- Mental State (US-017)
- Idle Mode (US-018)

### Sprint 4 (1h) - Polish & Cronjobs
- Modal édition (US-019)
- Timeline cronjobs (US-022, US-023)
- LocalStorage (US-024)

**Total estimé : 6h30**
