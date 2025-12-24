import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { ArrowLeft, Calendar, User, CreditCard, Shield } from 'lucide-react';

const AdminBookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/admin/bookings/${id}`)
      .then(res => {
        setBooking(res.data?.data.booking || null);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading details...</div>;
  if (!booking) return <div className="p-10 text-center">Booking not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/admin/bookings" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to List
      </Link>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice #{booking.id.substring(0,8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500">Created on {new Date(booking.createdAt).toDateString()}</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
               booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
            }`}>
              {booking.status}
            </span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Customer Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Customer
            </h3>
            <p className="font-bold text-lg">{booking.customer?.fullName}</p>
            <p className="text-gray-600">{booking.customer?.email}</p>
            <p className="text-gray-600">{booking.customer?.phoneNumber}</p>
          </div>

          {/* Owner Info */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Owner / Host
            </h3>
            <p className="font-bold text-lg">{booking?.owner?.fullName || booking.owner?.showroomName}</p>
            <p className="text-gray-600 capitalize">Role: {booking?.owner?.role}</p>
            <p className="text-gray-600">{booking?.owner?.email}</p>
          </div>

          {/* Car Info */}
          <div className="col-span-1 md:col-span-2 bg-gray-50 p-6 rounded-xl flex gap-6 items-center">
            <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
               {booking?.car?.primaryPhoto && <img src={booking?.car?.primaryPhoto} alt="Car" className="w-full h-full object-cover"/>}
            </div>
            <div>
              <h3 className="font-bold text-xl">{booking.car?.make} {booking.car?.model}</h3>
              <p className="text-gray-500">{booking?.car?.year} • {booking?.car?.plateNumber}</p>
              <p className="text-sm text-gray-400 mt-1">{booking?.car?.location}</p>
            </div>
          </div>

          {/* Financials */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment Details
            </h3>
            <div className="flex justify-between py-2 border-b border-dashed">
              <span>Total Amount</span>
              <span className="font-bold">PKR {booking?.totalPrice}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dashed">
              <span>Platform Fee (Commission)</span>
              <span className="text-gray-500">PKR {booking?.platformCommissionAmount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dashed">
              <span>Owner Earning</span>
              <span className="text-green-600 font-bold">PKR {booking?.ownerEarningAmount}</span>
            </div>
            <div className="mt-4">
              <span className={`px-2 py-1 rounded text-xs font-bold ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                Payment Status: {booking.paymentStatus}
              </span>
            </div>
             <div className="flex justify-between py-2 border-b border-dashed">
              <span>Download Invoice</span>
              <span className="text-gray-500">PKR {booking?.invoiceDownloadPath}</span>
            </div>
             <div className="flex justify-between py-2 border-b border-dashed">
              <span>PDF Invoice</span>
              <span className="text-gray-500">PKR {booking?.invoicePdfPath}</span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Schedule
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Pick-up</p>
                <p className="font-medium">{new Date(booking.startDateTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Drop-off</p>
                <p className="font-medium">{new Date(booking.endDateTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium">{booking.durationHours} Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;