import React from "react";
import { Bot, User } from "lucide-react";

const AiMessage = ({ role, text }) => {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-indigo-600" : "bg-emerald-600/20"
          }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div
        className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm whitespace-pre-wrap ${isUser
            ? "bg-indigo-600 text-white"
            : "bg-white/5 border border-white/10 text-slate-200"
          }`}
      >
        {text}
      </div>
    </div>
  );
};

export default AiMessage;
