// src/pages/Carrito.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  selectCart,
  selectCartStatus,
  selectCartError,
  fetchCart,
  changeItemQuantity,
  removeItemFromCart,
  clearCart,
} from "../store/cartSlice";
import { getEnrichedListing } from "../api/products";

export default function Carrito() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado del carrito
  const cart = useSelector(selectCart);
  const status = useSelector(selectCartStatus);
  const cartError = useSelector(selectCartError);

  // Estado local de UI
  const [working, setWorking] = useState(null); // "clear" | "checkout" | listingId | null
  const [localError, setLocalError] = useState(null);
  const [resolvedTitles, setResolvedTitles] = useState({});

  // Cargar carrito al entrar si aún no lo tenemos
  const fetchedCartOnce = useRef(false);
  const fetchingTitles = useRef(new Set());

  const loading = status === "loading";
  const items = cart?.items ?? [];
  const total = Number(cart?.total ?? cart?.grandTotal ?? 0);

  useEffect(() => {
    if (fetchedCartOnce.current) return;
    if (!cart && status === "idle") {
      fetchedCartOnce.current = true;
      dispatch(fetchCart());
    }
  }, [cart, status, dispatch]);

  useEffect(() => {
    if (!items.length) return;

    const missingIds = [];
    for (const item of items) {
      const listingId = item.listingId ?? item.id ?? item.itemId;
      if (!listingId) continue;
      if (extractInlineTitle(item)) continue;
      if (resolvedTitles[listingId]) continue;
      if (fetchingTitles.current.has(listingId)) continue;
      missingIds.push(listingId);
    }

    if (!missingIds.length) return;

    missingIds.forEach((listingId) => {
      fetchingTitles.current.add(listingId);
      getEnrichedListing(listingId)
        .then((listing) => {
          const title = buildListingTitle(listing);
          if (title) {
            setResolvedTitles((prev) => ({
              ...prev,
              [listingId]: title,
            }));
          }
        })
        .catch((err) => {
          console.error("No se pudo resolver el nombre del listing", err);
        })
        .finally(() => {
          fetchingTitles.current.delete(listingId);
        });
    });
  }, [items, resolvedTitles]);

  function buildListingTitle(listing) {
    if (!listing) return null;
    const base =
      listing.title ||
      listing.name ||
      listing.productName ||
      listing.variant?.model?.modelName ||
      listing.variant?.model?.name ||
      listing.variant?.model?.deviceName ||
      listing.variant?.name ||
      listing.brand?.name ||
      null;

    if (base) {
      const brand =
        listing.brand?.name ||
        listing.variant?.model?.brand?.name ||
        listing.variant?.brand?.name ||
        listing.seller?.shopName ||
        null;
      const extraPieces = [
        brand && brand !== base ? brand : null,
        base,
        listing.variant?.storage ? `${listing.variant.storage}GB` : null,
        listing.variant?.color || listing.variant?.model?.color || null,
      ].filter(Boolean);
      return extraPieces.join(" · ").trim();
    }

    const brand =
      listing.brand?.name ||
      listing.variant?.model?.brand?.name ||
      listing.variant?.brand?.name ||
      null;
    const model =
      listing.variant?.model?.modelName ||
      listing.variant?.model?.name ||
      listing.variant?.model?.deviceName ||
      null;
    const fallbackPieces = [
      brand,
      model,
      listing.variant?.storage ? `${listing.variant.storage}GB` : null,
      listing.variant?.color || listing.variant?.model?.color || null,
    ].filter(Boolean);

    return fallbackPieces.length ? fallbackPieces.join(" · ").trim() : null;
  }

  function extractInlineTitle(item) {
    const brandModel = `${item.brand ?? item.listing?.brand ?? item.product?.brand ?? ""} ${item.model ?? item.listing?.model ?? item.product?.model ?? ""}`.trim();
    const nestedListingTitle = item.listing ? buildListingTitle(item.listing) : null;
    return (
      item.title ||
      item.name ||
      item.listingTitle ||
      item.productTitle ||
      nestedListingTitle ||
      item.listing?.title ||
      item.listing?.name ||
      item.product?.title ||
      item.product?.name ||
      (brandModel.length ? brandModel : null)
    );
  }

  const resolveItemTitle = (item, fallback, resolved) =>
    extractInlineTitle(item) || resolved || fallback;

  // Cambiar cantidad de un ítem
  const handleQtyChange = async (listingId, newQty) => {
    if (newQty < 1) return;
    setWorking(listingId);
    try {
      await dispatch(
        changeItemQuantity({ listingId, quantity: newQty })
      ).unwrap();
    } catch (err) {
      console.error(err);
      setLocalError(err.message || "No se pudo actualizar la cantidad");
    } finally {
      setWorking(null);
    }
  };

  const dec = (listingId, currentQty) => {
    if (currentQty <= 1) return;
    handleQtyChange(listingId, currentQty - 1);
  };

  const inc = (listingId, currentQty) => {
    handleQtyChange(listingId, currentQty + 1);
  };

  const handleRemove = async (listingId) => {
    setWorking(listingId);
    try {
      await dispatch(removeItemFromCart({ listingId })).unwrap();
    } catch (err) {
      console.error(err);
      setLocalError(err.message || "No se pudo quitar el producto");
    } finally {
      setWorking(null);
    }
  };

  const clearAll = async () => {
    setWorking("clear");
    try {
      await dispatch(clearCart()).unwrap();
    } catch (err) {
      console.error(err);
      setLocalError(err.message || "No se pudo vaciar el carrito");
    } finally {
      setWorking(null);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Estados básicos
  if (loading && !cart) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-brand-contrast mx-auto mb-3" />
        <div className="text-brand-dark/70">Cargando carrito…</div>
      </div>
    );
  }

  if ((cartError || localError) && !cart) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Error: {cartError || localError}
      </div>
    );
  }

  if (!cart || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-dark mb-4">
          Tu carrito
        </h1>
        <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center text-brand-dark/70">
          Tu carrito está vacío.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Título y botón vaciar */}
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

      {/* Mensajes de error / éxito */}
      {(cartError || localError) && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 border border-red-200">
          {cartError || localError}
        </div>
      )}

      {/* Tabla de productos */}
      <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-brand-light/50">
            <tr>
              <th className="text-left p-4 text-sm text-brand-dark/70 font-medium">
                Producto
              </th>
              <th className="text-right p-4 text-sm text-brand-dark/70 font-medium">
                Precio
              </th>
              <th className="text-center p-4 text-sm text-brand-dark/70 font-medium">
                Cantidad
              </th>
              <th className="text-right p-4 text-sm text-brand-dark/70 font-medium">
                Subtotal
              </th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const listingId = it.listingId ?? it.id ?? it.itemId;
              const unitPrice = Number(it.unitPrice ?? 0);
              const qty = Number(it.quantity ?? 0);
              const subtotal =
                it.subtotal ??
                it.total ??
                (unitPrice && qty ? unitPrice * qty : 0);
              const displayName = resolveItemTitle(
                it,
                `Producto #${listingId}`,
                listingId ? resolvedTitles[listingId] : null
              );

              return (
                <tr
                  key={listingId}
                  className="border-t border-gray-100"
                >
                  <td className="p-4">
                    <div className="text-brand-dark font-semibold leading-snug">
                      {displayName}
                    </div>
                    {/* Si más adelante querés mostrar más metadatos, podés agregarlos acá */}
                  </td>

                  <td className="p-4 text-right">
                    ${unitPrice.toFixed(2)}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => dec(listingId, qty)}
                        disabled={
                          working === listingId || qty <= 1
                        }
                        className="w-8 h-8 rounded-lg border border-brand-dark/20 hover:bg-brand-dark/10 disabled:opacity-60"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => inc(listingId, qty)}
                        disabled={working === listingId}
                        className="w-8 h-8 rounded-lg border border-brand-dark/20 hover:bg-brand-dark/10 disabled:opacity-60"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    ${Number(subtotal).toFixed(2)}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRemove(listingId)}
                      disabled={working === listingId}
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
              <td
                colSpan={3}
                className="p-4 text-right font-semibold text-brand-dark"
              >
                Total
              </td>
              <td className="p-4 text-right font-bold text-brand-contrast">
                ${total.toFixed(2)}
              </td>
              <td className="p-4" />
            </tr>
          </tfoot>
        </table>

        {/* Botón de checkout */}
        <div className="flex justify-end p-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="bg-brand-button text-brand-light font-semibold py-3 px-6 rounded-lg hover:bg-brand-button-600 disabled:opacity-50"
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
}








