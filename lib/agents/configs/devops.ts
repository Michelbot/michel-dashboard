import { AgentDefinition } from '../types';

export const devopsAgent: AgentDefinition = {
  id: 'devops',
  name: 'DevOps Agent',
  role: 'Infrastructure Engineer - CI/CD, déploiement, configuration',
  icon: 'Server',
  color: 'orange',
  defaultTimeout: 540, // 9 minutes
  systemPromptPath: 'prompts/agents/devops.md',
  skills: [
    {
      id: 'docker-management',
      name: 'Docker Management',
      description: 'Dockerfiles, compose et containerisation',
      category: 'shell',
      enabled: true,
    },
    {
      id: 'ci-cd-pipelines',
      name: 'CI/CD Pipelines',
      description: 'GitHub Actions, workflows automatisés',
      category: 'file',
      enabled: true,
    },
    {
      id: 'environment-config',
      name: 'Environment Config',
      description: "Variables d'environnement et secrets",
      category: 'file',
      enabled: true,
    },
    {
      id: 'dependency-security',
      name: 'Dependency Security',
      description: 'Audit de sécurité des dépendances',
      category: 'shell',
      enabled: true,
    },
    {
      id: 'performance-monitoring',
      name: 'Performance Monitoring',
      description: 'Configuration monitoring et alerting',
      category: 'api',
      enabled: true,
    },
    {
      id: 'infrastructure-scripting',
      name: 'Infrastructure Scripting',
      description: 'Scripts de déploiement et automation',
      category: 'shell',
      enabled: true,
    },
  ],
  workflow: [
    {
      step: 1,
      name: 'ASSESS',
      description: "Évaluer état actuel de l'infrastructure",
      required: true,
    },
    {
      step: 2,
      name: 'PLAN',
      description: 'Designer changements avec risque minimal',
      required: true,
    },
    {
      step: 3,
      name: 'CONFIGURE',
      description: 'Mettre à jour configs et scripts',
      required: true,
    },
    {
      step: 4,
      name: 'VALIDATE',
      description: 'Tester configurations localement',
      required: true,
    },
    {
      step: 5,
      name: 'DOCUMENT',
      description: 'Documenter changements et procédures',
      required: true,
    },
    {
      step: 6,
      name: 'DEPLOY',
      description: 'Exécuter avec plan de rollback',
      required: true,
    },
  ],
};
