// client/src/components/auth.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      // Connect to our Express backend
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      if (isLogin) {
        // Save the token to local storage and update app state
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        alert(`Welcome back, ${res.data.user.username}!`);
      } else {
        alert("Registration successful! Please log in.");
        setIsLogin(true); // Switch to login view
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        {isLogin ? 'Log In to CampusConnect' : 'Join CampusConnect'}
      </h2>
      
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input 
            type="text" name="username" placeholder="Username" onChange={handleChange}
            className="w-full p-2 border rounded" required 
          />
        )}
        <input 
          type="email" name="email" placeholder="College Email" onChange={handleChange}
          className="w-full p-2 border rounded" required 
        />
        <input 
          type="password" name="password" placeholder="Password" onChange={handleChange}
          className="w-full p-2 border rounded" required 
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600 cursor-pointer hover:underline" 
         onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
      </p>
    </div>
  );
}