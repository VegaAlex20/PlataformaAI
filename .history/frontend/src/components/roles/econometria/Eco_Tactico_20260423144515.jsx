import React, { useState } from 'react'

function Eco_Tactico() {
  const [peso, setPeso] = useState(50)
  const [distancia, setDistancia] = useState(700)
  const [precio, setPrecio] = useState(800)
  const [resultado, setResultado] = useState(null)

  const predecir = async () => {
    const res = await fetch(
      `http://localhost:8000/api/econometria/predecir/?peso=${peso}&distancia=${distancia}&precio=${precio}`
    )

    const data = await res.json()
    setResultado(data.ingreso_estimado)
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Simulador de Ingresos (Nivel Táctico)</h1>

      <div>
        <label>Peso (kg): </label>
        <input
          type="number"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />
      </div>

      <div>
        <label>Distancia (km): </label>
        <input
          type="number"
          value={distancia}
          onChange={(e) => setDistancia(e.target.value)}
        />
      </div>

      <div>
        <label>Precio (BOB): </label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
      </div>

      <br />

      <button onClick={predecir}>
        🔮 Simular ingreso
      </button>

      {resultado && (
        <h2>
          💰 Ingreso estimado: {resultado.toFixed(2)} BOB
        </h2>
      )}
    </div>
  )
}

export default Eco_Tactico