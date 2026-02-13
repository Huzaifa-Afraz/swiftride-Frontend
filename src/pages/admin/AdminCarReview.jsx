import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carService } from '../../services/carService';
import { CheckCircle, XCircle, AlertTriangle, FileText, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminCarReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        carService.getCarDetails(id)
            .then(res => {
                const data = res.data.data?.car || res.data?.data || res.data;
                setCar(data);
                if (data.photos?.length > 0) setSelectedImage(data.photos[0]);
                setLoading(false);
            })
            .catch(err => {
                Swal.fire('Error', 'Failed to load car details', 'error');
                navigate('/admin/cars/approvals');
            });
    }, [id, navigate]);

    // ... handleApprove / handleReject ...

    const handleApprove = () => {
        Swal.fire({
            title: 'Approve Car?',
            text: "This car will become visible to users immediately.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            confirmButtonText: 'Yes, Approve'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await carService.approveCar(id);
                    Swal.fire('Approved!', 'Car is now live.', 'success').then(() => navigate('/admin/cars/approvals'));
                } catch (err) {
                    Swal.fire('Error', err.response?.data?.message || 'Failed to approve', 'error');
                }
            }
        });
    };

    const handleReject = () => {
        Swal.fire({
            title: 'Reject Car',
            input: 'textarea',
            inputLabel: 'Reason for Rejection',
            inputPlaceholder: 'e.g. Insurance document is blurry...',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'Reject Car',
            inputValidator: (value) => {
                if (!value) return 'You need to write a reason!';
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await carService.rejectCar(id, result.value);
                    Swal.fire('Rejected', 'Car has been rejected and owner notified.', 'info').then(() => navigate('/admin/cars/approvals'));
                } catch (err) {
                    Swal.fire('Error', err.response?.data?.message || 'Failed to reject', 'error');
                }
            }
        });
    };

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (loading) return <div className="p-10 text-center">Loading details...</div>;
    if (!car) return <div className="p-10 text-center">Car not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to List
            </button>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{car.make} {car.model} ({car.year})</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${car.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                              car.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'}`}>
                            {car.approvalStatus}
                        </span>
                        <span className="text-gray-500 text-sm">Owner: <b>{car.owner?.fullName}</b></span>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button onClick={handleReject} className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition">
                        <XCircle className="w-5 h-5" /> Reject
                    </button>
                    <button onClick={handleApprove} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-lg shadow-green-200">
                        <CheckCircle className="w-5 h-5" /> Approve
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Photos & Specs */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Image Gallery */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="h-96 w-full bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                            {selectedImage ? (
                                <img src={selectedImage} alt="Main View" className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Photos Available</div>
                            )}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {car.photos?.map((photo, i) => (
                                <button key={i} onClick={() => setSelectedImage(photo)} 
                                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${selectedImage === photo ? 'border-indigo-600' : 'border-transparent'}`}>
                                    <img src={photo} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Vehicle Specifications</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Color</span>
                                <span className="font-medium text-gray-900">{car.color}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Transmission</span>
                                <span className="font-medium text-gray-900">{car.transmission}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Fuel Type</span>
                                <span className="font-medium text-gray-900">{car.fuelType}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Seats</span>
                                <span className="font-medium text-gray-900">{car.seats}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">License Plate</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">{car.plateNumber}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Active Status</span>
                                <span className={`font-bold ${car.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                    {car.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {car.features?.length > 0 ? car.features.map((f, i) => (
                                <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">{f}</span>
                            )) : <span className="text-gray-500 italic">No specific features listed</span>}
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" /> Availability Rules
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Daily Timing</span>
                                <p className="font-bold text-gray-900">{car.availability?.startTime} - {car.availability?.endTime}</p>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Weekly Schedule</span>
                                <div className="flex gap-1 mt-1">
                                    {DAYS.map((d, i) => (
                                        <div key={d} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold 
                                            ${car.availability?.daysOfWeek?.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {d.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                            <MapPin className="w-5 h-5 text-gray-400" /> Location
                        </h3>
                        <p className="text-gray-600 font-medium">{car.location?.address}</p>
                    </div>
                </div>

                {/* Right Column: Insurance & Pricing */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Pricing</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Price per Hour</span>
                                <span className="font-bold text-lg">PKR {car.pricePerHour}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Price per Day</span>
                                <span className="font-bold text-lg">PKR {car.pricePerDay}</span>
                            </div>
                        </div>
                    </div>

                    {/* Insurance Card */}
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                        <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2 border-b border-orange-200 pb-2">
                            <FileText className="w-5 h-5" /> Insurance Details
                        </h3>
                        
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-orange-700/70 text-xs uppercase font-bold mb-1">Provider</label>
                                    <p className="font-bold text-gray-900">{car.insuranceDetails?.provider || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-orange-700/70 text-xs uppercase font-bold mb-1">Type</label>
                                    <p className="font-bold text-gray-900">{car.insuranceDetails?.type || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-orange-700/70 text-xs uppercase font-bold mb-1">Policy Number</label>
                                <p className="font-mono text-gray-900 bg-white/60 p-2 rounded block">{car.insuranceDetails?.policyNumber || 'N/A'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-orange-700/70 text-xs uppercase font-bold mb-1">Start Date</label>
                                    <p className="font-medium text-gray-900">{car.insuranceDetails?.startDate ? new Date(car.insuranceDetails.startDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-orange-700/70 text-xs uppercase font-bold mb-1">Expiry Date</label>
                                    <p className={`font-medium ${new Date(car.insuranceDetails?.expiryDate) < new Date() ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                                        {car.insuranceDetails?.expiryDate ? new Date(car.insuranceDetails.expiryDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {car.insuranceDetails?.documentUrl ? (
                                <a href={car.insuranceDetails.documentUrl} target="_blank" rel="noreferrer" 
                                   className="block w-full text-center bg-white border border-orange-200 text-orange-700 py-2 rounded-lg font-bold hover:bg-orange-100 transition mt-4 shadow-sm">
                                   View Policy Document
                                </a>
                            ) : (
                                <div className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1 bg-red-50 p-2 rounded">
                                    <AlertTriangle className="w-3 h-3" /> No Document Uploaded
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Owner Info */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                         <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Owner Information</h3>
                         <div className="space-y-2 text-sm">
                            <p className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-medium">{car.owner?.fullName}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Email:</span> <span className="font-medium">{car.owner?.email}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Role:</span> <span className="capitalize">{car.ownerRole}</span></p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCarReview;
