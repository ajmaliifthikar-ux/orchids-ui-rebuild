import React from 'react';
import { Settings, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export interface OverviewConfig {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastUpdated: string;
  details: string;
}

export interface OverviewPanelProps {
  configs?: OverviewConfig[];
  onRefresh?: () => void;
  onManage?: (id: string) => void;
}

const defaultConfigs: OverviewConfig[] = [
  {
    id: 'api-keys',
    name: 'API Keys',
    status: 'active',
    lastUpdated: '10 mins ago',
    details: '3 active keys'
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    status: 'inactive',
    lastUpdated: '2 days ago',
    details: '0 active endpoints'
  },
  {
    id: 'billing',
    name: 'Billing',
    status: 'active',
    lastUpdated: '1 month ago',
    details: 'Pro Plan'
  },
  {
    id: 'integrations',
    name: 'Integrations',
    status: 'error',
    lastUpdated: '1 hour ago',
    details: 'GitHub sync failed'
  }
];

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  configs = defaultConfigs,
  onRefresh,
  onManage
}) => {
  const getStatusIcon = (status: OverviewConfig['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 size={16} className="text-brand-green" aria-hidden="true" />;
      case 'error':
        return <AlertCircle size={16} className="text-brand-red" aria-hidden="true" />;
      case 'inactive':
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-dark-muted/50" aria-hidden="true" />;
    }
  };

  const getStatusBadge = (status: OverviewConfig['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 text-xs font-medium bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-md">Active</span>;
      case 'error':
        return <span className="px-2 py-0.5 text-xs font-medium bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-md">Error</span>;
      case 'inactive':
      default:
        return <span className="px-2 py-0.5 text-xs font-medium bg-dark-bg text-dark-muted border border-dark-border rounded-md">Inactive</span>;
    }
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-dark-bg border border-dark-border rounded-lg">
            <Settings className="text-dark-text" size={24} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark-text tracking-tight">Configuration Overview</h2>
            <p className="text-sm text-dark-muted">Manage your workspace settings and integrations.</p>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-dark-muted hover:text-dark-text bg-dark-bg border border-dark-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <RefreshCw size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configs.map((config) => (
          <div
            key={config.id}
            className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-brand-blue/50 transition-colors group"
          >
            <div className="flex items-start space-x-4">
              <div className="mt-0.5">
                {getStatusIcon(config.status)}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-semibold text-dark-text">{config.name}</h3>
                  {getStatusBadge(config.status)}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center text-xs text-dark-muted space-y-1 sm:space-y-0 sm:space-x-2">
                  <span>{config.details}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Updated {config.lastUpdated}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onManage?.(config.id)}
              className="text-sm font-medium text-brand-blue hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none px-3 py-1.5 rounded-md hover:bg-brand-blue/10"
              aria-label={`Manage ${config.name}`}
            >
              Manage
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
