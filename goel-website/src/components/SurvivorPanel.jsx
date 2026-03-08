import { useState } from 'react'
import { MapPin, Thermometer, HeartPulse, Clock } from 'lucide-react'
import { C, card, cardHover, badge, label, progressTrack, progressFill } from '../styles/theme'
import { useInView } from '../hooks/useInView'

const SURVIVORS = [
  { id: 1, loc: 'Block A · Floor 2', zone: 'CRITICAL', conf: 94, ago: '12 min ago', temp: '37.2°C', pulse: 'Detected' },
  { id: 2, loc: 'Block C · Floor 1', zone: 'CRITICAL', conf: 88, ago: '25 min ago', temp: '36.8°C', pulse: 'Detected' },
  { id: 3, loc: 'Block B · Floor 3', zone: 'MODERATE', conf: 72, ago: '41 min ago', temp: '35.1°C', pulse: 'Faint'    },
  { id: 4, loc: 'Block D · Floor 1', zone: 'MODERATE', conf: 65, ago: '1 hr ago',   temp: '34.9°C', pulse: 'Faint'    },
  { id: 5, loc: 'Block E · Ground',  zone: 'LOW',      conf: 43, ago: '2 hr ago',   temp: '33.0°C', pulse: 'Unknown'  },
]

const ZONE_COLOR = { CRITICAL: C.red, MODERATE: C.yellow, LOW: C.green }

function SurvivorCard({ s, inView, delay }) {
  const [hov, setHov] = useState(false)
  const c = ZONE_COLOR[s.zone]

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: '16px', padding: '16px', cursor: 'default',
        background: hov ? `${c}10` : `${c}07`,
        border: `1px solid ${c}${hov ? '30' : '18'}`,
        opacity:    inView ? 1 : 0,
        transform:  hov ? 'translateX(5px)' : inView ? 'translateX(0)' : 'translateX(-20px)',
        transition: `background 0.25s ease, border-color 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease ${delay}s`,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            background: `${c}20`, border: `1px solid ${c}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: c,
          }}>{s.id}</div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: C.t1 }}>Survivor #{s.id}</span>
        </div>
        <span style={{
          fontSize: '10px', fontWeight: 800, padding: '3px 10px',
          borderRadius: '100px', color: 'white', letterSpacing: '0.08em',
          backgroundColor: c,
        }}>{s.zone}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
        {[
          { Icon: MapPin,      text: s.loc },
          { Icon: Thermometer, text: s.temp },
          { Icon: HeartPulse,  text: `Pulse: ${s.pulse}` },
          { Icon: Clock,       text: s.ago },
        ].map(({ Icon, text }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: C.t3 }}>
            <Icon size={11} strokeWidth={1.75} style={{ flexShrink: 0 }} />
            {text}
          </div>
        ))}
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
          <span style={{ color: C.t3 }}>CNN Confidence</span>
          <span style={{ fontWeight: 700, color: c }}>{s.conf}%</span>
        </div>
        <div style={progressTrack}>
          <div style={progressFill(inView ? s.conf : 0, c)} />
        </div>
      </div>
    </div>
  )
}

export default function SurvivorPanel() {
  const [ref, inView] = useInView()
  const [hov, setHov] = useState(false)
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '24px',
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateX(0)' : 'translateX(-32px)',
        transition: 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease, box-shadow 0.35s ease',
      }}>
      <span style={label}>Neural Network Detection</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>Detected Survivors</h2>
        <div style={badge(C.red)}>
          <span className="anim-pulse-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.red, display: 'inline-block' }} />
          {SURVIVORS.length} Found
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
        {SURVIVORS.map((s, i) => <SurvivorCard key={s.id} s={s} inView={inView} delay={i * 0.07} />)}
      </div>
    </div>
  )
}
