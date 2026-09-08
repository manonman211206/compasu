import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Terminal, ArrowLeft, Shield } from 'lucide-react';
import { loginSuccess } from '../store/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Signup({ initialMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(() => {
    if (initialMode) return initialMode === 'login';
    return location.pathname === '/login';
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (initialMode) {
      setIsLogin(initialMode === 'login');
    } else {
      setIsLogin(location.pathname === '/login');
    }
    setError('');
    setSuccess('');
  }, [location.pathname, initialMode]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        const { accessToken, refreshToken, user } = response.data.data;
        dispatch(loginSuccess({ accessToken, refreshToken, user }));
        navigate('/dashboard', { replace: true });
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        await axios.post(`${API_URL}/auth/register`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        setSuccess('Account provisioned successfully. You can now authenticate.');
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        setIsLogin(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication error occurred.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-[#F3F5F2] font-sans flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-[#D9FF35] selection:text-[#070A10]">
      {/* Background subtle technical grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none" />

      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-[#101A18] border border-[#D9FF35]/40 flex items-center justify-center text-[#D9FF35] group-hover:border-[#D9FF35] transition duration-200">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-xl tracking-tight text-[#F3F5F2]">
            compasu
          </span>
          <span className="text-[10px] font-mono text-[#D9FF35] bg-[#D9FF35]/10 px-1.5 py-0.5 rounded border border-[#D9FF35]/20">
            auth-daemon
          </span>
        </Link>
      </motion.div>

      {/* Main Developer Auth Box */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#101A18] border border-white/[0.08] rounded-xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Card Header */}
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <h1 className="text-lg font-bold font-editorial text-[#F3F5F2]">
                {isLogin ? 'Authenticate Session' : 'Provision Developer Account'}
              </h1>
              <p className="text-[12px] font-mono text-[#A2AAA7] mt-0.5">
                {isLogin ? 'Connect to VIT Chennai node' : 'Join campus peer network'}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#D9FF35] animate-pulse" />
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-[#0A0E14] p-1 rounded-lg mb-6 border border-white/[0.06] font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-1.5 rounded transition ${
                isLogin
                  ? 'bg-[#17231F] text-[#D9FF35] border border-[#D9FF35]/30'
                  : 'text-[#626B69] hover:text-[#A2AAA7]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-1.5 rounded transition ${
                !isLogin
                  ? 'bg-[#17231F] text-[#D9FF35] border border-[#D9FF35]/30'
                  : 'text-[#626B69] hover:text-[#A2AAA7]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-lg flex items-start gap-2 text-xs font-mono text-red-300"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mb-4 p-3 bg-[#101A18] border border-[#D9FF35]/40 rounded-lg flex items-start gap-2 text-xs font-mono text-[#D9FF35]"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#D9FF35] shrink-0 mt-0.5" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {!isLogin && (
              <div>
                <label className="block text-[#A2AAA7] text-[11px] mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#626B69]" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="manonman"
                    className="w-full bg-[#0A0E14] border border-white/[0.08] rounded-md pl-9 pr-3 py-2.5 text-[#F3F5F2] placeholder-[#626B69] focus:outline-none focus:border-[#D9FF35] transition"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#A2AAA7] text-[11px] mb-1">Campus Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#626B69]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@vitchennai.edu.in"
                  className="w-full bg-[#0A0E14] border border-white/[0.08] rounded-md pl-9 pr-3 py-2.5 text-[#F3F5F2] placeholder-[#626B69] focus:outline-none focus:border-[#D9FF35] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A2AAA7] text-[11px] mb-1">Secret Key / Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#626B69]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0A0E14] border border-white/[0.08] rounded-md pl-9 pr-9 py-2.5 text-[#F3F5F2] placeholder-[#626B69] focus:outline-none focus:border-[#D9FF35] transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626B69] hover:text-[#A2AAA7]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[#A2AAA7] text-[11px] mb-1">Confirm Secret Key</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#626B69]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0A0E14] border border-white/[0.08] rounded-md pl-9 pr-9 py-2.5 text-[#F3F5F2] placeholder-[#626B69] focus:outline-none focus:border-[#D9FF35] transition"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626B69] hover:text-[#A2AAA7]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-10 bg-[#D9FF35] hover:bg-[#CFFF24] disabled:bg-[#1C242C] disabled:text-[#626B69] text-[#080B0E] font-semibold rounded-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(217,255,53,0.15)] active:translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>{isLogin ? 'Authenticate →' : 'Initialize Account →'}</span>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#626B69]">
            <Link to="/" className="hover:text-[#A2AAA7] flex items-center gap-1 transition">
              <ArrowLeft className="w-3 h-3" />
              <span>root</span>
            </Link>
            <span className="text-[#A2AAA7]">AES-256 GCM • VIT Chennai</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
