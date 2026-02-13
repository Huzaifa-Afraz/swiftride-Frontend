import apiClient from './apiClient';

export const walletService = {
  getMyWallet: () => apiClient.get('/wallets/me'),
  getTransactions: () => apiClient.get('/wallets/me/transactions'),
  requestWithdrawal: (amount, bankDetails) => apiClient.post('/wallets/withdraw', { amount, bankDetails }),
};