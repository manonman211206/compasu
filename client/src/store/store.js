import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import friendsReducer from './friendsSlice';
import chatReducer from './chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    chat: chatReducer,
  },
});

export default store;