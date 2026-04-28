import React, { useState, useEffect, useRef } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts"

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:    #F7F4EF;
    --white:    #FFFFFF;
    --stone:    #E8E3DA;
    --sand:     #D4CAB8;
    --ink:      #1A1714;
    --muted:    #7A7368;
    --accent:   #2D6A4F;
    --accent2:  #52B788;
    --warn:     #C9622C;
    --warn-lt:  #F4A261;
    --shadow:   rgba(26,23,20,.06);
    --r:        14px;
    --r-sm:     8px;
    --transition: .25s cubic-bezier(.4,0,.2,1);
  }

  body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--ink); }

  .eco-root {
    min-height: 100vh;
    background: var(--cream);
    padding: 40px 24px 80px;
  }

  /* ── HEADER ── */
  .eco-header {
    max-width: 1100px;
    margin: 0 auto 48px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1.5px solid var(--sand);
    padding-bottom: 24px;
  }
  .eco-header-left h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    letter-spacing: -.5px;
    line-height: 1.1;
    color: var(--ink);
  }
  .eco-header-left p {
    font-size: 13px;
    color: var(--muted);
    margin-top: 6px;
    letter-spacing: .3px;
  }
  .eco-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .8px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 100px;
  }
  .eco-badge span { width:6px; height:6px; border-radius:50%; background:#fff; animation: pulse 1.8s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  /* ── MAIN GRID ── */
  .eco-main {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media(max-width:800px) {
    .eco-main { grid-template-columns: 1fr; }
  }

  /* ── CARD ── */
  .card {
    background: var(--white);
    border-radius: var(--r);
    border: 1.5px solid var(--stone);
    padding: 28px;
    box-shadow: 0 2px 12px var(--shadow);
    transition: box-shadow var(--transition);
  }
  .card:hover { box-shadow: 0 6px 28px rgba(26,23,20,.1); }
  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 17px;
    color: var(--ink);
    margin-bottom: 20px;
    letter-spacing: -.2px;
  }

  /* ── SLIDER GROUP ── */
  .slider-group {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .slider-item label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 10px;
  }
  .slider-item label span:first-child {
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    letter-spacing: .3px;
    text-transform: uppercase;
  }
  .slider-item label .val {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    color: var(--ink);
  }
  .slider-item label .unit {
    font-size: 12px;
    color: var(--muted);
    margin-left: 3px;
  }

  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(to right, var(--accent) var(--pct,0%), var(--stone) var(--pct,0%));
    outline: none;
    cursor: pointer;
    transition: background var(--transition);
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--white);
    border: 2px solid var(--accent);
    box-shadow: 0 2px 8px rgba(45,106,79,.25);
    transition: transform var(--transition), box-shadow var(--transition);
  }
  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 16px rgba(45,106,79,.35);
  }

  /* ── BTN ── */
  .btn-simulate {
    width: 100%;
    margin-top: 28px;
    padding: 14px;
    background: var(--ink);
    color: var(--white);
    border: none;
    border-radius: var(--r-sm);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background var(--transition), transform var(--transition);
  }
  .btn-simulate:hover { background: #2e2a26; transform: translateY(-1px); }
  .btn-simulate:active { transform: translateY(0); }
  .btn-simulate.loading { pointer-events: none; opacity: .7; }
  .btn-simulate .spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── KPI STRIP ── */
  .kpi-strip {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  @media(max-width:600px) { .kpi-strip { grid-template-columns: 1fr; } }
  .kpi {
    background: var(--white);
    border: 1.5px solid var(--stone);
    border-radius: var(--r);
    padding: 20px 22px;
    box-shadow: 0 2px 8px var(--shadow);
    animation: fadeUp .4s ease both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  .kpi:nth-child(2) { animation-delay:.08s }
  .kpi:nth-child(3) { animation-delay:.16s }
  .kpi .kpi-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .8px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .kpi .kpi-val {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    color: var(--ink);
    line-height: 1;
  }
  .kpi .kpi-val.pos { color: var(--accent); }
  .kpi .kpi-val.neg { color: var(--warn); }
  .kpi .kpi-sub {
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
  }

  /* ── INSIGHT BANNER ── */
  .insight {
    padding: 14px 18px;
    border-radius: var(--r-sm);
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 24px;
    border-left: 3px solid;
    animation: fadeUp .3s ease both;
  }
  .insight.pos { background: #EEF7F2; border-color: var(--accent); color: #1e4d38; }
  .insight.neg { background: #FEF4EE; border-color: var(--warn); color: #7a3215; }

  /* ── CHARTS ── */
  .charts-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .chart-wrap {
    height: 220px;
    margin-top: 8px;
  }
  .recharts-cartesian-axis-tick text { fill: var(--muted); font-size: 11px; }
  .recharts-tooltip-wrapper { outline: none; }

  /* ── CUSTOM TOOLTIP ── */
  .tip {
    background: var(--ink);
    color: #fff;
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 4px 16px rgba(0,0,0,.2);
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 260px;
    color: var(--muted);
    gap: 12px;
  }
  .empty-state svg { opacity:.25; }
  .empty-state p { font-size: 13px; letter-spacing: .2px; }

  /* ── ERROR ── */
  .err-msg {
    background: #FEF4EE;
    border: 1px solid #f4a261;
    border-radius: var(--r-sm);
    padding: 10px 14px;
    font-size: 12px;
    color: var(--warn);
    margin-top: 12px;
  }
`

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)

const pct = (val, min, max) => `${((val - min) / (max - min)) * 100}%`

const COLORS_ACCENT  = ["#2D6A4F","#52B788","#74C69D","#95D5B2","#B7E4C7"]
const COLORS_WARN    = ["#C9622C","#E76F51","#F4A261","#FFDDD2"]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="tip">
        <div>{label}</div>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, marginTop:2 }}>
          {fmt(payload[0].value)} <span style={{opacity:.6,fontSize:11}}>BOB</span>
        </div>
      </div>
    )
  }
  return null
}

/* ─────────────────────────────────────────
   SLIDER
───────────────────────────────────────── */
function Slider({ label, unit, value, min, max, onChange }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.style.setProperty("--pct", pct(value, min, max))
  }, [value, min, max])

  return (
    <div className="slider-item">
      <label>
        <span>{label}</span>
        <span>
          <span className="val">{value.toLocaleString("es-BO")}</span>
          <span className="unit">{unit}</span>
        </span>
      </label>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Eco_Tactico() {
  const [peso,      setPeso]      = useState(50)
  const [distancia, setDistancia] = useState(700)
  const [precio,    setPrecio]    = useState(800)
  const [resultado, setResultado] = useState(null)
  const [resumen,   setResumen]   = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  // cargar resumen
  useEffect(() => {
    fetch("http://localhost:8000/api/econometria/resumen/")
      .then(r => r.json())
      .then(d => setResumen(d))
      .catch(() => {})
  }, [])

  // predicción
  const predecir = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `http://localhost:8000/api/econometria/predecir/?peso=${peso}&distancia=${distancia}&precio=${precio}`
      )
      const data = await res.json()
      if (!res.ok || data.ingreso_estimado === undefined) throw new Error()
      setResultado(data.ingreso_estimado)
    } catch {
      setError("No se pudo obtener la predicción. Verificá la conexión con el servidor.")
      setResultado(null)
    }
    setLoading(false)
  }

  /* charts data */
  const dataComparacion = (resumen && resultado !== null)
    ? [
        { name: "Promedio hist.", valor: resumen.ingreso_promedio || 0 },
        { name: "Simulación",     valor: resultado }
      ]
    : []

  const dataSegmento = resumen?.por_segmento
    ? Object.entries(resumen.por_segmento).map(([k, v]) => ({ name: k, valor: Number(v) || 0 }))
    : []

  const dataCiudad = resumen?.por_ciudad
    ? Object.entries(resumen.por_ciudad)
        .map(([k, v]) => ({ name: k, valor: Number(v) }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5)
    : []

  const diff = resultado !== null && resumen ? resultado - resumen.ingreso_promedio : null
  const isPos = diff !== null && diff >= 0

  return (
    <>
      <style>{CSS}</style>
      <div className="eco-root">

        {/* HEADER */}
        <header className="eco-header">
          <div className="eco-header-left">
            <h1>Panel táctico<br />de ingresos</h1>
            <p>Simulación econométrica · Mercado boliviano</p>
          </div>
          <div className="eco-badge">
            <span />
            En vivo
          </div>
        </header>

        <div className="eco-main">

          {/* ── PANEL IZQUIERDO: controles ── */}
          <aside>
            <div className="card">
              <div className="card-title">Parámetros de simulación</div>

              <div className="slider-group">
                <Slider label="Peso" unit="kg"  value={peso}      min={1}   max={500}  onChange={setPeso} />
                <Slider label="Distancia" unit="km" value={distancia} min={10}  max={1500} onChange={setDistancia} />
                <Slider label="Precio" unit="BOB" value={precio}    min={10}  max={2000} onChange={setPrecio} />
              </div>

              <button
                className={`btn-simulate${loading ? " loading" : ""}`}
                onClick={predecir}
              >
                {loading && <span className="spinner" />}
                {loading ? "Calculando…" : "Simular ingreso"}
              </button>

              {error && <div className="err-msg">⚠ {error}</div>}
            </div>
          </aside>

          {/* ── PANEL DERECHO: resultados ── */}
          <section>

            {/* KPIs */}
            {resultado !== null && (
              <>
                <div className="kpi-strip">
                  <div className="kpi">
                    <div className="kpi-label">Ingreso estimado</div>
                    <div className="kpi-val">{fmt(resultado)}</div>
                    <div className="kpi-sub">bolivianos (BOB)</div>
                  </div>
                  {resumen && (
                    <div className="kpi">
                      <div className="kpi-label">Promedio histórico</div>
                      <div className="kpi-val">{fmt(resumen.ingreso_promedio)}</div>
                      <div className="kpi-sub">BOB</div>
                    </div>
                  )}
                  {diff !== null && (
                    <div className="kpi">
                      <div className="kpi-label">Diferencia</div>
                      <div className={`kpi-val ${isPos ? "pos" : "neg"}`}>
                        {isPos ? "+" : ""}{fmt(diff)}
                      </div>
                      <div className="kpi-sub">vs. promedio</div>
                    </div>
                  )}
                </div>

                {diff !== null && (
                  <div className={`insight ${isPos ? "pos" : "neg"}`}>
                    {isPos
                      ? "✦ El ingreso estimado supera el promedio histórico. Escenario favorable para esta combinación de variables."
                      : "↓ El ingreso estimado está por debajo del promedio. Considerate ajustar el precio o la distancia."}
                  </div>
                )}
              </>
            )}

            <div className="charts-grid">

              {/* Comparación */}
              <div className="card">
                <div className="card-title">Comparación simulación vs. promedio</div>
                {dataComparacion.length > 0 ? (
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataComparacion} barSize={40}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} width={80}
                               tickFormatter={v => fmt(v).split(",")[0]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
                        <Bar dataKey="valor" radius={[6,6,0,0]}>
                          {dataComparacion.map((_, i) => (
                            <Cell key={i} fill={i === 1 ? "#2D6A4F" : "#D4CAB8"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 3v18h18M7 16l4-4 4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p>Ejecutá una simulación para ver el gráfico</p>
                  </div>
                )}
              </div>

              {/* Segmento */}
              <div className="card">
                <div className="card-title">Ingresos por segmento</div>
                {dataSegmento.length > 0 ? (
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataSegmento} barSize={32}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} width={80}
                               tickFormatter={v => fmt(v).split(",")[0]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
                        <Bar dataKey="valor" radius={[6,6,0,0]}>
                          {dataSegmento.map((_, i) => (
                            <Cell key={i} fill={COLORS_ACCENT[i % COLORS_ACCENT.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                    </svg>
                    <p>Cargando datos de segmento…</p>
                  </div>
                )}
              </div>

              {/* Ciudades */}
              <div className="card">
                <div className="card-title">Top 5 ciudades por ingreso</div>
                {dataCiudad.length > 0 ? (
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataCiudad} barSize={32}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} width={80}
                               tickFormatter={v => fmt(v).split(",")[0]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
                        <Bar dataKey="valor" radius={[6,6,0,0]}>
                          {dataCiudad.map((_, i) => (
                            <Cell key={i} fill={COLORS_WARN[i % COLORS_WARN.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p>Cargando datos de ciudades…</p>
                  </div>
                )}
              </div>

            </div>
          </section>
        </div>
      </div>
    </>
  )
}