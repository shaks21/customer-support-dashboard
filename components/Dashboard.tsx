"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  rawMessages,
  createAIMessages,
  createKeywordMessages,
} from "@/lib/data";
import {
  SupportMessage,
  FilterOptions,
  SortField,
  SortDirection,
} from "@/lib/types";
import SummaryCards from "./SummaryCards";
import Filters from "./Filters";
import MessageCard from "./MessageCard";
import AIToggle from "./AIToggle";
import { RefreshCw, Loader2, Zap, Sparkles, Brain, Hash } from "lucide-react";
import SortDropdown from "./SortDropdown"; // Add this import
import { sortMessages } from "@/lib/sortUtils";

export default function Dashboard() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortOptions, setSortOptions] = useState({
    field: "priority" as SortField,
    direction: "desc" as SortDirection,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState<boolean>(true); // Default to true, update in useEffect
  const [isRecategorizing, setIsRecategorizing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize from localStorage on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPreference = localStorage.getItem("categorization-preference");
      const initialUseAI = savedPreference !== "keyword";
      setUseAI(initialUseAI);
      setHasInitialized(true);
    }
  }, []);

  // Load messages when useAI changes AND after initialization
  useEffect(() => {
    if (!hasInitialized) return; // Wait for localStorage initialization

    async function loadMessages() {
      try {
        setLoading(true);

        if (useAI) {
          setIsRecategorizing(true);
          const categorizedMessages = await createAIMessages();
          setMessages(categorizedMessages);
          setIsRecategorizing(false);
        } else {
          const categorizedMessages = createKeywordMessages();
          setMessages(categorizedMessages);
        }

        setError(null);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setError("Failed to load support messages. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [useAI, hasInitialized]);

  // Handle toggle change
  const handleToggleChange = async (useAICategorization: boolean) => {
    // Update state - this will trigger the useEffect above
    setUseAI(useAICategorization);

    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "categorization-preference",
        useAICategorization ? "ai" : "keyword"
      );
    }
  };

  const filteredMessages = useMemo(() => {
    const filtered = messages.filter((message) => {
      if (filters.category && message.category !== filters.category)
        return false;
      if (filters.priority && message.priority !== filters.priority)
        return false;
      if (filters.status && message.status !== filters.status) return false;
      return true;
    });

    return sortMessages(filtered, sortOptions.field, sortOptions.direction);
  }, [messages, filters, sortOptions.field, sortOptions.direction]);

  // Add handler for sort change
  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortOptions({ field, direction });
  };

  const handleStatusChange = (id: string, status: SupportMessage["status"]) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, status } : msg))
    );
  };

  const resetAllStatuses = () => {
    setMessages(
      messages.map((msg) => ({
        ...msg,
        status: "New" as const,
      }))
    );
  };

  const markAllAsResolved = () => {
    setMessages(
      messages.map((msg) => ({
        ...msg,
        status: "Resolved" as const,
      }))
    );
  };

  // Add a check for loading before the initial localStorage setup
  if (!hasInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Initializing Dashboard
          </h2>
          <p className="text-gray-600">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {useAI ? (
              <>
                <Sparkles className="w-5 h-5 inline mr-2 text-purple-500" />
                AI-Powered Categorization in Progress
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 inline mr-2 text-blue-500" />
                Keyword-Based Categorization in Progress
              </>
            )}
          </h2>
          <p className="text-gray-600">
            {useAI
              ? "Analyzing message content with AI to determine category and priority"
              : "Using keyword matching to categorize messages"}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Processing {rawMessages.length} messages •{" "}
            {useAI ? "AI mode" : "Keyword mode"}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section - Subtle Blue */}
      <div className="bg-linear-to-r from-blue-50 to-blue-50/50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Support Triage Dashboard
              </h1>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                {useAI ? "AI-Powered" : "Keyword-Based"}
              </div>
            </div>
            <p className="text-gray-600">
              Review, prioritize, and manage incoming customer support requests
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={resetAllStatuses}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Reset All Status
            </button>
            <button
              onClick={markAllAsResolved}
              className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 shadow-sm"
            >
              Mark All Resolved
            </button>
          </div>
        </div>
        {/* AIToggle */}
        <div className="flex items-center justify-between pt-4 border-t border-blue-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {useAI ? (
              <>
                <Brain className="w-4 h-4 text-purple-500" />
                <span>
                  Using{" "}
                  <span className="font-semibold text-purple-600">
                    AI categorization
                  </span>
                  • More accurate but requires API calls
                </span>
              </>
            ) : (
              <>
                <Hash className="w-4 h-4 text-blue-500" />
                <span>
                  Using{" "}
                  <span className="font-semibold text-blue-600">
                    keyword-based categorization
                  </span>
                  • Faster and works offline
                </span>
              </>
            )}
          </div>

          <AIToggle
            onToggle={handleToggleChange}
            isProcessing={isRecategorizing}
          />
        </div>
      </div>

      {/* Summary Cards Section - White with subtle border */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <div className="w-1.5 h-5 bg-blue-500 rounded-full mr-2"></div>
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500">
            Key metrics and performance indicators
          </p>
        </div>
        <SummaryCards messages={messages} />
      </div>

      {/* Filters Section - Light Gray */}
      <div className="bg-linear-to-r from-gray-50 to-gray-50/50 rounded-2xl border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <div className="w-1.5 h-5 bg-gray-500 rounded-full mr-2"></div>
            Filter & Search
          </h2>
          <p className="text-sm text-gray-500">
            Refine and find specific support requests
          </p>
        </div>
        <Filters
          filters={filters}
          onFilterChange={setFilters}
          messageCount={filteredMessages.length}
          messages={filteredMessages}
        />
      </div>

      {/* Messages Section - Updated with Sorting */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute top-0 right-0 bottom-0 left-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #d1d5db 2%, transparent 0%), 
                            radial-gradient(circle at 75px 75px, #d1d5db 2%, transparent 0%)`,
            backgroundSize: "100px 100px",
          }}
        />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <div className="w-1.5 h-5 bg-purple-500 rounded-full mr-2"></div>
                Support Messages
                <span className="ml-3 text-sm font-normal bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  {filteredMessages.length} message
                  {filteredMessages.length !== 1 ? "s" : ""}
                </span>
              </h2>
              <p className="text-sm text-gray-500">
                Review and take action on individual requests
              </p>
            </div>

            {/* Replace the current sorting text with SortDropdown */}
            <div className="flex items-center gap-4">
              <SortDropdown
                sortField={sortOptions.field}
                sortDirection={sortOptions.direction}
                onSortChange={handleSortChange}
              />

              {/* Optional: Show current sort in a badge */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <span>Sorted by:</span>
                <span className="font-medium capitalize">
                  {sortOptions.field === "date" ? "Date" : sortOptions.field}
                </span>
                <span className="text-gray-400">
                  {sortOptions.direction === "desc" ? "(Desc)" : "(Asc)"}
                </span>
              </div>
            </div>
          </div>

          {filteredMessages.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-xl">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more results
              </p>
              <button
                onClick={() => setFilters({})}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats - Subtle Gradient */}
      <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{filteredMessages.length}</div>
            <div className="text-sm text-gray-300">Total Messages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {filteredMessages.filter((m) => m.status === "Resolved").length}
            </div>
            <div className="text-sm text-gray-300">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {filteredMessages.filter((m) => m.priority === "High").length}
            </div>
            <div className="text-sm text-gray-300">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">
              {
                Object.keys(filters).filter(
                  (k) => filters[k as keyof FilterOptions]
                ).length
              }
            </div>
            <div className="text-sm text-gray-300">Active Filters</div>
          </div>
        </div>
        {/* <div className="text-center text-xs text-gray-400 mt-4">
          Last updated: Just now • Auto-refresh every 5 minutes
        </div> */}
      </div>
    </div>
  );
}
