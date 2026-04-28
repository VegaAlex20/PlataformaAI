import React, { useState } from 'react'

function Eco_Tactico() {
  const [peso, setPeso] = useState(50)
  const [distancia, setDistancia] = useState(700)
  const [precio, setPrecio] = useState(800)

  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const predecir = async () => {
    setCargando(true)
    setError(null)

    try {
      const res = await fetch(
        `http://localhost:8000/api/econometria/predecir/?peso=${peso}&distancia=${distancia}&precio=${precio}`
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error("Error en la predicción")
      }

      setResultado(data.ingreso_estimado)

    } catch (err) {
      setError("No se pudo obtener la predicción")
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

  return (
    <div style={{
      maxWidth: "700px",
      margin: "40px auto",
      padding: "30px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      fontFamily: "Arial"
    }}>

      <h2 style={{ marginBottom: "20px" }}>
        Simulador de ingresos
      </h2>

      <p style={{ color: "#555", marginBottom: "25px" }}>
        Esta herramienta permite estimar el ingreso esperado en función de variables operativas del envío.
      </p>

      <div style={{ marginBottom: "15px" }}>
        <label>Peso del envío (kg)</label>
        <input
          type="number"
          value={peso}
          onChange={(e) => setPeso(Number(e.target.value))}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Distancia (km)</label>
        <input
          type="number"
          value={distancia}
          onChange={(e) => setDistancia(Number(e.target.value))}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Precio unitario (BOB)</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <button
        onClick={predecir}
        style={{
          width: "100%",
          padding: "10px",
          background: "#2c3e50",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Calcular ingreso estimado
      </button>

      {cargando && (
        <p style={{ marginTop: "15px" }}>
          Procesando...
        </p>
      )}

      {error && (
        <p style={{ marginTop: "15px", color: "red" }}>
          {error}
        </p>
      )}

      {resultado !== null && (
        <div style={{
          marginTop: "25px",
          padding: "20px",
          background: "#f5f5f5",
          borderRadius: "8px"
        }}>
          <h3>Resultado</h3>

          <p>
            Ingreso estimado:
            <strong> {formatear(resultado)} BOB</strong>
          </p>

          <p style={{ fontSize: "14px", color: "#555" }}>
            El valor representa una estimación basada en el modelo econométrico ajustado,
            considerando el comportamiento histórico de las variables operativas.
          </p>
        </div>
      )}

    </div>
  )
}

export default Eco_Tactico