import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carService } from '../../services/carService';
import { Plus, MapPin, Fuel, Settings, AlertCircle } from 'lucide-react';

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carService.getMyCars()
      .then(res => {
        // SAFETY FIX: Ensure 'data' is always an array
        const data = res.data.docs || res?.data?.data?.cars || [];
        setCars(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load cars", err);
        setCars([]); // Fallback to empty array
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading your fleet...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Fleet</h1>
        <Link to="/host/add-car" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-indigo-700 transition shadow">
          <Plus className="w-5 h-5" /> Add New Car
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">You haven't listed any cars yet.</p>
          <Link to="/host/add-car" className="text-indigo-600 font-bold hover:underline">List your first car</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car._id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-48 bg-gray-200 relative">
                {car.photos?.[0] ? (
                  <img src={car.photos[0]} alt={car.make} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                   {/* Approval Status Badge */}
                   {car.approvalStatus === 'approved' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Approved</span>}
                   {car.approvalStatus === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Pending Review</span>}
                   {car.approvalStatus === 'rejected' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Rejected</span>}
                   {car.approvalStatus === 'suspended' && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">Suspended</span>}
                   
                   {/* Attempts Counter */}
                   {car.approvalStatus === 'rejected' && !car.isPermanentlyBanned && (
                      <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold border border-orange-200">
                        {3 - (car.reviewAttempts || 0)} attempts left
                      </span>
                   )}
                   {/* Permanent Ban Badge */}
                   {car.isPermanentlyBanned && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow-sm animate-pulse">
                        PERMANENTLY BANNED
                      </span>
                   )}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{car.make} {car.model}</h3>
                <p className="text-gray-500 text-sm mb-4">{car.year} • {car.plateNumber}</p>
                
                {/* Rejection Reason */}
                {(car.approvalStatus === 'rejected' || car.isPermanentlyBanned) && car.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
                    <span className="font-bold block mb-1">
                       {car.isPermanentlyBanned ? 'BANNED REASON:' : 'Action Required:'}
                    </span>
                    {car.rejectionReason}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2"><Fuel className="w-4 h-4"/> {car.fuelType}</div>
                  <div className="flex items-center gap-2"><Settings className="w-4 h-4"/> {car.transmission}</div>
                  <div className="flex items-center gap-2 col-span-2"><MapPin className="w-4 h-4"/> {car.location.address}</div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-bold text-indigo-600">PKR {car.pricePerDay}/day</span>
                  <div className="flex gap-3">
                    {!car.isPermanentlyBanned ? (
                      <Link to={`/host/edit-car/${car._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit</Link>
                    ) : (
                      <span className="text-sm font-medium text-gray-400 cursor-not-allowed" title="This car is banned">Edit Disabled</span>
                    )}
                    <Link to={`/cars/${car._id}`} className="text-sm text-gray-500 hover:text-indigo-600">View Listing</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCars;