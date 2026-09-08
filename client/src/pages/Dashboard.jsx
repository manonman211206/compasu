import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import CampusMap from '../components/CampusMap';
import { logout, setUser } from '../store/authSlice';
import { setMeetingPoint, clearMeetingPoint } from '../store/meetingPointSlice';
import {
  Send,
  MapPin,
  Search,
  LogOut,
  Users,
  Settings,
  Bell,
  Terminal,
  MessageSquare,
  UserPlus,
  Check,
  X,
  Radio,
  Clock,
  Sparkles,
  Shield,
  Activity,
  Cpu,
  ChevronRight,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function Dashboard({ handleLogout: parentLogout }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);

  const [user, setCurrentUser] = useState(reduxUser);
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('map'); // 'map', 'chat', 'discover', 'requests'
  const [isTyping, setIsTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(true);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const chatBottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, peerTyping]);

  // Initial Data Fetch
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const initDashboard = async () => {
      try {
        const [profileRes, friendsRes, requestsRes, suggestionsRes, notifsRes, meetingPointRes] =
          await Promise.allSettled([
            axios.get(`${API_URL}/settings/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/friends/list`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/friends/requests`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/friends/suggestions?limit=8`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/notifications`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/location/meeting-point/active`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (profileRes.status === 'fulfilled') {
          const userData = profileRes.value.data.data;
          setCurrentUser(userData);
          dispatch(setUser(userData));
        }

        if (friendsRes.status === 'fulfilled') {
          setFriends(friendsRes.value.data.data || []);
        }

        if (requestsRes.status === 'fulfilled') {
          setFriendRequests(requestsRes.value.data.data || []);
        }

        if (suggestionsRes.status === 'fulfilled') {
          setSuggestions(suggestionsRes.value.data.data || []);
        }

        if (notifsRes.status === 'fulfilled') {
          setNotifications(notifsRes.value.data.data?.notifications || []);
        }

        if (meetingPointRes.status === 'fulfilled' && meetingPointRes.value.data?.data) {
          dispatch(setMeetingPoint(meetingPointRes.value.data.data));
        }
      } catch (err) {
        console.error('Dashboard init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [navigate, dispatch]);

  // Socket.IO Setup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user?._id) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register_user', user._id);
    });

    socket.on('receive_message', (newMsg) => {
      if (activeChat && (newMsg.senderId === activeChat._id || newMsg.recipientId === activeChat._id)) {
        setMessages((prev) => [...prev, newMsg]);
      }
      setNotifications((prev) => [
        {
          _id: Date.now().toString(),
          title: 'Direct Stream',
          description: newMsg.content,
          type: 'message',
          createdAt: new Date().toISOString(),
          isRead: false,
        },
        ...prev,
      ]);
    });

    socket.on('user_typing', ({ senderId }) => {
      if (activeChat && activeChat._id === senderId) setPeerTyping(true);
    });

    socket.on('user_stop_typing', ({ senderId }) => {
      if (activeChat && activeChat._id === senderId) setPeerTyping(false);
    });

    socket.on('friend_location_update', (locationData) => {
      setFriends((prev) =>
        prev.map((f) => {
          if (f._id === locationData.userId || f.userId === locationData.userId) {
            return {
              ...f,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              lastUpdated: locationData.timestamp,
            };
          }
          return f;
        })
      );
    });

    socket.on('friend_request_received', (reqData) => {
      setNotifications((prev) => [
        {
          _id: Date.now().toString(),
          title: 'Peer Link Request',
          description: `@${reqData.senderName || 'user'} requested workspace peering`,
          type: 'friend_request',
          createdAt: new Date().toISOString(),
          isRead: false,
        },
        ...prev,
      ]);
    });

    socket.on('meeting_point_set', (meetingData) => {
      if (meetingData) {
        dispatch(setMeetingPoint(meetingData));
        setNotifications((prev) => [
          {
            _id: Date.now().toString(),
            title: '🎯 Shared Meeting Point Active',
            description: `${meetingData.title || 'Meeting Point'} at ${meetingData.address || 'Campus'}`,
            type: 'meeting_point',
            createdAt: new Date().toISOString(),
            isRead: false,
          },
          ...prev,
        ]);
      }
    });

    socket.on('meeting_point_cleared', () => {
      dispatch(clearMeetingPoint());
      setNotifications((prev) => [
        {
          _id: Date.now().toString(),
          title: '🎯 Meeting Point Cleared',
          description: 'The active campus meeting point was removed',
          type: 'meeting_point',
          createdAt: new Date().toISOString(),
          isRead: false,
        },
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, activeChat, dispatch]);

  // Fetch active conversation
  useEffect(() => {
    if (!activeChat) return;

    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/chat/conversation/${activeChat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.data?.messages || []);
      } catch (err) {
        console.error('Chat load error:', err);
      }
    };

    fetchChat();
  }, [activeChat]);

  const handleLogout = () => {
    if (parentLogout) parentLogout();
    else dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    const content = messageInput.trim();
    setMessageInput('');

    if (socketRef.current) {
      socketRef.current.emit('stop_typing', { senderId: user._id, recipientId: activeChat._id });
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/chat/send`,
        { recipientId: activeChat._id, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedMsg = response.data.data;
      setMessages((prev) => [...prev, savedMsg]);

      if (socketRef.current) {
        socketRef.current.emit('send_message', {
          senderId: user._id,
          recipientId: activeChat._id,
          content,
          messageId: savedMsg._id,
        });
      }
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const handleTypingInput = (e) => {
    setMessageInput(e.target.value);

    if (!isTyping && socketRef.current && activeChat) {
      setIsTyping(true);
      socketRef.current.emit('typing', { senderId: user._id, recipientId: activeChat._id });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socketRef.current && activeChat) {
        socketRef.current.emit('stop_typing', { senderId: user._id, recipientId: activeChat._id });
      }
    }, 1200);
  };

  const handleSendFriendRequest = async (recipientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/friends/request/${recipientId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuggestions((prev) => prev.filter((s) => s._id !== recipientId));

      if (socketRef.current) {
        socketRef.current.emit('send_friend_request', {
          senderId: user._id,
          recipientId,
          senderName: user.username,
        });
      }
    } catch (err) {
      console.error('Friend request error:', err);
    }
  };

  const handleAcceptRequest = async (requestId, sender) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/friends/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFriendRequests((prev) => prev.filter((r) => r._id !== requestId));
      if (sender) setFriends((prev) => [...prev, sender]);
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleMeetingPointChange = async (type, payload) => {
    const token = localStorage.getItem('token');
    if (type === 'set') {
      try {
        const res = await axios.post(`${API_URL}/location/meeting-point`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const saved = res.data?.data || payload;
        if (socketRef.current) {
          socketRef.current.emit('set_meeting_point', { meetingPoint: saved });
        }
      } catch (err) {
        console.error('Meeting point save error:', err);
        if (socketRef.current) {
          socketRef.current.emit('set_meeting_point', { meetingPoint: payload });
        }
      }
    } else if (type === 'clear') {
      try {
        await axios.delete(`${API_URL}/location/meeting-point/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (socketRef.current) {
          socketRef.current.emit('clear_meeting_point');
        }
      } catch (err) {
        console.error('Meeting point clear error:', err);
        if (socketRef.current) {
          socketRef.current.emit('clear_meeting_point');
        }
      }
    }
  };

  const handleToggleLocation = async () => {
    const newState = !isSharingLocation;
    setIsSharingLocation(newState);

    try {
      const token = localStorage.getItem('token');
      const endpoint = newState ? '/location/start-sharing' : '/location/stop-sharing';
      await axios.post(`${API_URL}${endpoint}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error('Location toggle error:', err);
    }
  };

  const filteredFriends = friends.filter((f) =>
    (f.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="h-screen flex flex-col bg-[#070A10] text-[#F3F5F2] font-sans overflow-hidden antialiased selection:bg-[#D9FF35] selection:text-[#070A10]">
      {/* Top IDE Workspace Bar */}
      <header className="h-14 bg-[#0A0E14] border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 font-mono">
        {/* Brand & Node Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#101A18] border border-[#D9FF35]/40 flex items-center justify-center text-[#D9FF35]">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#F3F5F2]">compasu</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/[0.08] text-[11px] text-[#626B69]">
            <span>NODE:</span>
            <span className="text-[#D9FF35] font-semibold">VIT_CHENNAI (ap-south-1)</span>
            <span>•</span>
            <span className="text-[#A2AAA7] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF35]" />
              8.4ms
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 text-xs">
          {/* Geolocation status toggle */}
          <button
            type="button"
            onClick={handleToggleLocation}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] border transition ${
              isSharingLocation
                ? 'bg-[#101A18] text-[#D9FF35] border-[#D9FF35]/30'
                : 'bg-[#0D1218] text-[#626B69] border-white/[0.06]'
            }`}
          >
            <Radio className={`w-3 h-3 ${isSharingLocation ? 'animate-pulse text-[#D9FF35]' : ''}`} />
            <span>{isSharingLocation ? 'RADAR ACTIVE' : 'GHOST MODE'}</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded bg-[#10151A] hover:bg-[#17231F] text-[#A2AAA7] hover:text-[#F3F5F2] border border-white/[0.06] transition"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D9FF35] text-[#070A10] rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1 w-80 bg-[#0D1218] border border-white/[0.1] rounded-xl shadow-2xl p-3 z-50 text-left font-mono text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[#A2AAA7]">
                    <span>Notification Stream</span>
                    <button
                      type="button"
                      onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))}
                      className="text-[#D9FF35] hover:underline text-[10px]"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-white/[0.04] mt-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-[#626B69] text-[11px]">
                        No stream events
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif._id} className="py-2 px-1">
                          <p className="font-semibold text-[#F3F5F2]">{notif.title}</p>
                          <p className="text-[10px] text-[#A2AAA7] mt-0.5">{notif.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
            <div className="w-7 h-7 rounded bg-[#101A18] border border-[#D9FF35]/30 flex items-center justify-center font-bold text-xs text-[#D9FF35]">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden lg:inline text-xs text-[#A2AAA7]">@{user?.username || 'user'}</span>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="p-1.5 rounded text-[#626B69] hover:text-[#F3F5F2] hover:bg-[#101A18] transition"
              title="Preferences"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded text-[#626B69] hover:text-red-400 hover:bg-[#101A18] transition"
              title="Disconnect"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main IDE Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-[#0A0E14] border-r border-white/[0.08] flex flex-col shrink-0 font-mono text-xs">
          {/* Navigation Mode Bar */}
          <div className="grid grid-cols-4 border-b border-white/[0.06] p-1 gap-1 bg-[#070A10]">
            {[
              { id: 'map', label: 'Radar', icon: MapPin },
              { id: 'chat', label: 'Stream', icon: MessageSquare },
              { id: 'discover', label: 'Peers', icon: UserPlus },
              { id: 'requests', label: 'Links', icon: Users, badge: friendRequests.length },
            ].map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedTab(id)}
                className={`relative py-2 rounded text-[11px] font-medium flex flex-col items-center justify-center gap-1 transition ${
                  selectedTab === id
                    ? 'bg-[#14201D] text-[#D9FF35] border border-[#D9FF35]/30'
                    : 'text-[#626B69] hover:text-[#A2AAA7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                {badge > 0 && (
                  <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="p-2.5 border-b border-white/[0.06]">
            <div className="bg-[#070A10] border border-white/[0.06] rounded px-2.5 py-1.5 flex items-center gap-2">
              <Search className="w-3 h-3 text-[#626B69]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="filter peer nodes..."
                className="bg-transparent border-none outline-none text-[11px] w-full text-[#F3F5F2] placeholder-[#626B69]"
              />
            </div>
          </div>

          {/* Sidebar Streams List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {(selectedTab === 'chat' || selectedTab === 'map') && (
              <>
                <div className="px-2 py-1 flex items-center justify-between text-[10px] text-[#626B69]">
                  <span>PEERS ({filteredFriends.length})</span>
                  <span className="text-[#D9FF35]">● online</span>
                </div>

                {filteredFriends.length === 0 ? (
                  <div className="py-12 text-center text-[#626B69] text-xs">
                    <p>No peer nodes linked</p>
                    <button
                      type="button"
                      onClick={() => setSelectedTab('discover')}
                      className="mt-2 text-[#D9FF35] hover:underline text-[11px]"
                    >
                      Discover VIT Peers →
                    </button>
                  </div>
                ) : (
                  filteredFriends.map((friend) => (
                    <button
                      key={friend._id}
                      type="button"
                      onClick={() => {
                        setActiveChat(friend);
                        setSelectedTab('chat');
                      }}
                      className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition ${
                        activeChat?._id === friend._id
                          ? 'bg-[#14201D] border-[#D9FF35]/40 text-[#F3F5F2]'
                          : 'bg-[#0D1218]/60 border-white/[0.04] text-[#A2AAA7] hover:bg-[#101A18]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded bg-[#101A18] border border-[#D9FF35]/20 flex items-center justify-center font-bold text-xs text-[#D9FF35] shrink-0">
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#F3F5F2] truncate">@{friend.username}</p>
                          <span className="text-[9px] text-[#D9FF35]">8ms</span>
                        </div>
                        <p className="text-[10px] text-[#626B69] truncate">{friend.campus || 'VIT Chennai'}</p>
                      </div>
                    </button>
                  ))
                )}
              </>
            )}

            {/* Discover Tab */}
            {selectedTab === 'discover' && (
              <>
                <div className="px-2 py-1 text-[10px] text-[#626B69]">
                  <span>CAMPUS DISCOVERY QUEUE</span>
                </div>
                {suggestions.map((peer) => (
                  <div
                    key={peer._id}
                    className="p-2.5 bg-[#0D1218]/60 border border-white/[0.04] rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-7 h-7 rounded bg-[#101A18] border border-white/[0.08] flex items-center justify-center font-bold text-xs text-[#A2AAA7] shrink-0">
                        {peer.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-xs text-[#F3F5F2] font-semibold truncate">@{peer.username}</p>
                        <p className="text-[9px] text-[#626B69] truncate">VIT Chennai Node</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSendFriendRequest(peer._id)}
                      className="px-2 py-1 bg-[#D9FF35] hover:bg-[#CFFF24] text-[#080B0E] rounded text-[10px] font-semibold shrink-0 transition"
                    >
                      + Link
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* Inbound Requests Tab */}
            {selectedTab === 'requests' && (
              <>
                <div className="px-2 py-1 text-[10px] text-[#626B69]">
                  <span>INBOUND LINK REQUESTS ({friendRequests.length})</span>
                </div>
                {friendRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-2.5 bg-[#0D1218]/60 border border-white/[0.04] rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#101A18] border border-[#D9FF35]/30 flex items-center justify-center font-bold text-xs text-[#D9FF35]">
                        {req.senderId?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="truncate">
                        <p className="text-xs text-[#F3F5F2] font-semibold truncate">@{req.senderId?.username}</p>
                        <p className="text-[9px] text-[#626B69]">Requested peer connection</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(req._id, req.senderId)}
                        className="flex-1 py-1 bg-[#D9FF35] text-[#080B0E] rounded text-[10px] font-semibold transition"
                      >
                        Accept Link
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const token = localStorage.getItem('token');
                          await axios.post(`${API_URL}/friends/reject/${req._id}`, {}, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          setFriendRequests((prev) => prev.filter((r) => r._id !== req._id));
                        }}
                        className="px-2.5 py-1 bg-[#17231F] text-[#A2AAA7] rounded text-[10px] transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col bg-[#070A10] overflow-hidden relative">
          {selectedTab === 'map' ? (
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
              <CampusMap
                friendsLocations={friends}
                userLocation={user?.location}
                onSelectFriendChat={(friend) => {
                  setActiveChat(friend);
                  setSelectedTab('chat');
                }}
                onMeetingPointChange={handleMeetingPointChange}
              />
            </div>
          ) : activeChat ? (
            <div className="flex-1 flex flex-col h-full bg-[#070A10] font-mono">
              {/* Chat Top Banner */}
              <div className="h-12 px-5 bg-[#0A0E14] border-b border-white/[0.08] flex items-center justify-between shrink-0 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-[#101A18] border border-[#D9FF35]/30 flex items-center justify-center font-bold text-[11px] text-[#D9FF35]">
                    {activeChat.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F3F5F2]">@{activeChat.username}</span>
                    <span className="text-[10px] text-[#D9FF35] bg-[#D9FF35]/10 px-1.5 py-0.5 rounded">e2e stream</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTab('map')}
                  className="px-2.5 py-1 bg-[#101A18] hover:bg-[#14201D] border border-white/[0.08] rounded text-[11px] text-[#D9FF35] flex items-center gap-1.5 transition"
                >
                  <MapPin className="w-3 h-3" />
                  <span>View Radar</span>
                </button>
              </div>

              {/* Message Log Stream */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 font-mono text-xs">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#626B69] text-center">
                    <Terminal className="w-8 h-8 mb-2 opacity-30 text-[#D9FF35]" />
                    <p className="text-xs font-semibold text-[#A2AAA7]">Stream established with @{activeChat.username}</p>
                    <p className="text-[10px] text-[#626B69] mt-0.5">Send a message to coordinate code meetups</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.senderId === user?._id || msg.senderId?._id === user?._id;
                    return (
                      <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-md px-3.5 py-2 rounded-lg leading-relaxed ${
                            isMe
                              ? 'bg-[#14201D] text-[#F3F5F2] border border-[#D9FF35]/30'
                              : 'bg-[#0D1218] border border-white/[0.08] text-[#A2AAA7]'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span className="block text-[9px] text-[#626B69] mt-1 text-right">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'now'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                {peerTyping && (
                  <div className="text-[10px] text-[#626B69] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF35] animate-pulse" />
                    <span>@{activeChat.username} is typing...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-[#0A0E14] border-t border-white/[0.08] shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={handleTypingInput}
                    placeholder={`send message to @${activeChat.username}...`}
                    className="flex-1 bg-[#070A10] border border-white/[0.08] rounded px-3 py-2 text-xs text-[#F3F5F2] placeholder-[#626B69] focus:outline-none focus:border-[#D9FF35] transition"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="h-8 px-4 bg-[#D9FF35] hover:bg-[#CFFF24] disabled:bg-[#101A18] disabled:text-[#626B69] text-[#080B0E] font-semibold rounded text-xs transition cursor-pointer"
                  >
                    Send ↵
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 font-mono text-xs text-[#626B69]">
              <div className="w-12 h-12 rounded-lg bg-[#101A18] border border-white/[0.08] flex items-center justify-center text-[#D9FF35] mb-3">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#F3F5F2]">Compasu Workspace // Online</h3>
              <p className="text-[11px] text-[#A2AAA7] max-w-sm mt-1">
                Select a peer node from the sidebar to open a direct stream, or switch to Radar mode for campus geolocation.
              </p>
              <button
                type="button"
                onClick={() => setSelectedTab('map')}
                className="mt-4 px-3 py-1.5 bg-[#D9FF35] hover:bg-[#CFFF24] text-[#080B0E] font-semibold rounded transition"
              >
                Launch Campus Radar
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
