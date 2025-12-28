import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import chatService from '../../services/chatService';
import io from 'socket.io-client';
import useAuth from '../../hooks/useAuth';

const ENDPOINT = process.env.REACT_APP_API_BASE_URL 
  ? process.env.REACT_APP_API_BASE_URL.replace('/api', '') 
  : 'http://localhost:5000';

const ChatWindow = ({ chat, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef();

  // Identify partner
  const partner = chat.participants.find(p => p._id !== user._id) || {};

  useEffect(() => {
    // 1. Connect Socket
    const newSocket = io(ENDPOINT, { withCredentials: true });
    setSocket(newSocket);

    // 2. Join Room
    newSocket.emit('join_chat', chat._id);

    // 3. Listen for messages
    newSocket.on('receive_message', (msg) => {
      console.log("CLIENT RECEIVED:", msg);
      setMessages(prev => [...prev, msg]);
    });

    // 4. Load History
    chatService.getMessages(chat._id).then(data => {
      setMessages(data);
    });

    return () => newSocket.disconnect();
  }, [chat._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Emit to socket (Optimistic UI could be added here)
    console.log("CLIENT EMITTING:", { chatId: chat._id, senderId: user._id, content: input });
    socket.emit('send_message', {
      chatId: chat._id,
      senderId: user._id,
      content: input
    });
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center">
            {partner.avatar ? (
              <img src={partner.avatar} className="w-full h-full rounded-full object-cover"/>
            ) : (
              <User size={20} />
            )}
          </div>
          <div>
            <h3 className="font-bold">{partner.fullName || 'User'}</h3>
            <p className="text-xs text-indigo-200 capitalize">{partner.role}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-indigo-200 hover:text-white">Close</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => {
          const isMe = msg.sender?._id === user._id || msg.sender === user._id;
          return (
            <div key={idx} className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
