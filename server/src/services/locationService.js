const Location = require('../models/Location');
const MeetingPoint = require('../models/MeetingPoint');
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

  // --- Meeting Point Methods ---
  async setMeetingPoint(userId, latitude, longitude, title = 'Campus Meeting Point', address = 'VIT Chennai Meeting Point', description = '', groupId = 'default-campus-session') {
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error('Invalid coordinates for meeting point');
    }

    // Deactivate previous active meeting points for the group
    await MeetingPoint.updateMany({ groupId, active: true }, { active: false });

    const meetingPoint = new MeetingPoint({
      createdBy: userId,
      latitude,
      longitude,
      title: title || 'Campus Meeting Point',
      address: address || 'VIT Chennai Campus Meeting Point',
      description,
      groupId,
      active: true,
    });

    await meetingPoint.save();
    await meetingPoint.populate('createdBy', 'username profilePicture');

    logger.info(`Meeting point set by ${userId} at [${latitude}, ${longitude}]`);
    return meetingPoint;
  }

  async getActiveMeetingPoint(groupId = 'default-campus-session') {
    const meetingPoint = await MeetingPoint.findOne({ groupId, active: true })
      .populate('createdBy', 'username profilePicture')
      .sort({ createdAt: -1 });

    return meetingPoint;
  }

  async clearMeetingPoint(groupId = 'default-campus-session') {
    await MeetingPoint.updateMany({ groupId, active: true }, { active: false });
    logger.info(`Meeting point cleared for group ${groupId}`);
    return { message: 'Meeting point cleared successfully' };
  }
}

module.exports = new LocationService();