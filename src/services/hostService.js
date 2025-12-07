import apiClient from './apiClient';

export const hostService = {
  // New Stats Endpoint
  getDashboardStats: () => apiClient.get('/host/dashboard-stats'),
  
  // Existing endpoints (if you had them scattered, good to consolidate)
  getMyCars: () => apiClient.get('/cars/me'),
  addCar: (formData) => apiClient.post('/cars', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};