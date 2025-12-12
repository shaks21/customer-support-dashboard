import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 1. Build the messages array
    const messages = [
      {
        role: "system",
        content: `You are a support triage assistant. Return JSON with "category" and "priority".
    Category: "Bug" (crashes, errors), "Billing" (payments, invoices), "Feature Request" (new features), "General".
    Priority: "High" (urgent, blocking), "Medium", "Low" (feature requests).
    Format: {"category": "...", "priority": "..."}`,
      },
      {
        role: "user",
        content: `Categorize this message: "${message}"`,
      },
    ];

    const model = "amazon/nova-2-lite-v1:free";

    // 2. Call the OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://customer-support-dashboard-eta.vercel.app/",
          "X-Title": "Customer Support Dashboard",
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          response_format: { type: "json_object" },
          temperature: 0.1,
          max_tokens: 200,
        }),
      }
    );

    // 3. Handle rate limits specifically
    if (response.status === 429) {
      const errorData = await response.json().catch(() => ({}));
      console.warn("OpenRouter rate limit hit:", errorData);
      
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: errorData?.error?.message || "Free daily limit reached",
          category: "General",
          priority: "Medium",
          rateLimitInfo: {
            limit: response.headers.get("X-RateLimit-Limit"),
            remaining: response.headers.get("X-RateLimit-Remaining"),
            reset: response.headers.get("X-RateLimit-Reset"),
          }
        },
        { status: 429 }
      );
    }

    // 4. Handle other API errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // 5. Parse the response
    let parsed;
    try {
      const jsonString = data.choices[0]?.message?.content;
      if (!jsonString) {
        throw new Error("No content in response");
      }
      
      // Extract JSON if wrapped in text
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(jsonString);
      }
    } catch (error:any) {
      console.error("Failed to parse AI JSON response:", {
        content: data.choices[0]?.message?.content,
        error: error.message
      });
      
      // Try regex fallback
      const responseText = data.choices[0]?.message?.content || "";
      const categoryMatch = responseText.match(/["']?category["']?\s*:\s*["']([^"']+)["']/i);
      const priorityMatch = responseText.match(/["']?priority["']?\s*:\s*["']([^"']+)["']/i);
      
      parsed = {
        category: categoryMatch ? categoryMatch[1] : "General",
        priority: priorityMatch ? priorityMatch[1] : "Medium"
      };
    }

    // 6. Validate and normalize
    const validCategories = ["Bug", "Billing", "Feature Request", "General"];
    const validPriorities = ["High", "Medium", "Low"];
    
    const result = {
      category: validCategories.includes(parsed.category)
        ? parsed.category
        : "General",
      priority: validPriorities.includes(parsed.priority)
        ? parsed.priority
        : "Medium",
    };

    return NextResponse.json(result);
  } catch (error:any) {
    console.error("OpenRouter categorization error:", error);
    return NextResponse.json(
      {
        error: "Failed to categorize message",
        message: error.message,
        category: "General",
        priority: "Medium",
      },
      { status: 500 }
    );
  }
}