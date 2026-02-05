import { AgentDefinition } from '../types';

export const contentAgent: AgentDefinition = {
  id: 'content',
  name: 'Content Agent',
  role: 'Documentation Writer - Documentation, README, guides utilisateur',
  icon: 'FileText',
  color: 'green',
  defaultTimeout: 420, // 7 minutes
  systemPromptPath: 'prompts/agents/content.md',
  skills: [
    {
      id: 'readme-generation',
      name: 'README Generation',
      description: 'Création de README complets et professionnels',
      category: 'file',
      enabled: true,
    },
    {
      id: 'api-documentation',
      name: 'API Documentation',
      description: "Documentation d'API avec exemples",
      category: 'file',
      enabled: true,
    },
    {
      id: 'code-commenting',
      name: 'Code Commenting',
      description: 'Commentaires inline et JSDoc/TSDoc',
      category: 'file',
      enabled: true,
    },
    {
      id: 'tutorial-creation',
      name: 'Tutorial Creation',
      description: 'Guides et tutoriels utilisateur',
      category: 'file',
      enabled: true,
    },
    {
      id: 'changelog-management',
      name: 'Changelog Management',
      description: 'Gestion de CHANGELOG et release notes',
      category: 'file',
      enabled: true,
    },
    {
      id: 'style-consistency',
      name: 'Style Consistency',
      description: 'Cohérence de style et formatting',
      category: 'file',
      enabled: true,
    },
  ],
  workflow: [
    {
      step: 1,
      name: 'AUDIT',
      description: "Évaluer l'état actuel de la documentation",
      required: true,
    },
    {
      step: 2,
      name: 'GATHER',
      description: 'Collecter infos du code et specs',
      required: true,
    },
    {
      step: 3,
      name: 'STRUCTURE',
      description: 'Organiser avec hiérarchie claire',
      required: true,
    },
    {
      step: 4,
      name: 'WRITE',
      description: 'Créer/mettre à jour documentation',
      required: true,
    },
    {
      step: 5,
      name: 'REVIEW',
      description: 'Vérifier exactitude et complétude',
      required: true,
    },
    {
      step: 6,
      name: 'FORMAT',
      description: 'Appliquer style markdown cohérent',
      required: true,
    },
  ],
};
