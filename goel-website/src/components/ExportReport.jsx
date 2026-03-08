import { useState } from 'react'
import { FileText, Download, CheckCircle2 } from 'lucide-react'
import { C, card, cardHover } from '../styles/theme'
import { useInView } from '../hooks/useInView'
import jsPDF from 'jspdf'

const REPORT_DATA = {
  operation: 'TOKYO-EQ-2026',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  time: new Date().toLocaleTimeString(),
  magnitude: 7.2, depth: '12km', epicenter: 'Tokyo, Japan',
  survivors: 14, rescued: 7, teams: 6, zones: 3,
  models: ['CNN (94.2%)', 'ANN (91.7%)', 'Fuzzy Logic (48 rules)', 'PSO (30 particles)'],
  survivors_list: [
    { id: 1, zone: 'CRITICAL', conf: 94, loc: 'Block A · F2', status: 'Rescued' },
    { id: 2, zone: 'CRITICAL', conf: 88, loc: 'Block C · F1', status: 'Rescued' },
    { id: 3, zone: 'MODERATE', conf: 72, loc: 'Block B · F3', status: 'Active'  },
    { id: 4, zone: 'MODERATE', conf: 65, loc: 'Block D · F1', status: 'Active'  },
    { id: 5, zone: 'LOW',      conf: 43, loc: 'Block E · GF', status: 'Pending' },
  ],
}

export default function ExportReport() {
  const [ref, inView]   = useInView()
  const [hov, setHov]   = useState(false)
  const [gen, setGen]   = useState(false)
  const [done, setDone] = useState(false)

  const generate = async () => {
    setGen(true)
    await new Promise(r => setTimeout(r, 1200))

    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const W = 210, M = 18

    // Background
    doc.setFillColor(8, 8, 12)
    doc.rect(0, 0, W, 297, 'F')

    // Header bar
    doc.setFillColor(255, 59, 48)
    doc.rect(0, 0, W, 22, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(255, 255, 255)
    doc.text('GOEL — POST-EARTHQUAKE RESCUE OPERATION REPORT', M, 14)

    // Operation title
    doc.setFontSize(22)
    doc.setTextColor(245, 245, 247)
    doc.text(`Operation: ${REPORT_DATA.operation}`, M, 40)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(110, 110, 115)
    doc.text(`Generated: ${REPORT_DATA.date} at ${REPORT_DATA.time}`, M, 48)

    // Divider
    doc.setDrawColor(255, 59, 48, 0.4)
    doc.setLineWidth(0.3)
    doc.line(M, 54, W - M, 54)

    // Seismic info
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(255, 59, 48)
    doc.text('SEISMIC EVENT', M, 63)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(161, 161, 166)
    const seismic = [
      `Magnitude: M${REPORT_DATA.magnitude}   Depth: ${REPORT_DATA.depth}   Epicenter: ${REPORT_DATA.epicenter}`,
    ]
    doc.text(seismic, M, 71)

    // Stats grid
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(255, 59, 48)
    doc.text('OPERATION STATISTICS', M, 84)

    const stats = [
      ['Survivors Detected', REPORT_DATA.survivors],
      ['Survivors Rescued',  REPORT_DATA.rescued],
      ['Active Teams',       REPORT_DATA.teams],
      ['Critical Zones',     REPORT_DATA.zones],
    ]
    stats.forEach(([lbl, val], i) => {
      const x = M + (i % 2) * 88
      const y = 93 + Math.floor(i / 2) * 18
      doc.setFillColor(30, 30, 40)
      doc.roundedRect(x, y - 6, 80, 14, 3, 3, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(255, 59, 48)
      doc.text(String(val), x + 6, y + 3)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(110, 110, 115)
      doc.text(lbl, x + 22, y + 3)
    })

    // AI Models
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(255, 59, 48)
    doc.text('AI MODELS DEPLOYED', M, 136)

    REPORT_DATA.models.forEach((m, i) => {
      doc.setFillColor(20, 20, 30)
      doc.roundedRect(M, 142 + i * 11, W - M * 2, 9, 2, 2, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(161, 161, 166)
      doc.text(`✓  ${m}`, M + 4, 148 + i * 11)
    })

    // Survivors table
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(255, 59, 48)
    doc.text('SURVIVOR DETECTION LOG', M, 196)

    const headers = ['ID', 'Location', 'Zone', 'Confidence', 'Status']
    const colX = [M, M + 12, M + 64, M + 96, M + 124]
    doc.setFontSize(8)
    doc.setTextColor(58, 58, 60)
    headers.forEach((h, i) => doc.text(h, colX[i], 204))
    doc.setDrawColor(58, 58, 60)
    doc.line(M, 206, W - M, 206)

    REPORT_DATA.survivors_list.forEach((s, i) => {
      const y = 213 + i * 11
      doc.setFillColor(i % 2 === 0 ? 14 : 18, i % 2 === 0 ? 14 : 18, i % 2 === 0 ? 20 : 26)
      doc.rect(M, y - 5, W - M * 2, 10, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(161, 161, 166)
      doc.text(`#${s.id}`,      colX[0], y)
      doc.text(s.loc,           colX[1], y)
      doc.text(s.zone,          colX[2], y)
      doc.text(`${s.conf}%`,    colX[3], y)
      const sc = s.status === 'Rescued' ? [48,209,88] : s.status === 'Active' ? [255,214,10] : [110,110,115]
      doc.setTextColor(sc[0], sc[1], sc[2])
      doc.text(s.status, colX[4], y)
    })

    // Footer
    doc.setFillColor(20, 20, 28)
    doc.rect(0, 280, W, 17, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(58, 58, 60)
    doc.text('GOEL v1.0 — CNN · ANN · Fuzzy Logic · PSO · USGS API · OpenStreetMap', M, 291)
    doc.text(`Page 1 of 1`, W - M - 16, 291)

    doc.save(`GOEL_Report_${REPORT_DATA.operation}.pdf`)
    setGen(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card, ...(hov ? cardHover : {}), padding: '28px',
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease 0.15s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s, border-color 0.35s ease, box-shadow 0.35s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: '20px',
      }}>

      <div style={{
        width: '56px', height: '56px', borderRadius: '18px',
        background: done ? `${C.green}15` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${done ? C.green + '30' : 'rgba(255,255,255,0.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.4s ease',
      }}>
        {done
          ? <CheckCircle2 size={24} color={C.green} strokeWidth={1.75} />
          : <FileText     size={24} color={C.t3}    strokeWidth={1.75} />}
      </div>

      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f5f7', marginBottom: '8px' }}>
          {done ? 'Report Downloaded!' : 'Export Rescue Report'}
        </h2>
        <p style={{ fontSize: '13px', color: C.t3, lineHeight: 1.6, maxWidth: '260px' }}>
          {done
            ? `GOEL_Report_${REPORT_DATA.operation}.pdf saved successfully`
            : 'Generate a professional PDF with all survivor data, AI scores, and operation stats'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
        {[
          { label: 'Survivors', val: REPORT_DATA.survivors, color: C.red    },
          { label: 'Rescued',   val: REPORT_DATA.rescued,   color: C.green  },
          { label: 'Teams',     val: REPORT_DATA.teams,     color: C.yellow },
          { label: 'Zones',     val: REPORT_DATA.zones,     color: C.orange },
        ].map(s => (
          <div key={s.label} style={{
            padding: '12px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.val}</div>
            <div style={{ fontSize: '11px', color: C.t4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={generate} disabled={gen}
        style={{
          width: '100%', padding: '16px', borderRadius: '14px',
          background: done
            ? `linear-gradient(135deg, ${C.green}, #00c46a)`
            : gen
              ? 'rgba(255,59,48,0.2)'
              : 'linear-gradient(135deg, #ff3b30, #ff6b35)',
          color: 'white', fontSize: '14px', fontWeight: 700,
          border: 'none', cursor: gen ? 'not-allowed' : 'pointer',
          boxShadow: gen || done ? 'none' : '0 4px 28px rgba(255,59,48,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => { if (!gen) { e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)' } }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)' }}>
        {gen ? (
          <>
            <span className="anim-spin" style={{
              width: '16px', height: '16px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white',
              display: 'inline-block',
            }} />
            Generating PDF...
          </>
        ) : done ? (
          <><CheckCircle2 size={16} strokeWidth={2.5} /> Downloaded!</>
        ) : (
          <><Download size={16} strokeWidth={2.5} /> Export PDF Report</>
        )}
      </button>
    </div>
  )
}
