import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import Navbar from '../../navigation/Navbar'
const pct = (v) => (v * 100).toFixed(0) + '%'
const pctFmt = (v) => (v * 100).toFixed(1) + '%'

function RiskPill({ value }) {
  const p = (value || 0) * 100
  if (p >= 80) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Crítico</span>
  if (p >= 65) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Alto</span>
  if (p >= 40) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Medio</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Bajo</span>
}

function MiniBar({ value, color }) {
  const safe = value || 0
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(3, safe * 100)}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium w-9 text-right" style={{ color }}>
        {pct(safe)}
      </span>
    </div>
  )
}

function KpiCard({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value || '--'}</p>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-xs font-medium text-gray-400 uppercase mb-3">{title}</p>
      {children}
    </div>
  )
}

export default function NivelTactico() {
  const [data, setData] = useState(null)

  // 🔥 NUEVO: modal state
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [open, setOpen] = useState(false)

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
    return <div className="text-center mt-20 text-gray-400">Cargando...</div>
  }

  if (data.error) {
    return <div className="text-red-500 text-center mt-20">Error backend</div>
  }

  const kpi = data.kpi || {}
  const total = kpi.total_viajes || 1

  const efData = (data.eficiencia_operativa || []).map(e => ({
    name: `C-${e.ID_CONDUCTOR}`,
    costo: +((e.costo_total || 0).toFixed(0)),
    riesgo: e.probabilidad || 0,
  }))

  const viajesDriver = (data.viajes || []).filter(
    v => v.ID_CONDUCTOR === selectedDriver
  )

  return (
    <>
      <Navbar/>
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-5 text-gray-800">

      {/* HEADER */}
      <div className="flex justify-between border-b pb-4">
        <h1 className="text-2xl">Nivel táctico — Flota</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Total viajes" value={kpi.total_viajes?.toLocaleString()} />
        <KpiCard label="Riesgo global" value={`${kpi.riesgo_pct}%`} />
        <KpiCard label="Prob. promedio" value={`${(kpi.probabilidad_promedio * 100).toFixed(0)}%`} />
      </div>

      {/* CONDUCTORES */}
      <div className="grid grid-cols-2 gap-3">

        <Panel title="Conductores en riesgo">
          {data.top_conductores_riesgo?.map((c, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-xs">
                <span>C-{c.ID_CONDUCTOR}</span>
                <span>{c.VIAJES} viajes</span>
              </div>

              <MiniBar value={c.RIESGO_PROMEDIO} color="#E24B4A" />

              {/* 🔥 BOTÓN */}
              <button
                onClick={() => {
                  setSelectedDriver(c.ID_CONDUCTOR)
                  setOpen(true)
                }}
                className="text-[10px] text-blue-500 mt-1"
              >
                Ver más
              </button>
            </div>
          ))}
        </Panel>

        <Panel title="Conductores eficientes">
          {data.top_conductores_buenos?.map((c, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-xs">
                <span>C-{c.ID_CONDUCTOR}</span>
                <span>{c.VIAJES} viajes</span>
              </div>

              <MiniBar value={c.RIESGO_PROMEDIO} color="#639922" />

              {/* 🔥 BOTÓN */}
              <button
                onClick={() => {
                  setSelectedDriver(c.ID_CONDUCTOR)
                  setOpen(true)
                }}
                className="text-[10px] text-blue-500 mt-1"
              >
                Ver más
              </button>
            </div>
          ))}
        </Panel>
      </div>

      {/* DISTRIBUCIÓN */}
      <Panel title="Distribución de riesgo">
        {data.distribucion_riesgo?.map((d, i) => {
          const p = (d.cantidad / total * 100).toFixed(0)
          return (
            <div key={i} className="flex justify-between text-xs">
              <span>{d.categoria}</span>
              <span>{p}%</span>
            </div>
          )
        })}
      </Panel>

      {/* RUTAS */}
      <Panel title="Rutas críticas">
        {data.top_rutas?.map((r, i) => (
          <div key={i} className="flex justify-between text-xs mb-1">
            <span>{r.ruta_nombre}</span>
            <span>{pctFmt(r.riesgo_promedio)}</span>
          </div>
        ))}
      </Panel>

      {/* CHART */}
      <Panel title="Costo vs riesgo">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={efData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="costo">
              {efData.map((e, i) => (
                <Cell key={i} fill={e.riesgo > 0.4 ? '#F0997B' : '#5DCAA5'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* 🔥 MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] max-h-[80vh] rounded-xl p-4 overflow-y-auto">

            <div className="flex justify-between mb-3">
              <h2 className="font-medium">Detalle conductor C-{selectedDriver}</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400">
                  <th>ID</th>
                  <th>Ruta</th>
                  <th>Km</th>
                  <th>Riesgo</th>
                </tr>
              </thead>

              <tbody>
                {viajesDriver.map((v, i) => (
                  <tr key={i}>
                    <td>{v.ID_VIAJE}</td>
                    <td>{v.ruta_nombre}</td>
                    <td>{Number(v.DISTANCIA_KM).toFixed(0)}</td>
                    <td><RiskPill value={v.probabilidad} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      )}

    </div>
    </>
  )
}