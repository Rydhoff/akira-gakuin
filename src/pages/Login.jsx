import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from "/Logo LPK Akira Gakuin.png";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const { error } = await login(email, pwd);
    if (error) {
      setErr(error.message || 'Gagal login');
      return;
    }
    nav('/');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-sm bg-white py-8 px-8 rounded-2xl shadow-lg border border-gray-200">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Akira Logo" className="h-20" />
        </div>

        <h2 className="text-2xl font-bold text-center text-[#0B2E4E] mb-6">
          Admin Login
        </h2>

        {err && (
          <div className="text-red-600 bg-red-50 p-2 rounded-lg mb-4 text-center border border-red-200">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#B30707] focus:outline-none"
            placeholder="Email"
            type="email"
            required
          />

          <input
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#B30707] focus:outline-none"
            placeholder="Password"
            type="password"
            required
          />

          <button
            className="w-full bg-[#B30707] hover:bg-[#8d0606] text-white p-3 rounded-xl shadow-md transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
