const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

FriendRequestSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);
