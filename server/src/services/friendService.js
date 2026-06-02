const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

class FriendService {
  async sendFriendRequest(senderId, recipientId) {
    if (senderId.toString() === recipientId.toString()) {
      throw new Error('Cannot send friend request to yourself');
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      throw new Error('User not found');
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    });

    if (existingRequest) {
      throw new Error('Friend request already exists');
    }

    const isFriend = await User.findOne({
      _id: senderId,
      friends: recipientId,
    });

    if (isFriend) {
      throw new Error('Already friends');
    }

    const friendRequest = new FriendRequest({
      senderId,
      recipientId,
      status: 'pending',
    });

    await friendRequest.save();

    await Notification.create({
      userId: recipientId,
      type: 'friend_request',
      title: 'New Friend Request',
      relatedUserId: senderId,
      relatedId: friendRequest._id,
    });

    logger.info(`Friend request sent from ${senderId} to ${recipientId}`);

    return friendRequest;
  }

  async acceptFriendRequest(requestId, userId) {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    if (friendRequest.recipientId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    friendRequest.status = 'accepted';
    friendRequest.respondedAt = new Date();
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.senderId, {
      $addToSet: { friends: friendRequest.recipientId },
    });

    await User.findByIdAndUpdate(friendRequest.recipientId, {
      $addToSet: { friends: friendRequest.senderId },
    });

    await Notification.create({
      userId: friendRequest.senderId,
      type: 'friend_accepted',
      title: 'Friend Request Accepted',
      relatedUserId: friendRequest.recipientId,
      relatedId: friendRequest._id,
    });

    logger.info(`Friend request ${requestId} accepted`);

    return friendRequest;
  }

  async rejectFriendRequest(requestId, userId) {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    if (friendRequest.recipientId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    friendRequest.status = 'rejected';
    friendRequest.respondedAt = new Date();
    await friendRequest.save();

    logger.info(`Friend request ${requestId} rejected`);

    return friendRequest;
  }

  async removeFriend(userId, friendId) {
    if (userId.toString() === friendId.toString()) {
      throw new Error('Cannot remove yourself');
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
    });

    logger.info(`${userId} removed friend ${friendId}`);

    return { message: 'Friend removed' };
  }

  async blockUser(userId, blockedUserId) {
    if (userId.toString() === blockedUserId.toString()) {
      throw new Error('Cannot block yourself');
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { blockedUsers: blockedUserId },
      $pull: { friends: blockedUserId },
    });

    logger.info(`${userId} blocked ${blockedUserId}`);

    return { message: 'User blocked' };
  }

  async unblockUser(userId, blockedUserId) {
    await User.findByIdAndUpdate(userId, {
      $pull: { blockedUsers: blockedUserId },
    });

    logger.info(`${userId} unblocked ${blockedUserId}`);

    return { message: 'User unblocked' };
  }

  async getFriendRequests(userId, status = 'pending') {
    const requests = await FriendRequest.find({
      recipientId: userId,
      status,
    })
      .populate('senderId', 'username email profilePicture')
      .sort({ createdAt: -1 });

    return requests;
  }

  async getFriends(userId) {
    const user = await User.findById(userId)
      .populate('friends', 'username email profilePicture bio campus lastActive')
      .select('friends');

    return user?.friends || [];
  }

  async getBlockedUsers(userId) {
    const user = await User.findById(userId)
      .populate('blockedUsers', 'username email profilePicture')
      .select('blockedUsers');

    return user?.blockedUsers || [];
  }

  async getFriendSuggestions(userId, limit = 10) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const suggestions = await User.find({
      _id: {
        $nin: [...user.friends, ...user.blockedUsers, userId],
      },
    })
      .select('username email profilePicture bio campus')
      .limit(limit);

    return suggestions;
  }
}

module.exports = new FriendService();