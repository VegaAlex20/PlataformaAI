import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Cluster_Tactico() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/segmentacion/clientes/")
      .then((res) => res.json())
      .then((res) => {
        // transformar datos para gráficas
        const segmentos = Object.keys(res.clientes_por_segmento);

        const formatted = segmentos.map((seg) => ({
          segmento: seg,
          clientes: res.clientes_por_segmento[seg] || 0,
          gasto: res.gasto_promedio[seg] || 0,
          envios: res.envios_promedio[seg] || 0,
          devoluciones: res.devoluciones_promedio[seg] || 0,
        }));

        setData(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Nivel Táctico
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ENVÍOS */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Envíos promedio por segmento
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segmento" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="envios" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DEVOLUCIONES */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Devoluciones promedio
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segmento" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="devoluciones" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GASTO */}
        <div className="bg-white p-5 rounded-2xl shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Gasto promedio por segmento
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segmento" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="gasto" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Cluster_Tactico;