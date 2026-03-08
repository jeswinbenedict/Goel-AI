import { useState } from 'react'
import { ChevronRight, GitBranch } from 'lucide-react'
import { C, card, cardHover, badge, label } from '../styles/theme'
import { useInView } from '../hooks/useInView'

const ZONES = [
  { level: 'CRITICAL', count: 2, score: '78–100', desc: 'Strong heat signature · High structural void probability via CNN + ANN', action: 'Deploy rescue team immediately', color: C.red    },
  { level: 'MODERATE', count: 2, score: '40–77',  desc: 'Medium heat signal · Uncertain structural data · Fuzzy boundary active', action: 'Deploy within 2 hours',         color: C.yellow },
  { level: 'LOW',      count: 1, score: '0–39',   desc: 'Faint signals only · Survival unlikely but not impossible',              action: 'Remote monitoring assigned',    color: C.green  },
]

function ZoneRow({ zone, inView, delay }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: '16px', padding: '16px', cursor: 'default',
        background: hov ? `${zone.color}12` : `${zone.color}07`,
        border: `1px solid ${zone.color}${hov ? '35' : '18'}`,
        transform:  hov ? 'translateX(4px)' : 'translateX(0)',
        opacity:    inView ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
        transitionDelay: inView ? `${delay}s` : '0s',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 800, padding: '3px 10px',
            borderRadius: '100px', color: 'white', letterSpacing: '0.08em',
            backgroundColor: zone.color,
          }}>{zone.level}</span>
          <span style={{ fontSize: '11px', color: `${zone.color}80`, fontWeight: 500 }}>Score {zone.score}</span>
        </div>
        <span style={{ fontSize: '38px', fontWeight: 800, color: zone.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
          {zone.count}
        </span>
      </div>
      <p style={{ fontSize: '12px', color: C.t3, lineHeight: 1.6, marginBottom: '10px' }}>{zone.desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="anim-pulse-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: zone.color, display: 'inline-block' }} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: zone.color }}>{zone.action}</span>
        <ChevronRight size={12} color={zone.color} style={{ marginLeft: 'auto', opacity: 0.5 }} />
      </div>
    </div>
  )
}

export default function FuzzyZoneCard() {
  const [ref, inView] = useInView()
  const [hov, setHov] = useState(false)
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}),
        padding: '24px', display: 'flex', flexDirection: 'column',
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateX(0)' : 'translateX(32px)',
        transition: 'opacity 0.65s ease 0.1s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s, border-color 0.35s ease, box-shadow 0.35s ease',
      }}>
      <span style={label}>Fuzzy Inference System</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>Zone Scoring</h2>
        <div style={badge(C.purple)}><GitBranch size={11} strokeWidth={2.5} />IF-THEN Rules</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {ZONES.map((z, i) => <ZoneRow key={z.level} zone={z} inView={inView} delay={0.15 + i * 0.1} />)}
      </div>
      <div style={{
        marginTop: '16px', padding: '10px 14px', borderRadius: '12px', textAlign: 'center',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{ fontSize: '11px', color: C.t4 }}>Trained on 10,000+ earthquake rescue records</p>
      </div>
    </div>
  )
}
