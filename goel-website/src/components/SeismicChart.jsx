import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Activity, Radio } from 'lucide-react'
import { C, card, cardHover } from '../styles/theme'
import { useInView } from '../hooks/useInView'

function generateWave(pts = 60) {
  return Array.from({ length: pts }, (_, i) => {
    const pWave = i > 10 && i < 20 ? Math.sin((i - 10) * 0.8) * (3 + Math.random()) : 0
    const sWave = i > 25 && i < 45 ? Math.sin((i - 25) * 0.5) * (6 + Math.random() * 2) : 0
    const noise = (Math.random() - 0.5) * 0.4
    return {
      t: i,
      amplitude: +(pWave + sWave + noise).toFixed(3),
      label: i === 15 ? 'P-Wave' : i === 35 ? 'S-Wave' : null,
    }
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(12,12,16,0.97)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px', padding: '10px 14px', fontSize: '12px',
    }}>
      <div style={{ color: C.t3, marginBottom: '4px' }}>t = {label}s</div>
      <div style={{ color: C.red, fontWeight: 700 }}>
        {payload[0].value > 0 ? '+' : ''}{payload[0].value}
      </div>
    </div>
  )
}

export default function SeismicChart() {
  const [ref, inView] = useInView()
  const [hov, setHov] = useState(false)
  const [data, setData] = useState(generateWave)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!live) return
    const t = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), {
          t: prev[prev.length - 1].t + 1,
          amplitude: +((Math.random() - 0.5) * 1.2).toFixed(3),
        }]
        return next
      })
    }, 200)
    return () => clearInterval(t)
  }, [live])

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={16} color={C.t2} strokeWidth={1.75} />
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.t4, textTransform: 'uppercase' }}>Seismic Waveform</div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>P-Wave & S-Wave Analysis</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Live toggle */}
          <button
            onClick={() => setLive(l => !l)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '100px',
              background: live ? `${C.red}15` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${live ? C.red + '30' : 'rgba(255,255,255,0.08)'}`,
              color: live ? C.red : C.t3,
              fontSize: '11px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}>
            <Radio size={11} strokeWidth={2.5} />
            {live ? 'LIVE' : 'REPLAY'}
          </button>
        </div>
      </div>

      {/* Wave labels */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        {[
          { label: 'P-Wave', desc: 'Primary · t≈15s', color: C.yellow },
          { label: 'S-Wave', desc: 'Secondary · t≈35s', color: C.red },
          { label: 'Ambient', desc: 'Background noise', color: C.t4 },
        ].map(w => (
          <div key={w.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '20px', height: '2px', background: w.color, borderRadius: '2px' }} />
            <span style={{ fontSize: '11px', color: C.t3 }}>{w.label}</span>
            <span style={{ fontSize: '10px', color: C.t4 }}>({w.desc})</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="t"
            tick={{ fill: C.t4, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            label={{ value: 'Time (s)', position: 'insideBottom', offset: -2, fill: C.t4, fontSize: 10 }}
          />
          <YAxis
            tick={{ fill: C.t4, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={15} stroke={`${C.yellow}50`} strokeDasharray="4 4" label={{ value: 'P', fill: C.yellow, fontSize: 10 }} />
          <ReferenceLine x={35} stroke={`${C.red}50`}    strokeDasharray="4 4" label={{ value: 'S', fill: C.red,    fontSize: 10 }} />
          <ReferenceLine y={0}  stroke="rgba(255,255,255,0.08)" />
          <Line
            type="monotone" dataKey="amplitude"
            stroke={C.red} strokeWidth={1.5}
            dot={false} activeDot={{ r: 4, fill: C.red, strokeWidth: 0 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Footer note */}
      <div style={{
        marginTop: '14px', padding: '9px 14px', borderRadius: '10px', textAlign: 'center',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        fontSize: '11px', color: C.t4,
      }}>
        Magnitude 7.2 · Depth 12km · Tokyo, Japan · Click LIVE for real-time feed
      </div>
    </div>
  )
}
