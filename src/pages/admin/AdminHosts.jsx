import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Car } from 'lucide-react';

const AdminHosts = () => {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHosts = async () => {
    try {
      const res = await adminService.getUsers('host', {});
      // --- CRITICAL SAFETY CHECK ---
      const dataList = res.data.docs || res.data?.data || [];
      setHosts(Array.isArray(dataList) ? dataList : []);
    } catch (error) { 
      console.error(error); 
      setHosts([]);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchHosts(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Host Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Host Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Cars Listed</th>
              <th className="p-4">KYC</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {hosts.length > 0 ? hosts.map(host => (
              <tr key={host._id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{host.fullName}</td>
                <td className="p-4 text-gray-600">{host.email}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold">{host.carCount || 0}</span>
                  </div>
                </td>
                <td className="p-4">
                   {host.isVerified ? <span className="text-green-600 font-bold text-xs">Verified</span> : <span className="text-orange-500 font-bold text-xs">Pending</span>}
                </td>
                <td className="p-4 capitalize text-sm">{host.status || 'active'}</td>
              </tr>
            )) : (
              !loading && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No hosts found.</td></tr>
            )}
          </tbody>
        </table>
        {loading && <div className="p-8 text-center">Loading...</div>}
      </div>
    </div>
  );
};

export default AdminHosts;