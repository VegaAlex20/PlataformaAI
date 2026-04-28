import React, { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line
} from "recharts"

function Eco_Tactico() {

  const [peso, setPeso] = useState(50)
  const [distancia, setDistancia] = useState(700)
  const [precio, setPrecio] = useState(800)

  const [resultado, setResultado] = useState(null)
  const [resumen, setResumen] = useState(null)

  const [simulaciones, setSimulaciones] = useState([])

  const fmt = (n) =>
    new Intl.NumberFormat("es-BO", { minimumFractionDigits: 2 }).format(n || 0)

  useEffect(() => {
    fetch("http://localhost:8000/api/econometria/resumen/")
      .then(r => r.json())
      .then(setResumen)
  }, [])

  const predecir = async () => {
    const res = await fetch(
      `http://localhost:8000/api/econometria/predecir/?peso=${peso}&distancia=${distancia}&precio=${precio}`
    )
    const data = await res.json()

    setResultado(data.ingreso_estimado)

    // guardar histórico de simulaciones
    setSimulaciones(prev => [
      ...prev,
      {
        peso,
        distancia,
        precio,
        ingreso: data.ingreso_estimado
      }
    ])
  }

  // 🔥 INSIGHT REAL
  const insight = () => {
    if (!resultado || !resumen) return ""

    const diff = resultado - resumen.ingreso_promedio

    if (diff > 200)
      return "Escenario altamente rentable. Puedes escalar este tipo de envío."
    if (diff > 0)
      return "Por encima del promedio. Buen nivel de ingreso."
    if (diff > -200)
      return "Margen bajo. Ajusta precio o reduce costos."
    return "Escenario no rentable. Evitar estas condiciones."
  }

  // 🔥 RECOMENDACIONES AUTOMÁTICAS
  const recomendaciones = () => {
    if (!resultado || !resumen) return []

    let rec = []

    if (precio < 600) rec.push("Subir precio")
    if (distancia > 900) rec.push("Optimizar ruta")
    if (peso < 20) rec.push("Consolidar carga")

    return rec
  }

  // 🔥 SENSIBILIDAD DE PRECIO
  const curvaPrecio = []
  for (let p = precio * 0.5; p <= precio * 1.5; p += precio * 0.1) {
    curvaPrecio.push({
      precio: Math.round(p),
      ingreso: resultado ? resultado * (p / precio) : 0
    })
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "1200px", margin: "auto" }}>

      <h1>Panel táctico de ingresos</h1>

      {/* CONTROLES */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        <input type="number" value={peso} onChange={e => setPeso(Number(e.target.value))} />
        <input type="number" value={distancia} onChange={e => setDistancia(Number(e.target.value))} />
        <input type="number" value={precio} onChange={e => setPrecio(Number(e.target.value))} />
      </div>

      <button onClick={predecir} style={{ marginTop: "10px", padding: "10px", width: "100%" }}>
        Simular
      </button>

      {/* KPI */}
      {resultado && resumen && (
        <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>

          <div style={card}>
            <h4>Ingreso estimado</h4>
            <h2>{fmt(resultado)}</h2>
          </div>

          <div style={card}>
            <h4>Promedio</h4>
            <h2>{fmt(resumen.ingreso_promedio)}</h2>
          </div>

          <div style={card}>
            <h4>Diferencia</h4>
            <h2>{fmt(resultado - resumen.ingreso_promedio)}</h2>
          </div>

        </div>
      )}

      {/* INSIGHT */}
      {resultado && (
        <div style={{ marginTop: "20px", padding: "15px", background: "#eee" }}>
          {insight()}
        </div>
      )}

      {/* RECOMENDACIONES */}
      {resultado && (
        <div style={{ marginTop: "20px" }}>
          <h3>Recomendaciones</h3>
          <ul>
            {recomendaciones().map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* COMPARACION */}
      {resultado && resumen && (
        <div style={{ height: "300px", marginTop: "40px" }}>
          <h3>Comparación</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: "Promedio", valor: resumen.ingreso_promedio },
              { name: "Simulación", valor: resultado }
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* SEGMENTO */}
      {resumen && (
        <div style={{ height: "300px", marginTop: "40px" }}>
          <h3>Segmentos</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={
              Object.entries(resumen.por_segmento).map(([k, v]) => ({
                name: k,
                valor: v
              }))
            }>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 🔥 CURVA DE PRECIO (ORO PURO) */}
      {resultado && (
        <div style={{ height: "300px", marginTop: "40px" }}>
          <h3>Sensibilidad al precio</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curvaPrecio}>
              <XAxis dataKey="precio" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ingreso" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* HISTORIAL */}
      {simulaciones.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>Historial de simulaciones</h3>
          {simulaciones.slice(-5).map((s, i) => (
            <div key={i} style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>
              {s.peso}kg - {s.distancia}km - {s.precio} → {fmt(s.ingreso)}
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
  borderRadius: "10px"
}

export default Eco_Tactico