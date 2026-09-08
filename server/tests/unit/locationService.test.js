const locationService = require('../../src/services/locationService');
const Location = require('../../models/Location');

jest.mock('../../models/Location');

describe('LocationService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateLocation', () => {
    it('should throw error for invalid latitude/longitude', async () => {
      await expect(
        locationService.updateLocation('user1', 95.0, 80.15)
      ).rejects.toThrow('Invalid latitude or longitude');
    });

    it('should update and return location for valid coordinates', async () => {
      const mockLocation = {
        userId: 'user1',
        latitude: 12.84064,
        longitude: 80.15343,
        isSharing: true,
      };

      Location.findOneAndUpdate.mockResolvedValue(mockLocation);

      const result = await locationService.updateLocation(
        'user1',
        12.84064,
        80.15343,
        10,
        'VIT Chennai Academic Block 1'
      );

      expect(Location.findOneAndUpdate).toHaveBeenCalled();
      expect(result.latitude).toBe(12.84064);
      expect(result.longitude).toBe(80.15343);
    });
  });

  describe('stopSharingLocation', () => {
    it('should set isSharing to false', async () => {
      Location.findOneAndUpdate.mockResolvedValue({
        userId: 'user1',
        isSharing: false,
      });

      const result = await locationService.stopSharingLocation('user1');
      expect(result.isSharing).toBe(false);
    });
  });
});
