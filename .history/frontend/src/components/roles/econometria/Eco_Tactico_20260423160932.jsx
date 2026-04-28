import React, { useState, useEffect, useRef } from "react"
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, Area, AreaChart
} from "recharts"

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink:       #1A1714;
    --muted:     #7A7368;
    --cream:     #F7F4EF;
    --white:     #FFFFFF;
    --stone:     #E8E3DA;
    --sand:      #D4CAB8;
    --green:     #2D6A4F;
    --green2:    #52B788;
    --green-pale:#EEF7F2;
    --amber:     #C96B22;
    --amber-lt:  #F4A261;
    --amber-pale:#FEF4EE;
    --r:         12px;
    --r-sm:      8px;
    --transition:.22s cubic-bezier(.4,0,.2,1);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); }

  /* ROOT */
  .eco-root { min-height: 100vh; background: var(--cream); padding: 32px 22px 72px; }

  /* HEADER */
  .eco-hdr {
    max-width: 1080px; margin: 0 auto 32px;
    display: flex; align-items: flex-end; justify-content: space-between;
    border-bottom: 1.5px solid var(--sand); padding-bottom: 20px;
  }
  .eco-hdr h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(26px, 3.8vw, 38px);
    letter-spacing: -.5px; line-height: 1.1;
  }
  .eco-hdr p { font-size: 12px; color: var(--muted); margin-top: 5px; letter-spacing: .3px; }
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--green); color: #fff;
    font-size: 10px; font-weight: 600; letter-spacing: .8px; text-transform: uppercase;
    padding: 5px 13px; border-radius: 100px;
  }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; animation: pulse 1.8s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.25} }

  /* LAYOUT */
  .eco-layout {
    max-width: 1080px; margin: 0 auto;
    display: grid; grid-template-columns: 290px 1fr; gap: 20px; align-items: start;
  }
  @media(max-width:780px) { .eco-layout { grid-template-columns: 1fr; } }

  /* CARD */
  .card {
    background: var(--white); border-radius: var(--r);
    border: 1.5px solid var(--stone); padding: 22px;
    box-shadow: 0 2px 10px rgba(26,23,20,.05);
    transition: box-shadow var(--transition);
    margin-bottom: 18px;
  }
  .card:hover { box-shadow: 0 6px 24px rgba(26,23,20,.09); }
  .card-title {
    font-family: 'DM Serif Display', serif; font-size: 15px;
    color: var(--ink); margin-bottom: 18px; letter-spacing: -.2px;
  }

  /* SLIDERS */
  .sl-group { display: flex; flex-direction: column; gap: 20px; }
  .sl-item label {
    display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 9px;
  }
  .sl-lname { font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: .6px; text-transform: uppercase; }
  .sl-lval  { font-family: 'DM Serif Display', serif; font-size: 18px; color: var(--ink); }
  .sl-unit  { font-size: 10px; color: var(--muted); margin-left: 2px; }

  input[type=range] {
    -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px;
    outline: none; cursor: pointer;
    background: linear-gradient(to right, var(--green) var(--pct,0%), var(--stone) var(--pct,0%));
    transition: background var(--transition);
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 17px; height: 17px; border-radius: 50%;
    background: var(--white); border: 2px solid var(--green);
    box-shadow: 0 2px 7px rgba(45,106,79,.22);
    transition: transform var(--transition), box-shadow var(--transition);
  }
  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.22); box-shadow: 0 4px 14px rgba(45,106,79,.32);
  }

  /* BUTTON */
  .btn-sim {
    width: 100%; margin-top: 22px; padding: 12px;
    background: var(--ink); color: #fff; border: none;
    border-radius: var(--r-sm); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; letter-spacing: .4px;
    cursor: pointer; transition: background var(--transition), transform var(--transition);
  }
  .btn-sim:hover { background: #2e2a26; transform: translateY(-1px); }
  .btn-sim:active { transform: translateY(0); }

  /* STATS MINI */
  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-cell { background: var(--cream); border-radius: var(--r-sm); padding: 10px 13px; }
  .stat-cell .slabel { font-size: 10px; color: var(--muted); font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }
  .stat-cell .sval   { font-family: 'DM Serif Display', serif; font-size: 16px; color: var(--ink); margin-top: 3px; }

  /* KPI STRIP */
  .kpi-strip { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 16px; }
  @media(max-width:500px) { .kpi-strip { grid-template-columns: 1fr; } }
  .kpi {
    background: var(--white); border: 1.5px solid var(--stone);
    border-radius: var(--r); padding: 16px 18px;
    animation: fadeUp .38s ease both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  .kpi:nth-child(2){animation-delay:.07s} .kpi:nth-child(3){animation-delay:.14s}
  .kpi .klabel { font-size: 10px; font-weight: 600; letter-spacing: .7px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .kpi .kval   { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--ink); line-height: 1; }
  .kpi .ksub   { font-size: 10px; color: var(--muted); margin-top: 3px; }
  .kpos { color: var(--green) !important; }
  .kneg { color: var(--amber) !important; }

  /* INSIGHT */
  .insight {
    padding: 11px 16px; font-size: 12px; font-weight: 500;
    margin-bottom: 18px; border-left: 3px solid;
    border-radius: 0 var(--r-sm) var(--r-sm) 0;
    animation: fadeUp .3s ease both;
  }
  .ipos { background: var(--green-pale); border-color: var(--green); color: #1e4d38; }
  .ineg { background: var(--amber-pale); border-color: var(--amber); color: #7a3215; }

  /* TABS */
  .tab-bar { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
  .tab {
    padding: 5px 13px; border-radius: 100px;
    border: 1.5px solid var(--stone); font-size: 11px; font-weight: 600;
    letter-spacing: .3px; cursor: pointer; background: transparent;
    color: var(--muted); transition: all var(--transition); font-family: 'DM Sans', sans-serif;
  }
  .tab.active { background: var(--ink); color: #fff; border-color: var(--ink); }

  /* CHART CONTAINER */
  .chart-wrap { height: 200px; margin-top: 8px; }

  /* EMPTY */
  .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 160px; color: var(--muted); gap: 10px; font-size: 12px; }
  .empty svg { opacity: .22; }

  /* CUSTOM TOOLTIP */
  .rtip { background: var(--ink); color: #fff; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 500; box-shadow: 0 4px 14px rgba(0,0,0,.2); }
  .rtip .rtip-label { font-size: 10px; opacity: .6; margin-bottom: 2px; }
  .rtip .rtip-val   { font-family: 'DM Serif Display', serif; font-size: 16px; }
`

/* ─────────────────────────────────────────
   DATOS SIMULADOS
───────────────────────────────────────── */
const RESUMEN = {
  ingreso_promedio: 847.6,
  por_segmento: {
    "Carga pesada":  1240,
    "Express":    610,
    "Carga Refrigerado":   1480,
  },
  por_ciudad: {
    "La Paz":     1120,
    "Santa Cruz": 1350,
    "Cochabamba": 980,
    "Oruro":      710,
    "Potosí":     640,
  },
  tendencia: [
    { mes: "Ene", val: 720 }, { mes: "Feb", val: 690 },
    { mes: "Mar", val: 760 }, { mes: "Abr", val: 810 },
    { mes: "May", val: 830 }, { mes: "Jun", val: 880 },
    { mes: "Jul", val: 920 }, { mes: "Ago", val: 900 },
    { mes: "Sep", val: 860 }, { mes: "Oct", val: 940 },
    { mes: "Nov", val: 990 }, { mes: "Dic", val: 1050 },
  ],
}

/* Modelo econométrico simulado
   ingreso = 120 + 1.84·peso + 0.43·dist + 0.28·precio + ruido */
function modeloPrediccion(peso, distancia, precio) {
  const base     = 120
  const bPeso    = 1.84
  const bDist    = 0.43
  const bPrecio  = 0.28
  const ruido    = Math.sin(peso * distancia * 0.001) * 23 + Math.cos(precio * 0.07) * 18
  return Math.max(50, base + bPeso * peso + bDist * distancia + bPrecio * precio + ruido)
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)

const pct = (val, min, max) => `${((val - min) / (max - min)) * 100}%`

const GREENS  = ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"]
const AMBERS  = ["#C96B22", "#E07D35", "#F4A261", "#F9BF94", "#FDDCBC"]

/* ─────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────── */
const RTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rtip">
      <div className="rtip-label">{label}</div>
      <div className="rtip-val">{fmt(payload[0].value)} <span style={{ opacity: .55, fontSize: 10 }}>BOB</span></div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SLIDER
───────────────────────────────────────── */
function Slider({ label, unit, value, min, max, step = 1, onChange }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("--pct", pct(value, min, max))
    }
  }, [value, min, max])

  return (
    <div className="sl-item">
      <label>
        <span className="sl-lname">{label}</span>
        <span>
          <span className="sl-lval">{value.toLocaleString("es-BO")}</span>
          <span className="sl-unit">{unit}</span>
        </span>
      </label>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
const TABS = [
  { id: "comparacion", label: "Comparación" },
  { id: "segmento",    label: "Segmento" },
  { id: "ciudad",      label: "Ciudades" },
  { id: "tendencia",   label: "Tendencia" },
]

export default function Eco_Tactico() {
  const [peso,      setPeso]      = useState(50)
  const [distancia, setDistancia] = useState(700)
  const [precio,    setPrecio]    = useState(800)
  const [resultado, setResultado] = useState(null)
  const [tab,       setTab]       = useState("comparacion")

  const simular = () => {
    setResultado(modeloPrediccion(peso, distancia, precio))
  }

  const diff  = resultado !== null ? resultado - RESUMEN.ingreso_promedio : null
  const isPos = diff !== null && diff >= 0

  /* ── Chart data ── */
  const dataComp = resultado !== null
    ? [
        { name: "Promedio hist.", valor: RESUMEN.ingreso_promedio },
        { name: "Simulación",    valor: resultado },
      ]
    : []

  const dataSeg = Object.entries(RESUMEN.por_segmento).map(([name, valor]) => ({ name, valor }))

  const dataCiudad = Object.entries(RESUMEN.por_ciudad)
    .map(([name, valor]) => ({ name, valor }))
    .sort((a, b) => b.valor - a.valor)

  const dataTend = RESUMEN.tendencia.map(d => ({ name: d.mes, valor: d.val }))

  /* ── Render chart by tab ── */
  const renderChart = () => {
    if (tab === "comparacion") {
      if (dataComp.length === 0) {
        return (
          <div className="empty">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3v18h18M7 16l4-4 4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>Ejecutá una simulación para ver el gráfico</p>
          </div>
        )
      }
      return (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataComp} barSize={46}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7A7368" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7A7368" }} width={75}
                     tickFormatter={v => fmt(v).split(",")[0]} />
              <Tooltip content={<RTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
              <Bar dataKey="valor" radius={[7, 7, 0, 0]}>
                <Cell fill="#D4CAB8" />
                <Cell fill="#2D6A4F" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (tab === "segmento") {
      return (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataSeg} barSize={34}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7A7368" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7A7368" }} width={75}
                     tickFormatter={v => fmt(v).split(",")[0]} />
              <Tooltip content={<RTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
              <Bar dataKey="valor" radius={[7, 7, 0, 0]}>
                {dataSeg.map((_, i) => <Cell key={i} fill={GREENS[i % GREENS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (tab === "ciudad") {
      return (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataCiudad} barSize={34}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7A7368" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7A7368" }} width={75}
                     tickFormatter={v => fmt(v).split(",")[0]} />
              <Tooltip content={<RTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
              <Bar dataKey="valor" radius={[7, 7, 0, 0]}>
                {dataCiudad.map((_, i) => <Cell key={i} fill={AMBERS[i % AMBERS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (tab === "tendencia") {
      return (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataTend}>
              <defs>
                <linearGradient id="grad-green" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2D6A4F" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7A7368" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7A7368" }} width={75}
                     tickFormatter={v => fmt(v).split(",")[0]} />
              <Tooltip content={<RTooltip />} cursor={{ stroke: "#2D6A4F", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area
                type="monotone" dataKey="valor"
                stroke="#2D6A4F" strokeWidth={2}
                fill="url(#grad-green)"
                dot={{ r: 3.5, fill: "#2D6A4F", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#2D6A4F" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="eco-root">

        {/* HEADER */}
        <header className="eco-hdr">
          <div>
            <h1>Panel táctico<br />de ingresos</h1>
            <p>Simulación econométrica · Transporte Bolivia 2022–2024</p>
          </div>
          <div className="badge">
            <span className="badge-dot" />
            Simulado
          </div>
        </header>

        <div className="eco-layout">

          {/* ── SIDEBAR ── */}
          <aside>
            <div className="card">
              <div className="card-title">Parámetros de simulación</div>
              <div className="sl-group">
                <Slider label="Peso"     unit="kg"  value={peso}      min={1}   max={500}  step={1}  onChange={setPeso} />
                <Slider label="Distancia" unit="km"  value={distancia} min={10}  max={1500} step={10} onChange={setDistancia} />
                <Slider label="Precio base" unit="BOB" value={precio}  min={10}  max={2000} step={10} onChange={setPrecio} />
              </div>
              <button className="btn-sim" onClick={simular}>
                Simular ingreso
              </button>
            </div>

            <div className="card">
              <div className="card-title">Estadísticos del modelo</div>
              <div className="stat-grid">
                <div className="stat-cell">
                  <div className="slabel">R²</div>
                  <div className="sval">0.3</div>
                </div>
                <div className="stat-cell">
                  <div className="slabel">Observaciones</div>
                  <div className="sval">1 240</div>
                </div>
                <div className="stat-cell">
                  <div className="slabel">RMSE</div>
                  <div className="sval">1.46</div>
                </div>
                <div className="stat-cell">
                  <div className="slabel">Período</div>
                  <div className="sval">2014-2026</div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <section>

            {/* KPIs */}
            {resultado !== null && (
              <>
                <div className="kpi-strip">
                  <div className="kpi">
                    <div className="klabel">Ingreso estimado</div>
                    <div className="kval">{fmt(resultado)}</div>
                    <div className="ksub">bolivianos (BOB)</div>
                  </div>
                  <div className="kpi">
                    <div className="klabel">Promedio histórico</div>
                    <div className="kval">{fmt(RESUMEN.ingreso_promedio)}</div>
                    <div className="ksub">BOB</div>
                  </div>
                  <div className="kpi">
                    <div className="klabel">Diferencia</div>
                    <div className={`kval ${isPos ? "kpos" : "kneg"}`}>
                      {isPos ? "+" : ""}{fmt(diff)}
                    </div>
                    <div className="ksub">vs. promedio</div>
                  </div>
                </div>

                <div className={`insight ${isPos ? "ipos" : "ineg"}`}>
                  {isPos
                    ? "✦ El ingreso estimado supera el promedio histórico. Escenario favorable para esta combinación de variables."
                    : "↓ El ingreso estimado está por debajo del promedio. Considerá ajustar el precio o la distancia."}
                </div>
              </>
            )}

            {/* CHARTS */}
            <div className="card">
              <div className="card-title">Análisis de datos históricos</div>
              <div className="tab-bar">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    className={`tab${tab === t.id ? " active" : ""}`}
                    onClick={() => setTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {renderChart()}
            </div>

          </section>
        </div>
      </div>
    </>
  )
}

