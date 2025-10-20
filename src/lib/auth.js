export function getUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export async function authFetch(url, options = {}) {
  const headers = authHeaders(options.headers || {});
  const res = await fetch(url, { ...options, headers });
  return res;
}

export function authHeaders(extra = {}) {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, ...extra }
    : { ...extra };
}

export function getToken() {
  return localStorage.getItem("jwt");
}

export function formatRole(role) {
  if (!role) return "";
  const map = {
    BUYER: "Cliente",
    ROLE_SELLER: "Vendedor",
    ROLE_ADMIN: "Administrador",
  };
  return map[role] || role.replace("ROLE_", "");
}