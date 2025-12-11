import { Category, Priority } from './types';

export function categorizeMessage(message: string): {
  category: Category;
  priority: Priority;
} {
  const lowerMessage = message.toLowerCase();
  
  // Default values
  let category: Category = 'General';
  let priority: Priority = 'Medium';
  
  // Category detection
  if (lowerMessage.includes('crash') || 
      lowerMessage.includes('error') || 
      lowerMessage.includes('bug') || 
      lowerMessage.includes('not working') ||
      lowerMessage.includes('broken') ||
      lowerMessage.includes('fail') ||
      lowerMessage.includes('issue') ||
      lowerMessage.includes('problem')) {
    category = 'Bug';
  } else if (lowerMessage.includes('invoice') || 
             lowerMessage.includes('charge') || 
             lowerMessage.includes('bill') || 
             lowerMessage.includes('payment') ||
             lowerMessage.includes('price') ||
             lowerMessage.includes('cost') ||
             lowerMessage.includes('refund') ||
             lowerMessage.includes('deduct')) {
    category = 'Billing';
  } else if (lowerMessage.includes('feature') || 
             lowerMessage.includes('add') || 
             lowerMessage.includes('request') || 
             lowerMessage.includes('suggest') ||
             lowerMessage.includes('would like') ||
             lowerMessage.includes('could you') ||
             lowerMessage.includes('wish') ||
             lowerMessage.includes('integration')) {
    category = 'Feature Request';
  }
  
  // Priority detection
  if (lowerMessage.includes('urgent') || 
      lowerMessage.includes('asap') || 
      lowerMessage.includes('emergency') ||
      lowerMessage.includes('immediately') ||
      lowerMessage.includes('critical') ||
      lowerMessage.includes('right away')) {
    priority = 'High';
  } else if (lowerMessage.includes('when you have time') || 
             lowerMessage.includes('no rush') || 
             lowerMessage.includes('low priority') ||
             lowerMessage.includes('whenever') ||
             lowerMessage.includes('suggestion') ||
             lowerMessage.includes('nice to have')) {
    priority = 'Low';
  }
  
  // Priority adjustments based on category
  if (category === 'Bug') {
    priority = 'High';
  } else if (category === 'Billing') {
    priority = 'High';
  } else if (category === 'Feature Request') {
    priority = 'Low';
  }
  
  return { category, priority };
}