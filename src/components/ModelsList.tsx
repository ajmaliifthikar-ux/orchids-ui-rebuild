import React, { useState } from 'react';
import { Settings2, Cpu, Database, Network, ChevronDown, Check, Zap } from 'lucide-react';

export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  parameters: string;
  contextWindow: string;
  isActive: boolean;
  type: 'language' | 'vision' | 'embedding';
}

export interface ModelsListProps {
  models?: Model[];
  onToggleModel?: (modelId: string, isActive: boolean) => void;
  onConfigureModel?: (modelId: string) => void;
}

const defaultModels: Model[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Most capable model, optimized for complex reasoning.',
    parameters: 'Unknown',
    contextWindow: '128k',
    isActive: true,
    type: 'language'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Powerful model for highly complex tasks.',
    parameters: 'Unknown',
    contextWindow: '200k',
    isActive: false,
    type: 'language'
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    description: 'Open source instruction tuned model.',
    parameters: '70B',
    contextWindow: '8k',
    isActive: true,
    type: 'language'
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    description: 'High quality image generation from text.',
    parameters: 'Unknown',
    contextWindow: 'N/A',
    isActive: true,
    type: 'vision'
  }
];

export const ModelsList: React.FC<ModelsListProps> = ({
  models = defaultModels,
  onToggleModel,
  onConfigureModel
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getIcon = (type: Model['type']) => {
    switch (type) {
      case 'language': return <Cpu size={18} className="text-brand-blue" aria-hidden="true" />;
      case 'vision': return <Zap size={18} className="text-brand-gold" aria-hidden="true" />;
      case 'embedding': return <Network size={18} className="text-brand-green" aria-hidden="true" />;
      default: return <Database size={18} className="text-dark-muted" aria-hidden="true" />;
    }
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-dark-border flex items-center justify-between bg-dark-bg/50">
        <div className="flex items-center space-x-2">
          <Settings2 size={20} className="text-dark-muted" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-dark-text tracking-tight">Active Models</h3>
        </div>
        <span className="text-xs font-medium text-dark-muted uppercase tracking-wider bg-dark-surface px-2 py-1 rounded-md border border-dark-border">
          {models.filter(m => m.isActive).length} Enabled
        </span>
      </div>

      <ul className="divide-y divide-dark-border">
        {models.map(model => (
          <li key={model.id} className="group hover:bg-dark-bg/30 transition-colors">
            <div
              className="px-6 py-4 cursor-pointer focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-blue"
              onClick={() => toggleExpand(model.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleExpand(model.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={expandedId === model.id}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    model.isActive
                      ? 'bg-brand-blue/10 border-brand-blue/30'
                      : 'bg-dark-bg border-dark-border opacity-50'
                  }`}>
                    {getIcon(model.type)}
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-dark-text flex items-center space-x-2">
                      <span>{model.name}</span>
                      <span className="text-xs text-dark-muted font-normal">• {model.provider}</span>
                    </h4>
                    <p className="text-sm text-dark-muted mt-0.5 line-clamp-1">{model.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 ml-4 shrink-0">
                  <div className="hidden sm:flex items-center space-x-3 text-sm">
                    <div className="flex flex-col items-end">
                      <span className="text-dark-muted text-xs uppercase tracking-wider">Context</span>
                      <span className="text-dark-text font-medium">{model.contextWindow}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleModel?.(model.id, !model.isActive);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-dark-bg ${
                      model.isActive ? 'bg-brand-blue' : 'bg-dark-border'
                    }`}
                    role="switch"
                    aria-checked={model.isActive}
                    aria-label={`Toggle ${model.name}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        model.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {model.isActive && <Check size={12} className="text-brand-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                    </span>
                  </button>

                  <ChevronDown
                    size={20}
                    className={`text-dark-muted transition-transform duration-200 ${expandedId === model.id ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {expandedId === model.id && (
                <div
                  className="mt-4 pt-4 border-t border-dark-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-dark-bg rounded-lg p-3 border border-dark-border">
                    <span className="text-xs text-dark-muted uppercase tracking-wider block mb-1">Parameters</span>
                    <span className="text-sm font-medium text-dark-text">{model.parameters}</span>
                  </div>
                  <div className="bg-dark-bg rounded-lg p-3 border border-dark-border">
                    <span className="text-xs text-dark-muted uppercase tracking-wider block mb-1">Type</span>
                    <span className="text-sm font-medium text-dark-text capitalize">{model.type}</span>
                  </div>

                  <div className="sm:col-span-2 flex justify-end mt-2">
                    <button
                      onClick={() => onConfigureModel?.(model.id)}
                      className="text-sm text-brand-blue hover:text-blue-400 font-medium px-4 py-2 rounded-md hover:bg-brand-blue/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-dark-surface"
                    >
                      Advanced Configuration
                    </button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
