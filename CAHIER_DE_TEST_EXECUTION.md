# Cahier de Test - Système d'Exécution de Tâches

## Objectif
Valider le fonctionnement complet du pipeline d'exécution automatique des tâches.

---

## 1. Tests de Création de Tâches

### Test 1.1 - Création simple dans Backlog
- [ ] Créer une tâche dans "Backlog" assignée à "Sarah Chen"
- [ ] Vérifier qu'aucune exécution ne se déclenche
- [ ] Vérifier que la tâche apparaît dans la colonne Backlog

### Test 1.2 - Création avec agent dans Backlog
- [ ] Créer une tâche assignée à "OpenClaw AI" dans "Backlog"
- [ ] Vérifier qu'aucune exécution ne se déclenche (pas dans "En Cours")
- [ ] Badge "Récupération auto" visible sur la carte

### Test 1.3 - Création directe dans "En Cours" avec agent
- [ ] Créer une tâche dans "En Cours" assignée à "OpenClaw AI"
- [ ] Vérifier le warning "Exécution automatique activée" dans le modal
- [ ] Après création, vérifier que l'exécution se déclenche automatiquement
- [ ] Badge d'exécution "En attente" puis "En cours" visible

---

## 2. Tests de Déclenchement d'Exécution

### Test 2.1 - Drag & Drop vers "En Cours" (sans agent)
- [ ] Créer tâche dans "À Faire" assignée à "David Park"
- [ ] Drag vers "En Cours"
- [ ] Vérifier: PAS d'exécution déclenchée
- [ ] Status change uniquement

### Test 2.2 - Drag & Drop vers "En Cours" (avec agent)
- [ ] Créer tâche dans "Backlog" assignée à "OpenClaw AI"
- [ ] Ajouter des sous-tâches:
  - "Analyser les besoins"
  - "Implémenter la solution"
  - "Tester le code"
- [ ] Drag vers "En Cours"
- [ ] Vérifier:
  - [ ] Toast "Exécution démarrée: [titre]"
  - [ ] Badge "En attente" → "En cours" sur la carte
  - [ ] Barre de progression cyan pulsante
  - [ ] executionState = "executing"

### Test 2.3 - Modification d'assignation
- [ ] Tâche dans "À Faire" assignée à "Sarah Chen"
- [ ] Drag vers "En Cours" (pas d'exécution)
- [ ] Ouvrir modal, changer assigné à "OpenClaw AI"
- [ ] Sauvegarder
- [ ] Vérifier si exécution se déclenche (devrait se déclencher)

---

## 3. Tests d'Interface Temps Réel

### Test 3.1 - Onglet Exécution dans TaskModal
- [ ] Ouvrir une tâche en cours d'exécution
- [ ] Cliquer sur onglet "Exécution"
- [ ] Vérifier:
  - [ ] Badge de status (En cours/En attente)
  - [ ] Barre de progression
  - [ ] Logs en temps réel
  - [ ] Auto-scroll des logs
  - [ ] Bouton "Annuler" visible

### Test 3.2 - Indicateurs sur TaskCard
- [ ] Pendant exécution, vérifier sur la carte:
  - [ ] Badge cyan "En cours X%"
  - [ ] Barre de progression cyan pulsante
  - [ ] Étape courante affichée (si disponible)

### Test 3.3 - Mise à jour progress
- [ ] Simuler webhook progress_update
- [ ] Vérifier mise à jour immédiate dans UI

---

## 4. Tests des Webhooks

### Test 4.1 - Webhook progress_update
```bash
curl -X POST http://localhost:3000/api/openclaw/webhook \
  -H "Content-Type: application/json" \
  -d '{"taskId":"xxx","executionId":"xxx","action":"progress_update","data":{"progress":50,"message":"Mi-chemin"}}'
```
- [ ] Progress passe à 50%
- [ ] Message visible dans logs

### Test 4.2 - Webhook subtask_complete
```bash
curl -X POST http://localhost:3000/api/openclaw/webhook \
  -H "Content-Type: application/json" \
  -d '{"taskId":"xxx","executionId":"xxx","action":"subtask_complete","data":{"subtaskId":"st-xxx"}}'
```
- [ ] Sous-tâche cochée automatiquement
- [ ] Progress recalculé
- [ ] Log ajouté

### Test 4.3 - Webhook request_review
```bash
curl -X POST http://localhost:3000/api/openclaw/webhook \
  -H "Content-Type: application/json" \
  -d '{"taskId":"xxx","executionId":"xxx","action":"request_review","data":{"reviewNotes":"Vérifier le code"}}'
```
- [ ] Status passe à "paused"
- [ ] Notes de révision affichées
- [ ] Tâche peut être déplacée vers "Révision"

### Test 4.4 - Webhook complete
```bash
curl -X POST http://localhost:3000/api/openclaw/webhook \
  -H "Content-Type: application/json" \
  -d '{"taskId":"xxx","executionId":"xxx","action":"complete","data":{"summary":"Tâche terminée avec succès"}}'
```
- [ ] Status = "completed"
- [ ] Progress = 100%
- [ ] Tâche déplacée automatiquement vers "Terminé"
- [ ] Toast de succès

### Test 4.5 - Webhook error
```bash
curl -X POST http://localhost:3000/api/openclaw/webhook \
  -H "Content-Type: application/json" \
  -d '{"taskId":"xxx","executionId":"xxx","action":"error","data":{"error":"Timeout dépassé"}}'
```
- [ ] Status = "failed"
- [ ] Erreur affichée en rouge
- [ ] executionState = "idle"

---

## 5. Tests d'Annulation

### Test 5.1 - Annuler via bouton
- [ ] Tâche en exécution
- [ ] Ouvrir modal → onglet Exécution
- [ ] Cliquer "Annuler"
- [ ] Vérifier:
  - [ ] Status = "cancelled"
  - [ ] Badge disparaît ou devient "Annulé"
  - [ ] Logs montrent l'annulation

### Test 5.2 - Annuler via API
```bash
curl -X POST http://localhost:3000/api/execution/cancel \
  -H "Content-Type: application/json" \
  -d '{"taskId":"xxx"}'
```
- [ ] Même résultat que 5.1

---

## 6. Tests de Flow Complet

### Test 6.1 - Pipeline complet A→Z
1. [ ] Créer tâche "Implémenter feature X" dans Idées
2. [ ] Ajouter description détaillée
3. [ ] Ajouter 3 sous-tâches
4. [ ] Assigner à "OpenClaw AI"
5. [ ] Drag vers Backlog
6. [ ] Drag vers À Faire
7. [ ] Drag vers En Cours
8. [ ] Vérifier exécution démarre
9. [ ] Observer les logs en temps réel
10. [ ] Observer les sous-tâches se cocher
11. [ ] Tâche se déplace vers Terminé
12. [ ] Vérifier toutes les données finales

### Test 6.2 - Flow avec révision
1. [ ] Même début que 6.1
2. [ ] Simuler webhook request_review
3. [ ] Vérifier déplacement vers "Révision"
4. [ ] Manuellement drag vers "Terminé"

---

## 7. Tests de Robustesse

### Test 7.1 - Exécution simultanée (limite)
- [ ] Créer 3 tâches avec agent
- [ ] Drag les 3 vers "En Cours" rapidement
- [ ] Vérifier: max 2 en exécution, 1 en queue
- [ ] Message "Maximum concurrent executions reached"

### Test 7.2 - Reconnexion SSE
- [ ] Pendant exécution, couper réseau 5 secondes
- [ ] Reconnecter
- [ ] Vérifier que l'état se resynchronise

### Test 7.3 - Refresh page pendant exécution
- [ ] Exécution en cours
- [ ] Refresh la page
- [ ] Vérifier que l'état est restauré (ou reconnecté)

---

## 8. Tests API Directes

### Test 8.1 - GET /api/execution/events (SSE)
```bash
curl -N http://localhost:3000/api/execution/events
```
- [ ] Reçoit "connected" event
- [ ] Reçoit heartbeat toutes les 30s
- [ ] Reçoit events d'exécution

### Test 8.2 - POST /api/execution/start
```bash
curl -X POST http://localhost:3000/api/execution/start \
  -H "Content-Type: application/json" \
  -d '{"taskId":"task-123","title":"Test","description":"Test exec"}'
```
- [ ] Retourne executionId
- [ ] success = true

### Test 8.3 - GET /api/openclaw/webhook
```bash
curl http://localhost:3000/api/openclaw/webhook
```
- [ ] Retourne liste des actions disponibles

---

## 9. Vérifications Serveur

### Test 9.1 - Logs serveur
- [ ] Vérifier logs Next.js pendant exécution
- [ ] Pas d'erreurs non gérées
- [ ] Spawn OpenClaw visible

### Test 9.2 - Memory leaks
- [ ] Exécuter 10 tâches
- [ ] Vérifier que les anciennes exécutions sont nettoyées
- [ ] Pas de fuite mémoire évidente

---

## Résultats

| Test | Status | Notes |
|------|--------|-------|
| 1.1 | ⬜ | |
| 1.2 | ⬜ | |
| 1.3 | ⬜ | |
| 2.1 | ⬜ | |
| 2.2 | ⬜ | |
| 2.3 | ⬜ | |
| 3.1 | ⬜ | |
| 3.2 | ⬜ | |
| 3.3 | ⬜ | |
| 4.1 | ⬜ | |
| 4.2 | ⬜ | |
| 4.3 | ⬜ | |
| 4.4 | ⬜ | |
| 4.5 | ⬜ | |
| 5.1 | ⬜ | |
| 5.2 | ⬜ | |
| 6.1 | ⬜ | |
| 6.2 | ⬜ | |
| 7.1 | ⬜ | |
| 7.2 | ⬜ | |
| 7.3 | ⬜ | |
| 8.1 | ⬜ | |
| 8.2 | ⬜ | |
| 8.3 | ⬜ | |
| 9.1 | ⬜ | |
| 9.2 | ⬜ | |

---

## Légende
- ⬜ Non testé
- ✅ Passé
- ❌ Échoué
- ⚠️ Partiellement passé
