import axios from 'axios';

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  import.meta.env.NEXT_PUBLIC_MAPBOX_TOKEN;
// In-memory route cache: Map<key, { coordinates, distance, duration, timestamp }>
const routeCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

// Generate a deterministic cache key for coordinate pairs (rounded to 5 decimal places ~1 meter precision)
function getCacheKey(origin, destination, profile) {
  const oLng = Number(origin.lng || origin.longitude).toFixed(5);
  const oLat = Number(origin.lat || origin.latitude).toFixed(5);
  const dLng = Number(destination.lng || destination.longitude).toFixed(5);
  const dLat = Number(destination.lat || destination.latitude).toFixed(5);
  return `${profile}:${oLng},${oLat}->${dLng},${dLat}`;
}

/**
 * Fallback geometry (straight line with intermediate points) when routing API fails
 */
function createFallbackRoute(origin, destination) {
  const oLng = Number(origin.lng || origin.longitude);
  const oLat = Number(origin.lat || origin.latitude);
  const dLng = Number(destination.lng || destination.longitude);
  const dLat = Number(destination.lat || destination.latitude);

  // Approximate distance using Haversine
  const R = 6371e3; // metres
  const φ1 = (oLat * Math.PI) / 180;
  const φ2 = (dLat * Math.PI) / 180;
  const Δφ = ((dLat - oLat) * Math.PI) / 180;
  const Δλ = ((dLng - oLng) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = Math.round(R * c);
  const duration = Math.round(distance / 1.3); // ~1.3 m/s walking speed

  return {
    coordinates: [
      [oLng, oLat],
      [dLng, dLat],
    ],
    distance,
    duration,
    isFallback: true,
  };
}

/**
 * Fetch route between a single origin and destination from Mapbox Directions API
 */
export async function getRoute(origin, destination, profile = 'walking') {
  if (!origin || !destination) return null;

  const oLng = Number(origin.lng || origin.longitude);
  const oLat = Number(origin.lat || origin.latitude);
  const dLng = Number(destination.lng || destination.longitude);
  const dLat = Number(destination.lat || destination.latitude);

  if (isNaN(oLng) || isNaN(oLat) || isNaN(dLng) || isNaN(dLat)) return null;

  const cacheKey = getCacheKey(origin, destination, profile);
  const cached = routeCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${oLng},${oLat};${dLng},${dLat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
    const res = await axios.get(url, { timeout: 6000 });

    if (res.data?.routes && res.data.routes.length > 0) {
      const primaryRoute = res.data.routes[0];
      const routeData = {
        coordinates: primaryRoute.geometry.coordinates,
        distance: Math.round(primaryRoute.distance),
        duration: Math.round(primaryRoute.duration),
        isFallback: false,
      };

      routeCache.set(cacheKey, { timestamp: Date.now(), data: routeData });
      return routeData;
    }
  } catch (err) {
    console.warn(`Directions API failed for [${oLat}, ${oLng}] -> [${dLat}, ${dLng}]: ${err.message}. Using fallback.`);
  }

  // Graceful fallback
  const fallback = createFallbackRoute(origin, destination);
  routeCache.set(cacheKey, { timestamp: Date.now(), data: fallback });
  return fallback;
}

/**
 * Calculate multi-origin routes from current user and all peers to a single meeting point destination
 * Returns an array of route objects with metadata: { peerId, peerName, isCurrentUser, coordinates, distance, duration, color }
 */
export async function getMultiPeerRoutes(originsWithMeta, destination, profile = 'walking') {
  if (!originsWithMeta || originsWithMeta.length === 0 || !destination) {
    return [];
  }

  const routePromises = originsWithMeta.map(async (originMeta) => {
    try {
      const route = await getRoute(originMeta.location, destination, profile);
      if (!route) return null;

      return {
        id: originMeta.id,
        name: originMeta.name || 'Peer',
        isCurrentUser: Boolean(originMeta.isCurrentUser),
        color: originMeta.color || (originMeta.isCurrentUser ? '#06b6d4' : '#D9FF35'),
        coordinates: route.coordinates,
        distance: route.distance,
        duration: route.duration,
        isFallback: route.isFallback,
      };
    } catch (e) {
      console.warn(`Route generation failed for peer ${originMeta.id}:`, e);
      return null;
    }
  });

  const results = await Promise.all(routePromises);
  return results.filter(Boolean);
}

/**
 * Convert an array of routes into a GeoJSON FeatureCollection for Mapbox source layers
 */
export function routesToGeoJSON(routes) {
  return {
    type: 'FeatureCollection',
    features: routes.map((r) => ({
      type: 'Feature',
      properties: {
        id: r.id,
        name: r.name,
        isCurrentUser: r.isCurrentUser,
        color: r.color,
        distance: r.distance,
        duration: r.duration,
        isFallback: r.isFallback,
      },
      geometry: {
        type: 'LineString',
        coordinates: r.coordinates,
      },
    })),
  };
}

/**
 * Format duration into readable string (e.g., "4 min" or "1 hr 12 min")
 */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0 min';
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs} hr ${remMins} min`;
}

/**
 * Format distance into readable string (e.g., "350 m" or "1.4 km")
 */
export function formatDistance(meters) {
  if (!meters || meters <= 0) return '0 m';
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
