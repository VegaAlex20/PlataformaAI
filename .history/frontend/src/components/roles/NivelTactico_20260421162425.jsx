import React from 'react';
import Riesgo_Tactico from './ml_riesgo/Riesgo_Tactico';
import Cluster_Tactico from './ml_cluster/Cluster_Tactico';
import PrediccionRetrasos from './ml_retrasos/PrediccionRetrasos';
// ── ICONOS ─────────────────────────────
const IconLayers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l10 6-10 6L2 8l10-6z" />
    <path d="M2 14l10 6 10-6" />
  </svg>
);

const IconMap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
    <path d="M9 3v15" />
    <path d="M15 6v15" />
  </svg>
);

const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// ── COMPONENTE ─────────────────────────
function NivelTactico() {
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <IconLayers />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Nivel Táctico
            </h1>
            <p className="text-sm text-slate-500">
              Coordinación de recursos, planificación intermedia y control de operaciones
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <IconMap />
            <div>
              <p className="text-xs text-slate-500">Planificación</p>
              <p className="text-sm font-medium text-slate-700">Semanal / Mensual</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <IconTarget />
            <div>
              <p className="text-xs text-slate-500">Objetivos</p>
              <p className="text-sm font-medium text-slate-700">Optimización</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <IconLayers />
            <div>
              <p className="text-xs text-slate-500">Control</p>
              <p className="text-sm font-medium text-slate-700">Coordinado</p>
            </div>
          </div>

        </div>
      </div>

      {/* CONTENIDO ML */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <Riesgo_Tactico />
        <Cluster_Tactico />
        <PrediccionRetrasos/>
      </div>

    </div>
  );
}

export default NivelTactico;