const friendService = require('../../src/services/friendService');
const User = require('../../models/User');
const FriendRequest = require('../../models/FriendRequest');
const Notification = require('../../models/Notification');

jest.mock('../../models/User');
jest.mock('../../models/FriendRequest');
jest.mock('../../models/Notification');

describe('FriendService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendFriendRequest', () => {
    it('should throw error if sender sends request to self', async () => {
      await expect(
        friendService.sendFriendRequest('user1', 'user1')
      ).rejects.toThrow('Cannot send friend request to yourself');
    });

    it('should throw error if recipient does not exist', async () => {
      User.findById.mockResolvedValue(null);

      await expect(
        friendService.sendFriendRequest('user1', 'user2')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if friend request already exists', async () => {
      User.findById.mockResolvedValue({ _id: 'user2' });
      FriendRequest.findOne.mockResolvedValue({ _id: 'req123' });

      await expect(
        friendService.sendFriendRequest('user1', 'user2')
      ).rejects.toThrow('Friend request already exists');
    });

    it('should throw error if users are already friends', async () => {
      User.findById.mockResolvedValue({ _id: 'user2' });
      FriendRequest.findOne.mockResolvedValue(null);
      User.findOne.mockResolvedValue({ _id: 'user1', friends: ['user2'] });

      await expect(
        friendService.sendFriendRequest('user1', 'user2')
      ).rejects.toThrow('Already friends');
    });

    it('should create and save a new friend request', async () => {
      User.findById.mockResolvedValue({ _id: 'user2' });
      FriendRequest.findOne.mockResolvedValue(null);
      User.findOne.mockResolvedValue(null);

      const mockRequest = {
        _id: 'req123',
        senderId: 'user1',
        recipientId: 'user2',
        status: 'pending',
        save: jest.fn().mockResolvedValue(true),
      };
      FriendRequest.mockImplementation(() => mockRequest);
      Notification.create.mockResolvedValue(true);

      const result = await friendService.sendFriendRequest('user1', 'user2');

      expect(mockRequest.save).toHaveBeenCalled();
      expect(Notification.create).toHaveBeenCalled();
      expect(result).toHaveProperty('status', 'pending');
    });
  });

  describe('acceptFriendRequest', () => {
    it('should throw error if request not found', async () => {
      FriendRequest.findById.mockResolvedValue(null);

      await expect(
        friendService.acceptFriendRequest('req123', 'user2')
      ).rejects.toThrow('Friend request not found');
    });

    it('should throw error if recipient does not match userId', async () => {
      FriendRequest.findById.mockResolvedValue({
        _id: 'req123',
        recipientId: 'otherUser',
      });

      await expect(
        friendService.acceptFriendRequest('req123', 'user2')
      ).rejects.toThrow('Unauthorized');
    });

    it('should accept friend request and update friends array', async () => {
      const mockReq = {
        _id: 'req123',
        senderId: 'user1',
        recipientId: 'user2',
        status: 'pending',
        save: jest.fn().mockResolvedValue(true),
      };
      FriendRequest.findById.mockResolvedValue(mockReq);
      User.findByIdAndUpdate.mockResolvedValue({});
      Notification.create.mockResolvedValue({});

      const res = await friendService.acceptFriendRequest('req123', 'user2');

      expect(res.status).toBe('accepted');
      expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(2);
    });
  });
});
