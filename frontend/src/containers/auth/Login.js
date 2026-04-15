import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { login } from '../../redux/actions/auth';
import { Oval } from 'react-loader-spinner';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

const Login = ({ login, loading }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔥 FIX CRASH
  const isAuthenticated = useSelector(
    state => state?.Auth?.isAuthenticated ?? false
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ───────── LEFT PANEL (TU TEXTO COMPLETO) ───────── */}
      <div
        className="hidden md:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)'
        }}
      >
        {/* grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* glow */}
        <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />

        {/* BRAND */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 border border-white/20">
            <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-xl">SIN-RAI</span>
        </div>

        {/* CENTER TEXT */}
        <div className="relative z-10 my-auto">
          <p className="text-xs uppercase tracking-widest text-blue-200/70 mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-blue-300/50" />
            Inteligencia de Negocios
          </p>

          <h1 className="text-white font-bold leading-tight text-[42px] md:text-[54px]">
            Predicciones <br />
            <span className="text-blue-300">en tiempo real</span>
          </h1>

          <p className="mt-6 text-sm text-slate-300 max-w-xs">
            Plataforma BI especializada en análisis predictivo para la gestión y optimización del transporte de productos.
          </p>

          <div className="mt-10 flex gap-8 text-white">
            <div>
              <div className="text-lg font-semibold">98%</div>
              <div className="text-xs text-slate-300">Precisión</div>
            </div>
            <div>
              <div className="text-lg font-semibold">12k+</div>
              <div className="text-xs text-slate-300">Rutas</div>
            </div>
            <div>
              <div className="text-lg font-semibold">Real-time</div>
              <div className="text-xs text-slate-300">Datos</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Sistemas operativos · Todo activo
        </div>
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-gradient-to-b from-blue-50 to-slate-50">

        <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-xl">

          <h2 className="text-2xl font-semibold mb-1">Bienvenido de vuelta</h2>
          <p className="text-sm text-gray-500 mb-6">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={onSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-xs uppercase font-semibold">Correo</label>
              <input
                name="email"
                value={email}
                onChange={onChange}
                type="email"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs uppercase font-semibold">Contraseña</label>

              <div className="relative">
                <input
                  name="password"
                  value={password}
                  onChange={onChange}
                  type={showPassword ? "text" : "password"}
                  className="w-full border rounded-lg px-4 py-3 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* FORGOT */}
            <div className="text-right">
              <Link to="/reset_password" className="text-blue-600 text-sm">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* BUTTON */}
            <div>
              {loading ? (
                <button disabled className="w-full py-3 bg-gray-400 text-white rounded-lg">
                  <Oval width={18} height={18} />
                </button>
              ) : (
                <button className="w-full py-3 bg-black text-white rounded-lg">
                  Ingresar
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.Auth.loading,
});

export default connect(mapStateToProps, { login })(Login);