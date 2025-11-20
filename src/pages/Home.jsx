import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#091025] relative overflow-hidden flex items-center">

      {/* Glows MUY suaves para que no quede vacío */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 bg-cyan-400/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 bg-sky-500/10 blur-[150px] rounded-full" />

      {/* Contenido centrado */}
      <div className="relative z-10 w-full px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[11px] tracking-[0.22em] uppercase mb-6">
            • Tiendas • Multimarca • Celulares
          </div>

          {/* Título */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight tracking-tight">
            <span className="block">Todo el mundo de tu</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
              tienda móvil
            </span>
            <span className="block">en un solo lugar.</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-white/70 text-sm md:text-base mt-6 leading-relaxed max-w-xl mx-auto">
            Explora tiendas, compará precios, descubrí productos y centralizá toda
            tu experiencia en un único portal unificado.
          </p>

          {/* Botones */}
          <div className="flex flex-wrap gap-3 mt-10 justify-center">
            <button
              onClick={() => navigate("/productos")}
              className="px-8 py-3 rounded-xl bg-gray-100 text-gray-900 text-sm font-medium shadow-[0_10px_35px_rgba(0,0,0,0.45)] hover:bg-white transition"
            >
              Explorar productos
            </button>

            <button
              onClick={() => navigate("/contacto")}
              className="px-8 py-3 rounded-xl border border-white/15 text-sm font-medium text-white hover:bg-white/5 transition"
            >
              Contacto
            </button>
          </div>

          {/* Métricas */}
          <div className="flex flex-wrap justify-center gap-10 mt-14 text-white/70 text-xs md:text-sm">
            <div className="text-center">
              <p className="text-3xl font-semibold text-white leading-none">3</p>
              <p className="mt-1 uppercase tracking-wide text-[11px] text-white/50">
                Tiendas
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold text-white leading-none">24/7</p>
              <p className="mt-1 uppercase tracking-wide text-[11px] text-white/50">
                Disponible
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold text-white leading-none">+6</p>
              <p className="mt-1 uppercase tracking-wide text-[11px] text-white/50">
                Años online
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
