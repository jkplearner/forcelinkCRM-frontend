import React from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';

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
        className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm ${isUser
          ? "bg-indigo-600 text-white"
          : "bg-white/5 border border-white/10 text-slate-200"
          }`}
      >
        {isUser ? (
          text
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-indigo-300" {...props} />,
                a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                code: ({ node, ...props }) => <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-300" {...props} />,
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMessage;
