import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from "../lib/auth";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = getUser();
  
  return (
  <nav className="bg-brand-light shadow-lg sticky top-0 z-50 border-b border-brand-dark/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-brand-dark text-xl sm:text-2xl font-bold flex items-center hover:scale-105 transition-transform duration-300"
        >
          <span className="mr-2">📱</span>
          <span>PortalPhone</span>
        </Link>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-1 lg:space-x-4 items-center">
          <li>
            <Link 
              to="/" 
              className="text-brand-dark px-3 lg:px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/10 transition-all duration-300 hover:-translate-y-0.5 inline-block"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link 
              to="/productos" 
              className="text-brand-dark px-3 lg:px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/10 transition-all duration-300 hover:-translate-y-0.5 inline-block"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link 
              to="/carrito" 
              className="text-brand-dark px-3 lg:px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/10 transition-all duration-300 hover:-translate-y-0.5 inline-block"
            >
              Carrito
            </Link>
          </li>
          <li>
            <Link 
              to="/nosotros" 
              className="text-brand-dark px-3 lg:px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/10 transition-all duration-300 hover:-translate-y-0.5 inline-block"
            >
              Nosotros
            </Link>
          </li>
          <li>
            <Link 
              to="/contacto" 
              className="text-white px-3 lg:px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 inline-block"
            >
              Contacto
            </Link>
          </li>

          {/* 👤 Nombre del usuario logueado */}
          {user && (
            <li className="ml-4 text-sm text-brand-dark/70 font-medium">
              Hola, {user.firstname || user.email}
            </li>
          )}
        </ul>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-brand-dark p-2 rounded-lg hover:bg-brand-dark/10 transition-colors duration-300"
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

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="py-4 space-y-2">
          <li>
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="block text-brand-dark px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/10 transition-colors duration-300"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link 
              to="/productos" 
              onClick={() => setIsOpen(false)}
              className="block text-brand-dark px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/10 transition-colors duration-300"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link 
              to="/carrito" 
              onClick={() => setIsOpen(false)}
              className="block text-brand-dark px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/10 transition-colors duration-300"
            >
              Carrito
            </Link>
          </li>
          <li>
            <Link 
              to="/nosotros" 
              onClick={() => setIsOpen(false)}
              className="block text-brand-dark px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/10 transition-colors duration-300"
            >
              Nosotros
            </Link>
          </li>
          <li>
            <Link 
              to="/contacto" 
              onClick={() => setIsOpen(false)}
              className="block text-brand-dark px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/10 transition-colors duration-300"
            >
              Contacto
            </Link>
          </li>

          {/* 👤 Nombre también visible en mobile */}
          {user && (
            <li className="px-4 pt-2 text-sm text-brand-dark/70 font-medium">
              Hola, {user.firstname || user.email}
            </li>
          )}
        </ul>
      </div>
    </div>
  </nav>
);
}

export default Navbar;
