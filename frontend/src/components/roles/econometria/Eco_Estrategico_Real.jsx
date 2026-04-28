import React, { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"

function Eco_Estrategico() {

  const [data, setData] = useState(null)

  const fmt = (n) =>
    new Intl.NumberFormat("es-BO", { minimumFractionDigits: 2 }).format(n || 0)

  useEffect(() => {
    fetch("http://localhost:8000/api/econometria/resumen/")
      .then(r => r.json())
      .then(setData)
  }, [])

  if (!data) return <p>Cargando análisis estratégico...</p>

  // 🔥 transformar datos
  const segmentos = Object.entries(data.por_segmento).map(([k, v]) => ({
    name: k,
    valor: v
  }))

  const ciudades = Object.entries(data.por_ciudad)
    .map(([k, v]) => ({ name: k, valor: v }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5)

  const total = segmentos.reduce((acc, s) => acc + s.valor, 0)

  const participacion = segmentos.map(s => ({
    name: s.name,
    value: (s.valor / total) * 100
  }))

  const mejorSegmento = segmentos.sort((a, b) => b.valor - a.valor)[0]
  const peorSegmento = segmentos.sort((a, b) => a.valor - b.valor)[0]

  const mejorCiudad = ciudades[0]

  // 🔥 insight automático (esto es lo que vende)
  const insight = () => {
    return `
Segmento más rentable: ${mejorSegmento.name}
Ciudad más fuerte: ${mejorCiudad.name}
Segmento débil: ${peorSegmento.name}
    `
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "1200px", margin: "auto" }}>

      <h1>Panel estratégico</h1>

      {/* KPIs */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

        <div style={card}>
          <h4>Ingreso promedio</h4>
          <h2>{fmt(data.ingreso_promedio)}</h2>
        </div>

        <div style={card}>
          <h4>Mejor segmento</h4>
          <h2>{mejorSegmento.name}</h2>
        </div>

        <div style={card}>
          <h4>Mejor ciudad</h4>
          <h2>{mejorCiudad.name}</h2>
        </div>

      </div>

      {/* INSIGHT */}
      <div style={{
        marginTop: "30px",
        padding: "20px",
        background: "#f5f5f5",
        borderRadius: "10px"
      }}>
        <h3>Insight estratégico</h3>
        <p>{insight()}</p>
      </div>

      {/* SEGMENTOS */}
      <div style={{ height: "300px", marginTop: "40px" }}>
        <h3>Ingresos por segmento</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={segmentos}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CIUDADES */}
      <div style={{ height: "300px", marginTop: "40px" }}>
        <h3>Top ciudades</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ciudades}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PARTICIPACION */}
      <div style={{ height: "300px", marginTop: "40px" }}>
        <h3>Participación por segmento (%)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={participacion}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {participacion.map((_, i) => (
                <Cell key={i} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

const card = {
  flex: 1,
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px"
}

export default Eco_Estrategico