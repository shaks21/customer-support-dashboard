import { NextRequest, NextResponse } from "next/server";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Instantiate the Cerebras client using your API key from environment variables[citation:4]
    const cerebras = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY,
    });

    // 2. Define your messages using the array format required by the Chat Completions API[citation:4]
    const messages = [
      {
        role: "system",
        content: `You are a support triage assistant. Return JSON with "category" and "priority". 
        Category: "Bug" (crashes, errors), "Billing" (payments, invoices), "Feature Request" (new features), "General". 
        Priority: "High" (urgent, blocking), "Medium", "Low" (feature requests). 
        Return only the JSON object: {"category": "...", "priority": "..."}`,
      },
      {
        role: "user",
        content: `Categorize this support message: "${message}"`,
      },
    ] as any;

    // 3. Make the API call[citation:4]
    const completion = await cerebras.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b", // You can choose other supported models[citation:1]
      temperature: 0.1,
      max_completion_tokens: 150,
      stream: false,
    }) as any;

    // 4. Parse and validate the response (content is a JSON string)
    const content = completion.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse Cerebras JSON response:", content);
      parsed = { category: "General", priority: "Medium" };
    }

    const validCategories = ["Bug", "Billing", "Feature Request", "General"];
    const validPriorities = ["High", "Medium", "Low"];

    const result = {
      category: validCategories.includes(parsed.category) ? parsed.category : "General",
      priority: validPriorities.includes(parsed.priority) ? parsed.priority : "Medium",
    };

    return NextResponse.json(result);

  } catch (error:any) {
    // 5. Handle errors (e.g., authentication, rate limits)[citation:2]
    console.error("Cerebras API error:", error);
    let status = 500;
    let errorMessage = "Failed to categorize message";

    // Check for specific error types from the SDK[citation:2]
    if (error.status === 429) {
      status = 429;
      errorMessage = "Rate limit exceeded";
    } else if (error.status === 401) {
      status = 401;
      errorMessage = "Invalid API key";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        category: "General",
        priority: "Medium",
      },
      { status: status }
    );
  }
}