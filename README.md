# Michel Dashboard

Un tableau de bord personnel et centre de commande avec Kanban Board, gestion des tâches, et suivi de productivité.

## Table des Matières

- [Installation](#installation)
- [Démarrage Rapide](#démarrage-rapide)
- [Fonctionnalités](#fonctionnalités)
  - [1. Tableau de Bord Principal](#1-tableau-de-bord-principal)
  - [2. Kanban Board](#2-kanban-board)
  - [3. Gestion des Tâches](#3-gestion-des-tâches)
  - [4. Panneau de Droite (Right Panel)](#4-panneau-de-droite-right-panel)
  - [5. Recherche et Filtres](#5-recherche-et-filtres)
  - [6. Sidebar Navigation](#6-sidebar-navigation)
  - [7. Notifications Toast](#7-notifications-toast)
  - [8. Mode Mobile](#8-mode-mobile)
- [Architecture Technique](#architecture-technique)
- [Structure des Fichiers](#structure-des-fichiers)
- [Guide de Personnalisation](#guide-de-personnalisation)
- [Raccourcis Clavier](#raccourcis-clavier)
- [Dépannage](#dépannage)

---

## Installation

### Prérequis

- Node.js 18+
- npm, yarn, pnpm, ou bun

### Étapes d'Installation

```bash
# Cloner le projet
git clone <repository-url>
cd michel-dashboard

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## Démarrage Rapide

1. **Créer une tâche** : Cliquez sur le bouton `+` dans n'importe quelle colonne du Kanban
2. **Voir les détails** : Cliquez sur une carte de tâche pour ouvrir le modal détaillé
3. **Déplacer une tâche** : Glissez-déposez une carte vers une autre colonne
4. **Rechercher** : Utilisez la barre de recherche en haut pour filtrer les tâches
5. **Naviguer** : Utilisez la sidebar à gauche pour accéder aux différentes sections

---

## Fonctionnalités

### 1. Tableau de Bord Principal

Le tableau de bord affiche une vue d'ensemble de votre activité.

#### Composants

| Élément | Description |
|---------|-------------|
| **Message de Bienvenue** | Salutation dynamique selon l'heure (Bonjour/Bon après-midi/Bonsoir) |
| **Boutons d'Action Rapide** | Pensées, Stats, Config - accès rapide aux fonctions |
| **Statistiques** | Cartes affichant : Tâches Actives, En Cours, Terminées |
| **Travail en Cours** | Affiche la tâche actuellement "En Cours" avec ses tags |
| **État Système** | Indicateurs de status : API, WebSocket, Base de Données |

#### Statistiques Affichées

- **Tâches Actives** : Nombre de tâches non terminées (status ≠ done)
- **En Cours** : Nombre de tâches avec status "inprogress"
- **Terminé** : Nombre de tâches avec status "done"

### 2. Kanban Board

Un tableau Kanban à 6 colonnes avec drag & drop.

#### Colonnes

| Colonne | Icône | Description |
|---------|-------|-------------|
| **Idées/Plans** | 💡 | Idées et concepts initiaux |
| **Backlog** | 📋 | Tâches planifiées mais non prioritaires |
| **À Faire** | 📝 | Prochaines tâches à accomplir |
| **En Cours** | ⚡ | Travail actif en ce moment |
| **Révision** | 🔍 | En attente de review ou validation |
| **Terminé** | ✅ | Tâches complétées |

#### Fonctionnalités Drag & Drop

- **Glisser une carte** : Maintenez le clic et déplacez vers une autre colonne
- **Indicateur visuel** : La colonne cible s'illumine en orange lors du survol
- **Mise à jour automatique** : Le status de la tâche est automatiquement mis à jour

#### Ajouter une Tâche

1. Cliquez sur le bouton `+` dans l'en-tête de la colonne souhaitée
2. Remplissez le formulaire (titre obligatoire)
3. Cliquez sur "Create Task"

### 3. Gestion des Tâches

#### Créer une Tâche (Modal d'Ajout)

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| **Title** | ✅ Oui | Nom de la tâche |
| **Description** | Non | Détails et contexte |
| **Priority** | Non | Low, Medium (défaut), High |
| **Assignee** | Non | Personne assignée |
| **Tags** | Non | Labels séparés par virgules |

#### Voir/Modifier une Tâche (Modal de Détail)

Cliquez sur une carte pour ouvrir le modal complet avec :

**Informations Affichées :**
- Titre et description
- Status actuel avec badge coloré
- Priorité (Low/Medium/High)
- Personne assignée avec avatar
- Tags de la tâche
- Progression avec barre visuelle
- Date de création et dernière mise à jour

**Actions Disponibles :**

| Action | Description |
|--------|-------------|
| **Éditer** | Modifie titre, description, priorité, tags |
| **Déplacer vers** | Change le status rapidement (6 boutons) |
| **Sous-tâches** | Ajouter, cocher, supprimer des sous-tâches |
| **Archiver** | Supprime la tâche (si terminée) |
| **Fermer** | Ferme le modal (ou touche Échap) |

#### Gestion des Sous-tâches

Les sous-tâches permettent de décomposer une tâche en étapes :

1. **Ajouter** : Tapez dans le champ et appuyez Entrée ou cliquez "Ajouter"
2. **Cocher** : Cliquez sur la checkbox pour marquer comme fait
3. **Supprimer** : Cliquez sur le bouton `×` à droite
4. **Progression** : La barre de progression se met à jour automatiquement

### 4. Panneau de Droite (Right Panel)

Le panneau latéral droit affiche des informations contextuelles.

#### Sections

| Section | Description |
|---------|-------------|
| **Accès Rapide** | Liens vers les sections fréquentes |
| **Projets Actifs** | Liste des projets avec nombre de tâches |
| **Statistiques** | Métriques de productivité |
| **Activité Récente** | Dernières actions effectuées |

#### Navigation par Projets

- Chaque projet affiche son nom et le nombre de tâches associées
- Cliquez sur un projet pour filtrer les tâches (fonctionnalité future)

### 5. Recherche et Filtres

#### Barre de Recherche

- **Recherche en temps réel** : Les résultats filtrent instantanément
- **Recherche par** : Titre, description, tags
- **Compteur** : Affiche "X tâches trouvées"

#### Filtres de Priorité

| Filtre | Couleur | Description |
|--------|---------|-------------|
| **Tous** | Gris | Affiche toutes les tâches |
| **Low** | Gris | Priorité basse uniquement |
| **Medium** | Orange | Priorité moyenne uniquement |
| **High** | Rouge | Priorité haute uniquement |

#### Utilisation

1. Tapez dans la barre de recherche pour filtrer par texte
2. Cliquez sur un bouton de priorité pour filtrer par niveau
3. Les filtres sont combinables (texte + priorité)
4. Cliquez "Tous" pour réinitialiser le filtre de priorité

### 6. Sidebar Navigation

La sidebar gauche permet de naviguer entre les sections.

#### Éléments de Navigation

| Icône | Section | Description |
|-------|---------|-------------|
| 🏠 | Dashboard | Tableau de bord principal |
| 📋 | Kanban | Tableau Kanban des tâches |
| 📊 | Statistiques | Vue statistiques (à venir) |
| ⚙️ | Paramètres | Configuration (à venir) |

#### Comportement Mobile

- La sidebar se replie automatiquement sur mobile
- Bouton hamburger pour ouvrir/fermer
- Overlay sombre pour fermer en cliquant à l'extérieur

### 7. Notifications Toast

Les toasts informent des actions effectuées.

#### Types de Notifications

| Type | Couleur | Exemple |
|------|---------|---------|
| **Success** | Vert | "Tâche archivée avec succès" |
| **Error** | Rouge | "Erreur lors de la suppression" |
| **Info** | Bleu | "Tâche mise à jour" |

#### Comportement

- Apparition en bas à droite avec animation slide-up
- Disparition automatique après 3 secondes
- Bouton `×` pour fermer manuellement

### 8. Mode Mobile

Le dashboard est entièrement responsive.

#### Adaptations Mobile (<1024px)

| Élément | Comportement Mobile |
|---------|---------------------|
| **Sidebar** | Se replie, accessible via bouton hamburger |
| **Kanban** | Une seule colonne visible à la fois |
| **Onglets Colonnes** | Navigation horizontale avec swipe |
| **Right Panel** | Masqué (disponible en scroll) |
| **Cards** | Largeur 100% |
| **Boutons** | Taille augmentée pour touch (44px min) |

#### Navigation Mobile du Kanban

- Onglets en haut affichant les 6 colonnes
- Chaque onglet montre l'icône et le nombre de tâches
- Scroll horizontal pour voir tous les onglets
- Cliquez sur un onglet pour afficher cette colonne

---

## Architecture Technique

### Stack Technologique

| Technologie | Usage |
|-------------|-------|
| **Next.js 16** | Framework React avec App Router |
| **TypeScript** | Typage statique strict |
| **Tailwind CSS** | Styling utilitaire |
| **Zustand** | Gestion d'état global |
| **@dnd-kit** | Drag & drop accessible |
| **date-fns** | Formatage des dates |
| **Lucide React** | Icônes SVG |

### Gestion d'État (Zustand)

Le store centralise toutes les données et actions :

```typescript
// Données
tasks: Task[]           // Liste des tâches
projects: Project[]     // Liste des projets
searchQuery: string     // Texte de recherche
priorityFilter: Priority | 'all'  // Filtre priorité

// États UI
isAddModalOpen: boolean
selectedTaskId: string | null
showToast: boolean
toastMessage: string
```

### Persistance des Données

- **LocalStorage** : Les tâches sont automatiquement sauvegardées
- **Hydratation** : Chargement au démarrage du navigateur
- **Synchronisation** : Mise à jour à chaque modification

---

## Structure des Fichiers

```
michel-dashboard/
├── app/
│   ├── layout.tsx      # Layout principal avec providers
│   ├── page.tsx        # Page d'accueil
│   └── globals.css     # Styles globaux et animations
├── components/
│   ├── MainDashboard.tsx      # Vue tableau de bord
│   ├── NewKanbanBoard.tsx     # Kanban avec DnD
│   ├── TaskCard.tsx           # Carte de tâche
│   ├── TaskModal.tsx          # Modal détail/édition
│   ├── AddTaskModal.tsx       # Modal création
│   ├── Sidebar.tsx            # Navigation gauche
│   ├── EnhancedRightPanel.tsx # Panneau contextuel droit
│   ├── SearchBar.tsx          # Barre de recherche + filtres
│   ├── MobileColumnTabs.tsx   # Onglets colonnes mobile
│   └── Toast.tsx              # Notifications toast
├── lib/
│   ├── store.ts        # Store Zustand
│   ├── types.ts        # Types TypeScript
│   └── initialData.ts  # Données de démonstration
└── public/
    └── (assets)
```

---

## Guide de Personnalisation

### Modifier les Colonnes

Dans `components/NewKanbanBoard.tsx` :

```typescript
const columns = [
  { id: 'ideas', title: '💡 Idées/Plans', status: 'ideas' as TaskStatus },
  // Ajouter/modifier les colonnes ici
];
```

### Modifier les Priorités

Dans `lib/types.ts` :

```typescript
export type Priority = 'low' | 'medium' | 'high';
// Ajouter 'critical' par exemple
```

### Personnaliser les Couleurs

Dans `app/globals.css` :

```css
:root {
  --background: #0a0e1a;  /* Fond principal */
  --foreground: #f8fafc;  /* Texte principal */
  --accent: #f97316;      /* Couleur d'accent (orange) */
}
```

### Ajouter des Assignees

Dans `components/AddTaskModal.tsx` :

```typescript
const availableAssignees = [
  'Sarah Chen',
  'Marcus Rodriguez',
  // Ajouter ici
];
```

---

## Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Échap` | Fermer le modal ouvert |
| `Entrée` | Ajouter une sous-tâche (dans le champ) |

---

## Dépannage

### Les tâches ne se sauvegardent pas

1. Vérifiez que LocalStorage est activé dans votre navigateur
2. Ouvrez la console (F12) et cherchez les erreurs
3. Essayez de vider le cache : `localStorage.clear()`

### Le drag & drop ne fonctionne pas

1. Assurez-vous d'utiliser un navigateur moderne (Chrome, Firefox, Safari, Edge)
2. Vérifiez que JavaScript est activé
3. Essayez de désactiver les extensions de navigateur

### Le modal ne s'ouvre pas

1. Vérifiez les erreurs dans la console
2. Assurez-vous que l'ID de la tâche existe
3. Rafraîchissez la page

### Problèmes d'affichage mobile

1. Utilisez le mode responsive des DevTools (F12)
2. Testez avec une largeur de 375px minimum
3. Vérifiez que le viewport meta est présent

### Port 3000 déjà utilisé

```bash
# Trouver le processus utilisant le port
lsof -i :3000

# Ou utiliser un autre port
npm run dev -- -p 3001
```

---

## Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification ESLint
```

---

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## Licence

Ce projet est sous licence MIT.

---

## Contact

Pour toute question ou suggestion, ouvrez une issue sur le repository.
