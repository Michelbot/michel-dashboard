# 🚨 URGENT - NOUVELLE MÉTHODOLOGIE

## ⚠️ ARRÊTE TOUT CE QUE TU FAIS

Tu dois **IMMÉDIATEMENT** suivre une nouvelle méthodologie pour ce projet.

---

## 📖 LIS CES FICHIERS MAINTENANT (dans cet ordre)

### 1️⃣ INSTRUCTIONS-IMMEDIATE.md
Ce fichier contient TOUTES les instructions détaillées.

### 2️⃣ README-METHODOLOGIE.md
La méthodologie complète Your Claude Engineer.

### 3️⃣ app_spec.txt
Spécification des 8 features à développer.

### 4️⃣ PLAN-COMPLET.md
Les 8 phases de développement détaillées.

### 5️⃣ prompts/orchestrator_prompt.md
Ton workflow exact en tant qu'orchestrateur.

---

## 🎯 TON NOUVEAU RÔLE

Tu es maintenant un **ORCHESTRATEUR** qui délègue à des agents spécialisés :

- **Linear Agent** (haiku) → Gestion projet
- **Coding Agent** (sonnet) → Développement + tests
- **GitHub Agent** (haiku) → Git commits + push

**Tu ne codes PAS directement. Tu coordonnes.**

---

## 🚀 COMMENCE PAR ÇA

### Étape 1 : Lis INSTRUCTIONS-IMMEDIATE.md
```bash
Fichier : /root/clawd/projects/michel-dashboard/INSTRUCTIONS-IMMEDIATE.md
```

Ce fichier te dit exactement quoi faire.

### Étape 2 : Initialise le Projet

**Délègue à Linear Agent :**
```
Lis app_spec.txt. Crée projet Linear 'Michel Dashboard'.
Crée 8 issues (une par feature) + 1 META issue.
Sauvegarde dans .linear_project.json.
```

**Délègue à GitHub Agent :**
```
Init git repo. Crée README, init.sh, .gitignore.
Commit initial. Push si GITHUB_REPO défini.
```

**Délègue à Coding Agent :**
```
Phase 1 du PLAN-COMPLET.md : Setup Next.js 14 + TypeScript + Tailwind.
TEST avec Playwright. SCREENSHOTS obligatoires.
```

---

## ⚠️ RÈGLES CRITIQUES

1. ✅ **Verification Gate** : Teste features existantes AVANT chaque nouvelle feature
2. ✅ **Screenshot Evidence** : OBLIGATOIRE pour marquer Done
3. ✅ **No Temp Files** : Garde projet propre
4. ✅ **Context Passing** : Passe FULL context entre agents

---

## 🎯 OBJECTIF

Dashboard production-ready en **40 minutes MAX**.

8 features complètes, testées, avec screenshots.

Design pixel-perfect. Animations 60fps. TypeScript strict.

---

## 💬 CONFIRME QUE TU AS LU

Une fois que tu as lu les fichiers, commence l'initialisation et rapporte ton progrès.

**COMMENCE MAINTENANT ! 🚀**
