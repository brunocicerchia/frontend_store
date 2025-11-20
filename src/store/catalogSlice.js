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
  reducers: {
    upsertBrand: (state, action) => {
      const brand = action.payload;
      if (!brand?.id) return;
      const idx = state.brands.findIndex(
        (b) => String(b.id) === String(brand.id)
      );
      if (idx >= 0) {
        state.brands[idx] = { ...state.brands[idx], ...brand };
      } else {
        state.brands = [brand, ...state.brands];
      }
      state.deviceModels = state.deviceModels.map((model) => {
        if (String(model.brandId) === String(brand.id)) {
          return {
            ...model,
            brandName: brand.name ?? model.brandName,
            brand,
          };
        }
        return model;
      });
    },
    upsertDeviceModel: (state, action) => {
      const model = action.payload;
      if (!model?.id) return;
      const brandMap = new Map(
        state.brands.map((brand) => [String(brand.id), brand])
      );
      const normalized = normalizeModel(model, brandMap);
      const idx = state.deviceModels.findIndex(
        (m) => String(m.id) === String(model.id)
      );
      if (idx >= 0) {
        state.deviceModels[idx] = {
          ...state.deviceModels[idx],
          ...normalized,
        };
      } else {
        state.deviceModels = [normalized, ...state.deviceModels];
      }
    },
    upsertVariant: (state, action) => {
      const variant = action.payload;
      if (!variant?.id) return;
      const idx = state.variants.findIndex(
        (v) => String(v.id) === String(variant.id)
      );
      if (idx >= 0) {
        state.variants[idx] = { ...state.variants[idx], ...variant };
      } else {
        state.variants = [variant, ...state.variants];
      }
    },
    removeBrandCascade: (state, action) => {
      const brandId = String(action.payload);
      const modelIds = state.deviceModels
        .filter((model) => String(model.brandId) === brandId)
        .map((model) => String(model.id));
      const modelIdSet = new Set(modelIds);
      state.brands = state.brands.filter(
        (brand) => String(brand.id) !== brandId
      );
      state.deviceModels = state.deviceModels.filter(
        (model) => String(model.brandId) !== brandId
      );
      state.variants = state.variants.filter(
        (variant) => !modelIdSet.has(String(variant.deviceModelId))
      );
    },
    removeDeviceModelCascade: (state, action) => {
      const modelId = String(action.payload);
      state.deviceModels = state.deviceModels.filter(
        (model) => String(model.id) !== modelId
      );
      state.variants = state.variants.filter(
        (variant) => String(variant.deviceModelId) !== modelId
      );
    },
    removeVariantEntry: (state, action) => {
      const variantId = String(action.payload);
      state.variants = state.variants.filter(
        (variant) => String(variant.id) !== variantId
      );
    },
  },
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

export const {
  upsertBrand,
  upsertDeviceModel,
  upsertVariant,
  removeBrandCascade,
  removeDeviceModelCascade,
  removeVariantEntry,
} = catalogSlice.actions;

export const selectCatalogStatus = (state) => state.catalog?.status;
export const selectCatalogError = (state) => state.catalog?.error;
export const selectCatalogMutationStatus = (state) =>
  state.catalog?.mutationStatus;
export const selectCatalogMutationError = (state) =>
  state.catalog?.mutationError;
export const selectBrands = (state) => state.catalog?.brands || [];
export const selectDeviceModels = (state) => state.catalog?.deviceModels || [];
export const selectVariants = (state) => state.catalog?.variants || [];

export default catalogSlice.reducer;
