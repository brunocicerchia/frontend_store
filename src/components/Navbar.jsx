// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from "../lib/auth";
import { getMyCart } from "../api/cart";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const user = getUser();
  
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user) {
        try {
          const cart = await getMyCart();
          const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartItemCount(totalItems);
        } catch (err) {
          console.error('Error fetching cart:', err);
          setCartItemCount(0);
        }
      }
    };

    fetchCartCount();
    
    // Actualizar el conteo cada 30 segundos si el usuario está logueado
    const interval = user ? setInterval(fetchCartCount, 5000) : null;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);
  
  return (
  <nav className="bg-brand-light shadow-md sticky top-0 z-50 border-b border-brand-dark/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <Link 
          to="/" 
          className="text-brand-dark text-xl sm:text-2xl font-bold flex items-center hover:scale-[1.02] transition-transform duration-300"
        >
          <span className="mr-2">📱</span>
          <span>PortalPhone</span>
        </Link>
        
        <ul className="hidden md:flex space-x-1 lg:space-x-4 items-center">
          {[
            { to: "/", label: "Inicio" },
            { to: "/productos", label: "Productos" },
            { to: "/nosotros", label: "Nosotros" },
            { to: "/contacto", label: "Contacto" }
          ].map((link) => (
            <li key={link.to}>
              <Link 
                to={link.to}
                className={`text-brand-dark px-3 lg:px-4 py-2 rounded-md font-medium hover:bg-brand-dark/10 transition-all duration-200 hover:-translate-y-0.5 inline-block`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Ícono del carrito con badge */}
          <li>
            <Link
              to="/carrito"
              className="relative text-brand-dark px-3 lg:px-4 py-2 rounded-md font-medium hover:bg-brand-dark/10 transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center"
              title="Carrito de compras"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
          </li>

          <li className="ml-3">
            {user ? (
              <Link
                to="/cuenta"
                className="inline-flex items-center gap-2 bg-brand-contrast text-white px-4 py-2 rounded-md hover:bg-brand-contrast-600 transition-colors duration-200 shadow-sm"
                title="Mi cuenta"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 21c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-sm font-medium truncate max-w-[160px]">
                  {user.firstname ? user.firstname : user.email}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-brand-contrast text-white px-4 py-2 rounded-md hover:bg-brand-contrast-600 transition-colors font-medium shadow-sm"
              >
                Ingresar
              </Link>
            )}
          </li>
        </ul>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-brand-dark p-2 rounded-md hover:bg-brand-dark/10 transition-colors duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="py-4 space-y-1">
          {[
            { to: "/", label: "Inicio" },
            { to: "/productos", label: "Productos" },
            { to: "/dashboard", label: "Dashboard" },
            { to: "/nosotros", label: "Nosotros" },
            { to: "/contacto", label: "Contacto" },
          ].map((link) => (
            <li key={link.to}>
              <Link 
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block text-brand-dark px-4 py-2 rounded-md font-medium hover:bg-brand-dark/10 transition-colors duration-300"
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li>
            <Link 
              to="/carrito"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-brand-dark px-4 py-2 rounded-md font-medium hover:bg-brand-dark/10 transition-colors duration-300"
            >
              <span className="flex items-center gap-2">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                Carrito
              </span>
              {cartItemCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
          </li>

          <li className="border-t border-brand-dark/10 mt-2 pt-2">
            <Link 
              to={user ? "/cuenta" : "/login"} 
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 rounded-md font-medium transition-colors duration-300 ${
                user
                  ? "bg-brand-contrast text-white hover:bg-brand-contrast-600"
                  : "bg-brand-contrast text-white hover:bg-brand-contrast-600"
              }`}
            >
              {user ? `Mi cuenta · ${user.firstname || user.email}` : "Ingresar"}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  
);
}

export default Navbar;