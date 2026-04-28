import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

const pct = (v) => (v * 100).toFixed(0) + '%'
const pctFmt = (v) => (v * 100).toFixed(1) + '%'

function RiskPill({ value }) {
  const p = value * 100
  if (p >= 60) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Alto</span>
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
      .catch(console.error)
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Cargando análisis táctico...
      </div>
    )
  }

  const kpi = data.kpi || {}
  const total = kpi.total_viajes || 1

  const efData = (data.eficiencia_operativa || []).map(e => ({
    name: `C-${e.ID_CONDUCTOR}`,
    costo: +e.costo_total?.toFixed(0),
    riesgo: e.probabilidad,
  }))

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-5 text-gray-800">

      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-medium text-gray-900">Nivel táctico — Flota</h1>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Vista ejecutiva</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Total viajes" value={kpi.total_viajes?.toLocaleString()} sub="período actual" />
        <KpiCard label="Riesgo global" value={`${kpi.riesgo_pct}%`} sub="viajes en riesgo" />
        <KpiCard label="Prob. promedio" value={`${(kpi.probabilidad_promedio * 100).toFixed(0)}%`} sub="índice riesgo" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Panel title="Conductores en riesgo">
          <div className="space-y-3">
            {data.top_conductores_riesgo?.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {c.NOMBRE || 'Sin nombre'} (C-{c.ID_CONDUCTOR})
                  </span>
                  <span className="text-xs text-gray-400">
                    {c.VIAJES} viajes · {c.CASOS_RIESGO} casos
                  </span>
                </div>
                <MiniBar value={c.RIESGO_PROMEDIO} color="#E24B4A" />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Conductores eficientes">
          <div className="space-y-3">
            {data.top_conductores_buenos?.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {c.NOMBRE || 'Sin nombre'} (C-{c.ID_CONDUCTOR})
                  </span>
                  <span className="text-xs text-gray-400">{c.VIAJES} viajes</span>
                </div>
                <MiniBar value={c.RIESGO_PROMEDIO} color="#639922" />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Panel title="Distribución de riesgo">
          <div className="space-y-2">
            {data.distribucion_riesgo?.map((d, i) => {
              const colors = { BAJO: '#639922', MEDIO: '#EF9F27', ALTO: '#E24B4A', CRITICO: '#A32D2D' }
              const p = (d.cantidad / total * 100).toFixed(0)
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16">{d.categoria}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p}%`, background: colors[d.categoria] || '#888' }} />
                  </div>
                  <span className="text-xs text-gray-400 w-10 text-right">{d.cantidad}</span>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel title="Rutas críticas">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400">
                <th className="pb-2 text-left font-medium">Ruta</th>
                <th className="pb-2 text-left font-medium">Riesgo</th>
                <th className="pb-2 text-left font-medium">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.top_rutas?.map((r, i) => (
                <tr key={i}>
                  <td className="py-1.5 text-gray-700">
                    <div className="font-medium">
                      {r.origen} → {r.destino}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {r.codigo_ruta} · {Number(r.distancia_km).toFixed(0)} km · {r.viajes} viajes
                    </div>
                  </td>
                  <td className="py-1.5 text-gray-700">{pctFmt(r.riesgo_promedio)}</td>
                  <td className="py-1.5">
                    <RiskPill value={r.riesgo_promedio} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel title="Eficiencia operativa — costo vs. riesgo">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={efData} barSize={28}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `Bs ${v}`} />
            <Tooltip
              formatter={(v, n) => [n === 'costo' ? `Bs ${v}` : `${(v * 100).toFixed(1)}%`, n === 'costo' ? 'Costo' : 'Riesgo']}
            />
            <Bar dataKey="costo" radius={[4, 4, 0, 0]}>
              {efData.map((e, i) => (
                <Cell key={i} fill={e.riesgo > 0.4 ? '#F0997B' : '#5DCAA5'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#F0997B' }} />
            Conductor en riesgo
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#5DCAA5' }} />
            Conductor eficiente
          </span>
        </div>
      </Panel>

    </div>
  )
}