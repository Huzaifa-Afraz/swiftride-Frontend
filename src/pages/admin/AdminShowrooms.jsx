import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Building2, MapPin } from 'lucide-react';

const AdminShowrooms = () => {
  const [showrooms, setShowrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getUsers('showroom', {})
      .then(res => {
        // --- CRITICAL SAFETY CHECK ---
        const dataList = res.data.docs || res.data?.data || [];
        setShowrooms(Array.isArray(dataList) ? dataList : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setShowrooms([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Showroom Partners</h1>
      
      {!loading && showrooms.length === 0 && (
        <div className="text-center p-10 text-gray-500 bg-white rounded-xl shadow-sm border">
          No showroom accounts found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showrooms.map(room => (
          <div key={room._id} className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{room.showroomName}</h3>
                <p className="text-xs text-gray-500">Joined {new Date(room.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Islamabad
              </div>
              <div>Email: {room.email}</div>
              <div className="flex justify-between items-center pt-2 border-t mt-2">
                <span className="font-bold">Cars Listed: {room.carCount || 0}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${room.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {room.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-center p-10">Loading showrooms...</div>}
    </div>
  );
};

export default AdminShowrooms;