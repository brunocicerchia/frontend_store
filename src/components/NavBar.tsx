import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              📱 CelularStore
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="hover:text-blue-200 transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="hover:text-blue-200 transition-colors duration-200"
            >
              Productos
            </Link>
            <Link
              to="/marcas"
              className="hover:text-blue-200 transition-colors duration-200"
            >
              Marcas
            </Link>
            <Link
              to="/ofertas"
              className="hover:text-blue-200 transition-colors duration-200"
            >
              Ofertas
            </Link>
            <Link
              to="/contacto"
              className="hover:text-blue-200 transition-colors duration-200"
            >
              Contacto
            </Link>
            <Link
              to="/carrito"
              className="hover:text-blue-200 transition-colors duration-200"
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
