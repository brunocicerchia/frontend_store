// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import './App.css';
import LoginPageComp from "./components/LoginPageComp";
import { getToken } from "./lib/auth"; // 👈 o "../lib/auth" según tu estructura real
// Si tu archivo está en src/lib/auth.js y App.jsx está en src/, entonces:
/// import { getToken } from "./lib/auth";

function App() {
  const isAuth = !!getToken();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        <Navbar />

        <Routes>
          {!isAuth ? (
            // 🔒 No autenticado: solo /login y todo lo demás redirige a /login
            <>
              <Route path="/login" element={<LoginPageComp />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            // ✅ Autenticado: todas las rutas privadas y /login redirige a /
            <>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;