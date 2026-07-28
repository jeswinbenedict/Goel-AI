import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { C } from '../styles/theme'
import { useInView } from '../hooks/useInView'
import { useRealtime } from '../realtime/RealtimeProvider'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const ZONE_COLOR = { CRITICAL: C.red, MODERATE: C.yellow, LOW: C.green }

const makeIcon = (zone) => L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:${ZONE_COLOR[zone] || C.green}22;
        animation:ripple 2s ease-out infinite;
      "></div>
      <div style="
        position:absolute;top:4px;left:4px;
        width:12px;height:12px;border-radius:50%;
        background:${ZONE_COLOR[zone] || C.green};
        border:2px solid rgba(255,255,255,0.5);
        box-shadow:0 0 10px ${ZONE_COLOR[zone] || C.green}, 0 0 22px ${ZONE_COLOR[zone] || C.green}66;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const makeTeamIcon = (color) => L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:24px;height:24px;">
      <div style="
        position:absolute;inset:0;border-radius:6px;
        background:${color};border:2px solid #ffffff;
        box-shadow:0 0 12px ${color};
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:bold;font-size:10px;font-family:sans-serif;
      ">T</div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function FlyIn({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 10, { duration: 2.0 })
    }
  }, [map, center])
  return null
}

export default function RescueMap() {
  const [ref, inView] = useInView(0.15)
  const [hov, setHov] = useState(false)
  const { survivors, teams, epicenter } = useRealtime()

  const currentCenter = epicenter?.pos ?? [35.695, 139.73]
  const currentPlace = epicenter?.place ?? "Tokyo Metropolitan Area"

  const liveSurvivors = survivors && survivors.length > 0 ? survivors : [
    { id: 1, pos: [currentCenter[0] + 0.01, currentCenter[1] + 0.01], zone: 'CRITICAL', confidence: 94.2 },
    { id: 2, pos: [currentCenter[0] - 0.01, currentCenter[1] - 0.01], zone: 'CRITICAL', confidence: 88.1 },
    { id: 3, pos: [currentCenter[0] + 0.015, currentCenter[1] - 0.005], zone: 'MODERATE', confidence: 76.5 },
  ]

  const [mapType, setMapType] = useState('satellite')

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', height: '420px', borderRadius: '20px', overflow: 'hidden',
        background: 'rgba(12,12,16,0.96)',
        border: `1px solid rgba(255,255,255,${hov ? '0.12' : '0.07'})`,
        boxShadow: hov
          ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 24px 64px rgba(0,0,0,0.6)'
          : 'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 32px rgba(0,0,0,0.5)',
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
        transition: 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, box-shadow 0.3s ease',
      }}>

      {/* Scan line */}
      <div className="map-scan" />

      {/* Overlay header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 500,
        padding: '18px 20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.88), transparent)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        pointerEvents: 'none',
      }}>
        <div>
          <span style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#30d158',
          }}>Satellite Real-Time Rescue Map</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '2px', fontWeight: 600 }}>
            📍 {currentPlace} ({liveSurvivors.length} Real-Time Targets)
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
          <button
            onClick={() => setMapType(m => m === 'satellite' ? 'street' : 'satellite')}
            style={{
              padding: '4px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 800,
              background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer', letterSpacing: '0.05em'
            }}>
            {mapType === 'satellite' ? '🛰️ Satellite Imagery' : '🗺️ Street View'}
          </button>
          {Object.entries(ZONE_COLOR).map(([zone, color]) => (
            <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color, letterSpacing: '0.06em' }}>{zone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 400, pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(0,0,0,0.25), transparent 20%, transparent 80%, rgba(0,0,0,0.25))',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 400, pointerEvents: 'none',
        height: '60px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
      }} />

      <MapContainer
        center={currentCenter} zoom={8}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false} zoomControl>
        {mapType === 'satellite' ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            maxZoom={18}
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
        )}
        <FlyIn center={currentCenter} />
        {liveSurvivors.map(s => (
          <Marker key={s.id} position={s.pos} icon={makeIcon(s.zone)}>
            <Popup>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#000' }}>
                <strong>Survivor #{s.id}</strong><br />
                Zone: {s.zone}<br />
                Confidence: {s.confidence}%<br />
                Status: {s.status || 'detected'}
              </div>
            </Popup>
          </Marker>
        ))}
        {teams && teams.map(t => (
          <Marker key={t.name} position={t.pos} icon={makeTeamIcon(t.color || C.blue)}>
            <Popup>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#000' }}>
                <strong>{t.name}</strong><br />
                Status: {t.status}<br />
                Target: Survivor #{t.target_survivor || 'None'}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
