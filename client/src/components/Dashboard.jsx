// client/src/components/Dashboard.jsx
import React, { useState } from 'react';
import Chat from './chat'; 

export default function Dashboard({ handleLogout }) {
  const [activeTab, setActiveTab] = useState('map'); // 'chat' or 'map'

  // Mock Data for the frontend design
  const mockFriends = [
    { id: 1, name: "Rahul", status: "Online", location: "Library" },
    { id: 2, name: "Priya", status: "In Class", location: "CS Block" },
    { id: 3, name: "Amit", status: "Offline", location: "Hostel" }
  ];

  const mockUsersOnCampus = [
    { id: 4, name: "Sneha", mutuals: 2 },
    { id: 5, name: "Vikram", mutuals: 0 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Navigation */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md z-10">
        <h1 className="text-2xl font-bold tracking-wider">CampusConnect</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">Welcome, Manonman!</span>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition text-sm font-bold shadow">
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar: Navigation & Friends */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="p-4 border-b">
            <h2 className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wide">Menu</h2>
            <ul className="space-y-2">
              <li onClick={() => setActiveTab('map')} className={`p-3 rounded-lg cursor-pointer font-semibold transition ${activeTab === 'map' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                📍 Campus Map
              </li>
              <li onClick={() => setActiveTab('chat')} className={`p-3 rounded-lg cursor-pointer font-semibold transition ${activeTab === 'chat' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                💬 Global Chat
              </li>
            </ul>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-wide">Your Friends</h2>
            <ul className="space-y-3">
              {mockFriends.map(friend => (
                <li key={friend.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${friend.status === 'Online' ? 'bg-green-500' : friend.status === 'In Class' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                    <span className="font-medium text-gray-800">{friend.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{friend.location}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Center Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
           
           {activeTab === 'chat' ? (
             <div className="max-w-4xl mx-auto"><Chat username="Manonman" /></div>
           ) : (
             <div className="max-w-5xl mx-auto flex gap-6 flex-col lg:flex-row">
                
                {/* Mock Map Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
                  <div className="p-4 border-b bg-gray-50 font-bold text-gray-700 flex justify-between">
                    <span>Live Campus Map</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200">GPS Active</span>
                  </div>
                  <div className="flex-1 bg-blue-50 relative flex items-center justify-center">
                    {/* Fake Map Graphic */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative text-center z-10 p-6 bg-white bg-opacity-90 rounded-xl shadow-lg border border-blue-100">
                      <span className="text-4xl mb-2 block">🗺️</span>
                      <h3 className="font-bold text-gray-800 mb-1">Mapbox Integration Pending</h3>
                      <p className="text-sm text-gray-500">Real-time geolocation will render here.</p>
                    </div>
                  </div>
                </div>

                {/* Mock Discover Students Area */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Discover Students</h3>
                    <ul className="space-y-4">
                      {mockUsersOnCampus.map(user => (
                        <li key={user.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.mutuals} mutual friends</p>
                          </div>
                          <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-xs font-bold transition">
                            Add +
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

             </div>
           )}

        </main>
      </div>
    </div>
  );
}