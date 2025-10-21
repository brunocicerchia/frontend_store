// src/api/images.js
import { authFetch } from "../lib/auth";

const BASE = "http://localhost:8080";

// Obtener imágenes de una variante
export async function getVariantImages(variantId) {
  const res = await authFetch(`${BASE}/variants/${variantId}/images`);
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "No se pudieron obtener las imágenes");
  }
  return res.json();
}

// Subir imagen
export async function uploadImage(variantId, file, asPrimary = false) {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("jwt");
  const res = await fetch(`${BASE}/variants/${variantId}/images?asPrimary=${asPrimary}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al subir la imagen");
  }
  return res.json();
}

// Eliminar imagen
export async function deleteImage(variantId, imageId) {
  const res = await authFetch(`${BASE}/variants/${variantId}/images/${imageId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al eliminar la imagen");
  }
  return true;
}

// Establecer imagen como principal
export async function setPrimaryImage(variantId, imageId) {
  const res = await authFetch(`${BASE}/variants/${variantId}/images/${imageId}/primary`, {
    method: "PUT",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al establecer imagen principal");
  }
  return res.json();
}

// Obtener imagen como Blob (para mostrarla)
export async function getImageBlob(variantId, imageId) {
  const res = await authFetch(`${BASE}/variants/${variantId}/images/${imageId}/bytes`);
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al obtener la imagen");
  }
  
  return res.blob();
}
