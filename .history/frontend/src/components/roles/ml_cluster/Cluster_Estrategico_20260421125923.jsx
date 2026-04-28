import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

function Cluster_Estrategico() {
  const [distribucion, setDistribucion] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [evolucion, setEvolucion] = useState([]);
  const [kpis, setKpis] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/segmentacion/estrategico/")
      .then((res) => res.json())
      .then((res) => {
        console.log("DATA ESTRATEGICA:", res);

        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }

        // ===== DISTRIBUCIÓN =====
        const dist = Object.keys(res.distribucion || {}).map((seg) => ({
          segmento: seg,
          porcentaje: Number(res.distribucion[seg]) || 0,
        }));

        // ===== INGRESOS =====
        const ing = Object.keys(res.ingresos || {}).map((seg) => ({
          segmento: seg,
          ingreso: Number(res.ingresos[seg]) || 0,
        }));

        // ===== EVOLUCIÓN =====
        const grouped = {};

        (res.evolucion || []).forEach((row) => {
          const mes = row.MES;

          if (!grouped[mes]) {
            grouped[mes] = { mes };
          }

          grouped[mes][row.SEGMENTO] =
            Number(row.MONTO_FACTURADO_BOB) || 0;
        });

        // ordenar meses correctamente
        const evolucionOrdenada = Object.values(grouped).sort(
          (a, b) => a.mes - b.mes
        );

        // ===== KPIs ESTRATÉGICOS =====
        const totalIngresos = ing.reduce((acc, i) => acc + i.ingreso, 0);

        const topSegmento = ing.sort((a, b) => b.ingreso - a.ingreso)[0];

        setKpis({
          totalIngresos,
          topSegmento: topSegmento?.segmento,
          ingresoTop: topSegmento?.ingreso,
        });

        setDistribucion(dist);
        setIngresos(ing);
        setEvolucion(evolucionOrdenada);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error backend");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Cargando datos estratégicos...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Estratégico 
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Ingresos Totales</p>
          <h2 className="text-2xl font-bold">
            {kpis.totalIngresos?.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Segmento Top</p>
          <h2 className="text-2xl font-bold">
            {kpis.topSegmento}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Ingreso del Top</p>
          <h2 className="text-2xl font-bold">
            {kpis.ingresoTop?.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* DISTRIBUCIÓN */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Distribución de Clientes (%)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distribucion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segmento" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="porcentaje" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* INGRESOS */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Ingresos por Segmento
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ingresos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segmento" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ingreso" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* EVOLUCIÓN */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Evolución mensual por segmento
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={evolucion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="VIP" stroke="#F59E0B" />
            <Line type="monotone" dataKey="Frecuentes" stroke="#3B82F6" />
            <Line type="monotone" dataKey="Regulares" stroke="#EF4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Cluster_Estrategico;