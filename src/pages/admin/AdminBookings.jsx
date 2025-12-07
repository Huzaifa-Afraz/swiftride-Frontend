import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { Search, Filter, Download } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/admin/bookings', {
          params: {
            status,
            paymentStatus,
            q: search,
            page: 1,
            limit: 50
          }
        });
        setBookings(res.data.docs || res.data || []);
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timeoutId = setTimeout(() => fetchBookings(), 500);
    return () => clearTimeout(timeoutId);
  }, [status, paymentStatus, search]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Platform Bookings</h1>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by Invoice # or Customer Name" 
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="border p-2 rounded-lg bg-gray-50"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select 
            className="border p-2 rounded-lg bg-gray-50"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Invoice</th>
              <th className="p-4 font-medium text-gray-500">Customer</th>
              <th className="p-4 font-medium text-gray-500">Car Info</th>
              <th className="p-4 font-medium text-gray-500">Dates</th>
              <th className="p-4 font-medium text-gray-500">Amount</th>
              <th className="p-4 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="6" className="p-10 text-center">Loading data...</td></tr>
            ) : bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-xs">{b._id.substring(0,8).toUpperCase()}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{b.customerId?.fullName}</div>
                  <div className="text-xs text-gray-500">{b.customerId?.email}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm">{b.carId?.make} {b.carId?.model}</div>
                  <div className="text-xs text-gray-500">{b.carId?.plateNumber}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(b.startDateTime).toLocaleDateString()}
                  <br/>
                  <span className="text-xs">to {new Date(b.endDateTime).toLocaleDateString()}</span>
                </td>
                <td className="p-4 font-bold text-gray-900">
                  PKR {b.totalPrice}
                  <div className={`text-xs font-normal ${b.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                    {b.paymentStatus}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                    b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && bookings.length === 0 && (
          <div className="p-10 text-center text-gray-500">No bookings match your filters.</div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;