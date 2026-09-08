import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  setMeetingPoint,
  clearMeetingPoint,
  setIsSettingMeetingPoint,
  toggleIsSettingMeetingPoint,
  setRoutes,
  setIsCalculatingRoutes,
  setRouteError,
} from '../store/meetingPointSlice';
import { UserLocationMarkerManager } from './Map/UserLocationMarker';
import { MeetingMarkerManager } from './Map/MeetingMarker';
import { LandmarkMarkerManager } from './Map/LandmarkMarker';
import MapControls from './Map/MapControls';
import {
  getMultiPeerRoutes,
  routesToGeoJSON,
  formatDuration,
  formatDistance,
} from '../services/routingService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Target, X, Users, Clock, Compass } from 'lucide-react';

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  import.meta.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// VIT Chennai default coordinates
export const VIT_CHENNAI_COORDS = {
  lat: 12.84064,
  lng: 80.15343,
  zoom: 16,
};

// VIT Chennai Campus Landmarks
export const VIT_LANDMARKS = [
  {
    id: 'ab1',
    name: 'Netaji Subhas Chandra Bose Block (AB-1)',
    category: 'Academic Core',
    description: 'Lecture halls, Dean offices & Server racks',
    lat: 12.8408,
    lng: 80.1532,
    code: 'AB1',
  },
  {
    id: 'ab2',
    name: 'Academic Block 2 (AB-2)',
    category: 'CS & Labs',
    description: 'CS/IT high-compute laboratories',
    lat: 12.8415,
    lng: 80.1540,
    code: 'AB2',
  },
  {
    id: 'library',
    name: 'Central Library',
    category: 'Study Node',
    description: 'Digital research library & quiet zone',
    lat: 12.8402,
    lng: 80.1536,
    code: 'LIB',
  },
  {
    id: 'food_court',
    name: 'Gazebo & Food Court',
    category: 'Commons',
    description: 'Student cafeteria & open courtyard',
    lat: 12.8398,
    lng: 80.1528,
    code: 'GZB',
  },
  {
    id: 'hostels',
    name: 'Hostel Blocks (A, B, C, D)',
    category: 'Residential',
    description: 'Student living quarters & mesh nodes',
    lat: 12.8422,
    lng: 80.1548,
    code: 'HST',
  },
  {
    id: 'sports',
    name: 'Sports Complex & Grounds',
    category: 'Recreation',
    description: 'Football grounds, gym & tennis courts',
    lat: 12.8390,
    lng: 80.1545,
    code: 'SPT',
  },
  {
    id: 'gate',
    name: 'VIT Main Campus Gate',
    category: 'Campus Entry',
    description: 'Kelambakkam - Vandalur Rd entrance',
    lat: 12.8400,
    lng: 80.1518,
    code: 'GATE',
  },
];

// Color palette for peer routes to distinguish individuals
const PEER_COLORS = [
  '#D9FF35', // Primary Acid Lime
  '#38bdf8', // Sky Blue
  '#a855f7', // Purple
  '#f43f5e', // Rose
  '#fb923c', // Orange
  '#34d399', // Emerald
  '#e879f9', // Pink
];

export default function CampusMap({
  friendsLocations = [],
  userLocation = null,
  onSelectFriendChat,
  onMeetingPointChange,
}) {
  const dispatch = useDispatch();
  const meetingState = useSelector((state) => state.meetingPoint || {});
  const {
    activeMeetingPoint,
    isSettingMeetingPoint,
    routes = [],
    isCalculatingRoutes = false,
    routingProfile = 'walking',
  } = meetingState;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarkerManager = useRef(null);
  const meetingMarkerManager = useRef(null);
  const landmarkMarkerManager = useRef(null);
  const friendMarkersRef = useRef({});

  const [mapLoaded, setMapLoaded] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showFriends, setShowFriends] = useState(true);
  const [showRouteSummary, setShowRouteSummary] = useState(true);

  // Initialize Mapbox Instance
  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const initialLat = userLocation?.latitude || VIT_CHENNAI_COORDS.lat;
    const initialLng = userLocation?.longitude || VIT_CHENNAI_COORDS.lng;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [initialLng, initialLat],
      zoom: VIT_CHENNAI_COORDS.zoom,
      pitch: 45,
      bearing: -15,
      attributionControl: false,
    });

    mapInstance.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');

    mapInstance.on('load', () => {
      // Add GeoJSON source for multi-peer routes
      if (!mapInstance.getSource('multi-peer-routes')) {
        mapInstance.addSource('multi-peer-routes', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        });

        // Glow Layer for vibrant developer look
        mapInstance.addLayer({
          id: 'peer-routes-glow',
          type: 'line',
          source: 'multi-peer-routes',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': ['coalesce', ['get', 'color'], '#D9FF35'],
            'line-width': 8,
            'line-opacity': 0.25,
            'line-blur': 4,
          },
        });

        // Core Route Line Layer
        mapInstance.addLayer({
          id: 'peer-routes-line',
          type: 'line',
          source: 'multi-peer-routes',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': ['coalesce', ['get', 'color'], '#D9FF35'],
            'line-width': 3.5,
            'line-opacity': 0.9,
          },
        });
      }

      setMapLoaded(true);
    });

    map.current = mapInstance;

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update cursor based on isSettingMeetingPoint mode
  useEffect(() => {
    if (!map.current || !mapContainer.current) return;
    const canvas = map.current.getCanvas();
    if (isSettingMeetingPoint) {
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = '';
    }
  }, [isSettingMeetingPoint]);

  // Handler for creating/updating a meeting point
  const handleSelectMeetingPoint = useCallback(
    (data) => {
      const payload = {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        title: data.title || 'Campus Destination',
        address: data.address || `${data.latitude.toFixed(4)}° N, ${data.longitude.toFixed(4)}° E`,
        createdAt: new Date().toISOString(),
      };

      dispatch(setMeetingPoint(payload));

      if (onMeetingPointChange) {
        onMeetingPointChange('set', payload);
      }
    },
    [dispatch, onMeetingPointChange]
  );

  const handleClearMeetingPoint = useCallback(() => {
    dispatch(clearMeetingPoint());
    if (onMeetingPointChange) {
      onMeetingPointChange('clear', null);
    }
  }, [dispatch, onMeetingPointChange]);

  // Fit camera bounds across all active origins and meeting point
  const handleFitAllRoutes = useCallback(() => {
    if (!map.current) return;

    const coordinates = [];

    if (userLocation?.latitude && userLocation?.longitude) {
      coordinates.push([Number(userLocation.longitude), Number(userLocation.latitude)]);
    }

    friendsLocations.forEach((f) => {
      const lat = Number(f.latitude || f.coordinates?.coordinates?.[1]);
      const lng = Number(f.longitude || f.coordinates?.coordinates?.[0]);
      if (!isNaN(lat) && !isNaN(lng)) {
        coordinates.push([lng, lat]);
      }
    });

    if (activeMeetingPoint?.latitude && activeMeetingPoint?.longitude) {
      coordinates.push([Number(activeMeetingPoint.longitude), Number(activeMeetingPoint.latitude)]);
    }

    if (coordinates.length === 0) return;

    if (coordinates.length === 1) {
      map.current.flyTo({
        center: coordinates[0],
        zoom: 16.5,
        essential: true,
        duration: 1200,
      });
      return;
    }

    const bounds = coordinates.reduce((b, coord) => b.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    map.current.fitBounds(bounds, {
      padding: { top: 80, bottom: 90, left: 80, right: 80 },
      duration: 1400,
      maxZoom: 17.5,
    });
  }, [userLocation, friendsLocations, activeMeetingPoint]);

  // Handle map click & contextmenu for meeting point placement
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const handleMapClick = (e) => {
      if (!isSettingMeetingPoint) return;

      const { lng, lat } = e.lngLat;
      handleSelectMeetingPoint({
        latitude: lat,
        longitude: lng,
        title: 'Custom Meeting Point',
        address: `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`,
      });
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      const { lng, lat } = e.lngLat;
      handleSelectMeetingPoint({
        latitude: lat,
        longitude: lng,
        title: 'Dropped Meeting Point',
        address: `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`,
      });
    };

    map.current.on('click', handleMapClick);
    map.current.on('contextmenu', handleContextMenu);

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
        map.current.off('contextmenu', handleContextMenu);
      }
    };
  }, [mapLoaded, isSettingMeetingPoint, handleSelectMeetingPoint]);

  // Manage Marker Managers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (!userMarkerManager.current) {
      userMarkerManager.current = new UserLocationMarkerManager(map.current);
    }
    userMarkerManager.current.update(userLocation);

    if (!meetingMarkerManager.current) {
      meetingMarkerManager.current = new MeetingMarkerManager(
        map.current,
        handleClearMeetingPoint,
        handleFitAllRoutes
      );
    }
    meetingMarkerManager.current.update(activeMeetingPoint);

    if (!landmarkMarkerManager.current) {
      landmarkMarkerManager.current = new LandmarkMarkerManager(
        map.current,
        handleSelectMeetingPoint
      );
    }
    landmarkMarkerManager.current.update(VIT_LANDMARKS, showLandmarks);
  }, [mapLoaded, userLocation, activeMeetingPoint, showLandmarks, handleClearMeetingPoint, handleFitAllRoutes, handleSelectMeetingPoint]);

  // Manage Peer Markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const currentIds = new Set(
      friendsLocations.map((f) => f.userId?._id || f.userId || f._id).filter(Boolean)
    );

    // Clean removed peer markers
    Object.keys(friendMarkersRef.current).forEach((id) => {
      if (!showFriends || !currentIds.has(id)) {
        friendMarkersRef.current[id].remove();
        delete friendMarkersRef.current[id];
      }
    });

    if (!showFriends) return;

    friendsLocations.forEach((friend, idx) => {
      const friendId = friend.userId?._id || friend.userId || friend._id;
      const lat = Number(friend.latitude || friend.coordinates?.coordinates?.[1]);
      const lng = Number(friend.longitude || friend.coordinates?.coordinates?.[0]);

      if (!friendId || isNaN(lat) || isNaN(lng)) return;

      const username = friend.userId?.username || friend.username || 'Peer';
      const address = friend.address || 'VIT Chennai Mesh';
      const color = PEER_COLORS[idx % PEER_COLORS.length];

      if (friendMarkersRef.current[friendId]) {
        friendMarkersRef.current[friendId].setLngLat([lng, lat]);
      } else {
        const el = document.createElement('div');
        el.className = 'peer-marker-root select-none cursor-pointer';

        const inner = document.createElement('div');
        inner.className =
          'relative w-8 h-8 rounded-md bg-[#101A18] border border-white/20 flex items-center justify-center shadow-lg font-mono text-[11px] font-bold text-[#F3F5F2] hover:border-[#D9FF35] hover:scale-105 transition-all duration-150';
        inner.style.borderColor = `${color}88`;
        inner.innerText = username.charAt(0).toUpperCase();

        el.appendChild(inner);

        el.addEventListener('click', () => {
          if (onSelectFriendChat) onSelectFriendChat(friend);
        });

        const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(`
          <div style="background: #0A0E14; color: #F3F5F2; padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); font-family: 'JetBrains Mono', monospace; font-size: 11px;">
            <div style="color: ${color}; font-weight: 700;">@${username}</div>
            <div style="color: #626B69; font-size: 10px; margin-top: 2px;">📍 ${address}</div>
            <div style="color: #A2AAA7; font-size: 9px; margin-top: 4px;">Click marker to open direct stream</div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current);

        friendMarkersRef.current[friendId] = marker;
      }
    });
  }, [friendsLocations, mapLoaded, showFriends, onSelectFriendChat]);

  // Compute Multi-Origin Routes whenever activeMeetingPoint or peer/user locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (!activeMeetingPoint?.latitude || !activeMeetingPoint?.longitude) {
      // Clear route layers GeoJSON data
      const source = map.current.getSource('multi-peer-routes');
      if (source) {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
      dispatch(setRoutes([]));
      return;
    }

    let isSubscribed = true;
    dispatch(setIsCalculatingRoutes(true));

    const origins = [];

    // Current User origin
    if (userLocation?.latitude && userLocation?.longitude) {
      origins.push({
        id: 'me',
        name: 'You',
        isCurrentUser: true,
        color: '#22d3ee', // Cyan
        location: { latitude: userLocation.latitude, longitude: userLocation.longitude },
      });
    }

    // Peer origins
    friendsLocations.forEach((friend, idx) => {
      const lat = Number(friend.latitude || friend.coordinates?.coordinates?.[1]);
      const lng = Number(friend.longitude || friend.coordinates?.coordinates?.[0]);
      const id = friend.userId?._id || friend.userId || friend._id;
      const name = friend.userId?.username || friend.username || `Peer ${idx + 1}`;

      if (id && !isNaN(lat) && !isNaN(lng)) {
        origins.push({
          id,
          name,
          isCurrentUser: false,
          color: PEER_COLORS[idx % PEER_COLORS.length],
          location: { latitude: lat, longitude: lng },
        });
      }
    });

    getMultiPeerRoutes(origins, activeMeetingPoint, routingProfile)
      .then((calculatedRoutes) => {
        if (!isSubscribed) return;

        dispatch(setRoutes(calculatedRoutes));

        if (map.current) {
          const source = map.current.getSource('multi-peer-routes');
          if (source) {
            source.setData(routesToGeoJSON(calculatedRoutes));
          }
        }
      })
      .catch((err) => {
        if (!isSubscribed) return;
        console.error('Multi-route calculation error:', err);
        dispatch(setRouteError(err.message));
      });

    return () => {
      isSubscribed = false;
    };
  }, [activeMeetingPoint, userLocation, friendsLocations, routingProfile, mapLoaded, dispatch]);

  const handleCenterVIT = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: [VIT_CHENNAI_COORDS.lng, VIT_CHENNAI_COORDS.lat],
      zoom: VIT_CHENNAI_COORDS.zoom,
      pitch: 45,
      bearing: -15,
      essential: true,
      duration: 1500,
    });
  };

  const handleCenterUser = () => {
    if (!map.current) return;
    if (userLocation?.latitude && userLocation?.longitude) {
      map.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 17,
        pitch: 50,
        essential: true,
        duration: 1500,
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.current.flyTo({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 17,
            pitch: 50,
            essential: true,
            duration: 1500,
          });
        },
        () => handleCenterVIT()
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-white/[0.08] bg-[#070A10]">
      {/* Mapbox Canvas */}
      <div ref={mapContainer} className="w-full h-full min-h-[500px]" />

      {/* Floating HUD Controls */}
      <MapControls
        isSettingMeetingPoint={isSettingMeetingPoint}
        onToggleSetMeetingPoint={() => dispatch(toggleIsSettingMeetingPoint())}
        activeMeetingPoint={activeMeetingPoint}
        onClearMeetingPoint={handleClearMeetingPoint}
        onFitAll={handleFitAllRoutes}
        onCenterUser={handleCenterUser}
        onCenterVIT={handleCenterVIT}
        showLandmarks={showLandmarks}
        onToggleLandmarks={() => setShowLandmarks((prev) => !prev)}
        landmarksCount={VIT_LANDMARKS.length}
        showFriends={showFriends}
        onToggleFriends={() => setShowFriends((prev) => !prev)}
        friendsCount={friendsLocations.length}
      />

      {/* Multi-Peer Route Trajectory Drawer / ETA Summary (Bottom Left) */}
      {activeMeetingPoint && routes.length > 0 && showRouteSummary && (
        <div className="absolute bottom-4 left-4 z-10 hidden sm:block max-w-sm w-full font-mono text-xs select-none">
          <div className="bg-[#0A0E14]/95 backdrop-blur-md rounded-lg border border-[#D9FF35]/30 p-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-[#D9FF35] font-bold text-[11px] uppercase">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Active Peer Convergences ({routes.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRouteSummary(false)}
                className="text-[#626B69] hover:text-[#F3F5F2] p-0.5"
                title="Minimize ETA Panel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="flex items-center justify-between p-1.5 rounded bg-[#101A18]/60 border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: route.color }}
                    />
                    <span className="font-semibold text-[#F3F5F2] text-[11px]">
                      {route.isCurrentUser ? 'You (Current)' : `@${route.name}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#A2AAA7]">
                    <span className="text-[#D9FF35] font-bold">{formatDuration(route.duration)}</span>
                    <span className="text-[#626B69]">({formatDistance(route.distance)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Landmark Quick Fly Strip (Bottom-Left when no active routes) */}
      {showLandmarks && (!activeMeetingPoint || routes.length === 0 || !showRouteSummary) && (
        <div className="absolute bottom-4 left-4 z-10 hidden md:flex items-center gap-1.5 max-w-[65%] overflow-x-auto font-mono text-[10px]">
          {VIT_LANDMARKS.slice(0, 4).map((landmark) => (
            <button
              key={landmark.id}
              type="button"
              onClick={() => {
                if (!map.current) return;
                map.current.flyTo({
                  center: [landmark.lng, landmark.lat],
                  zoom: 17.5,
                  pitch: 50,
                  essential: true,
                  duration: 1200,
                });
              }}
              className="bg-[#0A0E14]/90 hover:bg-[#101A18] border border-white/[0.06] hover:border-[#D9FF35]/40 text-[#A2AAA7] hover:text-[#F3F5F2] px-2.5 py-1 rounded whitespace-nowrap transition"
            >
              [{landmark.code}] {landmark.name.split('(')[0]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
