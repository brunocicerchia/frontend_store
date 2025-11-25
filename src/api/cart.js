// src/api/cart.js
import { authFetch } from "../lib/auth";

const BASE = "http://localhost:8080/carts";

export async function getMyCart() {
  const res = await authFetch(`${BASE}/me`);
  if (!res.ok) throw new Error("No se pudo obtener el carrito");
  return res.json(); 
}

export async function addItemMe(listingId, quantity = 1) {
  // El backend espera "listing" (no "listingId")
  const res = await authFetch(`${BASE}/me/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listing: listingId, quantity }),
  });
  if (!res.ok) {
    let errorMsg = "No se pudo agregar al carrito";
    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || json.error || text;
        } catch {
          errorMsg = text;
        }
      }
    } catch {
      errorMsg = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMsg);
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