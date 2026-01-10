import React, { useEffect, useState } from 'react';
import { walletService } from '../../services/walletService';
import { Wallet as WalletIcon, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import WithdrawalModal from '../../components/wallet/WithdrawalModal';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const walletRes = await walletService.getMyWallet();
      // Expecting { wallet, transactions, withdrawalRequests } structure now
      const data = walletRes.data.data; 
      
      setWallet(data.wallet);
      setTransactions(data.transactions || []);
      setWithdrawals(data.withdrawalRequests || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Wallet load error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading wallet...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex items-center gap-2"
        >
          <ArrowUpRight size={20} /> Request Withdrawal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <WalletIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Available Balance</span>
          </div>
          <div className="text-4xl font-bold">PKR {wallet?.balanceAvailable || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Pending Clearance</span>
          </div>
          <div className="text-4xl font-bold text-gray-800">PKR {wallet?.balancePending || 0}</div>
        </div>
      </div>

      {/* Active Requests */}
      {withdrawals.filter(r => r.status === 'pending').length > 0 && (
        <div className="mb-10 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-orange-50">
                <h2 className="font-bold text-orange-800">Active Withdrawal Requests</h2>
            </div>
            <div className="p-6">
                {withdrawals.filter(r => r.status === 'pending').map(req => (
                    <div key={req._id} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
                        <div>
                            <p className="font-bold text-gray-800">PKR {req.amount}</p>
                            <p className="text-sm text-gray-500">
                                To: {req.bankDetails?.bankName} - {req.bankDetails?.accountNumber}
                            </p>
                            <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">
                            {req.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Withdrawal History */}
      {withdrawals.filter(r => r.status !== 'pending').length > 0 && (
        <div className="mb-10 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-700">Withdrawal History</h2>
            </div>
            <div className="p-6">
                {withdrawals.filter(r => r.status !== 'pending').map(req => (
                    <div key={req._id} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
                        <div>
                            <p className="font-bold text-gray-800">PKR {req.amount}</p>
                            <p className="text-sm text-gray-500">
                                To: {req.bankDetails?.bankName}
                            </p>
                            <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                            {req.proofImage && (
                                <a href={req.proofImage} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline block mt-1">
                                    View Proof of Payment
                                </a>
                            )}
                            {req.adminNote && (
                                <p className="text-xs text-red-500 mt-1">Note: {req.adminNote}</p>
                            )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {req.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-700">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length > 0 ? transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                      tx.type === 'earning' ? 'bg-green-100 text-green-700' : 
                      tx.type === 'withdrawal' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {tx.type === 'earning' ? <ArrowDownLeft className="w-3 h-3"/> : <ArrowUpRight className="w-3 h-3"/>}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {tx.description || (tx.referenceId ? `Ref: ${tx.referenceId.substring(0,8)}` : 'Transaction')}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${['payout', 'withdrawal'].includes(tx.type) ? 'text-red-500' : 'text-green-600'}`}>
                    {['payout', 'withdrawal'].includes(tx.type) ? '-' : '+'} PKR {tx.amount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                        tx.status === 'available' || tx.status === 'paid_out' ? 'bg-gray-100 text-gray-600' : 
                        tx.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                        tx.status === 'declined' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-50 text-yellow-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WithdrawalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxAmount={wallet?.balanceAvailable || 0}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Wallet;