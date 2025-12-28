import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { showAlert } from '../../utils/alert';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import RoleSelectionModal from '../../components/auth/RoleSelectionModal';
import useAuth from '../../hooks/useAuth';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer'); // 'customer' | 'host' | 'showroom'
  
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phoneNumber: '', showroomName: ''
  });

  // --- Google Login Logic ---
  const { googleLogin } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempGoogleCreds, setTempGoogleCreds] = useState(null);

  const handleFirebaseGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the Google ID Token (not Firebase Token) for backend verification
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleIdToken = credential?.idToken;

      if (!googleIdToken) {
         throw new Error("Could not retrieve Google ID Token");
      }
      
      // 1. Try login without role
      const loginResult = await googleLogin({ idToken: googleIdToken });
      
      if (loginResult.success) {
        navigate('/');
      } else {
        // 2. If backend says "Role required" (status 400), show modal
        if (loginResult.status === 400) {
           setTempGoogleCreds(googleIdToken);
           setShowRoleModal(true);
        } else {
          showAlert('Google Signup Failed', loginResult.message, 'error');
        }
      }
    } catch (error) {
      console.error("Firebase Signup Error:", error);
      showAlert("Google Signup Failed", error.message, 'error');
    }
  };

  const handleRoleSelect = async (selectedRole, showroomName) => {
    // 3. Retry login WITH role
    const result = await googleLogin({ 
      idToken: tempGoogleCreds, 
      role: selectedRole, 
      showroomName 
    });

    if (result.success) {
      setShowRoleModal(false);
      navigate('/');
    } else {
      showAlert('Google Signup Failed', result.message, 'error');
    }
  };
  // --------------------------

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === 'showroom') {
        // Showroom has slightly different fields based on Postman
        await authService.signupShowroom({
          showroomName: formData.showroomName,
          email: formData.email,
          password: formData.password
        });
      } else {
        // Customer or Host
        await authService.signup({
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

        {/* Google Signup Button */}
        <div className="mt-6 flex justify-center">
             <button
              type="button"
              onClick={handleFirebaseGoogleLogin}
              className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
              Sign up with Google
            </button>
        </div>

        <div className="relative mt-6 mb-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
          </div>
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

       <RoleSelectionModal 
        isOpen={showRoleModal} 
        onClose={() => setShowRoleModal(false)}
        onRoleSelect={handleRoleSelect}
      />
    </div>
  );
};

export default Signup;