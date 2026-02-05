# TEST MANUEL COMPLET - Dashboard Michel

## 🎯 OBJECTIF
Vérifier que CHAQUE interaction fonctionne. Pas de mock data, que du vrai.

---

## ✅ CHECKLIST DE TEST

### 1. SIDEBAR

#### Avatar & Status
- [ ] Avatar "M" affiché avec badge doré
- [ ] Texte "• En ligne" avec point vert animé
- [ ] XP bar à 50% visible

#### Status Card
- [ ] Card avec border cyan visible
- [ ] Texte "Construction de quelque chose d'incroyable..." en italique

#### Workspace Files (7 fichiers)
- [ ] ❤️ HEARTBEAT.md - il y a 1h
- [ ] 👤 USER.md - il y a 23h
- [ ] 🔧 TOOLS.md - il y a 1j
- [ ] 🧠 MEMORY.md - il y a 2j
- [ ] 🆔 IDENTITY.md - il y a 3j
- [ ] 📋 AGENTS.md - il y a 3j
- [ ] ✨ SOUL.md - il y a 3j
- [ ] Hover → Background change
- [ ] Click → Console log ou action

#### Memory Section
- [ ] "▶ 📁 MEMORY/ (31 FILES)" affiché
- [ ] Click → Expand/collapse
- [ ] Triangle rotate

#### Session Stats
- [ ] Card "MESSAGES" avec chiffre 619 en cyan
- [ ] Card "OUTILS" avec chiffre 7 en cyan

---

### 2. MAIN DASHBOARD

#### Header
- [ ] Titre "Michel Dashboard" à gauche
- [ ] Badge "DEVELOPMENT" violet à droite

#### Greeting Card (Gradient purple→pink)
- [ ] Icon 🌙 (ou ☀️/🌤️ selon heure)
- [ ] Message "Bonsoir, Michel"
- [ ] Subtitle "Votre espace de travail..."
- [ ] **3 BOUTONS** :
  - [ ] 🧠 Mes Pensées → Click → Console log OU action
  - [ ] 📊 Analytiques → Click → Console log OU action
  - [ ] ⚙️ Paramètres → Click → Console log OU action

#### Stats Cards (3 horizontales)
- [ ] **Tâches Actives** : Chiffre correct (9/11)
- [ ] **En Cours** : Chiffre correct (1) en orange
- [ ] **Terminé** : Chiffre correct (2) en vert
- [ ] Hover → Translate up + shadow

#### Travail en Cours
- [ ] Section "⚡🔥 Travail en Cours"
- [ ] Card task affichée si inprogress
- [ ] Titre + description + tags visibles

#### État Système
- [ ] Section "🔋 État Système"
- [ ] 3 indicateurs :
  - [ ] ✅ API Connectée
  - [ ] ✅ WebSocket Actif
  - [ ] ✅ Base de Données OK

---

### 3. KANBAN BOARD

#### Structure 6 Colonnes
- [ ] 💡 Idées/Plans
- [ ] 📋 Backlog
- [ ] 📝 À Faire
- [ ] ⚡ En Cours
- [ ] 🔍 Révision
- [ ] ✅ Terminé

#### Chaque Colonne
- [ ] Titre + icon affiché
- [ ] Compteur tasks correct
- [ ] **Bouton +** :
  - [ ] Visible et hover effect
  - [ ] Click → Console log OU ouvre modal

#### Cards (Tester avec 1 card)
- [ ] **DRAG START** :
  - [ ] Card devient draggable
  - [ ] Cursor devient grab
  - [ ] Opacity 0.5 pendant drag
  - [ ] Console log "Drag started: [task-id]"

- [ ] **DRAG OVER COLONNE** :
  - [ ] Colonne change d'apparence (border/background)
  - [ ] Drop zone visible

- [ ] **DROP** :
  - [ ] Card apparaît dans nouvelle colonne
  - [ ] Ancienne colonne perd la card
  - [ ] Compteurs colonnes update
  - [ ] Console log "Tâche déplacée vers: [column]"
  - [ ] **SAUVEGARDE** : Refresh page → Card toujours dans nouvelle colonne

- [ ] **CLICK CARD** :
  - [ ] Console log "Card clicked: [task-id]"
  - [ ] OU Modal s'ouvre (si implémenté)

#### Test Drag & Drop Complet
1. Prendre card "Développer popup extension" (En Cours)
2. Drag vers "Révision"
3. Vérifier :
   - ✅ Card dans Révision
   - ✅ Compteur "En Cours" : 0
   - ✅ Compteur "Révision" : 2
   - ✅ Console logs présents
4. Refresh page (F5)
5. Vérifier :
   - ✅ Card toujours dans Révision

---

### 4. CONSOLE (F12)

#### Logs Requis
- [ ] "✅ Dashboard loaded"
- [ ] "Store initialized with X tasks"
- [ ] Au drag : "Drag started: task-X"
- [ ] Au drop : "✅ Tâche déplacée vers: [column]"
- [ ] Au click bouton : "Button clicked: [name]"

#### Aucune Erreur
- [ ] 0 erreurs rouges
- [ ] 0 warnings critiques
- [ ] Network : Pas de 404

---

### 5. LOCALSTORAGE

#### Vérifier Sauvegarde
1. Ouvrir DevTools → Application → Local Storage
2. Chercher clé `michel-dashboard-storage`
3. Vérifier :
   - [ ] Clé existe
   - [ ] JSON valide
   - [ ] Contient les tasks
   - [ ] Task status update après drag & drop

---

### 6. RESPONSIVE (Bonus)

#### Desktop (> 1024px)
- [ ] Sidebar visible à gauche
- [ ] Kanban scroll horizontal
- [ ] Tout affiché

#### Tablet (768-1024px)
- [ ] Sidebar collapsible OU cachée
- [ ] Kanban scroll horizontal
- [ ] Lisible

#### Mobile (< 768px)
- [ ] Sidebar → Bottom nav OU menu
- [ ] Kanban → Stack vertical OU scroll
- [ ] Touch drag & drop fonctionne

---

## 🚨 TESTS CRITIQUES (MUST PASS)

### Test #1 : Build
```bash
npm run build
```
**Résultat attendu** : ✅ Build successful, 0 errors

### Test #2 : Dev Server
```bash
npm run dev
```
**Résultat attendu** : ✅ Server running on localhost:3000

### Test #3 : Console Clean
**Résultat attendu** : 0 erreurs rouges au chargement

### Test #4 : Drag & Drop
1. Drag une card
2. Drop dans autre colonne
3. Refresh page
**Résultat attendu** : Card dans la nouvelle colonne après refresh

### Test #5 : Click Boutons
Click sur les 3 boutons header
**Résultat attendu** : Console log OU action visible pour chaque bouton

---

## ✅ CRITÈRES DE SUCCÈS

**Dashboard est VALIDE si** :
1. ✅ Build sans erreur
2. ✅ 0 erreur console au chargement
3. ✅ Drag & drop fonctionne ET sauvegarde
4. ✅ TOUS les boutons réagissent au click
5. ✅ Console logs présents pour chaque interaction

**Dashboard est INVALIDE si** :
- ❌ Erreurs build
- ❌ Erreurs console
- ❌ Drag & drop ne fonctionne pas
- ❌ Boutons morts (aucune réaction)
- ❌ Pas de sauvegarde

---

## 📝 RAPPORT DE TEST

**Date** : __________
**Testeur** : __________

**Résultat Global** : ⬜ PASS / ⬜ FAIL

**Détails** :
- Sidebar : ⬜ OK / ⬜ KO
- Main Dashboard : ⬜ OK / ⬜ KO
- Kanban Drag & Drop : ⬜ OK / ⬜ KO
- Boutons : ⬜ OK / ⬜ KO
- LocalStorage : ⬜ OK / ⬜ KO

**Bugs trouvés** :
1. ___________________________
2. ___________________________
3. ___________________________

**Actions correctives** :
1. ___________________________
2. ___________________________
3. ___________________________
