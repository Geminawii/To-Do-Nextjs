"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "bot";
  content: string;
};

const STORAGE_KEY = "chatbot_messages";

async function sendMessage(messages: Message[]): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error("API error");
  }

  const data = await response.json();
  return data.reply;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [minimized, setMinimized] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  function clearChat() {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const mutation = useMutation<string, Error, Message[]>({
    mutationFn: sendMessage,
    onSuccess: (reply) => {
      const botMsg: Message = { role: "bot", content: reply };
      setMessages((m) => [...m, botMsg]);
    },
    onError: () => {
      const errMsg: Message = {
        role: "bot",
        content: "Sorry, something went wrong. Please try again later.",
      };
      setMessages((m) => [...m, errMsg]);
    },
  });

  function handleSend() {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    mutation.mutate([...messages, userMsg]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-white border border-orange-300 shadow-lg flex items-center justify-center cursor-pointer"
        aria-label="Open chat"
      >
        <span className="text-orange-800 font-bold text-lg">j</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 max-w-full bg-white border border-orange-300 rounded-lg shadow-lg flex flex-col transition-all duration-300 max-h-[480px]">
      <header className="bg-orange-800 text-white px-4 py-2 rounded-t-lg font-semibold flex justify-between items-center">
        justaskeet!
        <div className="flex gap-2">
          <button
            onClick={clearChat}
            className="text-xs bg-white text-orange-800 px-2 py-1 rounded hover:bg-orange-100"
            aria-label="Clear chat"
          >
            Clear Chat
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="ml-2 text-white font-bold text-lg leading-none"
            aria-label="Minimize chat"
          >
            ×
          </button>
        </div>
      </header>
      <main className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded px-3 py-2 max-w-[80%] ${
              msg.role === "user"
                ? "bg-orange-200 text-orange-900 self-end"
                : "bg-orange-50 text-orange-800 self-start"
            }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}

        {mutation.isPending && (
          <div className="text-orange-600 italic text-sm">...</div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <footer className="p-3 border-t border-orange-300 flex gap-2">
        <textarea
          className="flex-1 resize-none border border-orange-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={mutation.isPending}
        />
        <button
          onClick={handleSend}
          className="bg-orange-800 text-white px-4 rounded disabled:opacity-50"
          disabled={mutation.isPending || !input.trim()}
        >
          Send
        </button>
      </footer>
    </div>
  );
}
