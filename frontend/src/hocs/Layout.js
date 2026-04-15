import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { check_authenticated, load_user, refresh } from '../redux/actions/auth';


import { useEffect } from 'react';
import { connect } from 'react-redux';
import Navbar from '../components/navigation/Navbar';

const Layout = (props) => {
  useEffect(() => {
    props.refresh();
    props.check_authenticated();
    props.load_user();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      {/* 👇 ESTE ES EL FIX */}
      <main className="ml-20 md:ml-64 transition-all duration-300 min-h-screen">
        <ToastContainer autoClose={5000} />
        {props.children}
      </main>

    </div>
  );
};


export default connect(null, {
    check_authenticated,
    load_user,
    refresh,
}) (Layout)