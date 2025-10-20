// src/pages/MisOrdenes.jsx
import React, { useEffect, useState } from "react";
import { getMyOrders } from "../api/order";

export default function MisOrdenes() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [expanded, setExpanded] = useState({}); // orderId -> bool
  const [pageIndex, setPageIndex] = useState(0);

  async function load(p = 0) {
    setLoading(true);
    setErr(null);
    try {
      const data = await getMyOrders(p, 20);
      setPage(data);
      setPageIndex(p);
    } catch (e) {
      setErr(e.message || "No se pudieron cargar tus órdenes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(0); }, []);

  const orders = page?.content || [];
  const hasPrev = pageIndex > 0;
  const hasNext = page ? pageIndex + 1 < page.totalPages : false;

  const fmtMoney = (n) => `$${Number(n ?? 0).toFixed(2)}`;
  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };

  const statusBadge = (s) => {
    const base = "inline-block px-2 py-0.5 rounded-full text-xs font-semibold";
    switch (s) {
      case "PENDING_PAYMENT": return `${base} bg-yellow-500/10 text-yellow-700`;
      case "PAID": return `${base} bg-green-500/10 text-green-700`;
      case "CANCELLED": return `${base} bg-red-500/10 text-red-700`;
      case "SHIPPED": return `${base} bg-blue-500/10 text-blue-700`;
      case "DELIVERED": return `${base} bg-emerald-500/10 text-emerald-700`;
      default: return `${base} bg-gray-500/10 text-gray-700`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Mis órdenes</h1>
        <p className="text-brand-dark/60">Historial de compras</p>
      </div>

      {loading && (
        <div className="rounded-xl bg-white border border-gray-100 p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-brand-contrast mx-auto mb-3" />
          <div className="text-brand-dark/70">Cargando órdenes…</div>
        </div>
      )}

      {!loading && err && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && orders.length === 0 && (
        <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center text-brand-dark/70">
          Aún no tenés órdenes.
        </div>
      )}

      {!loading && !err && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((o) => {
            const isOpen = !!expanded[o.id];
            return (
              <div
                key={o.id}
                className="rounded-xl bg-white border-2 border-transparent hover:border-brand-contrast/30 transition-all duration-200 shadow-sm"
              >
                {/* Encabezado */}
                <button
                  className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  onClick={() => setExpanded((s) => ({ ...s, [o.id]: !isOpen }))}
                >
                  <div className="space-y-1">
                    <div className="text-sm text-brand-dark/60">Orden</div>
                    <div className="text-brand-dark font-semibold">{o.orderNumber}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={statusBadge(o.status)}>{o.status}</span>
                    <div className="text-sm text-brand-dark/70">{fmtDate(o.createdAt)}</div>
                    <div className="text-brand-contrast font-bold">{fmtMoney(o.grandTotal)}</div>
                  </div>
                </button>

                {/* Detalle */}
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 border-t border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-brand-light/40">
                          <tr>
                            <th className="text-left p-3 text-sm text-brand-dark/70 font-medium">Producto</th>
                            <th className="text-right p-3 text-sm text-brand-dark/70 font-medium">Precio</th>
                            <th className="text-center p-3 text-sm text-brand-dark/70 font-medium">Cantidad</th>
                            <th className="text-right p-3 text-sm text-brand-dark/70 font-medium">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {o.items?.map((it) => (
                            <tr key={it.id} className="border-t border-gray-100">
                              <td className="p-3">
                                <div className="text-brand-dark font-medium">{it.title || `Listing #${it.listingId}`}</div>
                                <div className="text-xs text-brand-dark/60">Listing #{it.listingId}</div>
                              </td>
                              <td className="p-3 text-right">{fmtMoney(it.unitPrice)}</td>
                              <td className="p-3 text-center">{it.quantity}</td>
                              <td className="p-3 text-right">{fmtMoney(it.lineTotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-gray-100">
                            <td colSpan={3} className="p-3 text-right text-brand-dark font-semibold">Subtotal</td>
                            <td className="p-3 text-right">{fmtMoney(o.subtotal)}</td>
                          </tr>
                          {Number(o.discountTotal || 0) > 0 && (
                            <tr>
                              <td colSpan={3} className="p-3 text-right text-brand-dark font-semibold">Descuentos</td>
                              <td className="p-3 text-right">-{fmtMoney(o.discountTotal)}</td>
                            </tr>
                          )}
                          {Number(o.taxTotal || 0) > 0 && (
                            <tr>
                              <td colSpan={3} className="p-3 text-right text-brand-dark font-semibold">Impuestos</td>
                              <td className="p-3 text-right">{fmtMoney(o.taxTotal)}</td>
                            </tr>
                          )}
                          <tr>
                            <td colSpan={3} className="p-3 text-right text-brand-dark font-semibold">Total</td>
                            <td className="p-3 text-right text-brand-contrast font-bold">{fmtMoney(o.grandTotal)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Paginación simple */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => load(pageIndex - 1)}
              disabled={!hasPrev}
              className="px-4 py-2 rounded-xl border border-brand-dark/20 text-brand-dark disabled:opacity-50"
            >
              Anterior
            </button>
            <div className="text-sm text-brand-dark/70">
              Página {pageIndex + 1} de {page?.totalPages ?? 1}
            </div>
            <button
              onClick={() => load(pageIndex + 1)}
              disabled={!hasNext}
              className="px-4 py-2 rounded-xl border border-brand-dark/20 text-brand-dark disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}