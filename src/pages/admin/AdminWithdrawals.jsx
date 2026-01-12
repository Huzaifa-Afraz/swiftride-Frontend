import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { Check, X, Eye, Upload, FileText } from 'lucide-react';

const AdminWithdrawals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject' | 'view_details'
  const [adminNote, setAdminNote] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [pendingDetails, setPendingDetails] = useState([]); // For viewing pending earnings

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/wallets/admin/withdrawals');
      // Expecting { success: true, data: { requests: [] } }
      setRequests(res.data.data.requests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching withdrawals", error);
      setLoading(false);
    }
  };

  const handleOpenModal = async (req, type) => {
    setSelectedRequest(req);
    setActionType(type);
    setAdminNote('');
    setProofFile(null);
    setPendingDetails([]);

    if (type === 'view_details' && req.user) {
        try {
            const res = await apiClient.get(`/wallets/admin/wallet/${req.user._id}/pending-earnings`);
            setPendingDetails(res.data.data.transactions);
        } catch (error) {
            console.error("Failed to load details", error);
        }
    }
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setActionType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest || actionType === 'view_details') return;
    
    setProcessLoading(true);
    try {
        const formData = new FormData();
        formData.append("status", actionType === 'approve' ? 'approved' : 'rejected');
        formData.append("adminNote", adminNote);
        
        if (actionType === 'approve' && proofFile) {
            formData.append("proof", proofFile);
        }

        await apiClient.patch(`/wallets/admin/withdrawals/${selectedRequest._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        // Update UI
        setRequests(prev => prev.map(r => 
            r._id === selectedRequest._id 
            ? { ...r, status: actionType === 'approve' ? 'approved' : 'rejected' } 
            : r
        ));
        closeModal();
    } catch (error) {
        console.error("Error processing withdrawal", error);
        alert("Action failed: " + (error.response?.data?.message || error.message));
    } finally {
        setProcessLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Withdrawal Requests</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Bank Details</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map(req => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {req.user?.fullName} <br/>
                  <span className="text-xs text-gray-400">{req.user?.email}</span>
                </td>
                <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-800">Req: PKR {req.amount}</span>
                        {req.userStats && (
                            <div className="text-xs text-gray-500 bg-gray-100 p-1 rounded">
                                <div>Avail: <b>{req.userStats.balanceAvailable}</b></div>
                                <div>Pending: <b>{req.userStats.balancePending}</b></div>
                                <div>Pending Bookings: <b>{req.userStats.pendingBookingsCount}</b></div>
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex flex-col">
                    <span className="font-semibold">{req.bankDetails?.bankName}</span>
                    <span className="text-xs">{req.bankDetails?.accountNumber}</span>
                    <span className="text-xs text-gray-400">{req.bankDetails?.accountTitle}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                    req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    req.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 items-start">
                  
                  <button 
                    onClick={() => handleOpenModal(req, 'view_details')}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>

                  {req.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleOpenModal(req, 'approve')}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                         onClick={() => handleOpenModal(req, 'reject')}
                         className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                         title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                  </div>
                  {req.proofImage && (
                    <a href={req.proofImage} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center justify-end gap-1 mt-1">
                        <FileText size={12}/> View Proof
                    </a>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ACTION MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-2xl w-full p-6 ${actionType === 'view_details' ? 'max-w-2xl' : 'max-w-md'}`}>
                
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold capitalize">
                        {actionType === 'view_details' ? 'Pending Earnings Detail' : `${actionType} Request`}
                    </h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>

                {actionType === 'view_details' ? (
                     <div>
                        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
                             <div>
                                <p className="text-sm text-gray-500">User</p>
                                <p className="font-bold">{selectedRequest.user?.fullName}</p>
                             </div>
                             <div>
                                <p className="text-sm text-gray-500">Requested Withdrawal</p>
                                <p className="font-bold text-lg text-indigo-600">PKR {selectedRequest.amount}</p>
                             </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                             <h4 className="font-bold text-gray-700">Pending Bookings (Funds on Hold)</h4>
                             <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                Total: PKR {pendingDetails.reduce((sum, tx) => sum + (tx.amount || 0), 0)}
                             </span>
                        </div>
                        {pendingDetails.length > 0 ? (
                            <div className="overflow-y-auto max-h-60 border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-left sticky top-0">
                                        <tr>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Booking Invoice</th>
                                            <th className="p-3 text-right">Earning Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {pendingDetails.map(tx => (
                                            <tr key={tx._id}>
                                                <td className="p-3 text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3 font-medium">
                                                    {tx.booking?.invoiceNumber || '#NA'}
                                                    <span className="block text-xs text-gray-400">{tx.booking?.status}</span>
                                                </td>
                                                <td className="p-3 text-right font-bold text-orange-600">
                                                    PKR {tx.amount}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center py-6 text-gray-500 border rounded-lg border-dashed">No pending bookings found.</p>
                        )}
                        
                        <div className="mt-6 flex justify-end">
                             <button onClick={closeModal} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700">Close</button>
                        </div>
                     </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-4">
                            Amount: <b>PKR {selectedRequest.amount}</b> <br/>
                            To: {selectedRequest.bankDetails?.bankName} - {selectedRequest.bankDetails?.accountNumber}
                        </p>

                        <form onSubmit={handleSubmit}>
                            {actionType === 'approve' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Proof of Payment</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition relative">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={e => setProofFile(e.target.files[0])}
                                            required
                                        />
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <Upload size={24}/>
                                            <span className="text-sm">{proofFile ? proofFile.name : "Click to upload screenshot"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {actionType === 'approve' ? 'Admin Note (Optional)' : 'Rejection Reason'}
                                </label>
                                <textarea
                                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    rows="3"
                                    value={adminNote}
                                    onChange={e => setAdminNote(e.target.value)}
                                    placeholder={actionType === 'approve' ? "Transaction ID, comments..." : "Processing error, invalid details..."}
                                    required={actionType === 'reject'}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-xl font-bold hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processLoading}
                                    className={`flex-1 py-3 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                                        actionType === 'approve' 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {processLoading ? "Processing..." : (actionType === 'approve' ? "Confirm Approval" : "Confirm Rejection")}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
