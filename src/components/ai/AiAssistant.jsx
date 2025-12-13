import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles } from "lucide-react";
import AiMessage from "./AiMessage";
import { generateGeminiResponse } from "../../utils/geminiClient";
import { constructSystemPrompt } from "./aiPromptBuilder";

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text:
        "Hello! I can help with CRM and business-related questions. " +
        "I do not automatically read your CRM data. " +
        "Please share the relevant details, and I will help analyze them."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inFlight = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || inFlight.current) return;

    const userText = input.trim();
    setInput("");

    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setLoading(true);
    inFlight.current = true;

    try {
      const systemPrompt = constructSystemPrompt();

      const response = await generateGeminiResponse(
        systemPrompt,
        userText,
        "User provided context only.",
        []
      );

      setMessages(prev => [...prev, { role: "ai", text: response }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text:
            "AI is temporarily unavailable. Please try again in a moment."
        }
      ]);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">

      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
          <Sparkles className="text-emerald-400" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">ForceLink AI - Experimental</h2>
          <p className="text-xs text-slate-400">Business & CRM Assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <AiMessage key={i} role={msg.role} text={msg.text} />
        ))}

        {loading && (
          <div className="text-slate-400 text-sm animate-pulse">
            Thinking…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-white/10">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or describe your CRM details here…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiAssistant;
