import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, ExternalLink, Menu, X } from 'lucide-react'
import { C } from '../styles/theme'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const NavLink = ({ to, label }) => {
    const active = location.pathname === to
    return (
      <Link to={to} style={{
        fontSize: '14px', fontWeight: active ? 700 : 500,
        color: active ? C.t1 : C.t3,
        textDecoration: 'none', padding: '6px 14px',
        borderRadius: '10px',
        background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
        border: `1px solid ${active ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = C.t1; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = C.t3; e.currentTarget.style.background = 'transparent' } }}>
        {label}
      </Link>
    )
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.3s ease',
        background: '#000',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.6)' : 'none',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 40px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '11px',
              background: 'linear-gradient(135deg, #ff3b30, #ff6b35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 16px rgba(255,59,48,0.4)',
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}>
              <Activity size={16} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: C.t1, letterSpacing: '-0.02em', lineHeight: 1 }}>GOEL</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: C.green, display: 'inline-block',
                  animation: 'pulseDot 2s ease-in-out infinite',
                }} />
                <span style={{ fontSize: '9px', fontWeight: 700, color: C.green, letterSpacing: '0.08em' }}>LIVE</span>
              </div>
            </div>
          </Link>

          {/* ── Center status pills ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[
              { dot: C.red,   label: 'Active Emergency' },
              { dot: C.blue,  label: 'USGS Feed'        },
              { dot: C.green, label: 'AI Active'        },
            ].map(p => (
              <div key={p.label} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 12px', borderRadius: '100px',
                background: `${p.dot}10`, border: `1px solid ${p.dot}25`,
                fontSize: '11px', fontWeight: 600, color: p.dot,
              }}>
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: p.dot, display: 'inline-block',
                  animation: 'pulseDot 2s ease-in-out infinite',
                }} />
                {p.label}
              </div>
            ))}
          </div>

          {/* ── Right — links + CTA ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NavLink to="/"      label="Dashboard" />
            <NavLink to="/about" label="About"     />
            <a href="https://earthquake.usgs.gov" target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '100px',
                background: 'linear-gradient(135deg, #ff3b30, #ff6b35)',
                color: 'white', fontSize: '13px', fontWeight: 700,
                textDecoration: 'none', marginLeft: '4px',
                boxShadow: '0 2px 16px rgba(255,59,48,0.35)',
                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,59,48,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(255,59,48,0.35)' }}>
              <ExternalLink size={12} strokeWidth={2.5} />
              USGS Live
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'none',
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: C.t2,
              }}>
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Spacer ── */}
      <div style={{ height: '64px' }} />
    </>
  )
}
