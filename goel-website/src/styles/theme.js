// ── Dark Theme Color Tokens ──
export const C = {
  red:    '#ff3b30',
  orange: '#ff6b35',
  yellow: '#ffd60a',
  green:  '#30d158',
  blue:   '#0a84ff',
  purple: '#bf5af2',
  t1:     '#f5f5f7',
  t2:     '#a1a1a6',
  t3:     '#6e6e73',
  t4:     '#3a3a3c',
}

export const surface = {
  bg:      '#000000',
  card:    'rgba(12,12,16,0.96)',
  raised:  'rgba(255,255,255,0.03)',
  border:  'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',
  hover:   'rgba(255,255,255,0.05)',
  subtle:  'rgba(255,255,255,0.02)',
  divider: 'rgba(255,255,255,0.06)',
}

export const card = {
  background:   'rgba(12,12,16,0.96)',
  border:       '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
  boxShadow:    'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 32px rgba(0,0,0,0.5)',
  position:     'relative',
  overflow:     'hidden',
}

export const cardHover = {
  borderColor: 'rgba(255,255,255,0.12)',
  boxShadow:   'inset 0 1px 0 rgba(255,255,255,0.1), 0 24px 64px rgba(0,0,0,0.6)',
  transform:   'translateY(-2px)',
}

export const progressTrack = {
  width:        '100%',
  height:       '5px',
  background:   'rgba(255,255,255,0.06)',
  borderRadius: '100px',
  overflow:     'hidden',
}

export const progressFill = (pct, color) => ({
  height:       '100%',
  width:        `${pct}%`,
  borderRadius: '100px',
  background:   color,
  boxShadow:    `0 0 8px ${color}40`,
})

export const badge = (color) => ({
  display:      'inline-flex',
  alignItems:   'center',
  gap:          '5px',
  padding:      '4px 12px',
  borderRadius: '100px',
  background:   `${color}15`,
  border:       `1px solid ${color}30`,
  fontSize:     '11px',
  fontWeight:   700,
  color:         color,
})

export const label = {
  fontSize:      '10px',
  fontWeight:    700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color:         '#3a3a3c',
}

export const mono = {
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  fontSize:   '12px',
  color:      '#a1a1a6',
}

export const input = {
  width:        '100%',
  padding:      '10px 14px',
  borderRadius: '12px',
  background:   'rgba(255,255,255,0.04)',
  border:       '1px solid rgba(255,255,255,0.08)',
  fontSize:     '13px',
  color:        '#f5f5f7',
  outline:      'none',
  fontFamily:   'Inter, sans-serif',
}

export const divider = {
  height:     '1px',
  background: 'rgba(255,255,255,0.06)',
  margin:     '16px 0',
}

export const tooltip = {
  position:      'absolute',
  padding:       '6px 12px',
  borderRadius:  '10px',
  background:    'rgba(12,12,16,0.98)',
  border:        '1px solid rgba(255,255,255,0.10)',
  boxShadow:     '0 4px 20px rgba(0,0,0,0.5)',
  fontSize:      '12px',
  fontWeight:    500,
  color:         '#f5f5f7',
  pointerEvents: 'none',
  zIndex:        1000,
  whiteSpace:    'nowrap',
}

export const scrollable = {
  overflowY:      'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: '#3a3a3c transparent',
}
