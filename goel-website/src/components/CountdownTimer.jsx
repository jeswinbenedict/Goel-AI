import { useState, useEffect } from 'react'
import { C, card, cardHover } from '../styles/theme'
import { useInView } from '../hooks/useInView'
import { AlertTriangle, Clock, Flame } from 'lucide-react'

// Set earthquake time — 18 hours ago from now
const QUAKE_TIME = Date.now() - 18 * 60 * 60 * 1000
const GOLDEN_WINDOW = 72 * 60 * 60 * 1000

function pad(n) { return String(n).padStart(2, '0') }

export default function CountdownTimer() {
  const [ref, inView] = useInView()
  const [hov, setHov] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const elapsed   = now - QUAKE_TIME
  const remaining = Math.max(GOLDEN_WINDOW - elapsed, 0)
  const pct       = Math.min((elapsed / GOLDEN_WINDOW) * 100, 100)

  const hrs  = Math.floor(remaining / 3600000)
  const mins = Math.floor((remaining % 3600000) / 60000)
  const secs = Math.floor((remaining % 60000) / 1000)

  const elapsedHrs = Math.floor(elapsed / 3600000)

  const urgency = pct > 80 ? C.red : pct > 55 ? C.orange : C.yellow
  const label   = pct > 80 ? 'CRITICAL' : pct > 55 ? 'URGENT' : 'ACTIVE'

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}),
        padding: '28px',
        border: `1px solid ${urgency}25`,
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '13px',
            background: `${urgency}15`, border: `1px solid ${urgency}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Flame size={18} color={urgency} strokeWidth={1.75} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.t4, textTransform: 'uppercase' }}>Golden Window</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: C.t1 }}>72-Hour Countdown</div>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px', borderRadius: '100px',
          background: `${urgency}12`, border: `1px solid ${urgency}28`,
          fontSize: '11px', fontWeight: 700, color: urgency,
        }}>
          <span className="anim-pulse-dot" style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: urgency, display: 'inline-block',
          }} />
          {label}
        </div>
      </div>

      {/* Big countdown */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '4px', marginBottom: '28px',
      }}>
        {[
          { val: pad(hrs),  label: 'HRS'  },
          { sep: true },
          { val: pad(mins), label: 'MIN'  },
          { sep: true },
          { val: pad(secs), label: 'SEC'  },
        ].map((item, i) => item.sep ? (
          <span key={i} style={{
            fontSize: '48px', fontWeight: 800, color: `${urgency}50`,
            lineHeight: 1, marginBottom: '16px',
          }}>:</span>
        ) : (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '56px', fontWeight: 800, color: urgency,
              letterSpacing: '-0.04em', lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              padding: '12px 18px', borderRadius: '16px',
              background: `${urgency}08`, border: `1px solid ${urgency}18`,
              minWidth: '80px',
              textShadow: `0 0 30px ${urgency}50`,
            }}>
              {item.val}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: C.t4, letterSpacing: '0.12em', marginTop: '6px' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
          <span style={{ color: C.t3 }}>Elapsed: <strong style={{ color: urgency }}>{elapsedHrs}h</strong></span>
          <span style={{ color: C.t3 }}>Remaining: <strong style={{ color: C.green }}>{hrs}h {mins}m</strong></span>
        </div>
        <div style={{
          width: '100%', height: '6px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '100px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: inView ? `${pct}%` : '0%',
            borderRadius: '100px',
            background: `linear-gradient(to right, ${C.green}, ${C.yellow} 50%, ${urgency})`,
            boxShadow: `0 0 12px ${urgency}60`,
            transition: 'width 1.5s cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: C.t4 }}>
          {pct.toFixed(1)}% of golden window elapsed
        </div>
      </div>

      {/* Warning */}
      {pct > 50 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 14px', borderRadius: '12px',
          background: `${urgency}08`, border: `1px solid ${urgency}20`,
        }}>
          <AlertTriangle size={13} color={urgency} strokeWidth={2} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: urgency }}>
            Survival probability drops sharply after 48 hours — prioritize active zones
          </span>
        </div>
      )}
    </div>
  )
}
