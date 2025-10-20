import { authHeaders } from "../lib/auth";

export async function getMyOrders(page = 0, size = 20) {
  const res = await fetch(`http://localhost:8080/orders/me?page=${page}&size=${size}`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo obtener tus órdenes");
  }
  return res.json(); // Page<OrderResponse>
}