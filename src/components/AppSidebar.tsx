import React, { useState } from 'react';
import {
  Home,
  Settings,
  FolderGit2,
  Boxes,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  hasChildren?: boolean;
  isExpanded?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  hasChildren,
  isExpanded
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-dark-surface text-brand-blue'
          : 'text-dark-muted hover:bg-dark-surface hover:text-dark-text'
      }`}
      aria-expanded={hasChildren ? isExpanded : undefined}
    >
      <div className="flex items-center space-x-3">
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {hasChildren && (
        <span className="text-dark-muted">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      )}
    </button>
  );
};

export interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen = true, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('projects');

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-dark-bg border-r border-dark-border flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        aria-label="Main Navigation"
      >
        <div className="p-4 flex items-center justify-between border-b border-dark-border">
          <div className="flex items-center space-x-2 text-dark-text">
            <div className="w-8 h-8 rounded bg-brand-blue/20 flex items-center justify-center text-brand-blue">
              <Boxes size={20} />
            </div>
            <span className="font-bold text-lg">Orchids</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-dark-muted hover:text-dark-text"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          <SidebarItem icon={Home} label="Dashboard" isActive={true} />

          <div className="pt-4 pb-1">
            <SidebarItem
              icon={FolderGit2}
              label="Projects"
              hasChildren
              isExpanded={expandedSection === 'projects'}
              onClick={() => toggleSection('projects')}
            />

            {expandedSection === 'projects' && (
              <div className="mt-1 space-y-1 pl-9 pr-2">
                <button className="w-full text-left px-3 py-1.5 text-sm text-dark-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-colors">
                  Web Application
                </button>
                <button className="w-full text-left px-3 py-1.5 text-sm text-dark-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-colors">
                  Mobile API
                </button>
              </div>
            )}
          </div>

          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-dark-text">
              <span className="text-sm font-medium">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-text truncate">User Profile</p>
              <p className="text-xs text-dark-muted truncate">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
