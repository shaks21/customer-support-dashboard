//create a component that displays a page with the text "Check AI Integration"

import OllamaStatus from "@/components/OllamaStatus";

export default function CheckAIPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Check AI Integration</h1>
      <p className="text-gray-700">
        This page is for checking the AI integration status.
      </p>
      <div>
        <OllamaStatus />
      </div>
    </div>
  );
}
