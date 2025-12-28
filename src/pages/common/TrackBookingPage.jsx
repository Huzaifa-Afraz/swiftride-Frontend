import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import TrackingMap from '../../components/TrackingMap';

const TrackBookingPage = () => {
  const { id } = useParams(); // Get booking ID from URL
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <p className="text-gray-600 mb-4">Booking ID: {booking.id || booking._id}</p>

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