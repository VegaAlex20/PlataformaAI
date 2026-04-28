import { Link, useNavigate, useLocation } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout } from '../../redux/actions/auth';
import Alert from '../../components/alert';

// ── ICONOS ─────────────────────────────────────────
const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const IconBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconTimeSeries = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
  </svg>
);
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ROLE_CONFIG = {
  estrategico: { label: 'Estratégico', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
  tactico:     { label: 'Táctico',     color: '#2563eb', bg: 'rgba(37,99,235,0.15)'  },
  operaciones: { label: 'Operaciones', color: '#059669', bg: 'rgba(5,150,105,0.15)'  },
};

const NAV = [
  { to: '/',              label: 'Inicio',           icon: IconHome       },
  { to: '/predicciones',  label: 'Predicciones',     icon: IconBolt       },
  { to: '/series-tiempo', label: 'Series de Tiempo', icon: IconTimeSeries },
  { to: '/econometria', label: 'Econometria', icon: IconTimeSeries },
  { to: '/chat',          label: 'Chatbot',           icon: IconChat       },
  { to: '/dashboards',    label: 'Dashboards',        icon: IconDashboard  },
];

const Sidebar = ({ logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state?.Auth?.user);
  const isAuthenticated = useSelector(state => state?.Auth?.isAuthenticated);
  const [open, setOpen] = useState(true);

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  const handleLogout = () => { logout(); navigate('/'); };
  const role = user?.role ? ROLE_CONFIG[user.role] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .sinrai-sidebar {
          font-family: 'DM Sans', sans-serif;
          width: ${open ? '240px' : '72px'};
          height: 100vh;
          position: fixed;
          left: 0; top: 0;
          background: #080d19;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
          z-index: 100;
          overflow: hidden;
        }

        /* Glow strip */
        .sinrai-sidebar::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 2px; height: 100%;
          background: linear-gradient(to bottom, transparent, #38bdf8 30%, #6366f1 70%, transparent);
          opacity: 0.6;
        }

        /* ── Logo ── */
        .sb-logo {
          height: 64px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 18px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .sb-logo-mark {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #38bdf8, #6366f1);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }
        .sb-logo-mark svg { width: 16px; height: 16px; color: white; }
        .sb-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 17px;
          letter-spacing: 0.08em;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          opacity: ${open ? 1 : 0};
          transition: opacity 0.2s;
        }
        .sb-logo-text span { color: #38bdf8; }

        /* ── Toggle ── */
        .sb-toggle {
          margin-left: auto;
          width: 28px; height: 28px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          transform: rotate(${open ? '0deg' : '180deg'});
        }
        .sb-toggle:hover { background: rgba(255,255,255,0.08); color: white; }

        /* ── Section label ── */
        .sb-section {
          padding: 20px 18px 8px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          white-space: nowrap;
          overflow: hidden;
          opacity: ${open ? 1 : 0};
          transition: opacity 0.15s;
        }

        /* ── Nav links ── */
        .sb-nav { flex: 1; padding: 4px 10px; overflow-y: auto; overflow-x: hidden; }
        .sb-nav::-webkit-scrollbar { display: none; }

        .sb-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.45);
          font-size: 13.5px;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          transition: all 0.18s;
          margin-bottom: 2px;
        }
        .sb-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }
        .sb-link.active {
          color: white;
          background: rgba(56,189,248,0.1);
        }
        .sb-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 60%;
          border-radius: 0 3px 3px 0;
          background: linear-gradient(to bottom, #38bdf8, #6366f1);
        }
        .sb-link-icon {
          flex-shrink: 0;
          width: 18px; height: 18px;
          display: flex; align-items: center; justify-content: center;
        }
        .sb-link.active .sb-link-icon { color: #38bdf8; }
        .sb-link-label {
          opacity: ${open ? 1 : 0};
          transition: opacity 0.15s;
        }

        /* ── Tooltip when collapsed ── */
        .sb-link-tooltip {
          position: absolute;
          left: calc(100% + 12px);
          top: 50%; transform: translateY(-50%);
          background: #1e293b;
          color: white;
          font-size: 12px;
          padding: 5px 10px;
          border-radius: 7px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          border: 1px solid rgba(255,255,255,0.08);
          transition: opacity 0.15s;
          z-index: 200;
        }
        .sb-link:hover .sb-link-tooltip { opacity: ${open ? 0 : 1}; }

        /* ── Footer ── */
        .sb-footer {
          padding: 12px 10px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* Role badge */
        .sb-role {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          overflow: hidden;
          white-space: nowrap;
        }
        .sb-role-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .sb-role-label {
          font-size: 12px;
          font-weight: 500;
          opacity: ${open ? 1 : 0};
          transition: opacity 0.15s;
        }

        /* User / logout button */
        .sb-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 400;
          cursor: pointer;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: all 0.18s;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          text-align: left;
        }
        .sb-action:hover { background: rgba(239,68,68,0.1); color: #f87171; }
        .sb-action.login:hover { background: rgba(255,255,255,0.06); color: white; }
        .sb-action-icon { flex-shrink: 0; }
        .sb-action-label {
          opacity: ${open ? 1 : 0};
          transition: opacity 0.15s;
        }

        /* ── Main content offset ── */
        .sinrai-main {
          margin-left: ${open ? '240px' : '72px'};
          transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
          flex: 1;
        }
      `}</style>

      <div style={{ display: 'flex' }}>

        {/* ───── SIDEBAR ───── */}
        <aside className="sinrai-sidebar">

          {/* LOGO */}
          <div className="sb-logo">
            <div className="sb-logo-mark">
              <IconBolt />
            </div>
            <span className="sb-logo-text">SIN<span>RAI</span></span>
            <button className="sb-toggle" onClick={() => setOpen(!open)}>
              <IconChevron />
            </button>
          </div>

          {/* NAV */}
          <nav className="sb-nav">
            <div className="sb-section">Menú</div>
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`sb-link${isActive(to) ? ' active' : ''}`}
              >
                <span className="sb-link-icon"><Icon /></span>
                <span className="sb-link-label">{label}</span>
                <span className="sb-link-tooltip">{label}</span>
              </Link>
            ))}
          </nav>

          {/* FOOTER */}
          <div className="sb-footer">

            {isAuthenticated && role && (
              <div className="sb-role" style={{ background: role.bg }}>
                <span className="sb-role-dot" style={{ background: role.color }} />
                <span className="sb-role-label" style={{ color: role.color }}>{role.label}</span>
              </div>
            )}

            {isAuthenticated ? (
              <button className="sb-action" onClick={handleLogout}>
                <span className="sb-action-icon"><IconLogout /></span>
                <span className="sb-action-label">Cerrar sesión</span>
              </button>
            ) : (
              <Link to="/login" className="sb-action login">
                <span className="sb-action-icon"><IconUser /></span>
                <span className="sb-action-label">Iniciar sesión</span>
              </Link>
            )}
          </div>
        </aside>

        {/* ───── CONTENIDO ───── */}
        <main className="sinrai-main">
          <Alert />
        </main>

      </div>
    </>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state?.Auth?.isAuthenticated,
  user: state?.Auth?.user,
});

export default connect(mapStateToProps, { logout })(Sidebar);