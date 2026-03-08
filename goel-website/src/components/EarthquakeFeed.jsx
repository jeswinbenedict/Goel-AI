import { useState, useEffect, useCallback } from 'react'
import { Globe, RefreshCw, Layers, Wifi, WifiOff } from 'lucide-react'
import { C, card, cardHover, badge, label } from '../styles/theme'
import { useInView } from '../hooks/useInView'
import { api } from '../api/client'

function getMag(mag) {
  if (mag >= 7) return { color: C.red,    label: 'MAJOR'  }
  if (mag >= 6) return { color: C.orange, label: 'STRONG' }
  if (mag >= 5) return { color: C.yellow, label: 'MOD'    }
  return               { color: C.t4,     label: 'LIGHT'  }
}

export default function EarthquakeFeed() {
  const [quakes,  setQuakes]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [updated, setUpdated] = useState(null)
  const [spin,    setSpin]    = useState(false)
  const [hov,     setHov]     = useState(false)
  const [source,  setSource]  = useState(null)
  const [ref, inView] = useInView()

  const load = useCallback(async () => {
    setLoading(true); setError(null); setSpin(true)
    try {
      // Try Flask backend proxy first
      const data = await api.earthquakeLive()
      const normalized = data.earthquakes.map(q => ({
        properties: { mag: q.magnitude, place: q.place, time: q.time },
        geometry:   { coordinates: [q.lng, q.lat, q.depth] },
      }))
      setQuakes(normalized.slice(0, 6))
      setSource('backend')
      setUpdated(new Date().toLocaleTimeString())
    } catch {
      // Fallback to direct USGS
      try {
        const res  = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
        const data = await res.json()
        setQuakes(data.features.slice(0, 6))
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
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [load])

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

      <span style={label}>Real-Time Seismic Activity</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={16} color={C.t2} strokeWidth={1.75} />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>Earthquake Feed</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {source && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '10px', fontWeight: 700,
              color: source === 'backend' ? C.green : C.blue,
              padding: '3px 10px', borderRadius: '100px',
              background: source === 'backend' ? `${C.green}12` : `${C.blue}12`,
              border: `1px solid ${source === 'backend' ? C.green : C.blue}25`,
            }}>
              {source === 'backend'
                ? <><Wifi size={10} strokeWidth={2.5} /> Flask API</>
                : <><WifiOff size={10} strokeWidth={2.5} /> USGS Direct</>}
            </div>
          )}
          <div style={badge(C.green)}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.green, display: 'inline-block' }} />
            USGS
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

      {updated && <p style={{ fontSize: '11px', color: C.t4, marginBottom: '16px' }}>Updated {updated}</p>}

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
            return (
              <div key={i}
                style={{
                  borderRadius: '14px', padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: `${s.color}08`, border: `1px solid ${s.color}20`,
                  transition: 'all 0.2s ease', cursor: 'default',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${s.color}13`; e.currentTarget.style.transform = 'scale(1.008)' }}
                onMouseLeave={e => { e.currentTarget.style.background = `${s.color}08`; e.currentTarget.style.transform = 'scale(1)' }}>
                <div style={{
                  minWidth: '54px', textAlign: 'center', padding: '8px 6px',
                  borderRadius: '12px', background: `${s.color}15`,
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{mag}</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: s.color, letterSpacing: '0.08em', marginTop: '2px' }}>{s.label}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: C.t1, marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.properties.place}
                  </p>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: C.t3 }}>
                    <span>{time.toLocaleDateString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={10} strokeWidth={1.75} />{depth}km depth
                    </span>
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
