import { useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, Radio, HeartPulse } from 'lucide-react'
import { C, card, cardHover } from '../styles/theme'
import { useInView } from '../hooks/useInView'

const EVENTS = [
  { time: '00:00', label: 'Earthquake Detected',      desc: 'M7.2 event — USGS API triggered system activation',        color: C.red,    Icon: AlertCircle,  status: 'done'    },
  { time: '00:04', label: 'Thermal Drones Deployed',   desc: '3 drones covering 4.2km² of affected zone',               color: C.orange, Icon: Radio,        status: 'done'    },
  { time: '00:18', label: 'Survivor #1 Detected',      desc: 'CNN 94% confidence · Block A Floor 2 · Critical zone',    color: C.red,    Icon: HeartPulse,   status: 'done'    },
  { time: '00:25', label: 'Survivor #2 Detected',      desc: 'CNN 88% confidence · Block C Floor 1 · Critical zone',    color: C.red,    Icon: HeartPulse,   status: 'done'    },
  { time: '00:41', label: 'Alpha Team Dispatched',     desc: 'PSO optimal route → Block A · ETA 8 min',                 color: C.green,  Icon: CheckCircle2, status: 'done'    },
  { time: '01:12', label: 'Survivor #3 & #4 Detected', desc: 'Fuzzy Logic MODERATE zone · ANN void probability 78%',   color: C.yellow, Icon: HeartPulse,   status: 'done'    },
  { time: '02:00', label: 'Survivor #1 Rescued',       desc: 'Alpha Team confirmed rescue · Transported to hospital',   color: C.green,  Icon: CheckCircle2, status: 'done'    },
  { time: '06:30', label: 'Survivor #2 Rescued',       desc: 'Alpha Team second extraction complete',                   color: C.green,  Icon: CheckCircle2, status: 'done'    },
  { time: '18:00', label: 'Active Operations',         desc: '6 teams deployed · 7 rescued · 7 operations ongoing',    color: C.blue,   Icon: Clock,        status: 'current' },
  { time: '??:??', label: 'Target: Full Rescue',       desc: 'All 14 survivors recovered before 72hr window closes',   color: C.t4,     Icon: CheckCircle2, status: 'pending' },
]

export default function SurvivorTimeline() {
  const [ref, inView] = useInView()
  const [hov, setHov] = useState(false)
  const [expanded, setExpanded] = useState(null)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '24px',
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.t4, textTransform: 'uppercase', marginBottom: '4px' }}>
          Operation History
        </div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>Survivor Timeline</h2>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>

        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: '19px', top: '10px',
          width: '2px',
          height: inView ? `calc(100% - 20px)` : '0%',
          background: 'linear-gradient(to bottom, rgba(255,59,48,0.4), rgba(255,255,255,0.06), transparent)',
          borderRadius: '2px',
          transition: 'height 1.5s cubic-bezier(0.22,1,0.36,1) 0.3s',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {EVENTS.map((ev, i) => {
            const isExpanded = expanded === i
            const isCurrent  = ev.status === 'current'
            const isPending  = ev.status === 'pending'

            return (
              <div
                key={i}
                onClick={() => setExpanded(isExpanded ? null : i)}
                style={{
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                  padding: '10px 10px 10px 0',
                  opacity:   inView ? 1 : 0,
                  transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.06}s`,
                  cursor: 'pointer',
                }}>

                {/* Dot */}
                <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: isPending ? 'rgba(255,255,255,0.03)' : `${ev.color}15`,
                    border: `2px solid ${isPending ? 'rgba(255,255,255,0.08)' : isCurrent ? ev.color : ev.color + '50'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                    ...(isCurrent ? { boxShadow: `0 0 16px ${ev.color}50`, animation: 'glowPulse 2s ease-in-out infinite' } : {}),
                  }}>
                    <ev.Icon size={15} color={isPending ? C.t4 : ev.color} strokeWidth={1.75} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 700,
                      color: isPending ? C.t4 : ev.color,
                      fontVariantNumeric: 'tabular-nums',
                      minWidth: '40px',
                    }}>{ev.time}</span>
                    <span style={{
                      fontSize: '13px', fontWeight: 600,
                      color: isPending ? C.t4 : C.t1,
                    }}>{ev.label}</span>
                    {isCurrent && (
                      <span style={{
                        fontSize: '9px', fontWeight: 800, padding: '2px 8px',
                        borderRadius: '100px', color: 'white',
                        background: ev.color, letterSpacing: '0.08em',
                      }}>NOW</span>
                    )}
                  </div>

                  {/* Expandable desc */}
                  <div style={{
                    fontSize: '12px', color: isPending ? C.t4 : C.t3, lineHeight: 1.55,
                    maxHeight: isExpanded ? '60px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.35s cubic-bezier(0.22,1,0.36,1)',
                  }}>
                    {ev.desc}
                  </div>
                  {!isExpanded && (
                    <div style={{ fontSize: '11px', color: C.t4, marginTop: '2px' }}>
                      {ev.desc.slice(0, 48)}…
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{
        marginTop: '16px', padding: '9px 14px', borderRadius: '10px', textAlign: 'center',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        fontSize: '11px', color: C.t4,
      }}>
        Click any event to expand details
      </div>
    </div>
  )
}
