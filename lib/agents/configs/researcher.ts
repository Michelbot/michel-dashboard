import { AgentDefinition } from '../types';

export const researcherAgent: AgentDefinition = {
  id: 'researcher',
  name: 'Researcher Agent',
  role: "Knowledge Navigator - Recherche d'information, analyse de documentation",
  icon: 'Search',
  color: 'violet',
  defaultTimeout: 480, // 8 minutes
  systemPromptPath: 'prompts/agents/researcher.md',
  skills: [
    {
      id: 'web-search',
      name: 'Web Search',
      description: 'Recherche web et documentation en ligne',
      category: 'web',
      enabled: true,
    },
    {
      id: 'doc-analysis',
      name: 'Documentation Analysis',
      description: 'Analyse approfondie de documentation technique',
      category: 'file',
      enabled: true,
    },
    {
      id: 'codebase-exploration',
      name: 'Codebase Exploration',
      description: 'Navigation et exploration de codebases',
      category: 'file',
      enabled: true,
    },
    {
      id: 'api-investigation',
      name: 'API Investigation',
      description: "Recherche d'APIs, schémas et endpoints",
      category: 'api',
      enabled: true,
    },
    {
      id: 'pattern-discovery',
      name: 'Pattern Discovery',
      description: 'Découverte et analyse de patterns',
      category: 'file',
      enabled: true,
    },
    {
      id: 'report-generation',
      name: 'Report Generation',
      description: 'Génération de rapports de recherche',
      category: 'file',
      enabled: true,
    },
  ],
  workflow: [
    {
      step: 1,
      name: 'CLARIFY',
      description: "Comprendre l'objectif de recherche",
      required: true,
    },
    {
      step: 2,
      name: 'SEARCH',
      description: 'Utiliser WebSearch/WebFetch pour collecter',
      required: true,
    },
    {
      step: 3,
      name: 'EXPLORE',
      description: 'Naviguer codebases et APIs',
      required: true,
    },
    {
      step: 4,
      name: 'SYNTHESIZE',
      description: 'Combiner et analyser les découvertes',
      required: true,
    },
    {
      step: 5,
      name: 'DOCUMENT',
      description: 'Créer rapport structuré',
      required: true,
    },
    {
      step: 6,
      name: 'RECOMMEND',
      description: 'Fournir recommandations actionnables',
      required: true,
    },
  ],
};
