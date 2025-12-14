import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { Check, X, FileText, AlertCircle, Eye, XCircle } from 'lucide-react';
import { showAlert } from '../../utils/alert';

// --- HELPER: Convert Windows Path to Server URL ---
const getDocUrl = (path) => {
  if (!path) return null;
  // If already http, return as is
  if (path.startsWith('http')) return path;

  // Split at 'uploads' to remove the local D:\ stuff
  // Input: "D:\\finalyearproject\\new\\backend\\uploads\\kyc\\image.png"
  // Output: "/kyc/image.png"
  const parts = path.split('uploads');
  const relativePath = parts.length > 1 ? parts[1] : path;

  // Replace Windows backslashes with web forward slashes
  const cleanPath = relativePath.replace(/\\/g, '/');

  // Prepend your backend URL (Adjust port if needed)
  const baseUrl = 'http://localhost:5000/uploads'; 
  return `${baseUrl}${cleanPath}`;
};

const AdminKYC = () => {
  const [kycList, setKycList] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  
  // --- MODAL STATE ---
  const [selectedImage, setSelectedImage] = useState(null); // URL to show
  const [selectedTitle, setSelectedTitle] = useState('');   // Title for modal

  const fetchKyc = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/kyc', {
        params: { status: filter, page: 1, limit: 20 }
      });
      
      // Safety check for data structure
      const data = res.data.docs || res.data?.data?.data || res.data || [];
      setKycList(Array.isArray(data) ? data : []); 
      
    } catch (error) {
      console.error("Failed to fetch KYC", error);
      setKycList([]); 
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

  // Open the modal
  const openPreview = (path, title) => {
    const url = getDocUrl(path);
    if (url) {
      setSelectedImage(url);
      setSelectedTitle(title);
    }
  };

  // Close the modal
  const closePreview = () => {
    setSelectedImage(null);
    setSelectedTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative">
      
      {/* --- IMAGE MODAL POPUP --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={closePreview}>
          <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] relative flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">{selectedTitle}</h3>
              <button onClick={closePreview} className="text-gray-500 hover:text-red-500 transition">
                <XCircle className="w-8 h-8" />
              </button>
            </div>
            <div className="p-4 bg-gray-900 flex items-center justify-center flex-grow overflow-auto">
              <img 
                src={selectedImage} 
                alt="Document Preview" 
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400?text=Image+Not+Found"; }}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
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
              {kycList.length > 0 ? kycList.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{item.user?.fullName || 'Unknown User'}</div>
                    <div className="text-sm text-gray-500">{item.user?.email}</div>
                  </td>
                  <td className="p-4 capitalize">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Document Buttons - Trigger Modal */}
                      {item.idFrontPath && (
                        <button 
                          onClick={() => openPreview(item.idFrontPath, 'ID Card Front')}
                          className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                        >
                          <Eye className="w-3 h-3" /> ID Front
                        </button>
                      )}
                      
                      {item.idBackPath && (
                        <button 
                          onClick={() => openPreview(item.idBackPath, 'ID Card Back')}
                          className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                        >
                          <Eye className="w-3 h-3" /> ID Back
                        </button>
                      )}

                      {item.liveSelfiePath && (
                        <button 
                          onClick={() => openPreview(item.liveSelfiePath, 'Live Selfie')}
                          className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                        >
                          <Eye className="w-3 h-3" /> Selfie
                        </button>
                      )}

                      {item.drivingLicensePath && (
                        <button 
                          onClick={() => openPreview(item.drivingLicensePath, 'Driving License')}
                          className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                        >
                          <Eye className="w-3 h-3" /> License
                        </button>
                      )}
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