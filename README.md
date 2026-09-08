# Compasu - Campus Connection Platform

## 📱 Project Overview

Compasu is a comprehensive campus social networking platform built with modern web technologies. It enables students to connect, chat in real-time, find friends, and view campus locations.

## 🎯 Core Features

### Authentication & Security
- ✅ User registration and login with email verification
- ✅ JWT-based authentication with refresh tokens
- ✅ Password reset functionality
- ✅ Secure password hashing with bcryptjs
- ✅ Rate limiting on authentication endpoints

### Friend Management
- ✅ Send/accept/reject friend requests
- ✅ Block/unblock users
- ✅ Friend suggestions algorithm
- ✅ Friend list management

### Real-time Chat
- ✅ Real-time messaging with Socket.IO
- ✅ Message history persistence
- ✅ Read receipts
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Conversation list with unread counts

### Campus Map & Location
- ✅ Location sharing with privacy controls
- ✅ Nearby friends discovery (geospatial queries)
- ✅ Campus map integration
- ✅ Location history

### Notifications
- ✅ Friend request notifications
- ✅ Message notifications
- ✅ Online status notifications
- ✅ Location sharing notifications
- ✅ Notification management (read/unread/delete)

### Settings & Privacy
- ✅ Profile management
- ✅ Password change
- ✅ Privacy settings (location, friend list, online status)
- ✅ Notification preferences
- ✅ Account deletion

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **React Router** - Routing

### Backend
- **Node.js** - Runtime
- **Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/compasu.git
   cd compasu
   ```

2. **Setup Backend**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   cp .env.example .env.local
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/compasu
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

## 🏗️ Project Structure

```



## 🔐 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT tokens with expiration (15 min access, 7 days refresh)
- HTTP-only secure cookies
- CORS protection
- Rate limiting on auth endpoints (5 requests/15 min)
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection with helmet
- CSRF protection via secure cookies
- Password reset token expiration (1 hour)
- Email verification tokens

## 📊 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh-token` - Refresh access token
- `POST /logout` - Logout user
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `POST /verify-email` - Verify email address
- `GET /me` - Get current user info

### Friends (`/api/v1/friends`)
- `POST /request/:recipientId` - Send friend request
- `POST /accept/:requestId` - Accept friend request
- `POST /reject/:requestId` - Reject friend request
- `DELETE /:friendId` - Remove friend
- `POST /block/:blockedUserId` - Block user
- `POST /unblock/:blockedUserId` - Unblock user
- `GET /requests` - Get pending friend requests
- `GET /list` - Get friend list
- `GET /blocked` - Get blocked users
- `GET /suggestions` - Get friend suggestions

### Chat (`/api/v1/chat`)
- `POST /send` - Send message
- `GET /conversation/:otherUserId` - Get conversation history
- `POST /mark-as-read` - Mark messages as read
- `DELETE /:messageId` - Delete message
- `GET /unread-count` - Get unread message count
- `GET /conversations-list` - Get conversations list

### Location (`/api/v1/location`)
- `POST /update` - Update user location
- `POST /stop-sharing` - Stop sharing location
- `POST /start-sharing` - Start sharing location
- `GET /friends` - Get friends' locations
- `GET /nearby` - Get nearby friends
- `GET /:userId` - Get user's location

### Notifications (`/api/v1/notifications`)
- `GET /` - Get notifications
- `GET /unread` - Get unread notifications
- `POST /:notificationId/read` - Mark as read
- `POST /mark-all-read` - Mark all as read
- `DELETE /:notificationId` - Delete notification
- `GET /unread-count` - Get unread count

### Settings (`/api/v1/settings`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `PUT /password` - Change password
- `PUT /privacy-settings` - Update privacy settings
- `PUT /notification-preferences` - Update notification preferences
- `DELETE /account` - Delete account

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

Access the application at http://localhost:5173

## 🚀 Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy

### Backend (Railway/Render)
1. Create account on Railway or Render
2. Connect GitHub repository
3. Set environment variables
4. Deploy

## 📈 Performance Optimization

- Code splitting with React Router
- Image optimization with Cloudinary
- Lazy loading of components
- MongoDB indexing on frequently queried fields
- Geospatial indexing for location queries
- Message pagination for chat history
- Connection pooling for database

## 🎨 Design System

- Modern SaaS design principles
- Dark mode by default
- Responsive across all devices
- Smooth animations with Framer Motion
- Consistent color palette (Indigo/Violet theme)
- Accessible UI with proper contrast

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📞 Support

For support, email support@compasu.com or open an issue on GitHub.

## 🎉 Acknowledgments

- Built with modern technologies
- Inspired by leading campus networking platforms
- Community-driven development

---

**Compasu** - Connecting campus communities one message at a time.
