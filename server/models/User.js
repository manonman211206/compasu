const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    campus: { type: String, default: 'VIT Chennai' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    refreshTokens: [
      {
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],
    lastActive: { type: Date, default: Date.now },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    privacySettings: {
      locationSharing: { type: Boolean, default: true },
      friendListVisibility: { type: String, default: 'friends' },
      onlineStatus: { type: Boolean, default: true },
    },
    notificationPreferences: {
      friendRequests: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      locationSharing: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);