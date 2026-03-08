import { useState } from 'react'
import { GitBranch, Sliders, Wifi, WifiOff } from 'lucide-react'
import { C, card, cardHover, badge } from '../styles/theme'
import { useInView } from '../hooks/useInView'
import { api } from '../api/client'

function fuzzyInferLocal(heat, voidProb, signal) {
  const score = (heat * 0.45) + (voidProb * 0.35) + (signal * 0.20)
  if (score >= 78) return { zone: 'CRITICAL', color: C.red,    action: 'Deploy rescue team immediately', confidence: Math.min(98, 78 + score * 0.3) }
  if (score >= 40) return { zone: 'MODERATE', color: C.yellow, action: 'Deploy within 2 hours',          confidence: Math.min(85, 50 + score * 0.4) }
  return               { zone: 'LOW',      color: C.green,  action: 'Remote monitoring assigned',    confidence: Math.max(30, score * 0.6) }
}

function Slider({ label, value, onChange, color, unit = '%' }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: C.t2 }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="range" min={0} max={100} value={value}
          onChange={e => onChange(+e.target.value)}
          style={{
            width: '100%', height: '4px', appearance: 'none',
            background: `linear-gradient(to right, ${color} ${value}%, rgba(255,255,255,0.08) ${value}%)`,
            borderRadius: '100px', outline: 'none', cursor: 'pointer',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: C.t4, marginTop: '4px' }}>
        <span>Low</span><span>High</span>
      </div>
    </div>
  )
}

const ZONE_COLOR = { CRITICAL: C.red, MODERATE: C.yellow, LOW: C.green }

export default function FuzzyTester() {
  const [ref, inView] = useInView()
  const [hov,    setHov]    = useState(false)
  const [heat,   setHeat]   = useState(72)
  const [voidP,  setVoidP]  = useState(65)
  const [signal, setSignal] = useState(55)
  const [result, setResult] = useState(null)
  const [loading,setLoading]= useState(false)
  const [source, setSource] = useState(null) // 'backend' | 'local'

  const score = Math.round((heat * 0.45) + (voidP * 0.35) + (signal * 0.20))

  // derive display result
  const local  = fuzzyInferLocal(heat, voidP, signal)
  const display = result ?? { ...local, survival_score: score }
  const color   = ZONE_COLOR[display.zone] ?? C.yellow

  const handleCompute = async () => {
    setLoading(true)
    try {
      const data = await api.fuzzyScore(heat, voidP, signal)
      setResult({
        zone:           data.zone,
        survival_score: data.survival_score,
        color:          ZONE_COLOR[data.zone] ?? C.yellow,
        action:         local.action,
      })
      setSource('backend')
    } catch {
      setResult(null)
      setSource('local')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '24px',
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(32px)',
        transition: 'opacity 0.65s ease 0.1s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s, border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sliders size={16} color={C.t2} strokeWidth={1.75} />
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: C.t4, textTransform: 'uppercase' }}>
              Interactive Demo
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>Fuzzy Logic Tester</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {source && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '10px', fontWeight: 700,
              color: source === 'backend' ? C.green : C.yellow,
              padding: '3px 10px', borderRadius: '100px',
              background: source === 'backend' ? `${C.green}12` : `${C.yellow}12`,
              border: `1px solid ${source === 'backend' ? C.green : C.yellow}25`,
            }}>
              {source === 'backend'
                ? <><Wifi size={10} strokeWidth={2.5} /> Flask API</>
                : <><WifiOff size={10} strokeWidth={2.5} /> Local</>}
            </div>
          )}
          <div style={badge(C.purple)}>
            <GitBranch size={11} strokeWidth={2.5} />
            Live Inference
          </div>
        </div>
      </div>

      {/* Sliders */}
      <Slider label="🌡 Heat Signature Score" value={heat}   onChange={v => { setHeat(v);   setResult(null); setSource(null) }} color={C.red}    />
      <Slider label="🏚 Void Probability"      value={voidP}  onChange={v => { setVoidP(v);  setResult(null); setSource(null) }} color={C.blue}   />
      <Slider label="📡 Signal Strength"       value={signal} onChange={v => { setSignal(v); setResult(null); setSource(null) }} color={C.purple} />

      {/* Run button */}
      <button
        onClick={handleCompute}
        disabled={loading}
        style={{
          width: '100%', padding: '11px', borderRadius: '12px', marginBottom: '16px',
          background: loading ? 'rgba(191,90,242,0.15)' : `${C.purple}20`,
          border: `1px solid ${C.purple}35`,
          color: C.purple, fontSize: '13px', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = `${C.purple}30` }}
        onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(191,90,242,0.15)' : `${C.purple}20` }}>
        {loading
          ? <><span style={{ width: '13px', height: '13px', borderRadius: '50%', border: `2px solid ${C.purple}40`, borderTopColor: C.purple, display: 'inline-block', animation: 'spinAnim 0.75s linear infinite' }} />Running Flask API...</>
          : <><GitBranch size={13} strokeWidth={2.5} />Run via Flask Backend</>}
      </button>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0 20px' }} />

      {/* Result */}
      <div style={{
        borderRadius: '16px', padding: '20px',
        background: `${color}08`, border: `1px solid ${color}25`,
        transition: 'all 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: C.t3, marginBottom: '6px' }}>Fuzzy Output Zone</div>
            <span style={{
              fontSize: '22px', fontWeight: 800, padding: '4px 16px',
              borderRadius: '100px', color: 'white',
              background: color, letterSpacing: '0.04em',
            }}>{display.zone}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: C.t3, marginBottom: '4px' }}>
              {source === 'backend' ? 'Flask Score' : 'Composite Score'}
            </div>
            <div style={{ fontSize: '42px', fontWeight: 800, color, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {source === 'backend'
                ? Math.round(display.survival_score)
                : score}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div style={{
          width: '100%', height: '6px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '100px', overflow: 'hidden', marginBottom: '14px',
        }}>
          <div style={{
            height: '100%', borderRadius: '100px',
            width: `${source === 'backend' ? display.survival_score : score}%`,
            background: `linear-gradient(to right, ${C.green}, ${C.yellow} 40%, ${C.red})`,
            boxShadow: `0 0 12px ${color}60`,
            transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>

        {/* Weights breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '14px' }}>
          {[
            { label: 'Heat ×0.45',   val: Math.round(heat   * 0.45), color: C.red    },
            { label: 'Void ×0.35',   val: Math.round(voidP  * 0.35), color: C.blue   },
            { label: 'Signal ×0.20', val: Math.round(signal * 0.20), color: C.purple },
          ].map(w => (
            <div key={w.label} style={{
              textAlign: 'center', padding: '10px 8px', borderRadius: '12px',
              background: `${w.color}08`, border: `1px solid ${w.color}18`,
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: w.color }}>{w.val}</div>
              <div style={{ fontSize: '10px', color: C.t4, marginTop: '2px' }}>{w.label}</div>
            </div>
          ))}
        </div>

        {/* Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span className="anim-pulse-dot" style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: color, display: 'inline-block', flexShrink: 0,
          }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color }}>
            {display.action ?? local.action}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', color: C.t4, textAlign: 'center' }}>
        Drag sliders → click <strong style={{ color: C.purple }}>Run via Flask Backend</strong> to call real API
      </div>
    </div>
  )
}
