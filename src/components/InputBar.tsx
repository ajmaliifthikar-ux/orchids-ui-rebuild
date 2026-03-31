import React, { useState, useRef, useEffect } from 'react';
import { Search, Command, ArrowRight, X } from 'lucide-react';

export interface InputBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
}

export const InputBar: React.FC<InputBarProps> = ({
  placeholder = "Search projects, commands, or documentation...",
  onSearch,
  suggestions = [
    "Create new React project",
    "Deploy to production",
    "Configure API keys",
    "View billing settings"
  ]
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setIsFocused(false);
  };

  // Keyboard shortcut (Cmd/Ctrl + K) to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSuggestions = query
    ? suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions.slice(0, 3);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center w-full rounded-xl border transition-all duration-200 bg-dark-surface shadow-sm ${
          isFocused
            ? 'border-brand-blue ring-1 ring-brand-blue/50 shadow-brand-blue/10'
            : 'border-dark-border hover:border-dark-muted'
        }`}
      >
        <div className="flex items-center justify-center pl-4 pr-2 text-dark-muted">
          <Search size={20} className={isFocused ? 'text-brand-blue' : ''} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay blur to allow clicking suggestions
            setTimeout(() => setIsFocused(false), 200);
          }}
          placeholder={placeholder}
          className="w-full py-3 md:py-4 bg-transparent text-dark-text placeholder-dark-muted outline-none text-base md:text-lg"
          aria-label="Search or type a command"
        />

        <div className="flex items-center pr-4 space-x-2">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-dark-muted hover:text-dark-text rounded-full hover:bg-dark-bg transition-colors"
              aria-label="Clear input"
            >
              <X size={16} />
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-dark-bg border border-dark-border rounded text-xs text-dark-muted font-medium select-none">
            <Command size={12} />
            <span>K</span>
          </div>

          <button
            type="submit"
            disabled={!query.trim()}
            className={`p-2 rounded-lg transition-colors ${
              query.trim()
                ? 'bg-brand-blue text-white hover:bg-blue-600'
                : 'bg-dark-bg text-dark-muted cursor-not-allowed border border-dark-border'
            }`}
            aria-label="Submit search"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {isFocused && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-dark-surface border border-dark-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-2 text-xs font-semibold text-dark-muted uppercase tracking-wider">
            {query ? 'Search Results' : 'Suggestions'}
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 text-dark-text hover:bg-dark-bg hover:text-brand-blue focus:bg-dark-bg focus:text-brand-blue focus:outline-none transition-colors flex items-center space-x-3"
                >
                  <Search size={16} className="text-dark-muted" />
                  <span>{suggestion}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
