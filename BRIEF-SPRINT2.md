# BRIEF SPRINT 2 - Michel Dashboard

## 🎯 MISSION

Enrichir le dashboard avec :
1. **Cards ultra-détaillées** (subtasks, links, progress)
2. **Right Panel complet** (Mental State + Idle Mode)

## ✅ ACQUIS (Sprint 1)

- Sidebar complète ✅
- Main dashboard ✅
- Kanban 6 colonnes ✅
- Tout en français ✅
- Drag & drop ✅

## 🚀 SPRINT 2 - OBJECTIFS

### 1. CARDS ENRICHIES (US-013, US-015)

Transformer les cards basiques en cards ultra-riches comme dans Nim's Dashboard.

#### Features à ajouter dans TaskCard.tsx :

**Header card** :
- 🔴 **Status dot** (rouge/jaune/vert selon priority)
- **Progress bar** avec pourcentage (ex: 45% - 5/11)
- Badge **Auto** si auto-created (🤖 Auto-créé)
- Badge **Auto-pickup** si activé (🔄 Récupération auto)

**Body** :
- **Subtasks checkables** :
  ```tsx
  <div className="space-y-2 my-3">
    {subtasks.slice(0, 5).map(subtask => (
      <div key={subtask.id} className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={subtask.completed}
          onChange={() => toggleSubtask(subtask.id)}
          className="w-4 h-4 rounded border-slate-600"
        />
        <span className={subtask.completed ? "line-through text-slate-500" : "text-slate-300"}>
          {subtask.completed ? "☑️" : "☐"} {subtask.text}
        </span>
      </div>
    ))}
    {subtasks.length > 5 && (
      <button className="text-xs text-slate-400 hover:text-slate-300">
        Voir {subtasks.length - 5} de plus...
      </button>
    )}
  </div>
  ```

**Links section** :
```tsx
<div className="border-t border-slate-700 pt-3 mt-3">
  <div className="text-xs font-semibold text-slate-400 mb-2">🔗 LIENS</div>
  <div className="space-y-1">
    {links.map(link => (
      <a 
        key={link.id}
        href={link.url}
        target="_blank"
        className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-500"
      >
        <span>{link.icon}</span>
        <span className="truncate">{link.label}</span>
      </a>
    ))}
  </div>
</div>
```

**Footer enrichi** :
- **Timestamps détaillés** :
  ```tsx
  <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-slate-700">
    <span>⏱️ Début: {formatDistanceToNow(startedAt, { locale: fr })}</span>
    <span>🔄 Modifié: {formatDistanceToNow(updatedAt, { locale: fr })}</span>
  </div>
  ```

#### Types à mettre à jour (lib/types.ts) :

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  column: string;
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0-100
  subtasks: Subtask[];
  links: Link[];
  tags: string[];
  project: string;
  assigned: string;
  autoCreated?: boolean;
  autoPickup?: boolean;
  startedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
}

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Link {
  id: string;
  type: 'doc' | 'memory' | 'session' | 'git';
  label: string;
  url: string;
  icon: string; // '📁', '🔧', '💬', '🔀'
}
```

#### Data à enrichir (lib/data.ts) :

Ajouter aux tasks existantes :
- 3-5 subtasks par task
- 2-4 links par task
- Progress calculé (completed subtasks / total)
- startedAt, updatedAt
- autoCreated: true pour certaines
- autoPickup: true pour d'autres

---

### 2. RIGHT PANEL (US-016, US-017, US-018)

Créer un nouveau fichier **components/EnhancedRightPanel.tsx**

#### Structure :

```tsx
export default function EnhancedRightPanel() {
  return (
    <aside className="hidden xl:block fixed right-0 top-0 w-80 h-screen overflow-y-auto bg-[#0f1419] border-l border-slate-700 p-4 space-y-4">
      {/* Top Actions */}
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm">
          Archiver Terminées
        </button>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold">
          + Nouvelle Tâche
        </button>
      </div>

      {/* Mental State Card */}
      <MentalStateCard />

      {/* Idle Mode Card */}
      <IdleModeCard />
    </aside>
  );
}
```

#### MentalStateCard.tsx :

```tsx
export default function MentalStateCard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl border border-purple-700/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">❤️</span>
          <h3 className="font-semibold text-slate-100">État Mental</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Modifié il y a 7s</span>
          <button onClick={() => setCollapsed(!collapsed)}>
            <ChevronUp className={collapsed ? "rotate-180" : ""} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Active Projects Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span>📊</span>
            <span className="text-sm font-semibold text-slate-300">Projets Actifs</span>
            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">1</span>
          </div>

          {/* Project Card */}
          <div className="bg-[#1a1f2e] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-200">Michel Dashboard</h4>
              <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs font-semibold rounded border border-purple-700">
                EN COURS
              </span>
            </div>

            <div>
              <p className="text-sm text-slate-400">📊 Phase 2 - Cards Enrichies & Right Panel</p>
              <p className="text-sm text-green-500 font-semibold mt-1">✅ Sprint 1 TERMINÉ !</p>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>8 sur 10 milestones</span>
                <span className="text-orange-500 font-bold">80%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full" style={{width: '80%'}} />
              </div>
            </div>

            {/* Metadata */}
            <div className="text-xs text-slate-500 space-y-1">
              <div>📅 Début : 4 février 2026</div>
              <div>🚀 Version : v1.2.0-dev</div>
            </div>

            {/* Next Steps */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">Prochaines Étapes :</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• <strong>Cards enrichies :</strong> Subtasks + Links</li>
                <li>• <strong>Right Panel :</strong> Mental State + Idle</li>
                <li>• <strong>Polish final :</strong> Animations + Responsive</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

#### IdleModeCard.tsx :

```tsx
export default function IdleModeCard() {
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-700/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h3 className="font-semibold text-slate-100">Mode Veille</h3>
        </div>
        <span className="text-xs text-slate-400">il y a 7s</span>
      </div>

      <p className="text-sm text-slate-400 mb-3">
        Non concentré sur une tâche spécifique
      </p>

      <p className="text-sm text-slate-300 font-medium mb-4">
        Prêt à travailler ? Voici quelques actions rapides :
      </p>

      {/* Quick Actions */}
      <div className="space-y-2">
        <button className="w-full bg-slate-800/50 hover:bg-slate-700 rounded-lg p-3 text-left transition-all duration-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="text-sm font-medium text-slate-200">Vérifier À Faire</p>
              <p className="text-xs text-slate-400">4 tâches en attente</p>
            </div>
          </div>
        </button>

        <button className="w-full bg-slate-800/50 hover:bg-slate-700 rounded-lg p-3 text-left transition-all duration-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-medium text-slate-200">Revoir Idées</p>
              <p className="text-xs text-slate-400">1 élément à explorer</p>
            </div>
          </div>
        </button>
      </div>

      {/* CTA Button */}
      <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
        <span>⚙️</span>
        <span>Commencer quelque chose</span>
      </button>
    </div>
  );
}
```

---

### 3. INTÉGRATION (app/page.tsx)

Modifier le layout pour inclure le Right Panel :

```tsx
export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#0a0e1a]">
      <Sidebar />
      <main className="flex-1 lg:ml-64 xl:mr-80 overflow-hidden">
        <MainDashboard />
        <NewKanbanBoard />
      </main>
      <EnhancedRightPanel />
    </div>
  );
}
```

---

## 📦 PACKAGES À INSTALLER

```bash
npm install date-fns
# Pour les dates en français
```

---

## 🎯 CHECKLIST SPRINT 2

- [ ] Mettre à jour types.ts (Subtask, Link interfaces)
- [ ] Enrichir data.ts (subtasks, links, progress)
- [ ] Modifier TaskCard.tsx :
  - [ ] Progress bar
  - [ ] Subtasks checkables
  - [ ] Links section
  - [ ] Timestamps détaillés
  - [ ] Auto badges
- [ ] Créer EnhancedRightPanel.tsx
- [ ] Créer MentalStateCard.tsx
- [ ] Créer IdleModeCard.tsx
- [ ] Intégrer Right Panel dans page.tsx
- [ ] Responsive (hide on < xl breakpoint)
- [ ] Test toggleSubtask functionality
- [ ] Test links cliquables
- [ ] Screenshot final

---

## ✅ DEFINITION OF DONE

Sprint 2 est DONE quand :
1. Cards montrent subtasks + links + progress
2. Click checkbox → Toggle subtask
3. Progress auto-update quand subtask change
4. Right Panel visible sur xl+ screens
5. Mental State montre projet actuel
6. Idle Mode montre quick actions
7. Tout responsive
8. Aucune erreur build
9. Screenshot validé

---

## 🚀 TEMPS ESTIMÉ

**2 heures MAX**

**GO !** ⚡
