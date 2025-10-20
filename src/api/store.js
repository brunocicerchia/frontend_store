import { authHeaders } from "../lib/auth";

const API_BASE = "http://localhost:8080";

export async function getMySeller() {
  const res = await fetch(`${API_BASE}/seller/me`, {
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo obtener la información del vendedor");
  }
  return res.json();
}

export async function createSeller(data) {
  const res = await fetch(`${API_BASE}/seller`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo crear el vendedor");
  }
  return res.json();
}

export async function updateSeller(id, data) {
  const res = await fetch(`${API_BASE}/seller/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo actualizar el vendedor");
  }
  return res.json();
}

export async function getAllSellers() {
  const res = await fetch(`${API_BASE}/seller`, {
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo obtener la lista de vendedores");
  }
  const data = await res.json();
  return data.content || data;
}
