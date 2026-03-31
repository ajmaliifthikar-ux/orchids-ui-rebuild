import React, { useRef } from 'react';
import { Layers, ChevronRight, ChevronLeft, ArrowRight, Code2 } from 'lucide-react';

export interface Stack {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  type: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  color: string;
}

export interface RecommendedStacksProps {
  stacks?: Stack[];
  onStackSelect?: (stack: Stack) => void;
  title?: string;
  subtitle?: string;
}

const defaultStacks: Stack[] = [
  {
    id: 'next-tailwind-prisma',
    name: 'Modern T3 Stack',
    description: 'Next.js app with tRPC, Tailwind CSS, and Prisma for rapid full-stack development.',
    technologies: ['Next.js', 'TypeScript', 'tRPC', 'Prisma', 'Tailwind'],
    type: 'fullstack',
    color: 'border-brand-blue/50 group-hover:bg-brand-blue/5'
  },
  {
    id: 'react-vite-zustand',
    name: 'Vite SPA Starter',
    description: 'Blazing fast React Single Page Application with Vite and lightweight state management.',
    technologies: ['React 19', 'Vite', 'Zustand', 'React Router'],
    type: 'frontend',
    color: 'border-brand-gold/50 group-hover:bg-brand-gold/5'
  },
  {
    id: 'node-express-postgres',
    name: 'Express API Foundation',
    description: 'Robust Node.js REST API with Express, PostgreSQL, and comprehensive testing.',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Jest'],
    type: 'backend',
    color: 'border-brand-green/50 group-hover:bg-brand-green/5'
  },
  {
    id: 'react-native-expo',
    name: 'Expo Mobile App',
    description: 'Cross-platform mobile application build with React Native and Expo SDK.',
    technologies: ['React Native', 'Expo', 'Reanimated', 'EAS'],
    type: 'mobile',
    color: 'border-brand-red/50 group-hover:bg-brand-red/5'
  }
];

export const RecommendedStacks: React.FC<RecommendedStacksProps> = ({
  stacks = defaultStacks,
  onStackSelect,
  title = "Recommended Stacks",
  subtitle = "Start your next project with pre-configured boilerplate and best practices."
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350; // roughly card width + gap
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const getTypeColor = (type: Stack['type']) => {
    switch (type) {
      case 'frontend': return 'text-brand-gold bg-brand-gold/10 border-brand-gold/20';
      case 'backend': return 'text-brand-green bg-brand-green/10 border-brand-green/20';
      case 'fullstack': return 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';
      case 'mobile': return 'text-brand-red bg-brand-red/10 border-brand-red/20';
      default: return 'text-dark-muted bg-dark-bg border-dark-border';
    }
  };

  return (
    <div className="mb-12 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3 text-dark-text mb-1">
            <Layers className="text-brand-blue" size={24} aria-hidden="true" />
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          </div>
          {subtitle && (
            <p className="text-sm text-dark-muted ml-9">{subtitle}</p>
          )}
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-dark-surface border border-dark-border text-dark-muted hover:text-dark-text hover:bg-dark-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-dark-surface border border-dark-border text-dark-muted hover:text-dark-text hover:bg-dark-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {stacks.map((stack) => (
          <div
            key={stack.id}
            className={`group relative flex-none w-[85vw] sm:w-[340px] bg-dark-surface border border-dark-border rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg snap-center cursor-pointer ${stack.color}`}
            onClick={() => onStackSelect?.(stack)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onStackSelect?.(stack);
              }
            }}
            tabIndex={0}
            role="button"
          >
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
               <ArrowRight size={20} className="text-brand-blue" aria-hidden="true" />
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center shrink-0">
                <Code2 size={24} className="text-dark-text group-hover:text-brand-blue transition-colors" aria-hidden="true" />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-dark-text mb-1 group-hover:text-brand-blue transition-colors">
                {stack.name}
              </h3>
              <span className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md border ${getTypeColor(stack.type)}`}>
                {stack.type}
              </span>
            </div>

            <p className="text-sm text-dark-muted leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
              {stack.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-dark-border/50">
              {stack.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-medium bg-dark-bg text-dark-muted border border-dark-border rounded-md"
                >
                  {tech}
                </span>
              ))}
              {stack.technologies.length > 3 && (
                <span className="px-2.5 py-1 text-xs font-medium bg-dark-bg text-dark-muted border border-dark-border rounded-md">
                  +{stack.technologies.length - 3}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
