'use client';

import { useState, useEffect } from 'react';
import { Brain, Hash, Moon, Sun, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIToggleProps {
  onToggle: (useAI: boolean) => void;
  isProcessing?: boolean;
}

export default function AIToggle({ onToggle, isProcessing = false }: AIToggleProps) {
  const [useAI, setUseAI] = useState<boolean>(true);

  // Load preference from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('categorization-preference');
    if (savedPreference !== null) {
      const useAIValue = savedPreference === 'ai';
      setUseAI(useAIValue);
      onToggle(useAIValue);
    }
  }, [onToggle]);

  const handleToggle = () => {
    const newUseAI = !useAI;
    setUseAI(newUseAI);
    
    // Save to localStorage for persistence
    localStorage.setItem('categorization-preference', newUseAI ? 'ai' : 'keyword');
    
    // Notify parent component
    onToggle(newUseAI);
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col items-end">
        <span className="text-xs font-medium text-gray-700 mb-1">
          Categorization Method
        </span>
        <div className="flex items-center space-x-2">
          {isProcessing && (
            <div className="flex items-center text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
              Processing...
            </div>
          )}
          <span className={cn(
            "text-xs font-medium transition-colors",
            useAI ? "text-purple-600" : "text-gray-500"
          )}>
            <Brain className="w-3 h-3 inline mr-1" />
            AI-Powered
          </span>
          <span className="text-xs text-gray-300">|</span>
          <span className={cn(
            "text-xs font-medium transition-colors",
            !useAI ? "text-blue-600" : "text-gray-500"
          )}>
            <Hash className="w-3 h-3 inline mr-1" />
            Keyword-Based
          </span>
        </div>
      </div>
      
      <button
        onClick={handleToggle}
        disabled={isProcessing}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          useAI ? "bg-purple-600" : "bg-gray-300",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="sr-only">Toggle AI categorization</span>
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            useAI ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}