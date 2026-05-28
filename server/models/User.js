// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Setting up for future modules:
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);