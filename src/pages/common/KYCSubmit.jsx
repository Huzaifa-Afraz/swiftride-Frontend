import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycService } from '../../services/kycService';
import useAuth from '../../hooks/useAuth';
import { showAlert } from '../../utils/alert';
import { FileText, CheckCircle, Camera, RefreshCw, AlertTriangle } from 'lucide-react';

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
    if (user.role !== 'showroom' && !files.live_selfie) {
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
      navigate('/profile');
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {user?.role !== 'showroom' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileInput label="ID Card (Front)" name="id_front" onChange={handleFileChange} />
                <FileInput label="ID Card (Back)" name="id_back" onChange={handleFileChange} />
              </div>
              <FileInput label="Driving License" name="driving_license" onChange={handleFileChange} />
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                <h3 className="font-bold text-gray-700 mb-4">Live Selfie Verification</h3>
                <LiveSelfieCapture onCapture={handleSelfieCapture} />
              </div>
            </>
          )}

          {user?.role === 'showroom' && (
            <>
              <FileInput label="Business Registration" name="registration_doc" onChange={handleFileChange} />
              <FileInput label="Tax Certificate (NTN)" name="tax_certificate" onChange={handleFileChange} />
              <FileInput label="Utility Bill" name="utility_bill" onChange={handleFileChange} />
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
  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition">
    <label className="block cursor-pointer">
      <span className="block text-sm font-bold text-gray-700 mb-2">{label}</span>
      <input type="file" name={name} onChange={onChange} required accept="image/*,.pdf" 
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
      />
    </label>
  </div>
);

// --- HELPER 2: ROBUST CAMERA COMPONENT ---
const LiveSelfieCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [videoReady, setVideoReady] = useState(false); // New state to track readiness

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Camera access denied. Please allow camera permissions in your browser.");
    }
  };

  const takePhoto = (e) => {
    e.preventDefault();
    
    if (!videoRef.current || !canvasRef.current || !videoReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Explicitly set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    
    // 1. Flip context horizontally to match the mirrored video
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    // 2. Draw image
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 3. Convert to Blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        const previewUrl = URL.createObjectURL(blob);
        setImage(previewUrl);
        onCapture(file);
        
        // Stop camera stream to save resources
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setVideoReady(false);
      }
    }, 'image/jpeg', 0.8);
  };

  const reset = (e) => {
    e.preventDefault();
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    onCapture(null);
    setVideoReady(false);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      {/* STATE 1: IDLE (No Camera, No Image) */}
      {!stream && !image && (
        <button onClick={(e) => { e.preventDefault(); startCamera(); }} className="flex flex-col items-center gap-2 text-gray-500 hover:text-indigo-600 transition p-4 border-2 border-dashed border-gray-300 rounded-xl w-full">
          <Camera className="w-10 h-10 text-indigo-500" />
          <span className="font-bold">Click to Open Camera</span>
        </button>
      )}

      {/* STATE 2: STREAMING (Camera Active) */}
      {stream && !image && (
        <div className="relative w-full max-w-sm bg-black rounded-xl overflow-hidden shadow-lg border-4 border-white">
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            onCanPlay={() => setVideoReady(true)} // Wait for this event!
            className="w-full h-64 object-cover transform -scale-x-100"
          />
          {videoReady && (
            <button 
              onClick={takePhoto}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-lg active:scale-95 transition"
            >
              <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-white"></div>
            </button>
          )}
          {!videoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              Loading...
            </div>
          )}
        </div>
      )}

      {/* STATE 3: PREVIEW (Image Captured) */}
      {image && (
        <div className="relative w-full max-w-sm">
          <img src={image} alt="Selfie" className="w-full h-64 object-cover rounded-xl shadow-lg border-4 border-white" />
          <button 
            onClick={reset}
            className="absolute top-3 right-3 bg-white/90 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-white flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Retake
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default KYCSubmit;