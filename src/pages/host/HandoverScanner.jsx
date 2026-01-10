import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, AlertCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { showAlert } from '../../utils/alert';

const HandoverScanner = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = async (result) => {
        if (!result || !result[0]?.rawValue) return;
        
        const qrCode = result[0].rawValue;
        console.log("Scanned QR:", qrCode);
        setScanning(false);
        setLoading(true);

        try {
            const res = await apiClient.post('/handover/scan', { qrCode });
            const data = res.data.data;
            
            showAlert("Success", "QR Code Verified", "success");
            
            // Navigate to process page with booking details
            navigate(`/host/handover/${data.bookingId}`, { 
                state: { 
                    step: data.step, // 'pickup' or 'return'
                    customerName: data.customerName,
                    carName: data.carName
                } 
            });

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Invalid QR Code or Unauthorized");
            // showAlert("Error", "Invalid QR Code", "error");
            setTimeout(() => {
                setScanning(true); // Restart scanning after error
                setLoading(false);
                setError(null);
            }, 3000);
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-900 text-white flex flex-col">
            <div className="p-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-800 rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Scan QR Code</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full aspect-square bg-black rounded-3xl overflow-hidden border-2 border-indigo-500 relative shadow-2xl">
                    {scanning && (
                        <Scanner 
                            onScan={handleScan}
                            scanDelay={500}
                        />
                    )}
                    {!scanning && loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center space-y-4">
                    {error ? (
                        <div className="flex items-center justify-center gap-2 text-red-400 bg-red-900/20 px-4 py-3 rounded-xl border border-red-500/50">
                            <AlertCircle className="w-5 h-5" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <p className="text-gray-400">
                            Align the customer's QR code within the frame to verify booking.
                        </p>
                    )}
                    
                    <button 
                        onClick={() => setScanning(!scanning)}
                        className="bg-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto hover:bg-indigo-700 transition"
                    >
                        <Camera className="w-5 h-5" />
                        {scanning ? "Stop Camera" : "Start Camera"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HandoverScanner;
