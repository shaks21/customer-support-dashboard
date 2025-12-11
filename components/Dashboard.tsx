'use client';

import { useState, useMemo } from 'react';
import { mockMessages } from '@/lib/data';
import { SupportMessage, FilterOptions } from '@/lib/types';
import SummaryCards from './SummaryCards';
import Filters from './Filters';
import MessageCard from './MessageCard';
import { RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [messages, setMessages] = useState<SupportMessage[]>(mockMessages);
  const [filters, setFilters] = useState<FilterOptions>({});

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      if (filters.category && message.category !== filters.category) return false;
      if (filters.priority && message.priority !== filters.priority) return false;
      if (filters.status && message.status !== filters.status) return false;
      return true;
    });
  }, [messages, filters]);

  const handleStatusChange = (id: string, status: SupportMessage['status']) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, status } : msg
    ));
  };

  const resetAllStatuses = () => {
    setMessages(messages.map(msg => ({
      ...msg,
      status: 'New' as const
    })));
  };

  const markAllAsResolved = () => {
    setMessages(messages.map(msg => ({
      ...msg,
      status: 'Resolved' as const
    })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Messages</h1>
          <p className="text-gray-600">Review and triage incoming support requests</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetAllStatuses}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Reset All
          </button>
          <button
            onClick={markAllAsResolved}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Mark All Resolved
          </button>
        </div>
      </div>

      <SummaryCards messages={messages} />
      <Filters 
        filters={filters} 
        onFilterChange={setFilters}
        messageCount={filteredMessages.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMessages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
}