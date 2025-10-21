// src/api/user.js
import { authHeaders, authFetch } from "../lib/auth";

const BASE = "http://localhost:8080/api/v1/users";

// ========== Obtener Usuario(s) ==========

export async function getMe() {
  const res = await fetch(`${BASE}/me`, {
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo obtener el usuario");
  }
  return res.json();
}

export async function getUserById(userId) {
  const res = await authFetch(`${BASE}/${userId}`);
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo obtener el usuario");
  }
  return res.json();
}

export async function getAllUsers(page = 0, size = 20) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());
  
  const res = await authFetch(`${BASE}?${params.toString()}`);
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudieron obtener los usuarios");
  }
  return res.json();
}

export async function getAllUsersNoPagination() {
  const res = await authFetch(`${BASE}?size=1000`); // Obtener hasta 1000 usuarios
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudieron obtener los usuarios");
  }
  const data = await res.json();
  // Si viene paginado, retornar solo el contenido
  return data.content || data;
}

// ========== Actualizar Usuario ==========

export async function updateMyProfile(userData) {
  const res = await authFetch(`${BASE}/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo actualizar el perfil");
  }
  return res.json();
}

export async function updateUserById(userId, userData) {
  const res = await authFetch(`${BASE}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo actualizar el usuario");
  }
  return res.json();
}

export async function updateUserRole(userId, newRole) {
  // Usar el endpoint PUT /api/v1/users/{id} con solo el campo role
  const res = await authFetch(`${BASE}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo actualizar el rol del usuario");
  }
  return res.json();
}

// ========== Eliminar Usuario ==========
export async function deleteUser(userId) {
  const res = await authFetch(`${BASE}/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudo eliminar el usuario");
  }
  return true;
}