import React, { useState } from 'react';
import { carService } from '../../services/carService';
import { useNavigate } from 'react-router-dom';

const AddCar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', color: '', plateNumber: '',
    pricePerHour: '', pricePerDay: '', seats: '', transmission: 'Automatic',
    fuelType: 'Petrol', locationAddress: '', locationLat: '0', locationLng: '0',
    availabilityStartTime: '09:00', availabilityEndTime: '17:00',
    availabilityIsAvailable: true, features: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleFileChange = (e) => setFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('availabilityDaysOfWeek', JSON.stringify([1,2,3,4,5])); // Default Mon-Fri
    for (let i = 0; i < files.length; i++) data.append('photos', files[i]);

    try {
      await carService.createCar(data);
      navigate('/host/cars');
    } catch (error) {
      alert('Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded">
      <h2 className="text-2xl font-bold mb-6">List Your Car</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="make" placeholder="Make" className="border p-2 rounded" onChange={handleChange} required />
          <input name="model" placeholder="Model" className="border p-2 rounded" onChange={handleChange} required />
          <input name="year" type="number" placeholder="Year" className="border p-2 rounded" onChange={handleChange} required />
          <input name="pricePerDay" type="number" placeholder="Price/Day" className="border p-2 rounded" onChange={handleChange} required />
          <input name="locationAddress" placeholder="Address" className="border p-2 rounded col-span-2" onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">Photos</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-500" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
          {loading ? 'Uploading...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};
export default AddCar;