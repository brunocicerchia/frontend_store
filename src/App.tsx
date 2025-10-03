import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Marcas from "./pages/Marcas";
import Ofertas from "./pages/Ofertas";
import Contacto from "./pages/Contacto";
import Carrito from "./pages/Carrito";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
