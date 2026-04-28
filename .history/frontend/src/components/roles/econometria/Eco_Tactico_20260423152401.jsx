import React, { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

function Eco_Tactico() {

  const [peso, setPeso] = useState(50)
  const [distancia, setDistancia] = useState(700)
  const [precio, setPrecio] = useState(800)

  const [resultado, setResultado] = useState(null)
  const [resumen, setResumen] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const formatear = (num) =>
    new Intl.NumberFormat("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num || 0)

  // 🔹 cargar resumen
  useEffect(() => {
    fetch("http://localhost:8000/api/econometria/resumen/")
      .then(res => res.json())
      .then(data => {
        if (!data.por_segmento) {
          console.error("Backend mal formado:", data)
        }
        setResumen(data)
      })
      .catch(() => setError("Error cargando resumen"))
  }, [])

  // 🔹 predicción manual
  const predecir = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `http://localhost:8000/api/econometria/predecir/?peso=${peso}&distancia=${distancia}&precio=${precio}`
      )

      const data = await res.json()

      if (!res.ok || data.ingreso_estimado === undefined) {
        throw new Error()
      }

      setResultado(data.ingreso_estimado)

    } catch {
      setError("Error en predicción")
      setResultado(null)
    }

    setLoading(false)
  }

  // 🔹 DATA SEGURA PARA GRAFICOS
  const dataComparacion = (resumen && resultado !== null)
    ? [
        { name: "Promedio", valor: resumen.ingreso_promedio || 0 },
        { name: "Simulación", valor: resultado || 0 }
      ]
    : []

  const dataSegmento = resumen?.por_segmento
    ? Object.entries(resumen.por_segmento).map(([k, v]) => ({
        name: k,
        valor: Number(v) || 0
      }))
    : []

  const dataCiudad = resumen?.por_ciudad
    ? Object.entries(resumen.por_ciudad)
        .map(([k, v]) => ({ name: k, valor: Number(v) }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5)
    : []

  const insight = () => {
    if (!resumen || resultado === null) return ""

    if (resultado > resumen.ingreso_promedio) {
      return "El ingreso estimado está por encima del promedio histórico. Escenario favorable."
    } else {
      return "El ingreso estimado está por debajo del promedio. Se recomienda ajustar variables."
    }
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "1200px", margin: "auto" }}>

      <h1>Panel táctico de ingresos</h1>

      {/* FORMULARIO */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "20px" }}>
        <input type="number" value={peso} onChange={e => setPeso(Number(e.target.value))} placeholder="Peso (kg)" />
        <input type="number" value={distancia} onChange={e => setDistancia(Number(e.target.value))} placeholder="Distancia (km)" />
        <input type="number" value={precio} onChange={e => setPrecio(Number(e.target.value))} placeholder="Precio (BOB)" />
      </div>

      <button onClick={predecir} style={{ marginTop: "10px", padding: "10px", width: "100%" }}>
        Simular ingreso
      </button>

      {/* SLIDERS */}
      <div style={{ marginTop: "30px" }}>
        <h3>Simulación interactiva</h3>

        <p>Peso: {peso} kg</p>
        <input type="range" min="1" max="500" value={peso} onChange={e => setPeso(Number(e.target.value))} />

        <p>Distancia: {distancia} km</p>
        <input type="range" min="10" max="1500" value={distancia} onChange={e => setDistancia(Number(e.target.value))} />

        <p>Precio: {precio} BOB</p>
        <input type="range" min="10" max="2000" value={precio} onChange={e => setPrecio(Number(e.target.value))} />
      </div>

      {/* KPIs */}
      {resultado !== null && (
        <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
          <div style={card}>
            <h4>Ingreso estimado</h4>
            <h2>{formatear(resultado)} BOB</h2>
          </div>

          {resumen && (
            <div style={card}>
              <h4>Promedio histórico</h4>
              <h2>{formatear(resumen.ingreso_promedio)}</h2>
            </div>
          )}

          {resumen && (
            <div style={card}>
              <h4>Diferencia</h4>
              <h2>{formatear(resultado - resumen.ingreso_promedio)}</h2>
            </div>
          )}
        </div>
      )}

      {/* INSIGHT */}
      <p style={{ marginTop: "15px" }}>{insight()}</p>

      {/* GRAFICO COMPARACION */}
      {dataComparacion.length > 0 && (
        <div style={{ marginTop: "40px", height: "300px" }}>
          <h3>Comparación</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataComparacion}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* SEGMENTOS */}
      {dataSegmento.length > 0 && (
        <div style={{ marginTop: "40px", height: "300px" }}>
          <h3>Ingresos por segmento</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataSegmento}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* CIUDADES */}
      {dataCiudad.length > 0 && (
        <div style={{ marginTop: "40px", height: "300px" }}>
          <h3>Top ciudades</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataCiudad}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

    </div>
  )
}

const card = {
  flex: 1,
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "#f9f9f9"
}

export default Eco_Tactico