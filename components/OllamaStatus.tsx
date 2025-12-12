'use client';

import { useEffect, useState } from 'react';
import { Cpu, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { checkOllamaStatus } from '@/lib/ollama-status';

export default function OllamaStatus() {
  const [status, setStatus] = useState<{
    isRunning: boolean;
    models: string[];
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      const result = await checkOllamaStatus();
      setStatus(result);
      setLoading(false);
    }
    loadStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm">
        <Cpu className="w-4 h-4 mr-2 animate-spin" />
        Checking AI engine...
      </div>
    );
  }

  if (!status?.isRunning) {
    return (
      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm border border-red-200">
        <XCircle className="w-4 h-4 mr-2" />
        AI Offline
        <span className="ml-2 text-xs opacity-75">(Using keyword rules)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm border border-green-200">
      <CheckCircle className="w-4 h-4 mr-2" />
      AI Online
      <span className="ml-2 text-xs opacity-75">
        {status.models.length} model{status.models.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
}