import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycService } from '../../services/kycService';
import useAuth from '../../hooks/useAuth';
import { showAlert } from '../../utils/alert';
import { FileText, CheckCircle, Camera, RefreshCw } from 'lucide-react';

// --- MAIN PAGE COMPONENT ---
const KYCSubmit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({});

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSelfieCapture = (file) => {
    setFiles({ ...files, live_selfie: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIX 1: Enforce Selfie check for EVERYONE (including Showroom)
    if (!files.live_selfie) {
      showAlert('Missing Selfie', 'Please capture a live selfie to continue.', 'warning');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.keys(files).forEach(key => formData.append(key, files[key]));

    try {
      user.role === 'showroom' 
        ? await kycService.submitShowroomKYC(formData)
        : await kycService.submitUserKYC(formData);
      
      showAlert('Success!', 'Documents submitted successfully.', 'success');
      navigate('/dashboard/profile');
    } catch (error) {
      showAlert('Upload Failed', error.response?.data?.message || 'Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Your Identity</h1>
          <p className="text-gray-500 mt-2">
            Please submit the required documents.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- COMMON SECTION FOR EVERYONE (Selfie) --- */}
          {/* Moving selfie here ensures both Showroom and Users see it */}
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center">
             <h3 className="font-bold text-indigo-900 mb-2">1. Live Selfie Verification</h3>
             <p className="text-sm text-indigo-600 mb-4">Required for all account types</p>
             <LiveSelfieCapture onCapture={handleSelfieCapture} />
          </div>

          {/* --- USER / CUSTOMER SPECIFIC --- */}
          {user?.role !== 'showroom' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileInput label="ID Card (Front)" name="id_front" onChange={handleFileChange} />
                <FileInput label="ID Card (Back)" name="id_back" onChange={handleFileChange} />
              </div>
              
              {user?.role === 'customer' && (
                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <FileInput label="Driving License" name="driving_license" onChange={handleFileChange} />
                    <p className="text-xs text-blue-600 mt-2 ml-1">Required for insurance compliance.</p>
                 </div>
              )}
            </>
          )}

          {/* --- SHOWROOM SPECIFIC (Now includes Owner ID) --- */}
          {user?.role === 'showroom' && (
            <>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                 <h4 className="text-sm font-bold text-yellow-800 mb-2">2. Business Documentation</h4>
                 <p className="text-xs text-yellow-700">Please upload your official business documents.</p>
              </div>

              {/* Business Docs */}
              <FileInput label="Business Registration" name="registration_cert" onChange={handleFileChange} />
              <FileInput label="Tax Certificate (NTN)" name="tax_cert" onChange={handleFileChange} />
              <FileInput label="Utility Bill (Proof of Address)" name="other_doc" onChange={handleFileChange} />

              {/* FIX 2: Added Owner ID Section for Showroom */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-4">3. Owner Identity (CNIC)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileInput label="Owner ID Front" name="id_front" onChange={handleFileChange} />
                  <FileInput label="Owner ID Back" name="id_back" onChange={handleFileChange} />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-lg shadow-lg"
          >
            {loading ? 'Uploading...' : <><CheckCircle className="w-6 h-6" /> Submit Verification</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- HELPER 1: FILE INPUT ---
const FileInput = ({ label, name, onChange }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition bg-white">
    <label className="block cursor-pointer">
      <span className="block text-sm font-bold text-gray-700 mb-2">{label}</span>
      <input type="file" name={name} onChange={onChange} required accept="image/*,.pdf" 
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
      />
    </label>
  </div>
);

// --- HELPER 2: LIVE CAMERA COMPONENT ---
const LiveSelfieCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } 
      });
      setStream(mediaStream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(e => console.error("Play error:", e));
        }
      }, 100);
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Camera access denied.");
    }
  };

  const takePhoto = (e) => {
    e.preventDefault();
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        setImage(URL.createObjectURL(blob));
        onCapture(file);
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }, 'image/jpeg', 0.9);
  };

  const reset = (e) => {
    e.preventDefault();
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    onCapture(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error && <div className="text-red-600 bg-red-50 p-2 rounded text-sm">{error}</div>}
      {!stream && !image && (
        <button onClick={(e) => { e.preventDefault(); startCamera(); }} className="flex flex-col items-center gap-2 text-gray-500 hover:text-indigo-600 transition p-6 border-2 border-dashed border-gray-300 rounded-xl w-full">
          <Camera className="w-8 h-8" /> <span className="font-bold">Start Camera</span>
        </button>
      )}
      {stream && !image && (
        <div className="relative w-full max-w-sm bg-black rounded-xl overflow-hidden shadow-lg">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover transform -scale-x-100" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button onClick={takePhoto} className="w-12 h-12 bg-red-500 rounded-full border-4 border-white shadow-lg"></button>
          </div>
        </div>
      )}
      {image && (
        <div className="relative w-full max-w-sm">
          <img src={image} alt="Selfie" className="w-full h-64 object-cover rounded-xl" />
          <button onClick={reset} className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Retake</button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default KYCSubmit;