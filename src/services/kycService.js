import apiClient from './apiClient';

export const kycService = {
  // For Customers & Hosts
  submitUserKYC: (formData) => apiClient.post('/kyc/user', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  // For Showrooms
  submitShowroomKYC: (formData) => apiClient.post('/kyc/showroom', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  // Admin only
  getAllKYC: (params) => apiClient.get('/admin/kyc', { params }),
  approveKYC: (id) => apiClient.patch(`/admin/kyc/${id}/approve`, {}),
  rejectKYC: (id, reason) => apiClient.patch(`/admin/kyc/${id}/reject`, { reason }),
};