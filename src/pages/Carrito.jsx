// src/pages/Carrito.jsx
import React, { useEffect, useState } from "react";
import { getMyCart, updateQtyMe, removeItemMe, clearMyCart } from "../api/cart";
import { authHeaders } from "../lib/auth";

export default function Carrito() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [metaByListing, setMetaByListing] = useState({});

  async function load() {
    setLoading(true);
    setError(null);
    // ⚠️ NO limpiar success acá, así el mensaje persiste tras recargar el carrito
    try {
      const data = await getMyCart();
      setCart(data);
    } catch (e) {
      setError(e.message || "No se pudo cargar el carrito");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function inc(listingId, current) {
    setWorking(listingId);
    setError(null);
    try {
      const data = await updateQtyMe(listingId, current + 1);
      setCart(data);
    } catch (e) {
      setError(e.message || "No se pudo actualizar la cantidad");
    } finally {
      setWorking(null);
    }
  }

  async function dec(listingId, current) {
    if (current <= 1) return;
    setWorking(listingId);
    setError(null);
    try {
      const data = await updateQtyMe(listingId, current - 1);
      setCart(data);
    } catch (e) {
      setError(e.message || "No se pudo actualizar la cantidad");
    } finally {
      setWorking(null);
    }
  }

  async function remove(listingId) {
    setWorking(listingId);
    setError(null);
    try {
      const data = await removeItemMe(listingId);
      setCart(data);
    } catch (e) {
      setError(e.message || "No se pudo eliminar el item");
    } finally {
      setWorking(null);
    }
  }

  async function clearAll() {
    setWorking("clear");
    setError(null);
    try {
      const data = await clearMyCart();
      setCart(data);
    } catch (e) {
      setError(e.message || "No se pudo vaciar el carrito");
    } finally {
      setWorking(null);
    }
  }

  // === Checkout ===
  async function handleCheckout() {
    setWorking("checkout");
    setError(null);
    // no tocamos success acá
    try {
      const res = await fetch("http://localhost:8080/orders/me/checkout", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => null);
        throw new Error(msg || "No se pudo completar el checkout");
      }
      const order = await res.json();
      await load(); // primero refrescamos el carrito vacío (conservado)
      setSuccess({ number: order.orderNumber, total: order.grandTotal }); // luego mostramos el aviso
      // Ocultar mensaje después de 6s
      setTimeout(() => setSuccess(null), 6000);
    } catch (e) {
      setError(e.message || "No se pudo crear la orden");
    } finally {
      setWorking(null);
    }
  }

  // === Enriquecer productos con brand/model/variant para mostrar info linda ===
  useEffect(() => {
    if (!cart?.items?.length) {
      setMetaByListing({});
      return;
    }

    (async () => {
      const headers = authHeaders({ "Content-Type": "application/json" });
      try {
        const entries = await Promise.all(
          cart.items.map(async (it) => {
            try {
              const lRes = await fetch(`http://localhost:8080/listings/${it.listingId}`, { headers });
              if (!lRes.ok) return [it.listingId, null];
              const listing = await lRes.json();

              const vRes = await fetch(`http://localhost:8080/variants/${listing.variantId}`, { headers });
              const variant = vRes.ok ? await vRes.json() : null;

              let model = null, brand = null;
              if (variant?.deviceModelId) {
                const mRes = await fetch(`http://localhost:8080/device-models/${variant.deviceModelId}`, { headers });
                model = mRes.ok ? await mRes.json() : null;
                if (model?.brandId) {
                  const bRes = await fetch(`http://localhost:8080/brands/${model.brandId}`, { headers });
                  brand = bRes.ok ? await bRes.json() : null;
                }
              }

              return [it.listingId, { listing, variant, model, brand }];
            } catch {
              return [it.listingId, null];
            }
          })
        );
        setMetaByListing(Object.fromEntries(entries));
      } catch {
        // ignoramos errores de enriquecimiento
      }
    })();
  }, [cart]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8">Cargando carrito…</div>;

  const items = cart?.items || [];
  const total = cart?.total ?? 0;

  const conditionLabel = (c) =>
    c === "NEW" ? "Nuevo" :
    c === "REFURB" ? "Reacondicionado" :
    c === "USED" ? "Usado" : c;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Tu carrito</h1>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            disabled={working === "clear"}
            className="px-4 py-2 rounded-xl border border-brand-dark/20 text-brand-dark hover:bg-brand-dark/10 disabled:opacity-60"
          >
            {working === "clear" ? "Vaciando…" : "Vaciar carrito"}
          </button>
        )}
      </div>

      {/* Mensajes visuales en la interfaz */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-3 border border-green-200">
          <p className="font-semibold">✅ Orden creada correctamente</p>
          <p className="text-sm">
            <span className="font-medium">Número:</span> {success.number} ·{" "}
            <span className="font-medium">Total:</span> ${Number(success.total).toFixed(2)}
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center text-brand-dark/70">
          Tu carrito está vacío.
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-brand-light/50">
              <tr>
                <th className="text-left p-4 text-sm text-brand-dark/70 font-medium">Producto</th>
                <th className="text-right p-4 text-sm text-brand-dark/70 font-medium">Precio</th>
                <th className="text-center p-4 text-sm text-brand-dark/70 font-medium">Cantidad</th>
                <th className="text-right p-4 text-sm text-brand-dark/70 font-medium">Subtotal</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => {
                const meta = metaByListing[it.listingId];
                const brandName = meta?.brand?.name;
                const modelName = meta?.model?.modelName;
                const v = meta?.variant;

                return (
                  <tr key={it.itemId} className="border-t border-gray-100">
                    <td className="p-4">
                      <div className="text-brand-dark font-semibold leading-snug">
                        {brandName || ""}{brandName && modelName ? " " : ""}{modelName || ""}
                      </div>
                      <div className="text-sm text-brand-dark/70">
                        {[
                          v?.ram ? `${v.ram}GB RAM` : null,
                          v?.storage ? `${v.storage}GB` : null,
                          v?.color || null,
                          v?.condition ? conditionLabel(v.condition) : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </td>

                    <td className="p-4 text-right">${Number(it.unitPrice).toFixed(2)}</td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => dec(it.listingId, it.quantity)}
                          disabled={working === it.listingId || it.quantity <= 1}
                          className="w-8 h-8 rounded-lg border border-brand-dark/20 hover:bg-brand-dark/10 disabled:opacity-60"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{it.quantity}</span>
                        <button
                          onClick={() => inc(it.listingId, it.quantity)}
                          disabled={working === it.listingId}
                          className="w-8 h-8 rounded-lg border border-brand-dark/20 hover:bg-brand-dark/10 disabled:opacity-60"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="p-4 text-right">${Number(it.subtotal).toFixed(2)}</td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => remove(it.listingId)}
                        disabled={working === it.listingId}
                        className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t border-gray-100">
                <td colSpan={3} className="p-4 text-right font-semibold text-brand-dark">Total</td>
                <td className="p-4 text-right font-bold text-brand-contrast">
                  ${Number(total).toFixed(2)}
                </td>
                <td className="p-4"></td>
              </tr>
            </tfoot>
          </table>

          {/* Botón de checkout */}
          <div className="flex justify-end p-4 border-t border-gray-100 bg-white">
            <button
              onClick={handleCheckout}
              disabled={items.length === 0 || working === "checkout"}
              className="bg-brand-button text-brand-light font-semibold py-3 px-6 rounded-lg hover:bg-brand-button-600 disabled:opacity-50"
            >
              {working === "checkout" ? "Procesando…" : "Proceder al pago"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}