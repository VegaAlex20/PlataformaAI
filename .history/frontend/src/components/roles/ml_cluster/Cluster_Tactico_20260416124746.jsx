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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/segmentacion/clientes/")
      .then((res) => res.json())
      .then((res) => {
        const segmentos = Object.keys(res.clientes_por_segmento);

        const formatted = segmentos.map((seg) => ({
          segmento: seg,
          clientes: res.clientes_por_segmento[seg] || 0,
          gasto: res.gasto_promedio[seg] || 0,
          envios: res.envios_promedio[seg] || 0,
          devoluciones: res.devoluciones_promedio[seg] || 0,
        }));

        setData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Nivel Táctico
      </h1>

      {/* CARDS RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item.segmento}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {item.segmento}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Clientes: <span className="font-bold">{item.clientes}</span>
            </p>
            <p className="text-sm text-gray-500">
              Envíos: <span className="font-bold">{item.envios.toFixed(1)}</span>
            </p>
            <p className="text-sm text-gray-500">
              Gasto:{" "}
              <span className="font-bold">
                Bs {item.gasto.toLocaleString()}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ENVÍOS */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Envíos promedio por segmento
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segmento" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="envios" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DEVOLUCIONES */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Devoluciones promedio
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segmento" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="devoluciones" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GASTO */}
        <div className="bg-white p-5 rounded-2xl shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Gasto promedio por segmento
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segmento" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="gasto" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Cluster_Tactico;