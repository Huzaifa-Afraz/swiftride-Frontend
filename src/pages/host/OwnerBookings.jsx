import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { showAlert } from '../../utils/alert';
import { Check, X, Clock, User } from 'lucide-react';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    bookingService.getOwnerBookings()
      .then(res => {
        setBookings(res.data.docs || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status, `Marked as ${status} by host`);
      showAlert('Updated', `Booking ${status} successfully`, 'success');
      fetchBookings(); // Refresh list
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Update failed', 'error');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading requests...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Booking Requests</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {bookings.map((booking, index) => (
          <div key={booking._id} className={`p-6 flex flex-col md:flex-row gap-6 ${index !== bookings.length - 1 ? 'border-b' : ''}`}>
            
            {/* Car Image */}
            <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
               {booking.carId?.photos?.[0] && <img src={booking.carId.photos[0]} alt="Car" className="w-full h-full object-cover"/>}
            </div>

            {/* Details */}
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{booking.carId?.make} {booking.carId?.model}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2"><User className="w-4 h-4"/> Customer: {booking.customerId?.fullName}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4"/> {new Date(booking.startDateTime).toLocaleString()} — {new Date(booking.endDateTime).toLocaleString()}</div>
              </div>

              <div className="font-bold text-indigo-600">Earnings: PKR {booking.totalPrice}</div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col justify-center gap-2">
              {booking.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                    className="flex items-center justify-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition text-sm font-medium"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {bookings.length === 0 && <div className="p-10 text-center text-gray-500">No booking requests found.</div>}
      </div>
    </div>
  );
};

export default OwnerBookings;