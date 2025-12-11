'use client';

import { SupportMessage } from '@/lib/types';
import { 
  MessageSquare, 
  AlertCircle, 
  CreditCard, 
  Lightbulb,
  Flag,
  Clock,
  CheckCircle
} from 'lucide-react';
import { getCategoryColor, getPriorityColor } from '@/lib/utils';

interface SummaryCardsProps {
  messages: SupportMessage[];
}

export default function SummaryCards({ messages }: SummaryCardsProps) {
    
  const categoryCounts = messages.reduce((acc, msg) => {
    acc[msg.category] = (acc[msg.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityCounts = messages.reduce((acc, msg) => {
    acc[msg.priority] = (acc[msg.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = messages.reduce((acc, msg) => {
    acc[msg.status] = (acc[msg.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cards = [
    {
      title: 'Total Messages',
      value: messages.length,
      icon: MessageSquare,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'High Priority',
      value: priorityCounts['High'] || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Bugs',
      value: categoryCounts['Bug'] || 0,
      icon: Flag,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Billing Issues',
      value: categoryCounts['Billing'] || 0,
      icon: CreditCard,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Feature Requests',
      value: categoryCounts['Feature Request'] || 0,
      icon: Lightbulb,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Resolved',
      value: statusCounts['Resolved'] || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'In Progress',
      value: statusCounts['In Progress'] || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'New',
      value: statusCounts['New'] || 0,
      icon: MessageSquare,
      color: 'bg-gray-500',
      textColor: 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}