import React, { useState } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ZAxis, CartesianGrid
} from 'recharts'

const pct = (v) => (v * 100).toFixed(0) + '%'

// DATA MÁS REALISTA (alto riesgo dominante)
const rawData = [
  { vehiculo: 'V-12', prob: 0.96, alertas: 22, velocidad: 48 },
  { vehiculo: 'V-7', prob: 0.92, alertas: 20, velocidad: 50 },
  { vehiculo: 'V-3', prob: 0.89, alertas: 18, velocidad: 52 },
  { vehiculo: 'V-21', prob: 0.86, alertas: 17, velocidad: 54 },
  { vehiculo: 'V-5', prob: 0.82, alertas: 15, velocidad: 56 },
  { vehiculo: 'V-14', prob: 0.78, alertas: 14, velocidad: 58 },
  { vehiculo: 'V-9', prob: 0.74, alertas: 12, velocidad: 60 },
  { vehiculo: 'V-18', prob: 0.70, alertas: 11, velocidad: 62 },
  { vehiculo: 'V-2', prob: 0.65, alertas: 9, velocidad: 64 },
  { vehiculo: 'V-30', prob: 0.58, alertas: 7, velocidad: 68 },
]

// clasificación
const getLevel = (p) => {
  if (p >= 0.85) return 'CRITICO'
  if (p >= 0.7) return 'ALTO'
  if (p >= 0.5) return 'MEDIO'
  return 'BAJO'
}

const colors = {
  CRITICO: '#7f1d1d',
  ALTO: '#dc2626',
  MEDIO: '#f59e0b',
  BAJO: '#16a34a'
}

// tooltip custom (clave para que se vea pro)
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="bg-white border rounded-lg p-3 text-xs shadow">
        <p className="font-medium">{d.vehiculo}</p>
        <p>Riesgo: {pct(d.prob)}</p>
        <p>Alertas: {d.alertas}</p>
        <p>Velocidad: {d.velocidad} km/h</p>
        <p>Nivel: {getLevel(d.prob)}</p>
      </div>
    )
  }
  return null
}

export default function PrediccionRetrasosPro() {

  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState(null)

  const data = rawData.filter(d =>
    filter === 'ALL' ? true : getLevel(d.prob) === filter
  )

  const promedio =
    rawData.reduce((a, b) => a + b.prob, 0) / rawData.length

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Predicción de retrasos — Análisis táctico
        </h1>
        <p className="text-sm text-gray-400">
          Relación entre riesgo, alertas y velocidad operativa
        </p>
      </div>

      {/* KPI */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-400 uppercase">
          Probabilidad promedio
        </p>
        <p className="text-3xl font-semibold">
          {pct(promedio)}
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 text-xs">
        {['ALL', 'CRITICO', 'ALTO', 'MEDIO', 'BAJO'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full border ${
              filter === f ? 'bg-gray-900 text-white' : 'bg-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* SCATTER CHART (clave) */}
      <div className="bg-white border rounded-xl p-4">

        <p className="text-xs text-gray-400 uppercase mb-3">
          Riesgo vs Velocidad (tamaño = alertas)
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="velocidad"
              name="Velocidad"
              unit=" km/h"
            />

            <YAxis
              dataKey="prob"
              name="Riesgo"
              tickFormatter={pct}
            />

            <ZAxis
              dataKey="alertas"
              range={[60, 400]}
            />

            <Tooltip content={<CustomTooltip />} />

            <Scatter
              data={data}
              onClick={(d) => setSelected(d)}
            >
              {data.map((d, i) => (
                <cell
                  key={i}
                  fill={colors[getLevel(d.prob)]}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* DETALLE SELECCIONADO */}
      {selected && (
        <div className="bg-white border rounded-xl p-4 text-sm">
          <p className="font-medium mb-2">
            {selected.vehiculo}
          </p>
          <p>Riesgo: {pct(selected.prob)}</p>
          <p>Alertas: {selected.alertas}</p>
          <p>Velocidad: {selected.velocidad} km/h</p>
          <p>Nivel: {getLevel(selected.prob)}</p>
        </div>
      )}

      {/* INSIGHT AUTOMÁTICO */}
      <div className="bg-white border rounded-xl p-4 text-sm space-y-1">
        <p className="text-xs text-gray-400 uppercase">
          Interpretación del modelo
        </p>

        <p>
          Se observa una concentración de vehículos críticos en rangos de baja velocidad y alta cantidad de alertas.
        </p>

        <p>
          El modelo identifica que la combinación de telemetría inestable y condiciones operativas genera mayor probabilidad de retraso.
        </p>

        <p>
          Los vehículos con menor riesgo mantienen velocidades más estables y menor carga de alertas.
        </p>
      </div>

    </div>
  )
}