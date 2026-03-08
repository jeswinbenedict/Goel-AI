import { useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, Users, TrendingUp } from 'lucide-react'
import { C, card, cardHover, progressTrack, progressFill } from '../styles/theme'
import { useInView, useCounter } from '../hooks/useInView'

const OPERATIONS = [
  { label: 'Survivors Detected',  done: 14, total: 14, color: C.red,    icon: AlertCircle  },
  { label: 'Rescue Dispatched',   done: 9,  total: 14, color: C.orange, icon: Users        },
  { label: 'Active Operations',   done: 6,  total: 9,  color: C.yellow, icon: Clock        },
  { label: 'Successfully Rescued',done: 7,  total: 14, color: C.green,  icon: CheckCircle2 },
]

function ProgressRow({ op, inView, delay }) {
  const pct = Math.round((op.done / op.total) * 100)
  const count = useCounter(op.done, 1400, inView)
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '16px', borderRadius: '16px',
        background: hov ? `${op.color}08` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hov ? op.color + '25' : 'rgba(255,255,255,0.06)'}`,
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(-24px)',
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s, background 0.25s ease, border-color 0.25s ease`,
      }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '11px',
            background: `${op.color}12`, border: `1px solid ${op.color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.25s ease',
            transform: hov ? 'scale(1.1)' : 'scale(1)',
          }}>
            <op.icon size={15} color={op.color} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: C.t1 }}>{op.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: '22px', fontWeight: 800, color: op.color, letterSpacing: '-0.03em' }}>
            {inView ? count : 0}
          </span>
          <span style={{ fontSize: '13px', color: C.t3 }}>/ {op.total}</span>
        </div>
      </div>

      <div style={progressTrack}>
        <div style={{
          ...progressFill(inView ? pct : 0, op.color),
          transition: `width 1.4s cubic-bezier(0.22,1,0.36,1) ${delay + 0.2}s`,
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: `${op.color}80` }}>{pct}%</span>
      </div>
    </div>
  )
}

export default function RescueProgress() {
  const [ref, inView] = useInView()
  const [hov, setHov] = useState(false)
  const rescued = useCounter(7, 1600, inView)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '24px',
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease 0.05s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s, border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.t4, textTransform: 'uppercase', marginBottom: '4px' }}>
            Operation Status
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>Rescue Progress</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: C.green, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {inView ? rescued : 0}
          </div>
          <div style={{ fontSize: '11px', color: C.t3, fontWeight: 500 }}>Rescued</div>
        </div>
      </div>

      {/* Overall bar */}
      <div style={{
        padding: '14px 16px', borderRadius: '14px', marginBottom: '20px',
        background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px' }}>
          <span style={{ color: C.t2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={12} color={C.green} strokeWidth={2} />
            Overall Mission Progress
          </span>
          <span style={{ fontWeight: 800, color: C.green }}>50%</span>
        </div>
        <div style={{ ...progressTrack, height: '8px' }}>
          <div style={{
            height: '100%', borderRadius: '100px',
            width: inView ? '50%' : '0%',
            background: `linear-gradient(to right, ${C.green}, ${C.blue})`,
            boxShadow: `0 0 16px ${C.green}50`,
            transition: 'width 1.6s cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>
      </div>

      {/* Individual rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {OPERATIONS.map((op, i) => (
          <ProgressRow key={op.label} op={op} inView={inView} delay={i * 0.08} />
        ))}
      </div>
    </div>
  )
}
