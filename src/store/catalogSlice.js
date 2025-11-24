// src/store/catalogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllBrands,
  getAllDeviceModels,
  getAllVariants,
  createBrand,
  createDeviceModel,
  createVariant,
  deleteBrand,
  deleteDeviceModel,
  deleteVariant,
  updateBrand,
  updateDeviceModel,
  updateVariant,
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

export const createBrandThunk = createAsyncThunk(
  "catalog/createBrand",
  async (data, { rejectWithValue }) => {
    try {
      return await createBrand(data);
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo crear la marca");
    }
  }
);

export const updateBrandThunk = createAsyncThunk(
  "catalog/updateBrand",
  async ({ brandId, data }, { rejectWithValue }) => {
    try {
      return await updateBrand(brandId, data);
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo actualizar la marca");
    }
  }
);

export const updateDeviceModelThunk = createAsyncThunk(
  "catalog/updateDeviceModel",
  async ({ modelId, data }, { rejectWithValue }) => {
    try {
      return await updateDeviceModel(modelId, data);
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo actualizar el modelo");
    }
  }
);

export const updateVariantThunk = createAsyncThunk(
  "catalog/updateVariant",
  async ({ variantId, data }, { rejectWithValue }) => {
    try {
      return await updateVariant(variantId, data);
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo actualizar la variante");
    }
  }
);

export const deleteBrandThunk = createAsyncThunk(
  "catalog/deleteBrand",
  async (brandId, { rejectWithValue }) => {
    try {
      await deleteBrand(brandId);
      return brandId;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo eliminar la marca");
    }
  }
);

export const deleteDeviceModelThunk = createAsyncThunk(
  "catalog/deleteDeviceModel",
  async (modelId, { rejectWithValue }) => {
    try {
      await deleteDeviceModel(modelId);
      return modelId;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo eliminar el modelo");
    }
  }
);

export const deleteVariantThunk = createAsyncThunk(
  "catalog/deleteVariant",
  async (variantId, { rejectWithValue }) => {
    try {
      await deleteVariant(variantId);
      return variantId;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo eliminar la variante");
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
      // Propagar nuevo nombre de modelo a las variantes que lo referencian
      if (normalized.modelName) {
        state.variants = state.variants.map((variant) =>
          String(variant.deviceModelId) === String(normalized.id)
            ? {
                ...variant,
                deviceModelName:
                  normalized.modelName ?? variant.deviceModelName,
              }
            : variant
        );
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
      })
      .addCase(createBrandThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createBrandThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        if (action.payload) {
          catalogSlice.caseReducers.upsertBrand(state, action);
        }
      })
      .addCase(createBrandThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(updateBrandThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateBrandThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        if (action.payload) {
          catalogSlice.caseReducers.upsertBrand(state, action);
        }
      })
      .addCase(updateBrandThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(updateDeviceModelThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateDeviceModelThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        if (action.payload) {
          catalogSlice.caseReducers.upsertDeviceModel(state, action);
        }
      })
      .addCase(updateDeviceModelThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(updateVariantThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateVariantThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        if (action.payload) {
          catalogSlice.caseReducers.upsertVariant(state, action);
        }
      })
      .addCase(updateVariantThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(deleteBrandThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteBrandThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        catalogSlice.caseReducers.removeBrandCascade(state, action);
      })
      .addCase(deleteBrandThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(deleteDeviceModelThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteDeviceModelThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        catalogSlice.caseReducers.removeDeviceModelCascade(state, action);
      })
      .addCase(deleteDeviceModelThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(deleteVariantThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteVariantThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        catalogSlice.caseReducers.removeVariantEntry(state, action);
      })
      .addCase(deleteVariantThunk.rejected, (state, action) => {
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
