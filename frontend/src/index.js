import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// ✅ ADD ROUTER IMPORTS
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ IMPORT PAGES
import App from './App';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 👤 USER (Direct UI) */}
        <Route path="/" element={<App />} />

        {/* 🔐 ADMIN LOGIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 👑 ADMIN DASHBOARD */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();