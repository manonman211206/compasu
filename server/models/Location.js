const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    accuracy: { type: Number, default: null },
    address: { type: String, default: null },
    isSharing: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

LocationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Location', LocationSchema);
