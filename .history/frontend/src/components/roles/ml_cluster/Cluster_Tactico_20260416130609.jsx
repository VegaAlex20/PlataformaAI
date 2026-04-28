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
  const [topClientes, setTopClientes] = useState([]);
  const [kpis, setKpis] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fetchData = () => {
    setLoading(true);
    setError(null);

    let url = "http://127.0.0.1:8000/api/segmentacion/clientes/";

    if (fechaInicio && fechaFin) {
      url += `?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }

        setKpis(res.kpis || {});

        const segmentos = Object.keys(res.segmentos || {});
        const formatted = segmentos.map((seg) => ({
          segmento: seg,
          clientes: res.segmentos[seg] || 0,
          gasto: res.gasto_promedio?.[seg] || 0,
        }));

        setData(formatted);
        setTopClientes(res.top_clientes || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error conectando con backend");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatMoney = (num) =>
    num ? `Bs ${num.toLocaleString()}` : "Bs 0";

  if (error) {
    return <div className="p-6 text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Táctico - Segmentación de Clientes
      </h1>

      {/* FILTROS */}
      <div className="bg-white p-5 rounded-2xl shadow flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm text-gray-600">Fecha inicio</label>
          <input
            type="date"
            className="border rounded-lg p-2"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Fecha fin</label>
          <input
            type="date"
            className="border rounded-lg p-2"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <button
          onClick={fetchData}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Filtrar
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-500">Cargando datos...</div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Clientes</p>
          <h2 className="text-2xl font-bold">{kpis.total_clientes}</h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Gasto Total</p>
          <h2 className="text-2xl font-bold">
            {formatMoney(kpis.gasto_total)}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Envíos</p>
          <h2 className="text-2xl font-bold">
            {kpis.envios_totales?.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm">Ticket Promedio</p>
          <h2 className="text-2xl font-bold">
            {formatMoney(kpis.ticket_promedio)}
          </h2>
        </div>
      </div>

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CLIENTES */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Clientes por Segmento
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segmento" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clientes" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GASTO */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Gasto Promedio por Segmento
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segmento" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="gasto" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* TOP CLIENTES */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Top 10 Clientes (Mayor Gasto)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Segmento</th>
                <th className="p-3">Gasto</th>
                <th className="p-3">Envíos</th>
              </tr>
            </thead>
            <tbody>
              {topClientes.map((c, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold text-gray-500">
                    {index + 1}
                  </td>
                  <td className="p-3">{c.ID_CLIENTE}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs">
                      {c.SEGMENTO}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">
                    {formatMoney(c.GASTO_TOTAL)}
                  </td>
                  <td className="p-3">{c.TOTAL_ENVIOS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Cluster_Tactico;