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
  const [error, setError] = useState(null);

  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/segmentacion/estrategico/")
    .then(async (res) => {
      const text = await res.text();

      try {
        return JSON.parse(text);
      } catch {
        console.error("Backend no devolvió JSON:", text);
        throw new Error("Error backend");
      }
    })
    .then((res) => {
      console.log("DATA ESTRATEGICA:", res);

      if (res.error) {
        setError(res.error);
        return;
      }

      // ===== DISTRIBUCIÓN =====
      const dist = Object.keys(res.distribucion || {}).map((seg) => ({
        segmento: seg,
        porcentaje: Number(res.distribucion[seg]) || 0,
      }));
      setDistribucion(dist);

      // ===== INGRESOS =====
      const ing = Object.keys(res.ingresos || {}).map((seg) => ({
        segmento: seg,
        ingreso: Number(res.ingresos[seg]) || 0,
      }));
      setIngresos(ing);

      // ===== EVOLUCIÓN =====
      const grouped = {};

      (res.evolucion || []).forEach((row) => {
        if (!grouped[row.MES]) {
          grouped[row.MES] = { mes: row.MES };
        }

        grouped[row.MES][row.SEGMENTO] =
          Number(row.MONTO_FACTURADO_BOB) || 0;
      });

      setEvolucion(Object.values(grouped));
    })
    .catch((err) => {
      console.error(err);
      setError("Error backend");
    });
}, []);

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Nivel Estratégico 🚀
      </h1>

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