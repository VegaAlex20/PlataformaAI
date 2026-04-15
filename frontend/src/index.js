import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HelmetProvider } from 'react-helmet-async'; // 👈 IMPORTANTE

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider> 
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();