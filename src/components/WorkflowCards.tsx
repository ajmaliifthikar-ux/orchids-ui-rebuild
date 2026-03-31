import React from 'react';
import { PlayCircle, PauseCircle, Clock, CheckCircle2, AlertCircle, RefreshCw, GitBranch, Terminal } from 'lucide-react';

export type WorkflowStatus = 'running' | 'paused' | 'success' | 'failed' | 'pending';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  lastRun: string;
  trigger: string;
  duration?: string;
  icon?: React.ElementType;
}

export interface WorkflowCardsProps {
  workflows?: Workflow[];
  onToggleStatus?: (id: string, newStatus: WorkflowStatus) => void;
  onRunNow?: (id: string) => void;
  title?: string;
}

const defaultWorkflows: Workflow[] = [
  {
    id: 'wf-deploy-prod',
    name: 'Production Deployment',
    description: 'Builds, tests, and deploys main branch to production environment.',
    status: 'success',
    lastRun: '10 mins ago',
    trigger: 'Push to main',
    duration: '4m 12s',
    icon: GitBranch
  },
  {
    id: 'wf-nightly-backup',
    name: 'Database Backup',
    description: 'Automated nightly dump of PostgreSQL databases to S3 cold storage.',
    status: 'paused',
    lastRun: '1 day ago',
    trigger: 'Schedule (0 2 * * *)',
    icon: RefreshCw
  },
  {
    id: 'wf-e2e-tests',
    name: 'End-to-End Tests',
    description: 'Runs Playwright test suite against staging environment.',
    status: 'running',
    lastRun: 'Running now',
    trigger: 'Manual',
    icon: Terminal
  },
  {
    id: 'wf-sync-users',
    name: 'CRM Sync',
    description: 'Synchronizes new user registrations with Salesforce and HubSpot.',
    status: 'failed',
    lastRun: '2 hours ago',
    trigger: 'Webhook',
    duration: '45s',
    icon: RefreshCw
  }
];

export const WorkflowCards: React.FC<WorkflowCardsProps> = ({
  workflows = defaultWorkflows,
  onToggleStatus,
  onRunNow,
  title = "Automated Workflows"
}) => {
  const getStatusIcon = (status: WorkflowStatus) => {
    switch (status) {
      case 'running': return <RefreshCw size={14} className="animate-spin text-brand-blue" aria-hidden="true" />;
      case 'success': return <CheckCircle2 size={14} className="text-brand-green" aria-hidden="true" />;
      case 'failed': return <AlertCircle size={14} className="text-brand-red" aria-hidden="true" />;
      case 'paused': return <PauseCircle size={14} className="text-brand-yellow" aria-hidden="true" />;
      case 'pending': return <Clock size={14} className="text-dark-muted" aria-hidden="true" />;
    }
  };

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case 'running': return 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-sm shadow-brand-blue/10';
      case 'success': return 'border-dark-border bg-dark-surface hover:border-brand-green/50 hover:shadow-sm hover:shadow-brand-green/5';
      case 'failed': return 'border-brand-red/50 bg-brand-red/5 text-brand-red';
      case 'paused': return 'border-dark-border bg-dark-bg/50 opacity-75';
      case 'pending': return 'border-dark-border bg-dark-surface';
    }
  };

  const getStatusText = (status: WorkflowStatus) => {
    switch (status) {
      case 'running': return 'Running';
      case 'success': return 'Succeeded';
      case 'failed': return 'Failed';
      case 'paused': return 'Paused';
      case 'pending': return 'Pending';
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-dark-text tracking-tight flex items-center gap-2">
          {title}
        </h2>
        <button className="text-sm font-medium text-brand-blue hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-md px-2 py-1">
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {workflows.map((workflow) => {
          const Icon = workflow.icon || PlayCircle;
          const isRunning = workflow.status === 'running';
          const isPaused = workflow.status === 'paused';

          return (
            <div
              key={workflow.id}
              className={`flex flex-col rounded-xl border p-5 transition-all duration-300 ${getStatusColor(workflow.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg border flex items-center justify-center shrink-0 ${
                  isRunning ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' :
                  isPaused ? 'bg-dark-bg border-dark-border text-dark-muted' :
                  'bg-dark-bg border-dark-border text-dark-text'
                }`}>
                  <Icon size={20} aria-hidden="true" />
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold border bg-dark-surface ${
                    workflow.status === 'running' ? 'border-brand-blue/30 text-brand-blue' :
                    workflow.status === 'success' ? 'border-brand-green/30 text-brand-green' :
                    workflow.status === 'failed' ? 'border-brand-red/30 text-brand-red' :
                    workflow.status === 'paused' ? 'border-brand-yellow/30 text-brand-yellow' :
                    'border-dark-border text-dark-muted'
                  }`}>
                    {getStatusIcon(workflow.status)}
                    <span className="ml-1.5">{getStatusText(workflow.status)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-base font-bold text-dark-text mb-1 truncate" title={workflow.name}>
                  {workflow.name}
                </h3>
                <p className="text-sm text-dark-muted line-clamp-2 leading-relaxed min-h-[40px]">
                  {workflow.description}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-dark-border/50">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                     <span className="block text-xs text-dark-muted uppercase tracking-wider mb-1">Trigger</span>
                     <span className="text-sm font-medium text-dark-text truncate block" title={workflow.trigger}>{workflow.trigger}</span>
                  </div>
                  <div>
                     <span className="block text-xs text-dark-muted uppercase tracking-wider mb-1">Last Run</span>
                     <span className="text-sm font-medium text-dark-text truncate block flex items-center gap-1" title={workflow.lastRun}>
                       {workflow.duration && <span className="text-dark-muted font-normal mr-1">({workflow.duration})</span>}
                       {workflow.lastRun}
                     </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRunNow?.(workflow.id)}
                    disabled={isRunning}
                    className="flex-1 inline-flex justify-center items-center py-2 px-3 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-dark-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlayCircle size={16} className="mr-2" aria-hidden="true" />
                    {isRunning ? 'Running...' : 'Run Now'}
                  </button>

                  <button
                    onClick={() => onToggleStatus?.(workflow.id, isPaused ? 'running' : 'paused')}
                    className="p-2 border border-dark-border rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-dark-surface transition-colors"
                    title={isPaused ? 'Resume workflow' : 'Pause workflow'}
                    aria-label={isPaused ? 'Resume workflow' : 'Pause workflow'}
                  >
                    {isPaused ? <PlayCircle size={18} aria-hidden="true" /> : <PauseCircle size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
