import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, HeartPulse, Users, CheckCircle2, X } from 'lucide-react'
import { C } from '../styles/theme'

const TOASTS = [
  { icon: HeartPulse,    color: C.red,    title: '🚨 New Survivor Detected',        body: 'CNN 91% confidence · Block F Ground Floor · Critical zone' },
  { icon: Users,         color: C.yellow, title: '🚁 Alpha Team Update',             body: 'Survivor #1 successfully extracted — en route to hospital' },
  { icon: AlertTriangle, color: C.orange, title: '⚠ Aftershock Warning',             body: 'M4.1 aftershock detected · 3km NE · Structural risk elevated' },
  { icon: HeartPulse,    color: C.red,    title: '🚨 Thermal Signature Detected',    body: 'Heat anomaly in Block D · ANN void probability 83%' },
  { icon: CheckCircle2,  color: C.green,  title: '✅ Survivor #3 Rescued',           body: 'Bravo Team confirmed extraction · Block B Floor 3 cleared' },
  { icon: Users,         color: C.blue,   title: '📡 USGS Feed Update',              body: 'New M5.6 event registered — 12km depth · Monitoring active' },
]

let toastId = 0

export default function ToastNotifications() {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((data) => {
    const id = ++toastId
    setToasts(prev => [...prev.slice(-3), { ...data, id }])
    setTimeout(() => remove(id), 5000)
  }, [remove])

  useEffect(() => {
    const delays = [4000, 14000, 26000, 40000, 55000, 72000]
    const timers = delays.map((d, i) =>
      setTimeout(() => add(TOASTS[i % TOASTS.length]), d)
    )
    const loop = setInterval(() => {
      add(TOASTS[Math.floor(Math.random() * TOASTS.length)])
    }, 45000)
    return () => { timers.forEach(clearTimeout); clearInterval(loop) }
  }, [add])

  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px',
      maxWidth: '360px', width: '100%',
      pointerEvents: 'none',
    }}>
      {toasts.map((t, i) => (
        <Toast key={t.id} toast={t} onRemove={() => remove(t.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 20)
    const t2 = setTimeout(() => { setLeaving(true); setTimeout(onRemove, 400) }, 4600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const Icon = toast.icon

  return (
    <div
      onClick={() => { setLeaving(true); setTimeout(onRemove, 400) }}
      style={{
        pointerEvents: 'all', cursor: 'pointer',
        background: 'rgba(12,12,16,0.97)',
        border: `1px solid ${toast.color}30`,
        borderLeft: `3px solid ${toast.color}`,
        borderRadius: '16px', padding: '14px 16px',
        backdropFilter: 'blur(24px)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)`,
        display: 'flex', gap: '12px', alignItems: 'flex-start',
        opacity:    visible && !leaving ? 1 : 0,
        transform:  visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(120%) scale(0.9)',
        transition: 'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}>

      <div style={{
        width: '34px', height: '34px', borderRadius: '11px', flexShrink: 0,
        background: `${toast.color}15`, border: `1px solid ${toast.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} color={toast.color} strokeWidth={1.75} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f5f5f7', marginBottom: '3px', lineHeight: 1.3 }}>
          {toast.title}
        </div>
        <div style={{ fontSize: '12px', color: '#6e6e73', lineHeight: 1.5 }}>
          {toast.body}
        </div>
        {/* Progress bar */}
        <div style={{
          marginTop: '10px', height: '2px', borderRadius: '100px',
          background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: '100px',
            background: toast.color,
            animation: 'drawLine 5s linear forwards',
          }} />
        </div>
      </div>

      <button onClick={e => { e.stopPropagation(); setLeaving(true); setTimeout(onRemove, 400) }}
        style={{
          flexShrink: 0, width: '20px', height: '20px', borderRadius: '6px',
          background: 'rgba(255,255,255,0.05)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#6e6e73',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#f5f5f7' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#6e6e73' }}>
        <X size={11} strokeWidth={2.5} />
      </button>
    </div>
  )
}
