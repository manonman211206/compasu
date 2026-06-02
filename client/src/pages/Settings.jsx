import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Trash2,
  AlertCircle,
  CheckCircle,
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
    campus: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [privacy, setPrivacy] = useState({
    locationVisible: true,
    friendListVisible: true,
    onlineStatusVisible: true,
    allowFriendRequests: true,
  });
  const [notifications, setNotifications] = useState({
    friendRequests: true,
    messages: true,
    friendOnline: false,
    locationShared: true,
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
        campus: user.campus || '',
      });
      setPrivacy(user.privacySettings || privacy);
      setNotifications(user.notificationPreferences || notifications);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
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
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/privacy-settings`, { privacySettings: privacy }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Privacy settings updated' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update privacy settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/notification-preferences`, {
        notificationPreferences: notifications,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Notification preferences updated' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update notification preferences' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mx-6 mt-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <p className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
            {message.text}
          </p>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-700 mb-8">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'password', label: 'Security' },
            { id: 'privacy', label: 'Privacy' },
            { id: 'notifications', label: 'Notifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleProfileUpdate}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                maxLength={500}
                rows="4"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-xs text-slate-400 mt-1">{profile.bio.length}/500</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Campus
              </label>
              <input
                type="text"
                value={profile.campus}
                onChange={(e) => setProfile({ ...profile, campus: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </motion.form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handlePasswordChange}
            className="space-y-6 max-w-md"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 pr-10 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </motion.form>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-4">
              {[
                {
                  key: 'locationVisible',
                  label: 'Location Visible',
                  desc: 'Allow friends to see your location',
                },
                {
                  key: 'friendListVisible',
                  label: 'Friend List Visible',
                  desc: 'Allow others to see your friend list',
                },
                {
                  key: 'onlineStatusVisible',
                  label: 'Online Status Visible',
                  desc: 'Show when you are online',
                },
                {
                  key: 'allowFriendRequests',
                  label: 'Allow Friend Requests',
                  desc: 'Allow anyone to send friend requests',
                },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy[key]}
                    onChange={(e) => setPrivacy({ ...privacy, [key]: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-800 cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-slate-200">{label}</p>
                    <p className="text-sm text-slate-400">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <button
              onClick={handlePrivacyUpdate}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Save Privacy Settings'}
            </button>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-4">
              {[
                {
                  key: 'friendRequests',
                  label: 'Friend Requests',
                  desc: 'Notifications for new friend requests',
                },
                {
                  key: 'messages',
                  label: 'Messages',
                  desc: 'Notifications for new messages',
                },
                {
                  key: 'friendOnline',
                  label: 'Friend Online',
                  desc: 'Notifications when friends come online',
                },
                {
                  key: 'locationShared',
                  label: 'Location Shared',
                  desc: 'Notifications when friends share their location',
                },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-800 cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-slate-200">{label}</p>
                    <p className="text-sm text-slate-400">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <button
              onClick={handleNotificationUpdate}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
