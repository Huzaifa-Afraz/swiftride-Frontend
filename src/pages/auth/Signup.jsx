import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { showAlert } from '../../utils/alert';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer'); // 'customer' | 'host' | 'showroom'
  
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phoneNumber: '', showroomName: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (role === 'showroom') {
        // Showroom has slightly different fields based on Postman
        response = await authService.signupShowroom({
          showroomName: formData.showroomName,
          email: formData.email,
          password: formData.password
        });
      } else {
        // Customer or Host
        response = await authService.signup({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          role: role
        });
      }

      showAlert('Account Created!', 'Please login to continue.', 'success');
      navigate('/login');
    } catch (error) {
      showAlert('Signup Failed', error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join SwiftRide today</p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          {['customer', 'host', 'showroom'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition ${
                role === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {role === 'showroom' ? (
              <div>
                <label className="text-sm font-medium text-gray-700">Showroom Name</label>
                <input
                  name="showroomName"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={handleChange}
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    name="fullName"
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    name="phoneNumber"
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
           Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;