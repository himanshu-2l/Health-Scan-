/**
 * BP Analysis ChatBot Component
 * Specialized chatbot for analyzing blood pressure data
 */

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send, Bot, User, Loader2, Settings, Heart } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { BPReading, BPStats, getAllBPReadings, calculateBPStats, getBPCategory, detectBPAlerts } from '@/services/bpService';
import { format, parseISO } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface BPChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  readings: BPReading[];
  stats: BPStats | null;
}

const isValidApiKey = (apiKey: string): boolean => {
  return apiKey.length > 20 && apiKey.startsWith('AIza');
};

const detectLanguage = (text: string): 'hindi' | 'english' => {
  const hindiRegex = /[\u0900-\u097F]/;
  const hinglishWords = [
    'ky', 'kya', 'tum', 'aap', 'mein', 'mujhe', 'ko', 'ka', 'ki', 'ke', 'se', 'par', 'hai', 'hain',
    'ho', 'hoga', 'hogi', 'smjha', 'smjhao', 'bataye', 'batao', 'bata', 'bhai', 'yaar', 'acha',
    'theek', 'sahi', 'nahi', 'nah', 'haan', 'han', 'bilkul', 'zaroor', 'kabhi', 'kab', 'kaise',
    'kahan', 'kya', 'kyun', 'kab', 'kitna', 'kitni', 'kabhi', 'aisa', 'aisi', 'aise', 'wahi',
    'woh', 'yeh', 'ye', 'us', 'un', 'in', 'is', 'iss', 'unka', 'unke', 'unki', 'iska', 'iske',
    'iski', 'mera', 'mere', 'meri', 'tera', 'tere', 'teri', 'hamara', 'hamare', 'hamari'
  ];
  
  const lowerText = text.toLowerCase();
  
  if (hindiRegex.test(text)) {
    return 'hindi';
  }
  
  const words = lowerText.split(/\s+/);
  const hinglishCount = words.filter(word => 
    hinglishWords.some(hindiWord => word.includes(hindiWord))
  ).length;
  
  if (words.length > 0 && (hinglishCount / words.length) > 0.2) {
    return 'hindi';
  }
  
  return 'english';
};

export const BPChatBot: React.FC<BPChatBotProps> = ({ isOpen, onClose, readings, stats }) => {
  const { settings } = useSettings();
  const apiKey = settings.geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  
  const getInitialMessage = (): Message => {
    if (readings.length === 0) {
      return {
        id: '1',
        content: 'Hello! I\'m your BP Analysis Assistant. I can help you understand your blood pressure readings, identify patterns, provide insights, and answer questions about your BP data. Start by adding some BP readings to get personalized analysis!',
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    const recentReading = readings[0];
    const category = getBPCategory(recentReading.systolic, recentReading.diastolic);
    const alerts = detectBPAlerts(readings);
    
    return {
      id: '1',
      content: `Hello! I'm your **BP Analysis Assistant**. I can see you have ${readings.length} BP reading${readings.length !== 1 ? 's' : ''} recorded. Your latest reading is **${recentReading.systolic}/${recentReading.diastolic} mmHg** (${category.category}). ${alerts.length > 0 ? `⚠️ I've detected ${alerts.length} alert${alerts.length !== 1 ? 's' : ''} that need attention.` : ''} I can help you understand your BP trends, provide insights, answer questions, and give personalized recommendations. What would you like to know?`,
      sender: 'bot',
      timestamp: new Date()
    };
  };

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      const initialMsg = getInitialMessage();
      setMessages([initialMsg]);
    }
  }, [isOpen, readings.length]);

  const buildBPContext = (): string => {
    if (readings.length === 0) {
      return 'No BP readings available yet.';
    }

    const alerts = detectBPAlerts(readings);
    const recentReadings = readings.slice(0, 10);
    const weeklyStats = calculateBPStats(readings.filter(r => {
      const date = parseISO(r.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }));

    let context = `BLOOD PRESSURE DATA ANALYSIS CONTEXT:

Total Readings: ${readings.length}
Latest Reading: ${readings[0].systolic}/${readings[0].diastolic} mmHg (${format(parseISO(readings[0].timestamp), 'MMM dd, yyyy HH:mm')})
${readings[0].pulse ? `Pulse: ${readings[0].pulse} bpm` : ''}
${readings[0].notes ? `Notes: ${readings[0].notes}` : ''}

Overall Statistics:
- Average BP: ${stats?.averageSystolic || 'N/A'}/${stats?.averageDiastolic || 'N/A'} mmHg
- Range: Systolic ${stats?.minSystolic || 'N/A'}-${stats?.maxSystolic || 'N/A'} | Diastolic ${stats?.minDiastolic || 'N/A'}-${stats?.maxDiastolic || 'N/A'}
- Total Readings: ${stats?.readingCount || 0}

Weekly Statistics (Last 7 days):
- Average BP: ${weeklyStats.averageSystolic}/${weeklyStats.averageDiastolic} mmHg
- Readings: ${weeklyStats.readingCount}

Recent Readings (Last 10):
${recentReadings.map((r, idx) => {
  const date = parseISO(r.timestamp);
  const cat = getBPCategory(r.systolic, r.diastolic);
  return `${idx + 1}. ${format(date, 'MMM dd, HH:mm')} - ${r.systolic}/${r.diastolic} mmHg (${cat.category})${r.pulse ? `, Pulse: ${r.pulse} bpm` : ''}${r.notes ? ` - ${r.notes}` : ''}`;
}).join('\n')}

Alerts Detected: ${alerts.length}
${alerts.length > 0 ? alerts.map(a => `- ${a.message}`).join('\n') : 'None'}

BP Categories:
- Normal: Below 120/80 mmHg
- Elevated: 120-129/<80 mmHg
- High Stage 1: 130-139/80-89 mmHg
- High Stage 2: 140+/90+ mmHg
- Crisis: 180+/120+ mmHg (requires immediate medical attention)`;

    return context;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!apiKey || apiKey.trim() === '' || !isValidApiKey(apiKey)) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Please configure your Gemini API key in Settings before using the BP Analysis chat. You can get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const detectedLanguage = detectLanguage(inputValue);
      const languageInstruction = detectedLanguage === 'hindi' 
        ? 'IMPORTANT: The user is asking in Hindi/Hinglish. Please respond ONLY in Hindi (Devanagari script or Roman script as appropriate). Use simple, easy-to-understand Hindi language.'
        : 'IMPORTANT: The user is asking in English. Please respond ONLY in English.';

      const bpContext = buildBPContext();
      
      const prompt = `You are a specialized Blood Pressure Analysis Assistant for Health Scan platform.

${bpContext}

User Question: "${inputValue}"

${languageInstruction}

Please provide helpful, accurate, and personalized analysis about the user's BP data. You can:
- Analyze trends and patterns in their BP readings
- Explain what their BP values mean
- Provide insights about their BP category
- Give personalized recommendations based on their data
- Answer questions about blood pressure management
- Explain the alerts detected
- Compare current readings with averages
- Suggest lifestyle modifications if needed

Remember: ${languageInstruction}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an error. Please try again.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting right now. Please check your API configuration and try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="glass-card w-full max-w-2xl h-[600px] flex flex-col bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Heart className="w-6 h-6 text-red-500" />
              BP Analysis Assistant
            </CardTitle>
            {!apiKey || apiKey.trim() === '' ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 dark:bg-yellow-900/30 border border-yellow-500/30 dark:border-yellow-700/50 rounded-md">
                <Settings className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs text-yellow-700 dark:text-yellow-300">API Key Required</span>
              </div>
            ) : !isValidApiKey(apiKey) ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 dark:bg-red-900/30 border border-red-500/30 dark:border-red-700/50 rounded-md">
                <Settings className="w-3 h-3 text-red-600 dark:text-red-400" />
                <span className="text-xs text-red-700 dark:text-red-300">Invalid API Key</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 dark:bg-green-900/30 border border-green-500/30 dark:border-green-700/50 rounded-md">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-700 dark:text-green-300">Connected</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden pt-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-red-500/20 dark:bg-red-900/30 text-gray-900 dark:text-gray-100 ml-auto'
                      : 'bg-gray-100 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className={`text-sm leading-relaxed ${message.sender === 'bot' ? 'prose prose-sm' : ''}`}>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="text-gray-900 dark:text-gray-100 mb-2">{children}</p>,
                        strong: ({ children }) => <strong className="text-gray-900 dark:text-gray-100 font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc list-inside text-gray-900 dark:text-gray-100 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside text-gray-900 dark:text-gray-100 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-gray-900 dark:text-gray-100">{children}</li>,
                        a: ({ href, children }) => <a href={href} className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700/80 p-3 rounded-2xl">
                  <Loader2 className="w-4 h-4 animate-spin text-red-500 dark:text-red-400" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !apiKey || apiKey.trim() === '' 
                  ? "Configure API key in Settings to chat..." 
                  : readings.length === 0
                  ? "Ask me about BP tracking, what readings mean, or how to get started..."
                  : "Ask me about your BP trends, what your readings mean, or get insights..."
              }
              className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading || !apiKey || apiKey.trim() === '' || !isValidApiKey(apiKey)}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading || !apiKey || apiKey.trim() === '' || !isValidApiKey(apiKey)}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

