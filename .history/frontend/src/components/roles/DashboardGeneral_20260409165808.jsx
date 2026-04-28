import React from 'react';
import NivelEstrategico from './NivelEstrategico';
import NivelOperativo from './NivelOperativo';
import NivelTactico from './NivelTactico';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashboardGeneral = () => {
  const { user } = useSelector(state => state.Auth);

  if (user?.role === 'estrategico') {
    return <NivelEstrategico />;
  }

  if (user?.role === 'operaciones') {
    return <NivelOperativo />;
  }

  if (user?.role === 'tactico') {
    return <NivelTactico />;
  }

  return (
    <div className="text-center py-10 text-gray-500 text-xl">
      <p className="mt-2 text-md text-gray-600">
                    Inicia sesion para accedera los recursos de la plataforma
                    <Link to="/login" className="font-semibold text-green-600 hover:text-green-700 transition-colors">
                      Vamos a ello!!!
                    </Link>
                    </p>
    </div>
  );
};

export default DashboardGeneral;
