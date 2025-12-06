import apiClient from './apiClient';
export const authService = {
  signup: (data) => apiClient.post('/auth/signup', data),
  signupShowroom: (data) => apiClient.post('/auth/showroom/signup', data),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiClient.post('/auth/reset-password', { token, password }),
};