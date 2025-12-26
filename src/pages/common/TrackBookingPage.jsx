import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apibase from '../services/apibase'; // Your existing API service
import TrackingMap from '../../components/TrackingMap';

const TrackBookingPage = () => {
  const { id } = useParams(); // Get booking ID from URL
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the booking details first to check status & initial location
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Assuming your backend has: GET /api/bookings/:id
        const response = await apibase.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Failed to load booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (loading) return <div>Loading Trip Details...</div>;
  if (!booking) return <div>Booking not found.</div>;

  // Optional: Only show map if the ride is actually active
  if (booking.status !== 'ongoing') {
    return <div className="p-10">This ride is currently {booking.status}.</div>;
  }

  return (
    <div className="tracking-page-container">
      <h1>Live Ride Tracking</h1>
      <p>Ride ID: {booking._id}</p>

      {/* Render the Map and pass the necessary props */}
      <div style={{ marginTop: '20px' }}>
        <TrackingMap
           bookingId={booking._id} 
           // Pass the last known location from DB so map doesn't start empty
           initialLocation={booking.currentLocation} 
        />
      </div>
    </div>
  );
};

export default TrackBookingPage;