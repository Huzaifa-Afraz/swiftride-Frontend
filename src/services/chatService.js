import apiClient from './apiClient';

const chatService = {
  // Get all my conversations
  getMyChats: async () => {
    const response = await apiClient.get('/chat');
    return response.data;
  },

  // Get messages for a specific chat
  getMessages: async (chatId) => {
    const response = await apiClient.get(`/chat/${chatId}/messages`);
    return response.data; // array of messages
  },

  // Start or Get conversation with a user (e.g. host)
  createOrGetChat: async (partnerId, carId = null) => {
    const response = await apiClient.post('/chat/create', { partnerId, carId });
    return response.data;
  },

  // Send message API (fallback or standard)
  sendMessage: async (chatId, content) => {
    const response = await apiClient.post(`/chat/${chatId}/send`, { content });
    return response.data;
  }
};

export default chatService;
