'use client';

import { useState } from 'react';
import {
  Code2,
  Search,
  FileText,
  Server,
  Shield,
  ChevronDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { getAllAgentSummaries, getRecommendedAgent, AgentId } from '@/lib/agents';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Code2,
  Search,
  FileText,
  Server,
  Shield,
};

// Color mapping for Tailwind classes
const colorClasses: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/30',
    ring: 'ring-blue-500/50',
  },
  violet: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-500',
    border: 'border-violet-500/30',
    ring: 'ring-violet-500/50',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500/30',
    ring: 'ring-green-500/50',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    border: 'border-orange-500/30',
    ring: 'ring-orange-500/50',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/30',
    ring: 'ring-red-500/50',
  },
};

interface AgentSelectorProps {
  value: string;
  onChange: (agentId: string) => void;
  taskTitle?: string;
  taskDescription?: string;
  taskTags?: string[];
  className?: string;
}

export function AgentSelector({
  value,
  onChange,
  taskTitle,
  taskDescription,
  taskTags,
  className = '',
}: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const agents = getAllAgentSummaries();

  // Get recommended agent based on task content
  const recommendation = getRecommendedAgent({
    title: taskTitle,
    description: taskDescription,
    tags: taskTags,
  });

  const selectedAgent = agents.find((a) => a.id === value) || agents[0];
  const colors = colorClasses[selectedAgent.color] || colorClasses.blue;
  const IconComponent = iconMap[selectedAgent.icon] || Code2;

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-zinc-400 mb-2">
        Agent d&apos;exécution
      </label>

      {/* Selected agent button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border ${colors.border} ${colors.bg} hover:ring-2 ${colors.ring} transition-all`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <IconComponent className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div className="text-left">
            <div className="font-medium text-zinc-200">{selectedAgent.name}</div>
            <div className="text-xs text-zinc-500">{selectedAgent.role.split(' - ')[1]}</div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Options */}
          <div className="absolute z-20 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
            {/* Recommendation banner */}
            {recommendation && recommendation.agent.id !== value && (
              <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-400">
                  Recommandé: <strong>{recommendation.agent.name}</strong>
                </span>
              </div>
            )}

            <div className="max-h-80 overflow-y-auto">
              {agents.map((agent) => {
                const agentColors = colorClasses[agent.color] || colorClasses.blue;
                const AgentIcon = iconMap[agent.icon] || Code2;
                const isSelected = agent.id === value;
                const isRecommended = agent.id === recommendation?.agent.id;

                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => {
                      onChange(agent.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 hover:bg-zinc-800 transition-colors ${
                      isSelected ? 'bg-zinc-800' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${agentColors.bg}`}>
                        <AgentIcon className={`w-5 h-5 ${agentColors.text}`} />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-200">{agent.name}</span>
                          {isRecommended && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">
                              Recommandé
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {agent.role.split(' - ')[1]}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-zinc-600">
                            {agent.skillCount} skills
                          </span>
                          <span className="text-zinc-700">•</span>
                          <span className="text-[10px] text-zinc-600">
                            {agent.workflowSteps} étapes
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Compact version for task cards
export function AgentBadge({ agentId }: { agentId: AgentId | string }) {
  const agents = getAllAgentSummaries();
  const agent = agents.find((a) => a.id === agentId);

  if (!agent) return null;

  const colors = colorClasses[agent.color] || colorClasses.blue;
  const IconComponent = iconMap[agent.icon] || Code2;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      <IconComponent className="w-3 h-3" />
      <span>{agent.name.replace(' Agent', '')}</span>
    </div>
  );
}

// Grid selector for task creation modal
export function AgentGrid({
  value,
  onChange,
  taskTitle,
  taskDescription,
  taskTags,
}: Omit<AgentSelectorProps, 'className'>) {
  const agents = getAllAgentSummaries();

  const recommendation = getRecommendedAgent({
    title: taskTitle,
    description: taskDescription,
    tags: taskTags,
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-400">
        Agent d&apos;exécution
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {agents.map((agent) => {
          const agentColors = colorClasses[agent.color] || colorClasses.blue;
          const AgentIcon = iconMap[agent.icon] || Code2;
          const isSelected = agent.id === value;
          const isRecommended = agent.id === recommendation?.agent.id;

          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => onChange(agent.id)}
              className={`relative p-3 rounded-lg border transition-all ${
                isSelected
                  ? `${agentColors.border} ${agentColors.bg} ring-2 ${agentColors.ring}`
                  : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              )}
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-lg ${agentColors.bg}`}>
                  <AgentIcon className={`w-5 h-5 ${agentColors.text}`} />
                </div>
                <span className="text-xs font-medium text-zinc-300">
                  {agent.name.replace(' Agent', '')}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {recommendation && (
        <p className="text-xs text-zinc-500 mt-2">
          {recommendation.reason}
        </p>
      )}
    </div>
  );
}

export default AgentSelector;
