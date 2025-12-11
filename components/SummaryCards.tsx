"use client";

import { SupportMessage } from "@/lib/types";
import {
  MessageSquare,
  AlertTriangle,
  CreditCard,
  Lightbulb,
  Bug,
  Clock,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SummaryCardsProps {
  messages: SupportMessage[];
}

export default function SummaryCards({ messages }: SummaryCardsProps) {
  // Calculate statistics
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

  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  // Calculate resolution rate
  const resolutionRate = statusCounts["Resolved"]
    ? Math.round((statusCounts["Resolved"] / messages.length) * 100)
    : 0;

  // Calculate average response time (simulated)
  const avgResponseTime = 4.2; // hours

  const stats = [
    // Overview stats - compact row
    {
      title: "Total Messages",
      value: messages.length,
      icon: MessageSquare,
      trend: "+12%",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-100",
    },
    {
      title: "Resolution Rate",
      value: `${resolutionRate}%`,
      icon: TrendingUp,
      trend: "+8%",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-100",
    },
    {
      title: "Avg Response Time",
      value: `${avgResponseTime}h`,
      icon: Clock,
      trend: "-1.2h",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-100",
    },

    // Priority breakdown - compact badges
    {
      title: "High Priority",
      value: priorityCounts["High"] || 0,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-100",
      isPriority: true,
    },
    {
      title: "Medium",
      value: priorityCounts["Medium"] || 0,
      icon: Zap,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-100",
      isPriority: true,
    },
    {
      title: "Low",
      value: priorityCounts["Low"] || 0,
      icon: Clock,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-100",
      isPriority: true,
    },

    // Category breakdown - with mini progress bars
    {
      title: "Bugs",
      value: categoryCounts["Bug"] || 0,
      icon: Bug,
      percentage: Math.round(
        ((categoryCounts["Bug"] || 0) / messages.length) * 100
      ),
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-100",
    },
    {
      title: "Billing",
      value: categoryCounts["Billing"] || 0,
      icon: CreditCard,
      percentage: Math.round(
        ((categoryCounts["Billing"] || 0) / messages.length) * 100
      ),
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-100",
    },
    {
      title: "Features",
      value: categoryCounts["Feature Request"] || 0,
      icon: Lightbulb,
      percentage: Math.round(
        ((categoryCounts["Feature Request"] || 0) / messages.length) * 100
      ),
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-100",
    },
    {
      title: "General",
      value: categoryCounts["General"] || 0,
      icon: HelpCircle,
      percentage: Math.round(
        ((categoryCounts["General"] || 0) / messages.length) * 100
      ),
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-100",
    },

    // Status breakdown - with progress indicators
    {
      title: "Resolved",
      value: statusCounts["Resolved"] || 0,
      icon: CheckCircle,
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-100",
      isStatus: true,
    },
    {
      title: "In Progress",
      value: statusCounts["In Progress"] || 0,
      icon: BarChart3,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-100",
      isStatus: true,
    },
    {
      title: "New",
      value: statusCounts["New"] || 0,
      icon: MessageSquare,
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-100",
      isStatus: true,
    },
  ];

  // Group stats for different sections
  const overviewStats = stats.slice(0, 3);
  const priorityStats = stats.slice(3, 6);
  const categoryStats = stats.slice(6, 10);
  const statusStats = stats.slice(10);

  return (
    <div className="space-y-6 mb-8">
      {/* Overview Section - Compact and Modern */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
          Dashboard Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {overviewStats.map((stat) => (
            <div
              key={stat.title}
              className={cn(
                "rounded-xl border p-4 transition-all hover:scale-[1.02] hover:shadow-md",
                stat.bgColor,
                stat.borderColor
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={cn("p-2 rounded-lg mr-3", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5", stat.textColor)} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </span>
                </div>
                {stat.trend && (
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      stat.trend.startsWith("+")
                        ? "bg-green-100 text-green-700"
                        : stat.trend.startsWith("-")
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="flex items-baseline">
                <span className={cn("text-2xl font-bold", stat.textColor)}>
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    
      {/* View Summary Toggle - Modern */}
      <div className="mb-6">
        <button
          onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
          className={cn(
            "group w-full flex items-center justify-between px-5 py-4",
            "bg-gradient-to-r from-gray-50 to-white rounded-xl border",
            "hover:shadow-md transition-all duration-200",
            "hover:border-gray-300",
            !isSummaryCollapsed && "border-blue-200 bg-blue-50/30"
          )}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                "transition-all duration-200",
                !isSummaryCollapsed
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
              )}
            >
              {!isSummaryCollapsed ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">
                {!isSummaryCollapsed ? "Hide Summary" : "View Summary"}
              </h3>
              <p className="text-sm text-gray-500">
                {!isSummaryCollapsed
                  ? "Click to collapse detailed statistics"
                  : "Click to expand priority, category, and status breakdowns"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={cn(
                "text-sm font-medium px-3 py-1 rounded-full",
                !isSummaryCollapsed
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
              )}
            >
              {!isSummaryCollapsed ? "Expanded" : "Collapsed"}
            </span>
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border",
                !isSummaryCollapsed
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-gray-200 bg-white text-gray-400 group-hover:text-gray-600"
              )}
            >
              {!isSummaryCollapsed ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Priority & Category Section - Side by Side */}
      {!isSummaryCollapsed && (
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Section */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Priority Breakdown
              </h3>
              <div className="space-y-3">
                {priorityStats.map((stat) => (
                  <div
                    key={stat.title}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center mr-3",
                          stat.bgColor
                        )}
                      >
                        <stat.icon className={cn("w-5 h-5", stat.textColor)} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {stat.title}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={cn("text-xl font-bold mr-2", stat.textColor)}
                      >
                        {stat.value}
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            stat.bgColor
                              .replace("bg-", "bg-")
                              .replace("-50", "-500")
                          )}
                          style={{
                            width: `${
                              ((stat.value as number) / messages.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Section */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Category Distribution
              </h3>
              <div className="space-y-3">
                {categoryStats.map((stat) => (
                  <div key={stat.title} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center mr-3",
                            stat.bgColor
                          )}
                        >
                          <stat.icon
                            className={cn("w-4 h-4", stat.textColor)}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {stat.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={cn("text-sm font-bold", stat.textColor)}
                        >
                          {stat.value}
                        </span>
                        <span className="text-xs text-gray-500">
                          {stat.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "absolute h-2 rounded-full",
                          stat.bgColor
                            .replace("bg-", "bg-")
                            .replace("-50", "-500")
                        )}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Section - Compact badges */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ticket Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {statusStats.map((stat) => (
                <div
                  key={stat.title}
                  className={cn(
                    "rounded-xl border p-4 transition-all hover:shadow-md",
                    stat.bgColor,
                    stat.borderColor
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={cn("p-2 rounded-lg mr-3", stat.bgColor)}>
                        <stat.icon className={cn("w-5 h-5", stat.textColor)} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {stat.title}
                      </span>
                    </div>
                    <span className={cn("text-2xl font-bold", stat.textColor)}>
                      {stat.value}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>
                        {Math.round(
                          ((stat.value as number) / messages.length) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={cn(
                          "h-1.5 rounded-full",
                          stat.bgColor
                            .replace("bg-", "bg-")
                            .replace("-50", "-500")
                        )}
                        style={{
                          width: `${
                            ((stat.value as number) / messages.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Bar - Minimalist */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {messages.length}
                </div>
                <div className="text-xs text-blue-600">Total Tickets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-700">
                  {priorityCounts["High"] || 0}
                </div>
                <div className="text-xs text-red-600">Urgent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {statusCounts["Resolved"] || 0}
                </div>
                <div className="text-xs text-green-600">Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {avgResponseTime}h
                </div>
                <div className="text-xs text-purple-600">Avg Response</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
