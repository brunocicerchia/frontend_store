// src/components/RegisterPageComp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api/v1";
const API_REGISTER_URL = `${API_BASE}/auth/register`;
const API_ME_URL = `${API_BASE}/users/me`;

export default function RegisterPageComp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "BUYER"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Registro
      const registerBody = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      const res = await fetch(API_REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerBody),
      });

      if (!res.ok) {
        let msg = "Error al registrarse";
        try {
          const t = await res.text();
          if (t) msg = t;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      const token = data.access_token || data.token || data.jwt;
      if (!token) throw new Error("La API no devolvió access_token");

      // Guardar token
      localStorage.setItem("jwt", token);

      // Obtener información del usuario
      const meRes = await fetch(API_ME_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (meRes.ok) {
        const me = await meRes.json();
        localStorage.setItem("user", JSON.stringify(me));
        
        // Redirigir según el rol
        if (formData.role === "SELLER") {
          window.location.assign("/dashboard");
        } else {
          window.location.assign("/");
        }
      } else {
        window.location.assign("/");
      }
    } catch (err) {
      setError(err.message || "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-contrast/10 text-brand-contrast text-xs sm:text-sm font-medium tracking-wide">
              REGISTRO
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-light leading-tight">
            Crear cuenta
          </h1>
          <p className="mt-3 text-brand-light-400 max-w-xl mx-auto">
            Completá tus datos para comenzar a comprar o vender en nuestra plataforma
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-brand-light rounded-2xl shadow-2xl border border-brand-dark/10 overflow-hidden">
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    placeholder="Juan"
                    className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    placeholder="Pérez"
                    className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                />
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-3">
                  ¿Cómo vas a usar la plataforma?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: "BUYER" }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.role === "BUYER"
                        ? "border-brand-contrast bg-brand-contrast/10 shadow-lg"
                        : "border-gray-200 hover:border-brand-contrast/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🛒</span>
                      <span className="font-semibold text-brand-dark">Comprador</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Quiero comprar productos
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: "SELLER" }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.role === "SELLER"
                        ? "border-brand-contrast bg-brand-contrast/10 shadow-lg"
                        : "border-gray-200 hover:border-brand-contrast/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🏪</span>
                      <span className="font-semibold text-brand-dark">Vendedor</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Quiero vender productos
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: "ADMIN" }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.role === "ADMIN"
                        ? "border-brand-contrast bg-brand-contrast/10 shadow-lg"
                        : "border-gray-200 hover:border-brand-contrast/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">👑</span>
                      <span className="font-semibold text-brand-dark">Administrador</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Gestión completa
                    </p>
                  </button>
                </div>
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
                {loading ? "Registrando…" : "Crear Cuenta"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-brand-dark/70">
              ¿Ya tenés cuenta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-brand-contrast hover:underline font-semibold"
              >
                Iniciar sesión
              </button>
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
