// src/store/productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getListings,
  createListing,
  updateListing,
  deleteListing,
} from "../api/products";

export const fetchListings = createAsyncThunk(
  "products/fetchListings",
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      const listings = await getListings(page, size);
      return listings;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudieron cargar los productos");
    }
  }
);

export const createListingThunk = createAsyncThunk(
  "products/createListing",
  async (data, { rejectWithValue }) => {
    try {
      return await createListing(data);
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
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = "failed";
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
      });
  },
});

export const { resetProducts } = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductsMutationStatus = (state) =>
  state.products.mutationStatus;
export const selectProductsMutationError = (state) =>
  state.products.mutationError;

export default productsSlice.reducer;
