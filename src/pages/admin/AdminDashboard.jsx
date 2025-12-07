import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, Car, Calendar, Activity, AlertTriangle, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        
        // --- FIX: DRILL DOWN TO THE INNER 'data' OBJECT ---
        // Axios response = res
        // API Body = res.data
        // Actual Stats = res.data.data
        const validStats = res.data?.data || {}; 
        
        setStats(validStats);
      } catch (err) {
        console.error("Dashboard Stats Error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading dashboard...</div>;
  
  if (error) return (
    <div className="p-10 text-center text-red-500 flex flex-col items-center gap-2">
      <AlertTriangle className="w-8 h-8" />
      <p>{error}</p>
    </div>
  );

  // --- DATA TRANSFORMATION ---
  const bookingData = [
    { name: 'Pending', value: stats?.bookings?.pending || 0, color: '#FBBF24' },
    { name: 'Confirmed', value: stats?.bookings?.confirmed || 0, color: '#34D399' },
    { name: 'Cancelled', value: stats?.bookings?.cancelled || 0, color: '#F87171' },
    { name: 'Completed', value: stats?.bookings?.completed || 0, color: '#60A5FA' },
  ];

  const userData = [
    { name: 'Customers', count: stats?.users?.customer || 0 },
    { name: 'Hosts', count: stats?.users?.host || 0 },
    { name: 'Showrooms', count: stats?.users?.showroom || 0 },
  ];

  const totalUsers = (stats?.users?.customer || 0) + (stats?.users?.host || 0) + (stats?.users?.showroom || 0);
  const totalCars = stats?.cars?.total || 0;
  const totalBookings = Object.values(stats?.bookings || {}).reduce((a, b) => a + b, 0);
  const pendingKYC = stats?.kyc?.pending || 0;
  const revenue = stats?.revenue?.totalPlatformFee || 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Platform Overview</h1>

      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={totalUsers} icon={<Users className="text-blue-600" />} bg="bg-blue-50" />
        <StatCard title="Active Fleet" value={totalCars} icon={<Car className="text-indigo-600" />} bg="bg-indigo-50" />
        <StatCard title="Total Bookings" value={totalBookings} icon={<Calendar className="text-purple-600" />} bg="bg-purple-50" />
        <StatCard title="Pending KYC" value={pendingKYC} icon={<Activity className="text-orange-600" />} bg="bg-orange-50" />
      </div>

      {/* Revenue Card (Optional Row) */}
      <div className="grid grid-cols-1 mb-10">
         <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-900">Total Platform Revenue</h3>
                <p className="text-sm text-green-700">Commission from completed trips</p>
              </div>
            </div>
            <span className="text-3xl font-bold text-green-800">PKR {revenue.toLocaleString()}</span>
         </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Booking Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-700">Booking Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={bookingData} 
                  cx="50%" cy="50%" 
                  innerRadius={60} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {bookingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-700">User Demographics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                <Bar dataKey="count" fill="#6366F1" radius={[10, 10, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
    <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium uppercase">{title}</p>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;