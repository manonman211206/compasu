import mapboxgl from 'mapbox-gl';

/**
 * Creates or updates the shared Meeting Point Destination Marker on the Mapbox instance.
 */
export class MeetingMarkerManager {
  constructor(map, onRemoveMeetingPoint, onFitRoutes) {
    this.map = map;
    this.marker = null;
    this.element = null;
    this.onRemoveMeetingPoint = onRemoveMeetingPoint;
    this.onFitRoutes = onFitRoutes;
  }

  update(meetingPoint) {
    if (!this.map || !meetingPoint || meetingPoint.latitude === undefined || meetingPoint.longitude === undefined) {
      this.remove();
      return;
    }

    const lat = Number(meetingPoint.latitude);
    const lng = Number(meetingPoint.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    const title = meetingPoint.title || 'Campus Meeting Point';
    const address = meetingPoint.address || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
    const createdBy = meetingPoint.createdBy?.username || 'Peer';

    if (!this.marker) {
      this.element = document.createElement('div');
      this.element.className = 'meeting-point-marker-container relative flex flex-col items-center justify-center select-none cursor-pointer group';

      this.element.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-[#D9FF35] opacity-50"></span>
          <div class="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#070A10] border-2 border-[#D9FF35] text-[#D9FF35] shadow-[0_0_20px_rgba(217,255,53,0.7)] font-mono font-bold text-xs">
            🎯
          </div>
        </div>
        <div class="mt-1 px-2 py-0.5 rounded bg-[#D9FF35] text-[#070A10] text-[9px] font-mono font-extrabold tracking-wider uppercase shadow-lg">
          MEET
        </div>
      `;

      // Interactive Popup with Action Buttons
      const popupContainer = document.createElement('div');
      popupContainer.style.background = '#0A0E14';
      popupContainer.style.color = '#F3F5F2';
      popupContainer.style.padding = '10px 12px';
      popupContainer.style.borderRadius = '8px';
      popupContainer.style.border = '1px solid rgba(217,255,53,0.4)';
      popupContainer.style.fontFamily = "'JetBrains Mono', monospace";
      popupContainer.style.fontSize = '11px';
      popupContainer.style.minWidth = '180px';

      popupContainer.innerHTML = `
        <div style="color: #D9FF35; font-size: 10px; font-weight: bold; text-transform: uppercase;">🎯 Active Meeting Point</div>
        <div style="font-weight: 700; color: #F3F5F2; margin-top: 2px;">${title}</div>
        <div style="color: #A2AAA7; font-size: 10px; margin-top: 2px;">📍 ${address}</div>
        <div style="color: #626B69; font-size: 9px; margin-top: 4px;">Set by @${createdBy}</div>
        <div style="display: flex; gap: 6px; margin-top: 8px;">
          <button id="btn-fit-routes" style="flex: 1; padding: 4px 6px; background: #14201D; border: 1px solid rgba(217,255,53,0.3); color: #D9FF35; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: 600;">Fit Routes</button>
          <button id="btn-clear-meeting" style="padding: 4px 6px; background: #2A1010; border: 1px solid rgba(239,68,68,0.4); color: #f87171; border-radius: 4px; font-size: 10px; cursor: pointer;">Remove</button>
        </div>
      `;

      // Wire popup actions
      setTimeout(() => {
        const btnFit = popupContainer.querySelector('#btn-fit-routes');
        const btnClear = popupContainer.querySelector('#btn-clear-meeting');
        if (btnFit && this.onFitRoutes) {
          btnFit.onclick = () => this.onFitRoutes();
        }
        if (btnClear && this.onRemoveMeetingPoint) {
          btnClear.onclick = () => this.onRemoveMeetingPoint();
        }
      }, 0);

      const popup = new mapboxgl.Popup({ offset: 20, closeButton: false }).setDOMContent(popupContainer);

      this.marker = new mapboxgl.Marker({
        element: this.element,
        anchor: 'bottom',
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
    } else {
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
