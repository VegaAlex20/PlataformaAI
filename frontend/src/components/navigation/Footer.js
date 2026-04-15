import React from "react";
import { MapIcon, PhoneIcon, MailIcon, TruckIcon, ChartBarIcon, ArchiveIcon, OfficeBuildingIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-16">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
                            Rutas Andinas
                        </h2>
                        <p className="text-sm text-blue-300 mt-1">
                            Inteligencia Logística & Business Intelligence
                        </p>
                    </div>

                    {/* Redes */}
                    <div className="flex space-x-6">
                        <Link to='' className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
                            <i className="fab fa-facebook-f text-xl"></i>
                        </Link>
                        <Link to='' className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
                            <i className="fab fa-twitter text-xl"></i>
                        </Link>
                        <Link to='' className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
                            <i className="fab fa-instagram text-xl"></i>
                        </Link>
                        <Link to='' className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
                            <i className="fab fa-linkedin-in text-xl"></i>
                        </Link>
                    </div>
                </div>

                {/* Línea */}
                <div className="relative h-0.5 w-full bg-gray-800 mb-12 overflow-hidden">
                    <div className="absolute w-1/3 h-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Empresa */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <OfficeBuildingIcon className="h-5 w-5 text-blue-400"/>
                            <span>Empresa</span>
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/nosotros" className="hover:text-blue-400">Sobre Nosotros</Link></li>
                            <li><Link to="/servicios" className="hover:text-blue-400">Servicios</Link></li>
                            <li><Link to="/contacto" className="hover:text-blue-400">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Operaciones */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <TruckIcon className="h-5 w-5 text-green-400"/>
                            <span>Operaciones</span>
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/operaciones" className="hover:text-green-400">Gestión de Envíos</Link></li>
                            <li><Link to="/operaciones" className="hover:text-green-400">Flota y Rutas</Link></li>
                            <li><Link to="/operaciones" className="hover:text-green-400">Seguimiento GPS</Link></li>
                        </ul>
                    </div>

                    {/* BI */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <ChartBarIcon className="h-5 w-5 text-purple-400"/>
                            <span>Business Intelligence</span>
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/dashboard" className="hover:text-purple-400">Dashboards</Link></li>
                            <li><Link to="/reportes" className="hover:text-purple-400">Reportes</Link></li>
                            <li><Link to="/analitica" className="hover:text-purple-400">Análisis de Datos</Link></li>
                        </ul>
                    </div>

                    {/* IA */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <ArchiveIcon className="h-5 w-5 text-cyan-400"/>
                            <span>Inteligencia Artificial</span>
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/predicciones" className="hover:text-cyan-400">Predicciones</Link></li>
                            <li><Link to="/chat" className="hover:text-cyan-400">Chat IA</Link></li>
                            <li><Link to="/modelos" className="hover:text-cyan-400">Modelos Predictivos</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Contacto */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">

                    <div className="flex items-center space-x-3">
                        <MapIcon className="h-5 w-5 text-blue-400"/>
                        <span>La Paz, Bolivia</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-5 w-5 text-green-400"/>
                        <span>+591 70000000</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <MailIcon className="h-5 w-5 text-red-400"/>
                        <span>contacto@rutasandinas.com</span>
                    </div>

                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} 
                        <span className="text-blue-400"> Rutas Andinas Inteligentes S.A.</span> - Todos los derechos reservados.
                    </p>

                    <div className="flex justify-center mt-4 space-x-6 text-gray-500 text-sm">
                        <Link to="/privacidad" className="hover:text-blue-400">Política de Privacidad</Link>
                        <Link to="/terminos" className="hover:text-blue-400">Términos y Condiciones</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;