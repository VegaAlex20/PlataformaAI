import Layout from "../../hocs/Layout";
import DashboardGeneral from "../../components/roles/DashboardGeneral";
import { useEffect } from "react";
const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <div className="text-blue-500">
                <div className="mt-8 md:mt-8">
                    <DashboardGeneral />
                </div>
            </div>
        </Layout>
    );
};

export default Home;
