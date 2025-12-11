'use client';

import { Category, Priority, Status, FilterOptions } from '@/lib/types';
import { Filter, X } from 'lucide-react';
import { cn, getPriorityColor  } from '@/lib/utils';

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  messageCount: number;
}

export default function Filters({ filters, onFilterChange, messageCount }: FiltersProps) {
  const categories: Category[] = ['Bug', 'Billing', 'Feature Request', 'General'];
  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const statuses: Status[] = ['New', 'In Progress', 'Resolved'];

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
  };

  const hasActiveFilters = filters.category || filters.priority || filters.status;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        <div className="text-sm text-gray-600">
          Showing {messageCount} message{messageCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  filters.category === category
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Priority</h3>
          <div className="space-y-2">
            {priorities.map((priority) => (
              <button
                key={priority}
                onClick={() => handlePrioritySelect(priority)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center",
                  filters.priority === priority
                    ? getPriorityFilterClass(priority)
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full mr-3",
                  getPriorityColor(priority)
                )} />
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
          <div className="space-y-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  filters.status === status
                    ? getStatusFilterClass(status)
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  Category: {filters.category}
                </span>
              )}
              {filters.priority && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  Priority: {filters.priority}
                </span>
              )}
              {filters.status && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  Status: {filters.status}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getPriorityFilterClass(priority: Priority): string {
  switch (priority) {
    case 'High': return 'bg-red-50 text-red-700 border border-red-200';
    case 'Medium': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'Low': return 'bg-green-50 text-green-700 border border-green-200';
    default: return '';
  }
}

function getStatusFilterClass(status: Status): string {
  switch (status) {
    case 'New': return 'bg-gray-50 text-gray-700 border border-gray-200';
    case 'In Progress': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'Resolved': return 'bg-green-50 text-green-700 border border-green-200';
    default: return '';
  }
}