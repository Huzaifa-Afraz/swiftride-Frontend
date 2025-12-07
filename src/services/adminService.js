import apiClient from './apiClient';

export const adminService = {
  // Stats
  getStats: () => apiClient.get('/admin/stats'),

  // User Management (Unified endpoint with role filter)
  getUsers: (role, params) => apiClient.get('/admin/users', { 
    params: { role, ...params } 
  }),

  // Manage Status (Ban/Activate)
  updateUserStatus: (userId, status) => apiClient.patch(`/admin/users/${userId}/status`, { status }),
};