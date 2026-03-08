import { useEffect, useRef, useState } from 'react'
import { Zap, Play, RotateCcw } from 'lucide-react'
import { C, card, cardHover, badge } from '../styles/theme'
import { useInView } from '../hooks/useInView'

const W = 500, H = 280
const N_PARTICLES = 28
const TARGETS = [
  { x: 120, y: 80,  r: 18, color: C.red,    label: 'S#1' },
  { x: 340, y: 100, r: 18, color: C.red,    label: 'S#2' },
  { x: 220, y: 190, r: 16, color: C.yellow, label: 'S#3' },
  { x: 400, y: 200, r: 14, color: C.yellow, label: 'S#4' },
  { x: 80,  y: 210, r: 12, color: C.green,  label: 'S#5' },
]

function initParticles() {
  return Array.from({ length: N_PARTICLES }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    best: null, trail: [],
    target: TARGETS[Math.floor(Math.random() * TARGETS.length)],
  }))
}

export default function PSOVisualizer() {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const stateRef  = useRef({ particles: initParticles(), iter: 0, running: false })
  const [ref, inView]  = useInView()
  const [hov, setHov]  = useState(false)
  const [running, setRunning] = useState(false)
  const [iter, setIter] = useState(0)

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { particles } = stateRef.current

    ctx.clearRect(0, 0, W, H)

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // Target zones (glow rings)
    TARGETS.forEach(t => {
      const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.r * 3)
      grad.addColorStop(0, `${t.color}22`)
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(t.x, t.y, t.r * 3, 0, Math.PI * 2); ctx.fill()

      ctx.strokeStyle = `${t.color}60`
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = `${t.color}CC`
      ctx.beginPath(); ctx.arc(t.x, t.y, 5, 0, Math.PI * 2); ctx.fill()

      ctx.fillStyle = t.color
      ctx.font = '600 10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(t.label, t.x, t.y - t.r - 5)
    })

    // Trails + particles
    particles.forEach(p => {
      // Trail
      if (p.trail.length > 1) {
        ctx.beginPath()
        ctx.moveTo(p.trail[0].x, p.trail[0].y)
        p.trail.forEach(pt => ctx.lineTo(pt.x, pt.y))
        ctx.strokeStyle = `${p.target.color}25`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Line to target
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.target.x, p.target.y)
      ctx.strokeStyle = `${p.target.color}12`
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Particle
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6)
      grd.addColorStop(0, p.target.color)
      grd.addColorStop(1, `${p.target.color}00`)
      ctx.fillStyle = grd
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill()
    })
  }

  const step = () => {
    const s = stateRef.current
    const w1 = 0.72, c1 = 1.5, c2 = 2.0

    s.particles = s.particles.map(p => {
      const tx = p.target.x + (Math.random() - 0.5) * p.target.r
      const ty = p.target.y + (Math.random() - 0.5) * p.target.r

      const vx = w1 * p.vx + c1 * Math.random() * ((p.best?.x ?? tx) - p.x) + c2 * Math.random() * (tx - p.x)
      const vy = w1 * p.vy + c1 * Math.random() * ((p.best?.y ?? ty) - p.y) + c2 * Math.random() * (ty - p.y)

      const speed = Math.sqrt(vx * vx + vy * vy)
      const maxV  = 3.5
      const scale = speed > maxV ? maxV / speed : 1

      const nx = Math.max(4, Math.min(W - 4, p.x + vx * scale))
      const ny = Math.max(4, Math.min(H - 4, p.y + vy * scale))

      const dist = Math.hypot(nx - p.target.x, ny - p.target.y)
      const atTarget = dist < p.target.r

      const trail = [...(p.trail || []).slice(-12), { x: p.x, y: p.y }]

      return { ...p, x: nx, y: ny, vx: vx * scale, vy: vy * scale, trail, best: atTarget ? { x: nx, y: ny } : p.best }
    })

    s.iter++
    setIter(s.iter)
    draw()

    if (s.running) animRef.current = requestAnimationFrame(step)
  }

  const start = () => {
    stateRef.current.running = true
    setRunning(true)
    animRef.current = requestAnimationFrame(step)
  }

  const reset = () => {
    cancelAnimationFrame(animRef.current)
    stateRef.current = { particles: initParticles(), iter: 0, running: false }
    setRunning(false)
    setIter(0)
    draw()
  }

  useEffect(() => { draw() }, [])
  useEffect(() => { if (inView && !running) { setTimeout(start, 600) } }, [inView])
  useEffect(() => () => cancelAnimationFrame(animRef.current), [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '24px',
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease 0.1s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s, border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={16} color={C.t2} strokeWidth={1.75} />
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.t4, textTransform: 'uppercase' }}>
              Swarm Intelligence
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f5f7' }}>PSO Route Optimizer</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: C.t3 }}>Iter: <strong style={{ color: C.purple }}>{iter}</strong></span>
          <div style={badge(C.purple)}><Zap size={11} strokeWidth={2.5} />{N_PARTICLES} Particles</div>
          <button onClick={running ? reset : start}
            style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: running ? `${C.red}15` : `${C.green}15`,
              border: `1px solid ${running ? C.red : C.green}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}>
            {running
              ? <RotateCcw size={13} color={C.red}   strokeWidth={2.5} />
              : <Play      size={13} color={C.green} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{
        borderRadius: '14px', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(6,6,8,0.9)',
        position: 'relative',
      }}>
        <canvas
          ref={canvasRef}
          width={W} height={H}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(191,90,242,0.4), rgba(191,90,242,0.85), rgba(191,90,242,0.4), transparent)',
          animation: 'scanLine 4s linear infinite',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
        {[
          { color: C.red,    label: 'Critical survivors' },
          { color: C.yellow, label: 'Moderate survivors' },
          { color: C.green,  label: 'Low priority' },
          { color: C.purple, label: 'Particle paths' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
            <span style={{ fontSize: '11px', color: C.t4 }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '12px', padding: '9px 14px', borderRadius: '10px', textAlign: 'center',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        fontSize: '11px', color: C.t4,
      }}>
        {running ? `Simulating swarm convergence · ${N_PARTICLES} particles · w=0.72, c₁=1.5, c₂=2.0` : 'Press ▶ to run PSO simulation'}
      </div>
    </div>
  )
}
