import React, { useEffect, useState, useCallback } from 'react'

const API = "http://127.0.0.1:8000"

const FIELDS = [
  { key: "DISTANCIA_KM", label: "Distancia (km)", placeholder: "ej. 320" },
  { key: "OCUPACION_PCT", label: "Ocupación (%)", placeholder: "ej. 85" },
  { key: "COSTO_OPERATIVO_TOTAL_BOB", label: "Costo operativo (BOB)", placeholder: "ej. 1200" },
  { key: "CAPACIDAD_KG", label: "Capacidad (kg)", placeholder: "ej. 5000" },
  { key: "PESO_TOTAL_ASIGNADO_KG", label: "Peso asignado (kg)", placeholder: "ej. 4200" },
  { key: "COSTO_COMBUSTIBLE_TOTAL_BOB", label: "Costo combustible (BOB)", placeholder: "ej. 480" },
]

const EMPTY_FORM = Object.fromEntries(FIELDS.map(f => [f.key, ""]))

function probColor(p) {
  if (p > 0.7) return '#E24B4A'
  if (p > 0.4) return '#BA7517'
  return '#3B6D11'
}

function probTextClass(p) {
  if (p > 0.7) return 'text-red-600'
  if (p > 0.4) return 'text-amber-700'
  return 'text-green-700'
}

function IconTruck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z" /><path d="M16 8l4 0 3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function IconAlert({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconInfo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function IconPlay({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  )
}

function IconWave({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function IconSearch({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconUser({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function Chip({ alerta, riesgo }) {
  if (riesgo === 1 || alerta === "ALTO RIESGO")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-800 font-medium">
        <IconAlert size={11} /> Alto riesgo
      </span>
    )
  if (alerta === "MEDIO")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-medium">
        <IconInfo size={11} /> Medio
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-800 font-medium">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      Normal
    </span>
  )
}

function AlertCard({ v }) {
  const p = (v.probabilidad * 100).toFixed(1)
  const isCrit = v.probabilidad > 0.7
  return (
    <div className={`flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 mb-2.5 transition-colors hover:bg-gray-50 ${isCrit ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-amber-400'}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isCrit ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
        {isCrit ? <IconAlert size={17} /> : <IconInfo size={17} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">Viaje {v.ID_VIAJE}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {v.DISTANCIA_KM ? `${v.DISTANCIA_KM} km · ` : ''}Ocupación {v.OCUPACION_PCT ?? 'n/a'}%
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium" style={{ color: probColor(v.probabilidad) }}>{p}%</p>
        <div className="w-16 h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
          <div className="h-1 rounded-full" style={{ width: `${p}%`, background: probColor(v.probabilidad) }} />
        </div>
      </div>
    </div>
  )
}

export default function NivelOperativo() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [resultado, setResultado] = useState(null)
  const [predicting, setPredicting] = useState(false)

  // Input del conductor
  const [conductorInput, setConductorInput] = useState("")
  const [conductorActivo, setConductorActivo] = useState(null)

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

      const viajesData = data.viajes || []

      setViajes(
        viajesData.sort((a, b) => b.probabilidad - a.probabilidad)
      )
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
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: Number(e.target.value) })

  const predecir = async () => {
    setPredicting(true)
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

  const total = viajes.length
  const riesgosos = viajes.filter(v => v.riesgo === 1).length
  const riesgoPct = total > 0 ? ((riesgosos / total) * 100).toFixed(1) : "0.0"
  const top5 = viajes.filter(v => v.probabilidad > 0.7).slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <IconTruck />
          </div>
          <div>
            <h1 className="text-xl font-medium text-gray-900 leading-tight">Nivel operativo</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {conductorActivo
                ? `Conductor #${conductorActivo}`
                : "Monitoreo de viajes y alertas"}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-2 text-xs bg-green-50 text-green-700 font-medium px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          En vivo
        </span>
      </div>

      {/* Buscador de conductor */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <IconUser size={12} />
          Buscar por conductor
        </p>
        <form onSubmit={handleBuscar} className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
              <IconUser size={14} />
            </span>
            <input
              type="number"
              value={conductorInput}
              onChange={e => setConductorInput(e.target.value)}
              placeholder="ID del conductor, ej. 23"
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 transition-colors bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={!conductorInput.trim() || loading}
            className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconSearch size={14} />
            {loading ? "Cargando..." : "Buscar"}
          </button>
          {conductorActivo && (
            <button
              type="button"
              onClick={handleLimpiar}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-500 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Limpiar
            </button>
          )}
        </form>
        {conductorActivo && !loading && !error && (
          <p className="text-xs text-blue-500 mt-2.5">
            Mostrando {total} viaje{total !== 1 ? 's' : ''} del conductor <strong>#{conductorActivo}</strong>
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 mt-2.5 flex items-center gap-1.5">
            <IconAlert size={12} /> {error}
          </p>
        )}
      </div>

      {/* KPIs — solo se muestran si hay datos */}
      {conductorActivo && !loading && !error && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Total de viajes</p>
              <p className="text-3xl font-medium text-gray-900">{total}</p>
              <p className="text-xs text-gray-400 mt-1.5">conductor #{conductorActivo}</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Viajes en riesgo</p>
              <p className="text-3xl font-medium text-red-500">{riesgosos}</p>
              <p className="text-xs text-gray-400 mt-1.5">probabilidad &gt; 0.5</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Tasa de riesgo</p>
              <p className="text-3xl font-medium text-amber-600">{riesgoPct}%</p>
              <p className="text-xs text-gray-400 mt-1.5">del total de viajes</p>
            </div>
          </div>

          {/* Alertas críticas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <IconAlert size={15} />
                Alertas críticas
              </h2>
              <span className="text-xs bg-red-100 text-red-700 font-medium px-3 py-1 rounded-full">
                {top5.length} alertas
              </span>
            </div>
            <div>
              {top5.length === 0
                ? <p className="text-sm text-gray-400 py-2">Sin alertas críticas para este conductor.</p>
                : top5.map((v, i) => <AlertCard key={i} v={v} />)
              }
            </div>
          </div>

          {/* Tabla — todos los viajes sin límite */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-800">Todos los viajes</h2>
              <span className="text-xs text-gray-400">{total} registros</span>
            </div>
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
                <thead>
                  <tr className="bg-gray-50">
                    {["ID viaje", "Dist. km", "Ocup. %", "Costo op.", "Prob.", "Estado"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 tracking-wider uppercase border-b border-gray-100">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viajes.map((v, i) => (
                    <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{v.ID_VIAJE}</td>
                      <td className="px-5 py-3 text-gray-500">{v.DISTANCIA_KM ?? '—'}</td>
                      <td className="px-5 py-3 text-gray-500">{v.OCUPACION_PCT ?? '—'}</td>
                      <td className="px-5 py-3 text-gray-500">{v.COSTO_OPERATIVO_TOTAL_BOB ? `BOB ${v.COSTO_OPERATIVO_TOTAL_BOB}` : '—'}</td>
                      <td className={`px-5 py-3 font-medium ${probTextClass(v.probabilidad)}`}>
                        {(v.probabilidad * 100).toFixed(1)}%
                      </td>
                      <td className="px-5 py-3">
                        <Chip alerta={v.alerta} riesgo={v.riesgo} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Estado vacío si aún no se buscó */}
      {!conductorActivo && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <IconUser size={22} />
          </div>
          <p className="text-sm font-medium text-gray-600">Ingresa un ID de conductor</p>
          <p className="text-xs text-gray-400 mt-1">Los datos se cargarán al buscar</p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Simulación — siempre visible */}
      <div>
        <h2 className="text-sm font-medium text-gray-800 mb-5 flex items-center gap-2">
          <IconWave size={15} />
          Simulación de riesgo
        </h2>

        <div className="grid grid-cols-2 gap-3.5 mb-5">
          {FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>
              <input
                type="number"
                name={key}
                placeholder={placeholder}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-blue-400 transition-colors bg-white"
              />
            </div>
          ))}
        </div>

        <button
          onClick={predecir}
          disabled={predicting}
          className="inline-flex items-center gap-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconPlay size={15} />
          {predicting ? "Analizando..." : "Analizar riesgo"}
        </button>

        {resultado && (
          <div className="mt-5 bg-gray-50 rounded-2xl p-6 grid grid-cols-3 gap-6 border border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Probabilidad</p>
              <p className={`text-2xl font-medium ${probTextClass(resultado.probabilidad)}`}>
                {(resultado.probabilidad * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Clasificación</p>
              <p className="text-2xl font-medium text-gray-800">
                {resultado.riesgo === 1 ? "Con riesgo" : "Sin riesgo"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Nivel</p>
              <div className="mt-1">
                <Chip alerta={resultado.alerta} riesgo={resultado.riesgo} />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

