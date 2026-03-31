import React from 'react';
import { CreditCard, Check, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  interval: string;
  features: string[];
  isCurrent: boolean;
  isPopular?: boolean;
}

export interface SubscriptionsPanelProps {
  currentPlanId?: string;
  plans?: SubscriptionPlan[];
  onUpgrade?: (planId: string) => void;
  onManageBilling?: () => void;
}

const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Hobby',
    price: '$0',
    interval: 'forever',
    features: ['3 Projects', 'Community Support', 'Basic Analytics', 'Standard Models'],
    isCurrent: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    interval: 'per month',
    features: ['Unlimited Projects', 'Priority Support', 'Advanced Analytics', 'Premium Models (GPT-4)'],
    isCurrent: false,
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    interval: 'contact us',
    features: ['Custom SLA', 'Dedicated Account Manager', 'SSO & Advanced Security', 'Custom Model Fine-tuning'],
    isCurrent: false
  }
];

export const SubscriptionsPanel: React.FC<SubscriptionsPanelProps> = ({
  currentPlanId = 'free',
  plans = defaultPlans,
  onUpgrade,
  onManageBilling
}) => {
  const currentPlan = plans.find(p => p.id === currentPlanId) || plans[0];

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 lg:p-8 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-8 border-b border-dark-border gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-brand-blue/10 border border-brand-blue/30 rounded-lg shrink-0">
              <CreditCard className="text-brand-blue" size={24} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-dark-text tracking-tight">Billing & Plans</h2>
          </div>
          <p className="text-dark-muted max-w-xl text-sm leading-relaxed">
            Manage your subscription, billing details, and view invoices. Upgrade to Pro for advanced features.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-dark-bg p-4 rounded-lg border border-dark-border">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-brand-green" aria-hidden="true" />
             </div>
             <div>
               <p className="text-sm text-dark-muted font-medium uppercase tracking-wider">Current Plan</p>
               <p className="text-lg font-bold text-dark-text flex items-center gap-2">
                 {currentPlan.name}
                 {currentPlan.isCurrent && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-brand-green/20 text-brand-green rounded-full border border-brand-green/30">Active</span>
                 )}
               </p>
             </div>
          </div>
          <button
            onClick={onManageBilling}
            className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-dark-text bg-dark-surface border border-dark-border rounded-md hover:bg-dark-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-dark-surface"
          >
            Manage Billing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border p-6 flex flex-col transition-all duration-300 ${
              plan.isCurrent
                ? 'bg-dark-bg border-brand-green/50 shadow-sm shadow-brand-green/5 ring-1 ring-brand-green/20'
                : plan.isPopular
                  ? 'bg-dark-surface border-brand-blue shadow-md shadow-brand-blue/10 ring-1 ring-brand-blue/30 scale-100 md:scale-105 z-10'
                  : 'bg-dark-surface border-dark-border hover:border-dark-muted'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center shadow-lg shadow-brand-blue/20">
                <Zap size={12} className="mr-1" aria-hidden="true" />
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-dark-text mb-2">{plan.name}</h3>
              <div className="flex items-baseline text-dark-text">
                <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-sm text-dark-muted ml-2 font-medium">/{plan.interval}</span>
              </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-dark-muted">
                  <Check size={18} className="text-brand-blue mr-3 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onUpgrade?.(plan.id)}
              disabled={plan.isCurrent}
              className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface ${
                plan.isCurrent
                  ? 'bg-dark-bg text-dark-muted border border-dark-border cursor-not-allowed'
                  : plan.isPopular
                    ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-lg shadow-brand-blue/20 focus:ring-brand-blue'
                    : 'bg-dark-bg text-dark-text border border-dark-border hover:bg-dark-surface hover:border-dark-muted focus:ring-dark-border'
              }`}
              aria-disabled={plan.isCurrent}
            >
              {plan.isCurrent ? 'Current Plan' : plan.price === 'Custom' ? 'Contact Sales' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-start space-x-3 text-sm text-dark-muted bg-dark-bg/50 p-4 rounded-lg border border-dark-border/50">
        <AlertCircle size={18} className="text-brand-yellow shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          Prices are in USD. Depending on your location, local taxes or VAT may apply. You can cancel your subscription at any time. Changes will take effect at the end of the current billing cycle.
        </p>
      </div>
    </div>
  );
};
