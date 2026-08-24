import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Compass, Layers, Loader2, Crosshair } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function LiveMap({ 
  customerLocation, 
  workerLocation, 
  workers = [], 
  status = 'ACCEPTED',
  className = "h-80 w-full rounded-3xl overflow-hidden relative shadow-xl border border-slate-200" 
}) {
  const { customer, detectUserLocation, isLocating } = useAppState();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ customer: null, worker: null, nearby: [], route: null });

  const activeCustomerLoc = customerLocation || customer.location;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const defaultCenter = activeCustomerLoc 
      ? [activeCustomerLoc.lat, activeCustomerLoc.lng] 
      : [18.5204, 73.8567];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Daylight CartoDB Voyager Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    const createCustomerIcon = () => L.divIcon({
      className: 'custom-customer-icon',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 38px; height: 38px; background: rgba(37, 99, 235, 0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 32px; height: 32px; background: #2563eb; border: 2.5px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 15px; box-shadow: 0 6px 16px rgba(37,99,235,0.4);">
            🏠
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const createWorkerIcon = (name) => L.divIcon({
      className: 'custom-worker-icon',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 48px; height: 48px; background: rgba(16, 185, 129, 0.3); border-radius: 50%; animation: pulse 1.5s infinite;"></div>
          <div style="width: 36px; height: 36px; background: #059669; border: 2.5px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; box-shadow: 0 8px 20px rgba(16,185,129,0.5);">
            🧰
          </div>
          <div style="position: absolute; top: -22px; background: #ffffff; color: #047857; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid #10b981; box-shadow: 0 4px 10px rgba(0,0,0,0.1); white-space: nowrap;">
            ${name || 'Artisan En Route'}
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const createNearbyIcon = (initials) => L.divIcon({
      className: 'custom-nearby-icon',
      html: `
        <div style="width: 26px; height: 26px; background: #ffffff; border: 2px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #059669; font-size: 10px; font-weight: 800; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          ${initials}
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    // 1. Customer Marker
    if (activeCustomerLoc) {
      if (!markersRef.current.customer) {
        markersRef.current.customer = L.marker([activeCustomerLoc.lat, activeCustomerLoc.lng], {
          icon: createCustomerIcon()
        }).addTo(map);
        markersRef.current.customer.bindPopup(`<b>Your Premises</b><br/>${customer.address}`);
      } else {
        markersRef.current.customer.setLatLng([activeCustomerLoc.lat, activeCustomerLoc.lng]);
        markersRef.current.customer.setPopupContent(`<b>Your Premises</b><br/>${customer.address}`);
      }
    }

    // 2. Worker Marker
    if (workerLocation) {
      if (!markersRef.current.worker) {
        markersRef.current.worker = L.marker([workerLocation.lat, workerLocation.lng], {
          icon: createWorkerIcon('Sahakari Partner')
        }).addTo(map);
        markersRef.current.worker.bindPopup('<b>Cooperative Partner En Route</b><br/>Live GPS Telemetry');
      } else {
        markersRef.current.worker.setLatLng([workerLocation.lat, workerLocation.lng]);
      }
    }

    // 3. Route Polyline
    if (activeCustomerLoc && workerLocation) {
      const latlngs = [
        [workerLocation.lat, workerLocation.lng],
        [activeCustomerLoc.lat, activeCustomerLoc.lng]
      ];
      if (!markersRef.current.route) {
        markersRef.current.route = L.polyline(latlngs, {
          color: '#059669',
          weight: 5,
          dashArray: '8, 8',
          opacity: 0.9
        }).addTo(map);
      } else {
        markersRef.current.route.setLatLngs(latlngs);
      }

      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    // 4. Nearby Workers
    if (workers.length > 0 && !workerLocation) {
      markersRef.current.nearby.forEach(m => map.removeLayer(m));
      markersRef.current.nearby = [];

      workers.forEach(w => {
        if (w.location) {
          const initials = w.name.split(' ').map(n => n[0]).join('');
          const m = L.marker([w.location.lat, w.location.lng], {
            icon: createNearbyIcon(initials)
          }).addTo(map);
          m.bindPopup(`<b>${w.name}</b><br/>${w.societyName}<br/>⭐ ${w.rating}`);
          markersRef.current.nearby.push(m);
        }
      });
    }
  }, [activeCustomerLoc, workerLocation, workers, status, customer.address]);

  const handleRecenter = async () => {
    if (!mapInstanceRef.current) return;
    try {
      const real = await detectUserLocation();
      mapInstanceRef.current.setView([real.lat, real.lng], 15);
    } catch (e) {
      if (activeCustomerLoc) {
        mapInstanceRef.current.setView([activeCustomerLoc.lat, activeCustomerLoc.lng], 14);
      }
    }
  };

  return (
    <div className={className}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Overlay Status Badge */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-xs font-black text-slate-800 tracking-wide">
          {workerLocation ? 'LIVE GPS DISPATCH RADAR' : 'COOPERATIVE GEO-CLUSTER'}
        </span>
      </div>

      {/* Real GPS Trigger Button */}
      <button
        onClick={handleRecenter}
        disabled={isLocating}
        title="Detect My Real GPS Location"
        className="absolute bottom-4 left-4 z-[1000] bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-2xl shadow-lg transition hover:scale-105 flex items-center gap-2 text-xs font-bold"
      >
        {isLocating ? (
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
        ) : (
          <Crosshair className="w-4 h-4 text-emerald-600" />
        )}
        <span>{isLocating ? 'Detecting GPS...' : '📍 My Real GPS'}</span>
      </button>

      {/* Address Tag */}
      <div className="absolute bottom-4 right-14 z-[1000] bg-white/90 backdrop-blur-sm border border-slate-200 text-[11px] text-slate-700 font-bold px-3 py-1.5 rounded-xl shadow-sm truncate max-w-[200px]">
        📍 {customer.address}
      </div>
    </div>
  );
}
