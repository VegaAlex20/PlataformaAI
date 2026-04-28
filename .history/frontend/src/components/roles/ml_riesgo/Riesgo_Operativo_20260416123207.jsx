import React, { useState, useCallback } from 'react'

const API = "http://127.0.0.1:8000"

const FIELDS = [
  { key: "DISTANCIA_KM", label: "Distancia (km)", placeholder: "ej. 320", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
  { key: "OCUPACION_PCT", label: "Ocupación (%)", placeholder: "ej. 85", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { key: "COSTO_OPERATIVO_TOTAL_BOB", label: "Costo operativo (BOB)", placeholder: "ej. 1200", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "CAPACIDAD_KG", label: "Capacidad (kg)", placeholder: "ej. 5000", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { key: "PESO_TOTAL_ASIGNADO_KG", label: "Peso asignado (kg)", placeholder: "ej. 4200", icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" },
  { key: "COSTO_COMBUSTIBLE_TOTAL_BOB", label: "Costo combustible (BOB)", placeholder: "ej. 480", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
]

const EMPTY_FORM = Object.fromEntries(FIELDS.map(f => [f.key, ""]))

const RISK_CONFIG = {
  high:   { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', accent: '#EF4444', label: 'Alto riesgo',   barColor: '#EF4444' },
  medium: { bg: '#FFFBEB', border: '#FCD34D', text: '#92400E', accent: '#F59E0B', label: 'Medio',         barColor: '#F59E0B' },
  low:    { bg: '#F0FDF4', border: '#86EFAC', text: '#14532D', accent: '#22C55E', label: 'Normal',        barColor: '#22C55E' },
}

function getRisk(prob, alerta, riesgo) {
  if (riesgo === 1 || alerta === "ALTO RIESGO" || prob > 0.7) return 'high'
  if (alerta === "MEDIO" || prob > 0.4) return 'medium'
  return 'low'
}

// SVG Icons
const Icon = ({ path, size = 16, className = "", strokeWidth = 2, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={path} />
  </svg>
)

const TruckIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

function Badge({ level }) {
  const c = RISK_CONFIG[level]
  const icons = {
    high:   "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    medium: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    low:    "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  }
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full">
      <Icon path={icons[level]} size={11} strokeWidth={2.5} />
      {c.label}
    </span>
  )
}

function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #F1F5F9' }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06]" style={{ background: accent, transform: 'translate(30%, -30%)' }} />
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#94A3B8', letterSpacing: '0.08em' }}>{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: accent + '18', color: accent }}>
          <Icon path={icon} size={15} />
        </div>
      </div>
      <p className="text-3xl font-bold leading-none" style={{ color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
      <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>{sub}</p>
    </div>
  )
}

function AlertRow({ v }) {
  const prob = v.probabilidad
  const level = getRisk(prob, v.alerta, v.riesgo)
  const c = RISK_CONFIG[level]
  const pct = (prob * 100).toFixed(1)

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b last:border-b-0 transition-colors hover:bg-slate-50"
      style={{ borderColor: '#F1F5F9' }}>
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.accent }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">Viaje {v.ID_VIAJE}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">
          {v.DISTANCIA_KM ? `${v.DISTANCIA_KM} km` : '—'}
          {v.OCUPACION_PCT != null ? ` · ${v.OCUPACION_PCT}% ocupación` : ''}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: c.barColor }} />
        </div>
        <span className="text-sm font-bold w-12 text-right" style={{ color: c.accent }}>{pct}%</span>
      </div>
      <Badge level={level} />
    </div>
  )
}

function TableRow({ v, i }) {
  const level = getRisk(v.probabilidad, v.alerta, v.riesgo)
  const c = RISK_CONFIG[level]
  const pct = (v.probabilidad * 100).toFixed(1)
  return (
    <tr className="border-t transition-colors hover:bg-slate-50/70" style={{ borderColor: '#F8FAFC' }}>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 rounded-full" style={{ background: c.accent }} />
          <span className="text-sm font-semibold text-slate-800">{v.ID_VIAJE}</span>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-slate-500">{v.DISTANCIA_KM ?? '—'}</td>
      <td className="px-5 py-3.5">
        {v.OCUPACION_PCT != null ? (
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
              <div className="h-full rounded-full" style={{ width: `${v.OCUPACION_PCT}%`, background: '#3B82F6' }} />
            </div>
            <span className="text-sm text-slate-500">{v.OCUPACION_PCT}%</span>
          </div>
        ) : <span className="text-slate-300">—</span>}
      </td>
      <td className="px-5 py-3.5 text-sm text-slate-500">
        {v.COSTO_OPERATIVO_TOTAL_BOB ? `BOB ${v.COSTO_OPERATIVO_TOTAL_BOB.toLocaleString()}` : '—'}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.barColor }} />
          </div>
          <span className="text-sm font-bold" style={{ color: c.accent }}>{pct}%</span>
        </div>
      </td>
      <td className="px-5 py-3.5"><Badge level={level} /></td>
    </tr>
  )
}

export default function NivelOperativo() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [resultado, setResultado] = useState(null)
  const [predicting, setPredicting] = useState(false)
  const [conductorInput, setConductorInput] = useState("")
  const [conductorActivo, setConductorActivo] = useState(null)
  const [activeTab, setActiveTab] = useState('monitor')

  // Filtros
  const [filterRisk, setFilterRisk] = useState('all')
  const [filterSort, setFilterSort] = useState('prob_desc')
  const [filterSearch, setFilterSearch] = useState('')
  const [filterMinProb, setFilterMinProb] = useState('')
  const [filterMaxProb, setFilterMaxProb] = useState('')

  const cargarViajes = useCallback(async (idConductor) => {
    setLoading(true)
    setError(null)
    setViajes([])
    try {
      const url = idConductor
        ? `${API}/api/viajes/?id_conductor=${idConductor}`
        : `${API}/api/viajes/`
      const r = await fetch(url)
      if (!r.ok) throw new Error(`Error ${r.status}`)
      const data = await r.json()
      setViajes(data.viajes || [])
    } catch (e) {
      setError("No se pudieron cargar los viajes. Verifica el ID o la conexión.")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleBuscar = (e) => {
    e.preventDefault()
    const id = conductorInput.trim()
    if (!id) return
    setConductorActivo(id)
    cargarViajes(id)
  }

  const handleLimpiar = () => {
    setConductorInput("")
    setConductorActivo(null)
    setViajes([])
    setError(null)
    setFilterRisk('all')
    setFilterSearch('')
    setFilterMinProb('')
    setFilterMaxProb('')
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: Number(e.target.value) })

  const predecir = async () => {
    setPredicting(true)
    setResultado(null)
    try {
      const res = await fetch(`${API}/api/predecir/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      setResultado(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setPredicting(false)
    }
  }

  // Filtrado + ordenamiento
  const viajesFiltrados = viajes
    .filter(v => {
      const level = getRisk(v.probabilidad, v.alerta, v.riesgo)
      if (filterRisk !== 'all' && level !== filterRisk) return false
      if (filterSearch && !String(v.ID_VIAJE).includes(filterSearch)) return false
      const pct = v.probabilidad * 100
      if (filterMinProb !== '' && pct < Number(filterMinProb)) return false
      if (filterMaxProb !== '' && pct > Number(filterMaxProb)) return false
      return true
    })
    .sort((a, b) => {
      if (filterSort === 'prob_desc') return b.probabilidad - a.probabilidad
      if (filterSort === 'prob_asc')  return a.probabilidad - b.probabilidad
      if (filterSort === 'dist_desc') return (b.DISTANCIA_KM || 0) - (a.DISTANCIA_KM || 0)
      if (filterSort === 'dist_asc')  return (a.DISTANCIA_KM || 0) - (b.DISTANCIA_KM || 0)
      return 0
    })

  const total = viajes.length
  const riesgosos = viajes.filter(v => getRisk(v.probabilidad, v.alerta, v.riesgo) === 'high').length
  const medios = viajes.filter(v => getRisk(v.probabilidad, v.alerta, v.riesgo) === 'medium').length
  const riesgoPct = total > 0 ? ((riesgosos / total) * 100).toFixed(1) : "0.0"
  const top5 = viajes.filter(v => v.probabilidad > 0.7).sort((a, b) => b.probabilidad - a.probabilidad).slice(0, 5)

  const activeFiltersCount = [
    filterRisk !== 'all',
    filterSearch !== '',
    filterMinProb !== '',
    filterMaxProb !== '',
  ].filter(Boolean).length

  return (
    <div style={{ fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        .tab-btn { transition: all 0.15s; }
        .tab-btn.active { background: #fff; color: #1E293B; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .tab-btn:not(.active) { color: #64748B; }
        .tab-btn:hover:not(.active) { color: #334155; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .filter-chip { transition: all 0.12s; }
        .filter-chip:hover { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }
        .filter-chip.chip-active { background: #EFF6FF; color: #1D4ED8; border-color: #93C5FD; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .animate-in { animation: fadeIn 0.25s ease forwards; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Top nav bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0F172A', color: '#fff' }}>
              <TruckIcon size={18} />
            </div>
            <div>
              <p className="text-md font-bold text-slate-900 leading-none">SIN-RAI</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-none">Panel operativo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: '#F0FDF4', color: '#15803D' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" style={{ animation: 'pulse 2s infinite' }} />
              Sistema activo
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: '#F1F5F9' }}>
          {[
            { id: 'monitor', label: 'Monitoreo', icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { id: 'sim', label: 'Simulación', icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`tab-btn flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium ${activeTab === tab.id ? 'active' : ''}`}>
              <Icon path={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── MONITOREO TAB ── */}
        {activeTab === 'monitor' && (
          <div className="space-y-6 animate-in">

            {/* Search */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size={14} className="text-slate-400" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Buscar conductor</p>
              </div>
              <form onSubmit={handleBuscar} className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                    <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={16} />
                  </span>
                  <input
                    type="number"
                    value={conductorInput}
                    onChange={e => setConductorInput(e.target.value)}
                    placeholder="ID del conductor, ej. 23"
                    className="w-full rounded-xl pl-11 pr-4 py-3 text-sm font-medium placeholder-slate-300 focus:outline-none transition-all"
                    style={{ border: '1.5px solid #E2E8F0', color: '#1E293B', background: '#F8FAFC' }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC' }}
                  />
                </div>
                <button type="submit" disabled={!conductorInput.trim() || loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: '#0F172A' }}>
                  {loading
                    ? <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                    : <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={14} />
                  }
                  {loading ? "Buscando..." : "Buscar"}
                </button>
                {conductorActivo && (
                  <button type="button" onClick={handleLimpiar}
                    className="px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#F1F5F9', color: '#64748B', border: '1.5px solid #E2E8F0' }}>
                    Limpiar
                  </button>
                )}
              </form>
              {conductorActivo && !loading && !error && (
                <p className="text-xs font-medium mt-3" style={{ color: '#6366F1' }}>
                  {total} viaje{total !== 1 ? 's' : ''} encontrados para el conductor #{conductorActivo}
                </p>
              )}
              {error && (
                <p className="text-xs font-medium mt-3 flex items-center gap-1.5 text-red-500">
                  <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={12} />
                  {error}
                </p>
              )}
            </div>

            {/* Estado vacío */}
            {!conductorActivo && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#F1F5F9', color: '#94A3B8' }}>
                  <TruckIcon size={28} />
                </div>
                <p className="text-sm font-semibold text-slate-600">Ingresa un ID de conductor</p>
                <p className="text-xs text-slate-400 mt-1.5">Los datos de viajes y alertas aparecerán aquí</p>
              </div>
            )}

            {conductorActivo && !loading && !error && (
              <div className="space-y-6 animate-in">

                {/* KPIs */}
                <div className="grid grid-cols-4 gap-4">
                  <StatCard label="Total viajes" value={total}
                    sub={`Conductor #${conductorActivo}`}
                    accent="#6366F1"
                    icon="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  />
                  <StatCard label="Alto riesgo" value={riesgosos}
                    sub="Prob. mayor a 70%"
                    accent="#EF4444"
                    icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                  <StatCard label="Riesgo medio" value={medios}
                    sub="Prob. entre 40–70%"
                    accent="#F59E0B"
                    icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <StatCard label="Tasa de riesgo" value={`${riesgoPct}%`}
                    sub="Alto riesgo / total"
                    accent="#10B981"
                    icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </div>

                {/* Alertas críticas */}
                {top5.length > 0 && (
                  <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                    <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2', color: '#EF4444' }}>
                          <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" size={14} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">Alertas críticas</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#FEF2F2', color: '#EF4444' }}>
                        {top5.length} crítico{top5.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    {top5.map((v, i) => <AlertRow key={i} v={v} />)}
                  </div>
                )}

                {/* Filtros */}
                <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon path="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" size={14} className="text-slate-400" />
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Filtros y ordenamiento</p>
                      {activeFiltersCount > 0 && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                          {activeFiltersCount} activo{activeFiltersCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {activeFiltersCount > 0 && (
                      <button onClick={() => { setFilterRisk('all'); setFilterSearch(''); setFilterMinProb(''); setFilterMaxProb(''); setFilterSort('prob_desc') }}
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {/* Nivel de riesgo chips */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Nivel de riesgo</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[['all', 'Todos'], ['high', 'Alto'], ['medium', 'Medio'], ['low', 'Normal']].map(([val, lab]) => (
                          <button key={val} onClick={() => setFilterRisk(val)}
                            className={`filter-chip text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${filterRisk === val ? 'chip-active' : ''}`}
                            style={filterRisk !== val ? { background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' } : {}}>
                            {lab}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Buscar ID */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Buscar ID viaje</label>
                      <input type="text" value={filterSearch} onChange={e => setFilterSearch(e.target.value)}
                        placeholder="ej. 1042"
                        className="w-full rounded-xl px-3 py-2 text-sm placeholder-slate-300 focus:outline-none transition-all"
                        style={{ border: '1.5px solid #E2E8F0', color: '#1E293B', background: '#F8FAFC' }}
                        onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                        onBlur={e => { e.target.style.borderColor = '#E2E8F0' }}
                      />
                    </div>
                    {/* Rango de probabilidad */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Prob. mínima (%)</label>
                      <input type="number" value={filterMinProb} onChange={e => setFilterMinProb(e.target.value)}
                        placeholder="ej. 40" min="0" max="100"
                        className="w-full rounded-xl px-3 py-2 text-sm placeholder-slate-300 focus:outline-none transition-all"
                        style={{ border: '1.5px solid #E2E8F0', color: '#1E293B', background: '#F8FAFC' }}
                        onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                        onBlur={e => { e.target.style.borderColor = '#E2E8F0' }}
                      />
                    </div>
                    {/* Ordenar */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Ordenar por</label>
                      <select value={filterSort} onChange={e => setFilterSort(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none cursor-pointer transition-all"
                        style={{ border: '1.5px solid #E2E8F0', color: '#1E293B', background: '#F8FAFC' }}>
                        <option value="prob_desc">Prob. (mayor primero)</option>
                        <option value="prob_asc">Prob. (menor primero)</option>
                        <option value="dist_desc">Distancia (mayor)</option>
                        <option value="dist_asc">Distancia (menor)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tabla */}
                <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <p className="text-sm font-bold text-slate-800">Todos los viajes</p>
                    <span className="text-xs font-semibold text-slate-400">{viajesFiltrados.length} de {total} registros</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: '#F8FAFC' }}>
                          {["ID viaje", "Dist. (km)", "Ocupación", "Costo op.", "Probabilidad", "Estado"].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {viajesFiltrados.length === 0 ? (
                          <tr><td colSpan={6} className="text-center py-10 text-sm text-slate-400">Sin resultados con los filtros aplicados.</td></tr>
                        ) : viajesFiltrados.map((v, i) => <TableRow key={i} v={v} i={i} />)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SIMULACIÓN TAB ── */}
        {activeTab === 'sim' && (
          <div className="space-y-6 animate-in">
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                  <Icon path="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Simulación de riesgo</p>
                  <p className="text-xs text-slate-400">Ingresa los parámetros del viaje para obtener una predicción</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {FIELDS.map(({ key, label, placeholder, icon }) => (
                  <div key={key}>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
                      <Icon path={icon} size={12} />
                      {label}
                    </label>
                    <input
                      type="number"
                      name={key}
                      placeholder={placeholder}
                      onChange={handleChange}
                      className="w-full rounded-xl px-4 py-3 text-sm font-medium placeholder-slate-300 focus:outline-none transition-all"
                      style={{ border: '1.5px solid #E2E8F0', color: '#1E293B', background: '#F8FAFC' }}
                      onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC' }}
                    />
                  </div>
                ))}
              </div>

              <button onClick={predecir} disabled={predicting}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#0F172A' }}>
                {predicting
                  ? <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                  : <Icon path="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={15} />
                }
                {predicting ? "Analizando..." : "Analizar riesgo"}
              </button>
            </div>

            {resultado && (() => {
              const level = getRisk(resultado.probabilidad, resultado.alerta, resultado.riesgo)
              const c = RISK_CONFIG[level]
              const pct = (resultado.probabilidad * 100).toFixed(1)
              return (
                <div className="rounded-2xl p-6 animate-in" style={{ background: c.bg, border: `1.5px solid ${c.border}` }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fff', color: c.accent }}>
                      <Icon path={
                        level === 'high' ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" :
                        level === 'medium' ? "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" :
                        "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      } size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: c.text }}>Resultado del análisis</p>
                      <p className="text-xs" style={{ color: c.text, opacity: 0.7 }}>Basado en los parámetros ingresados</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.text, opacity: 0.6 }}>Probabilidad</p>
                      <p className="text-4xl font-black" style={{ color: c.accent, fontVariantNumeric: 'tabular-nums' }}>{pct}%</p>
                      <div className="w-full h-2 rounded-full mt-3 overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: c.accent }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.text, opacity: 0.6 }}>Clasificación</p>
                      <p className="text-xl font-bold" style={{ color: c.text }}>
                        {resultado.riesgo === 1 ? "Con riesgo" : "Sin riesgo"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.text, opacity: 0.6 }}>Nivel</p>
                      <Badge level={level} />
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}