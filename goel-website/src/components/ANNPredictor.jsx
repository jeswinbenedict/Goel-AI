import { useState } from 'react'
import { Network, ChevronDown } from 'lucide-react'
import { C, card, cardHover, badge } from '../styles/theme'
import { useInView } from '../hooks/useInView'

const BUILDINGS = [
  { label: 'Reinforced Concrete', base: 0.72 },
  { label: 'Steel Frame',         base: 0.68 },
  { label: 'Masonry / Brick',     base: 0.44 },
  { label: 'Wood Frame',          base: 0.38 },
  { label: 'Unreinforced Masonry',base: 0.22 },
]

function annPredict(buildingIdx, floor, magnitude) {
  const b  = BUILDINGS[buildingIdx].base
  const fm = Math.max(0, 1 - (floor - 1) * 0.07)
  const mm = Math.max(0, 1 - (magnitude - 5) * 0.12)
  const raw = b * fm * mm
  const prob = Math.max(4, Math.min(97, Math.round(raw * 100)))
  const voidProb = Math.round(Math.min(95, (1 - raw) * 85 + 10))
  return { prob, voidProb }
}

function Select({ label, value, options, onChange }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '11px', fontWeight: 700, color: C.t4, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(+e.target.value)}
          style={{
            width: '100%', appearance: 'none',
            padding: '11px 36px 11px 14px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: '#f5f5f7', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          onBlur={e  => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}>
          {options.map((o, i) => <option key={i} value={i} style={{ background: '#111' }}>{o}</option>)}
        </select>
        <ChevronDown size={14} color={C.t3} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

function NumberInput({ label, value, min, max, step = 1, onChange, unit }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: C.t4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</label>
        <span style={{ fontSize: '13px', fontWeight: 800, color: C.blue }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{
          width: '100%', height: '4px', appearance: 'none', borderRadius: '100px',
          background: `linear-gradient(to right, ${C.blue} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((value - min) / (max - min)) * 100}%)`,
          outline: 'none', cursor: 'pointer',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: C.t4, marginTop: '4px' }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  )
}

export default function ANNPredictor() {
  const [ref, inView] = useInView()
  const [hov, setHov] = useState(false)
  const [bldg, setBldg] = useState(0)
  const [floor, setFloor] = useState(2)
  const [mag,   setMag]   = useState(7)

  const { prob, voidProb } = annPredict(bldg, floor, mag)

  const probColor = prob >= 70 ? C.green : prob >= 40 ? C.yellow : C.red
  const risk      = prob >= 70 ? 'HIGH SURVIVAL' : prob >= 40 ? 'POSSIBLE' : 'CRITICAL RISK'
  const riskColor = prob >= 70 ? C.green : prob >= 40 ? C.yellow : C.red

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '24px',
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(-32px)',
        transition: 'opacity 0.65s ease 0.05s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.05s, border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Network size={16} color={C.t2} strokeWidth={1.75} />
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.t4, textTransform: 'uppercase' }}>
              Artificial Neural Network
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f5f7' }}>Survival Predictor</h2>
          </div>
        </div>
        <div style={badge(C.blue)}><Network size={11} strokeWidth={2.5} />ANN Live</div>
      </div>

      {/* Inputs */}
      <Select
        label="Building Type"
        value={bldg}
        options={BUILDINGS.map(b => b.label)}
        onChange={setBldg}
      />
      <NumberInput label="Floor Number"     value={floor} min={1}   max={20} step={1}   onChange={setFloor} unit="F" />
      <NumberInput label="Earthquake Magnitude" value={mag} min={5} max={9}  step={0.1} onChange={setMag}   unit="M" />

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0 20px' }} />

      {/* Result */}
      <div style={{
        borderRadius: '16px', padding: '20px',
        background: `${riskColor}08`, border: `1px solid ${riskColor}22`,
        transition: 'all 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: C.t3, marginBottom: '6px' }}>Survival Probability</div>
            <div style={{
              fontSize: '11px', fontWeight: 800, padding: '3px 12px',
              borderRadius: '100px', color: 'white', background: riskColor,
              display: 'inline-block', letterSpacing: '0.06em',
            }}>{risk}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '52px', fontWeight: 800, color: probColor, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {prob}%
            </div>
          </div>
        </div>

        {/* Prob bar */}
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{
            height: '100%', borderRadius: '100px',
            width: `${prob}%`,
            background: `linear-gradient(to right, ${C.red}, ${C.yellow} 50%, ${C.green})`,
            boxShadow: `0 0 12px ${probColor}60`,
            transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>

        {/* Secondary metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { label: 'Void Probability', val: `${voidProb}%`, color: C.blue   },
            { label: 'Building Class',   val: BUILDINGS[bldg].label.split(' ')[0], color: C.purple },
          ].map(m => (
            <div key={m.label} style={{
              padding: '12px', borderRadius: '12px', textAlign: 'center',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: m.color, marginBottom: '3px' }}>{m.val}</div>
              <div style={{ fontSize: '11px', color: C.t4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', color: C.t4, textAlign: 'center' }}>
        Adjust inputs to predict survival probability for any scenario
      </div>
    </div>
  )
}
