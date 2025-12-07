import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { Check, X, FileText, AlertCircle } from 'lucide-react';
import { showAlert } from '../../utils/alert';

const AdminKYC = () => {
  // 1. Initialize as empty array [] (Critical fix)
  const [kycList, setKycList] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const fetchKyc = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/kyc', {
        params: { status: filter, page: 1, limit: 20 }
      });
      
      console.log("KYC Data:", res.data); // Debugging

      // 2. SAFETY CHECK: Extract array correctly
      const data = res.data.docs || res.data || [];
      
      // 3. FORCE ARRAY: If it's not an array, force it to be one
      setKycList(Array.isArray(data) ? data : []); 
      
    } catch (error) {
      console.error("Failed to fetch KYC", error);
      setKycList([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, [filter]);

  const handleDecision = async (id, decision) => {
    const endpoint = decision === 'approve' ? 'approve' : 'reject';
    const body = decision === 'reject' ? { reason: 'Document unclear' } : {};
    
    try {
      await apiClient.patch(`/admin/kyc/${id}/${endpoint}`, body);
      showAlert('Success', `KYC ${decision}d successfully`, 'success');
      fetchKyc(); 
    } catch (error) {
      showAlert('Error', 'Action failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">KYC Management</h1>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="border p-2 rounded-lg bg-white shadow-sm outline-none focus:ring-2 ring-indigo-500"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center p-10 text-gray-500">Loading requests...</div>
      ) : (
        <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">User</th>
                <th className="p-4 font-semibold text-gray-600">Type</th>
                <th className="p-4 font-semibold text-gray-600">Documents</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {/* 4. RENDER CHECK: Ensure kycList has items */}
              {kycList.length > 0 ? kycList.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{item.userId?.fullName || 'Unknown User'}</div>
                    <div className="text-sm text-gray-500">{item.userId?.email}</div>
                  </td>
                  <td className="p-4 capitalize">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {item.documents && Object.entries(item.documents).map(([key, url]) => (
                        <a 
                          key={key} 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 text-xs bg-gray-100 border px-2 py-1 rounded hover:bg-gray-200 transition"
                        >
                          <FileText className="w-3 h-3" />
                          {key.replace('_', ' ')}
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {item.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleDecision(item._id, 'approve')} 
                          className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200 transition"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDecision(item._id, 'reject')} 
                          className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200 transition"
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {item.status !== 'pending' && (
                      <span className={`text-sm font-bold capitalize ${item.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-gray-300" />
                      <p>No {filter} KYC requests found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminKYC;