'use client';

import { SupportMessage } from '@/lib/types';
import { 
  User, 
  Mail, 
  Clock,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  MoreVertical,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { formatDate, getCategoryColor, getPriorityColor, cn } from '@/lib/utils';
import { useState } from 'react';

interface MessageCardProps {
  message: SupportMessage;
  onStatusChange: (id: string, status: SupportMessage['status']) => void;
}

export default function MessageCard({ message, onStatusChange }: MessageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const statusConfig = {
    'New': {
      icon: Clock,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      label: 'New'
    },
    'In Progress': {
      icon: PlayCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'In Progress'
    },
    'Resolved': {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      label: 'Resolved'
    }
  };

  const priorityConfig = {
    'High': {
      icon: AlertCircle,
      color: 'text-red-500',
      pulse: true,
      borderColor: 'border-red-200',
      bgColor: 'bg-red-50'
    },
    'Medium': {
      icon: Clock,
      color: 'text-yellow-500',
      pulse: false,
      borderColor: 'border-yellow-200',
      bgColor: 'bg-yellow-50'
    },
    'Low': {
      icon: Clock,
      color: 'text-green-500',
      pulse: false,
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50'
    }
  };

  const Status = statusConfig[message.status];
  const Priority = priorityConfig[message.priority];
  const StatusIcon = Status.icon;
  const PriorityIcon = Priority.icon;

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatDate(timestamp);
  };

  return (
    <div 
      className={cn(
        "group relative bg-white rounded-2xl border-l-8 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5",
        Priority.borderColor,
        message.status === 'Resolved' && "opacity-90 hover:opacity-100",
        "border-t border-r border-b border-gray-200" // Add consistent borders on other sides
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderLeftColor: getPriorityLeftBorderColor(message.priority)
      }}
    >
      

      {/* Glow effect for high priority */}
      {message.priority === 'High' && Priority.pulse && (
        <div className="absolute inset-0 rounded-2xl bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
      )}

      <div className="p-5 pl-6"> {/* Added left padding to account for indicator */}
        {/* Header: Category, Priority, Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold",
              getCategoryColor(message.category)
            )}>
              {message.category}
            </span>
            
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
              Priority.bgColor,
              Priority.color
            )}>
              <PriorityIcon className="w-3 h-3" />
              <span>{message.priority}</span>
            </div>

            {message.status === 'New' && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                <Sparkles className="w-3 h-3" />
                <span>Unread</span>
              </span>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border py-2 z-10">
                <button
                  onClick={() => {
                    onStatusChange(message.id, 'New');
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                >
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  Mark as New
                </button>
                <button
                  onClick={() => {
                    onStatusChange(message.id, 'In Progress');
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                >
                  <PlayCircle className="w-4 h-4 mr-2 text-yellow-500" />
                  Mark In Progress
                </button>
                <button
                  onClick={() => {
                    onStatusChange(message.id, 'Resolved');
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Mark Resolved
                </button>
                <div className="border-t my-1" />
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2 text-blue-500" />
                  View Details
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="mb-4">
          <div className="flex items-start mb-2">
            <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 mr-2 shrink-0" />
            <p className="text-gray-700 leading-relaxed line-clamp-3">
              {message.message}
            </p>
          </div>
          
          {isHovered && (
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center mt-2">
              Expand message
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Customer Info & Timestamp */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                {message.customerName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{message.customerName}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-[120px]">{message.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-500 flex items-center mb-1">
              <Clock className="w-3 h-3 mr-1" />
              {getTimeAgo(message.timestamp)}
            </div>
            
            {/* Status Badge */}
            <div className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1",
              Status.bgColor,
              Status.color
            )}>
              <StatusIcon className="w-3 h-3 " />
              <span>{Status.label}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar - Appears on Hover */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-white via-white to-transparent rounded-b-2xl">
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => onStatusChange(message.id, 'New')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  message.status === 'New' 
                    ? "bg-gray-200 text-gray-700 border" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Clock className="w-3 h-3 inline mr-1" />
                New
              </button>
              <button
                onClick={() => onStatusChange(message.id, 'In Progress')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  message.status === 'In Progress'
                    ? "bg-yellow-100 text-yellow-700 border"
                    : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                )}
              >
                <PlayCircle className="w-3 h-3 inline mr-1" />
                In Progress
              </button>
              <button
                onClick={() => onStatusChange(message.id, 'Resolved')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  message.status === 'Resolved'
                    ? "bg-green-100 text-green-700 border"
                    : "bg-green-50 text-green-600 hover:bg-green-100"
                )}
              >
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Resolved
              </button>
            </div>
          </div>
        )}

        {/* Interaction Stats (subtle) */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>#{message.id}</span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {getTimeAgo(message.timestamp)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                {message.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Dot */}
      <div className={cn(
        "absolute top-4 right-4 w-2 h-2 rounded-full transition-all",
        message.status === 'New' && "bg-gray-400",
        message.status === 'In Progress' && "bg-yellow-400 animate-pulse",
        message.status === 'Resolved' && "bg-green-400"
      )} />
    </div>
  );
}

// Helper function for left border color
function getPriorityLeftBorderColor(priority: string): string {
  switch (priority) {
    case 'High': return '#ef4444'; // red-500
    case 'Medium': return '#eab308'; // yellow-500
    case 'Low': return '#22c55e'; // green-500
    default: return '#d1d5db'; // gray-300
  }
}