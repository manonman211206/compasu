const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
