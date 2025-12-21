import React, { useState } from 'react';
import axios from 'axios';

const SafepayButton = ({ bookingId }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Call Backend to get the Payment Link
      const response = await axios.post(
        `/api/bookings/${bookingId}/safepay/init`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // 2. Extract the URL from response
      const { url } = response.data.data;

      // 3. WHAT NEXT? -> Redirect the user!
      if (url) {
        window.location.href = url; // This sends them to Safepay
      } else {
        alert("Error: No payment URL received.");
      }

    } catch (error) {
      console.error("Payment Init Error:", error);
      alert("Failed to initialize payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};

export default SafepayButton;