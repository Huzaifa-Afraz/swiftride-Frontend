import React, { useState } from 'react';

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showroomName, setShowroomName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    if (selectedRole === 'showroom' && !showroomName.trim()) {
      setError('Please enter your showroom name');
      return;
    }
    onRoleSelect(selectedRole, showroomName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Complete Your Profile</h2>
        <p className="mb-6 text-gray-600 text-center">Please select your account type to continue.</p>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => { setSelectedRole('customer'); setError(''); }}
            className={`w-full p-4 rounded border-2 transition-all ${
              selectedRole === 'customer'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <span className="block font-semibold">I want to rent a car (Customer)</span>
          </button>

          <button
            onClick={() => { setSelectedRole('host'); setError(''); }}
            className={`w-full p-4 rounded border-2 transition-all ${
              selectedRole === 'host'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <span className="block font-semibold">I want to list my car (Host)</span>
          </button>
          
           <button
            onClick={() => { setSelectedRole('showroom'); setError(''); }}
            className={`w-full p-4 rounded border-2 transition-all ${
              selectedRole === 'showroom'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <span className="block font-semibold">I am a Showroom Owner</span>
          </button>
        </div>

        {selectedRole === 'showroom' && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Showroom Name</label>
            <input
              type="text"
              value={showroomName}
              onChange={(e) => setShowroomName(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your showroom name"
              required
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="flex justify-between gap-4">
           <button
            onClick={onClose}
             className="w-1/3 bg-gray-200 text-gray-800 py-2 rounded font-bold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-2/3 bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
