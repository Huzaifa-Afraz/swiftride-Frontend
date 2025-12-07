import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycService } from '../../services/kycService';
import useAuth from '../../hooks/useAuth';
import { showAlert } from '../../utils/alert';
import { FileText, CheckCircle, Camera, RefreshCw, Image as ImageIcon } from 'lucide-react';

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
      showAlert('Missing Selfie', 'Please take a selfie to continue.', 'warning');
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
                <h3 className="font-bold text-gray-700 mb-4">Selfie Verification</h3>
                {/* Replaced video capture with simple native camera capture */}
                <NativeCameraCapture onCapture={handleSelfieCapture} />
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

// --- HELPER 2: NATIVE CAMERA CAPTURE (IMAGE ONLY) ---
const NativeCameraCapture = ({ onCapture }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleClick = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreview(url);
      onCapture(file);
    }
  };

  const handleRetake = (e) => {
    e.preventDefault();
    setPreview(null);
    onCapture(null);
    // Optional: Reset input value to allow selecting same file again
    if(inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Hidden Input that forces Camera on Mobile */}
      <input 
        type="file" 
        accept="image/*" 
        capture="user" // This attribute forces front camera on mobile
        className="hidden" 
        ref={inputRef}
        onChange={handleChange}
      />

      {!preview ? (
        <button 
          onClick={handleClick}
          className="flex flex-col items-center gap-2 text-gray-500 hover:text-indigo-600 transition p-8 border-2 border-dashed border-indigo-200 bg-white rounded-xl w-full max-w-xs cursor-pointer hover:bg-indigo-50"
        >
          <div className="bg-indigo-100 p-4 rounded-full">
            <Camera className="w-10 h-10 text-indigo-600" />
          </div>
          <span className="font-bold text-lg">Take a Selfie</span>
          <span className="text-xs text-gray-400">Click to open camera</span>
        </button>
      ) : (
        <div className="relative w-full max-w-sm mx-auto">
          <img 
            src={preview} 
            alt="Selfie Preview" 
            className="w-full h-64 object-cover rounded-xl shadow-lg border-4 border-white" 
          />
          <button 
            onClick={handleRetake}
            className="absolute top-3 right-3 bg-white/90 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-white flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Retake
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg">
             <CheckCircle className="w-5 h-5" />
             <span className="font-bold text-sm">Selfie Captured</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCSubmit;