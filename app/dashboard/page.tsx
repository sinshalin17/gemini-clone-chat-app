"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const dummyChatrooms = [
  { id: '1', title: 'General Chat' },
  { id: '2', title: 'AI Talk' },
];

export default function Dashboard() {
  const [chatrooms, setChatrooms] = useState(dummyChatrooms);
  const [newRoom, setNewRoom] = useState('');
  const [toast, setToast] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.trim()) return;
    setChatrooms((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newRoom.trim() },
    ]);
    setNewRoom('');
    setToast('Chatroom created!');
    setTimeout(() => setToast(''), 1500);
  };

  const handleDelete = (id: string) => {
    setChatrooms((prev) => prev.filter((c) => c.id !== id));
    setToast('Chatroom deleted!');
    setTimeout(() => setToast(''), 1500);
  };

  return (
  <div className="min-h-screen flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Your Chatrooms</h1>
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          placeholder="New chatroom title"
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
      <ul className="w-full max-w-md space-y-2">
        {chatrooms.map((room) => (
          <li key={room.id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded shadow">
            <Link href={`/chatroom/${room.id}`} className="font-medium hover:underline">
              {room.title}
            </Link>
            <button
              onClick={() => handleDelete(room.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
