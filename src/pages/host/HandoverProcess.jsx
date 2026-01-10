import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Upload, X, CheckCircle, AlertTriangle } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { showAlert } from '../../utils/alert';

const HandoverProcess = () => {
    const { bookingId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    if (!state) {
        return <div className="p-8 text-center">Invalid Session. <button onClick={() => navigate('/host/dashboard')} className="text-indigo-600 underline">Go Back</button></div>;
    }

    const { step, customerName, carName } = state;
    const isPickup = step === 'pickup';

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 8) {
            showAlert("Error", "Maximum 8 images allowed", "warning");
            return;
        }
        
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (images.length < 4) {
            showAlert("Error", "Please upload at least 4 images", "error");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('bookingId', bookingId);
        images.forEach(img => formData.append('images', img.file));

        try {
            const endpoint = isPickup ? '/handover/pickup' : '/handover/return';
            await apiClient.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showAlert("Success", isPickup ? "Trip Started Successfully!" : "Trip Completed Successfully!", "success");
            navigate('/host/dashboard'); // Or booking details
        } catch (err) {
            console.error(err);
            showAlert("Error", err.response?.data?.message || "Upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {isPickup ? "Pickup Handover" : "Return Handover"}
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                        Customer: <strong>{customerName}</strong>
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                        Car: <strong>{carName}</strong>
                    </span>
                </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg">Evidence Photos</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${images.length >= 4 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {images.length}/8 (Min 4)
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group">
                            <img src={img.preview} alt="Upload" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    
                    {images.length < 8 && (
                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition text-gray-400 hover:text-indigo-600">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-xs font-semibold">Add Photo</span>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                        </label>
                    )}
                </div>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                        Please take clear photos of the car's condition (front, back, sides, interior) 
                        to ensure fair claim handling. These photos will be used as official evidence.
                    </p>
                </div>
            </div>

            {/* Action Bar */}
            <button
                onClick={handleSubmit}
                disabled={images.length < 4 || uploading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition flex items-center justify-center gap-2
                    ${images.length >= 4 && !uploading 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-[1.02]' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
                {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                    <>
                        <CheckCircle className="w-6 h-6" />
                        {isPickup ? "Confirm Pickup & Start Trip" : "Confirm Return & Complete"}
                    </>
                )}
            </button>
        </div>
    );
};

export default HandoverProcess;
