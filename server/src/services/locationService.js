const Location = require('../models/Location');
const logger = require('../utils/logger');

class LocationService {
  async updateLocation(userId, latitude, longitude, accuracy = null, address = null) {
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error('Invalid latitude or longitude');
    }

    const location = await Location.findOneAndUpdate(
      { userId },
      {
        userId,
        latitude,
        longitude,
        coordinates: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        accuracy,
        address,
        lastUpdated: new Date(),
        isSharing: true,
      },
      { upsert: true, new: true }
    );

    logger.info(`Location updated for user ${userId}`);

    return location;
  }

  async stopSharingLocation(userId) {
    const location = await Location.findOneAndUpdate(
      { userId },
      { isSharing: false },
      { new: true }
    );

    logger.info(`Location sharing stopped for user ${userId}`);

    return location;
  }

  async startSharingLocation(userId) {
    const location = await Location.findOneAndUpdate(
      { userId },
      { isSharing: true },
      { new: true }
    );

    logger.info(`Location sharing started for user ${userId}`);

    return location;
  }

  async getFriendLocations(userId) {
    const locations = await Location.find({
      isSharing: true,
      userId: { $ne: userId },
    }).populate('userId', 'username profilePicture bio');

    return locations;
  }

  async getNearbyFriends(userId, radiusInMeters = 5000) {
    const userLocation = await Location.findOne({ userId, isSharing: true });

    if (!userLocation) {
      throw new Error('Your location is not being shared');
    }

    const nearbyFriends = await Location.find({
      isSharing: true,
      userId: { $ne: userId },
      coordinates: {
        $near: {
          $geometry: userLocation.coordinates,
          $maxDistance: radiusInMeters,
        },
      },
    }).populate('userId', 'username profilePicture bio');

    return nearbyFriends;
  }

  async getUserLocation(userId) {
    const location = await Location.findOne({ userId, isSharing: true }).populate(
      'userId',
      'username profilePicture'
    );

    if (!location) {
      throw new Error('User location not available');
    }

    return location;
  }
}

module.exports = new LocationService();