const Notification = require('../models/Notification');
const logger = require('../utils/logger');

class NotificationService {
  async createNotification(userId, type, title, description = null, relatedUserId = null, relatedId = null) {
    const notification = new Notification({
      userId,
      type,
      title,
      description,
      relatedUserId,
      relatedId,
    });

    await notification.save();
    await notification.populate('relatedUserId', 'username profilePicture');

    logger.info(`Notification created for user ${userId}: ${type}`);

    return notification;
  }

  async getNotifications(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
      .populate('relatedUserId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ userId });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadNotifications(userId) {
    const notifications = await Notification.find({ userId, isRead: false })
      .populate('relatedUserId', 'username profilePicture')
      .sort({ createdAt: -1 });

    return notifications;
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true, readAt: new Date() });

    logger.info(`All notifications marked as read for user ${userId}`);

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(notificationId, userId) {
    await Notification.deleteOne({ _id: notificationId, userId });

    logger.info(`Notification ${notificationId} deleted for user ${userId}`);

    return { message: 'Notification deleted' };
  }

  async getUnreadCount(userId) {
    const count = await Notification.countDocuments({ userId, isRead: false });
    return { unreadCount: count };
  }
}

module.exports = new NotificationService();