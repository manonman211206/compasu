import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Send,
  MapPin,
  Search,
  MoreVertical,
  Phone,
  Video,
  LogOut,
  Users,
  Settings,
  Bell,
  Home,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('chat');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUser();
    fetchFriends();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/settings/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      navigate('/login');
    }
  };

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/friends/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch friends:', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/chat/send`,
        {
          recipientId: activeChat._id,
          content: messageInput,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data.data]);
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Top Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold">
            C
          </div>
          <h1 className="text-xl font-bold">Compasu</h1>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-slate-400 hover:text-slate-200 transition">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-sm">{user?.username}</p>
              <p className="text-xs text-slate-400">Online</p>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col"
        >
          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            {[
              { id: 'chat', label: 'Messages', icon: Send },
              { id: 'friends', label: 'Friends', icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id)}
                className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
                  selectedTab === id
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">{label}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-700">
            <div className="bg-slate-700/50 rounded-lg flex items-center px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {selectedTab === 'chat' ? (
              friends.length > 0 ? (
                friends.map((friend) => (
                  <motion.div
                    key={friend._id}
                    whileHover={{ backgroundColor: 'rgba(100, 116, 139, 0.5)' }}
                    onClick={() => setActiveChat(friend)}
                    className={`p-4 border-b border-slate-700 cursor-pointer transition ${
                      activeChat?._id === friend._id
                        ? 'bg-indigo-500/20 border-indigo-500/50'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-semibold">
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-sm">{friend.username}</p>
                        <p className="text-xs text-slate-400 truncate">Last message...</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No friends yet. Add some!</p>
                </div>
              )
            ) : (
              <div className="p-6 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Your friends will appear here</p>
              </div>
            )}
          </div>
        </motion.aside>

        {/* Chat Area */}
        {activeChat ? (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col bg-slate-900"
          >
            {/* Chat Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-semibold">
                  {activeChat.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{activeChat.username}</p>
                  <p className="text-xs text-green-400">Online</p>
                </div>
              </div>
              <div className="flex gap-4 text-slate-400">
                <button className="hover:text-indigo-400 transition">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="hover:text-indigo-400 transition">
                  <Video className="w-5 h-5" />
                </button>
                <button className="hover:text-slate-200 transition">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Send className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.senderId === user._id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderId === user._id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="bg-slate-800 border-t border-slate-700 px-6 py-4">
              <form onSubmit={sendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition transform hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.main>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-900">
            <div className="text-center text-slate-400">
              <Send className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Select a friend to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
