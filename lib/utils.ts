import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Color utilities for categories and priorities
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Bug': return 'bg-red-100 text-red-800';
    case 'Billing': return 'bg-blue-100 text-blue-800';
    case 'Feature Request': return 'bg-green-100 text-green-800';
    case 'General': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'High': return 'bg-red-500';
    case 'Medium': return 'bg-yellow-500';
    case 'Low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}

export function getPriorityTextColor(priority: string): string {
  switch (priority) {
    case 'High': return 'text-red-700';
    case 'Medium': return 'text-yellow-700';
    case 'Low': return 'text-green-700';
    default: return 'text-gray-700';
  }
}