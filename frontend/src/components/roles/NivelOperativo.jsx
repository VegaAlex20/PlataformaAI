import React from 'react';
import Riesgo_Operativo from './ml_riesgo/Riesgo_Operativo';

// ── ICONOS ─────────────────────────────
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
  </svg>
);

const IconActivity = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconTruck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8l5 3v5h-5V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// ── COMPONENTE ─────────────────────────
function NivelOperativo() {
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <IconShield />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Nivel Operativo
            </h1>
            <p className="text-sm text-slate-500">
              Monitoreo en tiempo real de riesgos y operaciones logísticas
            </p>
          </div>
        </div>

        {/* STATS MINI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <IconActivity />
            <div>
              <p className="text-xs text-slate-500">Estado del sistema</p>
              <p className="text-sm font-medium text-slate-700">Activo</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <IconTruck />
            <div>
              <p className="text-xs text-slate-500">Operaciones</p>
              <p className="text-sm font-medium text-slate-700">En ejecución</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <IconShield />
            <div>
              <p className="text-xs text-slate-500">Riesgo</p>
              <p className="text-sm font-medium text-slate-700">Controlado</p>
            </div>
          </div>

        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <Riesgo_Operativo />
      </div>

    </div>
  );
}

export default NivelOperativo;