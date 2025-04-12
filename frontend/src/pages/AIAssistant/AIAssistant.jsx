import React, { useState } from "react";

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      // Dummy response - replace with your actual AI backend API
      const res = await fetch("https://api.example.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      setResponse(data.answer || "No response received.");
    } catch (err) {
      setResponse("Error talking to the assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-cyan-400">AI Assistant</h1>

        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-700 bg-gray-800 text-cyan-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <button
            onClick={handleAsk}
            className="bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition"
          >
            Ask
          </button>
        </div>

        <div className="min-h-[100px] p-4 bg-gray-800 text-cyan-400 rounded-xl">
          {loading ? (
            <p className="animate-pulse">Thinking...</p>
          ) : (
            <p>{response}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
