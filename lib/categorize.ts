import { Category, Priority } from "./types";

export function categorizeMessage(message: string): {
  category: Category;
  priority: Priority;
} {
  const lowerMessage = message.toLowerCase();

  // Default values
  let category: Category = "General";
  let priority: Priority = "Medium";

  // Category detection
  if (
    lowerMessage.includes("crash") ||
    lowerMessage.includes("error") ||
    lowerMessage.includes("bug") ||
    lowerMessage.includes("not working") ||
    lowerMessage.includes("broken") ||
    lowerMessage.includes("fail") ||
    lowerMessage.includes("issue") ||
    lowerMessage.includes("problem")
  ) {
    category = "Bug";
  } else if (
    lowerMessage.includes("invoice") ||
    lowerMessage.includes("charge") ||
    lowerMessage.includes("bill") ||
    lowerMessage.includes("payment") ||
    lowerMessage.includes("price") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("refund") ||
    lowerMessage.includes("deduct")
  ) {
    category = "Billing";
  } else if (
    lowerMessage.includes("feature") ||
    lowerMessage.includes("add") ||
    lowerMessage.includes("request") ||
    lowerMessage.includes("suggest") ||
    lowerMessage.includes("would like") ||
    lowerMessage.includes("could you") ||
    lowerMessage.includes("wish") ||
    lowerMessage.includes("integration")
  ) {
    category = "Feature Request";
  }

  // Priority detection
  if (
    lowerMessage.includes("urgent") ||
    lowerMessage.includes("asap") ||
    lowerMessage.includes("emergency") ||
    lowerMessage.includes("immediately") ||
    lowerMessage.includes("critical") ||
    lowerMessage.includes("right away")
  ) {
    priority = "High";
  } else if (
    lowerMessage.includes("when you have time") ||
    lowerMessage.includes("no rush") ||
    lowerMessage.includes("low priority") ||
    lowerMessage.includes("whenever") ||
    lowerMessage.includes("suggestion") ||
    lowerMessage.includes("nice to have")
  ) {
    priority = "Low";
  }

  // Priority adjustments based on category
  if (category === "Bug") {
    priority = "High";
  } else if (category === "Billing") {
    priority = "High";
  } else if (category === "Feature Request") {
    priority = "Low";
  }

  return { category, priority };
}

// NEW: AI-powered categorization with Ollama
export async function categorizeWithAI(message: string): Promise<{
  category: Category;
  priority: Priority;
}> {
  try {
    // IMPORTANT: Use absolute URL when calling from server-side
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // const response = await fetch(`${baseUrl}/api/ollama`, { //local ollama model
    // const response = await fetch(`${baseUrl}/api/openrouter`, { //openrouter ai
    const response = await fetch(`${baseUrl}/api/cerebras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();

    if (response.status === 429) {
      console.warn("Rate limited:", result.message);
      // Show user-friendly message
      alert(`Rate limit reached: ${result.message}. Using keyword fallback.`);
      return categorizeMessage(message); // Fallback to keywords
    }

    // console.log("AI categorization result:", result);
    return {
      category: result.category || "General",
      priority: result.priority || "Medium",
    };
  } catch (error) {
    console.warn("AI categorization failed, falling back to keywords:", error);
    // Fall back to keyword-based categorization
    return categorizeMessage(message);
  }
}

// Hybrid approach: Use keywords for speed, AI for edge cases
export async function smartCategorize(message: string): Promise<{
  category: Category;
  priority: Priority;
}> {
  // First, try keyword-based (fast)
  const keywordResult = categorizeMessage(message);

  // If keyword categorization is confident (not General), use it
  if (
    keywordResult.category !== "General" &&
    (keywordResult.category === "Bug" || keywordResult.category === "Billing")
  ) {
    return keywordResult;
  }

  //   console.log("Using AI categorization for message:", message);

  // Otherwise, use AI for better accuracy
  return await categorizeWithAI(message);
  //   return keywordResult;
}
