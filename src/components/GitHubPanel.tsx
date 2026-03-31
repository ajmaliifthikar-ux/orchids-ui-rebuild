import React from 'react';
import { Github, Link2, GitPullRequest, GitCommit, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export interface GitHubPanelProps {
  isConnected?: boolean;
  username?: string;
  repoCount?: number;
  lastSync?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
}

export const GitHubPanel: React.FC<GitHubPanelProps> = ({
  isConnected = false,
  username = 'developer-orchids',
  repoCount = 42,
  lastSync = 'Just now',
  onConnect,
  onDisconnect,
  onSync
}) => {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-dark-bg border border-dark-border rounded-lg">
            <Github className="text-dark-text" size={24} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark-text tracking-tight">GitHub Integration</h2>
            <p className="text-sm text-dark-muted">Connect your repositories to automate workflows.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected ? (
             <span className="flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20">
              <CheckCircle2 size={14} className="mr-1.5" aria-hidden="true" />
              Connected
            </span>
          ) : (
            <span className="flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-dark-bg text-dark-muted border border-dark-border">
              <XCircle size={14} className="mr-1.5" aria-hidden="true" />
              Disconnected
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-dark-bg/50 border border-dark-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-semibold text-dark-text uppercase tracking-wider">Connection Status</h3>
             {isConnected && (
               <button
                 onClick={onSync}
                 className="text-dark-muted hover:text-brand-blue transition-colors p-1 rounded-md hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-brand-blue"
                 aria-label="Sync GitHub data"
                 title="Sync now"
               >
                 <RefreshCw size={16} aria-hidden="true" />
               </button>
             )}
          </div>

          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-muted">Account</span>
                <span className="font-medium text-dark-text flex items-center">
                  <Github size={14} className="mr-2 text-dark-muted" aria-hidden="true" />
                  @{username}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-muted">Repositories</span>
                <span className="font-medium text-dark-text">{repoCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-muted">Last Synced</span>
                <span className="font-medium text-dark-text">{lastSync}</span>
              </div>

              <div className="pt-4 border-t border-dark-border">
                <button
                  onClick={onDisconnect}
                  className="w-full py-2 px-4 text-sm font-medium text-brand-red bg-brand-red/10 hover:bg-brand-red/20 border border-brand-red/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-dark-surface"
                >
                  Disconnect Account
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Github size={48} className="mx-auto text-dark-muted/50 mb-4" aria-hidden="true" />
              <p className="text-sm text-dark-muted mb-6 max-w-xs mx-auto">
                Link your GitHub account to access your repositories, manage pull requests, and deploy automatically.
              </p>
              <button
                onClick={onConnect}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#24292e] hover:bg-[#2f363d] rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#24292e] focus:ring-offset-2 focus:ring-offset-dark-surface"
              >
                <Link2 size={16} className="mr-2" aria-hidden="true" />
                Connect GitHub
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-dark-text uppercase tracking-wider mb-2">Recent Activity</h3>

          {isConnected ? (
            <ul className="space-y-3">
               {[
                 { id: 1, type: 'pr', text: 'Merged PR #42 in orchids-ui', time: '2 hours ago', icon: GitPullRequest, color: 'text-brand-blue' },
                 { id: 2, type: 'commit', text: 'Pushed to main in api-service', time: '5 hours ago', icon: GitCommit, color: 'text-brand-green' },
                 { id: 3, type: 'commit', text: 'Initial commit in new-project', time: '1 day ago', icon: GitCommit, color: 'text-dark-muted' }
               ].map((item) => (
                 <li key={item.id} className="flex items-start space-x-3 p-3 bg-dark-bg border border-dark-border rounded-lg hover:border-dark-muted transition-colors cursor-pointer group">
                   <item.icon size={16} className={`mt-0.5 shrink-0 ${item.color}`} aria-hidden="true" />
                   <div>
                     <p className="text-sm font-medium text-dark-text group-hover:text-brand-blue transition-colors line-clamp-1">{item.text}</p>
                     <p className="text-xs text-dark-muted mt-1">{item.time}</p>
                   </div>
                 </li>
               ))}
            </ul>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 border border-dashed border-dark-border rounded-lg bg-dark-bg/20">
               <GitPullRequest size={32} className="text-dark-muted/30 mb-3" aria-hidden="true" />
               <p className="text-sm text-dark-muted text-center">Activity will appear here once connected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
