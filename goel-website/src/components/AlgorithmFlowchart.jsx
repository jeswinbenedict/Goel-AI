import { useState } from 'react'
import { Cpu, Network, GitBranch, Zap, ArrowRight, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react'
import { C, card, cardHover } from '../styles/theme'
import { useInView } from '../hooks/useInView'

const STEPS = [
  {
    id: 'cnn',
    Icon: Cpu,
    color: C.red,
    title: 'CNN',
    full: 'Convolutional Neural Network',
    role: 'Image Analysis',
    desc: 'Processes thermal drone imagery through 5 convolutional layers to detect heat signatures matching human body temperature (36–37°C). Outputs a confidence score and bounding box for each detected anomaly.',
    inputs:  ['Thermal drone imagery', 'RGB aerial photos'],
    outputs: ['Confidence score (0–100%)', 'Bounding box coordinates'],
    accuracy: '94.2%',
    layers: '5 Conv + 3 FC',
  },
  {
    id: 'ann',
    Icon: Network,
    color: C.blue,
    title: 'ANN',
    full: 'Artificial Neural Network',
    role: 'Survival Probability',
    desc: 'Takes structural data (building type, floor, collapse pattern) and seismic parameters to predict survival probability. Uses 3 hidden layers with ReLU activation and dropout regularization.',
    inputs:  ['Building type & floor', 'Earthquake magnitude', 'Time since event'],
    outputs: ['Survival probability %', 'Void space probability'],
    accuracy: '91.7%',
    layers:  '3 Hidden (128→64→32)',
  },
  {
    id: 'fuzzy',
    Icon: GitBranch,
    color: C.yellow,
    title: 'Fuzzy Logic',
    full: 'Fuzzy Inference System',
    role: 'Zone Classification',
    desc: 'Applies 48 IF-THEN rules to merge CNN confidence, ANN survival probability, and signal strength into a crisp zone classification (CRITICAL / MODERATE / LOW). Uses Mamdani inference with centroid defuzzification.',
    inputs:  ['CNN confidence score', 'ANN survival probability', 'Signal strength'],
    outputs: ['Zone: CRITICAL / MODERATE / LOW', 'Composite risk score'],
    accuracy: '48 Rules',
    layers:  'Mamdani FIS',
  },
  {
    id: 'pso',
    Icon: Zap,
    color: C.purple,
    title: 'PSO',
    full: 'Particle Swarm Optimization',
    role: 'Route Optimization',
    desc: 'Deploys 30 particles across the search space to find globally optimal rescue routes. Each particle balances zone priority, travel distance, and team availability. Converges in ~50 iterations.',
    inputs:  ['Zone classifications', 'Team positions', 'Road network graph'],
    outputs: ['Optimal rescue routes', 'Team dispatch order'],
    accuracy: '30 Particles',
    layers:  'w=0.72, c₁=1.5, c₂=2.0',
  },
]

function StepCard({ step, inView, delay, idx, expanded, onToggle }) {
  const [hov, setHov] = useState(false)
  const isLast = idx === STEPS.length - 1

  return (
    <div style={{
      opacity:   inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      flex: 1,
    }}>
      {/* Card */}
      <div
        onClick={onToggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: '100%', padding: '20px',
          borderRadius: '18px', cursor: 'pointer',
          background: hov || expanded ? `${step.color}08` : 'rgba(255,255,255,0.02)',
          border: `1px solid ${expanded ? step.color + '40' : hov ? step.color + '25' : 'rgba(255,255,255,0.07)'}`,
          transition: 'all 0.3s ease',
          boxShadow: expanded ? `0 0 32px ${step.color}15` : 'none',
        }}>

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
            background: `${step.color}15`, border: `1px solid ${step.color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            transform: hov ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
          }}>
            <step.Icon size={20} color={step.color} strokeWidth={1.75} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, padding: '3px 10px',
              borderRadius: '100px', color: step.color,
              background: `${step.color}12`, border: `1px solid ${step.color}20`,
              letterSpacing: '0.06em',
            }}>
              {step.accuracy}
            </div>
            <div style={{
              width: '24px', height: '24px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {expanded
                ? <ChevronUp   size={12} color={C.t4} strokeWidth={2.5} />
                : <ChevronDown size={12} color={C.t4} strokeWidth={2.5} />}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '20px', fontWeight: 800, color: step.color, letterSpacing: '-0.02em', marginBottom: '2px' }}>
          {step.title}
        </div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: C.t3, marginBottom: '4px' }}>{step.full}</div>
        <div style={{
          display: 'inline-flex', fontSize: '10px', fontWeight: 700,
          padding: '2px 8px', borderRadius: '6px',
          background: 'rgba(255,255,255,0.04)', color: C.t4,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {step.role}
        </div>

        {/* Expandable detail */}
        <div style={{
          maxHeight: expanded ? '400px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ paddingTop: '16px' }}>
            <p style={{ fontSize: '12px', color: C.t3, lineHeight: 1.65, marginBottom: '14px' }}>
              {step.desc}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              {/* Inputs */}
              <div style={{
                padding: '12px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: C.t4, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Inputs
                </div>
                {step.inputs.map(inp => (
                  <div key={inp} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '5px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: step.color, flexShrink: 0, marginTop: '5px' }} />
                    <span style={{ fontSize: '11px', color: C.t3, lineHeight: 1.4 }}>{inp}</span>
                  </div>
                ))}
              </div>

              {/* Outputs */}
              <div style={{
                padding: '12px', borderRadius: '12px',
                background: `${step.color}06`, border: `1px solid ${step.color}15`,
              }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: step.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.7 }}>
                  Outputs
                </div>
                {step.outputs.map(out => (
                  <div key={out} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '5px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: step.color, flexShrink: 0, marginTop: '5px' }} />
                    <span style={{ fontSize: '11px', color: C.t2, lineHeight: 1.4 }}>{out}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize: '10px', color: C.t4 }}>Architecture:</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: step.color }}>{step.layers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow connector */}
      {!isLast && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 8px', flexShrink: 0, alignSelf: 'center',
          opacity: inView ? 1 : 0,
          transition: `opacity 0.5s ease ${delay + 0.3}s`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 10px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <ArrowRight size={12} color={C.t4} strokeWidth={2} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function AlgorithmFlowchart() {
  const [ref, inView] = useInView()
  const [hov, setHov] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '28px',
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease, box-shadow 0.35s ease',
      }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: C.t4, textTransform: 'uppercase', marginBottom: '6px' }}>
          System Architecture
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: C.t1, letterSpacing: '-0.02em' }}>
            AI Pipeline Flowchart
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: C.t4 }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.green, animation: 'pulseDot 2s ease-in-out infinite' }} />
            Click any card to expand
          </div>
        </div>

        {/* Pipeline summary bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0',
          marginTop: '16px', padding: '10px 16px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          overflowX: 'auto',
        }}>
          {[
            { label: 'Drone Input', color: '#3a3a3c' },
            { label: '→', color: C.t4, sep: true },
            { label: 'CNN', color: C.red },
            { label: '→', color: C.t4, sep: true },
            { label: 'ANN', color: C.blue },
            { label: '→', color: C.t4, sep: true },
            { label: 'Fuzzy Logic', color: C.yellow },
            { label: '→', color: C.t4, sep: true },
            { label: 'PSO', color: C.purple },
            { label: '→', color: C.t4, sep: true },
            { label: 'Rescue Dispatch', color: C.green },
          ].map((item, i) => (
            <span key={i} style={{
              fontSize: item.sep ? '14px' : '11px',
              fontWeight: item.sep ? 400 : 700,
              color: item.color,
              padding: item.sep ? '0 6px' : '3px 10px',
              borderRadius: item.sep ? 0 : '8px',
              background: item.sep ? 'transparent' : `${item.color}10`,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Cards row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        {STEPS.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            inView={inView}
            delay={i * 0.1}
            idx={i}
            expanded={expanded === step.id}
            onToggle={() => toggle(step.id)}
          />
        ))}
      </div>

      {/* Bottom flow note */}
      <div style={{
        marginTop: '20px', padding: '12px 16px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
      }}>
        {[
          { val: '<18 min', label: 'First detection', color: C.red    },
          { val: '72 hrs',  label: 'Golden window',   color: C.yellow },
          { val: '94.2%',   label: 'CNN accuracy',    color: C.green  },
          { val: '48 rules',label: 'Fuzzy ruleset',   color: C.blue   },
          { val: '30',      label: 'PSO particles',   color: C.purple },
        ].map(m => (
          <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: m.color }}>{m.val}</span>
            <span style={{ fontSize: '11px', color: C.t4 }}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
