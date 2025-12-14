import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Search, User, CheckCircle, AlertCircle } from 'lucide-react';
import { showAlert } from '../../utils/alert';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers('customer', { q: searchTerm });
      
      // --- FIX: DRILL DOWN TO 'res.data.data' ---
      // 1. res.data = Axios body
      // 2. res.data.data = Your API's payload
      // 3. .docs = The pagination array
      const apiData = res.data?.data?.users || {}; 
      const dataList = apiData.docs || apiData || [];
    
      
      setUsers(Array.isArray(dataList) ? dataList : []);
      console.log("Fetched users:", users);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    try {
      await adminService.updateUserStatus(user._id, newStatus);
      showAlert('Updated', `User has been ${newStatus}.`, 'success');
      fetchUsers();
    } catch (error) {
      showAlert('Error', 'Failed to update status', 'error');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 ring-indigo-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-bold text-gray-500">Name</th>
              <th className="p-4 text-sm font-bold text-gray-500">Contact</th>
              <th className="p-4 text-sm font-bold text-gray-500">KYC Status</th>
              <th className="p-4 text-sm font-bold text-gray-500">Account Status</th>
              <th className="p-4 text-sm font-bold text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length > 0 ? users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{user.fullName}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div>{user.email}</div>
                  <div className="text-xs text-gray-400">{user.phoneNumber}</div>
                </td>
                <td className="p-4">
                  {user.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1 rounded">
                      <AlertCircle className="w-3 h-3" /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${user.status === 'banned' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleStatus(user)}
                    className={`text-xs font-bold px-3 py-1 rounded border transition ${
                      user.status === 'banned' 
                      ? 'border-green-200 text-green-600 hover:bg-green-50' 
                      : 'border-red-200 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {user.status === 'banned' ? 'Unban' : 'Ban User'}
                  </button>
                </td>
              </tr>
            )) : (
              !loading && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No customers found.</td></tr>
            )}
          </tbody>
        </table>
        {loading && <div className="p-8 text-center text-gray-500">Loading...</div>}
      </div>
    </div>
  );
};

export default AdminUsers;