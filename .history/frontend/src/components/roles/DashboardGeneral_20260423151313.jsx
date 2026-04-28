import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Layout from '../../hocs/Layout';
import NivelEstrategico from './NivelEstrategico';
import NivelOperativo from './NivelOperativo';
import NivelTactico from './NivelTactico';

const DashboardGeneral = () => {
  const { user } = useSelector(state => state.Auth);

  let content;

  if (user?.role === 'estrategico') {
    content = <NivelEstrategico />;
  } else if (user?.role === 'operaciones') {
    content = <NivelOperativo />;
  } else if (user?.role === 'tactico') {
    content = <NivelTactico />;
  } else {
    content = (
      <div className="text-center py-10 text-gray-500 text-xl">
        <p className="mt-2 text-md text-gray-600">
          Inicia sesión para acceder a los recursos de la plataforma{' '}
          <Link
            to="/login"
            className="font-semibold text-green-600 hover:text-green-700 transition-colors"
          >
            Vamos a ello!!!
          </Link>
        </p>
      </div>
    );
  }

  return (
    <Layout>
      {content}
    </Layout>
  );
};

export default DashboardGeneral;