import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const NavBar = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(location.pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(location.pathname);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getButtonClasses = (path: string) => {
    const isActive = currentPage === path;

    return isActive
      ? "px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-blue-800 text-white shadow-md"
      : "px-4 py-2 rounded-lg font-medium text-white hover:bg-blue-700 transition-all duration-300";
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">📱</span>
              <span className="ml-2 text-xl font-bold text-white">
                CelularStore
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={getButtonClasses("/")}>
                Inicio
              </Link>
              <Link to="/productos" className={getButtonClasses("/productos")}>
                Productos
              </Link>
              <Link to="/marcas" className={getButtonClasses("/marcas")}>
                Marcas
              </Link>
              <Link to="/ofertas" className={getButtonClasses("/ofertas")}>
                Ofertas
              </Link>
              <Link to="/contacto" className={getButtonClasses("/contacto")}>
                Contacto
              </Link>
              <Link to="/carrito" className={getButtonClasses("/carrito")}>
                <span className="flex items-center">
                  🛒 <span className="ml-1">Carrito</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-500 rounded-lg mt-2">
            <Link
              to="/"
              className={`block ${getButtonClasses("/")} text-center`}
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className={`block ${getButtonClasses("/productos")} text-center`}
            >
              Productos
            </Link>
            <Link
              to="/marcas"
              className={`block ${getButtonClasses("/marcas")} text-center`}
            >
              Marcas
            </Link>
            <Link
              to="/ofertas"
              className={`block ${getButtonClasses("/ofertas")} text-center`}
            >
              Ofertas
            </Link>
            <Link
              to="/contacto"
              className={`block ${getButtonClasses("/contacto")} text-center`}
            >
              Contacto
            </Link>
            <Link
              to="/carrito"
              className={`block ${getButtonClasses("/carrito")} text-center`}
            >
              🛒 Carrito
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
