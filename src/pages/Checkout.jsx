// src/pages/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCart,
  selectCartStatus,
  fetchCart,
} from "../store/cartSlice";
import {
  checkoutFromCart,
  selectCheckoutStatus,
  selectCheckoutError,
} from "../store/ordersSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector(selectCart);
  const cartStatus = useSelector(selectCartStatus);

  const checkoutStatus = useSelector(selectCheckoutStatus);
  const checkoutError = useSelector(selectCheckoutError);

  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [localError, setLocalError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (!cart && cartStatus === "idle") {
      dispatch(fetchCart());
    }
  }, [cart, cartStatus, dispatch]);

  const items = cart?.items ?? [];
  const total = Number(cart?.total ?? cart?.grandTotal ?? 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) {
      setLocalError("Tu carrito está vacío.");
      return;
    }

    try {
      setLocalError(null);
      const order = await dispatch(checkoutFromCart()).unwrap();
      setConfirmation(order);
    } catch (err) {
      setLocalError(err.message || "No se pudo procesar el pago.");
    }
  };

  if (confirmation) {
    const totalOrder = Number(confirmation.total ?? confirmation.grandTotal ?? total);
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h1 className="text-2xl font-bold text-brand-dark mb-2">
              Pago realizado con éxito
            </h1>
            <p className="text-brand-dark/70 mb-6">
              Orden #{confirmation.number ?? confirmation.orderNumber ?? confirmation.id}
            </p>
            <div className="text-4xl font-bold text-brand-contrast mb-6">
              ${totalOrder.toFixed(2)}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/ordenes")}
                className="px-6 py-3 rounded-xl bg-brand-contrast text-white font-semibold hover:bg-brand-contrast/90"
              >
                Ver mis órdenes
              </button>
              <button
                onClick={() => navigate("/productos")}
                className="px-6 py-3 rounded-xl border border-brand-dark/20 text-brand-dark hover:bg-brand-dark/5"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-dark">
              Información de pago
            </h1>
            <button
              onClick={() => navigate("/carrito")}
              className="text-sm text-brand-contrast hover:underline"
            >
              Volver al carrito
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1">
                Nombre del titular
              </label>
              <input
                type="text"
                value={cardholder}
                onChange={(e) => setCardholder(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4111 1111 1111 1111"
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1">
                  Fecha de expiración
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/AA"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-1">
                  Código de seguridad
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>
            </div>

            {(localError || checkoutError) && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {localError || checkoutError}
              </div>
            )}

            <button
              type="submit"
              disabled={checkoutStatus === "loading" || !items.length}
              className="w-full bg-brand-button text-white font-semibold py-3 rounded-xl hover:bg-brand-button-600 disabled:opacity-50"
            >
              {checkoutStatus === "loading" ? "Procesando..." : "Confirmar pago"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-brand-dark">Resumen</h2>
          {cartStatus === "loading" ? (
            <p className="text-brand-dark/60">Cargando carrito...</p>
          ) : !items.length ? (
            <p className="text-brand-dark/60">Tu carrito está vacío.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.listingId ?? item.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-brand-dark/80">
                    {item.title || item.name || `Producto #${item.listingId ?? item.id}`}
                  </span>
                  <span className="text-brand-dark font-semibold">
                    ${Number(item.subtotal ?? item.total ?? item.unitPrice * item.quantity ?? 0).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold text-brand-contrast">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
