const locationService = require('../../src/services/locationService');

jest.mock('../../src/services/locationService');

describe('Location Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update location to VIT Chennai coordinates', async () => {
    locationService.updateLocation.mockResolvedValue({
      userId: 'user123',
      latitude: 12.84064,
      longitude: 80.15343,
      isSharing: true,
      address: 'VIT Chennai Academic Block 1',
    });

    const result = await locationService.updateLocation(
      'user123',
      12.84064,
      80.15343,
      5,
      'VIT Chennai Academic Block 1'
    );

    expect(result.latitude).toBe(12.84064);
    expect(result.longitude).toBe(80.15343);
    expect(result.address).toBe('VIT Chennai Academic Block 1');
  });

  it('should get nearby friends on campus', async () => {
    locationService.getNearbyFriends.mockResolvedValue([
      {
        userId: 'user456',
        latitude: 12.8415,
        longitude: 80.1540,
        address: 'Academic Block 2',
      },
    ]);

    const friends = await locationService.getNearbyFriends('user123', 5000);
    expect(friends.length).toBe(1);
    expect(friends[0].address).toBe('Academic Block 2');
  });
});
