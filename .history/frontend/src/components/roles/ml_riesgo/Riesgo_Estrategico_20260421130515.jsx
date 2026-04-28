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

  const topRutas = [
    { distancia: 380.45, riesgo: 97.3 },
    { distancia: 12.08, riesgo: 97.0 },
    { distancia: 11.83, riesgo: 96.4 },
    { distancia: 493.3, riesgo: 96.2 },
    { distancia: 220.13, riesgo: 95.7 }
  ]

  const conductoresRiesgo = [
    { id: 5, riesgo: 93, viajes: 730 },
    { id: 10, riesgo: 91, viajes: 623 },
    { id: 43, riesgo: 89, viajes: 818 },
    { id: 51, riesgo: 90, viajes: 212 },
    { id: 82, riesgo: 92, viajes: 18 }
  ]

  const decisiones = [
    {
      titulo: "Intervención inmediata en rutas críticas",
      descripcion: "Rutas con riesgo superior al 95% requieren monitoreo continuo y control operativo",
      impacto: "Reducción directa de incidentes en zonas de alta exposición"
    },
    {
      titulo: "Optimización de asignación de conductores",
      descripcion: "Evitar asignar conductores con alto riesgo a rutas complejas",
      impacto: "Mejora del desempeño y reducción del riesgo acumulado"
    },
    {
      titulo: "Control de ocupación y carga",
      descripcion: "Evitar sobrecarga y ocupación ineficiente en viajes",
      impacto: "Disminución de fallas operativas y eventos críticos"
    },
    {
      titulo: "Fortalecimiento de monitoreo en tiempo real",
      descripcion: "Mayor uso de telemetría en viajes críticos",
      impacto: "Prevención proactiva de eventos de riesgo"
    }
  ]

  const inversion = [
    { area: "Monitoreo y telemetría", porcentaje: 35 },
    { area: "Capacitación conductores", porcentaje: 25 },
    { area: "Mantenimiento flota", porcentaje: 25 },
    { area: "Optimización rutas", porcentaje: 15 }
  ]

  return (
    <div className="container mx-auto py-6 space-y-10 text-gray-800">

      <div className="border-b pb-3">
        <h1 className="text-2xl font-bold">
          Nivel Estratégico - Visión Corporativa
        </h1>
        <p className="text-gray-500 text-sm">
          Análisis global del riesgo, eficiencia y toma de decisiones empresariales
        </p>
      </div>

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

      <div className="grid grid-cols-2 gap-6">

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Distribución de riesgo
          </h2>

          <div className="space-y-3">
            {distribucion.map((d, i) => (
              <div key={i} className="bg-white p-4 rounded border">

                <div className="flex justify-between mb-2">
                  <span className="font-medium">{d.nivel}</span>
                  <span>{d.valor}</span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded">
                  <div
                    className={`h-3 rounded ${d.color}`}
                    style={{ width: `${(d.valor / resumen.totalViajes) * 100}%` }}
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Rutas críticas
          </h2>

          <div className="space-y-3">
            {topRutas.map((r, i) => (
              <div key={i} className="bg-white p-4 rounded border flex justify-between">
                <span>{r.distancia} km</span>
                <span className="text-red-500 font-semibold">
                  {r.riesgo}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Conductores de alto riesgo
        </h2>

        <div className="grid grid-cols-5 gap-4">
          {conductoresRiesgo.map((c, i) => (
            <div key={i} className="bg-white p-4 rounded border text-center">
              <p className="font-bold">C-{c.id}</p>
              <p className="text-red-500 font-semibold">{c.riesgo}%</p>
              <p className="text-xs text-gray-500">{c.viajes} viajes</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Inversión estratégica sugerida
        </h2>

        <div className="space-y-3">
          {inversion.map((i, idx) => (
            <div key={idx} className="bg-white p-4 rounded border">

              <div className="flex justify-between">
                <span>{i.area}</span>
                <span>{i.porcentaje}%</span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-2 bg-indigo-500 rounded"
                  style={{ width: `${i.porcentaje}%` }}
                />
              </div>

            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Decisiones estratégicas
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