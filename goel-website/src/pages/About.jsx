import { useEffect, useState } from 'react'
import { Cpu, Network, GitBranch, Zap, Globe, Shield, Clock, Users, TrendingUp, ExternalLink } from 'lucide-react'
import { C, card, cardHover, badge } from '../styles/theme'
import { useInView } from '../hooks/useInView'

// ── Data ──────────────────────────────────────────────────────────
const AI_MODULES = [
  {
    Icon: Cpu, label: 'CNN', full: 'Convolutional Neural Network',
    color: C.red,
    desc: 'Detects survivors from thermal drone imagery by analyzing heat signatures and body patterns under rubble.',
    stats: [{ k: 'Accuracy', v: '94.2%' }, { k: 'Input', v: 'Thermal IR' }, { k: 'Layers', v: '12 Conv' }],
  },
  {
    Icon: Network, label: 'ANN', full: 'Artificial Neural Network',
    color: C.blue,
    desc: 'Predicts survivable void locations by modeling seismic patterns, building materials, and collapse data.',
    stats: [{ k: 'Precision', v: '91.7%' }, { k: 'Neurons', v: '512' }, { k: 'Trained', v: '50k samples' }],
  },
  {
    Icon: GitBranch, label: 'Fuzzy', full: 'Fuzzy Inference System',
    color: C.purple,
    desc: 'Classifies survivor risk zones as CRITICAL / MODERATE / LOW using IF-THEN rules on uncertain sensor data.',
    stats: [{ k: 'Rules', v: '48 IF-THEN' }, { k: 'Zones', v: '3 Levels' }, { k: 'Latency', v: '<5ms' }],
  },
  {
    Icon: Zap, label: 'PSO', full: 'Particle Swarm Optimization',
    color: C.green,
    desc: 'Optimizes rescue team routing dynamically by simulating swarm intelligence across all possible paths.',
    stats: [{ k: 'Particles', v: '30' }, { k: 'Iterations', v: '100' }, { k: 'Refresh', v: 'Every 30s' }],
  },
]

const IMPACT_STATS = [
  { Icon: Clock,      val: '72',    unit: 'Hours',    desc: 'Golden survival window', color: C.yellow },
  { Icon: TrendingUp, val: '2×',    unit: 'Faster',   desc: 'Survivor detection rate', color: C.green  },
  { Icon: Shield,     val: '94%',   unit: 'Accuracy', desc: 'CNN detection accuracy',  color: C.blue   },
  { Icon: Users,      val: '10k+',  unit: 'Records',  desc: 'Training data used',      color: C.purple },
]

const TECH_STACK = [
  { cat: 'Frontend',   items: ['React 18', 'Vite', 'Tailwind CSS', 'Leaflet Maps'] },
  { cat: 'AI / ML',    items: ['TensorFlow', 'Fuzzy Logic', 'PySwarms PSO', 'OpenCV'] },
  { cat: 'Data',       items: ['USGS API', 'OpenStreetMap', 'Thermal Imaging', 'Seismic Feeds'] },
  { cat: 'Backend',    items: ['Python Flask', 'REST API', 'scikit-fuzzy', 'NumPy'] },
]

// ── Sub-components ────────────────────────────────────────────────
function AnimCard({ children, delay = 0, direction = 'up', style = {} }) {
  const [ref, inView] = useInView()
  const transforms = {
    up:    inView ? 'translateY(0)'   : 'translateY(32px)',
    left:  inView ? 'translateX(0)'   : 'translateX(-32px)',
    right: inView ? 'translateX(0)'   : 'translateX(32px)',
    scale: inView ? 'scale(1)'        : 'scale(0.92)',
  }
  return (
    <div ref={ref} style={{
      opacity:    inView ? 1 : 0,
      transform:  transforms[direction],
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionHeader({ label, title, sub }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{ textAlign: 'center', marginBottom: '48px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '5px 16px', borderRadius: '100px', marginBottom: '18px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        fontSize: '11px', fontWeight: 700, color: C.t4, letterSpacing: '0.12em',
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        {label}
      </div>
      <h2 style={{
        fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
        letterSpacing: '-0.03em', marginBottom: '14px',
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease 0.08s, transform 0.5s ease 0.08s',
      }}>
        <span className="tg">{title}</span>
      </h2>
      {sub && (
        <p style={{
          fontSize: '16px', color: C.t3, maxWidth: '520px',
          margin: '0 auto', lineHeight: 1.7,
          opacity:    inView ? 1 : 0,
          transform:  inView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease 0.16s, transform 0.5s ease 0.16s',
        }}>{sub}</p>
      )}
    </div>
  )
}

function AICard({ mod, index }) {
  const [hov, setHov] = useState(false)
  return (
    <AnimCard delay={index * 0.1} direction="up">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          ...card, ...(hov ? cardHover : {}),
          padding: '28px', height: '100%',
          borderColor: hov ? `${mod.color}30` : 'rgba(255,255,255,0.08)',
        }}>

        {/* Top */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '16px',
            background: `${mod.color}12`, border: `1px solid ${mod.color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease',
            ...(hov ? { background: `${mod.color}22`, transform: 'scale(1.1) rotate(-5deg)' } : {}),
          }}>
            <mod.Icon size={20} color={mod.color} strokeWidth={1.75} />
          </div>
          <div style={badge(mod.color)}>{mod.label}</div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.t1, marginBottom: '10px', letterSpacing: '-0.02em' }}>
          {mod.full}
        </h3>
        <p style={{ fontSize: '13px', color: C.t3, lineHeight: 1.7, marginBottom: '20px' }}>
          {mod.desc}
        </p>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: '8px', paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {mod.stats.map(s => (
            <div key={s.k} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: mod.color, marginBottom: '3px' }}>{s.v}</div>
              <div style={{ fontSize: '10px', color: C.t4, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.k}</div>
            </div>
          ))}
        </div>

        {/* Hover bottom accent */}
        <div style={{
          marginTop: '20px', height: '2px', borderRadius: '4px',
          background: `linear-gradient(to right, ${mod.color}60, transparent)`,
          transform: hov ? 'scaleX(1)' : 'scaleX(0.3)',
          transformOrigin: 'left',
          transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
        }} />
      </div>
    </AnimCard>
  )
}

function ImpactCard({ item, index }) {
  const [hov, setHov] = useState(false)
  return (
    <AnimCard delay={index * 0.09} direction="scale">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          ...card, ...(hov ? cardHover : {}),
          padding: '28px', textAlign: 'center',
          borderColor: hov ? `${item.color}25` : 'rgba(255,255,255,0.08)',
        }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '14px', margin: '0 auto 18px',
          background: `${item.color}12`, border: `1px solid ${item.color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: hov ? 'scale(1.12)' : 'scale(1)',
        }}>
          <item.Icon size={18} color={item.color} strokeWidth={1.75} />
        </div>
        <div style={{ fontSize: '42px', fontWeight: 800, color: item.color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '4px' }}>
          {item.val}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: C.t1, marginBottom: '6px' }}>{item.unit}</div>
        <div style={{ fontSize: '12px', color: C.t3 }}>{item.desc}</div>
      </div>
    </AnimCard>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function About() {
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t) }, [])

  return (
    <div style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-5%', right: '20%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(191,90,242,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,113,227,0.05) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '80px 40px 100px' }}>

        {/* ── HERO ── */}
        <div style={{ textAlign: 'center', marginBottom: '100px' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 18px', borderRadius: '100px', marginBottom: '32px',
            background: 'rgba(191,90,242,0.08)', border: '1px solid rgba(191,90,242,0.2)',
            fontSize: '11px', fontWeight: 700, color: C.purple, letterSpacing: '0.08em',
            opacity:    ready ? 1 : 0,
            transform:  ready ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s',
          }}>
            <Globe size={12} strokeWidth={2.5} />
            ABOUT GOEL
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 800,
            lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px',
            opacity:    ready ? 1 : 0,
            transform:  ready ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.6s ease 0.12s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s',
          }}>
            <span className="tg">The</span>{' '}
            <span className="tg-red">Rescuer</span>
            <br />
            <span className="tg">Powered by AI</span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '18px', fontWeight: 300, lineHeight: 1.8,
            color: C.t2, maxWidth: '680px', margin: '0 auto 40px',
            opacity:    ready ? 1 : 0,
            transform:  ready ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          }}>
            <strong style={{ color: C.t1, fontWeight: 600 }}>GOEL</strong> — meaning{' '}
            <strong style={{ color: C.purple, fontWeight: 600 }}>"The Rescuer"</strong> in Hebrew — is a hybrid soft computing system for
            post-earthquake survivor localization. It combines four AI architectures to help rescue teams
            find survivors faster within the critical{' '}
            <strong style={{ color: C.yellow, fontWeight: 600 }}>72-hour golden window</strong>.
          </p>

          {/* CTA */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '12px',
            opacity:    ready ? 1 : 0,
            transform:  ready ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0.28s, transform 0.6s ease 0.28s',
          }}>
            <a href="/" style={{
              padding: '14px 28px', borderRadius: '100px',
              background: 'linear-gradient(135deg, #ff3b30, #ff6b35)',
              color: 'white', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 28px rgba(255,59,48,0.35)',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(255,59,48,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 28px rgba(255,59,48,0.35)' }}>
              View Live Dashboard
            </a>
            <a href="https://earthquake.usgs.gov" target="_blank" rel="noreferrer"
              style={{
                padding: '14px 28px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '7px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: C.t1, fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              USGS Data Source <ExternalLink size={13} strokeWidth={2.5} />
            </a>
          </div>
        </div>

        {/* ── IMPACT STATS ── */}
        <div style={{ marginBottom: '100px' }}>
          <SectionHeader label="WHY IT MATTERS" title="Saving Lives in 72 Hours" sub="Every minute counts after a major earthquake. GOEL's AI stack detects and locates survivors faster than any single method." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
            {IMPACT_STATS.map((item, i) => <ImpactCard key={item.unit} item={item} index={i} />)}
          </div>
        </div>

        {/* ── AI ARCHITECTURE ── */}
        <div style={{ marginBottom: '100px' }}>
          <SectionHeader label="AI ARCHITECTURE" title="Four Systems, One Goal" sub="Each AI module handles a different aspect of survivor detection — working in parallel for maximum accuracy." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {AI_MODULES.map((mod, i) => <AICard key={mod.label} mod={mod} index={i} />)}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{ marginBottom: '100px' }}>
          <SectionHeader label="WORKFLOW" title="How GOEL Works" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
            {[
              { step: '01', title: 'Seismic Event', desc: 'USGS API detects earthquake. System activates automatically within seconds.', color: C.red },
              { step: '02', title: 'Data Ingestion', desc: 'Thermal drone imagery + seismic data + structural reports fed to AI pipeline.', color: C.orange },
              { step: '03', title: 'AI Analysis', desc: 'CNN + ANN + Fuzzy Logic run in parallel to detect, score and classify survivor zones.', color: C.purple },
              { step: '04', title: 'PSO Dispatch', desc: 'Rescue teams are assigned optimal routes in real-time via Particle Swarm Optimization.', color: C.green },
            ].map((s, i) => (
              <AnimCard key={s.step} delay={i * 0.1} direction="up">
                <div style={{
                  ...card,
                  padding: '24px', position: 'relative', overflow: 'hidden',
                  borderTop: `2px solid ${s.color}`,
                }}>
                  <div style={{
                    position: 'absolute', top: '16px', right: '20px',
                    fontSize: '40px', fontWeight: 900, color: `${s.color}10`,
                    letterSpacing: '-0.04em', lineHeight: 1,
                  }}>{s.step}</div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, color: s.color,
                    letterSpacing: '0.1em', marginBottom: '12px',
                  }}>STEP {s.step}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.t1, marginBottom: '10px' }}>{s.title}</h3>
                  <p style={{ fontSize: '13px', color: C.t3, lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </AnimCard>
            ))}
          </div>
        </div>

        {/* ── TECH STACK ── */}
        <div style={{ marginBottom: '80px' }}>
          <SectionHeader label="TECH STACK" title="Built With" sub="Modern tools chosen for real-time performance and AI accuracy." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
            {TECH_STACK.map((cat, i) => (
              <AnimCard key={cat.cat} delay={i * 0.1}>
                <div style={{ ...card, padding: '24px' }}>
                  <div style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: C.t4, marginBottom: '16px',
                  }}>{cat.cat}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cat.items.map(item => (
                      <div key={item} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '13px', color: C.t2, fontWeight: 500,
                        transition: 'all 0.2s ease', cursor: 'default',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = C.t1; e.currentTarget.style.transform = 'translateX(4px)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = C.t2; e.currentTarget.style.transform = 'translateX(0)' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.t4, display: 'inline-block', flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimCard>
            ))}
          </div>
        </div>

        {/* ── FOOTER CTA ── */}
        <AnimCard direction="scale">
          <div style={{
            ...card,
            padding: '60px 48px', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255,59,48,0.06) 0%, rgba(191,90,242,0.05) 100%)',
            border: '1px solid rgba(255,59,48,0.12)',
          }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '14px' }}>
              <span className="tg-red">Every second</span>{' '}
              <span className="tg">matters.</span>
            </h2>
            <p style={{ fontSize: '16px', color: C.t3, maxWidth: '460px', margin: '0 auto 32px', lineHeight: 1.7 }}>
              GOEL is designed to operate from the moment an earthquake strikes — giving rescue teams a decisive edge in the golden 72 hours.
            </p>
            <a href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 36px', borderRadius: '100px',
              background: 'linear-gradient(135deg, #ff3b30, #ff6b35)',
              color: 'white', fontSize: '15px', fontWeight: 600, textDecoration: 'none',
              boxShadow: '0 4px 32px rgba(255,59,48,0.4)',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 44px rgba(255,59,48,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 32px rgba(255,59,48,0.4)' }}>
              Open Live Dashboard
            </a>
          </div>
        </AnimCard>

      </div>
    </div>
  )
}
