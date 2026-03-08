import { useEffect, useState } from 'react'
import { Cpu, Zap, Network, GitBranch, Satellite, Activity, ArrowDown } from 'lucide-react'
import { C } from '../styles/theme'
import { useInView, useParallax } from '../hooks/useInView'
import StatsDashboard     from '../components/StatsDashboard'
import RescueMap          from '../components/RescueMap'
import FuzzyZoneCard      from '../components/FuzzyZoneCard'
import ThermalUploader    from '../components/ThermalUploader'
import EarthquakeFeed     from '../components/EarthquakeFeed'
import SurvivorPanel      from '../components/SurvivorPanel'
import RouteOptimizer     from '../components/RouteOptimizer'
import CountdownTimer     from '../components/CountdownTimer'
import RescueProgress     from '../components/RescueProgress'
import SeismicChart       from '../components/SeismicChart'
import FuzzyTester        from '../components/FuzzyTester'
import SurvivorTimeline   from '../components/SurvivorTimeline'
import CNNConfidenceChart from '../components/CNNConfidenceChart'
import PSOVisualizer      from '../components/PSOVisualizer'
import ANNPredictor       from '../components/ANNPredictor'
import ExportReport       from '../components/ExportReport'
import AlgorithmFlowchart from '../components/AlgorithmFlowchart'

const AI_MODULES = [
  { Icon: Cpu,       label: 'CNN',         status: 'Online',    color: C.green },
  { Icon: Network,   label: 'ANN',         status: 'Online',    color: C.green },
  { Icon: GitBranch, label: 'Fuzzy Logic', status: 'Active',    color: C.green },
  { Icon: Zap,       label: 'PSO',         status: 'Running',   color: C.green },
  { Icon: Satellite, label: 'USGS',        status: 'Streaming', color: C.blue  },
]

function SectionLabel({ title }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '12px 0',
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
      <span style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: C.t4, whiteSpace: 'nowrap',
      }}>
        {title}
      </span>
      <div style={{
        height: '1px', flex: 1, transformOrigin: 'left',
        background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)',
        transform:  inView ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
      }} />
    </div>
  )
}

export default function Home() {
  const [ready, setReady] = useState(false)
  const parallax = useParallax(0.2)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Background Orbs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '30%',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,59,48,0.07) 0%, transparent 70%)',
          transform: `translateY(${parallax * 0.5}px)`,
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,113,227,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '5%',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(191,90,242,0.04) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1280px', margin: '0 auto',
        padding: '88px 40px 80px',
        transform: `translateY(${parallax}px)`,
      }}>

        {/* Alert pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 18px', borderRadius: '100px', marginBottom: '44px',
          background: 'rgba(255,59,48,0.07)',
          border: '1px solid rgba(255,59,48,0.2)',
          fontSize: '11px', fontWeight: 700, color: C.red,
          letterSpacing: '0.07em',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.05s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s',
        }}>
          <span className="anim-pulse-dot" style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: C.red, display: 'inline-block', flexShrink: 0,
          }} />
          OPERATION TOKYO-EQ-2026 — ACTIVE EMERGENCY
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(52px, 8vw, 100px)', fontWeight: 800,
          lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '24px',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease 0.12s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s',
        }}>
          <span className="tg">Post-Earthquake</span>
          <br />
          <span className="tg-red">Survivor</span>
          <span className="tg"> Localization</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px', fontWeight: 300, lineHeight: 1.75,
          color: C.t2, maxWidth: '580px', marginBottom: '48px',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s',
        }}>
          A hybrid AI system combining{' '}
          <strong style={{ color: C.t1, fontWeight: 500 }}>CNN · ANN · Fuzzy Logic · PSO</strong>
          {' '}to detect survivors in the{' '}
          <strong style={{ color: C.yellow, fontWeight: 600 }}>golden 72 hours</strong> after a disaster.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '60px', flexWrap: 'wrap',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease 0.28s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.28s',
        }}>
          <a href="#dashboard" style={{
            padding: '15px 32px', borderRadius: '100px',
            background: 'linear-gradient(135deg, #ff3b30, #ff6b35)',
            color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 4px 30px rgba(255,59,48,0.4)',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,59,48,0.55)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 30px rgba(255,59,48,0.4)' }}>
            View Live Dashboard
            <ArrowDown size={14} strokeWidth={2.5} />
          </a>
          <a href="https://earthquake.usgs.gov" target="_blank" rel="noreferrer" style={{
            padding: '15px 32px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: C.t1, fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            USGS Live Feed
          </a>
        </div>

        {/* AI Module Pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px',
          opacity:   ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease 0.36s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.36s',
        }}>
          {AI_MODULES.map(({ Icon, label, status, color }) => (
            <div key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.25s ease', cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <Icon size={13} color={color} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: C.t2 }}>{label}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color }}>{status}</span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{
          marginTop: '60px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          opacity:   ready ? 1 : 0,
          transition: 'opacity 0.6s ease 0.55s',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: C.t4, letterSpacing: '0.1em' }}>SCROLL</span>
          <div className="anim-float">
            <ArrowDown size={14} color={C.t4} strokeWidth={2} />
          </div>
        </div>
      </section>

      {/* ── Separator ── */}
      <div id="dashboard" style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 40px',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* ── Dashboard ── */}
      <main style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1280px', margin: '0 auto',
        padding: '40px 40px 100px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>

        {/* ── Stats ── */}
        <StatsDashboard />

        {/* ── Live Operations ── */}
        <SectionLabel title="Live Operations" />
        <div id="section-map" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <RescueMap />
          <FuzzyZoneCard />
        </div>

        {/* ── Mission Status ── */}
        <SectionLabel title="Mission Status" />
        <div id="section-mission" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <CountdownTimer />
          <RescueProgress />
        </div>

        {/* ── Field Intelligence ── */}
        <SectionLabel title="Field Intelligence" />
        <div id="section-field" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <SurvivorPanel />
          <RouteOptimizer />
        </div>

        {/* ── AI Analysis & Seismic ── */}
        <SectionLabel title="AI Analysis & Seismic Data" />
        <div id="section-seismic" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <ThermalUploader />
          <EarthquakeFeed />
        </div>

        {/* ── Live Diagnostics ── */}
        <SectionLabel title="Live Diagnostics" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <SeismicChart />
          <FuzzyTester />
        </div>

        {/* ── AI Model Visualizers ── */}
        <SectionLabel title="AI Model Visualizers" />
        <div id="section-ai" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <CNNConfidenceChart />
          <ANNPredictor />
        </div>

        {/* ── PSO Full Width ── */}
        <SectionLabel title="Swarm Optimization Live" />
        <div id="section-pso">
          <PSOVisualizer />
        </div>

        {/* ── Algorithm Flowchart ── */}
        <SectionLabel title="AI Pipeline Architecture" />
        <div id="section-flowchart">
          <AlgorithmFlowchart />
        </div>

        {/* ── Mission Report + Timeline ── */}
        <SectionLabel title="Mission Report & Timeline" />
        <div id="section-timeline" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
          <ExportReport />
          <SurvivorTimeline />
        </div>

        {/* ── Footer ── */}
        <div style={{
          paddingTop: '36px', marginTop: '8px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="anim-glow" style={{
              width: '28px', height: '28px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ff3b30, #ff6b35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={13} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: C.t4 }}>GOEL v1.0</span>
          </div>
          <p style={{ fontSize: '12px', color: '#222' }}>
            CNN · ANN · Fuzzy Logic · PSO · USGS · OpenStreetMap
          </p>
        </div>
      </main>
    </div>
  )
}
