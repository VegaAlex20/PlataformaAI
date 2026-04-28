import React from 'react';
import Eco_Estrategico from './econometria/Eco_Estrategico';
import Eco_Tactico from './econometria/Eco_Tactico';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Layout from '../../hocs/Layout';
const DashboardEconometria = () => {
  const { user } = useSelector(state => state.Auth);


  if (user?.role === 'tactico') {
    return <Eco_Tactico />;
  }

  if (user?.role === 'tactico') {
    return <Eco_Estrategico />;
  }

  return (
    <Layout>
    <div className="text-center py-10 text-gray-500 text-xl">
      <p className="mt-2 text-md text-gray-600">
                    Inicia sesion para accedera los recursos de la plataforma
                    <Link to="/login" className="font-semibold text-green-600 hover:text-green-700 transition-colors">
                      Vamos a ello!!!
                    </Link>
                    </p>
    </div>
    </Layout>
  );
};

export default DashboardEconometria;
