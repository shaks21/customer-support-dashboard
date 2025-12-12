import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a customer support triage assistant. 
    Analyze this support message and return ONLY valid JSON.

    CRITICAL RULES:
    1. Output must be valid JSON with "category" and "priority" keys
    2. Category must be exactly one of: "Bug", "Billing", "Feature Request", "General"
    3. Priority must be exactly one of: "High", "Medium", "Low"
    
    Categorization Guidelines:
    - Bug: Software issues, crashes, errors, things not working
    - Billing: Invoices, charges, payments, refunds, pricing
    - Feature Request: Suggestions for new features, "could you add", "wish we had"
    - General: Questions, account help, other inquiries
    
    Priority Guidelines:
    - High: Urgent language, blocked users, critical business impact, Bug/Billing issues
    - Medium: Standard inquiries, clarification questions
    - Low: Feature requests, nice-to-have suggestions
    
    Message to analyze: "${message}"
    
    Return JSON format: {"category": "General", "priority": "Medium"}`;

    // Call Ollama's local API
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'phi3.5', // Change to model name
        prompt: prompt,
        stream: false,
        format: 'json', // Important: requests JSON format
        options: {
          temperature: 0.1, // Low temperature for consistent output
          seed: 42, // Consistent results
          num_predict: 100 // limit response length and speed it up
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the response - Ollama returns text in 'response' field
    let parsed;
    try {
      // Try to extract JSON from the response
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(data.response);
      }
    } catch (error) {
      // Fallback: Use regex to extract category and priority
      const categoryMatch = data.response.match(/category.*["']([^"']+)["']/i);
      const priorityMatch = data.response.match(/priority.*["']([^"']+)["']/i);
      
      parsed = {
        category: categoryMatch ? categoryMatch[1] : 'General',
        priority: priorityMatch ? priorityMatch[1] : 'Medium'
      };
    }

    // Validate and normalize the response
    const validCategories = ['Bug', 'Billing', 'Feature Request', 'General'];
    const validPriorities = ['High', 'Medium', 'Low'];

    const result = {
      category: validCategories.includes(parsed.category) 
        ? parsed.category 
        : 'General',
      priority: validPriorities.includes(parsed.priority)
        ? parsed.priority
        : 'Medium'
    };

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Ollama categorization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to categorize message',
        category: 'General',
        priority: 'Medium'
      },
      { status: 500 }
    );
  }
}