import React, { useEffect, useState, useRef } from "react";
import { chatService } from "../services/chatService";
import { ChatMessage } from "../types";
import { Send, Sparkles, BrainCircuit, RefreshCw, MessageSquare, Terminal } from "lucide-react";
import { motion } from "framer-motion";

// Custom light-weight markdown formatting helper
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split("\n");
  
  return (
    <div className="space-y-2.5">
      {lines.map((line, idx) => {
        // Render bullet points
        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          const cleanText = line.trim().replace(/^[-*]\s+/, "");
          return (
            <ul key={idx} className="list-disc pl-4 space-y-1">
              <li className="leading-relaxed">
                {parseInlineMarkdown(cleanText)}
              </li>
            </ul>
          );
        }
        
        // Render numbered lists
        if (/^\d+\.\s+/.test(line.trim())) {
          const cleanText = line.trim().replace(/^\d+\.\s+/, "");
          const num = line.trim().match(/^\d+/)?.[0];
          return (
            <ol key={idx} className="list-decimal pl-4 space-y-1">
              <li className="leading-relaxed">
                <span className="font-bold mr-1">{num}.</span>
                {parseInlineMarkdown(cleanText)}
              </li>
            </ol>
          );
        }

        // Standard Paragraphs
        return (
          <p key={idx} className="leading-relaxed last:mb-0">
            {parseInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
};

// Parse inline styles: bold (**text**), code (`code`)
function parseInlineMarkdown(text: string) {
  if (!text) return "";
  
  const boldRegex = /\*\*(.*?)\*\*/g;
  const codeRegex = /`(.*?)`/g;
  
  let parts: any[] = [text];
  
  // Parse bold
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const split = part.split(boldRegex);
    return split.map((str, idx) => (idx % 2 === 1 ? <strong key={idx} className="font-extrabold text-violet-600 dark:text-violet-400">{str}</strong> : str));
  });

  // Parse inline code
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const split = part.split(codeRegex);
    return split.map((str, idx) => (idx % 2 === 1 ? <code key={idx} className="bg-secondary px-1.5 py-0.5 rounded font-mono text-xs text-rose-500 font-semibold">{str}</code> : str));
  });

  return parts;
}

export const AIChatMentor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await chatService.getHistory();
      if (history.length > 0) {
        setMessages(history);
      } else {
        // If history is empty, create the default welcome message
        const welcome = {
          id: "welcome-msg",
          sender: "ai" as const,
          content: "Hello! I am your AI Career Mentor. I've audited your target role, course objectives, and roadmap milestones.\n\nHow can I help you accelerate your growth today? You can ask me to write a custom study schedule, outline system design concepts, or prepare for mock interviews.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([welcome]);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: "msg-" + Math.random().toString(36).substring(2, 9),
      sender: "user",
      content: textToSend,
      timestamp: time
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await chatService.sendMessage(textToSend);
      setMessages((prev) => [...prev, reply]);
    } catch {
      // Handle error
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const suggestions = [
    "Prepare for Google Technical Mock",
    "Audit my System Design skill gaps",
    "Explain React 19 optimistic hook updates",
    "Write study calendar for Month 2"
  ];

  return (
    <div className="flex flex-col border border-border/60 glass rounded-3xl h-[calc(100vh-12rem)] min-h-[450px] shadow-sm relative overflow-hidden">
      {/* Mentor Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between shrink-0 bg-white/40 dark:bg-[#0f131a]/40 backdrop-blur-md">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-foreground">AI Career Mentor</h3>
            <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Gemini Engine Active</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const defaults = [chatService.getHistory()[0]];
            setMessages(defaults);
          }}
          className="p-1.5 rounded-lg border border-border/40 hover:bg-secondary/40 text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm text-left shadow-sm ${
                msg.sender === "user"
                  ? "bg-violet-600 text-white rounded-br-none"
                  : "glass-premium border border-border/80 text-foreground rounded-bl-none"
              }`}
            >
              <MarkdownContent content={msg.content} />
              <div className={`text-[9px] mt-2 text-right font-semibold ${msg.sender === "user" ? "text-violet-200" : "text-muted-foreground"}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-premium border border-border/80 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Suggestions & Input */}
      <div className="p-4 border-t border-border/40 shrink-0 bg-white/40 dark:bg-[#0f131a]/40 backdrop-blur-md flex flex-col gap-4">
        {/* Suggested Prompts */}
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-thin">
          {suggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => handleSendMessage(sug)}
              disabled={isTyping}
              className="px-3.5 py-1.5 rounded-xl border border-border/60 hover:border-violet-500/20 hover:bg-secondary/40 text-[10px] font-bold text-muted-foreground hover:text-foreground shrink-0 whitespace-nowrap transition-all"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask AI Mentor anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-background border border-border/85 rounded-2xl px-4 py-3.5 text-xs sm:text-sm outline-none focus:border-violet-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="px-5 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
