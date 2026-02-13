import apiClient from './apiClient';
export const carService = {
  createCar: (data) => apiClient.post('/cars', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getCars: (params) => apiClient.get('/cars', { params,
    headers: {
    Authorization: ''
  }
   }),
  getCarDetails: (carId) => apiClient.get(`/cars/${carId}`),
  updateCar: (id, data) => apiClient.patch(`/cars/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCar: (id) => apiClient.delete(`/cars/${id}`),
  getMyCars: () => apiClient.get('/cars/me'),

  // Admin
  getPendingCars: () => apiClient.get('/cars/admin/list/pending'),
  approveCar: (id) => apiClient.patch(`/cars/admin/${id}/approve`),
  rejectCar: (id, reason) => apiClient.patch(`/cars/admin/${id}/reject`, { reason }),
  suspendCar: (id, reason) => apiClient.patch(`/cars/admin/${id}/suspend`, { reason }),
};