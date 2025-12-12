import { SupportMessage, SortField, SortDirection } from './types';

const priorityOrder = { High: 3, Medium: 2, Low: 1 };
const statusOrder = { New: 3, 'In Progress': 2, Resolved: 1 };

export function sortMessages(
  messages: SupportMessage[],
  field: SortField,
  direction: SortDirection
): SupportMessage[] {
  return [...messages].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (field) {
      case 'priority':
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
        break;
      
      case 'date':
        aValue = a.timestamp.getTime();
        bValue = b.timestamp.getTime();
        break;
      
      case 'status':
        aValue = statusOrder[a.status] || 0;
        bValue = statusOrder[b.status] || 0;
        break;
      
      case 'category':
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      
      case 'customer':
        aValue = a.customerName.toLowerCase();
        bValue = b.customerName.toLowerCase();
        break;
      
      default:
        return 0;
    }

    const comparison = direction === 'desc' ? -1 : 1;
    
    if (aValue < bValue) return -1 * comparison;
    if (aValue > bValue) return 1 * comparison;
    
    // Secondary sort by priority, then date
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;
    if (aPriority !== bPriority) return bPriority - aPriority;
    
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
}