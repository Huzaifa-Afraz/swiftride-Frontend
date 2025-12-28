import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import RoleSelectionModal from '../../components/auth/RoleSelectionModal';

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

  // --- Google Login Logic ---
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempGoogleCreds, setTempGoogleCreds] = useState(null);

  // Helper because context function name collision/confusion
  const { googleLogin } = useAuth();

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
          alert(loginResult.message);
        }
      }
    } catch (error) {
      console.error("Firebase Google Login Error:", error);
      alert("Google Login Failed: " + error.message);
    }
  };

  const handleRoleSelect = async (role, showroomName) => {
    // 3. Retry login WITH role
    const result = await googleLogin({ 
      idToken: tempGoogleCreds, 
      role, 
      showroomName 
    });

    if (result.success) {
      setShowRoleModal(false);
      navigate('/');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
        
        {/* Google Login Button (Custom) */}
        <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={handleFirebaseGoogleLogin}
              className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
              Sign in with Google
            </button>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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

       <RoleSelectionModal 
        isOpen={showRoleModal} 
        onClose={() => setShowRoleModal(false)}
        onRoleSelect={handleRoleSelect}
      />
    </div>
  );
};
export default Login;