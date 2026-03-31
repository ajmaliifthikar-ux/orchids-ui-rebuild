import React from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ElementType;
}

export interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`border-b border-dark-border mb-6 ${className}`}>
      <nav className="flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${isActive
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-dark-muted hover:text-dark-text hover:border-dark-muted'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {Icon && (
                <Icon
                  className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${isActive ? 'text-brand-blue' : 'text-dark-muted group-hover:text-dark-text'}
                  `}
                  aria-hidden="true"
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
