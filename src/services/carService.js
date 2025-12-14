import apiClient from './apiClient';
export const carService = {
  createCar: (formData) => apiClient.post('/cars', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getCars: (params) => apiClient.get('/cars', { params }),
  getCarDetails: (carId) => apiClient.get(`/cars/${carId}`),
  getMyCars: () => apiClient.get('/cars/me'),
};