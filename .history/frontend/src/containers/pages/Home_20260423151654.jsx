import React, { useEffect } from 'react';
import Layout from "../../hocs/Layout";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import {
  ChartBarIcon,
  LightningBoltIcon,
  TrendingUpIcon,
  ChatAlt2Icon
} from '@heroicons/react/solid';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Inicio | Plataforma Inteligente</title>
        <meta name="description" content="Plataforma de analítica, econometría e inteligencia artificial aplicada a logística y toma de decisiones." />
      </Helmet>

      <div className="-ml-5 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">

        {/* HERO */}
        <div className="relative py-24 bg-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-80"></div>

          <div className="max-w-6xl mx-auto px-4 relative z-10 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              Bienvenido a <span className="text-blue-400">SINRAI</span>
            </h1>

            <p className="mt-6 text-xl text-gray-300 max-w-2xl">
              Plataforma de analítica avanzada, econometría e inteligencia artificial
              diseñada para optimizar decisiones, predecir escenarios y transformar datos en valor real.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/predicciones" className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition">
                Ver Predicciones
              </Link>
              <Link to="/dashboards" className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition">
                Ir a Dashboards
              </Link>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="max-w-6xl mx-auto px-4 py-20">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              ¿Qué puedes hacer aquí?
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mt-4"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              {
                icon: TrendingUpIcon,
                title: "Predicciones",
                text: "Modelos predictivos para anticipar demanda, riesgos y comportamiento.",
                link: "/predicciones"
              },
              {
                icon: ChartBarIcon,
                title: "Dashboards",
                text: "Visualiza KPIs y métricas clave en tiempo real.",
                link: "/dashboards"
              },
              {
                icon: LightningBoltIcon,
                title: "Econometría",
                text: "Análisis estadístico avanzado para decisiones estratégicas.",
                link: "/econometria"
              },
              {
                icon: ChatAlt2Icon,
                title: "Asistente IA",
                text: "Interactúa con modelos inteligentes para insights rápidos.",
                link: "/chat"
              }
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition hover:-translate-y-1"
              >
                <div className="bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto">
                  <item.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-semibold mt-4 text-center">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-2 text-center text-sm">
                  {item.text}
                </p>
              </Link>
            ))}

          </div>
        </div>

        {/* CTA FINAL */}
        <div className="bg-gray-900 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Toma decisiones basadas en datos
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Integra analítica, inteligencia artificial y econometría en un solo lugar
            para llevar tu operación al siguiente nivel.
          </p>

          <Link
            to="/dashboard"
            className="mt-6 inline-block px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Ir al sistema
          </Link>
        </div>

      </div>
    </Layout>
  );
};

export default Home;