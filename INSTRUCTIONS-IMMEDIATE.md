# ⚠️ INSTRUCTIONS IMMÉDIATES - NOUVELLE MÉTHODOLOGIE

## 🛑 STOP - Lis ceci AVANT de continuer

Tu dois maintenant suivre la **méthodologie Your Claude Engineer** pour développer ce dashboard.

---

## 📖 ÉTAPE 1 : LECTURE OBLIGATOIRE (5 minutes)

Lis ces fichiers **DANS CET ORDRE** avant de coder quoi que ce soit :

### 1️⃣ README-METHODOLOGIE.md
**Ce fichier explique :**
- L'architecture multi-agents (Linear, Coding, GitHub)
- Le workflow complet (Orient → Status → Verify → Implement → Commit → Done)
- Les gates de qualité CRITIQUES
- Comment utiliser les agents spécialisés

### 2️⃣ app_spec.txt
**Ce fichier contient :**
- Spécification complète des 8 features
- Test steps détaillés pour chaque feature
- Structure de données TypeScript
- Critères de succès

### 3️⃣ PLAN-COMPLET.md
**Ce fichier détaille :**
- Les 8 phases de développement
- Actions précises pour chaque phase
- Test steps et screenshots requis
- Checklist finale

### 4️⃣ prompts/orchestrator_prompt.md
**Ce fichier définit :**
- Ton rôle d'orchestrateur
- Comment déléguer aux agents spécialisés
- Le workflow exact à suivre
- Les anti-patterns à éviter

---

## 🎯 ÉTAPE 2 : COMPRENDRE TON RÔLE

**Tu es l'ORCHESTRATEUR**, pas un codeur direct.

### Ce que tu dois faire :
1. **Déléguer** aux agents spécialisés via `Task` tool
2. **Passer le contexte** entre agents (ils ne partagent pas la mémoire)
3. **Vérifier** la qualité à chaque étape
4. **Coordonner** le workflow complet

### Agents disponibles :
- `linear` (haiku) - Gestion projet Linear
- `coding` (sonnet) - Développement + tests Playwright
- `github` (haiku) - Git commits + push

---

## 🚀 ÉTAPE 3 : DÉMARRAGE (INITIALISATION)

Puisque c'est la **PREMIÈRE SESSION**, suis ce processus :

### 3.1 Déléguer à Linear Agent
```
"Lis app_spec.txt pour comprendre ce qu'on construit. Ensuite :

1. Crée un projet Linear nommé 'Michel Dashboard'
2. Crée 8 issues (une par feature de app_spec.txt)
   - Chaque issue doit inclure les Test Steps dans la description
3. Crée un META issue '[META] Project Progress Tracker' pour tracking de sessions
4. Ajoute un commentaire initial au META issue avec résumé du projet et statut session 1
5. Sauvegarde l'état dans .linear_project.json
6. Retourne : project_id, total_issues créés, meta_issue_id"
```

### 3.2 Déléguer à GitHub Agent
```
"Initialize git repository :

1. Vérifie si GITHUB_REPO env var est défini (echo $GITHUB_REPO)
2. Crée README.md avec aperçu du projet
3. Crée init.sh pour démarrer le dev server
4. Crée .gitignore pour Next.js
5. git init
6. Commit initial avec ces fichiers + .linear_project.json
7. Si GITHUB_REPO est défini : ajoute remote et push
8. Rapporte si remote a été configuré"
```

### 3.3 Commencer Phase 1 : Setup Architecture
Délégue à Coding Agent :
```
"Démarre la Phase 1 du PLAN-COMPLET.md : Setup Architecture Next.js

Actions :
1. Initialise Next.js 14 avec App Router (npx create-next-app@latest)
2. Configure TypeScript strict mode
3. Configure Tailwind CSS en dark mode
4. Crée structure de dossiers : src/app, src/components, src/store, src/types, src/lib
5. Configure globals.css avec variables Tailwind

Test via Playwright :
- Démarre dev server (npm run dev)
- Navigate vers localhost:3000
- Prends screenshot de la page qui charge
- Vérifie console DevTools (aucune erreur)

OBLIGATOIRE : Fournis screenshot_evidence
RAPPEL : Nettoie tout fichier temporaire avant de finir"
```

---

## ⚠️ RÈGLES CRITIQUES À RESPECTER

### 1. Verification Gate (OBLIGATOIRE)
**Avant CHAQUE nouvelle feature :**
- Délègue à Coding Agent : tester 1-2 features existantes
- Attends PASS/FAIL
- Si FAIL → Fix régressions AVANT nouvelle feature
- Si PASS → Procède à l'implémentation

### 2. Screenshot Evidence Gate (OBLIGATOIRE)
**Avant de marquer une issue Done :**
- Vérifie que Coding Agent a fourni `screenshot_evidence` paths
- Si pas de screenshots → REJETTE et demande les screenshots
- Passe les paths des screenshots à Linear Agent pour marquer Done

**Pas de screenshot = Pas de Done**

### 3. No Temporary Files
**Garde le projet propre :**
- ✅ Autorisé : src/, package.json, screenshots/, README.md, init.sh
- ❌ Interdit : *_SUMMARY.md, test_*.py, *_REPORT.md, test-*.html

Rappelle au Coding Agent : "Nettoie les fichiers temporaires avant de finir"

### 4. Context Passing
**Les agents ne partagent PAS la mémoire.**

Tu DOIS passer le contexte :
```
Linear Agent returns: { issue_id: "ABC-123", title: "Timer", description: "...", test_steps: [...] }
        ↓
TU passes à Coding Agent: "Implémente issue ABC-123: [FULL context]"
        ↓
Coding Agent returns: { files_changed: [...], screenshot_evidence: [...], test_results: [...] }
        ↓
TU passes à Linear Agent: "Marque ABC-123 Done avec screenshots: [paths]"
```

❌ Ne dis JAMAIS : "Coding agent, check Linear pour l'issue"
✅ Dis TOUJOURS : "Coding agent, implémente cette issue : [full context from linear]"

---

## 📋 WORKFLOW POUR CHAQUE FEATURE (Phases 2-8)

### Pour chaque phase du PLAN-COMPLET.md :

1. **Orient** : Lis .linear_project.json

2. **Get Status** (Linear Agent) :
   - Derniers commentaires META issue
   - Comptage issues (Done/In Progress/Todo)
   - Détails COMPLETS de la prochaine issue

3. **Verification Test** (Coding Agent) :
   - Teste features déjà complétées
   - Screenshots
   - Report PASS/FAIL
   - ⚠️ Si FAIL → Fix d'abord !

4. **Implement** (Coding Agent) :
   - Passe FULL context de l'issue
   - Development
   - Tests Playwright OBLIGATOIRES
   - Screenshots OBLIGATOIRES

5. **Commit & Push** (GitHub Agent) :
   - Passe files_changed de Coding Agent
   - Commit avec message descriptif
   - Push si remote configuré

6. **Mark Done** (Linear Agent) :
   - Passe issue_id, files_changed, screenshots, test_results
   - Marque issue Done
   - Ajoute commentaire avec détails

---

## 🎯 OBJECTIF FINAL

Créer un dashboard qui fait **WOW** :

✨ **Design**
- Pixel-perfect selon app_spec.txt
- Couleurs exactes : slate-900, orange-500
- Animations 60fps smooth

⚡ **Fonctionnel**
- 8 features complètes et testées
- Drag & drop fluide
- Data persiste (localStorage)
- Responsive parfait

💎 **Qualité**
- TypeScript strict, 0 erreur
- 0 console error/warning
- Build réussit
- Production-ready

**Temps : 40 minutes MAX**

---

## 📊 Détection de Complétion

**Le projet est COMPLET quand :**
```
done_count == 8 (total_issues)
```

**Alors tu dois :**
1. Linear Agent : ajoute "PROJECT COMPLETE" au META issue
2. GitHub Agent : crée final PR avec toutes les features
3. Affiche : `PROJECT_COMPLETE: All features implemented and verified.`

---

## 🚦 COMMENCE MAINTENANT

1. ✅ Lis les 4 fichiers mentionnés ci-dessus
2. ✅ Comprends ton rôle d'orchestrateur
3. ✅ Démarre avec l'étape 3.1 (Linear Agent)
4. ✅ Suis le workflow pour chaque phase
5. ✅ Respecte les gates de qualité

**Ne code RIEN directement. Délègue aux agents spécialisés.**

**Bonne chance ! 🚀**
