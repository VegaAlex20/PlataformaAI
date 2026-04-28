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

  const rutasCriticas = [
    { origen: "La Paz", destino: "Santa Cruz", distancia: 380.45, riesgo: 97.3 },
    { origen: "El Alto", destino: "Cochabamba", distancia: 493.3, riesgo: 96.2 },
    { origen: "La Paz", destino: "Oruro", distancia: 220.13, riesgo: 95.7 },
    { origen: "Cochabamba", destino: "Santa Cruz", distancia: 465.42, riesgo: 95.4 },
    { origen: "El Alto", destino: "Potosí", distancia: 383.93, riesgo: 94.6 }
  ]

  const conductoresRiesgo = [
    { id: 5, nombre: "Juan Pérez", riesgo: 93, viajes: 730 },
    { id: 10, nombre: "Luis Choque", riesgo: 91, viajes: 623 },
    { id: 43, nombre: "Carlos Mamani", riesgo: 89, viajes: 818 },
    { id: 51, nombre: "Miguel Quispe", riesgo: 90, viajes: 212 },
    { id: 82, nombre: "Diego Condori", riesgo: 92, viajes: 18 }
  ]

  const decisiones = [
    {
      titulo: "Intervención inmediata en rutas críticas",
      descripcion: "Rutas interdepartamentales con riesgo superior al 95% requieren control operativo continuo",
      impacto: "Reducción directa de incidentes en transporte de larga distancia"
    },
    {
      titulo: "Optimización de asignación de conductores",
      descripcion: "Evitar asignar conductores de alto riesgo en rutas de alta complejidad",
      impacto: "Disminución del riesgo acumulado en la operación"
    },
    {
      titulo: "Control de carga y ocupación",
      descripcion: "Gestión del peso asignado vs capacidad del vehículo",
      impacto: "Reducción de sobrecarga y fallas operativas"
    },
    {
      titulo: "Monitoreo con variables críticas del modelo",
      descripcion: "Seguimiento de distancia, ocupación, tipo de carga y condiciones climáticas",
      impacto: "Predicción temprana de eventos de riesgo"
    }
  ]

  const inversion = [
    { area: "Telemetría y monitoreo", porcentaje: 35 },
    { area: "Capacitación de conductores", porcentaje: 25 },
    { area: "Mantenimiento de flota", porcentaje: 25 },
    { area: "Optimización de rutas", porcentaje: 15 }
  ]

  return (
    <div className="container mx-auto py-6 space-y-10 text-gray-800">

      <div className="border-b pb-3">
        <h1 className="text-2xl font-bold">
          Nivel Estratégico - Visión Corporativa
        </h1>
        <p className="text-gray-500 text-sm">
          Análisis global del riesgo operativo basado en variables del modelo predictivo
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
            Rutas críticas interdepartamentales
          </h2>

          <div className="space-y-3">
            {rutasCriticas.map((r, i) => (
              <div key={i} className="bg-white p-4 rounded border">

                <div className="flex justify-between">
                  <span className="font-medium">
                    {r.origen} → {r.destino}
                  </span>
                  <span className="text-red-500 font-semibold">
                    {r.riesgo}%
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {r.distancia} km
                </p>

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

              <p className="font-bold">{c.nombre}</p>
              <p className="text-xs text-gray-500">C-{c.id}</p>

              <p className="text-red-500 font-semibold mt-1">
                {c.riesgo}%
              </p>

              <p className="text-xs text-gray-500">
                {c.viajes} viajes
              </p>

            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Inversión estratégica
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