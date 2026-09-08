import mapboxgl from 'mapbox-gl';

/**
 * Creates or updates the distinct Current User Location Marker on the Mapbox instance.
 * Ensures stable instance lifecycle without flickering or duplicates.
 */
export class UserLocationMarkerManager {
  constructor(map) {
    this.map = map;
    this.marker = null;
    this.element = null;
  }

  update(location, options = {}) {
    if (!this.map || !location || location.latitude === undefined || location.longitude === undefined) {
      this.remove();
      return;
    }

    const lat = Number(location.latitude);
    const lng = Number(location.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    if (!this.marker) {
      // Create DOM element for User Location Marker
      this.element = document.createElement('div');
      this.element.className = 'user-location-marker-container relative flex items-center justify-center select-none';
      this.element.style.cursor = 'pointer';

      // Inner beacon styling: distinct cyan/lime center with accuracy pulse
      this.element.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-cyan-400 opacity-40"></span>
          <span class="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#070A10] border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]">
            <span class="h-2 w-2 rounded-full bg-cyan-400"></span>
          </span>
          <div class="absolute -bottom-5 px-1.5 py-0.5 rounded bg-[#070A10]/90 border border-cyan-400/40 text-[9px] font-mono font-bold text-cyan-300 shadow-md">
            YOU
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(`
        <div style="background: #0A0E14; color: #F3F5F2; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(6,182,212,0.4); font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <div style="color: #22d3ee; font-weight: bold;">📍 Current Position (YOU)</div>
          <div style="color: #626B69; font-size: 10px; margin-top: 2px;">${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E</div>
        </div>
      `);

      this.marker = new mapboxgl.Marker({
        element: this.element,
        anchor: 'center',
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
    } else {
      // Smoothly update position without recreation
      this.marker.setLngLat([lng, lat]);
    }
  }

  remove() {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
      this.element = null;
    }
  }
}
