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
import { getToken } from "./lib/auth"; 
import MisOrdenes from "./components/MyOrders";
import Cuenta from "./components/Account";

function App() {
  const isAuth = !!getToken();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        <Navbar />

        <Routes>
          {!isAuth ? (
            <>
              <Route path="/login" element={<LoginPageComp />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/ordenes" element={<MisOrdenes />} />
              <Route path="/cuenta" element={<Cuenta />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;