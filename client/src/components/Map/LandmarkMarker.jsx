import mapboxgl from 'mapbox-gl';

/**
 * Manages landmark markers with stable DOM lifecycles.
 * Fixes the hover glitch by isolating scale/background transitions to inner DOM nodes,
 * preventing conflicts with Mapbox's outer container `transform: matrix3d()`.
 */
export class LandmarkMarkerManager {
  constructor(map, onSelectMeetingPoint) {
    this.map = map;
    this.markers = {};
    this.onSelectMeetingPoint = onSelectMeetingPoint;
  }

  update(landmarks = [], show = true) {
    if (!this.map) return;

    if (!show) {
      this.clear();
      return;
    }

    const landmarkIds = new Set(landmarks.map((l) => l.id));

    // Remove markers that are no longer present
    Object.keys(this.markers).forEach((id) => {
      if (!landmarkIds.has(id)) {
        this.markers[id].remove();
        delete this.markers[id];
      }
    });

    // Add or update landmarks
    landmarks.forEach((landmark) => {
      if (this.markers[landmark.id]) {
        // Marker already exists, no recreation needed
        return;
      }

      // Create stable DOM marker container
      const container = document.createElement('div');
      container.className = 'landmark-marker-root select-none cursor-pointer';

      // Inner element handles hover styling safely
      const inner = document.createElement('div');
      inner.className =
        'flex items-center justify-center h-6 px-2 rounded bg-[#070A10]/95 border border-[#D9FF35]/40 text-[#D9FF35] font-mono text-[10px] font-bold shadow-lg shadow-black/80 transition-all duration-150 ease-out hover:border-[#D9FF35] hover:bg-[#14201D] hover:shadow-[0_0_12px_rgba(217,255,53,0.4)]';
      inner.innerText = `[${landmark.code}]`;
      container.appendChild(inner);

      // Interactive Popup
      const popupContainer = document.createElement('div');
      popupContainer.style.background = '#0A0E14';
      popupContainer.style.color = '#F3F5F2';
      popupContainer.style.padding = '8px 10px';
      popupContainer.style.borderRadius = '6px';
      popupContainer.style.border = '1px solid rgba(255,255,255,0.12)';
      popupContainer.style.fontFamily = "'JetBrains Mono', monospace";
      popupContainer.style.fontSize = '11px';
      popupContainer.style.minWidth = '170px';

      popupContainer.innerHTML = `
        <div style="color: #D9FF35; font-size: 10px; font-weight: bold; margin-bottom: 2px;">${landmark.category}</div>
        <div style="font-weight: 700; color: #F3F5F2; margin-bottom: 2px;">${landmark.name}</div>
        <div style="color: #626B69; font-size: 10px; margin-bottom: 6px;">${landmark.description}</div>
        <button id="btn-meet-${landmark.id}" style="width: 100%; padding: 3px 6px; background: #14201D; border: 1px solid rgba(217,255,53,0.4); color: #D9FF35; border-radius: 4px; font-size: 9px; cursor: pointer; font-weight: 700; text-transform: uppercase;">🎯 Meet Here</button>
      `;

      setTimeout(() => {
        const btn = popupContainer.querySelector(`#btn-meet-${landmark.id}`);
        if (btn && this.onSelectMeetingPoint) {
          btn.onclick = () => {
            this.onSelectMeetingPoint({
              latitude: landmark.lat,
              longitude: landmark.lng,
              title: landmark.name,
              address: landmark.category,
            });
          };
        }
      }, 0);

      const popup = new mapboxgl.Popup({ offset: 15, closeButton: false }).setDOMContent(popupContainer);

      const marker = new mapboxgl.Marker({
        element: container,
        anchor: 'center',
      })
        .setLngLat([landmark.lng, landmark.lat])
        .setPopup(popup)
        .addTo(this.map);

      this.markers[landmark.id] = marker;
    });
  }

  clear() {
    Object.values(this.markers).forEach((marker) => marker.remove());
    this.markers = {};
  }

  remove() {
    this.clear();
    this.map = null;
  }
}
