import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import friendsReducer from './friendsSlice';
import chatReducer from './chatSlice';
import meetingPointReducer from './meetingPointSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    chat: chatReducer,
    meetingPoint: meetingPointReducer,
  },
});

export default store;