// src/store/catalogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBrands,
  getAllDeviceModels,
  getAllVariants,
  createDeviceModel,
  createVariant,
} from "../api/products";

const normalizeModel = (model, brandMap) => ({
  ...model,
  brandName:
    model?.brandName ??
    model?.brand?.name ??
    brandMap.get(String(model?.brandId))?.name ??
    "",
});

export const fetchCatalogs = createAsyncThunk(
  "catalog/fetchCatalogs",
  async (_args = {}, { rejectWithValue }) => {
    try {
      const [brands, deviceModels, variants] = await Promise.all([
        getAllBrands(),
        getAllDeviceModels(),
        getAllVariants(),
      ]);
      return { brands, deviceModels, variants };
    } catch (err) {
      return rejectWithValue(err.message || "No se pudieron cargar los catalogos");
    }
  },
  {
    condition: ({ force = false } = {}, { getState }) => {
      if (force) return true;
      const state = getState();
      const status = state?.catalog?.status;
      if (status === "loading") return false;
      if (status === "succeeded") return false;
      return true;
    },
  }
);

export const createDeviceModelThunk = createAsyncThunk(
  "catalog/createDeviceModel",
  async (data, { rejectWithValue }) => {
    try {
      return await createDeviceModel(data);
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo crear el modelo");
    }
  }
);

export const createVariantThunk = createAsyncThunk(
  "catalog/createVariant",
  async (data, { rejectWithValue }) => {
    try {
      return await createVariant(data);
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo crear la variante");
    }
  }
);

const initialState = {
  brands: [],
  deviceModels: [],
  variants: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  mutationStatus: "idle",
  mutationError: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCatalogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const { brands = [], deviceModels = [], variants = [] } = action.payload || {};
        const brandMap = new Map(brands.map((brand) => [String(brand.id), brand]));
        state.brands = brands;
        state.deviceModels = deviceModels.map((model) => normalizeModel(model, brandMap));
        state.variants = variants;
      })
      .addCase(fetchCatalogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createDeviceModelThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createDeviceModelThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const brandMap = new Map(state.brands.map((brand) => [String(brand.id), brand]));
        if (action.payload) {
          state.deviceModels = [
            normalizeModel(action.payload, brandMap),
            ...state.deviceModels,
          ];
        }
      })
      .addCase(createDeviceModelThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(createVariantThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createVariantThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        if (action.payload) {
          state.variants = [action.payload, ...state.variants];
        }
      })
      .addCase(createVariantThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      });
  },
});

export const selectCatalogStatus = (state) => state.catalog?.status;
export const selectCatalogError = (state) => state.catalog?.error;
export const selectCatalogMutationStatus = (state) => state.catalog?.mutationStatus;
export const selectCatalogMutationError = (state) => state.catalog?.mutationError;
export const selectBrands = (state) => state.catalog?.brands || [];
export const selectDeviceModels = (state) => state.catalog?.deviceModels || [];
export const selectVariants = (state) => state.catalog?.variants || [];

export default catalogSlice.reducer;
