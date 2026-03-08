import { useState } from 'react'
import { Upload, X, ScanLine, Cpu, Wifi, WifiOff } from 'lucide-react'
import { C, card, cardHover, badge, label } from '../styles/theme'
import { useInView } from '../hooks/useInView'
import { api } from '../api/client'

const ZONE_COLOR = { CRITICAL: C.red, MODERATE: C.yellow, LOW: C.green }

export default function ThermalUploader() {
  const [file,      setFile]      = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [result,    setResult]    = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [drag,      setDrag]      = useState(false)
  const [hov,       setHov]       = useState(false)
  const [source,    setSource]    = useState(null)
  const [ref, inView] = useInView()

  const load = (f) => {
    if (!f) return
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setSource(null)
  }

  const analyze = async () => {
    setAnalyzing(true)
    try {
      // Try Flask backend first
      const data = await api.analyzeThermal()
      setResult({
        survivors:  data.survivors_detected,
        confidence: data.confidence,
        heat:       data.heat_signature,
        zone:       data.zone,
        ms:         data.processing_time_ms,
      })
      setSource('backend')
    } catch {
      // Fallback to local simulation
      await new Promise(r => setTimeout(r, 2800))
      const c = +(75 + Math.random() * 22).toFixed(1)
      setResult({
        survivors:  Math.floor(Math.random() * 3) + 1,
        confidence: c,
        heat:       (34 + Math.random() * 4).toFixed(1),
        zone:       c > 85 ? 'CRITICAL' : c > 70 ? 'MODERATE' : 'LOW',
        ms:         Math.floor(200 + Math.random() * 600),
      })
      setSource('local')
    } finally {
      setAnalyzing(false)
    }
  }

  const reset = () => { setFile(null); setPreview(null); setResult(null); setSource(null) }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '24px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.55s ease 0.05s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s, border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      <span style={label}>Convolutional Neural Network</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ScanLine size={16} color={C.t2} strokeWidth={1.75} />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.t1 }}>Thermal Analysis</h2>
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
                : <><WifiOff size={10} strokeWidth={2.5} /> Simulated</>}
            </div>
          )}
          <div style={badge(C.blue)}>
            <Cpu size={11} strokeWidth={2.5} />
            CNN Powered
          </div>
        </div>
      </div>

      {!preview ? (
        <label
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); load(e.dataTransfer.files[0]) }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '48px 24px', borderRadius: '16px',
            cursor: 'pointer', textAlign: 'center',
            background: drag ? 'rgba(255,59,48,0.05)' : 'rgba(255,255,255,0.02)',
            border: `2px dashed ${drag ? 'rgba(255,59,48,0.4)' : 'rgba(255,255,255,0.08)'}`,
            transition: 'all 0.3s ease',
          }}>
          <div style={{ marginBottom: '16px', animation: 'floatUp 3.5s ease-in-out infinite' }}>
            <Upload size={32} color={drag ? C.red : C.t4} strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: C.t1, marginBottom: '6px' }}>
            Drop thermal image here
          </p>
          <p style={{ fontSize: '12px', color: C.t3 }}>or click to browse · JPG, PNG, TIFF</p>
          <input type="file" accept="image/*" onChange={e => load(e.target.files[0])} style={{ display: 'none' }} />
        </label>
      ) : (
        <div>
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', height: '200px' }}>
            <img src={preview} alt="Thermal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
            <button onClick={reset} style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,48,0.5)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}>
              <X size={13} color="white" strokeWidth={2.5} />
            </button>
            <div style={{ position: 'absolute', bottom: '10px', left: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
              {file?.name}
            </div>
          </div>

          {!result && (
            <button
              onClick={analyze} disabled={analyzing}
              style={{
                width: '100%', padding: '15px', borderRadius: '14px',
                background: analyzing ? 'rgba(255,59,48,0.2)' : 'linear-gradient(135deg, #ff3b30, #ff6b35)',
                color: 'white', fontSize: '14px', fontWeight: 600, border: 'none',
                boxShadow: analyzing ? 'none' : '0 4px 28px rgba(255,59,48,0.4)',
                cursor: analyzing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              }}
              onMouseEnter={e => { if (!analyzing) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(255,59,48,0.55)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = analyzing ? 'none' : '0 4px 28px rgba(255,59,48,0.4)' }}>
              {analyzing ? (
                <>
                  <span style={{
                    width: '16px', height: '16px', borderRadius: '50%', display: 'inline-block',
                    border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white',
                    animation: 'spinAnim 0.75s linear infinite',
                  }} />
                  Analyzing via Flask CNN...
                </>
              ) : 'Detect Survivors with CNN'}
            </button>
          )}

          {result && (
            <div style={{
              borderRadius: '16px', padding: '20px',
              background: `${C.green}07`, border: `1px solid ${C.green}22`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.green, display: 'inline-block' }} />
                <p style={{ fontSize: '13px', fontWeight: 600, color: C.green }}>
                  Analysis Complete — {result.ms}ms
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { lbl: 'Survivors',  val: result.survivors,        color: C.red     },
                  { lbl: 'Confidence', val: `${result.confidence}%`, color: C.orange  },
                  { lbl: 'Heat Sig.',  val: `${result.heat}°C`,      color: '#ff6b35' },
                  { lbl: 'Zone',       val: result.zone,             color: ZONE_COLOR[result.zone] },
                ].map(item => (
                  <div key={item.lbl} style={{
                    padding: '14px', borderRadius: '12px', textAlign: 'center',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: item.color, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                      {item.val}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: C.t3 }}>{item.lbl}</div>
                  </div>
                ))}
              </div>
              <button onClick={reset} style={{
                width: '100%', padding: '10px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: C.t3, fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C.t1; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
                Upload another image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
