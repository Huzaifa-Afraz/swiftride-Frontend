import React, { useState } from 'react';
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
export default Login;