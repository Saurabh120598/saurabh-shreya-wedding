import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminDashboard } from './components/AdminDashboard';
import App from './App.tsx';
import './index.css';

// Show admin dashboard if URL path is /admin
const isAdmin = window.location.pathname === '/admin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? <AdminDashboard /> : <App />}
  </StrictMode>,
);
