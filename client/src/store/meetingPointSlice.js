import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeMeetingPoint: null,
  isSettingMeetingPoint: false,
  routes: [],
  isCalculatingRoutes: false,
  routeError: null,
  selectedRoutePeerId: null,
  routingProfile: 'walking', // 'walking' | 'driving'
};

const meetingPointSlice = createSlice({
  name: 'meetingPoint',
  initialState,
  reducers: {
    setMeetingPoint: (state, action) => {
      state.activeMeetingPoint = action.payload;
      state.isSettingMeetingPoint = false;
    },
    clearMeetingPoint: (state) => {
      state.activeMeetingPoint = null;
      state.routes = [];
      state.isCalculatingRoutes = false;
      state.routeError = null;
      state.isSettingMeetingPoint = false;
    },
    setIsSettingMeetingPoint: (state, action) => {
      state.isSettingMeetingPoint = action.payload;
    },
    toggleIsSettingMeetingPoint: (state) => {
      state.isSettingMeetingPoint = !state.isSettingMeetingPoint;
    },
    setRoutes: (state, action) => {
      state.routes = action.payload;
      state.isCalculatingRoutes = false;
      state.routeError = null;
    },
    setIsCalculatingRoutes: (state, action) => {
      state.isCalculatingRoutes = action.payload;
    },
    setRouteError: (state, action) => {
      state.routeError = action.payload;
      state.isCalculatingRoutes = false;
    },
    setSelectedRoutePeerId: (state, action) => {
      state.selectedRoutePeerId = action.payload;
    },
    setRoutingProfile: (state, action) => {
      state.routingProfile = action.payload;
    },
  },
});

export const {
  setMeetingPoint,
  clearMeetingPoint,
  setIsSettingMeetingPoint,
  toggleIsSettingMeetingPoint,
  setRoutes,
  setIsCalculatingRoutes,
  setRouteError,
  setSelectedRoutePeerId,
  setRoutingProfile,
} = meetingPointSlice.actions;

export default meetingPointSlice.reducer;
