// client/src/components/Landing.jsx
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center p-6">
      <div className="max-w-3xl">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-6 tracking-tight">
          CampusConnect
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          The ultimate platform for college students. Locate your friends on the campus map, 
          join global chats, and host watch parties all in one place.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Get Started
          </Link>
          <a href="#features" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg border border-blue-200 hover:bg-blue-50 transition shadow-sm">
            Learn More
          </a>
        </div>
      </div>

      {/* Mock Graphic / Illustration space */}
      <div className="mt-16 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gray-800 p-3 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
          Dashboard Preview Graphic
        </div>
      </div>
    </div>
  );
}