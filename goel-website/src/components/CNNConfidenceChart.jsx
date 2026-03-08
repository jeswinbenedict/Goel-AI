import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { Cpu } from 'lucide-react'
import { C, card, cardHover, badge } from '../styles/theme'
import { useInView } from '../hooks/useInView'

const DATA = [
  { name: 'S#1', confidence: 94, zone: 'CRITICAL', loc: 'Block A · F2' },
  { name: 'S#2', confidence: 88, zone: 'CRITICAL', loc: 'Block C · F1' },
  { name: 'S#3', confidence: 72, zone: 'MODERATE', loc: 'Block B · F3' },
  { name: 'S#4', confidence: 65, zone: 'MODERATE', loc: 'Block D · F1' },
  { name: 'S#5', confidence: 43, zone: 'LOW',      loc: 'Block E · GF' },
]

const ZONE_COLOR = { CRITICAL: C.red, MODERATE: C.yellow, LOW: C.green }

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const c = ZONE_COLOR[d.zone]
  return (
    <div style={{
      background: 'rgba(12,12,16,0.98)',
      border: `1px solid ${c}30`,
      borderRadius: '14px', padding: '14px 16px',
      backdropFilter: 'blur(20px)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`,
    }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#f5f5f7', marginBottom: '6px' }}>Survivor {d.name.replace('S','#')}</div>
      <div style={{ fontSize: '12px', color: '#6e6e73', marginBottom: '4px' }}>{d.loc}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '100px', color: 'white', background: c }}>{d.zone}</span>
        <span style={{ fontSize: '20px', fontWeight: 800, color: c }}>{d.confidence}%</span>
      </div>
    </div>
  )
}

export default function CNNConfidenceChart() {
  const [ref, inView] = useInView()
  const [hov, setHov] = useState(false)
  const [activeIdx, setActiveIdx] = useState(null)

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={16} color={C.t2} strokeWidth={1.75} />
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.t4, textTransform: 'uppercase' }}>
              Neural Network Output
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f5f7' }}>CNN Confidence Scores</h2>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '4px 12px', borderRadius: '100px',
          background: `${C.red}10`, border: `1px solid ${C.red}25`,
          fontSize: '11px', fontWeight: 700, color: C.red,
        }}>
          <Cpu size={11} strokeWidth={2.5} />
          CNN Active
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
        {Object.entries(ZONE_COLOR).map(([zone, color]) => (
          <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color }} />
            <span style={{ fontSize: '11px', color: '#6e6e73', fontWeight: 500 }}>{zone}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: 'auto' }}>
          <div style={{ width: '16px', height: '1px', background: '#3a3a3c', borderTop: '2px dashed #3a3a3c' }} />
          <span style={{ fontSize: '11px', color: '#6e6e73' }}>70% threshold</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={DATA}
          margin={{ top: 8, right: 8, bottom: 4, left: -16 }}
          onMouseLeave={() => setActiveIdx(null)}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6e6e73', fontSize: 11, fontWeight: 600 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#6e6e73', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} />
          <ReferenceLine y={70} stroke="#3a3a3c" strokeDasharray="4 4" strokeWidth={1.5} />
          <Bar dataKey="confidence" radius={[8, 8, 0, 0]} maxBarSize={56}
            onMouseEnter={(_, i) => setActiveIdx(i)}>
            {DATA.map((entry, i) => (
              <Cell
                key={i}
                fill={ZONE_COLOR[entry.zone]}
                opacity={activeIdx === null || activeIdx === i ? 1 : 0.35}
                style={{ filter: activeIdx === i ? `drop-shadow(0 0 8px ${ZONE_COLOR[entry.zone]}80)` : 'none', transition: 'opacity 0.2s ease' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Bottom note */}
      <div style={{
        marginTop: '12px', padding: '9px 14px', borderRadius: '10px', textAlign: 'center',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        fontSize: '11px', color: '#3a3a3c',
      }}>
        Hover bars for details · Scores above 70% trigger immediate dispatch
      </div>
    </div>
  )
}
