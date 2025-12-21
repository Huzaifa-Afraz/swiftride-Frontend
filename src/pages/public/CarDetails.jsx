import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carService } from '../../services/carService';
import { bookingService } from '../../services/bookingService';
// 1. UPDATE IMPORT: Removed 'redirectToPaymentGateway' as it's not needed for Safepay
import { paymentService, redirectToPaymentGateway } from '../../services/paymentService';
import useAuth from '../../hooks/useAuth';
import { showAlert } from '../../utils/alert';
import { MapPin, Calendar, Gauge, Fuel, Settings, User, CheckCircle } from 'lucide-react';

const CarDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '09:00'
  });

  useEffect(() => {
    carService.getCarDetails(carId)
      .then(res => {
        setCar(res.data?.data?.car);
        setLoading(false);
      })
      .catch(err => {
        showAlert('Error', 'Failed to load car details', 'error');
      });
  }, [carId, navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showAlert('Login Required', 'Please login to book a car', 'info');
      return navigate('/login');
    }
    
    if (user.role !== 'customer') {
      showAlert('Access Denied', 'Only customers can book cars. Please register a customer account.', 'warning');
      return;
    }

    const startDateTime = new Date(`${bookingDates.startDate}T${bookingDates.startTime}`);
    const endDateTime = new Date(`${bookingDates.endDate}T${bookingDates.endTime}`);

    if (endDateTime <= startDateTime) {
      showAlert('Invalid Dates', 'End time must be after start time', 'error');
      return;
    }

    try {
      setLoading(true);

      // 1. Create Booking
      const bookingRes = await bookingService.createBooking({
        carId: car._id,
        startDateTime,
        endDateTime
      });

      // Extract Booking ID (Handling various nested structures)
      const bookingId = bookingRes.data?.data?.booking?._id || 
                        bookingRes.data?.data?._id || 
                        bookingRes.data?._id;
      
      if (!bookingId) {
        throw new Error('Booking created but ID not returned');
      }

      // ============================================================
      // 2. SAFEPAY INTEGRATION (Updated Logic)
      // ============================================================
      
      // Call the new Safepay init function
      const paymentRes = await paymentService.initSafepayPayment(bookingId);
      const { url } = paymentRes.data?.data || paymentRes.data;

      // this configration is for easypaisa
            // const res = await paymentService.initBookingPayment(bookingId);
            //    console.log("initilize payment response is: ", res)
            // const { paymentPageUrl, payload } = res.data.data;
      
            // redirectToPaymentGateway(paymentPageUrl, payload);
            // const { url } = res.data?.data || res.data;
      
      
      
      if (url) {
         // 3. Simple Redirect
         window.location.href = url;
      } else {
         // Fallback if something weird happens
         showAlert('Success', 'Booking created! Please pay from "My Bookings".', 'success');
         navigate('/my-bookings');
      }

    } catch (error) {
      console.error(error);
      showAlert('Booking Failed', error.response?.data?.message || 'Something went wrong', 'error');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!car) return <div className="p-10 text-center">Car not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT: Image Gallery */}
        <div className="space-y-4">
          <div className="h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={car.photos?.[0] || 'https://via.placeholder.com/800x600'} 
              alt={car.make} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {car.photos?.slice(1, 5).map((photo, index) => (
              <div key={index} className="h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition">
                <img src={photo} alt="Car View" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Details & Booking Form */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{car.make} {car.model} <span className="text-gray-500 font-normal text-2xl">({car.year})</span></h1>
          
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span>{car.location?.address}</span>
          </div>

          <div className="flex items-end gap-2 mb-8 border-b pb-6">
            <span className="text-4xl font-bold text-indigo-600">PKR {car.pricePerDay}</span>
            <span className="text-gray-500 mb-1">/ day</span>
            <span className="text-gray-400 text-sm ml-4 mb-1">or PKR {car.pricePerHour} / hour</span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Settings className="text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Transmission</p>
                <p className="font-medium">{car.transmission}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Fuel className="text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Fuel Type</p>
                <p className="font-medium">{car.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Seats</p>
                <p className="font-medium">{car.seats} Passengers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Available</p>
                <p className="font-medium text-green-600">{car.availability?.isAvailable ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white border-2 border-indigo-50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Book this Car
            </h3>
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded focus:ring-2 ring-indigo-500 outline-none"
                    value={bookingDates.startDate}
                    onChange={e => setBookingDates({...bookingDates, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Time</label>
                  <input 
                    type="time" 
                    className="w-full border p-2 rounded focus:ring-2 ring-indigo-500 outline-none"
                    value={bookingDates.startTime}
                    onChange={e => setBookingDates({...bookingDates, startTime: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                  <input 
                    type="date" 
                    className="w-full border p-2 rounded focus:ring-2 ring-indigo-500 outline-none"
                    value={bookingDates.endDate}
                    onChange={e => setBookingDates({...bookingDates, endDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Time</label>
                  <input 
                    type="time" 
                    className="w-full border p-2 rounded focus:ring-2 ring-indigo-500 outline-none"
                    value={bookingDates.endTime}
                    onChange={e => setBookingDates({...bookingDates, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Proceed to Book & Pay
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;