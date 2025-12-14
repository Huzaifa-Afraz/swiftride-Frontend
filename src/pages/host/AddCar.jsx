import React, { useState, useEffect, useRef } from 'react';
import { carService } from '../../services/carService';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { showAlert } from '../../utils/alert';
import Swal from 'sweetalert2';
import { Car, Upload, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';

// --- GOOGLE MAPS IMPORTS ---
import { useJsApiLoader, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';

// Libraries must be defined outside to prevent re-renders
const libraries = ['places'];

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  marginTop: '15px',
};

// Default center (Islamabad/Pakistan or your preferred default)
const defaultCenter = {
  lat: 33.6844,
  lng: 73.0479,
};

const AddCar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  
  // Maps State
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);
  
  // Refs
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  // --- GOOGLE MAPS LOADER ---
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // --- ACCESS CONTROL ---
  useEffect(() => {
    const isVerified = user?.isVerified || user?.isEmailVerified;
    if (user && !isVerified) {
      Swal.fire({
        icon: 'error', title: 'Access Denied', text: 'Please complete KYC first.',
        confirmButtonText: 'Go to KYC', confirmButtonColor: '#d33',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) navigate('/dashboard/kyc');
        else navigate('/dashboard');
      });
    }
  }, [user, navigate]);

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

  // --- 1. HANDLE AUTOCOMPLETE SELECTION ---
  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Update Form
        setFormData(prev => ({
          ...prev,
          locationAddress: place.formatted_address || place.name,
          locationLat: lat.toString(),
          locationLng: lng.toString()
        }));

        // Move Map & Marker
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        mapRef.current?.panTo({ lat, lng });
      }
    }
  };

  // --- 2. HANDLE MAP CLICK (Reverse Geocoding) ---
  const onMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarkerPosition({ lat, lng });
    
    // Use Google Geocoder to get address from Lat/Lng
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setFormData(prev => ({
          ...prev,
          locationAddress: results[0].formatted_address, // Auto-fill input
          locationLat: lat.toString(),
          locationLng: lng.toString()
        }));
      } else {
        // Fallback if address not found
        setFormData(prev => ({
          ...prev,
          locationAddress: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          locationLat: lat.toString(),
          locationLng: lng.toString()
        }));
      }
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isVerified = user?.isVerified || user?.isEmailVerified;
    if (!isVerified) return;

    if (files.length === 0) {
      showAlert('Missing Photos', 'Please upload car photos.', 'warning');
      return;
    }
    if (formData.locationLat === '0' || formData.locationLng === '0') {
        showAlert('Invalid Location', 'Please pick a location on the map.', 'warning');
        return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('availabilityDaysOfWeek', JSON.stringify([1,2,3,4,5])); 
    for (let i = 0; i < files.length; i++) data.append('photos', files[i]);

    try {
      await carService.createCar(data);
      Swal.fire({
        icon: 'success', title: 'Car Listed!', text: 'Your vehicle is live.',
        confirmButtonColor: '#4F46E5'
      }).then(() => navigate('/dashboard/fleet'));
    } catch (error) {
      showAlert('Error', error.response?.data?.message || error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => setFiles(e.target.files);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Car className="w-8 h-8" /></div>
          List Your Vehicle
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Car Details Section */}
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Car Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Make" name="make" placeholder="Toyota" onChange={handleChange} required />
            <InputGroup label="Model" name="model" placeholder="Corolla" onChange={handleChange} required />
            <InputGroup label="Year" name="year" type="number" placeholder="2022" onChange={handleChange} required />
            <InputGroup label="Color" name="color" placeholder="White" onChange={handleChange} required />
            <InputGroup label="Plate #" name="plateNumber" placeholder="ABC-123" onChange={handleChange} required />
            <InputGroup label="Seats" name="seats" type="number" placeholder="4" onChange={handleChange} required />
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Transmission</label>
              <select name="transmission" onChange={handleChange} className="w-full border p-3 rounded-xl bg-gray-50">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Fuel Type</label>
              <select name="fuelType" onChange={handleChange} className="w-full border p-3 rounded-xl bg-gray-50">
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Location Section */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/30">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Pricing & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Price/Day (PKR)" name="pricePerDay" type="number" onChange={handleChange} required />
            <InputGroup label="Price/Hour (PKR)" name="pricePerHour" type="number" onChange={handleChange} required />
            
            {/* GOOGLE MAPS SECTION */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Location</label>
              
              {isLoaded ? (
                <div className="space-y-3">
                  {/* Search Box */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5 z-10" />
                    <Autocomplete
                      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <input 
                        name="locationAddress" 
                        placeholder="Search or click on map..." 
                        className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 ring-indigo-500 outline-none shadow-sm"
                        onChange={handleChange}
                        value={formData.locationAddress}
                        required 
                      />
                    </Autocomplete>
                  </div>

                  {/* VISUAL MAP */}
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={13}
                    center={mapCenter}
                    onLoad={(map) => (mapRef.current = map)}
                    onClick={onMapClick} // Allow clicking to set pin
                    options={{ disableDefaultUI: false, streetViewControl: false }}
                  >
                    {markerPosition && <Marker position={markerPosition} />}
                  </GoogleMap>

                  {formData.locationLat !== '0' && (
                     <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3 h-3" /> Location Locked: {formData.locationLat.slice(0,7)}, {formData.locationLng.slice(0,7)}
                     </p>
                  )}
                </div>
              ) : (
                <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 animate-pulse">
                  Loading Maps API...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photos & Features */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Photos & Features</h3>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Features</label>
            <input name="features" placeholder="AC, GPS, Bluetooth..." className="w-full px-4 py-3 border rounded-xl" onChange={handleChange} />
          </div>

          <div className="border-2 border-dashed border-indigo-200 bg-indigo-50 rounded-xl p-8 text-center cursor-pointer relative hover:bg-indigo-100 transition">
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center pointer-events-none">
              <Upload className="w-6 h-6 text-indigo-600 mb-2" />
              <span className="font-bold text-indigo-900">Upload Photos</span>
              <span className="text-sm text-indigo-600">{files.length > 0 ? `${files.length} selected` : "Max 5MB"}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50 border-t flex justify-end">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg">
            {loading ? 'Processing...' : <><CheckCircle className="w-5 h-5" /> Publish Listing</>}
          </button>
        </div>

      </form>
    </div>
  );
};

const InputGroup = ({ label, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    <input type={type} className="w-full px-4 py-3 border rounded-xl focus:ring-2 ring-indigo-500 outline-none" {...props} />
  </div>
);

export default AddCar;