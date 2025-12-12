export async function checkOllamaStatus(): Promise<{
  isRunning: boolean;
  models: string[];
  error?: string;
}> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        isRunning: true,
        models: data.models?.map((m: any) => m.name) || []
      };
    }
    
    return { isRunning: false, models: [], error: 'Ollama not responding' };
  } catch (error) {
    return { 
      isRunning: false, 
      models: [], 
      error: 'Cannot connect to Ollama. Is it running?' 
    };
  }
}