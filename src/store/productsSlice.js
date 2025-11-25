// src/store/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getListings,
  getEnrichedListing,
  createListing,
  updateListing,
  deleteListing,
} from "../api/products";
import { checkoutFromCart } from "./ordersSlice";
import {
  updateBrandThunk as catalogUpdateBrandThunk,
  updateDeviceModelThunk as catalogUpdateDeviceModelThunk,
  updateVariantThunk as catalogUpdateVariantThunk,
} from "./catalogSlice";

export const fetchListings = createAsyncThunk(
  "products/fetchListings",
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      const listings = await getListings(page, size);
      return listings;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudieron cargar los productos");
    }
  },
  {
    condition: (args = {}, { getState }) => {
      const { force = false, page = 0, size = 20 } = args || {};
      if (force) return true;
      const state = getState();
      const productsState = state?.products;
      if (!productsState) return true;
      const pendingQuery = productsState.currentQuery;
      const isSamePending =
        productsState.status === "loading" &&
        pendingQuery &&
        pendingQuery.page === page &&
        pendingQuery.size === size;
      if (isSamePending) return false;
      const lastQuery = productsState.lastQuery;
      const alreadyLoadedSameQuery =
        productsState.status === "succeeded" &&
        lastQuery &&
        lastQuery.page === page &&
        lastQuery.size === size;
      return !alreadyLoadedSameQuery;
    },
  }
);

export const createListingThunk = createAsyncThunk(
  "products/createListing",
  async (data, { rejectWithValue }) => {
    try {
      const created = await createListing(data);
      if (!created?.id) return created;
      const enriched = await getEnrichedListing(created.id).catch(() => null);
      return enriched || created;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo crear el producto");
    }
  }
);

export const updateListingThunk = createAsyncThunk(
  "products/updateListing",
  async ({ listingId, data }, { rejectWithValue }) => {
    try {
      return await updateListing(listingId, data);
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo actualizar el producto");
    }
  }
);

export const deleteListingThunk = createAsyncThunk(
  "products/deleteListing",
  async ({ listingId, sellerId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const current = state.products.items.find((item) => String(item.id) === String(listingId));
      const sellerToSend = sellerId ?? current?.sellerId ?? current?.seller?.id;
      await deleteListing(listingId, sellerToSend);
      return listingId;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo eliminar el producto");
    }
  }
);

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  mutationStatus: "idle",
  mutationError: null,
  lastQuery: null,
  currentQuery: null,
  sellerViewHydrated: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        const { page = 0, size = 20 } = action.meta.arg || {};
        state.currentQuery = { page, size };
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentQuery = null;
        state.items = action.payload || [];
        state.error = null;
        const { page = 0, size = 20 } = action.meta.arg || {};
        state.lastQuery = { page, size };
        state.sellerViewHydrated = page === 0 && size >= 100;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = "failed";
        state.currentQuery = null;
        state.error = action.payload;
      })
      .addCase(createListingThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createListingThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }
      })
      .addCase(createListingThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(updateListingThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateListingThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const updated = action.payload;
        if (!updated) return;
        state.items = state.items.map((item) => {
          if (item.id !== updated.id) return item;
          return {
            ...item,
            ...updated,
            title: updated.title ?? item.title,
            productTitle: updated.productTitle ?? item.productTitle,
            seller: updated.seller ?? item.seller,
            sellerId: updated.sellerId ?? item.sellerId,
            variant: updated.variant ?? item.variant,
            variantId: updated.variantId ?? item.variantId,
          };
        });
      })
      .addCase(updateListingThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(deleteListingThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteListingThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const id = action.payload;
        state.items = state.items.filter((item) => item.id !== id);
      })
      .addCase(deleteListingThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(checkoutFromCart.fulfilled, (state, action) => {
        const items = action.payload?.items;
        if (!Array.isArray(items)) return;
        const deltaMap = new Map();
        items.forEach((item) => {
          const id = item.listingId ?? item.id;
          const qty = Number(item.quantity ?? 0);
          if (!id || !qty) return;
          deltaMap.set(String(id), (deltaMap.get(String(id)) || 0) + qty);
        });
        if (deltaMap.size === 0) return;
        state.items = state.items.map((listing) => {
          const delta = deltaMap.get(String(listing.id));
          if (!delta) return listing;
          const currentStock = Number(listing.stock ?? 0);
          return {
            ...listing,
            stock: Math.max(0, currentStock - delta),
          };
        });
      })
      .addCase(catalogUpdateBrandThunk.fulfilled, (state, action) => {
        const brand = action.payload;
        if (!brand?.id) return;
        state.items = state.items.map((item) => {
          let next = item;
          if (item.brand && String(item.brand.id) === String(brand.id)) {
            next = {
              ...next,
              brand: {
                ...item.brand,
                ...brand,
              },
            };
          }
          if (item.variant?.model && String(item.variant.model.brandId) === String(brand.id)) {
            next = {
              ...next,
              variant: {
                ...item.variant,
                model: {
                  ...item.variant.model,
                  brandName: brand.name ?? item.variant.model.brandName,
                  brand,
                },
              },
            };
          }
          return next;
        });
      })
      .addCase(catalogUpdateDeviceModelThunk.fulfilled, (state, action) => {
        const model = action.payload;
        if (!model?.id) return;
        state.items = state.items.map((item) => {
          if (item.variant?.model && String(item.variant.model.id) === String(model.id)) {
            return {
              ...item,
              variant: {
                ...item.variant,
                model: {
                  ...item.variant.model,
                  ...model,
                },
              },
            };
          }
          return item;
        });
      })
      .addCase(catalogUpdateVariantThunk.fulfilled, (state, action) => {
        const variant = action.payload;
        if (!variant?.id) return;
        state.items = state.items.map((item) => {
          if (String(item.variantId) === String(variant.id)) {
            return {
              ...item,
              variant: {
                ...item.variant,
                ...variant,
                model: variant.model
                  ? {
                      ...item.variant?.model,
                      ...variant.model,
                    }
                  : item.variant?.model,
              },
            };
          }
          return item;
        });
      });
  },
});

export const {
  resetProducts,
} = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductsMutationStatus = (state) => state.products.mutationStatus;
export const selectProductsMutationError = (state) => state.products.mutationError;
export const selectProductsLastQuery = (state) => state.products.lastQuery;
export const selectHasSellerListingsCache = (state) => state.products.sellerViewHydrated;

export default productsSlice.reducer;
