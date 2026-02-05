import { AgentDefinition } from '../types';

export const qaAgent: AgentDefinition = {
  id: 'qa',
  name: 'QA Agent',
  role: 'Quality Assurance - Tests, validation, détection de régression',
  icon: 'Shield',
  color: 'red',
  defaultTimeout: 600, // 10 minutes
  systemPromptPath: 'prompts/agents/qa.md',
  skills: [
    {
      id: 'regression-testing',
      name: 'Regression Testing',
      description: 'Vérification non-régression systématique',
      category: 'browser',
      enabled: true,
    },
    {
      id: 'edge-case-discovery',
      name: 'Edge Case Discovery',
      description: 'Tests de cas limites et corner cases',
      category: 'browser',
      enabled: true,
    },
    {
      id: 'accessibility-audit',
      name: 'Accessibility Audit',
      description: "Audit d'accessibilité WCAG",
      category: 'browser',
      enabled: true,
    },
    {
      id: 'performance-testing',
      name: 'Performance Testing',
      description: 'Tests de performance et charge',
      category: 'browser',
      enabled: true,
    },
    {
      id: 'cross-browser-testing',
      name: 'Cross-Browser Testing',
      description: 'Tests multi-environnement',
      category: 'browser',
      enabled: true,
    },
    {
      id: 'test-report-generation',
      name: 'Test Report Generation',
      description: 'Rapports de test détaillés avec screenshots',
      category: 'file',
      enabled: true,
    },
  ],
  workflow: [
    {
      step: 1,
      name: 'SCOPE',
      description: 'Définir périmètre de test',
      required: true,
    },
    {
      step: 2,
      name: 'PLAN',
      description: 'Créer cas de test (happy path + edge cases)',
      required: true,
    },
    {
      step: 3,
      name: 'EXECUTE',
      description: "Exécuter tests avec capture d'évidence",
      required: true,
    },
    {
      step: 4,
      name: 'ANALYZE',
      description: 'Identifier échecs par sévérité',
      required: true,
    },
    {
      step: 5,
      name: 'REPORT',
      description: 'Créer rapport avec screenshots',
      required: true,
    },
    {
      step: 6,
      name: 'VERIFY',
      description: 'Confirmer corrections sans régression',
      required: false,
    },
  ],
};
