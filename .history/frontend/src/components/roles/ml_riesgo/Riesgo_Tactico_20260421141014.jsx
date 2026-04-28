import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

const pct = (v) => (v * 100).toFixed(0) + '%'
const pctFmt = (v) => (v * 100).toFixed(1) + '%'

function RiskPill({ value }) {
  const p = value * 100
  if (p >= 80) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Crítico</span>
  if (p >= 65) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Alto</span>
  if (p >= 40) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Medio</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Bajo</span>
}

function MiniBar({ value, color }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.max(3, value * 100)}%`, background: color }} />
      </div>
      <span className="text-xs font-medium w-9 text-right" style={{ color }}>{pct(value)}</span>
    </div>
  )
}

function KpiCard({ label, value, sub }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">{title}</p>
      {children}
    </div>
  )
}

export default function NivelTactico() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/analisis-tactico/')
      .then(r => r.json())
      .then(setData)
      .catch(err => {
        console.error(err)
        setData({ error: true })
      })
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Cargando análisis táctico...
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error cargando datos 😢 (backend caído)
      </div>
    )
  }

  const kpi = data.kpi || {}
  const rutas = data.top_rutas || []
  const viajes = data.viajes || []

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-5 text-gray-800">

      {/* header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-medium text-gray-900">Nivel táctico — Flota</h1>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Vista ejecutiva</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Total viajes" value={kpi.total_viajes?.toLocaleString()} />
        <KpiCard label="Riesgo global" value={`${kpi.riesgo_pct}%`} />
        <KpiCard label="Prob. promedio" value={`${(kpi.probabilidad_promedio * 100).toFixed(0)}%`} />
      </div>

      {/* RUTAS REALES */}
      <Panel title="Rutas críticas (reales)">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400">
              <th className="pb-2 text-left">Ruta</th>
              <th className="pb-2 text-left">Riesgo</th>
              <th className="pb-2 text-left">Nivel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rutas.map((r, i) => (
              <tr key={i}>
                <td className="py-1.5 text-gray-700">
                  <div className="font-medium">
                    {r.ruta_nombre}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    ID Ruta: {r.ID_RUTA}
                  </div>
                </td>
                <td>{pctFmt(r.probabilidad)}</td>
                <td><RiskPill value={r.probabilidad} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {/* VIAJES DETALLE */}
      <Panel title="Viajes (sample)">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400">
              <th>ID</th>
              <th>Ruta</th>
              <th>Distancia</th>
              <th>Riesgo</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {viajes.slice(0, 10).map((v, i) => (
              <tr key={i}>
                <td>{v.ID_VIAJE}</td>
                <td>{v.ruta_nombre}</td>
                <td>{Number(v.DISTANCIA_KM).toFixed(0)} km</td>
                <td><RiskPill value={v.probabilidad} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

    </div>
  )
}