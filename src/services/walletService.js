import apiClient from './apiClient';

export const walletService = {
  getMyWallet: () => apiClient.get('/wallet/me'),
  getTransactions: () => apiClient.get('/wallet/me/transactions'),
};