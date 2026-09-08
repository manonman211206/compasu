const notificationService = require('../../src/services/notificationService');
const Notification = require('../../models/Notification');

jest.mock('../../models/Notification');

describe('NotificationService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create and save a notification', async () => {
      const mockNotif = {
        _id: 'notif123',
        userId: 'user1',
        type: 'friend_request',
        title: 'New Request',
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockResolvedValue(true),
      };

      Notification.mockImplementation(() => mockNotif);

      const res = await notificationService.createNotification(
        'user1',
        'friend_request',
        'New Request',
        'Someone added you'
      );

      expect(mockNotif.save).toHaveBeenCalled();
      expect(res.title).toBe('New Request');
    });
  });

  describe('markAsRead', () => {
    it('should throw error if notification not found', async () => {
      Notification.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        notificationService.markAsRead('notif123', 'user1')
      ).rejects.toThrow('Notification not found');
    });

    it('should mark notification as read', async () => {
      Notification.findOneAndUpdate.mockResolvedValue({
        _id: 'notif123',
        isRead: true,
      });

      const res = await notificationService.markAsRead('notif123', 'user1');
      expect(res.isRead).toBe(true);
    });
  });
});
