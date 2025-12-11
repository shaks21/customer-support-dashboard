'use client';

import { SupportMessage } from '@/lib/types';
import { 
  User, 
  Mail, 
  Calendar,
  CheckCircle,
  PlayCircle,
  Circle,
  Clock,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  MoreVertical,
  Copy,
  ExternalLink
} from 'lucide-react';
import { formatDate, getCategoryColor, getPriorityColor, getPriorityTextColor, cn } from '@/lib/utils';
import { useState } from 'react';

interface MessageCardProps {
  message: SupportMessage;
  onStatusChange: (id: string, status: SupportMessage['status']) => void;
}

export default function MessageCard({ message, onStatusChange }: MessageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const statusIcons = {
    'New': Circle,
    'In Progress': PlayCircle,
    'Resolved': CheckCircle
  };

  const priorityIcons = {
    'High': AlertCircle,
    'Medium': Clock,
    'Low': Circle
  };

  const StatusIcon = statusIcons[message.status];
  const PriorityIcon = priorityIcons[message.priority];

  const getStatusColor = (status: SupportMessage['status']) => {
    switch (status) {
      case 'New': return 'bg-gray-100 text-gray-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(date);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(message.email);
    // Could add toast notification here
  };

  const getPriorityBadgeStyle = (priority: SupportMessage['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25';
      case 'Medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25';
      case 'Low':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25';
      default:
        return '';
    }
  };

  const getCategoryEmoji = (category: SupportMessage['category']) => {
    switch (category) {
      case 'Bug': return '🐛';
      case 'Billing': return '💳';
      case 'Feature Request': return '💡';
      case 'General': return '📝';
      default: return '📄';
    }
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1",
        message.priority === 'High' 
          ? "border-red-100 hover:border-red-200" 
          : message.priority === 'Medium'
          ? "border-yellow-100 hover:border-yellow-200"
          : "border-gray-100 hover:border-gray-200",
        message.status === 'Resolved' && "opacity-90"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Priority Indicator Bar */}
      <div className={cn(
        "absolute top-0 left-0 h-full w-2 rounded-l-2xl transition-all duration-300",
        getPriorityColor(message.priority),
        isHovered && "w-3"
      )} />

      {/* Main Content */}
      <div className="pl-8 pr-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            {/* Priority Badge */}
            <div className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold flex items-center",
              getPriorityBadgeStyle(message.priority)
            )}>
              <PriorityIcon className="w-3 h-3 mr-1.5" />
              {message.priority}
            </div>

            {/* Category Badge */}
            <div className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm",
              getCategoryColor(message.category),
              "border border-white/20"
            )}>
              <span className="mr-1.5">{getCategoryEmoji(message.category)}</span>
              {message.category}
            </div>
          </div>

          {/* Status Actions */}
          <div className="flex items-center space-x-1">
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-10 min-w-40">
                  <button
                    onClick={() => onStatusChange(message.id, 'New')}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center",
                      message.status === 'New' && "bg-gray-50 text-gray-900"
                    )}
                  >
                    <Circle className="w-4 h-4 mr-2 text-gray-500" />
                    Mark as New
                  </button>
                  <button
                    onClick={() => onStatusChange(message.id, 'In Progress')}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center",
                      message.status === 'In Progress' && "bg-yellow-50 text-yellow-900"
                    )}
                  >
                    <PlayCircle className="w-4 h-4 mr-2 text-yellow-500" />
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => onStatusChange(message.id, 'Resolved')}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center",
                      message.status === 'Resolved' && "bg-green-50 text-green-900"
                    )}
                  >
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="mb-6">
          <div className="flex items-start mb-3">
            <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 mr-3 shrink-0" />
            <p className="text-gray-800 leading-relaxed pr-4">{message.message}</p>
          </div>
          
          {/* Status Indicator */}
          <div className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
            getStatusColor(message.status)
          )}>
            <StatusIcon className={cn(
              "w-3.5 h-3.5 mr-2",
              message.status === 'New' && "text-gray-500",
              message.status === 'In Progress' && "text-yellow-600",
              message.status === 'Resolved' && "text-green-600"
            )} />
            {message.status}
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Customer Avatar & Name */}
            <div className="flex items-center group/customer">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold mr-3">
                {message.customerName.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover/customer:text-blue-600 transition-colors">
                  {message.customerName}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-0.5">
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  <span className="truncate max-w-[180px]">{message.email}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="ml-2 p-1 rounded hover:bg-gray-100 opacity-0 group-hover/customer:opacity-100 transition-opacity"
                    title="Copy email"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamp & Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                {getTimeAgo(message.timestamp)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {formatDate(message.timestamp)}
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors group/action">
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover/action:text-blue-500" />
              </button>
              <div className="w-px h-6 bg-gray-200" />
              <button 
                onClick={() => onStatusChange(message.id, message.status === 'Resolved' ? 'New' : 'Resolved')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  message.status === 'Resolved'
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                )}
              >
                {message.status === 'Resolved' ? 'Reopen' : 'Quick Resolve'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500 flex items-center">
              <span className="font-mono">ID: {message.id}</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Received
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-2">Click for details</span>
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform duration-300",
              isHovered && "translate-x-1"
            )} />
          </div>
        </div>
      </div>

      {/* Quick Status Toggle - Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl overflow-hidden">
        <div className={cn(
          "h-full transition-all duration-500",
          message.status === 'New' && "bg-gray-300",
          message.status === 'In Progress' && "bg-linear-to-r from-yellow-400 to-yellow-500",
          message.status === 'Resolved' && "bg-linear-to-r from-green-400 to-green-500"
        )} />
      </div>

      {/* Hover Effects */}
      <div className={cn(
        "absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300",
        "bg-linear-to-r from-transparent via-white/50 to-transparent",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
}