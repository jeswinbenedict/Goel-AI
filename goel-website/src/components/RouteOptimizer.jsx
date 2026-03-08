import { useState } from 'react'
import { Navigation, Users, MapPin, Clock, Zap, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { C, card, cardHover, badge, label } from '../styles/theme'
import { useInView } from '../hooks/useInView'
import { api } from '../api/client'

const STATIC_TEAMS = [
  { name: 'Alpha Team',   n: 4, target: 'Survivor #1 & #2 — Block A',     dist: '0.4 km', eta: '8 min',  status: 'EN ROUTE',  color: C.red    },
  { name: 'Bravo Team',   n: 3, target: 'Survivor #3 — Block B, Floor 3', dist: '0.9 km', eta: '15 min', status: 'DEPLOYING', color: C.yellow },
  { name: 'Charlie Team', n: 5, target: 'Survivor #4 & #5',               dist: '1.2 km', eta: '22 min', status: 'STANDBY',   color: C.blue   },
]

const SURVIVORS = [
  [35.694, 139.753], [35.689, 139.700],
  [35.701, 139.730], [35.710, 139.745], [35.680, 139.715],
]
const TEAM_POS = [
  [35.675, 139.720], [35.705, 139.760], [35.690, 139.740],
]
const TEAM_COLORS = [C.red, C.yellow, C.blue]

function TeamCard({ t, inView, delay }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: '16px', padding: '16px', cursor: 'default',
        background: hov ? `${t.color}10` : `${t.color}07`,
        border: `1px solid ${t.color}${hov ? '30' : '18'}`,
        opacity:    inView ? 1 : 0,
        transform:  hov ? 'translateX(5px)' : inView ? 'translateX(0)' : 'translateX(20px)',
        transition: `background 0.25s ease, border-color 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease ${delay}s`,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '14px', flexShrink: 0,
            background: `${t.color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.25s ease',
            transform: hov ? 'rotate(-8deg) scale(1.1)' : 'rotate(0) scale(1)',
          }}>
            <Navigation size={16} color={t.color} strokeWidth={1.75} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: C.t1 }}>{t.name}</div>
            {t.n && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontSize: '12px', color: C.t3 }}>
                <Users size={11} strokeWidth={1.75} />{t.n} members
              </div>
            )}
          </div>
        </div>
        <span style={{
          fontSize: '10px', fontWeight: 800, padding: '3px 10px',
          borderRadius: '100px', color: 'white', letterSpacing: '0.08em',
          backgroundColor: t.color,
        }}>{t.status}</span>
      </div>
      <p style={{ fontSize: '12px', color: C.t3, marginBottom: '12px', paddingLeft: '50px' }}>{t.target}</p>
      <div style={{ display: 'flex', gap: '20px', paddingLeft: '50px' }}>
        {t.dist && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: C.t3 }}>
            <MapPin size={11} strokeWidth={1.75} />{t.dist}
          </span>
        )}
        {t.eta && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: t.color }}>
            <Clock size={11} strokeWidth={1.75} />ETA {t.eta}
          </span>
        )}
        {t.cost && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: t.color }}>
            <MapPin size={11} strokeWidth={1.75} />dist: {t.cost}
          </span>
        )}
      </div>
    </div>
  )
}

export default function RouteOptimizer() {
  const [ref, inView] = useInView()
  const [hov,     setHov]     = useState(false)
  const [teams,   setTeams]   = useState(STATIC_TEAMS)
  const [loading, setLoading] = useState(false)
  const [source,  setSource]  = useState(null)
  const [meta,    setMeta]    = useState(null)

  const optimize = async () => {
    setLoading(true)
    try {
      const data = await api.optimizeRoutes(SURVIVORS, TEAM_POS)
      const apiTeams = data.routes.map((r, i) => ({
        name:   r.team,
        target: `${r.target} — PSO Optimized`,
        status: 'PSO ASSIGNED',
        color:  TEAM_COLORS[i] ?? C.purple,
        cost:   r.team_pos && r.surv_pos
          ? (Math.sqrt(
              Math.pow(r.team_pos[0] - r.surv_pos[0], 2) +
              Math.pow(r.team_pos[1] - r.surv_pos[1], 2)
            ) * 111).toFixed(2) + ' km'
          : null,
      }))
      setTeams(apiTeams)
      setMeta({ cost: data.total_cost, iters: data.iterations, particles: data.particles })
      setSource('backend')
    } catch {
      setTeams(STATIC_TEAMS)
      setSource('local')
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '24px',
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateX(0)' : 'translateX(32px)',
        transition: 'opacity 0.65s ease 0.1s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s, border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      <span style={label}>Particle Swarm Optimization</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>PSO Route Optimizer</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {source && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '10px', fontWeight: 700,
              color: source === 'backend' ? C.green : C.yellow,
              padding: '3px 10px', borderRadius: '100px',
              background: source === 'backend' ? `${C.green}12` : `${C.yellow}12`,
              border: `1px solid ${source === 'backend' ? C.green : C.yellow}25`,
            }}>
              {source === 'backend'
                ? <><Wifi size={10} strokeWidth={2.5} /> Flask PSO</>
                : <><WifiOff size={10} strokeWidth={2.5} /> Static</>}
            </div>
          )}
          <div style={badge(C.purple)}><Zap size={11} strokeWidth={2.5} />PSO Active</div>
        </div>
      </div>

      {/* Run PSO button */}
      <button
        onClick={optimize}
        disabled={loading}
        style={{
          width: '100%', padding: '11px', borderRadius: '12px', marginBottom: '16px',
          background: loading ? `${C.purple}15` : `${C.purple}18`,
          border: `1px solid ${C.purple}30`,
          color: C.purple, fontSize: '13px', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = `${C.purple}28` }}
        onMouseLeave={e => { e.currentTarget.style.background = loading ? `${C.purple}15` : `${C.purple}18` }}>
        {loading
          ? <><span style={{ width: '13px', height: '13px', borderRadius: '50%', border: `2px solid ${C.purple}40`, borderTopColor: C.purple, display: 'inline-block', animation: 'spinAnim 0.75s linear infinite' }} />Running PSO via Flask...</>
          : <><RefreshCw size={13} strokeWidth={2.5} />Run PSO via Flask Backend</>}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {teams.map((t, i) => <TeamCard key={t.name} t={t} inView={inView} delay={0.15 + i * 0.1} />)}
      </div>

      <div style={{
        marginTop: '16px', padding: '10px 14px', borderRadius: '12px', textAlign: 'center',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
      }}>
        {meta
          ? <p style={{ fontSize: '11px', color: C.t4 }}>
              Flask PSO · {meta.particles} particles × {meta.iters} iterations · cost: {meta.cost}
            </p>
          : <p style={{ fontSize: '11px', color: C.t4 }}>30 particles × 100 iterations · Recalculated every 30s</p>}
      </div>
    </div>
  )
}
