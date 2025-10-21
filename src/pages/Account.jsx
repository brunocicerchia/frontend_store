// src/pages/Cuenta.jsx
import React, { useEffect, useState } from "react";
import { getMe } from "../api/user";
import MisOrdenes from "../components/MyOrders";

export default function Cuenta() {
  const [tab, setTab] = useState("perfil");
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getMe();
        setMe(data);
      } catch (e) {
        setErr(e.message || "No se pudieron cargar tus datos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Mi cuenta</h1>
        <p className="text-brand-dark/60">
          {me?.roles?.includes("ADMIN") || me?.roles?.includes("SELLER")
            ? "Gestioná tu perfil"
            : "Gestioná tu perfil y consultá tus órdenes"}
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-xl bg-white border border-gray-200 overflow-hidden mb-6">
        <button
          onClick={() => setTab("perfil")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "perfil"
              ? "bg-brand-contrast text-white"
              : "text-brand-dark hover:bg-brand-dark/5"
          }`}
        >
          Perfil
        </button>
        {/* Solo mostrar pestaña de órdenes para BUYER */}
        {!me?.roles?.includes("ADMIN") && !me?.roles?.includes("SELLER") && (
          <button
            onClick={() => setTab("ordenes")}
            className={`px-4 py-2 text-sm font-medium ${
              tab === "ordenes"
                ? "bg-brand-contrast text-white"
                : "text-brand-dark hover:bg-brand-dark/5"
            }`}
          >
            Mis órdenes
          </button>
        )}
      </div>

      {/* Contenido */}
      {tab === "perfil" && (
        <>
          {loading && (
            <div className="rounded-xl bg-white border border-gray-100 p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-brand-contrast mx-auto mb-3" />
              <div className="text-brand-dark/70">Cargando perfil…</div>
            </div>
          )}

          {!loading && err && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
              {err}
            </div>
          )}

          {!loading && !err && me && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card principal */}
              <div className="rounded-2xl bg-white border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">Datos personales</h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-dark/70">Nombre</span>
                    <span className="font-medium text-brand-dark">
                      {me.firstname} {me.lastname}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-dark/70">Email</span>
                    <span className="font-medium text-brand-dark">{me.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-dark/70">ID de usuario</span>
                    <span className="font-medium text-brand-dark">#{me.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-dark/70">Roles</span>
                    <span className="font-medium text-brand-dark">
                      {(me.roles || []).join(", ")}
                    </span>
                  </div>
                </div>
                
                {/* Botón de Logout */}
                <button
                  onClick={() => {
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("user");
                    window.location.assign("/");
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  Cerrar Sesión
                </button>
              </div>

              {/* Card secundaria (placeholder para futuro) */}
              <div className="rounded-2xl bg-white border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-brand-dark mb-4">Preferencias</h2>
                <p className="text-sm text-brand-dark/70">
                  Próximamente podrás configurar preferencias de notificaciones y direcciones.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "ordenes" && !me?.roles?.includes("ADMIN") && !me?.roles?.includes("SELLER") && (
        <div>
          <MisOrdenes />
        </div>
      )}
    </div>
  );
}