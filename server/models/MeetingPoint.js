const mongoose = require('mongoose');

const MeetingPointSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Campus Meeting Point' },
    description: { type: String, default: '' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, default: 'VIT Chennai Meeting Point' },
    radiusMeters: { type: Number, default: 50 },
    active: { type: Boolean, default: true },
    groupId: { type: String, default: 'default-campus-session' },
  },
  { timestamps: true }
);

MeetingPointSchema.index({ active: 1, createdAt: -1 });

module.exports = mongoose.model('MeetingPoint', MeetingPointSchema);
