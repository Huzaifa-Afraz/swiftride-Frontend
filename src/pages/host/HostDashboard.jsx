import React, { useEffect, useState } from 'react';
import { hostService } from '../../services/hostService';
import useAuth from '../../hooks/useAuth'; // Import Auth
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Car, DollarSign, Clock, TrendingUp, AlertCircle, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HostDashboard = () => {
  const { user } = useAuth(); // Get User for KYC Status
  
  // Initialize with Safe Defaults
  const [data, setData] = useState({
    quickStats: { totalCars: 0, activeBookings: 0, pendingRequests: 0, totalEarnings: 0, thisMonthEarnings: 0 },
    charts: { monthlyEarnings: [], bookingStatus: [] },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await hostService.getDashboardStats();
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (error) {
        console.warn("Dashboard API not ready, showing default view.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading your business dashboard...</div>;

  const { quickStats, charts, recentActivity } = data;

  const earningsData = charts?.monthlyEarnings?.length > 0 ? charts.monthlyEarnings : [
    { month: 'Jan', amount: 0 }, { month: 'Feb', amount: 0 }, { month: 'Mar', amount: 0 } 
  ];
  
  const statusData = charts?.bookingStatus?.length > 0 ? charts.bookingStatus : [
    { name: 'No Data', value: 1 }
  ];
  
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* HEADER WITH KYC STATUS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-800">Host Dashboard</h1>
            
            {/* KYC BADGE */}
            {user.isVerified ? (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                <CheckCircle className="w-3 h-3" /> Verified Host
              </span>
            ) : (
              <Link to="/dashboard/kyc" className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 hover:bg-orange-200 transition">
                <AlertCircle className="w-3 h-3" /> Verification Pending
              </Link>
            )}
          </div>
          <p className="text-gray-500">Welcome back, here is your fleet overview.</p>
        </div>

        {/* Link to Add Car (Route is separate or inside dashboard depending on App.js, using standard link) */}
        <Link to="/host/add-car" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2">
          <Car className="w-5 h-5" /> Add New Car
        </Link>
      </div>

      {/* 1. QUICK STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Earnings" 
          value={`PKR ${quickStats?.totalEarnings?.toLocaleString() || 0}`} 
          sub={`+PKR ${quickStats?.thisMonthEarnings?.toLocaleString() || 0} this month`}
          icon={<DollarSign className="w-6 h-6 text-green-600" />} 
          bg="bg-green-50" 
          link="/dashboard/wallet" // UPDATED LINK
        />
        <StatCard 
          title="Active Fleet" 
          value={quickStats?.totalCars || 0} 
          sub="Listed Vehicles"
          icon={<Car className="w-6 h-6 text-indigo-600" />} 
          bg="bg-indigo-50" 
          link="/dashboard/fleet" // UPDATED LINK
        />
        <StatCard 
          title="Pending Requests" 
          value={quickStats?.pendingRequests || 0} 
          sub="Requires Action"
          icon={<AlertCircle className="w-6 h-6 text-orange-600" />} 
          bg="bg-orange-50" 
          link="/dashboard/requests" // UPDATED LINK
        />
        <StatCard 
          title="Active Bookings" 
          value={quickStats?.activeBookings || 0} 
          sub="Currently on trip"
          icon={<Clock className="w-6 h-6 text-blue-600" />} 
          bg="bg-blue-50" 
          link="/dashboard/requests" // UPDATED LINK
        />
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> Revenue History
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="amount" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Booking Status</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={statusData} 
                  cx="50%" cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. RECENT ACTIVITY LIST */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-700">Recent Activity</h2>
          <Link to="/dashboard/requests" className="text-sm text-indigo-600 hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {(!recentActivity || recentActivity.length === 0) ? (
            <div className="p-8 text-center text-gray-400">No recent activity found.</div>
          ) : (
            recentActivity.map((item, index) => (
              <div key={index} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-800 font-medium">{item.message}</p>
                  <p className="text-xs text-gray-500">{new Date(item.date).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Component
const StatCard = ({ title, value, sub, icon, bg, link }) => {
  const Content = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase">{title}</p>
          <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
      </div>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );

  return link ? <Link to={link}><Content /></Link> : <Content />;
};

export default HostDashboard;