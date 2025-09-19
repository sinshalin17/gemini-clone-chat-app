
"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  image?: string;
}


// Simulate a large pool of dummy messages for infinite scroll
const TOTAL_DUMMY = 100;
const DUMMY_MESSAGES: Message[] = Array.from({ length: TOTAL_DUMMY }, (_, i) => ({
  id: (i + 1).toString(),
  sender: i % 2 === 0 ? 'ai' : 'user',
  text: (i === 0) ? 'Welcome to Gemini chat!' : `Message #${i + 1}`,
  timestamp: Date.now() - (TOTAL_DUMMY - i) * 60000,
}));


export default function ChatroomPage() {
  const params = useParams();
  const chatroomId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  // Pagination state
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1); // 1-based
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`chat-messages-${chatroomId}`);
      if (saved) return JSON.parse(saved);
    }
    return DUMMY_MESSAGES.slice(-PAGE_SIZE);
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(DUMMY_MESSAGES.length > PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`chat-messages-${chatroomId}`, JSON.stringify(messages));
    }
  }, [messages, chatroomId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Infinite scroll: load older messages when scrolled to top
  const handleScroll = useCallback(() => {
    if (!containerRef.current || loadingMore || !hasMore) return;
    if (containerRef.current.scrollTop < 32) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage((prev) => {
          const nextPage = prev + 1;
          const totalToShow = nextPage * PAGE_SIZE;
          const newMessages = DUMMY_MESSAGES.slice(-totalToShow);
          setMessages(newMessages);
          setHasMore(newMessages.length < DUMMY_MESSAGES.length);
          setLoadingMore(false);
          // Maintain scroll position after loading more
          messagesTopRef.current?.scrollIntoView({ behavior: 'auto' });
          return nextPage;
        });
      }, 600); // Simulate network delay
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Send message (with optional image)
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !image) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: Date.now(),
      image: image || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setImage(null);
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
    }, 1200 + Math.random() * 1000); // Simulate AI thinking
  };

  // Image upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Copy-to-clipboard with hover effect
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast('Copied!');
    setTimeout(() => setToast(''), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Chatroom {chatroomId}</h2>
      <div
        ref={containerRef}
        className="w-full max-w-2xl flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded shadow p-4 mb-4"
        style={{ maxHeight: 500 }}
      >
        <div ref={messagesTopRef} />
        {loadingMore && (
          <div className="flex flex-col gap-2 mb-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex">
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`relative px-4 py-2 rounded-lg max-w-xs break-words group transition-colors duration-200 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
              }`}
              onClick={() => handleCopy(msg.text)}
              title="Click to copy"
              style={{ cursor: 'pointer' }}
            >
              {msg.image && (
                <img src={msg.image} alt="uploaded" className="mb-2 max-h-32 rounded" />
              )}
              {msg.text}
              <span className="block text-xs mt-1 opacity-60">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-xs bg-black bg-opacity-60 text-white px-1 rounded pointer-events-none transition-opacity">Copy</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-300">Gemini is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="w-full max-w-2xl flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
        />
        <label className="cursor-pointer bg-gray-200 dark:bg-gray-700 px-2 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <span role="img" aria-label="Upload">📷</span>
        </label>
        {image && (
          <img src={image} alt="preview" className="h-10 w-10 object-cover rounded" />
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
      {toast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
