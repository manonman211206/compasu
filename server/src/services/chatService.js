const Message = require('../models/Message');
const logger = require('../utils/logger');

class ChatService {
  async sendMessage(senderId, recipientId, content) {
    if (!content || content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    const message = new Message({
      senderId,
      recipientId,
      content: content.trim(),
    });

    await message.save();
    await message.populate('senderId', 'username profilePicture');

    logger.info(`Message sent from ${senderId} to ${recipientId}`);

    return message;
  }

  async getConversation(userId, otherUserId, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: otherUserId, deletedBySender: false },
        { senderId: otherUserId, recipientId: userId, deletedByRecipient: false },
      ],
    })
      .populate('senderId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({
      $or: [
        { senderId: userId, recipientId: otherUserId, deletedBySender: false },
        { senderId: otherUserId, recipientId: userId, deletedByRecipient: false },
      ],
    });

    return {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(messageIds, userId) {
    await Message.updateMany(
      { _id: { $in: messageIds }, recipientId: userId },
      { isRead: true, readAt: new Date() }
    );

    return { message: 'Messages marked as read' };
  }

  async deleteMessage(messageId, userId) {
    const message = await Message.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId.toString() === userId.toString()) {
      message.deletedBySender = true;
    } else if (message.recipientId.toString() === userId.toString()) {
      message.deletedByRecipient = true;
    } else {
      throw new Error('Unauthorized');
    }

    if (message.deletedBySender && message.deletedByRecipient) {
      await Message.deleteOne({ _id: messageId });
    } else {
      await message.save();
    }

    return { message: 'Message deleted' };
  }

  async getUnreadCount(userId) {
    const count = await Message.countDocuments({
      recipientId: userId,
      isRead: false,
      deletedByRecipient: false,
    });

    return { unreadCount: count };
  }

  async getConversationList(userId) {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: require('mongoose').Types.ObjectId(userId) },
            { recipientId: require('mongoose').Types.ObjectId(userId) },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', require('mongoose').Types.ObjectId(userId)] },
              '$recipientId',
              '$senderId',
            ],
          },
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipientId', require('mongoose').Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.username',
          userProfilePicture: '$user.profilePicture',
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1,
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return conversations;
  }
}

module.exports = new ChatService();