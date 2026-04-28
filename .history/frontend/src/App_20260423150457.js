import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Provider } from 'react-redux';
import store from './store';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import InstallButton from "./InstallButton";
import PrivateRoute from "./PrivateRoute";
import DashboardEconometria from "./components/roles/DashboardEconometria";

// Lazy imports
const Home = lazy(() => import('./containers/pages/Home'));
const Error404 = lazy(() => import('./containers/errors/Error404'));
const Signup = lazy(() => import('./containers/auth/Signup'));
const Login = lazy(() => import('./containers/auth/Login'));
const Activate = lazy(() => import('./containers/auth/Activate'));
const ResetPassword = lazy(() => import('./containers/auth/ResetPassword'));
const ResetPasswordConfirm = lazy(() => import('./containers/auth/ResetPasswordConfirm'));
const Dashboard = lazy(() => import('./containers/pages/Dashboard'));
const DashboardEcometria = lazy(() => import('./components/roles/DashboardEconometria'));
const DashboardGeneral = lazy(() => import('./components/roles/DashboardGeneral'));
const About = lazy(() => import('./containers/pages/About'));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <InstallButton />

        <Suspense fallback={
          <div className="text-center mt-10">
            Cargando neuronas artificiales para ayudarte a aprender mejor...
          </div>
        }>
          <Routes>

            {/* 🔥 REDIRECCIÓN INICIAL (SISTEMA CERRADO) */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* AUTH (PÚBLICAS) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/activate/:uid/:token" element={<Activate />} />
            <Route path="/reset_password" element={<ResetPassword />} />
            
            <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />

            {/* 🔐 SISTEMA PROTEGIDO */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            <Route
              path="/about"
              element={
                <PrivateRoute>
                  <About />
                </PrivateRoute>
              }
            />

            {/* ERROR 404 */}
            <Route path="*" element={<Error404 />} />
            <Route
              path="/econometria"
              element={
                <PrivateRoute>
                  <DashboardEconometria />
                </PrivateRoute>
              }
            />

            <Route
              path="/predicciones"
              element={
                <PrivateRoute>
                  <DashboardGeneral />
                </PrivateRoute>
              }
            />

          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;