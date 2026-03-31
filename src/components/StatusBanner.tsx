import React, { useState } from 'react';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  ExternalLink
} from 'lucide-react';

export type StatusType = 'info' | 'success' | 'warning' | 'error';

export interface StatusBannerProps {
  type?: StatusType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  isDismissible?: boolean;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  type = 'info',
  title,
  message,
  actionLabel,
  onAction,
  onClose,
  isDismissible = true
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const getStatusStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          containerBg: 'bg-brand-green/10',
          borderColor: 'border-brand-green/30',
          iconColor: 'text-brand-green',
          titleColor: 'text-brand-green'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          containerBg: 'bg-brand-yellow/10',
          borderColor: 'border-brand-yellow/30',
          iconColor: 'text-brand-yellow',
          titleColor: 'text-brand-yellow'
        };
      case 'error':
        return {
          icon: XCircle,
          containerBg: 'bg-brand-red/10',
          borderColor: 'border-brand-red/30',
          iconColor: 'text-brand-red',
          titleColor: 'text-brand-red'
        };
      case 'info':
      default:
        return {
          icon: Info,
          containerBg: 'bg-brand-blue/10',
          borderColor: 'border-brand-blue/30',
          iconColor: 'text-brand-blue',
          titleColor: 'text-brand-blue'
        };
    }
  };

  const styles = getStatusStyles();
  const Icon = styles.icon;

  return (
    <div
      className={`relative w-full rounded-lg border p-4 mb-6 shadow-sm flex items-start space-x-4 ${styles.containerBg} ${styles.borderColor}`}
      role="alert"
      aria-live="polite"
    >
      <div className={`shrink-0 ${styles.iconColor}`}>
        <Icon size={24} aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <h3 className={`text-sm font-semibold mb-1 ${styles.titleColor}`}>
          {title}
        </h3>

        {message && (
          <p className="text-sm text-dark-text/90 mb-2 leading-relaxed">
            {message}
          </p>
        )}

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className={`inline-flex items-center text-xs font-medium uppercase tracking-wider hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg rounded-sm px-1 -ml-1 ${styles.iconColor}`}
          >
            {actionLabel}
            <ExternalLink size={14} className="ml-1.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {isDismissible && (
        <button
          onClick={handleClose}
          className="shrink-0 ml-4 p-1 rounded-md text-dark-muted hover:text-dark-text hover:bg-dark-surface/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-dark-border"
          aria-label={`Dismiss ${type} message`}
        >
          <X size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
