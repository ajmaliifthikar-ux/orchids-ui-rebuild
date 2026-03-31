import { useState } from 'react'
import {
  AppSidebar,
  HeroSection,
  InputBar,
  StatusBanner,
  RecentProjects,
  ModelsList,
  SubscriptionsPanel,
  GitHubPanel,
  SystemPanel,
  OverviewPanel,
  TabNavigation,
  MetricsGrid,
  RecommendedStacks,
  WorkflowCards
} from './components'

export function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex">
      <AppSidebar isOpen={true} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="p-6 border-b border-dark-border bg-dark-surface/50">
          <InputBar />
          <TabNavigation
            activeTab={currentPage}
            onChange={setCurrentPage}
            tabs={[
              { id: 'home', label: 'Home' },
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'settings', label: 'Settings' }
            ]}
          />
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <StatusBanner
            title="System Update"
            message="Orchids UI v2.0 is now available with new components."
            type="info"
            actionLabel="View Changelog"
            onAction={() => {}}
          />

          {currentPage === 'home' && (
            <div className="max-w-7xl mx-auto space-y-8">
              <HeroSection />
              <RecentProjects />
              <RecommendedStacks />
            </div>
          )}

          {currentPage === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-8">
              <MetricsGrid />
              <WorkflowCards />
            </div>
          )}

          {currentPage === 'settings' && (
            <div className="max-w-7xl mx-auto space-y-8">
              <OverviewPanel />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SystemPanel />
                <GitHubPanel isConnected={true} />
              </div>
              <ModelsList />
              <SubscriptionsPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
