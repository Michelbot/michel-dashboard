# PLAN COMPLET - Dashboard Michel
## Méthodologie Your Claude Engineer (Sans Slack)

Ce plan détaille les 8 phases de développement suivant la méthodologie **Your Claude Engineer**.

---

## 🏗️ PHASE 1 : Setup Architecture Next.js

**Objectif :** Créer la structure de base du projet Next.js 14

**Actions :**
1. Initialiser Next.js 14 avec App Router
2. Configurer TypeScript en mode strict
3. Installer et configurer Tailwind CSS (dark mode)
4. Créer la structure de dossiers :
   ```
   src/
   ├── app/
   ├── components/
   ├── store/
   ├── types/
   └── lib/
   ```
5. Configurer `globals.css` avec variables Tailwind personnalisées

**Test Steps :**
- `npm run dev` démarre sans erreur
- Page d'accueil affiche correctement
- Tailwind fonctionne (test avec classes)
- TypeScript compile sans erreur

**Screenshot Evidence Required :**
- Page localhost:3000 qui charge
- Console DevTools sans erreurs

---

## 📦 PHASE 2 : Installation Packages

**Objectif :** Installer toutes les dépendances nécessaires

**Packages à installer :**
```bash
# Drag & Drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# State Management
npm install zustand

# Utilities
npm install date-fns lucide-react

# Dev dependencies (si besoin)
npm install -D @types/node
```

**Test Steps :**
- Tous les packages installés sans erreur
- `package.json` contient toutes les dépendances
- `npm run build` fonctionne

**Screenshot Evidence Required :**
- `package.json` avec toutes les dépendances

---

## 🎯 PHASE 3 : Types & Data Structure

**Objectif :** Créer les interfaces TypeScript et données initiales

**Fichiers à créer :**

### `src/types/types.ts`
```typescript
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
```

### Données initiales (8-10 tâches)
Créer des tâches d'exemple réalistes avec :
- Mix de priorités (high/medium/low)
- Assignés variés
- Due dates réparties sur 2 semaines
- Tags pertinents

**Test Steps :**
- Fichier types.ts compile sans erreur
- Toutes les interfaces sont correctement typées
- Données initiales respectent les interfaces

**Screenshot Evidence Required :**
- Aucune erreur TypeScript dans VS Code / IDE

---

## 🎨 PHASE 4 : Composants UI Détaillés

**Objectif :** Créer tous les composants UI sans drag & drop d'abord

**Composants à créer :**

### 4.1 Layout Principal (`src/app/page.tsx`)
- Structure trois colonnes
- Layout responsive avec Tailwind Grid

### 4.2 Sidebar (`src/components/Sidebar.tsx`)
- Liste des projets
- Avatar utilisateur
- Navigation
- Couleurs : bg-slate-900, text-slate-100

### 4.3 KanbanBoard (`src/components/KanbanBoard.tsx`)
- Container principal
- Affichage des trois colonnes

### 4.4 KanbanColumn (`src/components/KanbanColumn.tsx`)
- Header avec titre et compte de tâches
- Zone de contenu pour les cartes
- Empty state si aucune tâche
- Bordures et spacing corrects

### 4.5 TaskCard (`src/components/TaskCard.tsx`)
- Affichage titre, description (tronquée)
- Badge de priorité (couleurs : red/orange/gray)
- Avatar assigné
- Due date formatée (date-fns)
- Tags en pills
- Hover states
- Couleurs : bg-slate-800, border-slate-700

### 4.6 RightPanel (`src/components/RightPanel.tsx`)
- Panneau détails (vide pour l'instant)
- Placeholder pour détails de tâche sélectionnée

**Test Steps :**
- Tous les composants s'affichent correctement
- Layout responsive fonctionne (mobile/tablet/desktop)
- Couleurs exactes (slate-900, slate-800, orange-500)
- Typography cohérente
- Hover states fonctionnent

**Screenshot Evidence Required :**
- Vue desktop complète
- Vue mobile (< 768px)
- Vue tablet (768-1024px)
- Hover sur TaskCard
- Tous les badges de priorité (high/medium/low)

---

## 🎯 PHASE 5 : Drag & Drop avec @dnd-kit

**Objectif :** Implémenter fonctionnalité drag & drop complète

**Actions :**

### 5.1 Setup DndContext
- Wrapper KanbanBoard avec `<DndContext>`
- Configuration des sensors (pointer, keyboard)
- Handlers : `onDragStart`, `onDragOver`, `onDragEnd`

### 5.2 Sortable Columns
- Utiliser `SortableContext` pour chaque colonne
- Configurer `verticalListSortingStrategy`

### 5.3 Draggable Cards
- Wrapper TaskCard avec `useSortable`
- Attributs : `setNodeRef`, `attributes`, `listeners`
- Styles de drag : opacity, transform

### 5.4 Visual Feedback
- Overlay pendant le drag
- Drop zones highlighted
- Animations smooth (60fps)
- Cursors appropriés

### 5.5 Logic
- Déplacer entre colonnes (change status)
- Réordonner dans même colonne
- Validation des drops

**Test Steps :**
- Drag carte de "To Do" vers "In Progress" → status change
- Drag carte de "In Progress" vers "Done" → status change
- Réordonner cartes dans même colonne → ordre change
- Drop zones s'illuminent au survol
- Animations sont smooth (pas de lag)
- Carte retourne à position originale si drop invalide

**Screenshot Evidence Required :**
- Carte en cours de drag (avec overlay)
- Drop zone highlighted
- Avant/après déplacement de colonne
- Avant/après réorganisation dans colonne

---

## 🔧 PHASE 6 : Modal & Interactions

**Objectif :** Ajouter modals pour détails et création de tâches

**Composants à créer :**

### 6.1 TaskModal (`src/components/TaskModal.tsx`)
- Overlay dark avec fade animation
- Contenu modal avec tous les détails de la tâche
- Champs éditables : title, description, priority, assignee, due date
- Bouton fermer (X) + ESC key
- Click outside pour fermer

### 6.2 AddTaskModal (`src/components/AddTaskModal.tsx`)
- Formulaire de création
- Champs : title (required), description, priority, assignee, due date
- Validation : titre obligatoire
- Boutons : Cancel, Create
- Ouvre depuis bouton "+" dans column header

### 6.3 Interactions
- Click sur TaskCard → ouvre TaskModal
- Click sur "+" dans KanbanColumn header → ouvre AddTaskModal avec status pré-rempli
- Édition sauvegarde dans store
- Création ajoute tâche avec ID unique

**Test Steps :**
- Click sur carte → modal s'ouvre avec bonnes données
- ESC key → modal se ferme
- Click outside → modal se ferme
- Éditer titre dans modal → change reflété dans carte
- Click "+" dans colonne "To Do" → modal création avec status=todo
- Créer tâche sans titre → erreur validation
- Créer tâche valide → apparaît dans bonne colonne
- Animations fade in/out sont smooth

**Screenshot Evidence Required :**
- TaskModal ouvert avec détails
- AddTaskModal ouvert
- Erreur validation (titre manquant)
- Nouvelle tâche créée dans colonne

---

## 💾 PHASE 7 : Zustand Store + localStorage

**Objectif :** Implémenter state management complet avec persistance

**Fichier : `src/store/useStore.ts`**

### 7.1 Store Structure
```typescript
interface StoreState {
  // Data
  tasks: Record<string, Task>;
  columns: Record<string, Column>;

  // UI State
  selectedTaskId: string | null;
  isTaskModalOpen: boolean;
  isAddModalOpen: boolean;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetStatus: Status) => void;
  reorderTask: (taskId: string, newIndex: number) => void;

  // UI Actions
  selectTask: (id: string | null) => void;
  openTaskModal: () => void;
  closeTaskModal: () => void;
  openAddModal: () => void;
  closeAddModal: () => void;
}
```

### 7.2 localStorage Middleware
- Sauvegarder automatiquement à chaque changement d'état
- Clé : `michel-dashboard-state`
- Hydrater au chargement de l'app
- Gérer les erreurs de parsing

### 7.3 Actions Implementation
- `addTask` : génère ID unique, timestamps
- `updateTask` : merge updates, met à jour `updatedAt`
- `moveTask` : change status, réorganise colonnes
- `reorderTask` : change ordre dans taskIds de la colonne

**Test Steps :**
- Créer une tâche → présente dans store
- Déplacer une tâche → store mis à jour
- Éditer une tâche → store mis à jour
- Rafraîchir page (F5) → données persistent
- Ouvrir DevTools → vérifier localStorage contient données
- Effacer localStorage → app charge avec données initiales
- Aucune erreur console liée au state

**Screenshot Evidence Required :**
- DevTools Application tab → localStorage avec données
- Avant rafraîchissement (avec tâches créées)
- Après rafraîchissement (données toujours là)
- Console sans erreurs

---

## ✨ PHASE 8 : Polish + Responsive

**Objectif :** Finaliser animations, responsive et détails visuels

### 8.1 Animations
- Toutes transitions : `transition-all duration-200 ease-in-out`
- Hover effects sur tous éléments interactifs :
  - Cards : `hover:scale-105 hover:shadow-lg`
  - Buttons : `hover:bg-opacity-80`
  - Links : `hover:text-orange-400`
- Drag animations smooth (déjà fait en Phase 5, vérifier)
- Modal fade in/out smooth
- Loading states (si applicable)

### 8.2 Responsive Breakpoints

**Mobile (< 768px) :**
- Layout stacked vertical
- Tabs pour switcher entre colonnes
- Sidebar devient menu hamburger (optionnel)
- Cards pleine largeur

**Tablet (768px - 1024px) :**
- Layout deux colonnes
- Sidebar collapse/expand
- Cards adaptées

**Desktop (> 1024px) :**
- Layout trois colonnes complet
- Sidebar fixe
- Right panel visible
- Spacing optimal

### 8.3 Micro-interactions
- Button press effect
- Card lift on hover
- Badge pulse on priority high
- Tooltips sur truncated text
- Focus states pour accessibilité

### 8.4 Performance
- Lazy loading si beaucoup de tâches
- Optimiser re-renders (React.memo si besoin)
- Vérifier bundle size
- Lighthouse score > 90

### 8.5 Final Touches
- Favicon personnalisé
- Meta tags (title, description)
- Error boundaries
- Loading skeletons
- Empty states élégants

**Test Steps :**
- Tester sur Chrome, Firefox, Safari
- Tester responsive à toutes breakpoints
- Toutes animations sont 60fps smooth
- Aucun layout shift
- Lighthouse score desktop > 90
- Lighthouse score mobile > 85
- Aucune erreur console
- Aucun warning React
- `npm run build` réussit sans erreur
- Build produit fonctionne (`npm run start`)

**Screenshot Evidence Required :**
- Mobile view (< 768px) - chaque colonne
- Tablet view (768-1024px)
- Desktop view (> 1024px)
- Lighthouse report (Performance, Accessibility, Best Practices)
- Hover states sur différents éléments
- Loading states (si applicable)
- Empty states
- Build réussi (terminal)

---

## ✅ CHECKLIST FINAL

Avant de marquer le projet comme COMPLETE, vérifier :

**Fonctionnel :**
- [ ] Toutes les 8 features de app_spec.txt implémentées
- [ ] Drag & drop fonctionne parfaitement
- [ ] Modals fonctionnent (TaskModal + AddTaskModal)
- [ ] State persiste via localStorage
- [ ] Données survivent au refresh

**Visuel :**
- [ ] Design pixel-perfect par rapport aux specs
- [ ] Couleurs exactes (slate-900, orange-500, etc.)
- [ ] Typography cohérente
- [ ] Spacing et padding corrects
- [ ] Icons lucide-react utilisés

**Responsive :**
- [ ] Mobile (< 768px) parfait
- [ ] Tablet (768-1024px) parfait
- [ ] Desktop (> 1024px) parfait
- [ ] Aucun layout shift

**Performance :**
- [ ] Animations 60fps smooth
- [ ] Aucun lag au drag & drop
- [ ] Build réussit
- [ ] Lighthouse > 90

**Qualité Code :**
- [ ] TypeScript strict mode, 0 erreur
- [ ] 0 console error
- [ ] 0 console warning
- [ ] Code propre et commenté si nécessaire
- [ ] Aucun fichier temporaire dans le projet

**Documentation :**
- [ ] README.md détaillé
- [ ] init.sh fonctionne
- [ ] Screenshots dans /screenshots/

---

## 🎯 RÉSULTAT ATTENDU

Un dashboard qui fait **WOW** :
- ✨ Visuellement magnifique
- ⚡ Ultra responsive et smooth
- 🎨 Design professionnel
- 🚀 Production-ready
- 💎 Chaque détail soigné

**Temps total estimé : 40 minutes MAX**

Suivre cette méthodologie garantit :
1. Qualité constante
2. Aucune régression
3. Progression claire
4. Résultat production-ready
