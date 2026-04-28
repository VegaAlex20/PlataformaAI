const DashboardEconometria = () => {
  const { user } = useSelector(state => state.Auth);

  let content;

  if (user?.role === 'tactico') {
    content = <Eco_Tactico />;
  } else if (user?.role === 'estrategico') {
    content = <Eco_Estrategico />;
  } else {
    content = (
      <div className="text-center py-10 text-gray-500 text-xl">
        <p className="mt-2 text-md text-gray-600">
          Inicia sesion para acceder a los recursos de la plataforma
          <Link to="/login" className="font-semibold text-green-600 hover:text-green-700 transition-colors">
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