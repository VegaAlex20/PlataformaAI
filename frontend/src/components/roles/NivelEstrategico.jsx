import React from 'react';
import Riesgo_Estrategico from './ml_riesgo/Riesgo_Estrategico';

// ── ICONOS ─────────────────────────────
const IconCrown = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 16l-2-8 5 4 4-6 4 6 5-4-2 8H5z" />
    <path d="M5 20h14" />
  </svg>
);

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15 15 0 0 1 0 20" />
    <path d="M12 2a15 15 0 0 0 0 20" />
  </svg>
);

const IconTrending = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 17 9 11 13 15 21 7" />
    <polyline points="14 7 21 7 21 14" />
  </svg>
);

// ── COMPONENTE ─────────────────────────
function NivelEstrategico() {
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
            <IconCrown />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Nivel Estratégico
            </h1>
            <p className="text-sm text-slate-500">
              Análisis global, predicción de tendencias y toma de decisiones corporativas
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <IconGlobe />
            <div>
              <p className="text-xs text-slate-500">Cobertura</p>
              <p className="text-sm font-medium text-slate-700">Nacional / Global</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <IconTrending />
            <div>
              <p className="text-xs text-slate-500">Decisiones</p>
              <p className="text-sm font-medium text-slate-700">Alta dirección</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <IconCrown />
            <div>
              <p className="text-xs text-slate-500">Riesgo estratégico</p>
              <p className="text-sm font-medium text-slate-700">Optimizado</p>
            </div>
          </div>

        </div>
      </div>

      {/* CONTENIDO ML */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <Riesgo_Estrategico />
      </div>

    </div>
  );
}

export default NivelEstrategico;