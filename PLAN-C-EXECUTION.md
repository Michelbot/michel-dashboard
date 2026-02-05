# PLAN C - CORRECTION CIBLÉE

**Durée estimée** : 30 minutes
**Objectif** : Corriger fichier par fichier, build test après chaque fix

---

## ÉTAPE 1 : CORRIGER LE STORE (5 min)

Ajouter au store :
- [ ] isAddModalOpen: boolean
- [ ] addModalStatus: TaskStatus | null
- [ ] openAddModal(status: TaskStatus)
- [ ] closeAddModal()
- [ ] isTaskModalOpen: boolean
- [ ] taskModalId: string | null
- [ ] openTaskModal(id: string)
- [ ] closeTaskModal()

---

## ÉTAPE 2 : CORRIGER COMPOSANTS (20 min)

### 2.1 AddTaskModal.tsx
- [ ] Vérifier imports
- [ ] Tester build

### 2.2 TaskModal.tsx
- [ ] Vérifier imports
- [ ] Tester build

### 2.3 DroppableColumn.tsx
- [ ] Fix types Task
- [ ] Tester build

### 2.4 SortableTaskCard.tsx
- [ ] Fix types Task
- [ ] Tester build

### 2.5 KanbanColumn.tsx
- [ ] Fix types Task
- [ ] Tester build

---

## ÉTAPE 3 : BUILD FINAL (5 min)

- [ ] npm run build
- [ ] Vérifier 0 erreur
- [ ] Test dev server
- [ ] Test interactions

---

**GO !**
