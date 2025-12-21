import apiClient from './apiClient';
export const paymentService = {
  // initBookingPayment: (bookingId) => apiClient.post(`/payments/booking/${bookingId}/init`, {}),
  initBookingPayment: (bookingId) => apiClient.post(`/payments/booking/${bookingId}/safepay/init`, {}),
  //   initBookingPayment: async (bookingId) => {
  //   const res = await apiClient.post(`/payments/booking/${bookingId}/init`);
  //   return res.data;
  // },
  initSafepayPayment: (bookingId) => apiClient.post(`/payments/booking/${bookingId}/safepay/init`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
}),
}

// export const initSafepayPayment = (bookingId) => {
//     // Make sure this URL matches your Backend Route exactly
//     return apiClient.post(`/bookings/${bookingId}/safepay/init`, {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });
// };
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