import React, { useState, useEffect } from 'react'

function Eco_Tactico() {

  const [peso, setPeso] = useState(50)
  const [distancia, setDistancia] = useState(700)
  const [precio, setPrecio] = useState(800)

  const [resultado, setResultado] = useState(null)
  const [resumen, setResumen] = useState(null)

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  // cargar datos agregados
  useEffect(() => {
    fetch("http://localhost:8000/api/econometria/resumen/")
      .then(res => res.json())
      .then(data => setResumen(data))
  }, [])

  const predecir = async () => {
    setCargando(true)
    setError(null)

    try {
      const res = await fetch(
        `http://localhost:8000/api/econometria/predecir/?peso=${peso}&distancia=${distancia}&precio=${precio}`
      )

      const data = await res.json()

      if (!res.ok) throw new Error()

      setResultado(data.ingreso_estimado)

    } catch {
      setError("Error en la predicción")
      setResultado(null)
    }

    setCargando(false)
  }

  const formatear = (num) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const insight = () => {
    if (!resultado || !resumen) return ""

    if (resultado > resumen.ingreso_promedio) {
      return "El envío está por encima del promedio. Estrategia rentable."
    } else {
      return "El envío está por debajo del promedio. Revisar precio o condiciones."
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>

      <h1>Simulador táctico de ingresos</h1>

      <p>
        Permite evaluar el impacto de variables operativas sobre el ingreso estimado
        y compararlo con el comportamiento histórico.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "20px" }}>
        <input type="number" value={peso} onChange={e => setPeso(Number(e.target.value))} placeholder="Peso (kg)" />
        <input type="number" value={distancia} onChange={e => setDistancia(Number(e.target.value))} placeholder="Distancia (km)" />
        <input type="number" value={precio} onChange={e => setPrecio(Number(e.target.value))} placeholder="Precio (BOB)" />
      </div>

      <button onClick={predecir} style={{ marginTop: "15px", padding: "10px", width: "100%" }}>
        Simular
      </button>

      {cargando && <p>Calculando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {resultado !== null && (
        <div style={{ marginTop: "30px" }}>

          <h2>Resultado</h2>

          <p><strong>Ingreso estimado:</strong> {formatear(resultado)} BOB</p>

          {resumen && (
            <>
              <p><strong>Promedio histórico:</strong> {formatear(resumen.ingreso_promedio)} BOB</p>

              <p>
                <strong>Diferencia:</strong>{" "}
                {formatear(resultado - resumen.ingreso_promedio)} BOB
              </p>
            </>
          )}

          <p style={{ marginTop: "10px" }}>
            {insight()}
          </p>
        </div>
      )}

      {resumen && (
        <div style={{ marginTop: "40px" }}>
          <h2>Análisis por segmento</h2>

          <table border="1" cellPadding="8" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Segmento</th>
                <th>Ingreso promedio</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(resumen.por_segmento).map(([seg, val]) => (
                <tr key={seg}>
                  <td>{seg}</td>
                  <td>{formatear(val)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {resumen && (
        <div style={{ marginTop: "40px" }}>
          <h2>Análisis por ciudad</h2>

          <table border="1" cellPadding="8" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Ciudad</th>
                <th>Ingreso promedio</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(resumen.por_ciudad).map(([c, val]) => (
                <tr key={c}>
                  <td>{c}</td>
                  <td>{formatear(val)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

export default Eco_Tactico