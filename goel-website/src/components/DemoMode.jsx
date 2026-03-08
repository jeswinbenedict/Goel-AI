import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Square, ChevronRight, ChevronLeft, Maximize2 } from 'lucide-react'
import { C } from '../styles/theme'

const SECTIONS = [
  { id: 'hero',        label: 'Hero',             desc: 'Operation overview & AI modules'  },
  { id: 'dashboard',   label: 'Stats',             desc: 'Live mission statistics'          },
  { id: 'map',         label: 'Live Map',          desc: 'Rescue map & zone classification' },
  { id: 'mission',     label: 'Mission Status',    desc: 'Countdown & rescue progress'      },
  { id: 'field',       label: 'Field Intel',       desc: 'Survivor panel & route optimizer' },
  { id: 'seismic',     label: 'Seismic Data',      desc: 'P-wave & S-wave analysis'         },
  { id: 'ai',          label: 'AI Models',         desc: 'CNN chart & ANN predictor'        },
  { id: 'pso',         label: 'PSO Swarm',         desc: 'Particle swarm optimizer'         },
  { id: 'flowchart',   label: 'AI Pipeline',       desc: 'Algorithm flowchart'              },
  { id: 'timeline',    label: 'Timeline',          desc: 'Operation history'                },
]

// Maps section id → DOM anchor id or scroll behavior
const SCROLL_MAP = {
  hero:      () => window.scrollTo({ top: 0,    behavior: 'smooth' }),
  dashboard: () => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
  map:       () => document.getElementById('section-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  mission:   () => document.getElementById('section-mission')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  field:     () => document.getElementById('section-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  seismic:   () => document.getElementById('section-seismic')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  ai:        () => document.getElementById('section-ai')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  pso:       () => document.getElementById('section-pso')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  flowchart: () => document.getElementById('section-flowchart')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
  timeline:  () => document.getElementById('section-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
}

const INTERVAL_MS = 4000

export default function DemoMode() {
  const [active,  setActive]  = useState(false)
  const [current, setCurrent] = useState(0)
  const [hov,     setHov]     = useState(false)
  const [progress,setProgress]= useState(0)
  const timerRef   = useRef(null)
  const progressRef= useRef(null)

  const goTo = useCallback((idx) => {
    setCurrent(idx)
    setProgress(0)
    SCROLL_MAP[SECTIONS[idx].id]?.()
  }, [])

  const next = useCallback(() => {
    setCurrent(c => {
      const n = (c + 1) % SECTIONS.length
      SCROLL_MAP[SECTIONS[n].id]?.()
      return n
    })
    setProgress(0)
  }, [])

  const prev = useCallback(() => {
    setCurrent(c => {
      const n = (c - 1 + SECTIONS.length) % SECTIONS.length
      SCROLL_MAP[SECTIONS[n].id]?.()
      return n
    })
    setProgress(0)
  }, [])

  // Auto-advance timer
  useEffect(() => {
    if (!active) return
    clearInterval(timerRef.current)
    clearInterval(progressRef.current)
    setProgress(0)

    timerRef.current = setInterval(next, INTERVAL_MS)

    // Progress bar — update every 50ms
    progressRef.current = setInterval(() => {
      setProgress(p => Math.min(p + (50 / INTERVAL_MS) * 100, 100))
    }, 50)

    return () => { clearInterval(timerRef.current); clearInterval(progressRef.current) }
  }, [active, current, next])

  const toggle = () => {
    if (!active) { goTo(0); setActive(true) }
    else         { setActive(false); setProgress(0) }
  }

  const fullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  return (
    <>
      {/* ── Floating Demo Bar ── */}
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: 'fixed', bottom: '24px', left: '50%',
          transform: `translateX(-50%) translateY(${hov || active ? '0' : '4px'})`,
          zIndex: 9000,
          background: 'rgba(10,10,14,0.97)',
          border: `1px solid ${active ? 'rgba(255,59,48,0.3)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '20px', padding: '10px 16px',
          backdropFilter: 'blur(32px)',
          boxShadow: active
            ? '0 8px 48px rgba(255,59,48,0.25), 0 0 0 1px rgba(255,255,255,0.04)'
            : '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', gap: '12px',
          transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
          opacity: hov || active ? 1 : 0.7,
        }}>

        {/* Play / Stop */}
        <button
          onClick={toggle}
          style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: active ? 'rgba(255,59,48,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${active ? 'rgba(255,59,48,0.3)' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: active ? C.red : C.t2,
            transition: 'all 0.2s ease', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}>
          {active
            ? <Square size={14} strokeWidth={2.5} fill="currentColor" />
            : <Play   size={14} strokeWidth={2.5} fill="currentColor" />}
        </button>

        {/* Label */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: active ? C.red : C.t4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {active ? 'Demo Mode' : 'Demo Tour'}
          </div>
          {active && (
            <div style={{ fontSize: '11px', color: C.t3, marginTop: '1px' }}>
              {SECTIONS[current].label}
            </div>
          )}
        </div>

        {/* Section dots — only when active */}
        {active && (
          <>
            {/* Prev */}
            <button onClick={prev} style={{
              width: '28px', height: '28px', borderRadius: '9px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
              <ChevronLeft size={13} color={C.t3} strokeWidth={2.5} />
            </button>

            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  title={s.label}
                  style={{
                    width:  i === current ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '100px',
                    background: i === current ? C.red : i < current ? 'rgba(255,59,48,0.35)' : 'rgba(255,255,255,0.12)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button onClick={next} style={{
              width: '28px', height: '28px', borderRadius: '9px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
              <ChevronRight size={13} color={C.t3} strokeWidth={2.5} />
            </button>

            {/* Progress bar */}
            <div style={{
              width: '60px', height: '3px', borderRadius: '100px',
              background: 'rgba(255,255,255,0.06)', overflow: 'hidden', flexShrink: 0,
            }}>
              <div style={{
                height: '100%', borderRadius: '100px',
                width: `${progress}%`,
                background: C.red,
                boxShadow: `0 0 8px ${C.red}80`,
                transition: 'width 0.05s linear',
              }} />
            </div>

            <span style={{ fontSize: '11px', color: C.t4, fontWeight: 700, minWidth: '28px', textAlign: 'right' }}>
              {current + 1}/{SECTIONS.length}
            </span>
          </>
        )}

        {/* Fullscreen */}
        <button
          onClick={fullscreen}
          style={{
            width: '28px', height: '28px', borderRadius: '9px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
          <Maximize2 size={12} color={C.t3} strokeWidth={2} />
        </button>
      </div>

      {/* ── Section overlay label (while demo runs) ── */}
      {active && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 8999, pointerEvents: 'none',
          background: 'rgba(10,10,14,0.92)',
          border: '1px solid rgba(255,59,48,0.2)',
          borderRadius: '14px', padding: '10px 20px',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.red, animation: 'pulseDot 1.5s ease-in-out infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: C.red, letterSpacing: '0.06em' }}>DEMO</span>
          <span style={{ fontSize: '12px', color: C.t2, fontWeight: 600 }}>{SECTIONS[current].label}</span>
          <span style={{ fontSize: '11px', color: C.t4 }}>—</span>
          <span style={{ fontSize: '11px', color: C.t4 }}>{SECTIONS[current].desc}</span>
        </div>
      )}
    </>
  )
}
