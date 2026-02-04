# 🚀 Méthodologie Your Claude Engineer
## Configuration pour Dashboard Michel (Sans Slack)

Ce document explique comment utiliser la méthodologie **Your Claude Engineer** pour développer le Dashboard de Michel.

---

## 📁 Structure du Projet

```
michel-dashboard/
├── app_spec.txt                    # Spécification complète (8 features)
├── BRIEF.md                        # Brief original
├── PLAN-COMPLET.md                 # Plan détaillé en 8 phases
├── README-METHODOLOGIE.md          # Ce fichier
├── prompts/
│   ├── orchestrator_prompt.md     # Prompt orchestrateur (sans Slack)
│   ├── coding_agent_prompt.md     # Prompt agent de code
│   ├── linear_agent_prompt.md     # Prompt agent Linear
│   ├── github_agent_prompt.md     # Prompt agent GitHub
│   ├── initializer_task.md        # Tâche d'initialisation
│   └── continuation_task.md       # Tâche de continuation
└── [Le code sera généré ici]
```

---

## 🎯 Méthodologie : Architecture Multi-Agents

### Agents Disponibles

1. **📋 Linear Agent (Haiku)**
   - Crée et gère les issues Linear
   - Suit le statut des tâches (Todo → In Progress → Done)
   - Maintient un META issue pour tracking de sessions

2. **💻 Coding Agent (Sonnet)**
   - Développe les fonctionnalités
   - Teste avec Playwright (browser automation)
   - **OBLIGATOIRE** : Fournit des screenshots comme preuve

3. **🔧 GitHub Agent (Haiku)**
   - Commits automatiques
   - Push vers remote (si configuré)
   - Création de Pull Requests

4. **🚫 Slack Agent**
   - **DÉSACTIVÉ** pour ce projet (pas de notifications Slack)

---

## 🔄 Workflow de Développement

### Session Initiale (Première fois)

```
1. Linear Agent
   ├─ Lit app_spec.txt
   ├─ Crée projet Linear
   ├─ Crée 8 issues (une par feature)
   └─ Crée META issue pour tracking

2. GitHub Agent
   ├─ Init git repository
   ├─ Crée README.md, init.sh, .gitignore
   ├─ Commit initial
   └─ Push si GITHUB_REPO configuré

3. Coding Agent (optionnel)
   └─ Commence première feature
```

### Sessions Suivantes

```
Pour chaque feature :

1. ORIENT
   └─ Lire .linear_project.json

2. GET STATUS (Linear Agent)
   ├─ Récupérer état du projet
   ├─ Lire dernier commentaire META
   └─ Obtenir détails prochaine issue

3. VERIFICATION TEST (Coding Agent) ⚠️ OBLIGATOIRE
   ├─ Tester 1-2 features existantes
   ├─ Screenshots de preuve
   └─ Report PASS/FAIL

   Si FAIL → FIX d'abord, pas de nouvelle feature !

4. IMPLEMENT (Coding Agent)
   ├─ Développer la feature
   ├─ Tests Playwright
   └─ Screenshots OBLIGATOIRES

5. COMMIT & PUSH (GitHub Agent)
   ├─ Commit avec message descriptif
   └─ Push vers remote

6. MARK DONE (Linear Agent)
   ├─ Mettre à jour issue → Done
   ├─ Ajouter screenshots en commentaire
   └─ Logger détails implémentation
```

---

## ✅ Gates de Qualité (CRITIQUES)

### 1. Verification Gate
**Avant chaque nouvelle feature :**
- Tester les features existantes
- Si FAIL → Fix régressions AVANT nouvelle feature
- Si PASS → Procéder à l'implémentation

### 2. Screenshot Evidence Gate
**Avant de marquer Done :**
- Coding Agent DOIT fournir screenshots
- Pas de screenshots = Pas de Done
- Screenshots dans `/screenshots/`

### 3. No Temp Files
**Garder projet propre :**
- ✅ Autorisé : src/, package.json, README.md, init.sh, screenshots/
- ❌ Interdit : `*_SUMMARY.md`, `test_*.py`, `*_REPORT.md`

---

## 📝 Instructions pour Claude (PID 2951865)

### Si vous êtes l'agent qui développe actuellement :

**1. LIRE D'ABORD :**
```
1. app_spec.txt       - Spécification complète
2. PLAN-COMPLET.md    - Les 8 phases détaillées
3. prompts/orchestrator_prompt.md - Méthodologie orchestration
```

**2. SUIVRE L'ORCHESTRATEUR :**
- Vous êtes l'orchestrateur principal
- Déléguez aux agents spécialisés via Task tool
- Passez le contexte entre agents (ils ne partagent pas la mémoire)

**3. ORDRE D'EXÉCUTION :**
```bash
Phase 1: Setup Next.js + architecture
Phase 2: Install packages (@dnd-kit, zustand, date-fns, lucide-react)
Phase 3: Créer types.ts avec interfaces
Phase 4: Composants UI (Sidebar, Kanban, Cards, RightPanel)
Phase 5: Drag & drop avec @dnd-kit
Phase 6: Modals + interactions
Phase 7: Zustand store + localStorage
Phase 8: Polish animations + responsive
```

**4. POUR CHAQUE PHASE :**
- Implémenter complètement
- Tester avec Playwright
- Prendre screenshots
- Commit
- Passer à la suivante

**5. CRITÈRES DE SUCCÈS :**
- Design IDENTIQUE aux specs
- Animations 60fps smooth
- TypeScript strict, 0 erreur
- Build réussit
- Production-ready

---

## 🛠️ Commandes Utiles

### Démarrage du projet
```bash
cd /root/clawd/projects/michel-dashboard

# Si init.sh existe
chmod +x init.sh && ./init.sh

# Sinon
npm install
npm run dev
```

### Tests Playwright (pour Coding Agent)
```bash
# Démarrer serveur dev
npm run dev

# Dans un autre terminal, utiliser Playwright MCP tools :
# - mcp__playwright__browser_navigate
# - mcp__playwright__browser_snapshot
# - mcp__playwright__browser_click
# - mcp__playwright__browser_take_screenshot
```

### Vérifications Qualité
```bash
# TypeScript check
npx tsc --noEmit

# Build production
npm run build

# Preview build
npm run start
```

---

## 📊 Suivi de Progression

### Fichier `.linear_project.json`
```json
{
  "project_id": "...",
  "project_name": "Michel Dashboard",
  "team_id": "...",
  "meta_issue_id": "...",
  "total_issues": 8,
  "issue_ids": ["..."]
}
```

Ce fichier est créé par Linear Agent et sert de **source de vérité** pour l'orchestrateur.

### Issues Linear
- **Total : 8 issues** (une par feature de app_spec.txt)
- **1 META issue** pour tracking de sessions
- Statuts : Todo → In Progress → Done
- Chaque issue a des **Test Steps** détaillés

---

## 🎯 Détection de Complétion

### Le projet est COMPLET quand :
```
done_count == total_issues (8)
```

**Alors l'orchestrateur doit :**
1. Commenter "PROJECT COMPLETE" sur META issue
2. Créer final PR (si GitHub configuré)
3. Afficher : `PROJECT_COMPLETE: All features implemented and verified.`

---

## 🚨 Anti-Patterns à Éviter

❌ **Ne PAS faire :**
- Sauter le verification test
- Marquer Done sans screenshots
- Créer files temporaires dans root
- Continuer si verification FAIL
- Laisser des erreurs console

✅ **TOUJOURS faire :**
- Vérifier avant chaque nouvelle feature
- Screenshots pour CHAQUE feature
- Commit régulièrement
- Garder projet propre
- Fix régressions immédiatement

---

## 📸 Screenshots Requis

### Organisation
```
screenshots/
├── ISSUE-1-layout-navigation.png
├── ISSUE-1-responsive-mobile.png
├── ISSUE-2-kanban-columns.png
├── ISSUE-3-task-cards.png
├── ISSUE-4-drag-drop-action.png
├── ISSUE-5-task-modal.png
├── ISSUE-6-add-task-modal.png
├── ISSUE-7-localStorage-persist.png
├── ISSUE-8-responsive-all.png
└── verification-*.png
```

### Naming Convention
```
{issue-id}-{description}.png
ou
verification-{feature}.png
```

---

## 🎨 Qualité Visuelle

### Couleurs Exactes (Tailwind)
- Background : `slate-900`, `slate-800`
- Text : `slate-100`, `slate-300`
- Accent : `orange-500`, `orange-600`
- Success : `green-500`
- Warning : `yellow-500`
- Error : `red-500`
- Borders : `slate-700`

### Animations
- Transitions : `transition-all duration-200 ease-in-out`
- Hover : `hover:scale-105`, `hover:shadow-lg`
- Toutes à 60fps

---

## ⏱️ Timeline

**Total : 40 minutes MAX**

```
Phase 1: Setup (5 min)
Phase 2: Packages (2 min)
Phase 3: Types (3 min)
Phase 4: UI Components (10 min)
Phase 5: Drag & Drop (8 min)
Phase 6: Modals (5 min)
Phase 7: Store (5 min)
Phase 8: Polish (7 min)
```

---

## 🎯 Résultat Final Attendu

Un dashboard qui fait **WOW** :

✨ **Design**
- Pixel-perfect, pas un prototype
- Couleurs et spacing exacts
- Typography professionnelle

⚡ **Performance**
- Animations 60fps smooth
- Aucun lag
- Build optimisé

🎯 **Fonctionnel**
- Toutes features opérationnelles
- Data persiste
- Responsive complet

💎 **Qualité**
- Production-ready
- Zero TypeScript errors
- Zero console errors
- Tests Playwright passent

---

## 📞 Support

Si problème durant le développement :
1. Vérifier `app_spec.txt` pour specs exactes
2. Consulter `PLAN-COMPLET.md` pour détails de phase
3. Lire `prompts/orchestrator_prompt.md` pour workflow
4. Vérifier gates de qualité sont respectées

---

**Prêt à créer quelque chose de magnifique ! 🚀**
