import apiClient from './apiClient';

export const walletService = {
  getMyWallet: () => apiClient.get('/wallet/me'),
  getTransactions: () => apiClient.get('/wallet/me/transactions'),
  requestWithdrawal: (amount, bankDetails) => apiClient.post('/wallet/withdraw', { amount, bankDetails }),
};