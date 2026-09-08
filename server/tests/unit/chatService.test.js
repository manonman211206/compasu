const chatService = require('../../src/services/chatService');
const Message = require('../../models/Message');

jest.mock('../../models/Message');

describe('ChatService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should throw error if message content is empty', async () => {
      await expect(
        chatService.sendMessage('user1', 'user2', '   ')
      ).rejects.toThrow('Message content cannot be empty');
    });

    it('should save and return message', async () => {
      const mockMessage = {
        _id: 'msg123',
        senderId: 'user1',
        recipientId: 'user2',
        content: 'Hello at VIT AB-1!',
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockResolvedValue(true),
      };

      Message.mockImplementation(() => mockMessage);

      const result = await chatService.sendMessage('user1', 'user2', 'Hello at VIT AB-1!');

      expect(mockMessage.save).toHaveBeenCalled();
      expect(mockMessage.populate).toHaveBeenCalled();
      expect(result.content).toBe('Hello at VIT AB-1!');
    });
  });

  describe('deleteMessage', () => {
    it('should throw error if message not found', async () => {
      Message.findById.mockResolvedValue(null);

      await expect(
        chatService.deleteMessage('invalidId', 'user1')
      ).rejects.toThrow('Message not found');
    });

    it('should mark deletedBySender if user is sender', async () => {
      const mockMsg = {
        _id: 'msg123',
        senderId: 'user1',
        recipientId: 'user2',
        deletedBySender: false,
        deletedByRecipient: false,
        save: jest.fn().mockResolvedValue(true),
      };
      Message.findById.mockResolvedValue(mockMsg);

      const res = await chatService.deleteMessage('msg123', 'user1');

      expect(mockMsg.deletedBySender).toBe(true);
      expect(mockMsg.save).toHaveBeenCalled();
      expect(res.message).toBe('Message deleted');
    });
  });
});
