import Layout from "../../hocs/Layout";
import DashboardGeneral from "../../components/roles/DashboardGeneral";
import { useEffect } from "react";
import DashboardEconometria from "../../components/roles/DashboardEconometria";
const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <div className="text-blue-500">
                <h1>Hola, esto es la pagina principal</h1>
            </div>
        </Layout>
    );
};

export default Home;
