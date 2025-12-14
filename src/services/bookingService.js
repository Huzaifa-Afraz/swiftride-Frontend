import apiClient from './apiClient';
export const bookingService = {
  createBooking: (data) => apiClient.post('/bookings', data),
  getMyBookings: () => apiClient.get('/bookings/me'),
  getBookingDetail: (id) => apiClient.get(`/bookings/${id}`),
  getInvoice: (id) => apiClient.get(`/bookings/invoice/${id}`, { responseType: 'blob' }),
  getOwnerBookings: () => apiClient.get('/bookings/owner'),
  updateStatus: (id, status, note) => apiClient.patch(`/bookings/${id}/status`, { status, note }),
    // Get booking by ID (used to confirm payment after return)
  getBookingById: async (bookingId) => {
    const res = await apiClient.get(`/bookings/${bookingId}`);
    return res.data;
  },
};