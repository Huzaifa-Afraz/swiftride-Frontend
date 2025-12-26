import React, { useState, useEffect, useRef } from 'react';
import { carService } from '../../services/carService';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { showAlert } from '../../utils/alert';
import Swal from 'sweetalert2';
import { Car, Upload, MapPin, CheckCircle, ArrowLeft, Clock, Calendar } from 'lucide-react';

// --- GOOGLE MAPS IMPORTS ---
import { useJsApiLoader, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  marginTop: '15px',
};

const defaultCenter = { lat: 33.6844, lng: 73.0479 };
const DAYS_OPTIONS = [
  { id: 1, label: 'Mon' }, { id: 2, label: 'Tue' }, { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' }, { id: 5, label: 'Fri' }, { id: 6, label: 'Sat' }, { id: 0, label: 'Sun' }
];

const AddCar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [files, setFiles] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]); // For edit mode display
  
  // Maps State
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);
  
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

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
    availabilityIsAvailable: true, features: '', 
    availabilityDaysOfWeek: [1, 2, 3, 4, 5] // Default Mon-Fri
  });

  // --- FETCH CAR DATA IF EDIT MODE ---
  useEffect(() => {
    if (isEditMode) {
      setFetching(true);
      carService.getCarDetails(id)
        .then(res => {
          console.log("Edit Car Data:", res.data);
          // Handle various response structures safely
          const car = res.data.data?.car || res.data?.data || res.data; 

          // Parse Location: Handle both {lat, lng} object and [lng, lat] array
          let lat = '0', lng = '0';
          if (car.location?.lat && car.location?.lng) {
             lat = car.location.lat.toString();
             lng = car.location.lng.toString();
          } else if (car.location?.coordinates) {
             lat = car.location.coordinates[1].toString();
             lng = car.location.coordinates[0].toString();
          }

          setFormData({
            make: car.make || '',
            model: car.model || '',
            year: car.year || '',
            color: car.color || '',
            plateNumber: car.plateNumber || '',
            pricePerHour: car.pricePerHour || '',
            pricePerDay: car.pricePerDay || '',
            seats: car.seats || '',
            transmission: car.transmission || 'Automatic',
            fuelType: car.fuelType || 'Petrol',
            locationAddress: car.location?.address || '',
            locationLat: lat,
            locationLng: lng,
            availabilityStartTime: car.availability?.startTime || '09:00',
            availabilityEndTime: car.availability?.endTime || '17:00',
            availabilityIsAvailable: car.availability?.isAvailable ?? true,
            availabilityDaysOfWeek: car.availability?.daysOfWeek || [1, 2, 3, 4, 5],
            features: Array.isArray(car.features) ? car.features.join(', ') : (car.features || '')
          });

          // Set Existing Photos
          if (car.photos && Array.isArray(car.photos)) {
            setExistingPhotos(car.photos);
          }

          // Update Map
          if (lat !== '0' && lng !== '0') {
             const numLat = parseFloat(lat);
             const numLng = parseFloat(lng);
             setMapCenter({ lat: numLat, lng: numLng });
             setMarkerPosition({ lat: numLat, lng: numLng });
          }
          setFetching(false);
        })
        .catch(err => {
          console.error("Fetch failed", err);
          showAlert('Error', 'Failed to load car details', 'error');
          navigate('/dashboard/fleet');
        });
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDayToggle = (dayId) => {
    setFormData(prev => {
      const days = prev.availabilityDaysOfWeek.includes(dayId)
        ? prev.availabilityDaysOfWeek.filter(d => d !== dayId)
        : [...prev.availabilityDaysOfWeek, dayId];
      return { ...prev, availabilityDaysOfWeek: days };
    });
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setFormData(prev => ({
          ...prev, locationAddress: place.formatted_address || place.name,
          locationLat: lat.toString(), locationLng: lng.toString()
        }));
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        mapRef.current?.panTo({ lat, lng });
      }
    }
  };

  const onMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setFormData(prev => ({
          ...prev, locationAddress: results[0].formatted_address,
          locationLat: lat.toString(), locationLng: lng.toString()
        }));
      } else {
        setFormData(prev => ({
          ...prev, locationAddress: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          locationLat: lat.toString(), locationLng: lng.toString()
        }));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isVerified = user?.isVerified || user?.isEmailVerified;
    if (!isVerified) return;

    if (!isEditMode && files.length === 0) {
      showAlert('Missing Photos', 'Please upload at least one photo.', 'warning');
      return;
    }
    if (formData.locationLat === '0' || formData.locationLng === '0') {
        showAlert('Invalid Location', 'Please pick a location on the map.', 'warning');
        return;
    }

    setLoading(true);
    const data = new FormData();
    
    // Append standard fields
    Object.keys(formData).forEach(key => {
      if (key !== 'availabilityDaysOfWeek' && key !== 'features') {
        data.append(key, formData[key]);
      }
    });

    // Handle Objects/Arrays manually for FormData
    data.append('availabilityDaysOfWeek', JSON.stringify(formData.availabilityDaysOfWeek));
    
    // Features: Ensure strict array format if backend splits by comma or expects array
    // Assuming backend takes string or we send array. Safest is usually to let backend split string, 
    // or send JSON string if backend parses it. Based on user JSON response `features: ['abc']`, backend stores array.
    // Let's send it as simple text, assuming backend splits it, OR keys like `features[0]`. 
    // SAFEST match to existing createCar logic: append key 'features' as string.
    data.append('features', formData.features); 

    // Photos
    for (let i = 0; i < files.length; i++) data.append('photos', files[i]);

    try {
      if (isEditMode) {
        await carService.updateCar(id, data);
        Swal.fire({
            icon: 'success', title: 'Updated!', text: 'Vehicle details and availability updated.',
            confirmButtonColor: '#4F46E5'
        }).then(() => navigate('/dashboard/fleet'));
      } else {
        await carService.createCar(data);
        Swal.fire({
          icon: 'success', title: 'Car Listed!', text: 'Your vehicle is live.',
          confirmButtonColor: '#4F46E5'
        }).then(() => navigate('/dashboard/fleet'));
      }
    } catch (error) {
      showAlert('Error', error.response?.data?.message || error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => setFiles(e.target.files);

  if (!user || fetching) return <div className="p-10 text-center">Loading vehicle details...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Car className="w-8 h-8" /></div>
          {isEditMode ? 'Edit Vehicle' : 'List Your Vehicle'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* 1. Basic Details */}
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Car Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Make" name="make" value={formData.make} placeholder="Toyota" onChange={handleChange} required />
            <InputGroup label="Model" name="model" value={formData.model} placeholder="Corolla" onChange={handleChange} required />
            <InputGroup label="Year" name="year" value={formData.year} type="number" placeholder="2022" onChange={handleChange} required />
            <InputGroup label="Color" name="color" value={formData.color} placeholder="White" onChange={handleChange} required />
            <InputGroup label="Plate #" name="plateNumber" value={formData.plateNumber} placeholder="ABC-123" onChange={handleChange} required />
            <InputGroup label="Seats" name="seats" value={formData.seats} type="number" placeholder="4" onChange={handleChange} required />
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full border p-3 rounded-xl bg-gray-50">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Fuel Type</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full border p-3 rounded-xl bg-gray-50">
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Availability Schedule (NEW) */}
        <div className="p-8 border-b border-gray-100 bg-blue-50/30">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600"/> Availability Schedule
          </h3>
          
          <div className="space-y-6">
             {/* Available Toggle */}
             <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  name="availabilityIsAvailable" 
                  checked={formData.availabilityIsAvailable} 
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
                  id="av-toggle"
                />
                <label htmlFor="av-toggle" className="font-medium text-gray-700 select-none">Mark vehicle as currently available for booking</label>
             </div>

             {/* Times */}
             <div className="grid grid-cols-2 gap-6">
                <InputGroup label="Start Time (Daily)" name="availabilityStartTime" type="time" value={formData.availabilityStartTime} onChange={handleChange} required />
                <InputGroup label="End Time (Daily)" name="availabilityEndTime" type="time" value={formData.availabilityEndTime} onChange={handleChange} required />
             </div>

             {/* Days of Week */}
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-3">Available Days</label>
               <div className="flex flex-wrap gap-3">
                  {DAYS_OPTIONS.map(day => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => handleDayToggle(day.id)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition border ${
                        formData.availabilityDaysOfWeek.includes(day.id)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
               </div>
             </div>
          </div>
        </div>

        {/* 3. Pricing & Location */}
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Pricing & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Price/Day (PKR)" name="pricePerDay" value={formData.pricePerDay} type="number" onChange={handleChange} required />
            <InputGroup label="Price/Hour (PKR)" name="pricePerHour" value={formData.pricePerHour} type="number" onChange={handleChange} required />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Location</label>
              {isLoaded ? (
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5 z-10" />
                    <Autocomplete onLoad={(a) => (autocompleteRef.current = a)} onPlaceChanged={onPlaceChanged}>
                      <input name="locationAddress" placeholder="Search location..." className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none shadow-sm" onChange={handleChange} value={formData.locationAddress} required />
                    </Autocomplete>
                  </div>
                  <GoogleMap mapContainerStyle={mapContainerStyle} zoom={13} center={mapCenter} onLoad={(m) => (mapRef.current = m)} onClick={onMapClick}>
                    {markerPosition && <Marker position={markerPosition} />}
                  </GoogleMap>
                  {formData.locationLat !== '0' && (
                     <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3 h-3" /> Location Locked: {formData.locationLat}, {formData.locationLng}
                     </p>
                  )}
                </div>
              ) : <div>Loading Maps...</div>}
            </div>
          </div>
        </div>

        {/* 4. Photos & Features */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Photos & Features</h3>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Features (comma separated)</label>
            <input name="features" value={formData.features} placeholder="AC, GPS, Bluetooth..." className="w-full px-4 py-3 border rounded-xl" onChange={handleChange} />
          </div>

          {/* Existing Photos (Edit Mode) */}
          {isEditMode && existingPhotos.length > 0 && (
            <div className="mb-6">
               <label className="block text-sm font-bold text-gray-700 mb-2">Current Photos</label>
               <div className="flex gap-4 overflow-x-auto pb-2">
                 {existingPhotos.map((photo, i) => (
                   <img key={i} src={photo} alt={`Car ${i}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                 ))}
               </div>
               <p className="text-xs text-gray-500 mt-1">Uploading new photos below will append to or replace these depending on system settings.</p>
            </div>
          )}

          <div className="border-2 border-dashed border-indigo-200 bg-indigo-50 rounded-xl p-8 text-center cursor-pointer relative hover:bg-indigo-100 transition">
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center pointer-events-none">
              <Upload className="w-6 h-6 text-indigo-600 mb-2" />
              <span className="font-bold text-indigo-900">Upload New Photos</span>
              <span className="text-sm text-indigo-600">{files.length > 0 ? `${files.length} selected` : (isEditMode ? "Optional" : "Max 5MB")}</span>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t flex justify-end">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg">
            {loading ? 'Processing...' : <><CheckCircle className="w-5 h-5" /> {isEditMode ? 'Update Vehicle' : 'Publish Listing'}</>}
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