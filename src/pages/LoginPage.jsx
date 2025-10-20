// src/pages/LoginPage.jsx
import React from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-contrast/10 text-brand-contrast text-xs sm:text-sm font-medium tracking-wide">
              ACCESO
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-light leading-tight">
            Iniciar sesión
          </h1>
          <p className="mt-3 text-brand-light-400 max-w-xl mx-auto">
            Ingresá con tu cuenta para comprar más rápido y ver tu carrito sincronizado.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-md mx-auto bg-brand-light rounded-2xl shadow-2xl border border-brand-dark/10 overflow-hidden">
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-contrast to-brand-alt-500 text-white font-semibold px-4 py-3 shadow-lg hover:shadow-xl active:scale-[0.99] transition"
              >
                Ingresar
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-brand-dark/70">
              ¿No tenés cuenta?{" "}
              <a className="text-brand-contrast hover:underline" href="#">
                Crear cuenta
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}