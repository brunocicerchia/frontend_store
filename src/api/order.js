// src/api/order.js
import { authHeaders } from "../lib/auth";

const BASE = "http://localhost:8080/orders";

// GET /orders/me?page=&size=
export async function getMyOrders(page = 0, size = 20) {
  const res = await fetch(`${BASE}/me?page=${page}&size=${size}`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo obtener tus órdenes");
  }

  return res.json(); // Page<OrderResponse>
}

// POST /orders/me/checkout
export async function checkoutMe() {
  const res = await fetch(`${BASE}/me/checkout`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo crear la orden");
  }

  return res.json(); // OrderResponse
}
