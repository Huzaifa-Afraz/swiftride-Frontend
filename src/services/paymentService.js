import apiClient from './apiClient';
export const paymentService = {
  initBookingPayment: (bookingId) => apiClient.post(`/payments/booking/${bookingId}/init`, {}),
};
export const redirectToPaymentGateway = (paymentPageUrl, payload) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = paymentPageUrl;
  Object.keys(payload).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = payload[key];
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
};