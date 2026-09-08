import { describe, it, expect } from 'vitest';
import friendsReducer, { setFriends, addFriend, removeFriend } from '../store/friendsSlice';

describe('friendsSlice Redux Tests', () => {
  it('should return initial state with empty friends list', () => {
    const state = friendsReducer(undefined, { type: 'unknown' });
    expect(state.friends).toEqual([]);
    expect(state.onlineFriends).toEqual([]);
  });

  it('should handle setFriends', () => {
    const sampleFriends = [
      { _id: 'f1', username: 'rahul', campus: 'VIT Chennai' },
      { _id: 'f2', username: 'priya', campus: 'VIT Chennai' },
    ];

    const state = friendsReducer(undefined, setFriends(sampleFriends));
    expect(state.friends.length).toBe(2);
    expect(state.friends[0].username).toBe('rahul');
  });

  it('should handle addFriend and avoid duplicate entries', () => {
    const friend = { _id: 'f1', username: 'rahul' };
    let state = friendsReducer(undefined, addFriend(friend));
    expect(state.friends.length).toBe(1);

    // Add same friend again
    state = friendsReducer(state, addFriend(friend));
    expect(state.friends.length).toBe(1);
  });

  it('should handle removeFriend', () => {
    const initialState = {
      friends: [{ _id: 'f1', username: 'rahul' }, { _id: 'f2', username: 'priya' }],
      onlineFriends: [],
      blockedUsers: [],
      friendRequests: [],
      suggestions: [],
      loading: false,
      error: null,
    };

    const state = friendsReducer(initialState, removeFriend('f1'));
    expect(state.friends.length).toBe(1);
    expect(state.friends[0]._id).toBe('f2');
  });
});
