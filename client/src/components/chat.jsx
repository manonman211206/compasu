// client/src/components/chat.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect directly to your local Node.js backend
const socket = io.connect("http://localhost:5000");

export default function Chat({ username }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        author: username || "Student",
        message: currentMessage,
        // Grabs the current hour and minute for the timestamp
        time: new Date(Date.now()).getHours() + ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2, '0'),
      };

      // 1. Emit the message to the backend server
      await socket.emit("send_message", messageData);

      // 2. Add the message to your own screen instantly
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage(""); // Clear the input box
    }
  };

  useEffect(() => {
    // 3. Listen for incoming messages broadcasted by the server
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveMessageHandler);

    // Cleanup the listener when the component unmounts so messages don't duplicate
    return () => socket.off("receive_message", receiveMessageHandler);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">

      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-xl font-bold flex justify-between items-center">
        <span>Campus Global Chat</span>
        <span className="flex items-center text-xs bg-blue-500 px-2 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          Live
        </span>
      </div>

      {/* Chat Body (Message History) */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
        {messageList.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm">
            No messages yet. Be the first to say hello!
          </div>
        ) : (
          messageList.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.author === username ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[75%] shadow-sm ${msg.author === username
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
              >
                <p className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-70">
                  {msg.author === username ? 'You' : msg.author}
                </p>
                <p className="text-sm">{msg.message}</p>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 font-medium">{msg.time}</span>
            </div>
          ))
        )}
      </div>

      {/* Chat Input Area */}
      <div className="p-4 border-t bg-white rounded-b-xl flex gap-2">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message to the campus..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition active:scale-95 shadow-sm"
        >
          Send
        </button>
      </div>

    </div>
  );
}