# Compasu API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "statusCode": 200
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  },
  "statusCode": 200
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Authentication Endpoints

### Register
```
POST /auth/register
```

Request Body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "message": "Registration successful. Please verify your email."
  },
  "statusCode": 201
}
```

### Login
```
POST /auth/login
```

Request Body:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    }
  },
  "statusCode": 200
}
```

### Refresh Token
```
POST /auth/refresh-token
```

Request Body:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer <access_token>
```

### Forgot Password
```
POST /auth/forgot-password
```

Request Body:
```json
{
  "email": "john@example.com"
}
```

### Reset Password
```
POST /auth/reset-password
```

Request Body:
```json
{
  "resetToken": "token_from_email",
  "password": "NewSecurePassword123",
  "confirmPassword": "NewSecurePassword123"
}
```

## Friend Management Endpoints

### Send Friend Request
```
POST /friends/request/:recipientId
Authorization: Bearer <access_token>
```

### Accept Friend Request
```
POST /friends/accept/:requestId
Authorization: Bearer <access_token>
```

### Reject Friend Request
```
POST /friends/reject/:requestId
Authorization: Bearer <access_token>
```

### Remove Friend
```
DELETE /friends/:friendId
Authorization: Bearer <access_token>
```

### Get Friend Requests
```
GET /friends/requests?status=pending
Authorization: Bearer <access_token>
```

Query Parameters:
- `status` (optional): 'pending', 'accepted', 'rejected'

### Get Friends List
```
GET /friends/list
Authorization: Bearer <access_token>
```

### Get Friend Suggestions
```
GET /friends/suggestions?limit=10
Authorization: Bearer <access_token>
```

## Chat Endpoints

### Send Message
```
POST /chat/send
Authorization: Bearer <access_token>
```

Request Body:
```json
{
  "recipientId": "recipient_user_id",
  "content": "Hello, how are you?"
}
```

### Get Conversation
```
GET /chat/conversation/:otherUserId?page=1&limit=50
Authorization: Bearer <access_token>
```

### Mark Messages as Read
```
POST /chat/mark-as-read
Authorization: Bearer <access_token>
```

Request Body:
```json
{
  "messageIds": ["msg_id_1", "msg_id_2"]
}
```

### Get Unread Count
```
GET /chat/unread-count
Authorization: Bearer <access_token>
```

## Location Endpoints

### Update Location
```
POST /location/update
Authorization: Bearer <access_token>
```

Request Body:
```json
{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "accuracy": 50,
  "address": "Delhi, India"
}
```

### Stop Sharing Location
```
POST /location/stop-sharing
Authorization: Bearer <access_token>
```

### Start Sharing Location
```
POST /location/start-sharing
Authorization: Bearer <access_token>
```

### Get Friends' Locations
```
GET /location/friends
Authorization: Bearer <access_token>
```

### Get Nearby Friends
```
GET /location/nearby?radius=5000
Authorization: Bearer <access_token>
```

Query Parameters:
- `radius` (optional): Distance in meters (default: 5000)

## Notification Endpoints

### Get Notifications
```
GET /notifications?page=1&limit=20
Authorization: Bearer <access_token>
```

### Get Unread Notifications
```
GET /notifications/unread
Authorization: Bearer <access_token>
```

### Mark as Read
```
POST /notifications/:notificationId/read
Authorization: Bearer <access_token>
```

### Mark All as Read
```
POST /notifications/mark-all-read
Authorization: Bearer <access_token>
```

### Get Unread Count
```
GET /notifications/unread-count
Authorization: Bearer <access_token>
```

## Settings Endpoints

### Get Profile
```
GET /settings/profile
Authorization: Bearer <access_token>
```

### Update Profile
```
PUT /settings/profile
Authorization: Bearer <access_token>
```

Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software Engineer",
  "campus": "Delhi University"
}
```

### Change Password
```
PUT /settings/password
Authorization: Bearer <access_token>
```

Request Body:
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

### Update Privacy Settings
```
PUT /settings/privacy-settings
Authorization: Bearer <access_token>
```

Request Body:
```json
{
  "privacySettings": {
    "locationVisible": true,
    "friendListVisible": true,
    "onlineStatusVisible": true,
    "allowFriendRequests": true
  }
}
```

### Update Notification Preferences
```
PUT /settings/notification-preferences
Authorization: Bearer <access_token>
```

Request Body:
```json
{
  "notificationPreferences": {
    "friendRequests": true,
    "messages": true,
    "friendOnline": false,
    "locationShared": true
  }
}
```

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized (Missing or invalid token)
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (Duplicate entry)
- `429` - Too Many Requests (Rate limited)
- `500` - Internal Server Error

## Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes
- **Chat messages**: 30 requests per 1 minute
- **API endpoints**: 100 requests per 15 minutes

## Socket.IO Events

### Client to Server

```javascript
// User registration
socket.emit('register_user', userId);

// Send message
socket.emit('send_message', {
  senderId,
  recipientId,
  content,
  messageId
});

// Typing indicator
socket.emit('typing', { senderId, recipientId });
socket.emit('stop_typing', { senderId, recipientId });

// Message read receipt
socket.emit('message_read', { senderId, recipientId, messageId });

// Location update
socket.emit('update_location', {
  userId,
  latitude,
  longitude,
  accuracy
});
```

### Server to Client

```javascript
// User online
socket.on('user_online', ({ userId, socketId }) => {});

// User offline
socket.on('user_offline', ({ userId }) => {});

// Receive message
socket.on('receive_message', (message) => {});

// User typing
socket.on('user_typing', ({ senderId }) => {});
socket.on('user_stop_typing', ({ senderId }) => {});

// Message read receipt
socket.on('message_read_receipt', ({ messageId, recipientId }) => {});

// Location update
socket.on('friend_location_update', ({
  userId,
  latitude,
  longitude,
  accuracy,
  timestamp
}) => {});
```
