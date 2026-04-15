import React from 'react'

function NivelEstrategico() {

  const politicas = [
    {
      id: 1,
      titulo: "Incremento de controles en viajes críticos",
      descripcion: "Monitoreo en tiempo real para viajes con probabilidad > 0.75",
      impacto: "Reduce 18% incidentes"
    },
    {
      id: 2,
      titulo: "Asignación inteligente de conductores",
      descripcion: "Conductores con menor riesgo asignados a rutas largas",
      impacto: "Reduce 22% riesgo operacional"
    },
    {
      id: 3,
      titulo: "Mantenimiento preventivo de flota",
      descripcion: "Priorización de vehículos en rutas de alto desgaste",
      impacto: "Reduce 15% costos de operación"
    }
  ]

  const inversionFlota = [
    { categoria: "Camiones nuevos", porcentaje: 45, costo: "Alta inversión" },
    { categoria: "Mantenimiento", porcentaje: 30, costo: "Medio" },
    { categoria: "Tecnología IoT", porcentaje: 15, costo: "Medio-Alto" },
    { categoria: "Capacitación conductores", porcentaje: 10, costo: "Bajo" }
  ]

  const reduccionRiesgo = {
    riesgoActual: 0.68,
    riesgoProyectado: 0.42,
    mejora: 38
  }

  return (
    <div className="container mx-auto py-6 space-y-10 text-gray-800">

      {/* ================= HEADER ================= */}
      <div className="border-b pb-3">
        <h1 className="text-2xl font-bold">
          Nivel Estratégico - Decisiones Corporativas
        </h1>
        <p className="text-gray-500 text-sm">
          Análisis de políticas, inversión y reducción de riesgo a largo plazo
        </p>
      </div>

      {/* ================= POLÍTICAS ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Políticas de seguridad y operación
        </h2>

        <div className="space-y-3">

          {politicas.map((p) => (
            <div key={p.id} className="border rounded p-4 bg-white">

              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{p.titulo}</p>
                  <p className="text-sm text-gray-500">{p.descripcion}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600">
                    {p.impacto}
                  </p>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= INVERSIÓN ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Optimización de inversión en flota
        </h2>

        <div className="grid grid-cols-2 gap-4">

          {inversionFlota.map((i, idx) => (
            <div key={idx} className="border rounded p-4 bg-white">

              <p className="font-medium">{i.categoria}</p>
              <p className="text-sm text-gray-500">{i.costo}</p>

              <div className="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-2 bg-indigo-500 rounded"
                  style={{ width: `${i.porcentaje}%` }}
                />
              </div>

              <p className="text-sm mt-1">{i.porcentaje}% del presupuesto</p>

            </div>
          ))}

        </div>
      </div>

      {/* ================= RIESGO GLOBAL ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Reducción de riesgo proyectada
        </h2>

        <div className="border rounded p-6 bg-white space-y-4">

          <div>
            <p className="text-sm text-gray-500">Riesgo actual</p>
            <p className="text-xl font-bold text-red-500">
              {(reduccionRiesgo.riesgoActual * 100).toFixed(1)}%
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Riesgo proyectado</p>
            <p className="text-xl font-bold text-green-600">
              {(reduccionRiesgo.riesgoProyectado * 100).toFixed(1)}%
            </p>
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-500">Mejora estimada</p>

            <div className="w-full h-3 bg-gray-200 rounded mt-2">
              <div
                className="h-3 bg-green-500 rounded"
                style={{ width: `${reduccionRiesgo.mejora}%` }}
              />
            </div>

            <p className="text-sm mt-1">
              {reduccionRiesgo.mejora}% reducción de riesgo a largo plazo
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default NivelEstrategico