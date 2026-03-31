import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, CreditCard } from 'lucide-react';

export interface Metric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'currency' | 'number' | 'percentage';
}

export interface MetricsGridProps {
  metrics?: Metric[];
  title?: string;
  className?: string;
}

const defaultMetrics: Metric[] = [
  {
    id: 'mrr',
    label: 'Monthly Recurring Revenue',
    value: 12450.00,
    change: 12.5,
    icon: DollarSign,
    trend: 'up',
    format: 'currency'
  },
  {
    id: 'active-users',
    label: 'Active Users',
    value: 1423,
    change: 5.2,
    icon: Users,
    trend: 'up',
    format: 'number'
  },
  {
    id: 'churn-rate',
    label: 'Churn Rate',
    value: 2.4,
    change: -0.8,
    icon: Activity,
    trend: 'down',
    format: 'percentage'
  },
  {
    id: 'arpu',
    label: 'Avg. Revenue Per User',
    value: 45.20,
    change: 2.1,
    icon: CreditCard,
    trend: 'up',
    format: 'currency'
  }
];

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics = defaultMetrics,
  title = "Key Performance Indicators",
  className = ''
}) => {
  const formatValue = (value: string | number, format?: string) => {
    if (typeof value !== 'number') return value;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  const getTrendIcon = (trend?: string, change?: number) => {
    if (!trend && change !== undefined) {
      trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    }

    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-brand-green mr-1" aria-hidden="true" />;
      case 'down':
        return <TrendingDown size={16} className="text-brand-red mr-1" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: string, change?: number) => {
    if (!trend && change !== undefined) {
      trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    }

    switch (trend) {
      case 'up': return 'text-brand-green';
      case 'down': return 'text-brand-red';
      default: return 'text-dark-muted';
    }
  };

  return (
    <div className={`mb-8 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-dark-text mb-4 tracking-tight">{title}</h3>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const formattedValue = formatValue(metric.value, metric.format);

          return (
            <div
              key={metric.id}
              className="bg-dark-surface border border-dark-border rounded-xl p-5 shadow-sm hover:border-brand-blue/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-dark-muted truncate pr-2" title={metric.label}>
                  {metric.label}
                </p>
                {Icon && (
                  <div className="w-8 h-8 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-brand-blue" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-dark-text tracking-tight">
                  {formattedValue}
                </p>

                {metric.change !== undefined && (
                  <div className={`flex items-center text-sm font-medium ${getTrendColor(metric.trend, metric.change)} bg-dark-bg px-2 py-0.5 rounded border border-dark-border`}>
                    {getTrendIcon(metric.trend, metric.change)}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
