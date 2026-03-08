import { useState, useEffect, useCallback } from 'react'
import { Keyboard, X, Command } from 'lucide-react'
import { C } from '../styles/theme'

const SHORTCUTS = [
  { keys: ['?'],      label: 'Open this panel',            color: C.t2    },
  { keys: ['Esc'],    label: 'Close this panel',            color: C.t2    },
  { keys: ['D'],      label: 'Go to Dashboard',             color: C.blue  },
  { keys: ['A'],      label: 'Go to About page',            color: C.blue  },
  { keys: ['H'],      label: 'Scroll to top (Hero)',        color: C.blue  },
  { keys: ['F'],      label: 'Toggle fullscreen',           color: C.green },
  { keys: ['T'],      label: 'Start / Stop Demo Tour',      color: C.red   },
  { keys: ['E'],      label: 'Export PDF Report',           color: C.orange},
  { keys: ['R'],      label: 'Reset PSO Visualizer',        color: C.purple},
  { keys: ['L'],      label: 'Toggle Seismic Live mode',    color: C.yellow},
  { keys: ['1'],      label: 'Jump to Live Operations',     color: C.t3    },
  { keys: ['2'],      label: 'Jump to Mission Status',      color: C.t3    },
  { keys: ['3'],      label: 'Jump to AI Visualizers',      color: C.t3    },
  { keys: ['4'],      label: 'Jump to AI Pipeline',         color: C.t3    },
]

export default function KeyboardShortcuts({ onDemoToggle, onExport }) {
  const [open,    setOpen]    = useState(false)
  const [pressed, setPressed] = useState(null)

  const flash = (key) => {
    setPressed(key)
    setTimeout(() => setPressed(null), 300)
  }

  const handleKey = useCallback((e) => {
    // Don't fire inside input/select/textarea
    if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return

    const k = e.key.toUpperCase()
    flash(k)

    switch (k) {
      case '?':
        setOpen(o => !o)
        break
      case 'ESCAPE':
        setOpen(false)
        break
      case 'D':
        window.location.href = '/'
        break
      case 'A':
        window.location.href = '/about'
        break
      case 'H':
        window.scrollTo({ top: 0, behavior: 'smooth' })
        break
      case 'F':
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
        break
      case 'T':
        onDemoToggle?.()
        break
      case 'E':
        onExport?.()
        break
      case '1':
        document.getElementById('section-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        break
      case '2':
        document.getElementById('section-mission')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        break
      case '3':
        document.getElementById('section-ai')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        break
      case '4':
        document.getElementById('section-flowchart')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        break
      default: break
    }
  }, [onDemoToggle, onExport])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  if (!open) return (
    <>
      {/* Small hint button bottom-right */}
      <button
        onClick={() => setOpen(true)}
        title="Keyboard shortcuts (?)"
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          zIndex: 8990,
          width: '40px', height: '40px', borderRadius: '13px',
          background: 'rgba(10,10,14,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          opacity: 0.6,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
        <Keyboard size={16} color={C.t3} strokeWidth={1.75} />
      </button>
      {/* Flash indicator */}
      {pressed && (
        <div style={{
          position: 'fixed', bottom: '72px', right: '24px',
          zIndex: 8991, pointerEvents: 'none',
          background: 'rgba(10,10,14,0.95)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '10px', padding: '5px 12px',
          fontSize: '13px', fontWeight: 800, color: C.t1,
          backdropFilter: 'blur(20px)',
          animation: 'fadeIn 0.15s ease',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}>
          {pressed}
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9500,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9501, width: '100%', maxWidth: '520px',
        padding: '0 20px',
        animation: 'scaleUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{
          background: 'rgba(10,10,14,0.99)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px', overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Command size={16} color={C.t2} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: C.t1 }}>Keyboard Shortcuts</div>
                <div style={{ fontSize: '11px', color: C.t4 }}>Press <strong style={{ color: C.t2 }}>?</strong> to toggle · <strong style={{ color: C.t2 }}>Esc</strong> to close</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
              <X size={14} color={C.t3} strokeWidth={2.5} />
            </button>
          </div>

          {/* Shortcuts list */}
          <div style={{ padding: '12px 16px 20px', maxHeight: '65vh', overflowY: 'auto' }}>
            {SHORTCUTS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 10px', borderRadius: '11px',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'}>
                <span style={{ fontSize: '13px', color: C.t2, fontWeight: 500 }}>{s.label}</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {s.keys.map(k => (
                    <kbd key={k} style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: '28px', height: '26px', padding: '0 8px',
                      borderRadius: '8px',
                      background: pressed === k.toUpperCase()
                        ? `${s.color}20`
                        : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${pressed === k.toUpperCase() ? s.color + '40' : 'rgba(255,255,255,0.12)'}`,
                      color: pressed === k.toUpperCase() ? s.color : C.t2,
                      fontSize: '12px', fontWeight: 700,
                      fontFamily: 'monospace',
                      transition: 'all 0.15s ease',
                      boxShadow: pressed === k.toUpperCase() ? `0 0 12px ${s.color}30` : 'none',
                    }}>
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: '11px', color: C.t4, textAlign: 'center',
          }}>
            Shortcuts are disabled when typing in input fields
          </div>
        </div>
      </div>
    </>
  )
}
