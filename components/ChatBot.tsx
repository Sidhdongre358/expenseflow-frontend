import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAppSelector } from '../store/hooks';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const { items: expenses } = useAppSelector((state) => state.expenses);
  const { items: budgets } = useAppSelector((state) => state.budgets);
  const { profile } = useAppSelector((state) => state.user);
  const { currency } = useAppSelector((state) => state.ui);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Gemini Client
  const [chatSession, setChatSession] = useState<any>(null);

  // Initialize Chat Session with Data Context
  useEffect(() => {
    if (isOpen && !chatSession) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Prepare context data
        const contextData = {
            currentUser: profile?.name,
            currentDate: new Date().toLocaleDateString(),
            currency: currency,
            expenses: expenses.map(e => ({
                date: e.date,
                merchant: e.merchant,
                category: e.category,
                amount: e.amount,
                status: e.status
            })),
            budgets: budgets.map(b => ({
                category: b.category,
                limit: b.total,
                period: b.period
            }))
        };

        const systemInstruction = `
            You are ExpenseFlow AI, a helpful financial assistant embedded in an expense management dashboard.
            
            Here is the live context of the user's data:
            ${JSON.stringify(contextData)}

            Your Goal: Answer questions about the user's spending, budgets, and financial health based strictly on the data provided above.
            
            Rules:
            1. Be concise and friendly.
            2. Always format money using the currency code provided (${currency}).
            3. If the user asks about "recent" expenses, look at the dates provided.
            4. If the user asks for advice, give simple financial tips based on their spending habits visible in the data.
            5. Do not make up data. If you don't see an expense, say so.
        `;

        const chat = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: systemInstruction,
          }
        });

        setChatSession(chat);
        
        // Initial Greeting
        if (messages.length === 0) {
            setMessages([{
                id: 'welcome',
                role: 'model',
                text: `Hi ${profile?.name || 'there'}! I'm your ExpenseFlow assistant. Ask me about your spending, budgets, or recent transactions.`
            }]);
        }
      } catch (error) {
        console.error("Failed to init AI", error);
      }
    }
  }, [isOpen, expenses, budgets, profile, currency]); // Re-init if data changes massively? Maybe just keep session open.

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatSession) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: input });
      const responseText = result.text; 
      
      const botMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: responseText || "I'm having trouble processing that right now."
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: "Sorry, I encountered an error connecting to the AI service." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-[#1c2431] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200 origin-bottom-right">
          {/* Header */}
          <div className="p-4 bg-primary text-white flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2">
               <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <span className="material-symbols-outlined text-xl">smart_toy</span>
               </div>
               <div>
                 <h3 className="font-bold text-sm">AI Assistant</h3>
                 <p className="text-[10px] opacity-80 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Online
                 </p>
               </div>
             </div>
             <button 
               onClick={() => setIsOpen(false)}
               className="p-1 hover:bg-white/20 rounded-full transition-colors"
             >
               <span className="material-symbols-outlined text-lg">close</span>
             </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-transparent custom-scrollbar">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#1c2431] border-t border-gray-200 dark:border-gray-700 shrink-0">
             <div className="relative flex items-center">
               <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Ask about your expenses..."
                 className="w-full pl-4 pr-12 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 dark:text-white placeholder-gray-500"
                 disabled={isLoading}
               />
               <button 
                 type="submit"
                 disabled={!input.trim() || isLoading}
                 className="absolute right-2 p-1.5 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:bg-gray-400 transition-colors flex items-center justify-center"
               >
                 <span className="material-symbols-outlined text-lg">send</span>
               </button>
             </div>
             <p className="text-[10px] text-center text-gray-400 mt-2">Powered by Gemini 1.5 Pro</p>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-gray-700 rotate-90' : 'bg-primary'
        }`}
      >
        <span className="material-symbols-outlined text-white text-3xl transition-transform duration-300 group-hover:rotate-12">
            {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>
    </div>
  );
};