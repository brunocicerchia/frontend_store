// src/api/products.js
import { authHeaders } from "../lib/auth";

const API_BASE_URL = "http://localhost:8080";

async function getListingsRaw(page = 0, size = 20) {
  const res = await fetch(`${API_BASE_URL}/listings?page=${page}&size=${size}`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al cargar los productos");
  }
  
  return res.json();
}

export async function getVariant(variantId) {
  const res = await fetch(`${API_BASE_URL}/variants/${variantId}`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || `Error al cargar variante ${variantId}`);
  }
  
  return res.json();
}

export async function getSeller(sellerId) {
  const res = await fetch(`${API_BASE_URL}/seller/${sellerId}`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || `Error al cargar vendedor ${sellerId}`);
  }
  
  return res.json();
}

export async function getDeviceModel(modelId) {
  const res = await fetch(`${API_BASE_URL}/device-models/${modelId}`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || `Error al cargar modelo ${modelId}`);
  }
  
  return res.json();
}

export async function getBrand(brandId) {
  const res = await fetch(`${API_BASE_URL}/brands/${brandId}`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || `Error al cargar marca ${brandId}`);
  }
  
  return res.json();
}

export async function getListing(listingId) {
  const res = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || `Error al cargar producto ${listingId}`);
  }
  
  return res.json();
}

export async function getEnrichedListing(listingId) {
  try {
    const listing = await getListing(listingId);
    
    const variant = await getVariant(listing.variantId).catch(() => null);
    const seller = await getSeller(listing.sellerId).catch(() => null);

    let brand = null;
    if (variant && variant.deviceModelId) {
      const model = await getDeviceModel(variant.deviceModelId).catch(() => null);
      
      if (model && model.brandId) {
        brand = await getBrand(model.brandId).catch(() => null);
      }
      
      if (model) {
        variant.model = model;
      }
    }

    return {
      ...listing,
      variant,
      seller,
      brand,
    };
  } catch (error) {
    console.error(`Error fetching listing ${listingId}:`, error);
    throw error;
  }
}

export async function getListings(page = 0, size = 20) {
  try {
    const data = await getListingsRaw(page, size);
    const listingsData = data.content;

    const enrichedListings = await Promise.all(
      listingsData.map(async (listing) => {
        try {
          const variant = await getVariant(listing.variantId).catch(() => null);
          const seller = await getSeller(listing.sellerId).catch(() => null);

          let brand = null;
          if (variant && variant.deviceModelId) {
            const model = await getDeviceModel(variant.deviceModelId).catch(() => null);
            
            if (model && model.brandId) {
              brand = await getBrand(model.brandId).catch(() => null);
            }
            
            if (model) {
              variant.model = model;
            }
          }

          return {
            ...listing,
            variant,
            seller,
            brand,
          };
        } catch (error) {
          console.error(`Error fetching details for listing ${listing.id}:`, error);
          return listing;
        }
      })
    );

    return enrichedListings;
  } catch (error) {
    console.error('Error fetching enriched listings:', error);
    throw error;
  }
}

export async function createListing(data) {
  const res = await fetch(`${API_BASE_URL}/listings`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al crear listing");
  }
  
  return res.json();
}

export async function updateListing(listingId, data) {
  const res = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al actualizar listing");
  }
  
  return res.json();
}

export async function deleteListing(listingId, sellerId) {
  const res = await fetch(`${API_BASE_URL}/listings/${listingId}?sellerId=${sellerId}`, {
    method: "DELETE",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al eliminar listing");
  }
}

export async function getAllBrands() {
  const res = await fetch(`${API_BASE_URL}/brands`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al cargar marcas");
  }
  
  const data = await res.json();
  return data.content || data;
}

export async function getAllDeviceModels() {
  const res = await fetch(`${API_BASE_URL}/device-models`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al cargar modelos");
  }
  
  const data = await res.json();
  return data.content || data;
}

export async function getAllVariants() {
  const res = await fetch(`${API_BASE_URL}/variants`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al cargar variantes");
  }
  
  const data = await res.json();
  return data.content || data;
}

export async function getAllSellers() {
  const res = await fetch(`${API_BASE_URL}/seller`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al cargar vendedores");
  }
  
  const data = await res.json();
  return data.content || data;
}

export async function createVariant(data) {
  const res = await fetch(`${API_BASE_URL}/variants`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al crear variante");
  }
  
  return res.json();
}

export async function createDeviceModel(data) {
  const res = await fetch(`${API_BASE_URL}/device-models`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => null);
    throw new Error(msg || "Error al crear modelo de dispositivo");
  }
  
  return res.json();
}
