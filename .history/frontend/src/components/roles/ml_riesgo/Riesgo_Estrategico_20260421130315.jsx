import React from 'react'

function NivelEstrategico() {

  const resumen = {
    totalViajes: 14000,
    riesgoGlobal: 62.66,
    probPromedio: 67
  }

  const distribucion = [
    { nivel: "CRÍTICO", valor: 7857, color: "bg-red-500" },
    { nivel: "ALTO", valor: 1128, color: "bg-orange-400" },
    { nivel: "MEDIO", valor: 1587, color: "bg-yellow-400" },
    { nivel: "BAJO", valor: 3421, color: "bg-green-500" }
  ]

  const decisiones = [
    {
      titulo: "Intervención en rutas críticas",
      descripcion: "Rutas con >95% de riesgo identificadas por el modelo",
      impacto: "Alto impacto en reducción de incidentes"
    },
    {
      titulo: "Reasignación de conductores",
      descripcion: "Conductores con >85% de riesgo deben evitar rutas críticas",
      impacto: "Optimización del desempeño operativo"
    },
    {
      titulo: "Optimización de carga y ocupación",
      descripcion: "Controlar sobrecarga y ocupación extrema en viajes",
      impacto: "Reducción directa del riesgo operativo"
    }
  ]

  return (
    <div className="container mx-auto py-6 space-y-10 text-gray-800">

      {/* ================= HEADER ================= */}
      <div className="border-b pb-3">
        <h1 className="text-2xl font-bold">
          Nivel Estratégico - Visión Ejecutiva
        </h1>
        <p className="text-gray-500 text-sm">
          Monitoreo global del riesgo y toma de decisiones corporativas
        </p>
      </div>

      {/* ================= KPIs ================= */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded border">
          <p className="text-sm text-gray-500">Total de viajes</p>
          <p className="text-xl font-bold">{resumen.totalViajes}</p>
        </div>

        <div className="bg-white p-5 rounded border">
          <p className="text-sm text-gray-500">Riesgo global</p>
          <p className="text-xl font-bold text-red-500">
            {resumen.riesgoGlobal}%
          </p>
        </div>

        <div className="bg-white p-5 rounded border">
          <p className="text-sm text-gray-500">Probabilidad promedio</p>
          <p className="text-xl font-bold text-orange-500">
            {resumen.probPromedio}%
          </p>
        </div>

      </div>

      {/* ================= DISTRIBUCIÓN ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Distribución de riesgo en la operación
        </h2>

        <div className="space-y-3">
          {distribucion.map((d, i) => (
            <div key={i} className="bg-white p-4 rounded border">

              <div className="flex justify-between mb-2">
                <span className="font-medium">{d.nivel}</span>
                <span>{d.valor} viajes</span>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded">
                <div
                  className={`h-3 rounded ${d.color}`}
                  style={{ width: `${(d.valor / 14000) * 100}%` }}
                />
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ================= DECISIONES ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Recomendaciones estratégicas
        </h2>

        <div className="space-y-3">
          {decisiones.map((d, i) => (
            <div key={i} className="bg-white p-4 rounded border">

              <p className="font-medium">{d.titulo}</p>
              <p className="text-sm text-gray-500">{d.descripcion}</p>

              <p className="text-sm mt-2 text-blue-600 font-semibold">
                {d.impacto}
              </p>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default NivelEstrategico