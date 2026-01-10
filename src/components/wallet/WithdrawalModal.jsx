import React, { useState } from 'react';
import { X } from 'lucide-react';
import { walletService } from '../../services/walletService';

const WithdrawalModal = ({ isOpen, onClose, onSuccess, maxAmount }) => {
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (numAmount > maxAmount) {
      setError("Insufficient balance");
      return;
    }
    if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountTitle) {
      setError("Please fill in all required bank details");
      return;
    }

    try {
      setLoading(true);
      await walletService.requestWithdrawal(numAmount, bankDetails);
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Withdrawal failed");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Request Withdrawal</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
            <div className="relative">
                <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="0.00"
                min="1"
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">Max: {maxAmount}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-800">Bank Details</h4>
            <input
              className="w-full px-4 py-2 border rounded-lg text-sm"
              placeholder="Bank Name (e.g. HBL)"
              value={bankDetails.bankName}
              onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})}
            />
            <input
              className="w-full px-4 py-2 border rounded-lg text-sm"
              placeholder="Account Title"
              value={bankDetails.accountTitle}
              onChange={e => setBankDetails({...bankDetails, accountTitle: e.target.value})}
            />
            <input
              className="w-full px-4 py-2 border rounded-lg text-sm"
              placeholder="Account Number"
              value={bankDetails.accountNumber}
              onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})}
            />
             <input
              className="w-full px-4 py-2 border rounded-lg text-sm"
              placeholder="IBAN (Optional)"
              value={bankDetails.iban}
              onChange={e => setBankDetails({...bankDetails, iban: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "Processing..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalModal;
