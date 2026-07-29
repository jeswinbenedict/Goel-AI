import { useState, useEffect, useCallback } from 'react'
import { Globe, RefreshCw, Layers, Wifi, WifiOff } from 'lucide-react'
import { C, card, cardHover, badge, label } from '../styles/theme'
import { useInView } from '../hooks/useInView'
import { api } from '../api/client'
import { useRealtime } from '../realtime/RealtimeProvider'

function getMag(mag) {
  if (mag >= 7) return { color: C.red,    label: 'MAJOR'  }
  if (mag >= 6) return { color: C.orange, label: 'STRONG' }
  if (mag >= 5) return { color: C.yellow, label: 'MOD'    }
  return               { color: C.t4,     label: 'LIGHT'  }
}

export default function EarthquakeFeed() {
  const { earthquakes: realtimeQuakes, connected, selectEpicenter, epicenter } = useRealtime()
  const [quakes,  setQuakes]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [updated, setUpdated] = useState(null)
  const [spin,    setSpin]    = useState(false)
  const [hov,     setHov]     = useState(false)
  const [source,  setSource]  = useState(null)
  const [ref, inView] = useInView()

  useEffect(() => {
    if (realtimeQuakes && realtimeQuakes.length > 0) {
      const normalized = realtimeQuakes.map(q => ({
        properties: {
          mag: q.magnitude,
          place: q.place,
          time: q.time,
          url: q.url,
          tsunami: q.tsunami,
          alert: q.alert,
        },
        geometry: { coordinates: [q.lng, q.lat, q.depth] },
      }))
      setQuakes(normalized.slice(0, 8))
      setSource(connected ? 'websocket' : 'backend')
      setUpdated(new Date().toLocaleTimeString())
      setLoading(false)
    }
  }, [realtimeQuakes, connected])

  const load = useCallback(async () => {
    setLoading(true); setError(null); setSpin(true)
    try {
      const data = await api.earthquakeLive()
      const normalized = data.earthquakes.map(q => ({
        properties: {
          mag: q.magnitude,
          place: q.place,
          time: q.time,
          url: q.url,
          tsunami: q.tsunami,
          alert: q.alert,
        },
        geometry: { coordinates: [q.lng, q.lat, q.depth] },
      }))
      setQuakes(normalized.slice(0, 8))
      setSource('backend')
      setUpdated(new Date().toLocaleTimeString())
    } catch {
      try {
        const res  = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
        const data = await res.json()
        setQuakes(data.features.slice(0, 8))
        setSource('usgs')
        setUpdated(new Date().toLocaleTimeString())
      } catch {
        setError('Unable to reach USGS or Flask backend')
      }
    } finally {
      setLoading(false); setSpin(false)
    }
  }, [])

  useEffect(() => {
    if (!realtimeQuakes || realtimeQuakes.length === 0) {
      load()
    }
  }, [load, realtimeQuakes])

  const handleSelectQuake = (q) => {
    const quakeObj = {
      lat: q.geometry.coordinates[1],
      lng: q.geometry.coordinates[0],
      place: q.properties.place,
      magnitude: q.properties.mag,
      depth: q.geometry.coordinates[2],
    }
    if (selectEpicenter) {
      selectEpicenter(quakeObj)
    }
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '24px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.55s ease 0.1s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s, border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      <span style={label}>Real-Time USGS Seismic Stream</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={16} color={C.t2} strokeWidth={1.75} />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>Live Earthquake Feed</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {source && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '10px', fontWeight: 700,
              color: source === 'backend' || source === 'websocket' ? C.green : C.blue,
              padding: '3px 10px', borderRadius: '100px',
              background: source === 'backend' || source === 'websocket' ? `${C.green}12` : `${C.blue}12`,
              border: `1px solid ${source === 'backend' || source === 'websocket' ? C.green : C.blue}25`,
            }}>
              {source === 'websocket'
                ? <><Wifi size={10} strokeWidth={2.5} /> Live WS</>
                : source === 'backend'
                ? <><Wifi size={10} strokeWidth={2.5} /> Flask API</>
                : <><WifiOff size={10} strokeWidth={2.5} /> USGS Direct</>}
            </div>
          )}
          <div style={badge(C.green)}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.green, display: 'inline-block' }} />
            USGS Live
          </div>
          <button
            onClick={load}
            style={{
              width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
            <RefreshCw
              size={13} color={C.t3} strokeWidth={2}
              style={{ transition: 'transform 0.5s ease', transform: spin ? 'rotate(360deg)' : 'rotate(0deg)' }}
            />
          </button>
        </div>
      </div>

      {updated && <p style={{ fontSize: '11px', color: C.t4, marginBottom: '16px' }}>Updated {updated} · Click any earthquake to center operational rescue map</p>}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '64px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.03)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0, width: '50%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                animation: 'shimmer 1.8s ease-in-out infinite',
              }} />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div style={{
          padding: '14px', borderRadius: '14px', fontSize: '13px',
          color: C.yellow, background: `${C.yellow}08`, border: `1px solid ${C.yellow}20`,
        }}>{error}</div>
      )}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
          {quakes.map((q, i) => {
            const mag   = q.properties.mag
            const s     = getMag(mag)
            const time  = new Date(q.properties.time)
            const depth = q.geometry.coordinates[2]
            const isCurrentEpicenter = epicenter?.place === q.properties.place

            return (
              <div key={i}
                onClick={() => handleSelectQuake(q)}
                title="Click to set as active emergency operation zone"
                style={{
                  borderRadius: '14px', padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: isCurrentEpicenter ? `${C.red}18` : `${s.color}08`,
                  border: `1px solid ${isCurrentEpicenter ? C.red : `${s.color}20`}`,
                  transition: 'all 0.2s ease', cursor: 'pointer',
                  position: 'relative',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${s.color}16`; e.currentTarget.style.transform = 'scale(1.008)' }}
                onMouseLeave={e => { e.currentTarget.style.background = isCurrentEpicenter ? `${C.red}18` : `${s.color}08`; e.currentTarget.style.transform = 'scale(1)' }}>
                <div style={{
                  minWidth: '54px', textAlign: 'center', padding: '8px 6px',
                  borderRadius: '12px', background: `${s.color}15`,
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{mag}</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: s.color, letterSpacing: '0.08em', marginTop: '2px' }}>{s.label}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: C.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {q.properties.place}
                    </p>
                    {isCurrentEpicenter && (
                      <span style={{ fontSize: '9px', fontWeight: 800, color: C.red, background: `${C.red}20`, padding: '2px 6px', borderRadius: '4px' }}>
                        ACTIVE TARGET
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: C.t3 }}>
                    <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={10} strokeWidth={1.75} />{depth}km depth
                    </span>
                    {q.properties.url && (
                      <a
                        href={q.properties.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: C.blue, textDecoration: 'none', fontWeight: 600 }}
                        title="View official USGS event report"
                      >
                        USGS Report ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
