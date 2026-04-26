import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert, Navigation, PhoneCall } from 'lucide-react';

// Custom Marker Icon for Assigned Task
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Volunteer's Location (Mock)
const volunteerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function VolunteerMap() {
  const [sosSent, setSosSent] = useState(false);
  // Assigned Task Location (Kadayam)
  const taskLocation = [8.8252, 77.3756];
  // Volunteer Current Location
  const volunteerLocation = [8.8100, 77.3500]; 

  return (
    <div className="pt-24 pb-12 px-6 sm:px-12 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-nx-text-primary tracking-tight">
          Assigned Task Map
        </h1>
        <p className="text-nx-text-secondary mt-1">
          Navigate to your current assignment location.
        </p>
      </div>

      <div className="flex-1 bg-nx-bg-surface border border-nx-border-default rounded-xl overflow-hidden shadow-modal relative z-0">
        <MapContainer 
          center={taskLocation} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          {/* Dark Mode Tile Layer */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Task Marker */}
          <Marker position={taskLocation} icon={customIcon}>
            <Popup className="custom-popup">
              <div className="p-1">
                <div className="flex items-center gap-2 text-nx-crimson font-bold mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  Medical Aid Needed
                </div>
                <p className="text-sm font-bold text-gray-800">Kadayam, Tenkasi</p>
                <p className="text-xs text-gray-600 mt-1">45 families waiting</p>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${taskLocation[0]},${taskLocation[1]}`)}
                  className="mt-3 w-full bg-nx-accent-primary hover:bg-nx-accent-hover text-white text-xs font-bold py-1.5 rounded flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3 h-3" /> Get Directions
                </button>
              </div>
            </Popup>
          </Marker>

          {/* Volunteer Marker */}
          <Marker position={volunteerLocation} icon={volunteerIcon}>
            <Popup>
              <div className="text-center font-bold text-gray-800">
                You are here
              </div>
            </Popup>
          </Marker>
        </MapContainer>
        
        {/* Floating Info Card */}
        <div className="absolute top-4 right-4 z-[400] bg-nx-bg-surface/90 backdrop-blur-md p-4 rounded-lg border border-nx-border-strong shadow-lg max-w-xs">
           <h3 className="text-sm font-bold text-nx-text-primary mb-2">Distance & Travel</h3>
           <div className="space-y-2 text-sm text-nx-text-secondary">
             <div className="flex justify-between">
               <span>Distance:</span>
               <span className="font-bold text-nx-text-primary">12 km</span>
             </div>
             <div className="flex justify-between">
               <span>Est. Time:</span>
               <span className="font-bold text-nx-text-primary text-nx-amber">15 mins</span>
             </div>
           </div>
        </div>

        {/* SOS Panic Button */}
        <div className="absolute bottom-6 right-4 z-[400]">
          <button 
            onClick={() => {
              setSosSent(true);
              setTimeout(() => setSosSent(false), 5000);
            }}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,59,48,0.5)] transition-all transform active:scale-90 ${sosSent ? 'bg-white border-4 border-nx-crimson' : 'bg-nx-crimson hover:bg-red-600'}`}
          >
            {sosSent ? (
               <ShieldAlert className="w-8 h-8 text-nx-crimson animate-pulse" />
            ) : (
               <PhoneCall className="w-7 h-7 text-white" />
            )}
          </button>
          
          {sosSent && (
            <div className="absolute bottom-20 right-0 bg-nx-bg-surface border border-nx-crimson p-3 rounded-lg shadow-lg w-48 animate-slide-up">
              <p className="text-xs font-bold text-nx-crimson mb-1 uppercase tracking-wide">SOS Activated</p>
              <p className="text-xs text-nx-text-primary">Emergency signal sent to Command Center with your live coordinates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
