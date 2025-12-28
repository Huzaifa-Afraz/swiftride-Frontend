import React, { useState } from 'react';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';

const Inbox = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="h-[calc(100vh-6rem)] flex bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-200`}>
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-lg text-gray-800">Messages</h2>
        </div>
        <ChatList 
          onSelectChat={setSelectedChat} 
          selectedChatId={selectedChat?._id} 
        />
      </div>

      {/* Main Window */}
      <div className={`flex-1 flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            onClose={() => setSelectedChat(null)} 
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
