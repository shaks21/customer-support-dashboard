import { SupportMessage } from "./types";
import { smartCategorize } from "./categorize";
import { categorizeMessage } from "./categorize"; 

export const rawMessages = [    
    {
      id: "1",
      customerName: "John Smith",
      email: "john@example.com",
      message: "My invoice is wrong for last month – I was charged twice.",
      timestamp: new Date("2024-01-15T09:30:00"),
    },
    {
      id: "2",
      customerName: "Sarah Johnson",
      email: "sarah@company.com",
      message:
        "The app keeps crashing when I try to upload a large PDF file. This is urgent!",
      timestamp: new Date("2024-01-15T10:15:00"),
    },
    {
      id: "3",
      customerName: "Alex Chen",
      email: "alex@startup.io",
      message:
        "Can you add support for dark mode in the next release? Would love to have this feature.",
      timestamp: new Date("2024-01-15T11:00:00"),
    },
    {
      id: "4",
      customerName: "Maria Garcia",
      email: "maria@business.com",
      message:
        "I need help with my account settings. Not sure how to update my profile picture.",
      timestamp: new Date("2024-01-15T11:45:00"),
    },
    {
      id: "5",
      customerName: "Robert Wilson",
      email: "robert@tech.co",
      message:
        "Payment failed but money was deducted from my account. Please check ASAP.",
      timestamp: new Date("2024-01-15T12:30:00"),
    },
    {
      id: "6",
      customerName: "Emma Davis",
      email: "emma@design.com",
      message:
        'Export function is not working. Getting "server error" message every time.',
      timestamp: new Date("2024-01-15T13:20:00"),
    },
    {
      id: "7",
      customerName: "David Miller",
      email: "david@enterprise.net",
      message:
        "Would be great if we could schedule reports to be sent automatically.",
      timestamp: new Date("2024-01-15T14:10:00"),
    },
    {
      id: "8",
      customerName: "Lisa Wang",
      email: "lisa@consulting.com",
      message: "Question about your pricing plans. Can we get a custom quote?",
      timestamp: new Date("2024-01-15T15:00:00"),
    },
    {
      id: "9",
      customerName: "Tom Baker",
      email: "tom@shop.com",
      message:
        "Login page is broken on mobile Safari. Can't access my account.",
      timestamp: new Date("2024-01-15T15:45:00"),
    },
    {
      id: "10",
      customerName: "Sophia Lee",
      email: "sophia@creative.org",
      message:
        "Monthly subscription renewed but I was charged the wrong amount.",
      timestamp: new Date("2024-01-15T16:30:00"),
    },
    {
      id: "11",
      customerName: "James Taylor",
      email: "james@studio.com",
      message: "Suggestion: Add keyboard shortcuts for power users.",
      timestamp: new Date("2024-01-15T17:15:00"),
    },
    {
      id: "12",
      customerName: "Olivia Brown",
      email: "olivia@healthcare.net",
      message: "How do I reset my password? Forgot my login credentials.",
      timestamp: new Date("2024-01-15T18:00:00"),
    },
    {
      id: "13",
      customerName: "Michael Clark",
      email: "michael@finance.com",
      message:
        "Data sync is failing between devices. Last sync was 2 days ago.",
      timestamp: new Date("2024-01-15T19:30:00"),
    },
    {
      id: "14",
      customerName: "Jessica White",
      email: "jessica@edu.edu",
      message: "Received duplicate invoices for November and December.",
      timestamp: new Date("2024-01-15T20:15:00"),
    },
    {
      id: "15",
      customerName: "Daniel Harris",
      email: "daniel@gaming.com",
      message: "Would love to see integration with Slack for notifications.",
      timestamp: new Date("2024-01-15T21:00:00"),
    },
    {
      id: "16",
      customerName: "Rachel Kim",
      email: "rachel@marketing.com",
      message:
        "The analytics dashboard is loading very slowly today. Takes over 30 seconds.",
      timestamp: new Date("2024-01-15T22:30:00"),
    },
    {
      id: "17",
      customerName: "Kevin Patel",
      email: "kevin@retail.com",
      message:
        "Can we get an annual billing option with discount? Considering upgrading our plan.",
      timestamp: new Date("2024-01-15T23:15:00"),
    },
    {
      id: "18",
      customerName: "Amanda Scott",
      email: "amanda@nonprofit.org",
      message: "Request: Add two-factor authentication for enhanced security.",
      timestamp: new Date("2024-01-16T08:00:00"),
    },
  ];

// 1. AI Categorization (Slow, async, for AI mode)
  export async function createAIMessages(): Promise<SupportMessage[]> {  
  const processedMessages = await Promise.all(    
    rawMessages.map(async (msg) => {
      const { category, priority } = await smartCategorize(msg.message);

      return {
        ...msg,
        category,
        priority,
        status: "New" as const,
      };
    })
  );
//   console.log("rawMessages:", rawMessages);
//   console.log("processedMessages:", processedMessages);
  return processedMessages;
}

// 2. Keyword Categorization (Fast, synchronous, for keyword mode)
export function createKeywordMessages(): SupportMessage[] {
  return rawMessages.map((msg) => {
    const { category, priority } = categorizeMessage(msg.message); // Sync function
    return {
      ...msg,
      category,
      priority,
      status: "New" as const,
    };
  });
}