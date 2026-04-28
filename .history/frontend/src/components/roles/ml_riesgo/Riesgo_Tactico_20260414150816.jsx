import React, { useEffect, useState } from 'react'

function NivelTactico() {

  const [data, setData] = useState(null)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analisis-tactico/")
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) {
    return <p className="p-6 text-gray-500">Cargando análisis táctico...</p>
  }

  const kpi = data.kpi || {}

  return (
    <div className="container mx-auto py-6 space-y-10 text-gray-800">
<h1 className="text-xl font-medium text-gray-900 leading-tight">Nivel Táctico</h1>
      {/* ================= KPI ================= */}
      <div className="grid grid-cols-3 gap-4">

        <div className="border rounded p-4 bg-white">
          <p className="text-sm text-gray-500">Total viajes</p>
          <p className="text-2xl font-bold">{kpi.total_viajes}</p>
        </div>

        <div className="border rounded p-4 bg-white">
          <p className="text-sm text-gray-500">Riesgo global</p>
          <p className="text-2xl font-bold">{kpi.riesgo_pct}%</p>
        </div>

        <div className="border rounded p-4 bg-white">
          <p className="text-sm text-gray-500">Probabilidad promedio</p>
          <p className="text-2xl font-bold">{kpi.probabilidad_promedio}</p>
        </div>

      </div>

      {/* ================= TOP RIESGO ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Top conductores de riesgo</h2>

        <div className="space-y-3">

          {data.top_conductores_riesgo?.map((c, i) => (
            <div key={i} className="border rounded p-4 bg-white">

              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Conductor {c.ID_CONDUCTOR}</p>
                  <p className="text-sm text-gray-500">
                    Viajes: {c.VIAJES} | Casos: {c.CASOS_RIESGO}
                  </p>
                </div>

                <p className="font-bold text-red-600">
                  {(c.RIESGO_PROMEDIO * 100).toFixed(1)}%
                </p>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-2 bg-red-500 rounded"
                  style={{ width: `${c.RIESGO_PROMEDIO * 100}%` }}
                />
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= TOP BUENOS ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Conductores más eficientes</h2>

        <div className="space-y-3">

          {data.top_conductores_buenos?.map((c, i) => (
            <div key={i} className="border rounded p-4 bg-white">

              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Conductor {c.ID_CONDUCTOR}</p>
                  <p className="text-sm text-gray-500">
                    Viajes: {c.VIAJES}
                  </p>
                </div>

                <p className="font-bold text-green-600">
                  {(c.RIESGO_PROMEDIO * 100).toFixed(1)}%
                </p>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{ width: `${Math.max(5, c.RIESGO_PROMEDIO * 100)}%` }}
                />
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= DISTRIBUCIÓN ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Distribución de riesgo</h2>

        <div className="border rounded p-4 bg-white space-y-2">

          {data.distribucion_riesgo?.map((d, i) => (
            <div key={i} className="flex items-center gap-3">

              <div className="w-28 text-sm">{d.categoria}</div>

              <div className="flex-1 h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${(d.cantidad / kpi.total_viajes) * 100}%` }}
                />
              </div>

              <div className="w-10 text-sm text-right">
                {d.cantidad}
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= RUTAS ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Rutas críticas</h2>

        <table className="w-full border bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Distancia</th>
              <th className="p-2 text-left">Riesgo</th>
            </tr>
          </thead>

          <tbody>
            {data.top_rutas?.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.DISTANCIA_KM} km</td>
                <td className="p-2">
                  {(r.probabilidad * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= EFICIENCIA ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Eficiencia operativa</h2>

        <div className="grid grid-cols-2 gap-3">

          {data.eficiencia_operativa?.map((e, i) => (
            <div key={i} className="border rounded p-4 bg-white">

              <p className="font-medium">Conductor {e.ID_CONDUCTOR}</p>

              <p className="text-sm text-gray-500">
                Costo promedio: BOB {e.costo_total?.toFixed(2)}
              </p>

              <p className="text-sm">
                Riesgo: {(e.probabilidad * 100).toFixed(1)}%
              </p>

              <div className="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-2 bg-indigo-500 rounded"
                  style={{ width: `${e.probabilidad * 100}%` }}
                />
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  )
}

export default NivelTactico