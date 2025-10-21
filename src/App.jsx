// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavbarAdmin from './components/NavbarAdmin';
import NavbarSeller from './components/NavbarSeller';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Producto from './pages/[id]/Producto';
import Dashboard from './pages/Dashboard';
import Carrito from './pages/Carrito';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import './App.css';
import LoginPageComp from "./components/LoginPageComp";
import RegisterPage from "./pages/RegisterPage";
import { getToken, getUser } from "./lib/auth"; 
import MisOrdenes from "./components/MyOrders";
import Cuenta from "./pages/Account";
import Admin from "./pages/Admin";

function App() {
  const isAuth = !!getToken();
  const user = getUser();

  // Función para determinar qué Navbar mostrar
  const renderNavbar = () => {
    if (!isAuth) {
      return <Navbar />; // Navbar común para usuarios no logueados
    }

    // Verificar roles del usuario
    if (user?.roles?.includes("ADMIN")) {
      return <NavbarAdmin />;
    } else if (user?.roles?.includes("SELLER")) {
      return <NavbarSeller />;
    } else {
      return <Navbar />; // Navbar común para BUYER
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        {renderNavbar()}

        <Routes>
          {!isAuth ? (
            <>
              <Route path="/login" element={<LoginPageComp />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<Producto />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/ordenes" element={<MisOrdenes />} />
              <Route path="/cuenta" element={<Cuenta />} />
              <Route path="/admin" element={<Admin />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;