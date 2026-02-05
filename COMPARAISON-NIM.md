# COMPARAISON : Dashboard Michel VS Nim's Dashboard

## 📸 IMAGES DE RÉFÉRENCE (Nim's Dashboard)

### Image 1 : Vue principale
- Sidebar gauche avec avatar, status, fichiers workspace, stats
- Kanban central avec colonnes
- Right panel avec Mental State + Idle Mode

### Image 2 : Kanban détaillé
- 6 colonnes : Ideas/Plans → Backlog → To Do → In Progress → Review → Done
- Cartes riches avec beaucoup de détails

### Image 3 : Carte exemple "Phase 4 Work Orchestration"
- Header : Status dot, titre, progression (45% - 5/11)
- Tags : 🤖 Auto-created, 🔄 Auto-pickup enabled
- Description complète
- Subtasks avec checkboxes (☑️ fait, ☐ à faire)
- Links section : 📁 Docs, 🔧 Memory, 💬 Sessions, 🔀 Git
- Tags pills en bas
- Timestamps (Started, Updated)
- Assigné avec auto-pickup

---

## ❌ CE QUI MANQUE DANS NOTRE DASHBOARD

### 1. SIDEBAR GAUCHE
**Actuellement** :
- ✅ Avatar Michel
- ✅ Menu Dashboard
- ✅ Liste projets (4 projets)
- ✅ Settings
- ✅ Footer avec user

**Manque (d'après IMAGE 1 - Vue principale)** :
- ❌ **Avatar avec badge doré** (coin bas droite)
- ❌ **Status indicator** : • Online (point vert)
- ❌ **XP Bar** : Progress bar avec level/XP (50%)
- ❌ **💬 STATUS** : 
  - Icon bulle de dialogue
  - Carte avec fond slate-800
  - Texte en italique : "Building something amazing..."
  - Border gauche accent bleu
  
- ❌ **📂 WORKSPACE FILES** : 
  - Header : "📁 WORKSPACE FILES" en majuscules
  - 7 fichiers avec icônes colorées + timestamps :
    - ❤️ HEARTBEAT.md — 1h ago
    - 👤 USER.md — 23h ago
    - 🔧 TOOLS.md — 1d ago
    - 🧠 MEMORY.md — 2d ago
    - 🆔 IDENTITY.md — 3d ago
    - 📋 AGENTS.md — 3d ago
    - ✨ SOUL.md — 3d ago
  - Hover effect sur chaque ligne
  - Timestamps en gris clair (right aligned)
  
- ❌ **📁 MEMORY/ (31 FILES)** : 
  - Section collapsible avec triangle ▶️
  - Icon dossier 📁
  - Compteur de fichiers
  
- ❌ **📊 SESSION STATS** :
  - Header : "📊 SESSION STATS" en majuscules
  - 2 cards horizontales :
    - **MESSAGES** :
      - Label en gris
      - Chiffre cyan/bleu : 619
      - Card fond slate-800
    - **TOOLS USED** :
      - Label en gris
      - Chiffre cyan/bleu : 7
      - Card fond slate-800
- ❌ **Footer version** : v1.2.0 🌙 Always curious

---

### 2. KANBAN BOARD
**Actuellement** :
- ✅ 3 colonnes (To Do, In Progress, Done)
- ✅ Drag & drop
- ✅ Cards basiques

**Manque** :
- ❌ 6 colonnes au lieu de 3
  - Ideas/Plans
  - Backlog
  - To Do
  - In Progress
  - Review
  - Done
- ❌ Compteur par colonne avec design pill
- ❌ Icons par colonne (💡 📋 📝 ⚡ 🔍 ✅)

---

### 3. CARDS (CARTES)
**Actuellement** :
- ✅ Titre
- ✅ Description (1 ligne)
- ✅ Tags
- ✅ Date
- ✅ Assigné

**Manque** :
- ❌ **Status dot** (🔴 rouge/🟡 jaune/🟢 vert)
- ❌ **Progression bar** (45% - 5/11 subtasks)
- ❌ **Subtasks checkables** :
  - ☑️ Tâches complétées (avec checkmarks)
  - ☐ Tâches restantes
  - Liste expandable si > 5 subtasks
- ❌ **Links section** :
  - 📁 Fichier docs (ex: "nim-dashboard/docs/phase4...")
  - 🔧 Memory file (ex: "memory/nim-dashboard-project.md")
  - 💬 Session reference (ex: "Session: main-2026-01-30-19:47")
  - 🔀 Git repo (ex: "ssh://git@git.mydomain.eu:222/...")
- ❌ **Tags badges** (multiples, colorés)
- ❌ **Timestamps détaillés** :
  - ⏱️ Started: 2h ago
  - 🔄 Updated: 5m ago
- ❌ **Auto badges** :
  - 🤖 Auto-created
  - 🔄 Auto-pickup enabled
- ❌ **Project badge** (ex: "nim-dashboard")
- ❌ **Priority badge** (high/medium/low avec couleurs)

---

### 4. RIGHT PANEL
**Actuellement** :
- ❌ N'existe pas du tout !

**Manque TOUT (d'après IMAGE RIGHT PANEL)** :

#### Top Actions
- ❌ **[Archive Completed]** : Bouton gris foncé (top left)
- ❌ **[+ New Task]** : Bouton orange vif (top right)

#### Mental State Card (Gradient orange→rouge avec border purple)
- ❌ **Header** :
  - Icon ❤️🧡 (heart/orange heart)
  - Titre : "Mental State"
  - Timestamp : "Updated 7s ago" (avec icon clock)
  - Bouton collapse (chevron up)
  
- ❌ **Active Projects section** :
  - Badge : "📊 Active Projects" avec compteur orange "1"
  
- ❌ **Project Card** : "Nim Dashboard"
  - Badge status : "PLANNING" (violet)
  - Phase : "📊 Phase 3 - Model Status, Stop Controls & File Monitoring"
  - Checkmark : ✅ **COMPLETE!**
  - Progress : "66 of 81 milestones" avec bar orange à 81%
  - Started : "📅 1/30/2026"
  - Version : "🚀 v1.3.0-dev (deployed to dev)"
  
- ❌ **Next Steps** :
  - Liste à puces (bullets) :
    - **"6-Column Kanban:**"
    - **"Enhanced Task Cards:**"
    - **"Active Work Monitoring:**"

#### Idle Mode Card (Gradient violet/purple)
- ❌ **Header** :
  - Icon ✨🔮 (sparkles/crystal ball)
  - Titre : "Idle Mode"
  - Subtitle : "Not focused on a specific task"
  - Timestamp : "7s ago"
  
- ❌ **Message** :
  - "Ready to work? Here are some quick actions:"
  
- ❌ **Quick Actions** (2 cards) :
  1. **Check To Do**
     - Icon 📋
     - "7 tasks waiting"
     - Card cliquable
  2. **Review Ideas**
     - Icon 💡
     - "1 items to explore"
     - Card cliquable
  
- ❌ **Button CTA** :
  - "⚙️ Start something new" (full width, purple gradient)

---

### 5. HEADER / TOP BAR
**Actuellement** :
- ❌ Pas de header global

**Manque (d'après IMAGE 1)** :
- ❌ **Title** : "Nim's Dashboard" (en haut à gauche du main)
- ❌ **Badge** : "DEVELOPMENT" (en haut à droite)
- ❌ **Grande carte gradient purple/pink** :
  - Icon 🌙
  - **Greeting** : "Good evening, Nim"
  - **Subtitle** : "Your personal workspace & command center"
  - **3 boutons** :
    - 🧠 On My Mind
    - 📊 Analytics
    - ⚙️ Settings

### 6. STATS CARDS (Dashboard principal)
**Actuellement** :
- ❌ N'existent pas

**Manque (d'après IMAGE 1)** :
- ❌ **3 cards stats horizontales** :
  1. **📋 ACTIVE TASKS**
     - Chiffre principal : 10
     - Subtitle : "13 total"
     - Icon clipboard
  2. **⚡ IN PROGRESS**
     - Chiffre principal : 0
     - Subtitle : "Working on now"
     - Icon éclair/foudre
  3. **✅ COMPLETED**
     - Chiffre principal : 0
     - Subtitle : "All time"
     - Icon checkmark vert

### 7. CURRENTLY WORKING ON (Section centrale)
**Actuellement** :
- ❌ N'existe pas

**Manque (d'après IMAGE 1)** :
- ❌ **Section "⚡ 🔥 Currently Working On"** :
  - Empty state : "No active task"
  - Message : "Start working on a task to see it here"
  - Button : "View All Tasks >" avec arrow

### 8. SYSTEM STATUS (Footer section)
**Actuellement** :
- ❌ N'existe pas

**Manque (d'après IMAGE 1)** :
- ❌ **Section "🔋 System Status"** :
  - 3 indicators avec checkmarks verts :
    - ✅ API Connected
    - ✅ WebSocket Active
    - ✅ Database Healthy

---

### 6. INTERACTIONS
**Actuellement** :
- ✅ Click card → Basic modal
- ✅ Drag & drop

**Manque** :
- ❌ Click subtask checkbox → Auto-update progress
- ❌ Click link → Open in new tab
- ❌ Click tag → Filter board
- ❌ Hover animations smooth
- ❌ Archive completed tasks button
- ❌ Keyboard shortcuts

---

### 7. DATA & STATE
**Actuellement** :
- ✅ LocalStorage basique
- ✅ Zustand store

**Manque** :
- ❌ Auto-task creation
- ❌ Auto-pickup logic
- ❌ Session tracking
- ❌ Git integration
- ❌ Memory files linking
- ❌ Real-time updates

---

## 🎨 DESIGN DIFFERENCES

### Couleurs
**Nim** :
- Background: Très dark (#0a0e1a environ)
- Cards: Gradients subtils
- Accents: Purple, pink, orange

**Michel (actuel)** :
- Background: slate-900
- Cards: slate-800
- Accents: orange-500

### Typography
**Nim** :
- Plus compact
- Font weights variés
- Icons plus présents

**Michel** :
- Plus espacé
- Weights uniformes
- Icons moins présents

### Spacing
**Nim** :
- Cards plus denses
- Padding réduit
- Plus d'info visible

**Michel** :
- Cards aérées
- Padding généreux
- Info limitée

---

## 📊 RÉSUMÉ FEATURES MANQUANTES

### CRITIQUES (Must-have)
1. ❌ 6 colonnes Kanban (pas 3)
2. ❌ Subtasks checkables dans cards
3. ❌ Links section (docs, memory, git, sessions)
4. ❌ Progress bar sur cards
5. ❌ Right panel (Mental State + Idle Mode)

### IMPORTANTES (Should-have)
6. ❌ Status dots colorés
7. ❌ Auto badges (auto-created, auto-pickup)
8. ❌ Timestamps détaillés (Started, Updated)
9. ❌ Sidebar : Status, Activity, Files, Stats
10. ❌ Header global avec greeting

### NICE-TO-HAVE
11. ❌ Workspace files list
12. ❌ Session stats
13. ❌ Tags filtering
14. ❌ Archive automation
15. ❌ Keyboard shortcuts

---

## 🎯 PROCHAINES ÉTAPES

### Phase 1 : Structure (30 min)
- [ ] Passer de 3 à 6 colonnes
- [ ] Ajouter Right Panel layout
- [ ] Français partout
- [ ] Header global

### Phase 2 : Cards riches (45 min)
- [ ] Subtasks checkables
- [ ] Links section
- [ ] Progress bar
- [ ] Status dots
- [ ] Auto badges
- [ ] Timestamps

### Phase 3 : Sidebar enrichie (20 min)
- [ ] Status indicator
- [ ] Current Activity
- [ ] Workspace Files
- [ ] Session Stats

### Phase 4 : Right Panel (30 min)
- [ ] Mental State card
- [ ] Idle Mode card

### Phase 5 : Polish (20 min)
- [ ] Animations smooth
- [ ] Hover effects
- [ ] Colors matching Nim
- [ ] Responsive final

**Total estimé : 2h30**

---

## 🚀 PLAN D'ACTION

**JE PROPOSE** :
1. Commencer par Phase 1 (structure + français)
2. Puis Phase 2 (cards riches)
3. Tester après chaque phase
4. Continuer si validation OK

**OK POUR COMMENCER ?** 💪

---

## 📅 CRONJOBS ACTIFS (à intégrer dans Dashboard)

### Jobs configurés

#### 1. Affiliation Full-Time Job
- **ID** : `affiliation-fulltime-job`
- **Schedule** : Tous les jours à 8h00
- **Type** : systemEvent (session main)
- **Action** : Lance le travail quotidien affiliation
- **Message** : "🚀 8h00 - Début journée affiliation ! Sites web, contenu, tracking. Récap obligatoire à 18h30."

#### 2. Affiliation Daily Recap
- **ID** : `affiliation-daily-recap`
- **Schedule** : Tous les jours à 18h30
- **Type** : systemEvent (session main)
- **Action** : Récapitulatif journée affiliation
- **Message** : "📊 18h30 - Récap affiliation obligatoire ! Fait/marché/pas marché/coûts/revenus dans memory/."

#### 3. Morning Control Check
- **ID** : `morning-control-check`
- **Schedule** : Tous les jours à 9h00
- **Type** : systemEvent (session main)
- **Action** : Vérification matinale (emails, business, sites)
- **Message** : "☀️ 9h - Control Check ! Emails, business (Gumroad/Chrome Store), sites accessibles."

#### 4. Evening Control Check
- **ID** : `evening-control-check`
- **Schedule** : Tous les jours à 21h00
- **Type** : systemEvent (session main)
- **Action** : Bilan de journée
- **Message** : "🌙 21h - Control Check ! Bilan journée, stats, technique."

#### 5. Tech Watch & Improvements
- **ID** : `tech-watch-improvements`
- **Schedule** : Lundi, Mercredi, Vendredi à 10h00
- **Type** : systemEvent (session main)
- **Action** : Veille technologique
- **Message** : "🔍 10h - Tech Watch ! Clawdbot releases, ClawdHub skills, Anthropic news. Proposer améliorations."

### À intégrer dans le Dashboard

**Section "Scheduled Tasks"** (Right Panel ou Sidebar) :
- Liste des cronjobs actifs
- Prochaine exécution (countdown)
- Status (enabled/disabled)
- Quick actions (run now, disable, edit)

**Notifications Dashboard** :
- Quand cronjob se déclenche → Toast notification
- Historique des exécutions récentes
- Résultats des jobs (success/error)

**Widget Timeline** :
- Vue journée avec horaires des jobs
- Indicateurs visuels (🚀 8h, 📊 18h30, etc.)
- Click pour voir détails

---
