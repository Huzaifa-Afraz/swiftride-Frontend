import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import TrackingMap from '../../components/TrackingMap';
import useAuth from '../../hooks/useAuth';
import useLocationTracking from '../../hooks/useLocationTracking';

const TrackBookingPage = () => {
  const { id } = useParams(); // Get booking ID from URL
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if current user is the customer (Driver)
  const isDriver = booking && user && (
    (typeof booking.customer === 'string' && booking.customer === user._id) || 
    (typeof booking.customer === 'object' && booking.customer._id === user._id)
  );
  
  // Enable tracking ONLY if user is driver AND trip is ongoing
  const isTrackingActive = isDriver && booking?.status === 'ongoing';
  
  // Hook handles sending location updates automatically when active
  const { isTracking, error: trackingError } = useLocationTracking(id, isTrackingActive);

  // Fetch the booking details first to check status & initial location
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await apiClient.get(`/bookings/${id}`);
        setBooking(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to load booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading Trip Details...</div>;
  if (!booking) return <div className="p-10 text-center">Booking not found.</div>;

  // Optional: Only show map if the ride is actually active
  if (booking.status !== 'ongoing') {
    return <div className="p-10 text-center text-lg">This ride is currently <strong>{booking.status}</strong>.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚗 Live Ride Tracking</h1>
      <p className="text-gray-600 mb-2">Booking ID: {booking.id || booking._id}</p>
      
      {/* Tracking Status Indicator */}
      {isTrackingActive && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${isTracking ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
          <span className="font-medium text-sm">
            {isTracking ? 'Broadcasting live location...' : 'Initializing tracking...'}
          </span>
          {trackingError && <span className="text-red-500 text-xs ml-2">({trackingError})</span>}
        </div>
      )}

      {/* Render the Map and pass the necessary props */}
      <div className="rounded-xl overflow-hidden shadow-lg">
        <TrackingMap
          bookingId={booking.id || booking._id}
          initialLocation={booking.currentLocation}
        />
      </div>
    </div>
  );
};

export default TrackBookingPage;