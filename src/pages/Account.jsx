// src/pages/Cuenta.jsx
import React, { useEffect, useState } from "react";
import { getMe } from "../api/user";
import MyOrders from "../components/MyOrders";

export default function Cuenta() {
  const [tab, setTab] = useState("perfil");
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const roleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "SELLER":
        return "Vendedor";
      case "BUYER":
        return "Comprador";
      default:
        return role || "Desconocido";
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Encabezado */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-brand-contrast/10 via-brand-button/10 to-brand-dark/10 border border-brand-dark/10 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Mi cuenta</h1>
            <p className="text-brand-dark/60 text-sm">
              {me?.roles?.includes("ADMIN") || me?.roles?.includes("SELLER")
                ? "Gestiona tu perfil y permisos"
                : "Gestiona tu perfil y consulta tus órdenes"}
            </p>
          </div>
          {me && (
            <div className="inline-flex items-center gap-2 flex-wrap">
              {(me.roles || []).map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white shadow-sm border border-brand-dark/10 text-brand-dark"
                >
                  {roleLabel(role)}
                </span>
              ))}
            </div>
          )}
        </div>
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
              <div className="text-brand-dark/70">Cargando perfil...</div>
            </div>
          )}

          {!loading && err && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
              {err}
            </div>
          )}

          {!loading && !err && me && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card principal */}
              <div className="lg:col-span-2 rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-brand-contrast/10 border border-brand-contrast/30 flex items-center justify-center text-brand-contrast font-semibold">
                      {me.firstname?.[0]}
                      {me.lastname?.[0]}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-brand-dark">
                        {me.firstname} {me.lastname}
                      </h2>
                      <p className="text-sm text-brand-dark/60">{me.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-brand-dark/50">
                    Usuario #{me.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                    <p className="text-xs text-brand-dark/60">Nombre</p>
                    <p className="text-sm font-semibold text-brand-dark">
                      {me.firstname} {me.lastname}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                    <p className="text-xs text-brand-dark/60">Email</p>
                    <p className="text-sm font-semibold text-brand-dark">
                      {me.email}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                    <p className="text-xs text-brand-dark/60">Roles</p>
                    <p className="text-sm font-semibold text-brand-dark">
                      {(me.roles || []).map(roleLabel).join(", ")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                    <p className="text-xs text-brand-dark/60">Estado</p>
                    <p className="text-sm font-semibold text-emerald-600">
                      Activo
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      localStorage.removeItem("jwt");
                      localStorage.removeItem("user");
                      window.location.assign("/");
                    }}
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>

              {/* Card secundaria (placeholder para futuro) */}
              <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-brand-dark mb-3">
                  Preferencias
                </h2>
                <p className="text-sm text-brand-dark/70 mb-4">
                  Próximamente podrás configurar preferencias de notificaciones y direcciones.
                </p>
                <div className="rounded-2xl border border-dashed border-brand-dark/20 p-4 text-sm text-brand-dark/70 bg-gray-50/50">
                  Personaliza tu experiencia y manten tus datos actualizados.
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "ordenes" &&
        !me?.roles?.includes("ADMIN") &&
        !me?.roles?.includes("SELLER") && (
          <div>
            <MyOrders />
          </div>
        )}
    </div>
  );
}
