import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { paymentService, redirectToPaymentGateway } from '../../services/paymentService';
import { showAlert } from '../../utils/alert';
import { Calendar, Clock } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getMyBookings()
      .then(res => {
        setBookings(res.data.docs || res.data); // Adjust depending on if backend paginates
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  const handlePay = async (bookingId) => {
    try {
      const res = await paymentService.initBookingPayment(bookingId);
      const { paymentPageUrl, payload } = res.data;
      redirectToPaymentGateway(paymentPageUrl, payload);
    } catch (err) {
      showAlert('Error', 'Could not initialize payment', 'error');
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
      
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">You haven't booked any cars yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Car Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                   {booking.carId?.photos?.[0] && <img src={booking.carId.photos[0]} alt="Car" className="w-full h-full object-cover"/>}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{booking.carId?.make} {booking.carId?.model}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(booking.startDateTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {booking.durationHours} Hours</span>
                  </div>
                </div>
              </div>

              {/* Status & Price */}
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                <p className="text-2xl font-bold text-indigo-600 mt-2">PKR {booking.totalPrice}</p>
                <p className="text-xs text-gray-400">Payment: {booking.paymentStatus}</p>
              </div>

              {/* Actions */}
              <div>
                {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' && (
                  <button 
                    onClick={() => handlePay(booking._id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Pay Now
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition ml-2">
                    Download Invoice
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