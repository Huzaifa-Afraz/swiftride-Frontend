const fs = require('fs');
const path = require('path');

// --- 1. Project Structure & File Content ---
const files = {
  // CONFIGURATION
  '.env': `REACT_APP_API_BASE_URL=http://localhost:5000/api`,
  
  'tailwind.config.js': `module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,

  'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,

  // UTILS
  'src/utils/constants.js': `export const ROLES = {
  CUSTOMER: 'customer',
  HOST: 'host',
  SHOWROOM: 'showroom',
  ADMIN: 'admin',
};`,

  // SERVICES
  'src/services/apiClient.js': `import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = \`Bearer \${token}\`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default apiClient;`,

  'src/services/authService.js': `import apiClient from './apiClient';
export const authService = {
  signup: (data) => apiClient.post('/auth/signup', data),
  signupShowroom: (data) => apiClient.post('/auth/showroom/signup', data),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiClient.post('/auth/reset-password', { token, password }),
};`,

  'src/services/carService.js': `import apiClient from './apiClient';
export const carService = {
  createCar: (formData) => apiClient.post('/cars', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getCars: (params) => apiClient.get('/cars', { params }),
  getCarDetails: (id) => apiClient.get(\`/cars/\${id}\`),
  getMyCars: () => apiClient.get('/cars/me'),
};`,

  'src/services/bookingService.js': `import apiClient from './apiClient';
export const bookingService = {
  createBooking: (data) => apiClient.post('/bookings', data),
  getMyBookings: () => apiClient.get('/bookings/me'),
  getBookingDetail: (id) => apiClient.get(\`/bookings/\${id}\`),
  getInvoice: (id) => apiClient.get(\`/bookings/invoice/\${id}\`, { responseType: 'blob' }),
  getOwnerBookings: () => apiClient.get('/bookings/owner'),
  updateStatus: (id, status, note) => apiClient.patch(\`/bookings/\${id}/status\`, { status, note }),
};`,

  'src/services/paymentService.js': `import apiClient from './apiClient';
export const paymentService = {
  initBookingPayment: (bookingId) => apiClient.post(\`/payments/booking/\${bookingId}/init\`, {}),
};
export const redirectToPaymentGateway = (paymentPageUrl, payload) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = paymentPageUrl;
  Object.keys(payload).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = payload[key];
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
};`,

  // CONTEXT
  'src/context/AuthContext.js': `import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};`,

  // HOOKS
  'src/hooks/useAuth.js': `import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const useAuth = () => useContext(AuthContext);
export default useAuth;`,

  // COMPONENTS
  'src/components/common/ProtectedRoute.jsx': `import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="p-10 text-center text-red-600">Access Denied</div>;
  }
  return <Outlet />;
};
export default ProtectedRoute;`,

  // LAYOUTS
  'src/layouts/MainLayout.jsx': `import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const MainLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">SwiftRide</Link>
        <div className="space-x-6 text-sm font-medium">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">Browse Cars</Link>
          {!user && (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Signup</Link>
            </>
          )}
          {user && user.role === 'customer' && (
             <Link to="/my-bookings" className="text-gray-600 hover:text-indigo-600">My Bookings</Link>
          )}
          {user && (user.role === 'host' || user.role === 'showroom') && (
            <>
              <Link to="/host/cars" className="text-gray-600 hover:text-indigo-600">My Cars</Link>
              <Link to="/host/add-car" className="text-gray-600 hover:text-indigo-600">Add Car</Link>
            </>
          )}
          {user && (
            <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
          )}
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
export default MainLayout;`,

  // PAGES - AUTH
  'src/pages/auth/Login.jsx': `import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) navigate('/');
    else alert(result.message);
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 transition">
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;`,

  // PAGES - PUBLIC
  'src/pages/public/Home.jsx': `import React, { useEffect, useState } from 'react';
import { carService } from '../../services/carService';
import { Link } from 'react-router-dom';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carService.getCars({ page: 1, limit: 10 })
      .then(res => {
        setCars(res.data.docs || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Loading cars...</div>;

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Perfect Drive</h1>
        <p className="text-gray-600">Explore top-rated cars from local hosts and showrooms.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map(car => (
          <div key={car._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {car.photos && car.photos.length > 0 ? (
                <img src={car.photos[0]} alt={car.make} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">{car.make} {car.model}</h2>
              <p className="text-gray-500 text-sm mb-2">{car.year} • {car.transmission}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-indigo-600 font-bold text-lg">PKR {car.pricePerDay}<span className="text-sm font-normal text-gray-500">/day</span></span>
                <Link to={\`/cars/\${car._id}\`} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 transition">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;`,

  // PAGES - HOST
  'src/pages/host/AddCar.jsx': `import React, { useState } from 'react';
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
export default AddCar;`,

  // APP ROUTER
  'src/App.js': `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import AddCar from './pages/host/AddCar';

// Placeholders for remaining pages to prevent crash
const Signup = () => <div className="p-10 text-center">Signup Page (TODO)</div>;
const CarDetails = () => <div className="p-10 text-center">Car Details Page (TODO)</div>;
const MyBookings = () => <div className="p-10 text-center">My Bookings (TODO)</div>;
const MyCars = () => <div className="p-10 text-center">My Cars List (TODO)</div>;
const AdminDashboard = () => <div className="p-10 text-center">Admin Dashboard (TODO)</div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cars/:carId" element={<CarDetails />} />
            
            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['host', 'showroom']} />}>
              <Route path="/host/cars" element={<MyCars />} />
              <Route path="/host/add-car" element={<AddCar />} />
            </Route>
          </Route>
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
             <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;`
};

// --- 2. Installer Logic ---
function createStructure() {
  console.log('🚀 Starting SwiftRide Frontend Installer...');
  
  Object.keys(files).forEach((filePath) => {
    const fullPath = path.join(__dirname, filePath);
    const dirName = path.dirname(fullPath);

    // Create directory recursively
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    // Write file
    fs.writeFileSync(fullPath, files[filePath]);
    console.log(`✅ Created: ${filePath}`);
  });

  console.log('\n🎉 Installation Complete!');
  console.log('👉 Next Steps:');
  console.log('1. Run: npm install axios react-router-dom tailwindcss postcss autoprefixer date-fns');
  console.log('2. Run: npx tailwindcss init -p');
  console.log('3. Run: npm start');
}
    

createStructure();