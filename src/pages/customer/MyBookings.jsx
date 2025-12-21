import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
// 1. Update imports: We don't need 'redirectToPaymentGateway' anymore
import { paymentService, redirectToPaymentGateway } from '../../services/paymentService';
import { showAlert } from '../../utils/alert';
import { Calendar, Clock, FileText, AlertCircle } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getMyBookings()
      .then(res => {
        const data = res.data.docs || res.data || [];
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load bookings", err);
        setBookings([]);
        setLoading(false);
      });
  }, []);

  // =========================================================
  // SAFEPAY INTEGRATION: Updated Handle Pay
  // =========================================================
  const handlePay = async (bookingId) => {
    try {
      // these are easypaisa configrations
      const res = await paymentService.initBookingPayment(bookingId);
      console.log("initilize payment response is: ", res)
      const { paymentPageUrl, payload } = res.data.data;
      
      redirectToPaymentGateway(paymentPageUrl, payload);
      
      // 1. Call your new Safepay initialization API
      // const res = await paymentService.initSafepayPayment(bookingId);
      
      // 2. Extract the URL from the response
      // Structure based on your previous backend code: { data: { url: "..." } }
      const { url } = res.data.data || res.data; 

      if (url) {
        // 3. Simple Redirect to Safepay
        window.location.href = url;
      } else {
        showAlert('Error', 'Invalid payment URL received', 'error');
      }

    } catch (err) {
      console.error("Payment Error", err);
      showAlert('Error', 'Could not initialize Safepay payment', 'error');
    }
  };

  const handleDownloadInvoice = async (bookingId) => {
    try {
      const response = await bookingService.getInvoice(bookingId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showAlert('Error', 'Could not download invoice', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-10 text-center">Loading bookings...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      {(!bookings || bookings.length === 0) ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You haven't booked any cars yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition">
              
              {/* Car Info */}
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                   {booking.carId?.photos?.[0] ? (
                     <img src={booking.carId.photos[0]} alt="Car" className="w-full h-full object-cover"/>
                   ) : (
                     <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                   )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{booking.carId?.make || 'Unknown'} {booking.carId?.model}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(booking.startDateTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {booking.durationHours} Hours</span>
                  </div>
                </div>
              </div>

              {/* Status & Price */}
              <div className="text-left md:text-right w-full md:w-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                <p className="text-2xl font-bold text-indigo-600 mt-2">PKR {booking.totalPrice}</p>
                <div className="flex items-center md:justify-end gap-1 text-xs text-gray-500 mt-1">
                   {booking.paymentStatus === 'unpaid' && <AlertCircle className="w-3 h-3 text-orange-500" />}
                   Payment: <span className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>{booking.paymentStatus}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full md:w-auto">
                {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                  <button 
                    onClick={() => handlePay(booking._id)}
                    className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition shadow-sm"
                  >
                    Pay with Safepay
                  </button>
                )}
                {/* Invoice Button - Visible if paid */}
                {booking.paymentStatus === 'paid' && (
                  <button 
                    onClick={() => handleDownloadInvoice(booking._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition border border-gray-200"
                    title="Download Invoice"
                  >
                    <FileText className="w-4 h-4" /> Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;