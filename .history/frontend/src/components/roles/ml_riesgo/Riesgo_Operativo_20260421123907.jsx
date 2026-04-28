import React, { useState, useCallback } from 'react'

const API = "http://127.0.0.1:8000"

// Solo 6 fields finales
const FIELDS = [
  {
    key: "DISTANCIA_KM",
    label: "Distancia (km)",
    placeholder: "ej. 320",
    type: "number",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
  },
  {
    key: "OCUPACION_PCT",
    label: "Ocupación (%)",
    placeholder: "ej. 85",
    type: "number",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  },
  {
    key: "CAPACIDAD_KG",
    label: "Capacidad (kg)",
    placeholder: "ej. 5000",
    type: "number",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
  },
  {
    key: "PESO_TOTAL_ASIGNADO_KG",
    label: "Peso asignado (kg)",
    placeholder: "ej. 4200",
    type: "number",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
  },
  {
    key: "TIPO_CARGA",
    label: "Tipo de carga",
    type: "select",
    options: ["Normal", "Frágil", "Peligrosa"],
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
  },
  {
    key: "CONDICION_CLIMATICA",
    label: "Condición climática",
    type: "select",
    options: ["Buena", "Lluvia", "Tormenta"],
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
  },
]

const EMPTY_FORM = Object.fromEntries(FIELDS.map(f => [f.key, f.type === "select" ? f.options[0] : ""]))

const RISK_CONFIG = {
  high:   { bg: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)', border: '#FECDD3', text: '#9F1239', accent: '#F43F5E', label: 'Alto riesgo',   barColor: '#F43F5E', glow: 'rgba(244,63,94,0.18)' },
  medium: { bg: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border: '#FDE68A', text: '#92400E', accent: '#F59E0B', label: 'Medio',         barColor: '#F59E0B', glow: 'rgba(245,158,11,0.18)' },
  low:    { bg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border: '#BBF7D0', text: '#14532D', accent: '#22C55E', label: 'Normal',        barColor: '#22C55E', glow: 'rgba(34,197,94,0.18)' },
}

function getRisk(prob, alerta, riesgo) {
  if (riesgo === 1 || alerta === "ALTO RIESGO" || prob > 0.7) return 'high'
  if (alerta === "MEDIO" || prob > 0.4) return 'medium'
  return 'low'
}

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
    <span style={{ background: c.bg, color: c.text, border: `1.5px solid ${c.border}`, boxShadow: `0 0 10px ${c.glow}` }}
      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full">
      <Icon path={icons[level]} size={11} strokeWidth={2.5} />
      {c.label}
    </span>
  )
}

function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5" style={{ background: '#fff', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}>
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-[0.07]" style={{ background: accent, transform: 'translate(35%, -35%)' }} />
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full opacity-[0.04]" style={{ background: accent, transform: 'translate(-40%, 40%)' }} />
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94A3B8', letterSpacing: '0.1em' }}>{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + '15', color: accent, border: `1.5px solid ${accent}22` }}>
          <Icon path={icon} size={16} />
        </div>
      </div>
      <p className="text-3xl font-black leading-none" style={{ color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{value}</p>
      <p className="text-xs mt-2.5 font-medium" style={{ color: '#94A3B8' }}>{sub}</p>
    </div>
  )
}

function AlertRow({ v }) {
  const prob = v.probabilidad
  const level = getRisk(prob, v.alerta, v.riesgo)
  const c = RISK_CONFIG[level]
  const pct = (prob * 100).toFixed(1)

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b last:border-b-0 transition-all hover:bg-slate-50"
      style={{ borderColor: '#F1F5F9' }}>
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.accent, boxShadow: `0 0 8px ${c.glow}` }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800">Viaje {v.ID_VIAJE}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">
          {v.DISTANCIA_KM ? `${v.DISTANCIA_KM} km` : '—'}
          {v.OCUPACION_PCT != null ? ` · ${v.OCUPACION_PCT}% ocupación` : ''}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: c.barColor, boxShadow: `0 0 6px ${c.glow}` }} />
        </div>
        <span className="text-sm font-black w-12 text-right" style={{ color: c.accent }}>{pct}%</span>
      </div>
      <Badge level={level} />
    </div>
  )
}

function TableRow({ v }) {
  const level = getRisk(v.probabilidad, v.alerta, v.riesgo)
  const c = RISK_CONFIG[level]
  const pct = (v.probabilidad * 100).toFixed(1)
  return (
    <tr className="border-t transition-all hover:bg-slate-50/80" style={{ borderColor: '#F8FAFC' }}>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-7 rounded-full" style={{ background: c.accent, boxShadow: `0 0 8px ${c.glow}` }} />
          <span className="text-sm font-bold text-slate-800">{v.ID_VIAJE}</span>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm font-medium text-slate-500">{v.DISTANCIA_KM ?? '—'}</td>
      <td className="px-5 py-3.5">
        {v.OCUPACION_PCT != null ? (
          <div className="flex items-center gap-2">
            <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
              <div className="h-full rounded-full" style={{ width: `${v.OCUPACION_PCT}%`, background: '#6366F1' }} />
            </div>
            <span className="text-sm font-medium text-slate-500">{v.OCUPACION_PCT}%</span>
          </div>
        ) : <span className="text-slate-300">—</span>}
      </td>
      <td className="px-5 py-3.5 text-sm font-medium text-slate-500">
        {v.COSTO_OPERATIVO_TOTAL_BOB ? `BOB ${v.COSTO_OPERATIVO_TOTAL_BOB.toLocaleString()}` : '—'}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.barColor, boxShadow: `0 0 6px ${c.glow}` }} />
          </div>
          <span className="text-sm font-black" style={{ color: c.accent }}>{pct}%</span>
        </div>
      </td>
      <td className="px-5 py-3.5"><Badge level={level} /></td>
    </tr>
  )
}

// Campo de formulario: number o select
function FormField({ field, value, onChange }) {
  const baseStyle = {
    border: '1.5px solid #E2E8F0',
    color: '#1E293B',
    background: '#F8FAFC',
    width: '100%',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  }

  if (field.type === 'select') {
    return (
      <select
        name={field.key}
        value={value}
        onChange={onChange}
        style={{
          ...baseStyle,
          paddingRight: '40px',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          cursor: 'pointer',
        }}
        onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none' }}
      >
        {field.options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  return (
    <input
      type="number"
      name={field.key}
      placeholder={field.placeholder}
      value={value}
      onChange={onChange}
      style={baseStyle}
      onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none' }}
    />
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

  const handleChange = e => {
    const field = FIELDS.find(f => f.key === e.target.name)
    const val = field?.type === 'select' ? e.target.value : Number(e.target.value)
    setForm({ ...form, [e.target.name]: val })
  }

  const predecir = async () => {
    setPredicting(true)
    setResultado(null)
    try {
      // Calcular ratio_carga antes de enviar
      const payload = {
        ...form,
        RATIO_CARGA: form.CAPACIDAD_KG > 0 ? form.PESO_TOTAL_ASIGNADO_KG / form.CAPACIDAD_KG : 0,
      }
      const res = await fetch(`${API}/api/predecir/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      setResultado(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setPredicting(false)
    }
  }

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

  const activeFiltersCount = [filterRisk !== 'all', filterSearch !== '', filterMinProb !== '', filterMaxProb !== ''].filter(Boolean).length

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F8FAFC 100%)', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        .tab-btn { transition: all 0.15s; }
        .tab-btn.active { background: #fff; color: #1E293B; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .tab-btn:not(.active) { color: #64748B; }
        .tab-btn:hover:not(.active) { color: #334155; background: rgba(255,255,255,0.5); }
        .filter-chip { transition: all 0.12s; cursor: pointer; }
        .filter-chip:hover { background: #EFF6FF !important; color: #1D4ED8 !important; border-color: #BFDBFE !important; }
        .filter-chip.chip-active { background: #EFF6FF !important; color: #1D4ED8 !important; border-color: #93C5FD !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .animate-in { animation: fadeIn 0.3s ease forwards; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse { animation: pulse 2s ease infinite; }
        .card-hover { transition: all 0.2s; }
        .card-hover:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(15,23,42,0.1) !important; }
        select option { background: #fff; color: #1E293B; }
      `}</style>

      {/* Nav */}
      <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(226,232,240,0.8)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#1E293B,#334155)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(15,23,42,0.3)' }}>
              <TruckIcon size={18} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-0.02em' }}>SIN-RAI</p>
              <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, lineHeight: 1, fontWeight: 500 }}>Panel operativo</p>
            </div>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 999, background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', color: '#15803D', border: '1px solid #BBF7D0' }}>
            <span className="pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            Sistema activo
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(241,245,249,0.8)', width: 'fit-content', border: '1px solid #E2E8F0' }}>
          {[
            { id: 'monitor', label: 'Monitoreo', icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { id: 'sim', label: 'Simulación', icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`tab-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold ${activeTab === tab.id ? 'active' : ''}`}>
              <Icon path={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── MONITOREO ── */}
        {activeTab === 'monitor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-in">

            {/* Buscar */}
            <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size={14} />
                </div>
                <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>Buscar conductor</p>
              </div>
              <form onSubmit={handleBuscar} style={{ display: 'flex', gap: 10 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', pointerEvents: 'none' }}>
                    <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={16} />
                  </span>
                  <input
                    type="number"
                    value={conductorInput}
                    onChange={e => setConductorInput(e.target.value)}
                    placeholder="ID del conductor, ej. 23"
                    style={{ width: '100%', borderRadius: 12, paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, fontWeight: 500, border: '1.5px solid #E2E8F0', color: '#1E293B', background: '#F8FAFC', outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s' }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                <button type="submit" disabled={!conductorInput.trim() || loading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', background: loading ? '#94A3B8' : 'linear-gradient(135deg,#1E293B,#334155)', border: 'none', cursor: conductorInput.trim() && !loading ? 'pointer' : 'not-allowed', opacity: !conductorInput.trim() || loading ? 0.6 : 1, transition: 'all 0.15s', boxShadow: '0 4px 12px rgba(15,23,42,0.2)', fontFamily: 'inherit' }}>
                  {loading
                    ? <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                    : <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={14} />
                  }
                  {loading ? "Buscando..." : "Buscar"}
                </button>
                {conductorActivo && (
                  <button type="button" onClick={handleLimpiar}
                    style={{ padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: '#F1F5F9', color: '#64748B', border: '1.5px solid #E2E8F0', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    Limpiar
                  </button>
                )}
              </form>
              {conductorActivo && !loading && !error && (
                <p style={{ fontSize: 12, fontWeight: 600, marginTop: 12, color: '#6366F1' }}>
                  {total} viaje{total !== 1 ? 's' : ''} encontrados para el conductor #{conductorActivo}
                </p>
              )}
              {error && (
                <p style={{ fontSize: 12, fontWeight: 600, marginTop: 12, color: '#F43F5E', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={12} />
                  {error}
                </p>
              )}
            </div>

            {/* Estado vacío */}
            {!conductorActivo && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center', background: '#fff', border: '1.5px dashed #E2E8F0', borderRadius: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,#F1F5F9,#E2E8F0)', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <TruckIcon size={28} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#475569', marginBottom: 6 }}>Ingresa un ID de conductor</p>
                <p style={{ fontSize: 12, color: '#94A3B8' }}>Los datos de viajes y alertas aparecerán aquí</p>
              </div>
            )}

            {conductorActivo && !loading && !error && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-in">

                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                  <StatCard label="Total viajes" value={total} sub={`Conductor #${conductorActivo}`} accent="#6366F1"
                    icon="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  <StatCard label="Alto riesgo" value={riesgosos} sub="Prob. mayor a 70%" accent="#F43F5E"
                    icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  <StatCard label="Riesgo medio" value={medios} sub="Prob. entre 40–70%" accent="#F59E0B"
                    icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <StatCard label="Tasa de riesgo" value={`${riesgoPct}%`} sub="Alto riesgo / total" accent="#10B981"
                    icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </div>

                {/* Alertas críticas */}
                {top5.length > 0 && (
                  <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)', color: '#F43F5E', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FECDD3' }}>
                          <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" size={14} />
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Alertas críticas</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 999, background: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)', color: '#F43F5E', border: '1px solid #FECDD3' }}>
                        {top5.length} crítico{top5.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    {top5.map((v, i) => <AlertRow key={i} v={v} />)}
                  </div>
                )}

                {/* Filtros */}
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20, padding: 20, boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon path="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" size={13} className="text-slate-400" />
                      <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>Filtros</p>
                      {activeFiltersCount > 0 && (
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE' }}>
                          {activeFiltersCount} activo{activeFiltersCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {activeFiltersCount > 0 && (
                      <button onClick={() => { setFilterRisk('all'); setFilterSearch(''); setFilterMinProb(''); setFilterMaxProb(''); setFilterSort('prob_desc') }}
                        style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 8 }}>Nivel de riesgo</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {[['all', 'Todos'], ['high', 'Alto'], ['medium', 'Medio'], ['low', 'Normal']].map(([val, lab]) => (
                          <button key={val} onClick={() => setFilterRisk(val)}
                            className={`filter-chip ${filterRisk === val ? 'chip-active' : ''}`}
                            style={{ fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: filterRisk === val ? '#EFF6FF' : '#F8FAFC', color: filterRisk === val ? '#1D4ED8' : '#64748B', fontFamily: 'inherit' }}>
                            {lab}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 8 }}>Buscar ID viaje</label>
                      <input type="text" value={filterSearch} onChange={e => setFilterSearch(e.target.value)}
                        placeholder="ej. 1042"
                        style={{ width: '100%', borderRadius: 10, padding: '9px 12px', fontSize: 13, fontWeight: 500, border: '1.5px solid #E2E8F0', color: '#1E293B', background: '#F8FAFC', outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s' }}
                        onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 8 }}>Prob. mínima (%)</label>
                      <input type="number" value={filterMinProb} onChange={e => setFilterMinProb(e.target.value)}
                        placeholder="ej. 40" min="0" max="100"
                        style={{ width: '100%', borderRadius: 10, padding: '9px 12px', fontSize: 13, fontWeight: 500, border: '1.5px solid #E2E8F0', color: '#1E293B', background: '#F8FAFC', outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s' }}
                        onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 8 }}>Ordenar por</label>
                      <select value={filterSort} onChange={e => setFilterSort(e.target.value)}
                        style={{ width: '100%', borderRadius: 10, padding: '9px 12px', paddingRight: 36, fontSize: 13, fontWeight: 500, border: '1.5px solid #E2E8F0', color: '#1E293B', background: '#F8FAFC', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                        <option value="prob_desc">Prob. (mayor primero)</option>
                        <option value="prob_asc">Prob. (menor primero)</option>
                        <option value="dist_desc">Distancia (mayor)</option>
                        <option value="dist_asc">Distancia (menor)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tabla */}
                <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Todos los viajes</p>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>{viajesFiltrados.length} de {total} registros</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'linear-gradient(135deg,#F8FAFC,#F1F5F9)' }}>
                          {["ID viaje", "Dist. (km)", "Ocupación", "Costo op.", "Probabilidad", "Estado"].map(h => (
                            <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {viajesFiltrados.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', fontSize: 13, color: '#94A3B8' }}>Sin resultados con los filtros aplicados.</td></tr>
                        ) : viajesFiltrados.map((v, i) => <TableRow key={i} v={v} />)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SIMULACIÓN ── */}
        {activeTab === 'sim' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-in">
            <div style={{ background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(15,23,42,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #BFDBFE' }}>
                  <Icon path="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" size={17} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', letterSpacing: '-0.01em' }}>Simulación de riesgo</p>
                  <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>Ingresa los parámetros del viaje para obtener una predicción</p>
                </div>
              </div>

              {/* Ratio info banner */}
              <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '1px solid #BFDBFE', borderRadius: 12, padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={14} style={{ color: '#3B82F6', flexShrink: 0 }} />
                <p style={{ fontSize: 11, fontWeight: 600, color: '#1D4ED8' }}>
                  El ratio de carga (Peso asignado / Capacidad) se calcula automáticamente al analizar.
                  {form.CAPACIDAD_KG > 0 && (
                    <span style={{ marginLeft: 8, background: '#fff', padding: '2px 8px', borderRadius: 6, fontWeight: 800 }}>
                      Ratio actual: {(form.PESO_TOTAL_ASIGNADO_KG / form.CAPACIDAD_KG).toFixed(3)}
                    </span>
                  )}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {FIELDS.map((field) => (
                  <div key={field.key}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <Icon path={field.icon} size={12} />
                      {field.label}
                    </label>
                    <FormField field={field} value={form[field.key]} onChange={handleChange} />
                  </div>
                ))}
              </div>

              <button onClick={predecir} disabled={predicting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', background: predicting ? '#94A3B8' : 'linear-gradient(135deg,#1E293B,#334155)', border: 'none', cursor: predicting ? 'not-allowed' : 'pointer', opacity: predicting ? 0.7 : 1, transition: 'all 0.15s', boxShadow: '0 4px 16px rgba(15,23,42,0.25)', letterSpacing: '-0.01em', fontFamily: 'inherit' }}>
                {predicting
                  ? <svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
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
                <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 20, padding: 28, boxShadow: `0 4px 24px ${c.glow}` }} className="animate-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fff', color: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${c.glow}`, border: `1.5px solid ${c.border}` }}>
                      <Icon path={
                        level === 'high' ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" :
                        level === 'medium' ? "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" :
                        "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      } size={22} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: c.text, letterSpacing: '-0.01em' }}>Resultado del análisis</p>
                      <p style={{ fontSize: 12, color: c.text, opacity: 0.65, marginTop: 3, fontWeight: 500 }}>Basado en los parámetros ingresados</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, color: c.text, opacity: 0.6 }}>Probabilidad</p>
                      <p style={{ fontSize: 48, fontWeight: 900, color: c.accent, fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.03em' }}>{pct}%</p>
                      <div style={{ width: '100%', height: 8, borderRadius: 999, marginTop: 14, overflow: 'hidden', background: 'rgba(0,0,0,0.08)' }}>
                        <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: c.accent, boxShadow: `0 0 12px ${c.glow}`, transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)' }} />
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, color: c.text, opacity: 0.6 }}>Clasificación</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: c.text, letterSpacing: '-0.02em' }}>
                        {resultado.riesgo === 1 ? "Con riesgo" : "Sin riesgo"}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, color: c.text, opacity: 0.6 }}>Nivel</p>
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