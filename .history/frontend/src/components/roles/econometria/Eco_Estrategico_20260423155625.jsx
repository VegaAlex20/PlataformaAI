import React, { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink:        #1A1714;
    --muted:      #7A7368;
    --cream:      #F7F4EF;
    --white:      #FFFFFF;
    --stone:      #E8E3DA;
    --sand:       #D4CAB8;
    --green:      #2D6A4F;
    --green2:     #52B788;
    --green-pale: #EEF7F2;
    --amber:      #C96B22;
    --amber-pale: #FEF4EE;
    --red:        #B5322A;
    --red-pale:   #FDECEA;
    --r:          12px;
    --r-sm:       8px;
    --t:          .22s cubic-bezier(.4,0,.2,1);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); }

  .est-root { min-height: 100vh; background: var(--cream); padding: 32px 22px 72px; }

  /* HEADER */
  .est-hdr {
    max-width: 1080px; margin: 0 auto 32px;
    display: flex; align-items: flex-end; justify-content: space-between;
    border-bottom: 1.5px solid var(--sand); padding-bottom: 20px;
  }
  .est-hdr h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(26px, 3.8vw, 38px); letter-spacing: -.5px; line-height: 1.1;
  }
  .est-hdr p { font-size: 12px; color: var(--muted); margin-top: 5px; letter-spacing: .3px; }
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--green); color: #fff;
    font-size: 10px; font-weight: 600; letter-spacing: .8px; text-transform: uppercase;
    padding: 5px 13px; border-radius: 100px;
  }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; animation: pulse 1.8s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.25} }

  /* LAYOUT */
  .est-wrap { max-width: 1080px; margin: 0 auto; }

  /* CARD */
  .card {
    background: var(--white); border-radius: var(--r);
    border: 1.5px solid var(--stone); padding: 22px;
    box-shadow: 0 2px 10px rgba(26,23,20,.05);
    transition: box-shadow var(--t); margin-bottom: 20px;
  }
  .card:hover { box-shadow: 0 6px 24px rgba(26,23,20,.09); }
  .card-title {
    font-family: 'DM Serif Display', serif; font-size: 15px;
    color: var(--ink); margin-bottom: 18px; letter-spacing: -.2px;
  }

  /* KPI STRIP */
  .kpi-strip { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px; }
  @media(max-width:600px) { .kpi-strip { grid-template-columns: 1fr; } }
  .kpi {
    background: var(--white); border: 1.5px solid var(--stone);
    border-radius: var(--r); padding: 18px 20px;
    animation: fadeUp .38s ease both;
  }
  .kpi:nth-child(2){animation-delay:.07s} .kpi:nth-child(3){animation-delay:.14s}
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  .kpi .klabel { font-size: 10px; font-weight: 600; letter-spacing: .7px; text-transform: uppercase; color: var(--muted); margin-bottom: 7px; }
  .kpi .kval   { font-family: 'DM Serif Display', serif; font-size: 24px; color: var(--ink); line-height: 1; }
  .kpi .ksub   { font-size: 10px; color: var(--muted); margin-top: 4px; }
  .kpi .kbadge {
    display: inline-block; margin-top: 8px;
    font-size: 10px; font-weight: 600; letter-spacing: .4px;
    padding: 2px 9px; border-radius: 100px;
  }
  .kbadge-green { background: var(--green-pale); color: var(--green); }
  .kbadge-amber { background: var(--amber-pale); color: var(--amber); }
  .kbadge-red   { background: var(--red-pale);   color: var(--red);   }

  /* INSIGHT */
  .insight-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
  @media(max-width:600px) { .insight-grid { grid-template-columns: 1fr; } }
  .insight-card {
    padding: 14px 16px; border-radius: var(--r-sm); border-left: 3px solid;
    border-radius: 0 var(--r-sm) var(--r-sm) 0; animation: fadeUp .4s ease both;
  }
  .insight-card:nth-child(2){animation-delay:.08s} .insight-card:nth-child(3){animation-delay:.16s}
  .insight-card .ic-label { font-size: 10px; font-weight: 600; letter-spacing: .6px; text-transform: uppercase; margin-bottom: 5px; }
  .insight-card .ic-val   { font-family: 'DM Serif Display', serif; font-size: 17px; }
  .insight-card .ic-desc  { font-size: 11px; margin-top: 4px; opacity: .75; }
  .ic-green { background: var(--green-pale); border-color: var(--green); color: #1e4d38; }
  .ic-amber { background: var(--amber-pale); border-color: var(--amber); color: #7a3215; }
  .ic-red   { background: var(--red-pale);   border-color: var(--red);   color: #6b1e1a; }

  /* CHART 2-col */
  .chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  @media(max-width:680px) { .chart-row { grid-template-columns: 1fr; } }
  .chart-wrap { height: 210px; margin-top: 8px; }

  /* PIE LEGEND */
  .pie-legend { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 12px; }
  .pie-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--muted); }
  .pie-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }

  /* TABLE */
  .ranking-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .ranking-table th {
    text-align: left; font-size: 10px; font-weight: 600; letter-spacing: .6px;
    text-transform: uppercase; color: var(--muted);
    padding: 0 10px 10px; border-bottom: 1px solid var(--stone);
  }
  .ranking-table td { padding: 10px; border-bottom: 1px solid var(--stone); }
  .ranking-table tr:last-child td { border-bottom: none; }
  .rank-num { font-family: 'DM Serif Display', serif; font-size: 15px; color: var(--ink); }
  .rank-bar-wrap { background: var(--stone); border-radius: 4px; height: 5px; margin-top: 5px; }
  .rank-bar { height: 5px; border-radius: 4px; background: var(--green); transition: width .6s ease; }

  /* TOOLTIP */
  .rtip { background: #1A1714; color: #fff; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 500; }
  .rtip-label { font-size: 10px; opacity: .6; margin-bottom: 2px; }
  .rtip-val   { font-family: 'DM Serif Display', serif; font-size: 16px; }
`

/* ─────────────────────────────────────────
   DATOS SIMULADOS
───────────────────────────────────────── */
const DATA = {
  ingreso_promedio: 847.6,
  ingreso_total:    1_050_224,
  envios_totales:   1240,
  variacion_mensual: 6.3,
  por_segmento: {
    "Carga pesada":  1240,
    "Carga frágil":  920,
    "Documentos":    380,
    "Paquetería":    610,
    "Refrigerado":   1480,
  },
  por_ciudad: {
    "La Paz":     1120,
    "Santa Cruz": 1350,
    "Cochabamba": 980,
    "Oruro":      710,
    "Potosí":     640,
  },
}

/* ─────────────────────────────────────────
   COLORES
───────────────────────────────────────── */
const GREENS  = ["#2D6A4F","#40916C","#52B788","#74C69D","#95D5B2"]
const AMBERS  = ["#C96B22","#E07D35","#F4A261","#F9BF94","#FDDCBC"]
const PIE_COL = ["#2D6A4F","#52B788","#C96B22","#F4A261","#95D5B2"]

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)

const fmtShort = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(Math.round(n))
}

const RTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rtip">
      <div className="rtip-label">{label}</div>
      <div className="rtip-val">{fmt(payload[0].value)} <span style={{ opacity:.5, fontSize:10 }}>BOB</span></div>
    </div>
  )
}

const RPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rtip">
      <div className="rtip-label">{payload[0].name}</div>
      <div className="rtip-val">{payload[0].value.toFixed(1)}%</div>
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function Eco_Estrategico() {

  /* ── Transformar datos ── */
  const segmentos = Object.entries(DATA.por_segmento)
    .map(([name, valor]) => ({ name, valor }))

  const ciudades = Object.entries(DATA.por_ciudad)
    .map(([name, valor]) => ({ name, valor }))
    .sort((a, b) => b.valor - a.valor)

  const total = segmentos.reduce((acc, s) => acc + s.valor, 0)

  const participacion = segmentos
    .map(s => ({ name: s.name, value: parseFloat(((s.valor / total) * 100).toFixed(1)) }))
    .sort((a, b) => b.value - a.value)

  const segOrdenados    = [...segmentos].sort((a, b) => b.valor - a.valor)
  const mejorSegmento   = segOrdenados[0]
  const peorSegmento    = segOrdenados[segOrdenados.length - 1]
  const mejorCiudad     = ciudades[0]
  const maxCiudad       = ciudades[0].valor

  return (
    <>
      <style>{CSS}</style>
      <div className="est-root">

        {/* HEADER */}
        <header className="est-hdr">
          <div>
            <h1>Panel estratégico</h1>
            <p>Análisis de rentabilidad · Transporte Bolivia 2022–2024</p>
          </div>
          <div className="badge"><span className="badge-dot" />Simulado</div>
        </header>

        <div className="est-wrap">

          {/* KPIs */}
          <div className="kpi-strip">
            <div className="kpi">
              <div className="klabel">Ingreso promedio</div>
              <div className="kval">{fmt(DATA.ingreso_promedio)}</div>
              <div className="ksub">BOB por envío</div>
              <div className="kbadge kbadge-green">+{DATA.variacion_mensual}% vs mes anterior</div>
            </div>
            <div className="kpi">
              <div className="klabel">Ingreso total acumulado</div>
              <div className="kval">{fmtShort(DATA.ingreso_total)} BOB</div>
              <div className="ksub">{DATA.envios_totales.toLocaleString("es-BO")} envíos registrados</div>
            </div>
            <div className="kpi">
              <div className="klabel">Mejor segmento</div>
              <div className="kval">{mejorSegmento.name}</div>
              <div className="ksub">{fmt(mejorSegmento.valor)} BOB promedio</div>
              <div className="kbadge kbadge-green">Líder de categoría</div>
            </div>
          </div>

          {/* INSIGHTS */}
          <div className="insight-grid">
            <div className="insight-card ic-green">
              <div className="ic-label">Segmento más rentable</div>
              <div className="ic-val">✦ {mejorSegmento.name}</div>
              <div className="ic-desc">{fmt(mejorSegmento.valor)} BOB — concentra el {((mejorSegmento.valor / total) * 100).toFixed(1)}% del ingreso</div>
            </div>
            <div className="insight-card ic-amber">
              <div className="ic-label">Ciudad más fuerte</div>
              <div className="ic-val">◎ {mejorCiudad.name}</div>
              <div className="ic-desc">{fmt(mejorCiudad.valor)} BOB promedio por operación</div>
            </div>
            <div className="insight-card ic-red">
              <div className="ic-label">Segmento con menor retorno</div>
              <div className="ic-val">↓ {peorSegmento.name}</div>
              <div className="ic-desc">{fmt(peorSegmento.valor)} BOB — oportunidad de mejora</div>
            </div>
          </div>

          {/* GRÁFICOS: Segmento + Participación */}
          <div className="chart-row">
            <div className="card">
              <div className="card-title">Ingresos por segmento</div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={segOrdenados} barSize={30}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                           tick={{ fontSize: 10, fill: "#7A7368" }} />
                    <YAxis axisLine={false} tickLine={false} width={70}
                           tick={{ fontSize: 10, fill: "#7A7368" }}
                           tickFormatter={v => fmtShort(v)} />
                    <Tooltip content={<RTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
                    <Bar dataKey="valor" radius={[7, 7, 0, 0]}>
                      {segOrdenados.map((_, i) => <Cell key={i} fill={GREENS[i % GREENS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Participación por segmento (%)</div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participacion}
                      dataKey="value"
                      nameKey="name"
                      cx="50%" cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {participacion.map((_, i) => (
                        <Cell key={i} fill={PIE_COL[i % PIE_COL.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<RPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="pie-legend">
                {participacion.map((p, i) => (
                  <div key={i} className="pie-legend-item">
                    <span className="pie-dot" style={{ background: PIE_COL[i % PIE_COL.length] }} />
                    {p.name} · {p.value}%
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RANKING CIUDADES */}
          <div className="card">
            <div className="card-title">Ranking de ciudades por ingreso promedio</div>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th style={{ width: 32 }}>#</th>
                  <th>Ciudad</th>
                  <th>Ingreso promedio</th>
                  <th style={{ width: "35%" }}>Desempeño relativo</th>
                </tr>
              </thead>
              <tbody>
                {ciudades.map((c, i) => (
                  <tr key={c.name}>
                    <td style={{ color: "#7A7368", fontWeight: 600 }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                    </td>
                    <td>
                      <span className="rank-num">{fmt(c.valor)}</span>
                      <span style={{ fontSize: 10, color: "#7A7368", marginLeft: 4 }}>BOB</span>
                    </td>
                    <td>
                      <div className="rank-bar-wrap">
                        <div
                          className="rank-bar"
                          style={{
                            width: `${(c.valor / maxCiudad) * 100}%`,
                            background: i === 0 ? "#2D6A4F" : i === ciudades.length - 1 ? "#C96B22" : "#74C69D"
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 10, color: "#7A7368", marginTop: 4 }}>
                        {((c.valor / maxCiudad) * 100).toFixed(0)}% del máximo
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOP CIUDADES BAR */}
          <div className="card">
            <div className="card-title">Top ciudades por ingreso</div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ciudades} barSize={34}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                         tick={{ fontSize: 11, fill: "#7A7368" }} />
                  <YAxis axisLine={false} tickLine={false} width={70}
                         tick={{ fontSize: 10, fill: "#7A7368" }}
                         tickFormatter={v => fmtShort(v)} />
                  <Tooltip content={<RTooltip />} cursor={{ fill: "rgba(0,0,0,.03)" }} />
                  <Bar dataKey="valor" radius={[7, 7, 0, 0]}>
                    {ciudades.map((_, i) => <Cell key={i} fill={AMBERS[i % AMBERS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}