import React, { useEffect, useState } from 'react';
import { carService } from '../../services/carService';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, Clock } from 'lucide-react';

const AdminCarApprovals = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingCars = () => {
        setLoading(true);
        carService.getPendingCars()
            .then(res => {
                const data = res.data.data?.cars || [];
                setCars(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPendingCars();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading pending approvals...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-500" /> Pending Car Approvals
            </h1>

            {cars.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    All caught up! No cars pending review.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b">
                            <tr>
                                <th className="p-4">Vehicle</th>
                                <th className="p-4">Owner</th>
                                <th className="p-4">License Plate</th>
                                <th className="p-4">Submitted</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cars.map(car => (
                                <tr key={car._id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {car.photos?.[0] ? (
                                                <img src={car.photos[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900">{car.make} {car.model}</p>
                                                <p className="text-xs text-gray-500">{car.year}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-gray-900">{car.owner?.fullName || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{car.owner?.email}</p>
                                    </td>
                                    <td className="p-4 font-mono text-sm">{car.plateNumber}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(car.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link 
                                            to={`/admin/cars/review/${car._id}`}
                                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition"
                                        >
                                            <Eye className="w-4 h-4" /> Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminCarApprovals;
