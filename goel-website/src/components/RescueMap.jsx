import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { C, label } from '../styles/theme'
import { useInView } from '../hooks/useInView'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const SURVIVORS = [
  { id: 1, pos: [35.694, 139.753], zone: 'CRITICAL' },
  { id: 2, pos: [35.689, 139.700], zone: 'CRITICAL' },
  { id: 3, pos: [35.701, 139.730], zone: 'MODERATE' },
  { id: 4, pos: [35.710, 139.745], zone: 'MODERATE' },
  { id: 5, pos: [35.680, 139.715], zone: 'LOW'      },
]

const ZONE_COLOR = { CRITICAL: C.red, MODERATE: C.yellow, LOW: C.green }

const makeIcon = (zone) => L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:${ZONE_COLOR[zone]}22;
        animation:ripple 2s ease-out infinite;
      "></div>
      <div style="
        position:absolute;top:4px;left:4px;
        width:12px;height:12px;border-radius:50%;
        background:${ZONE_COLOR[zone]};
        border:2px solid rgba(255,255,255,0.5);
        box-shadow:0 0 10px ${ZONE_COLOR[zone]}, 0 0 22px ${ZONE_COLOR[zone]}66;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function FlyIn() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.flyTo([35.695, 139.73], 12, { duration: 2.5 }), 300)
  }, [map])
  return null
}

export default function RescueMap() {
  const [ref, inView] = useInView(0.15)
  const [hov, setHov] = useState(false)

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
            textTransform: 'uppercase', color: '#3a3a3c',
          }}>Live Rescue Map</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
            Tokyo Metropolitan Area
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
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
        center={[35.692, 139.73]} zoom={10}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false} zoomControl>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <FlyIn />
        {SURVIVORS.map(s => (
          <Marker key={s.id} position={s.pos} icon={makeIcon(s.zone)}>
            <Popup>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#000' }}>
                <strong>Survivor #{s.id}</strong><br />Zone: {s.zone}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
