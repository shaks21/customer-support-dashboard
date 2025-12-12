'use client';

import { useState } from 'react';
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortField, SortDirection } from '@/lib/types';

interface SortDropdownProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export default function SortDropdown({ 
  sortField, 
  sortDirection, 
  onSortChange 
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions: Array<{ field: SortField; label: string; icon: React.ReactNode }> = [
    { 
      field: 'priority', 
      label: 'Priority', 
      icon: <div className="w-2 h-2 rounded-full bg-red-500" />
    },
    { 
      field: 'date', 
      label: 'Date', 
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    },
    { 
      field: 'status', 
      label: 'Status', 
      icon: <div className="w-2 h-2 rounded-full bg-blue-500" />
    },
    { 
      field: 'category', 
      label: 'Category', 
      icon: <div className="w-2 h-2 rounded-full bg-purple-500" />
    },
    { 
      field: 'customer', 
      label: 'Customer', 
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    },
  ];

  const getSortLabel = (field: SortField) => {
    return sortOptions.find(opt => opt.field === field)?.label || field;
  };

  const toggleDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(sortField, newDirection);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span>Sort by: <span className="font-semibold">{getSortLabel(sortField)}</span></span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <button
          onClick={toggleDirection}
          className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
        >
          {sortDirection === 'asc' ? (
            <ArrowUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ArrowDown className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border z-50 py-2">
            <div className="px-4 py-2 border-b">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Sort Messages By
              </p>
            </div>
            
            {sortOptions.map((option) => (
              <button
                key={option.field}
                onClick={() => {
                  onSortChange(option.field, sortDirection);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  sortField === option.field ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    sortField === option.field ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {option.icon}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
                {sortField === option.field && (
                  <div className={`w-2 h-2 rounded-full ${
                    sortDirection === 'asc' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}