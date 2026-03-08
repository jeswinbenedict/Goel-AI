const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const get  = (path)       => fetch(`${BASE}${path}`).then(r => r.json())
const post = (path, body) => fetch(`${BASE}${path}`, {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body:    JSON.stringify(body),
}).then(r => r.json())

export const api = {
  health:          ()             => get('/api/health'),
  fuzzyScore:      (heat, void_, hours) => post('/api/fuzzy-score',      { heat, void: void_, hours }),
  optimizeRoutes:  (survivors, teams)   => post('/api/optimize-routes',  { survivors, teams }),
  earthquakeLive:  ()             => get('/api/earthquake-live'),
  analyzeThermal:  ()             => post('/api/analyze-thermal', {}),
}
