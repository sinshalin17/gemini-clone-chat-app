import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  image?: string;
}

const DUMMY_MESSAGES: Message[] = [
  { id: '1', sender: 'ai', text: 'Welcome to Gemini chat!', timestamp: Date.now() },
];

export default function ChatroomPage() {
  const params = useParams();
  const chatroomId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Gemini: ' + userMsg.text.split('').reverse().join(''),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast('Copied!');
    setTimeout(() => setToast(''), 1200);
  };

  return (
  <div className="min-h-screen flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Chatroom {chatroomId}</h2>
      <div className="w-full max-w-2xl flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded shadow p-4 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`relative px-4 py-2 rounded-lg max-w-xs break-words ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
              }`}
              onMouseEnter={() => {}}
              onClick={() => handleCopy(msg.text)}
              title="Click to copy"
              style={{ cursor: 'pointer' }}
            >
              {msg.text}
              <span className="block text-xs mt-1 opacity-60">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white animate-pulse">
              Gemini is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="w-full max-w-2xl flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
