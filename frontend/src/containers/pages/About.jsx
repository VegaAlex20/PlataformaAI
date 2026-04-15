import React from 'react';
import Layout from '../../hocs/Layout';
import { Helmet } from 'react-helmet-async';

import { 
  BriefcaseIcon,
  GlobeAltIcon,
  BadgeCheckIcon,
  UsersIcon, 
  TruckIcon, 
  LightBulbIcon,
  ChartBarIcon,
  AcademicCapIcon
} from '@heroicons/react/solid';

function About() {
  return (
    <Layout>
      <Helmet>
        <title>Rutas Andinas | Sobre Nosotros</title>
        <meta name="description" content="Empresa boliviana de logística con inteligencia de negocios, analítica avanzada e inteligencia artificial aplicada al transporte." />
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">

        {/* HERO */}
        <div className="relative py-24 overflow-hidden bg-gray-900">
          <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80"></div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center md:text-left md:max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
                Sobre <span className="text-blue-400">Rutas Andinas</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 leading-relaxed">
                Somos una empresa boliviana de transporte y logística que integra tecnología,
                Business Intelligence e Inteligencia Artificial para optimizar operaciones,
                mejorar la toma de decisiones y transformar el sector logístico en el país.
              </p>
            </div>
          </div>
        </div>

        {/* FILOSOFÍA */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Nuestra Filosofía</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">

            {/* MISION */}
            <div className="bg-white p-8 rounded-xl shadow-xl border-b-4 border-blue-500 hover:-translate-y-1 transition">
              <h2 className="text-2xl font-bold flex items-center">
                <BadgeCheckIcon className="w-8 h-8 text-blue-500 mr-3" />
                Misión
              </h2>
              <p className="mt-4 text-gray-700 text-lg">
                Brindar soluciones logísticas eficientes mediante el uso de tecnología avanzada,
                análisis de datos e inteligencia artificial, garantizando seguridad, puntualidad
                y calidad en cada operación.
              </p>
            </div>

            {/* VISION */}
            <div className="bg-white p-8 rounded-xl shadow-xl border-b-4 border-blue-500 hover:-translate-y-1 transition">
              <h2 className="text-2xl font-bold flex items-center">
                <LightBulbIcon className="w-8 h-8 text-blue-500 mr-3" />
                Visión
              </h2>
              <p className="mt-4 text-gray-700 text-lg">
                Ser la empresa líder en logística inteligente en Bolivia, destacando por la
                innovación, el uso de inteligencia artificial y la toma de decisiones basada
                en datos.
              </p>
            </div>

          </div>
        </div>

        {/* DIFERENCIAL */}
        <div className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">

            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">¿Qué nos hace diferentes?</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

              {[
                { icon: TruckIcon, title: "Logística Inteligente", text: "Optimización de rutas, flota y envíos mediante tecnología." },
                { icon: ChartBarIcon, title: "Business Intelligence", text: "Decisiones basadas en datos con dashboards y analítica avanzada." },
                { icon: AcademicCapIcon, title: "Inteligencia Artificial", text: "Predicciones de demanda, tiempos y riesgos operativos." },
                { icon: GlobeAltIcon, title: "Cobertura Nacional", text: "Operamos en múltiples departamentos de Bolivia." }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-xl shadow-lg text-center hover:bg-blue-50 transition">
                  <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.text}</p>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* HISTORIA */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Nuestra Historia</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mt-4"></div>
          </div>

          <div className="space-y-10">

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="text-xl font-bold">2015 - Fundación</h3>
              <p className="text-gray-700 mt-2">
                Rutas Andinas nace en La Paz como una empresa enfocada en transporte
                interdepartamental y soluciones logísticas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="text-xl font-bold">2018 - Expansión</h3>
              <p className="text-gray-700 mt-2">
                Se amplía la cobertura hacia Cochabamba y Santa Cruz,
                incrementando la flota y mejorando la infraestructura operativa.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="text-xl font-bold">2022 - Transformación Digital</h3>
              <p className="text-gray-700 mt-2">
                Implementación de sistemas de telemetría GPS, Data Warehouse
                y dashboards de Business Intelligence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="text-xl font-bold">Actualidad - IA & BI</h3>
              <p className="text-gray-700 mt-2">
                Incorporación de modelos predictivos, analítica avanzada y
                asistentes inteligentes para la toma de decisiones.
              </p>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}

export default About;