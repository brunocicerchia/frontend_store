// src/api/user.js
import { authHeaders } from "../lib/auth";

export async function getMe() {
  const res = await fetch("http://localhost:8080/api/v1/users/me", {
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo obtener el usuario");
  }
  return res.json();
}