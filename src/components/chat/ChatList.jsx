import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import chatService from '../../services/chatService';
import useAuth from '../../hooks/useAuth';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatService.getMyChats()
      .then(data => {
        setChats(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-4 text-center">Loading chats...</div>;

  if (chats.length === 0) {
    return <div className="p-4 text-center text-gray-500">No conversations yet.</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {chats.map(chat => {
        const partner = chat.participants.find(p => p._id !== user._id) || {};
        const isSelected = selectedChatId === chat._id;

        return (
          <div 
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${isSelected ? 'bg-indigo-50 border-indigo-100' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                {partner.avatar ? (
                  <img src={partner.avatar} alt={partner.fullName} className="w-full h-full object-cover"/>
                ) : (
                  <User className="text-gray-500" size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className={`font-semibold truncate ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                    {partner.fullName || 'User'}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {chat.lastMessage?.createdAt && new Date(chat.lastMessage.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
