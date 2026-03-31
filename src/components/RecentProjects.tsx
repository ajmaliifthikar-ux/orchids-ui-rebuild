import React from 'react';
import {
  FolderGit2,
  MoreHorizontal,
  Clock,
  Play,
  CheckCircle2,
  CircleDashed,
  ExternalLink
} from 'lucide-react';

export type ProjectStatus = 'active' | 'completed' | 'paused' | 'failed';

export interface Project {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  status: ProjectStatus;
  url?: string;
}

export interface RecentProjectsProps {
  projects?: Project[];
  onProjectClick?: (project: Project) => void;
  onViewAll?: () => void;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce API',
    description: 'Node.js backend service for product catalog and orders.',
    updatedAt: '2 hours ago',
    status: 'active',
    url: 'https://api.example.com'
  },
  {
    id: '2',
    name: 'Analytics Dashboard',
    description: 'React admin panel for monitoring key business metrics.',
    updatedAt: '1 day ago',
    status: 'completed',
    url: 'https://dashboard.example.com'
  },
  {
    id: '3',
    name: 'Payment Gateway Integration',
    description: 'Stripe webhooks and payment processing service.',
    updatedAt: '3 days ago',
    status: 'paused'
  },
  {
    id: '4',
    name: 'User Authentication Microservice',
    description: 'OAuth2 and JWT based auth service with role management.',
    updatedAt: '1 week ago',
    status: 'active'
  }
];

const StatusIcon = ({ status }: { status: ProjectStatus }) => {
  switch (status) {
    case 'active':
      return <Play size={14} className="text-brand-green mr-1.5" aria-hidden="true" />;
    case 'completed':
      return <CheckCircle2 size={14} className="text-brand-blue mr-1.5" aria-hidden="true" />;
    case 'paused':
      return <CircleDashed size={14} className="text-brand-yellow mr-1.5" aria-hidden="true" />;
    case 'failed':
      return <CircleDashed size={14} className="text-brand-red mr-1.5" aria-hidden="true" />;
    default:
      return null;
  }
};

export const RecentProjects: React.FC<RecentProjectsProps> = ({
  projects = mockProjects,
  onProjectClick,
  onViewAll
}) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 text-dark-text">
          <FolderGit2 className="text-brand-blue" size={24} aria-hidden="true" />
          <h2 className="text-xl font-semibold tracking-tight">Recent Projects</h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-brand-blue hover:text-blue-400 transition-colors flex items-center group"
          >
            View All
            <ExternalLink size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onProjectClick?.(project)}
            className="group relative bg-dark-surface border border-dark-border rounded-xl p-5 hover:border-brand-blue/50 hover:shadow-md hover:shadow-brand-blue/5 transition-all cursor-pointer focus-within:ring-2 focus-within:ring-brand-blue focus-within:ring-offset-2 focus-within:ring-offset-dark-bg"
            role="article"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onProjectClick?.(project);
              }
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center shrink-0 group-hover:bg-brand-blue/10 group-hover:border-brand-blue/30 transition-colors">
                  <FolderGit2 size={20} className="text-brand-blue" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-dark-text truncate pr-2 group-hover:text-brand-blue transition-colors">
                    {project.name}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-dark-muted hover:text-dark-text truncate block mt-0.5 max-w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {new URL(project.url).hostname}
                    </a>
                  )}
                </div>
              </div>
              <button
                className="text-dark-muted hover:text-dark-text p-1.5 rounded-md hover:bg-dark-bg transition-colors shrink-0"
                aria-label="Project actions"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Open context menu
                }}
              >
                <MoreHorizontal size={18} aria-hidden="true" />
              </button>
            </div>

            <p className="text-sm text-dark-muted mb-6 line-clamp-2 leading-relaxed min-h-[40px]">
              {project.description}
            </p>

            <div className="flex items-center justify-between text-xs pt-4 border-t border-dark-border/50">
              <div className="flex items-center text-dark-text font-medium capitalize">
                <StatusIcon status={project.status} />
                {project.status}
              </div>
              <div className="flex items-center text-dark-muted">
                <Clock size={12} className="mr-1.5" aria-hidden="true" />
                {project.updatedAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
