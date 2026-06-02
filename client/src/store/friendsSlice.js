import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  friends: [],
  onlineFriends: [],
  blockedUsers: [],
  friendRequests: [],
  suggestions: [],
  loading: false,
  error: null,
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setOnlineFriends: (state, action) => {
      state.onlineFriends = action.payload;
    },
    setFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    addFriend: (state, action) => {
      if (!state.friends.find((f) => f._id === action.payload._id)) {
        state.friends.push(action.payload);
      }
    },
    removeFriend: (state, action) => {
      state.friends = state.friends.filter((f) => f._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFriends,
  setOnlineFriends,
  setFriendRequests,
  setSuggestions,
  addFriend,
  removeFriend,
  setLoading,
  setError,
} = friendsSlice.actions;
export default friendsSlice.reducer;