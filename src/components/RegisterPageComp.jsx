// src/components/RegisterPageComp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  selectAuthStatus,
  selectAuthError,
} from "../store/authSlice";

export default function RegisterPageComp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "BUYER",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const result = await dispatch(registerUser(payload)).unwrap();
      const userRoles = result?.user?.roles || [];
      const finalRole =
        formData.role === "SELLER" || userRoles.includes("SELLER")
          ? "SELLER"
          : "BUYER";

      if (finalRole === "SELLER") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "No se pudo completar el registro");
    }
  };

  const isSubmitting = authStatus === "loading";

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
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
                    className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-brand-dark/20 bg-white/90 px-4 py-3 text-brand-dark placeholder-brand-dark/50 outline-none focus:ring-2 focus:ring-brand-contrast/60 focus:border-brand-contrast/60 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-3">
                  ¿Cómo vas a usar la plataforma?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: "BUYER", label: "Comprador", desc: "Quiero comprar productos", icon: "🛒" },
                    { key: "SELLER", label: "Vendedor", desc: "Quiero vender productos", icon: "🏷️" },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: option.key }))}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.role === option.key
                          ? "border-brand-contrast bg-brand-contrast/10 shadow-lg"
                          : "border-gray-200 hover:border-brand-contrast/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-contrast/10 text-brand-contrast text-sm font-semibold">
                          {option.icon}
                        </span>
                        <span className="font-semibold text-brand-dark">{option.label}</span>
                      </div>
                      <p className="text-xs text-gray-600">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {(error || authError) && (
                <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error || authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-contrast text-brand-light py-3 rounded-lg font-semibold hover:bg-brand-contrast-600 transition-all duration-300 focus:ring-2 focus:ring-brand-contrast focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

