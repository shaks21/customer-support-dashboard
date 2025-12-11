'use client';

import { Category, Priority, Status, FilterOptions, SupportMessage } from '@/lib/types';
import { Filter, X, Zap, Clock, Check, ChevronDown, Search } from 'lucide-react';
import { cn, getPriorityColor } from '@/lib/utils';
import { useState } from 'react';

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  messageCount: number;
  messages: SupportMessage[]; // Add this prop
}

export default function Filters({ filters, onFilterChange, messageCount, messages }: FiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const categories: Category[] = ['Bug', 'Billing', 'Feature Request', 'General'];
  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const statuses: Status[] = ['New', 'In Progress', 'Resolved'];

  // Calculate accurate statistics from actual messages
  const calculateStats = () => {
    let highPriorityCount = 0;
    let newStatusCount = 0;
    let activeFilterCount = 0;

    // Count all messages (not just filtered ones for total stats)
    messages.forEach((message) => {
      if (message.priority === 'High') highPriorityCount++;
      if (message.status === 'New') newStatusCount++;
    });

    // Count active filters
    if (filters.category) activeFilterCount++;
    if (filters.priority) activeFilterCount++;
    if (filters.status) activeFilterCount++;

    return {
      total: messages.length,
      highPriority: highPriorityCount,
      newStatus: newStatusCount,
      activeFilters: activeFilterCount
    };
  };

  const stats = calculateStats();

  const handleCategorySelect = (category: Category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? undefined : category
    });
  };

  const handlePrioritySelect = (priority: Priority) => {
    onFilterChange({
      ...filters,
      priority: filters.priority === priority ? undefined : priority
    });
  };

  const handleStatusSelect = (status: Status) => {
    onFilterChange({
      ...filters,
      status: filters.status === status ? undefined : status
    });
  };

  const clearFilters = () => {
    onFilterChange({});
    setExpandedSection(null);
  };

  const hasActiveFilters = filters.category || filters.priority || filters.status;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-900 rounded-lg">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <p className="text-xs text-gray-500">{messageCount} messages</p>
            </div>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center text-xs text-gray-600 hover:text-gray-900 px-2 py-1 hover:bg-gray-100 rounded"
            >
              <X className="w-3 h-3 mr-1" />
              Clear all
            </button>
          )}
        </div>
        
        <div className="text-sm">
          <span className="text-gray-600">Showing </span>
          <span className="font-semibold text-gray-900">{messageCount}</span>
          <span className="text-gray-600"> of {stats.total}</span>
        </div>
      </div>

      {/* Compact Filter Bar */}
      <div className="bg-white rounded-xl border p-4">
        <div className="grid grid-cols-3 gap-3">
          {/* Category Compact Selector */}
          <div>
            <button
              onClick={() => toggleSection('category')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors",
                filters.category 
                  ? getCategoryButtonClass(filters.category)
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center">
                <span className="mr-2">{getCategoryIcon(filters.category)}</span>
                <span>{filters.category || 'Category'}</span>
              </div>
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                expandedSection === 'category' && "rotate-180"
              )} />
            </button>
            
            {expandedSection === 'category' && (
              <div className="absolute mt-1 bg-white border rounded-lg shadow-lg z-10 p-2 grid grid-cols-2 gap-1 w-48">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      handleCategorySelect(category);
                      setExpandedSection(null);
                    }}
                    className={cn(
                      "text-xs px-2 py-1.5 rounded text-left",
                      filters.category === category
                        ? getCategoryActiveClass(category)
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center">
                      <span className="mr-1.5">{getCategoryIcon(category)}</span>
                      {category}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Compact Selector */}
          <div>
            <button
              onClick={() => toggleSection('priority')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors",
                filters.priority 
                  ? getPriorityButtonClass(filters.priority)
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center">
                <div className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  filters.priority ? getPriorityColor(filters.priority) : "bg-gray-300"
                )} />
                <span>{filters.priority || 'Priority'}</span>
              </div>
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                expandedSection === 'priority' && "rotate-180"
              )} />
            </button>
            
            {expandedSection === 'priority' && (
              <div className="absolute mt-1 bg-white border rounded-lg shadow-lg z-10 p-2 w-48">
                {priorities.map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      handlePrioritySelect(priority);
                      setExpandedSection(null);
                    }}
                    className={cn(
                      "w-full text-xs px-2 py-1.5 rounded text-left flex items-center justify-between",
                      filters.priority === priority
                        ? getPriorityActiveClass(priority)
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        getPriorityColor(priority)
                      )} />
                      {priority}
                    </div>
                    {filters.priority === priority && (
                      <Check className={cn(
                        "w-3 h-3",
                        getPriorityIconClass(priority)
                      )} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Compact Selector */}
          <div>
            <button
              onClick={() => toggleSection('status')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors",
                filters.status 
                  ? getStatusButtonClass(filters.status)
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center">
                <span className="mr-2">{getStatusIcon(filters.status)}</span>
                <span>{filters.status || 'Status'}</span>
              </div>
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                expandedSection === 'status' && "rotate-180"
              )} />
            </button>
            
            {expandedSection === 'status' && (
              <div className="absolute mt-1 bg-white border rounded-lg shadow-lg z-10 p-2 grid grid-cols-3 gap-1 w-64">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      handleStatusSelect(status);
                      setExpandedSection(null);
                    }}
                    className={cn(
                      "text-xs px-2 py-1.5 rounded text-center",
                      filters.status === status
                        ? getStatusActiveClass(status)
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-base mb-0.5">{getStatusIcon(status)}</span>
                      {status}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Pills - Inline */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs text-gray-500">Active:</span>
              {filters.category && (
                <button
                  onClick={() => handleCategorySelect(filters.category!)}
                  className={cn(
                    "px-2 py-1 rounded-full text-xs flex items-center",
                    getCategoryPillClass(filters.category)
                  )}
                >
                  <span className="mr-1">{getCategoryIcon(filters.category)}</span>
                  {filters.category}
                  <X className="w-3 h-3 ml-1" />
                </button>
              )}
              
              {filters.priority && (
                <button
                  onClick={() => handlePrioritySelect(filters.priority!)}
                  className={cn(
                    "px-2 py-1 rounded-full text-xs flex items-center",
                    getPriorityPillClass(filters.priority)
                  )}
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mr-1",
                    getPriorityColor(filters.priority)
                  )} />
                  {filters.priority}
                  <X className="w-3 h-3 ml-1" />
                </button>
              )}
              
              {filters.status && (
                <button
                  onClick={() => handleStatusSelect(filters.status!)}
                  className={cn(
                    "px-2 py-1 rounded-full text-xs flex items-center",
                    getStatusPillClass(filters.status)
                  )}
                >
                  <span className="mr-1">{getStatusIcon(filters.status)}</span>
                  {filters.status}
                  <X className="w-3 h-3 ml-1" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Search/Quick Actions Row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Search className="w-3 h-3 mr-1" />
            <span>Filter results update instantly</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onFilterChange({ category: 'Bug', priority: 'High' });
                setExpandedSection(null);
              }}
              className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
            >
              Urgent Bugs
            </button>
            <button
              onClick={() => {
                onFilterChange({ category: 'Billing', status: 'New' });
                setExpandedSection(null);
              }}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
            >
              New Billing
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar - Ultra Compact */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-xs text-gray-600">Total</div>
            <div className="font-semibold text-gray-900">{stats.total}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">High Priority</div>
            <div className="font-semibold text-red-600">
              {stats.highPriority}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">New</div>
            <div className="font-semibold text-blue-600">
              {stats.newStatus}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Active Filters</div>
            <div className="font-semibold text-gray-900">
              {stats.activeFilters}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getCategoryIcon(category?: Category): string {
  if (!category) return '📊';
  switch (category) {
    case 'Bug': return '🐛';
    case 'Billing': return '💳';
    case 'Feature Request': return '💡';
    case 'General': return '❓';
    default: return '📝';
  }
}

function getStatusIcon(status?: Status): string {
  if (!status) return '📋';
  switch (status) {
    case 'New': return '🆕';
    case 'In Progress': return '🔄';
    case 'Resolved': return '✅';
    default: return '📋';
  }
}

function getCategoryButtonClass(category: Category): string {
  switch (category) {
    case 'Bug': return 'bg-red-50 border-red-200 text-red-700';
    case 'Billing': return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'Feature Request': return 'bg-green-50 border-green-200 text-green-700';
    case 'General': return 'bg-gray-50 border-gray-200 text-gray-700';
    default: return '';
  }
}

function getPriorityButtonClass(priority: Priority): string {
  switch (priority) {
    case 'High': return 'bg-red-50 border-red-200 text-red-700';
    case 'Medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    case 'Low': return 'bg-green-50 border-green-200 text-green-700';
    default: return '';
  }
}

function getStatusButtonClass(status: Status): string {
  switch (status) {
    case 'New': return 'bg-gray-50 border-gray-200 text-gray-700';
    case 'In Progress': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    case 'Resolved': return 'bg-green-50 border-green-200 text-green-700';
    default: return '';
  }
}

function getCategoryActiveClass(category: Category): string {
  switch (category) {
    case 'Bug': return 'bg-red-100 text-red-800';
    case 'Billing': return 'bg-blue-100 text-blue-800';
    case 'Feature Request': return 'bg-green-100 text-green-800';
    case 'General': return 'bg-gray-100 text-gray-800';
    default: return '';
  }
}

function getCategoryPillClass(category: Category): string {
  switch (category) {
    case 'Bug': return 'bg-red-100 text-red-700 hover:bg-red-200';
    case 'Billing': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
    case 'Feature Request': return 'bg-green-100 text-green-700 hover:bg-green-200';
    case 'General': return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    default: return '';
  }
}

function getPriorityActiveClass(priority: Priority): string {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return '';
  }
}

function getPriorityIconClass(priority: Priority): string {
  switch (priority) {
    case 'High': return 'text-red-600';
    case 'Medium': return 'text-yellow-600';
    case 'Low': return 'text-green-600';
    default: return '';
  }
}

function getPriorityPillClass(priority: Priority): string {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-700 hover:bg-red-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
    case 'Low': return 'bg-green-100 text-green-700 hover:bg-green-200';
    default: return '';
  }
}

function getStatusActiveClass(status: Status): string {
  switch (status) {
    case 'New': return 'bg-gray-100 text-gray-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'Resolved': return 'bg-green-100 text-green-800';
    default: return '';
  }
}

function getStatusPillClass(status: Status): string {
  switch (status) {
    case 'New': return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    case 'In Progress': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
    case 'Resolved': return 'bg-green-100 text-green-700 hover:bg-green-200';
    default: return '';
  }
}