import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { showAlert } from '../../utils/alert';
import { Check, X, Clock, User, Calendar } from 'lucide-react';
import TrackingMap from '../../components/TrackingMap';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTrackingId, setActiveTrackingId] = useState(null); // New: Track which booking is open

  const fetchBookings = () => {
    bookingService.getOwnerBookings()
      .then(res => {
   
        const data = res.data.docs || res.data?.data.items || [];
        console.log("Owner Bookings Data:", data);
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load owner bookings", err);
        setBookings([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status, `Marked as ${status} by host`);
      showAlert('Updated', `Booking ${status} successfully`, 'success');
      fetchBookings(); 
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Update failed', 'error');
    }
  };

  const toggleTracking = (bookingId) => {
    if (activeTrackingId === bookingId) {
      setActiveTrackingId(null); // Close if already open
    } else {
      setActiveTrackingId(bookingId); // Open new
    }
  };

  if (loading) return <div className="p-10 text-center">Loading requests...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Booking Requests</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {bookings.length > 0 ? bookings.map((booking, index) => (
          <div key={booking.id} className={`flex flex-col border-b ${index === bookings.length - 1 ? 'border-b-0' : ''}`}>
            {/* Main Row */}
            <div className="p-6 flex flex-col md:flex-row gap-6">
              
              {/* Car Image */}
              <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                 {booking.car?.primaryPhoto ? (
                   <img src={booking.car.primaryPhoto} alt="Car" className="w-full h-full object-cover"/>
                 ) : (
                   <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                 )}
              </div>

              {/* Details */}
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{booking.car?.make || 'Deleted Car'} {booking.car?.model}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2"><User className="w-4 h-4"/> Customer: {booking.customer?.name || 'Unknown User'}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4"/> 
                    {booking.startDateTime ? new Date(booking.startDateTime).toLocaleDateString() : 'N/A'} — 
                    {booking.endDateTime ? new Date(booking.endDateTime).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="font-bold text-indigo-600">Earnings: PKR {booking.totalPrice}</div>
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col justify-center gap-2 min-w-[140px]">
                {/* 1. Pending Actions */}
                {booking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                      className="flex items-center justify-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition text-sm font-medium"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}

                {/* 2. Confirmed -> Start Booking */}
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'ongoing')}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    <Clock className="w-4 h-4" /> Start Booking
                  </button>
                )}

                {/* 3. Ongoing -> Track */}
                {booking.status === 'ongoing' && (
                  <button 
                    onClick={() => toggleTracking(booking.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded transition text-sm font-medium ${
                      activeTrackingId === booking.id 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {activeTrackingId === booking.id ? 'Close Map' : 'Track Car'}
                  </button>
                )}
                
                {/* 4. Complete button (Optional, if needed later) */}
                 {booking.status === 'ongoing' && (
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'completed')}
                    className="mt-2 flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded hover:bg-green-200 text-xs"
                  >
                    Mark Complete
                  </button>
                )}

              </div>
            </div>

            {/* Tracking Map Section */}
            {activeTrackingId === booking.id && (
              <div className="p-4 bg-gray-50 border-t">
                 <h4 className="font-bold mb-2 text-gray-700">Live Vehicle Tracking</h4>
                 <div className="rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                   {/* Import TrackingMap at top if not auto-imported, assuming it is imported */}
                   <TrackingMap bookingId={booking.id} />
                 </div>
              </div>
            )}
          </div>
        )) : (
          <div className="p-10 text-center text-gray-500 flex flex-col items-center">
            <Calendar className="w-12 h-12 text-gray-300 mb-4" />
            <p>No booking requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;