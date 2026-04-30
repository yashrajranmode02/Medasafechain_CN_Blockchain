// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus, Eye, EyeOff } from 'lucide-react';
import { signup } from '../API/api';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'manufacturer', label: '🏭 Manufacturer', desc: 'Create & manage medicine batches', color: 'from-blue-600 to-cyan-600' },
  { value: 'distributor', label: '🚚 Distributor', desc: 'Track & update batch logistics', color: 'from-purple-600 to-indigo-600' },
  { value: 'consumer', label: '🛒 Consumer', desc: 'Verify medicine authenticity', color: 'from-emerald-600 to-teal-600' },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [role, setRole] = useState('manufacturer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedRole = ROLES.find(r => r.value === role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await signup({ name, email, password, role });
      authLogin(data.user, data.token);
      navigate(`/${role}`);
    } catch (err) {
      setError(err?.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl mb-4">
            <ShieldCheck size={32} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            MediSafeChain
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Create your account</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Role Cards */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">I am a...</p>
            <div className="space-y-2">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                    role === r.value
                      ? `bg-gradient-to-r ${r.color} border-transparent shadow-lg`
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${role === r.value ? 'text-white' : 'text-gray-300'}`}>
                      {r.label}
                    </p>
                    <p className={`text-xs ${role === r.value ? 'text-white/70' : 'text-gray-500'}`}>
                      {r.desc}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    role === r.value ? 'border-white bg-white' : 'border-gray-500'
                  }`}>
                    {role === r.value && <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${r.color}`} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 bg-gradient-to-r ${selectedRole.color} hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100`}
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
