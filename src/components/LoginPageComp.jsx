// src/components/LoginPageComp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api/v1";
const API_LOGIN_URL = `${API_BASE}/auth/authenticate`;
const API_ME_URL = `${API_BASE}/users/me`;

export default function LoginPageComp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let msg = "Error al iniciar sesión";
        try {
          const t = await res.text();
          if (t) msg = t;
        } catch {}
        if (res.status === 401) msg = "Credenciales inválidas";
        throw new Error(msg);
      }

      const data = await res.json();
      const token = data.access_token || data.token || data.jwt;
      if (!token) throw new Error("La API no devolvió access_token");

      localStorage.setItem("jwt", token);

      const meRes = await fetch(API_ME_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const me = await meRes.json();
        localStorage.setItem("user", JSON.stringify(me));
      }

      window.location.assign("/");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
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

        <div className="max-w-md mx-auto bg-brand-light rounded-2xl shadow-2xl border border-brand-dark/10 overflow-hidden">
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-contrast to-brand-alt-500 text-white font-semibold px-4 py-3 shadow-lg hover:shadow-xl active:scale-[0.99] transition disabled:opacity-60"
              >
                {loading ? "Ingresando…" : "Ingresar"}
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

        <p className="text-center mt-10 text-brand-light-400 text-xs">
          Al continuar, aceptás nuestros Términos y Política de Privacidad.
        </p>
      </div>
    </div>
  );
}