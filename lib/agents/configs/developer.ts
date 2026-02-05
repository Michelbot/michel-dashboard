import { AgentDefinition } from '../types';

export const developerAgent: AgentDefinition = {
  id: 'developer',
  name: 'Developer Agent',
  role: 'Code Architect - Implémentation de code, debugging, tests browser',
  icon: 'Code2',
  color: 'blue',
  defaultTimeout: 600, // 10 minutes
  systemPromptPath: 'prompts/agents/developer.md',
  skills: [
    {
      id: 'code-generation',
      name: 'Code Generation',
      description: 'Génération de code production-ready avec tests',
      category: 'file',
      enabled: true,
    },
    {
      id: 'browser-testing',
      name: 'Browser Testing',
      description: 'Tests E2E via Playwright/browser automation',
      category: 'browser',
      enabled: true,
    },
    {
      id: 'screenshot-capture',
      name: 'Screenshot Capture',
      description: "Capture d'évidence visuelle pour validation",
      category: 'browser',
      enabled: true,
    },
    {
      id: 'file-operations',
      name: 'File Operations',
      description: 'Lecture/écriture/modification de fichiers',
      category: 'file',
      enabled: true,
    },
    {
      id: 'dependency-analysis',
      name: 'Dependency Analysis',
      description: 'Analyse des dépendances et impacts',
      category: 'shell',
      enabled: true,
    },
    {
      id: 'bug-diagnosis',
      name: 'Bug Diagnosis',
      description: 'Diagnostic et correction de bugs',
      category: 'file',
      enabled: true,
    },
  ],
  workflow: [
    {
      step: 1,
      name: 'ANALYZE',
      description: 'Lire requirements et patterns existants',
      required: true,
    },
    {
      step: 2,
      name: 'PLAN',
      description: 'Identifier fichiers à modifier et stratégie',
      required: true,
    },
    {
      step: 3,
      name: 'IMPLEMENT',
      description: 'Écrire le code avec Write/Edit tools',
      required: true,
    },
    {
      step: 4,
      name: 'TEST',
      description: 'Tester via Playwright ou validation manuelle',
      required: true,
    },
    {
      step: 5,
      name: 'CAPTURE',
      description: "Screenshots comme évidence de fonctionnement",
      required: false,
    },
    {
      step: 6,
      name: 'REPORT',
      description: 'Rapport structuré des changements',
      required: true,
    },
  ],
};
