import React, { useState, useEffect } from "react";
import { TruckIcon, ChartBarIcon, AcademicCapIcon } from "@heroicons/react/solid";

const slides = [
  {
    title: "Logística Inteligente en Bolivia",
    subtitle: "Optimiza rutas, reduce costos y mejora tiempos de entrega con tecnología avanzada.",
    icon: TruckIcon,
  },
  {
    title: "Business Intelligence en Tiempo Real",
    subtitle: "Dashboards, métricas y decisiones basadas en datos reales.",
    icon: ChartBarIcon,
  },
  {
    title: "Predicciones con Inteligencia Artificial",
    subtitle: "Anticipa demanda, riesgos y mejora la eficiencia operativa.",
    icon: AcademicCapIcon,
  },
];

function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const SlideIcon = slides[current].icon;

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-gray-900">

      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900 opacity-90"></div>

      {/* Glow decorativo */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400 opacity-10 blur-3xl rounded-full"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 max-w-3xl">

        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full shadow-lg animate-pulse">
            <SlideIcon className="h-10 w-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight transition-all duration-500">
          {slides[current].title}
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-300 transition-all duration-500">
          {slides[current].subtitle}
        </p>

        {/* Botones */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
          >
            Ver Dashboard
          </a>
          <a
            href="/predicciones"
            className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-200 rounded-lg shadow-md transition"
          >
            Explorar IA
          </a>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-8 space-x-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-6 rounded-full transition-all duration-300 ${
                i === current ? "bg-blue-500" : "bg-gray-600"
              }`}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Banner;