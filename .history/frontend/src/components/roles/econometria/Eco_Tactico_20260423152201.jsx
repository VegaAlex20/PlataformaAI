import React, { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

function Eco_Tactico() {

  const [peso, setPeso] = useState(50)
  const [distancia, setDistancia] = useState(700)
  const [precio, setPrecio] = useState(800)

  const [resultado, setResultado] = useState(0)
  const [resumen, setResumen] = useState(null)

  const formatear = (num) =>
    new Intl.NumberFormat("es-BO", { maximumFractionDigits: 2 }).format(num)

  // cargar resumen
  useEffect(() => {
    fetch("http://localhost:8000/api/econometria/resumen/")
      .then(r => r.json())
      .then(setResumen)
  }, [])

  // predicción automática (reactivo)
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:8000/api/econometria/predecir/?peso=${peso}&distancia=${distancia}&precio=${precio}`
      )
      const data = await res.json()
      setResultado(data.ingreso_estimado)
    }
    fetchData()
  }, [peso, distancia, precio])

  const dataComparacion = resumen ? [
    { name: "Promedio", valor: resumen.ingreso_promedio },
    { name: "Simulación", valor: resultado }
  ] : []

  const dataSegmento = resumen
    ? Object.entries(resumen.por_segmento).map(([k, v]) => ({
        name: k,
        valor: v
      }))
    : []

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      <h1>Panel táctico de ingresos</h1>

      {/* KPIs */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={card}>
          <h4>Ingreso estimado</h4>
          <h2>{formatear(resultado)} BOB</h2>
        </div>

        {resumen && (
          <div style={card}>
            <h4>Promedio histórico</h4>
            <h2>{formatear(resumen.ingreso_promedio)} BOB</h2>
          </div>
        )}

        {resumen && (
          <div style={card}>
            <h4>Diferencia</h4>
            <h2>{formatear(resultado - resumen.ingreso_promedio)}</h2>
          </div>
        )}
      </div>

      {/* CONTROLES */}
      <div style={{ marginTop: "40px" }}>
        <h3>Simulación interactiva</h3>

        <label>Peso: {peso} kg</label>
        <input type="range" min="1" max="500" value={peso} onChange={e => setPeso(e.target.value)} />

        <label>Distancia: {distancia} km</label>
        <input type="range" min="10" max="1500" value={distancia} onChange={e => setDistancia(e.target.value)} />

        <label>Precio: {precio} BOB</label>
        <input type="range" min="10" max="2000" value={precio} onChange={e => setPrecio(e.target.value)} />
      </div>

      {/* GRAFICO COMPARACION */}
      <div style={{ marginTop: "50px", height: "300px" }}>
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

      {/* SEGMENTOS */}
      <div style={{ marginTop: "50px", height: "300px" }}>
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

      {/* RANKING */}
      {resumen && (
        <div style={{ marginTop: "40px" }}>
          <h3>Ranking de ciudades</h3>
          {Object.entries(resumen.por_ciudad)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([c, v], i) => (
              <div key={c} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px",
                borderBottom: "1px solid #ddd"
              }}>
                <span>{i + 1}. {c}</span>
                <strong>{formatear(v)} BOB</strong>
              </div>
            ))}
        </div>
      )}

    </div>
  )
}

const card = {
  flex: 1,
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "#fafafa"
}

export default Eco_Tactico