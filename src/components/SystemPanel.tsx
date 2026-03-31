import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Activity, RefreshCw, Power } from 'lucide-react';

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  memoryTotal: number;
  diskUsage: number;
  diskTotal: number;
  uptime: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
}

export interface SystemPanelProps {
  initialStats?: SystemStats;
  onRefresh?: () => void;
  onRestart?: () => void;
  isRefreshing?: boolean;
}

const defaultStats: SystemStats = {
  cpuUsage: 45,
  memoryUsage: 8.5,
  memoryTotal: 16,
  diskUsage: 250,
  diskTotal: 512,
  uptime: '14 days, 5 hours',
  status: 'online'
};

const ProgressBar = ({ label, value, max, unit, color }: { label: string, value: number, max: number, unit: string, color: string }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-semibold text-dark-text tracking-wide">{label}</span>
        <span className="font-medium text-dark-text">
          {value.toFixed(1)} {unit} / {max} {unit} <span className="text-dark-muted ml-1">({percentage.toFixed(0)}%)</span>
        </span>
      </div>
      <div className="h-2 w-full bg-dark-bg border border-dark-border rounded-full overflow-hidden" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const SystemPanel: React.FC<SystemPanelProps> = ({
  initialStats = defaultStats,
  onRefresh,
  onRestart,
  isRefreshing = false
}) => {
  const [stats, setStats] = useState<SystemStats>(initialStats);

  // Simulate live updates for CPU if no external refresh logic is provided
  useEffect(() => {
    if (onRefresh) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() * 10 - 5)))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [onRefresh]);

  const getStatusColor = (status: SystemStats['status']) => {
    switch (status) {
      case 'online': return 'bg-brand-green';
      case 'warning': return 'bg-brand-yellow';
      case 'critical': return 'bg-brand-red';
      case 'offline': return 'bg-dark-muted';
      default: return 'bg-brand-green';
    }
  };

  const getCpuColor = (usage: number) => {
    if (usage > 85) return 'bg-brand-red';
    if (usage > 65) return 'bg-brand-yellow';
    return 'bg-brand-blue';
  };

  const getMemoryColor = (usage: number, total: number) => {
    const percentage = (usage / total) * 100;
    if (percentage > 85) return 'bg-brand-red';
    if (percentage > 70) return 'bg-brand-yellow';
    return 'bg-brand-blue';
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-dark-border">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-dark-bg border border-dark-border rounded-xl flex items-center justify-center shrink-0 shadow-inner">
              <Server className="text-dark-text" size={24} aria-hidden="true" />
            </div>
            <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-dark-surface ${getStatusColor(stats.status)} ring-2 ring-dark-bg/50 animate-pulse`} aria-label={`Status: ${stats.status}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark-text tracking-tight flex items-center gap-2">
              System Resources
            </h2>
            <div className="flex items-center text-sm text-dark-muted mt-0.5">
              <Activity size={14} className="mr-1.5" aria-hidden="true" />
              Uptime: <span className="font-medium text-dark-text ml-1">{stats.uptime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-dark-muted hover:text-dark-text bg-dark-bg border border-dark-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:opacity-50"
            aria-label="Refresh system stats"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} aria-hidden="true" />
          </button>

          <button
            onClick={onRestart}
            className="flex items-center px-4 py-2 text-sm font-medium text-brand-red bg-brand-red/10 border border-brand-red/30 rounded-lg hover:bg-brand-red/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-dark-surface"
          >
            <Power size={16} className="mr-2" aria-hidden="true" />
            Restart Service
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-5 bg-dark-bg border border-dark-border rounded-lg shadow-inner">
          <div className="flex items-center space-x-3 mb-5">
            <Cpu className="text-brand-blue" size={20} aria-hidden="true" />
            <h3 className="font-semibold text-dark-text uppercase tracking-wider text-sm">Processor</h3>
          </div>
          <ProgressBar
            label="CPU Load"
            value={stats.cpuUsage}
            max={100}
            unit="%"
            color={getCpuColor(stats.cpuUsage)}
          />
        </div>

        <div className="p-5 bg-dark-bg border border-dark-border rounded-lg shadow-inner">
          <div className="flex items-center space-x-3 mb-5">
            <Activity className="text-brand-blue" size={20} aria-hidden="true" />
            <h3 className="font-semibold text-dark-text uppercase tracking-wider text-sm">Memory</h3>
          </div>
          <ProgressBar
            label="RAM Usage"
            value={stats.memoryUsage}
            max={stats.memoryTotal}
            unit="GB"
            color={getMemoryColor(stats.memoryUsage, stats.memoryTotal)}
          />
        </div>

        <div className="p-5 bg-dark-bg border border-dark-border rounded-lg shadow-inner">
          <div className="flex items-center space-x-3 mb-5">
            <HardDrive className="text-brand-blue" size={20} aria-hidden="true" />
            <h3 className="font-semibold text-dark-text uppercase tracking-wider text-sm">Storage</h3>
          </div>
          <ProgressBar
            label="Disk Space"
            value={stats.diskUsage}
            max={stats.diskTotal}
            unit="GB"
            color="bg-brand-blue"
          />
        </div>
      </div>
    </div>
  );
};
