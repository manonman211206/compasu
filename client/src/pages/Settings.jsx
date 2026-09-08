import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Terminal,
  AlertCircle,
  CheckCircle,
  User,
  Save,
  Cpu,
  Key,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    campus: 'VIT Chennai',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [privacy, setPrivacy] = useState({
    locationSharing: true,
    friendListVisibility: 'friends',
    onlineStatus: true,
  });

  const [notifications, setNotifications] = useState({
    friendRequests: true,
    messages: true,
    locationSharing: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/settings/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data.data;
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        campus: user.campus || 'VIT Chennai',
      });
      if (user.privacySettings) setPrivacy(user.privacySettings);
      if (user.notificationPreferences) setNotifications(user.notificationPreferences);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load developer profile' });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Profile config synchronized successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to sync profile config' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Secret key rotated successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/settings/privacy-settings`,
        { privacySettings: privacy },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Privacy & mesh flags saved.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update privacy settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/settings/notification-preferences`,
        { notificationPreferences: notifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Telemetry notification stream updated.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update notification preferences' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-[#F3F5F2] font-mono text-xs antialiased selection:bg-[#D9FF35] selection:text-[#070A10]">
      {/* Top Header */}
      <div className="bg-[#0A0E14] border-b border-white/[0.08] px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded bg-[#101A18] hover:bg-[#14201D] text-[#A2AAA7] hover:text-[#F3F5F2] border border-white/[0.06] transition"
              title="Return to Workspace"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <h1 className="text-sm font-bold text-[#F3F5F2] tracking-tight">compasu // preferences</h1>
          </div>

          <div className="text-[11px] text-[#626B69] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF35]" />
            <span>VIT_CHENNAI Node ap-south-1</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Alerts */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`mb-6 p-3 rounded-lg flex items-center gap-2 text-xs ${
                message.type === 'success'
                  ? 'bg-[#101A18] border border-[#D9FF35]/40 text-[#D9FF35]'
                  : 'bg-red-950/40 border border-red-500/30 text-red-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-3.5 h-3.5 text-[#D9FF35] shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex bg-[#0A0E14] p-1 rounded-lg border border-white/[0.08] mb-8 max-w-md">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'password', label: 'Security', icon: Key },
            { id: 'privacy', label: 'Privacy', icon: Shield },
            { id: 'notifications', label: 'Streams', icon: Bell },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveTab(id);
                setMessage({ type: '', text: '' });
              }}
              className={`flex-1 py-1.5 px-3 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                activeTab === id
                  ? 'bg-[#14201D] text-[#D9FF35] border border-[#D9FF35]/30'
                  : 'text-[#626B69] hover:text-[#A2AAA7]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleProfileUpdate}
            className="bg-[#101A18] rounded-xl p-6 border border-white/[0.08] space-y-4 max-w-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A2AAA7] text-[11px] mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  placeholder="Manonman"
                  className="w-full bg-[#0A0E14] border border-white/[0.08] rounded px-3 py-2 text-xs text-[#F3F5F2] focus:outline-none focus:border-[#D9FF35]"
                />
              </div>
              <div>
                <label className="block text-[#A2AAA7] text-[11px] mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  placeholder="Rout"
                  className="w-full bg-[#0A0E14] border border-white/[0.08] rounded px-3 py-2 text-xs text-[#F3F5F2] focus:outline-none focus:border-[#D9FF35]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A2AAA7] text-[11px] mb-1">Campus Node</label>
              <input
                type="text"
                value={profile.campus}
                onChange={(e) => setProfile({ ...profile, campus: e.target.value })}
                placeholder="VIT Chennai"
                className="w-full bg-[#0A0E14] border border-white/[0.08] rounded px-3 py-2 text-xs text-[#F3F5F2] focus:outline-none focus:border-[#D9FF35]"
              />
            </div>

            <div>
              <label className="block text-[#A2AAA7] text-[11px] mb-1">Bio / Tech Stack</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                maxLength={300}
                rows="3"
                placeholder="TypeScript, Rust, Docker, vit-chennai CS..."
                className="w-full bg-[#0A0E14] border border-white/[0.08] rounded px-3 py-2 text-xs text-[#F3F5F2] focus:outline-none focus:border-[#D9FF35]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-8 px-4 bg-[#D9FF35] hover:bg-[#CFFF24] disabled:bg-[#1C242C] text-[#080B0E] font-semibold rounded text-xs transition cursor-pointer"
            >
              {loading ? 'Syncing...' : 'Save Configuration'}
            </button>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'password' && (
          <form
            onSubmit={handlePasswordChange}
            className="bg-[#101A18] rounded-xl p-6 border border-white/[0.08] space-y-4 max-w-md"
          >
            <div>
              <label className="block text-[#A2AAA7] text-[11px] mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0A0E14] border border-white/[0.08] rounded pl-3 pr-8 py-2 text-xs text-[#F3F5F2] focus:outline-none focus:border-[#D9FF35]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#626B69]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#A2AAA7] text-[11px] mb-1">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Min. 8 characters"
                className="w-full bg-[#0A0E14] border border-white/[0.08] rounded px-3 py-2 text-xs text-[#F3F5F2] focus:outline-none focus:border-[#D9FF35]"
                required
              />
            </div>

            <div>
              <label className="block text-[#A2AAA7] text-[11px] mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                className="w-full bg-[#0A0E14] border border-white/[0.08] rounded px-3 py-2 text-xs text-[#F3F5F2] focus:outline-none focus:border-[#D9FF35]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-8 px-4 bg-[#D9FF35] hover:bg-[#CFFF24] disabled:bg-[#1C242C] text-[#080B0E] font-semibold rounded text-xs transition cursor-pointer"
            >
              {loading ? 'Rotating...' : 'Rotate Key'}
            </button>
          </form>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="bg-[#101A18] rounded-xl p-6 border border-white/[0.08] space-y-4 max-w-lg">
            {[
              {
                key: 'locationSharing',
                title: 'Broadcast Geolocation to Campus Mesh',
                desc: 'Allow peered nodes to locate your terminal at VIT Chennai landmarks',
              },
              {
                key: 'onlineStatus',
                title: 'Socket Heartbeat Presence',
                desc: 'Display active state in campus radar channels',
              },
            ].map(({ key, title, desc }) => (
              <label
                key={key}
                className="flex items-start justify-between p-3 rounded bg-[#0A0E14] border border-white/[0.06] cursor-pointer"
              >
                <div className="pr-4">
                  <p className="font-semibold text-[#F3F5F2] text-xs">{title}</p>
                  <p className="text-[11px] text-[#626B69] mt-0.5">{desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy[key]}
                  onChange={(e) => setPrivacy({ ...privacy, [key]: e.target.checked })}
                  className="accent-[#D9FF35] cursor-pointer mt-1"
                />
              </label>
            ))}

            <button
              type="button"
              onClick={handlePrivacyUpdate}
              disabled={loading}
              className="h-8 px-4 bg-[#D9FF35] hover:bg-[#CFFF24] text-[#080B0E] font-semibold rounded text-xs transition cursor-pointer"
            >
              Save Flags
            </button>
          </div>
        )}

        {/* Telemetry / Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-[#101A18] rounded-xl p-6 border border-white/[0.08] space-y-4 max-w-lg">
            {[
              {
                key: 'friendRequests',
                title: 'Peer Peering Invitations',
                desc: 'Receive push alerts on inbound node connections',
              },
              {
                key: 'messages',
                title: 'Direct Stream Messages',
                desc: 'Notify on socket channel incoming text packets',
              },
              {
                key: 'locationSharing',
                title: 'Spatial Proximity Radar Events',
                desc: 'Alert when a peer enters within 50m of your landmark',
              },
            ].map(({ key, title, desc }) => (
              <label
                key={key}
                className="flex items-start justify-between p-3 rounded bg-[#0A0E14] border border-white/[0.06] cursor-pointer"
              >
                <div className="pr-4">
                  <p className="font-semibold text-[#F3F5F2] text-xs">{title}</p>
                  <p className="text-[11px] text-[#626B69] mt-0.5">{desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="accent-[#D9FF35] cursor-pointer mt-1"
                />
              </label>
            ))}

            <button
              type="button"
              onClick={handleNotificationUpdate}
              disabled={loading}
              className="h-8 px-4 bg-[#D9FF35] hover:bg-[#CFFF24] text-[#080B0E] font-semibold rounded text-xs transition cursor-pointer"
            >
              Save Stream Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
