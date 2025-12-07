import React, { useEffect, useState } from 'react';
import { walletService } from '../../services/walletService';
import { Wallet as WalletIcon, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          walletService.getMyWallet(),
          walletService.getTransactions()
        ]);
        setWallet(walletRes.data);
        setTransactions(txRes.data.docs || txRes.data); // Handle pagination structure
        setLoading(false);
      } catch (error) {
        console.error("Wallet load error", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading wallet...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-2 opacity-80">
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

      {/* Transactions Table */}
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
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                      tx.type === 'earning' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tx.type === 'earning' ? <ArrowDownLeft className="w-3 h-3"/> : <ArrowUpRight className="w-3 h-3"/>}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {tx.description || `Booking Payment #${tx.referenceId?.substring(0,8)}`}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${tx.type === 'payout' ? 'text-red-500' : 'text-green-600'}`}>
                    {tx.type === 'payout' ? '-' : '+'} PKR {tx.amount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xs px-2 py-1 rounded ${tx.status === 'available' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;