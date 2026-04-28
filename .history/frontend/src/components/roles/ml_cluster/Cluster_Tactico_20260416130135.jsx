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

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fetchData = () => {
    let url = "http://127.0.0.1:8000/api/segmentacion/clientes/";

    if (fechaInicio && fechaFin) {
      url += `?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log("API:", res);

        if (res.error) {
          setError(res.error);
          return;
        }

        // KPIs
        setKpis(res.kpis || {});

        // segmentos → gráfico
        const segmentos = Object.keys(res.segmentos || {});
        const formatted = segmentos.map((seg) => ({
          segmento: seg,
          clientes: res.segmentos[seg],
        }));

        setData(formatted);

        // top clientes
        setTopClientes(res.top_clientes || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Error conectando con backend");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Nivel Táctico
      </h1>

      {/* FILTRO FECHAS */}
      <div className="bg-white p-4 rounded-2xl shadow flex flex-wrap gap-4 items-end">
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Filtrar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Clientes</p>
          <h2 className="text-2xl font-bold">{kpis.total_clientes}</h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Gasto Total</p>
          <h2 className="text-2xl font-bold">
            {kpis.gasto_total?.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Envíos Totales</p>
          <h2 className="text-2xl font-bold">
            {kpis.envios_totales?.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Promedio Gasto</p>
          <h2 className="text-2xl font-bold">
            {kpis.promedio_gasto?.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* GRÁFICA */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Clientes por segmento
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

      {/* TABLA TOP CLIENTES */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Top 10 Clientes
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">ID Cliente</th>
                <th className="p-3">Segmento</th>
                <th className="p-3">Gasto</th>
                <th className="p-3">Envíos</th>
              </tr>
            </thead>
            <tbody>
              {topClientes.map((c, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{c.ID_CLIENTE}</td>
                  <td className="p-3 font-semibold">{c.SEGMENTO}</td>
                  <td className="p-3">
                    {c.GASTO_TOTAL.toLocaleString()}
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