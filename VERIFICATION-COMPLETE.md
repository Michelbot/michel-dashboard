# VÉRIFICATION COMPLÈTE - Dashboard Michel

## ❌ PROBLÈMES IDENTIFIÉS

### 1. Boutons sans handlers
- [ ] 🧠 Mes Pensées
- [ ] 📊 Analytiques  
- [ ] ⚙️ Paramètres
- [ ] + Nouvelle Tâche (colonnes)

### 2. Drag & Drop
- [ ] Cards draggables
- [ ] Drop sur colonnes
- [ ] Sauvegarde état

### 3. Interactions Cards
- [ ] Click card → Modal
- [ ] Edit task
- [ ] Delete task

### 4. Sidebar
- [ ] Click fichiers workspace
- [ ] Expand Memory/
- [ ] Session stats update

---

## ✅ PLAN DE CORRECTION

### ÉTAPE 1 : Vérifier tous les imports
```bash
cd /root/clawd/projects/michel-dashboard
npm install --save @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### ÉTAPE 2 : Implémenter handlers réels

**MainDashboard.tsx** :
- Boutons → Actions réelles (pas alert)
- Stats → Calculs dynamiques

**NewKanbanBoard.tsx** :
- Drag & drop fonctionnel
- Bouton + → Ouvre modal
- Click card → Ouvre modal édition

**Sidebar.tsx** :
- Click fichier → Affiche contenu
- Click Memory/ → Expand/collapse
- Stats → Update auto

### ÉTAPE 3 : Créer système de tests

**tests/interactions.test.ts** :
- Test chaque bouton
- Test drag & drop
- Test modals
- Test sauvegarde

---

## 🔧 CORRECTIONS PRIORITAIRES

### 1. Fix Drag & Drop (CRITIQUE)

**Problème** : Imports manquants ou mal configurés

**Solution** :
```typescript
// Vérifier package.json
"@dnd-kit/core": "^6.1.0",
"@dnd-kit/sortable": "^8.0.0",
"@dnd-kit/utilities": "^3.2.2"

// NewKanbanBoard.tsx - Imports complets
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
```

### 2. Fix Boutons (CRITIQUE)

**MainDashboard.tsx** :
```typescript
const openMentalState = () => {
  // TODO: Ouvrir panel Mental State
  console.log('✅ Mental State clicked');
};

const openAnalytics = () => {
  // TODO: Ouvrir analytics
  console.log('✅ Analytics clicked');
};

const openSettings = () => {
  // TODO: Ouvrir settings
  console.log('✅ Settings clicked');
};

<button onClick={openMentalState}>🧠 Mes Pensées</button>
```

**NewKanbanBoard.tsx** :
```typescript
const [showAddModal, setShowAddModal] = useState(false);

<button onClick={() => setShowAddModal(true)}>
  <Plus />
</button>

{showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
```

### 3. Fix Click Cards (CRITIQUE)

**SortableTaskCard.tsx** :
```typescript
const [showModal, setShowModal] = useState(false);

const handleClick = (e: React.MouseEvent) => {
  // Empêcher click pendant drag
  if (!isDragging) {
    e.stopPropagation();
    setShowModal(true);
  }
};

return (
  <div {...listeners} {...attributes}>
    <div onClick={handleClick}>
      {/* Card content */}
    </div>
  </div>
);
```

---

## 🧪 CHECKLIST VÉRIFICATION

### Backend (Zustand)
- [ ] Store créé et exporté
- [ ] Actions fonctionnent (addTask, updateTask, deleteTask, moveTask)
- [ ] LocalStorage persistence active
- [ ] Log chaque action dans console

### Drag & Drop
- [ ] Packages installés
- [ ] DndContext wraps le board
- [ ] Chaque colonne a useDroppable
- [ ] Chaque card a useSortable
- [ ] handleDragEnd update le store
- [ ] Log chaque drag dans console

### Boutons
- [ ] Chaque bouton a onClick
- [ ] onClick log dans console
- [ ] onClick fait une action visible
- [ ] Hover states fonctionnent

### Modals
- [ ] AddTaskModal existe et fonctionne
- [ ] TaskModal existe et fonctionne
- [ ] Open/close fonctionne
- [ ] Save update le store

### Sidebar
- [ ] Click fichier log console
- [ ] Memory/ expand/collapse
- [ ] Stats correctes

---

## 🎯 SCRIPT DE VÉRIFICATION AUTO

**verify-dashboard.sh** :
```bash
#!/bin/bash

echo "🔍 VÉRIFICATION DASHBOARD MICHEL"
echo "================================"

# 1. Vérifier packages
echo -n "📦 Packages @dnd-kit... "
if npm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities > /dev/null 2>&1; then
  echo "✅"
else
  echo "❌ MANQUANTS"
  npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
fi

# 2. Vérifier handlers onClick
echo -n "🔘 Boutons onClick... "
BUTTONS=$(grep -r "onClick" components/ --include="*.tsx" | wc -l)
echo "$BUTTONS trouvés"

# 3. Vérifier store
echo -n "💾 Store Zustand... "
if grep -q "useDashboardStore" lib/store.ts; then
  echo "✅"
else
  echo "❌"
fi

# 4. Build test
echo -n "🏗️ Build test... "
if npm run build > /tmp/build.log 2>&1; then
  echo "✅"
else
  echo "❌ ERREURS:"
  tail -20 /tmp/build.log
fi

echo ""
echo "✅ Vérification terminée"
```

---

## 🚀 PROCHAINES ACTIONS

1. **Installer packages manquants**
2. **Ajouter onClick à TOUS les boutons**
3. **Vérifier drag & drop complet**
4. **Tester en live chaque interaction**
5. **Logger TOUT dans console**
6. **Screenshot de la console avec logs**

---

**CHAQUE ÉLÉMENT DOIT ÊTRE FONCTIONNEL, PAS DU MOCK !**
