import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycService } from '../../services/kycService';
import useAuth from '../../hooks/useAuth';
import { showAlert } from '../../utils/alert';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const KYCSubmit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Files state
  const [files, setFiles] = useState({});

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(files).forEach(key => {
      formData.append(key, files[key]);
    });

    try {
      if (user.role === 'showroom') {
        await kycService.submitShowroomKYC(formData);
      } else {
        await kycService.submitUserKYC(formData);
      }
      showAlert('Submitted', 'Your KYC documents have been uploaded for review.', 'success');
      navigate('/');
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Your Identity</h1>
          <p className="text-gray-500 mt-2">
            To ensure safety on SwiftRide, we need to verify some documents before you can {user?.role === 'customer' ? 'book a car' : 'list cars'}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* USER / HOST FIELDS */}
          {user?.role !== 'showroom' && (
            <>
              <FileInput label="ID Card (Front)" name="id_front" onChange={handleFileChange} />
              <FileInput label="ID Card (Back)" name="id_back" onChange={handleFileChange} />
              <FileInput label="Live Selfie" name="live_selfie" onChange={handleFileChange} />
              <FileInput label="Driving License" name="driving_license" onChange={handleFileChange} />
            </>
          )}

          {/* SHOWROOM FIELDS */}
          {user?.role === 'showroom' && (
            <>
              <FileInput label="Business Registration Document" name="registration_doc" onChange={handleFileChange} />
              <FileInput label="Tax Certificate (NTN)" name="tax_certificate" onChange={handleFileChange} />
              <FileInput label="Utility Bill (Proof of Address)" name="utility_bill" onChange={handleFileChange} />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Uploading...' : <><CheckCircle className="w-5 h-5" /> Submit Documents</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper Component for consistent file inputs
const FileInput = ({ label, name, onChange }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
    <label className="block cursor-pointer">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input 
        type="file" 
        name={name} 
        onChange={onChange} 
        required 
        accept="image/*,application/pdf"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
    </label>
  </div>
);

export default KYCSubmit;