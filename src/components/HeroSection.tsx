import React from 'react';
import { Play, ArrowRight, Sparkles } from 'lucide-react';

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Accelerate Your Development",
  subtitle = "Build, test, and deploy faster with Orchids AI-powered workflows. Seamlessly integrate your tools and scale your infrastructure.",
  onPrimaryAction,
  onSecondaryAction
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-dark-surface border border-dark-border p-8 md:p-12 mb-8">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-blue/10 blur-3xl mix-blend-screen pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-green/10 blur-3xl mix-blend-screen pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center space-x-2 bg-dark-bg/50 border border-dark-border rounded-full px-3 py-1 mb-6">
          <Sparkles className="text-brand-gold w-4 h-4" />
          <span className="text-xs font-medium text-brand-gold">New version 2.0 available</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-dark-muted mb-8 max-w-2xl leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onPrimaryAction}
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-blue transition-colors shadow-lg shadow-brand-blue/20"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Building
          </button>

          <button
            onClick={onSecondaryAction}
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-dark-border text-base font-medium rounded-lg text-white bg-dark-bg hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-dark-border transition-colors"
          >
            View Documentation
            <ArrowRight className="w-5 h-5 ml-2 text-dark-muted" />
          </button>
        </div>
      </div>

      {/* Decorative element */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2" aria-hidden="true">
        <div className="grid grid-cols-2 gap-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-transparent border border-brand-blue/30 backdrop-blur-sm" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-green/20 to-transparent border border-brand-green/30 backdrop-blur-sm mt-12" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-bl from-brand-gold/20 to-transparent border border-brand-gold/30 backdrop-blur-sm -mt-8" />
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tl from-brand-red/20 to-transparent border border-brand-red/30 backdrop-blur-sm" />
        </div>
      </div>
    </div>
  );
};
