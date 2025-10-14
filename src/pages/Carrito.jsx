import React, { useEffect, useMemo, useState } from 'react';

function formatMoney(n) {
  if (n == null) return '$0';
  const num = typeof n === 'number' ? n : Number(n);
  return `$${num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Carrito() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const API_URL = "http://localhost:8080";
  const TOKEN = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc2MDQ2NzYwNiwiZXhwIjoxNzYwNTU0MDA2fQ.-yy8Sjyi64vOqY2PmyfvQx9e-3xULvpeau8A9I3aADKzm5OZPO6quv-cdpKIptdbUP7EBk7oMtfmn9N9j5G6iw"; 
  const CART_ID = 8;

  async function getCart(cartId) {
    const res = await fetch(`${API_URL}/carts/${cartId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": TOKEN,
      },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Error ${res.status}: ${text || res.statusText}`);
    }
    return res.json();
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getCart(CART_ID);
        setCart(data);
      } catch (e) {
        setErr(e.message || 'Error cargando el carrito');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const items = cart?.items ?? [];
  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.subtotal ?? (it.unitPrice * it.quantity) ?? 0), 0),
    [items]
  );
  const total = cart?.total ?? subtotal;

  // === Render ===
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-brand-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-contrast/10 border border-brand-contrast/30 text-brand-contrast text-xs sm:text-sm font-medium tracking-wide">
              CARRITO
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-light mb-4 text-center leading-tight tracking-tight">
            🛒 Carrito de Compras
          </h1>
        </div>

        {loading && <div className="text-center text-brand-light/80">Cargando carrito…</div>}
        {!loading && err && <div className="text-center text-red-400">{err}</div>}

        {!loading && !err && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Productos */}
            <div className="lg:col-span-2 bg-brand-light rounded-xl shadow-lg p-8 sm:p-12 text-center border-2 border-brand-contrast/20">
              {items.length === 0 ? (
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-6">🛒</div>
                  <p className="text-xl sm:text-2xl font-semibold text-brand-dark mb-4">
                    Tu carrito está vacío
                  </p>
                  <p className="text-base sm:text-lg text-brand-dark-400 mb-6">
                    ¡Agrega productos desde nuestra sección de Productos!
                  </p>
                  <button
                    className="bg-brand-contrast text-brand-light px-6 py-3 rounded-lg font-medium hover:bg-brand-contrast-600 transition-all duration-300 hover:shadow-lg hover:shadow-brand-contrast/30"
                    onClick={() => (window.location.href = '/productos')}
                  >
                    Ver Productos
                  </button>
                </div>
              ) : (
                <ul className="text-left divide-y divide-brand-dark/10">
                  {items.map((it) => (
                    <li key={it.itemId} className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-brand-dark">{it.title || `Producto #${it.listingId}`}</p>
                        <p className="text-sm text-brand-dark-400">
                          Precio: {formatMoney(it.unitPrice)} · Cantidad: {it.quantity}
                        </p>
                        <p className="text-sm text-brand-dark-400">
                          Subtotal: {formatMoney(it.subtotal ?? it.unitPrice * it.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Resumen */}
            <div className="bg-brand-light rounded-xl shadow-lg p-6 sm:p-8 h-fit sticky top-20 border-2 border-brand-contrast/20">
              <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-6">
                Resumen de compra
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-brand-dark/10">
                  <span className="text-base sm:text-lg text-brand-dark-400">Subtotal:</span>
                  <span className="text-base sm:text-lg font-semibold text-brand-dark">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-brand-dark/10">
                  <span className="text-base sm:text-lg text-brand-dark-400">Envío:</span>
                  <span className="text-base sm:text-lg font-semibold text-brand-contrast">Gratis</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg sm:text-xl font-bold text-brand-dark">Total:</span>
                  <span className="text-lg sm:text-xl font-bold text-brand-button">{formatMoney(total)}</span>
                </div>
              </div>

              <button 
                disabled={items.length === 0}
                className="w-full bg-brand-button text-brand-light font-semibold py-3 sm:py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-button-600 text-sm sm:text-base"
              >
                Proceder al pago
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;