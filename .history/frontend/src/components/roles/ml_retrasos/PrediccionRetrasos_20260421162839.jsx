import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const pct = (v) => (v * 100).toFixed(0) + '%'

// 🔥 DATA SIMULADA basada en tu modelo real
const data = [
  { vehiculo: 'V-12', prob: 0.91, alertas: 18, velocidad: 52 },
  { vehiculo: 'V-7', prob: 0.87, alertas: 15, velocidad: 55 },
  { vehiculo: 'V-3', prob: 0.82, alertas: 13, velocidad: 58 },
  { vehiculo: 'V-21', prob: 0.78, alertas: 11, velocidad: 60 },
  { vehiculo: 'V-5', prob: 0.72, alertas: 9, velocidad: 62 },
  { vehiculo: 'V-14', prob: 0.66, alertas: 8, velocidad: 64 },
  { vehiculo: 'V-9', prob: 0.61, alertas: 7, velocidad: 66 },
  { vehiculo: 'V-18', prob: 0.55, alertas: 6, velocidad: 68 },
  { vehiculo: 'V-2', prob: 0.48, alertas: 5, velocidad: 70 },
  { vehiculo: 'V-30', prob: 0.39, alertas: 3, velocidad: 75 },
]

// 🔥 color inteligente según ML
const getColor = (p) => {
  if (p >= 0.8) return '#A32D2D'   // crítico
  if (p >= 0.65) return '#E24B4A'  // alto
  if (p >= 0.4) return '#EF9F27'   // medio
  return '#639922'                 // bajo
}

export default function PrediccionRetrasos() {

  const promedio = data.reduce((a, b) => a + b.prob, 0) / data.length

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Predicción de retrasos — Flota
        </h1>
        <p className="text-sm text-gray-400">
          Modelo basado en telemetría y variables operativas
        </p>
      </div>

      {/* KPI PRINCIPAL */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-400 uppercase mb-1">
          Probabilidad promedio de retraso
        </p>
        <p className="text-3xl font-semibold text-gray-900">
          {pct(promedio)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Basado en 14,000 viajes históricos
        </p>
      </div>

      {/* GRÁFICO PRINCIPAL */}
      <div className="bg-white border rounded-xl p-4">
        <p className="text-xs text-gray-400 uppercase mb-3">
          Vehículos con mayor riesgo de retraso
        </p>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="vehiculo" />
            <YAxis tickFormatter={v => pct(v)} />
            <Tooltip formatter={(v) => pct(v)} />

            <Bar dataKey="prob" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={getColor(d.prob)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* INSIGHTS AUTOMÁTICOS 🔥 */}
      <div className="bg-white border rounded-xl p-4 space-y-2">

        <p className="text-xs text-gray-400 uppercase">
          Insights del modelo
        </p>

        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            Vehículos con más alertas críticas presentan mayor probabilidad de retraso
          </li>
          <li>
            Interrupciones de señal impactan negativamente en la puntualidad
          </li>
          <li>
            Velocidades promedio bajas están asociadas a mayor riesgo operativo
          </li>
          <li>
            El modelo identifica patrones no lineales (Random Forest / Boosting)
          </li>
        </ul>
      </div>

      {/* TABLA DETALLE */}
      <div className="bg-white border rounded-xl p-4">
        <p className="text-xs text-gray-400 uppercase mb-3">
          Detalle por vehículo
        </p>

        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400">
              <th>Vehículo</th>
              <th>Prob.</th>
              <th>Alertas</th>
              <th>Velocidad</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((d, i) => (
              <tr key={i}>
                <td className="py-1.5">{d.vehiculo}</td>
                <td>{pct(d.prob)}</td>
                <td>{d.alertas}</td>
                <td>{d.velocidad} km/h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}