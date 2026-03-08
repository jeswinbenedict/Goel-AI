import { useState } from 'react'
import { HeartPulse, Users, AlertTriangle, Clock, TrendingUp } from 'lucide-react'
import { C, card, cardHover, badge } from '../styles/theme'
import { useInView, useCounter } from '../hooks/useInView'

const CARDS = [
  { Icon: HeartPulse,    val: 14, lbl: 'Survivors Detected',  sub: '+2 in last hour',       color: C.red,    tag: 'Critical', trend: '+16%' },
  { Icon: Users,         val: 6,  lbl: 'Rescue Teams Active',  sub: '3 currently en route',  color: C.yellow, tag: 'Deployed', trend: 'Live'  },
  { Icon: AlertTriangle, val: 3,  lbl: 'Critical Zones',       sub: 'Immediate action req.', color: C.orange, tag: 'Urgent',   trend: '⚠ Act' },
  { Icon: Clock,         val: 18, lbl: 'Hours Since Quake',    sub: 'Golden window active',  color: C.blue,   tag: '72hr',     trend: '54hr left' },
]

function Card({ Icon, val, lbl, sub, color, tag, trend, enabled, delay }) {
  const count = useCounter(val, 1600, enabled)
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}),
        padding: '28px', position: 'relative', overflow: 'hidden',
      }}>

      {/* Shimmer on hover */}
      {hov && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `linear-gradient(135deg, transparent 40%, ${color}06 100%)`,
          transition: 'opacity 0.3s ease',
        }} />
      )}

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '14px',
          background: `${color}12`, border: `1px solid ${color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s ease',
          ...(hov ? { background: `${color}20`, transform: 'scale(1.08)' } : {}),
        }}>
          <Icon size={18} color={color} strokeWidth={1.75} />
        </div>
        <div style={badge(color)}>{tag}</div>
      </div>

      {/* Big number */}
      <div style={{
        fontSize: '68px', fontWeight: 800, lineHeight: 1,
        color, letterSpacing: '-0.04em', marginBottom: '10px',
        fontVariantNumeric: 'tabular-nums',
        transition: 'transform 0.2s ease',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        display: 'inline-block',
      }}>
        {enabled ? count : 0}
      </div>

      <div style={{ fontSize: '14px', fontWeight: 500, color: C.t1, marginBottom: '4px' }}>{lbl}</div>
      <div style={{ fontSize: '12px', color: `${color}80` }}>{sub}</div>

      {/* Trend */}
      <div style={{
        marginTop: '20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ height: '1.5px', flex: 1, borderRadius: '4px', marginRight: '12px',
          background: `linear-gradient(to right, ${color}60, transparent)` }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', fontWeight: 600, color: `${color}88`,
        }}>
          <TrendingUp size={11} strokeWidth={2} />
          {trend}
        </div>
      </div>
    </div>
  )
}

export default function StatsDashboard() {
  const [ref, inView] = useInView(0.1)
  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
      {CARDS.map((c, i) => (
        <div key={c.lbl} style={{
          opacity:    inView ? 1 : 0,
          transform:  inView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.96)',
          transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
        }}>
          <Card {...c} enabled={inView} />
        </div>
      ))}
    </div>
  )
}
