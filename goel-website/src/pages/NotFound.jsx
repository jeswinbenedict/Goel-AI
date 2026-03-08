import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import { C } from '../styles/theme'

export default function NotFound() {
  const [ready, setReady] = useState(false)
  const [count, setCount] = useState(10)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Auto-redirect countdown
  useEffect(() => {
    if (count <= 0) { window.location.href = '/'; return }
    const t = setInterval(() => setCount(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [count])

  return (
    <div style={{
      background: '#000', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,59,48,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '520px' }}>

        {/* Icon */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 32px',
          background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          animation: 'glowPulse 2.5s ease-in-out infinite',
        }}>
          <AlertTriangle size={36} color={C.red} strokeWidth={1.5} />
        </div>

        {/* 404 */}
        <div style={{
          fontSize: '120px', fontWeight: 900, lineHeight: 1,
          letterSpacing: '-0.06em', marginBottom: '8px',
          background: 'linear-gradient(135deg, rgba(255,59,48,0.8) 0%, rgba(255,107,53,0.4) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
        }}>
          404
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '24px', fontWeight: 800, color: '#f5f5f7',
          letterSpacing: '-0.03em', marginBottom: '12px',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease 0.18s, transform 0.5s ease 0.18s',
        }}>
          Zone Not Found
        </h1>

        {/* Desc */}
        <p style={{
          fontSize: '15px', color: C.t3, lineHeight: 1.7, marginBottom: '40px',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease 0.24s, transform 0.5s ease 0.24s',
        }}>
          This sector is outside our operational range. GOEL's rescue teams are active — head back to the dashboard.
        </p>

        {/* Countdown */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 18px', borderRadius: '100px', marginBottom: '28px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          fontSize: '12px', color: C.t3, fontWeight: 600,
          opacity:   ready ? 1 : 0,
          transition: 'opacity 0.5s ease 0.3s',
        }}>
          <span style={{
            width: '18px', height: '18px', borderRadius: '50%',
            background: `conic-gradient(${C.red} ${count * 36}deg, rgba(255,255,255,0.06) 0deg)`,
            display: 'inline-block', flexShrink: 0,
          }} />
          Redirecting to dashboard in <strong style={{ color: C.red }}>{count}s</strong>
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease 0.32s, transform 0.5s ease 0.32s',
        }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '13px 28px', borderRadius: '100px',
            background: 'linear-gradient(135deg, #ff3b30, #ff6b35)',
            color: 'white', fontSize: '14px', fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 28px rgba(255,59,48,0.4)',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(255,59,48,0.55)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 28px rgba(255,59,48,0.4)' }}>
            <Home size={14} strokeWidth={2.5} />
            Go to Dashboard
          </Link>

          <button onClick={() => window.history.back()} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '13px 28px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f5f5f7', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            <ArrowLeft size={14} strokeWidth={2.5} />
            Go Back
          </button>
        </div>

        {/* GOEL branding */}
        <div style={{
          marginTop: '60px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px',
          opacity:   ready ? 1 : 0,
          transition: 'opacity 0.5s ease 0.4s',
        }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #ff3b30, #ff6b35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={12} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: C.t4 }}>GOEL v1.0 — Rescue Operations Active</span>
        </div>
      </div>
    </div>
  )
}
