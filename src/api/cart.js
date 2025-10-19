// src/api/cart.js
import { authFetch } from "../lib/auth";

const BASE = "http://localhost:8080/carts";

export async function getMyCart() {
  const res = await authFetch(`${BASE}/me`);
  if (!res.ok) throw new Error("No se pudo obtener el carrito");
  return res.json(); // { cartId, items:[...], total }
}

export async function addItemMe(listingId, quantity = 1) {
  const res = await authFetch(`${BASE}/me/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId, quantity }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(()=>null);
    throw new Error(msg || "No se pudo agregar al carrito");
  }
  return res.json();
}

export async function updateQtyMe(listingId, quantity) {
  const res = await authFetch(`${BASE}/me/items/${listingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("No se pudo actualizar la cantidad");
  return res.json();
}

export async function removeItemMe(listingId) {
  const res = await authFetch(`${BASE}/me/items/${listingId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo eliminar el item");
  return res.json();
}

export async function clearMyCart() {
  const res = await authFetch(`${BASE}/me`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo vaciar el carrito");
  return res.json();
}