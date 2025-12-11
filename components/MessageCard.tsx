'use client';

import { SupportMessage } from '@/lib/types';
import { 
  User, 
  Mail, 
  Calendar,
  CheckCircle,
  PlayCircle,
  Circle
} from 'lucide-react';
import { formatDate, getCategoryColor, getPriorityColor, getPriorityTextColor, cn } from '@/lib/utils';

interface MessageCardProps {
  message: SupportMessage;
  onStatusChange: (id: string, status: SupportMessage['status']) => void;
}

export default function MessageCard({ message, onStatusChange }: MessageCardProps) {
  const statusIcons = {
    'New': Circle,
    'In Progress': PlayCircle,
    'Resolved': CheckCircle
  };

  const StatusIcon = statusIcons[message.status];
  
  return (
    <div className={cn(
      "bg-white rounded-lg border p-6 transition-all hover:shadow-md",
      message.priority === 'High' && "border-l-4 border-l-red-500",
      message.status === 'Resolved' && "opacity-75"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(message.priority)}`} />
            <span className={`font-medium ${getPriorityTextColor(message.priority)}`}>
              {message.priority}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(message.category)}`}>
            {message.category}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onStatusChange(message.id, 'New')}
            className={cn(
              "p-1 rounded",
              message.status === 'New' && "bg-gray-100"
            )}
            title="Mark as New"
          >
            <Circle className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onStatusChange(message.id, 'In Progress')}
            className={cn(
              "p-1 rounded",
              message.status === 'In Progress' && "bg-yellow-50"
            )}
            title="Mark as In Progress"
          >
            <PlayCircle className="w-4 h-4 text-yellow-500" />
          </button>
          <button
            onClick={() => onStatusChange(message.id, 'Resolved')}
            className={cn(
              "p-1 rounded",
              message.status === 'Resolved' && "bg-green-50"
            )}
            title="Mark as Resolved"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 line-clamp-3">{message.message}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{message.customerName}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-1" />
            <span className="truncate max-w-[150px]">{message.email}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(message.timestamp)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex items-center">
          <StatusIcon className={cn(
            "w-4 h-4 mr-2",
            message.status === 'New' && "text-gray-400",
            message.status === 'In Progress' && "text-yellow-500",
            message.status === 'Resolved' && "text-green-500"
          )} />
          <span className={cn(
            "text-sm font-medium",
            message.status === 'New' && "text-gray-600",
            message.status === 'In Progress' && "text-yellow-600",
            message.status === 'Resolved' && "text-green-600"
          )}>
            {message.status}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          ID: {message.id}
        </div>
      </div>
    </div>
  );
}