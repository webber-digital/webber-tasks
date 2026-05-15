import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { handleAiCommand } from '../services/ai';
import ReactMarkdown from 'react-markdown';

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { messages, addMessage, currentView, tasks, notes, events } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMessage });
    setIsTyping(true);

    try {
      const response = await handleAiCommand(userMessage, { tasks, notes, events, currentView });
      addMessage({ role: 'model', content: response });
    } catch (error: any) {
      console.error('AI Error:', error);
      addMessage({ role: 'model', content: error?.message || "Sorry, I encountered an error processing your request." });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105 active:scale-95 z-50 flex items-center justify-center group"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-6 w-6" />
          <span className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      <div 
        className={cn(
          "fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-[60] transform transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2 text-indigo-700">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-semibold">Webber.Tasks AI</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              {msg.role === 'model' && (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-indigo-600" />
                </div>
              )}
              
              <div 
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm",
                  msg.role === 'user' 
                    ? "bg-indigo-600 text-white rounded-tr-sm" 
                    : "bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-sm prose prose-sm prose-p:my-1 prose-a:text-indigo-600"
                )}
              >
                {msg.role === 'model' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
               <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-white rounded-b-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or create a task..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-sm focus:outline-none transition-shadow text-slate-900"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-1.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
