// src/store/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyOrders, checkoutMe } from "../api/order";
import { clearCart } from "./cartSlice";

// LISTAR ÓRDENES DEL USUARIO
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    console.log("[ordersSlice] Thunk fetchMyOrders ejecutado", { page, size });
    try {
      return await getMyOrders(page, size);
    } catch (err) {
      return rejectWithValue(err.message || "No se pudieron obtener tus órdenes");
    }
  }
);

// CHECKOUT: CREAR ORDEN DESDE EL CARRITO
export const checkoutFromCart = createAsyncThunk(
  "orders/checkoutFromCart",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const order = await checkoutMe();
      dispatch(clearCart());
      return {
        ...order,
        status: order?.status || "PAID",
      };
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo procesar el checkout");
    }
  }
);

const initialState = {
  page: null,
  status: "idle",
  error: null,
  checkoutStatus: "idle",
  checkoutError: null,
  lastCreatedOrder: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrders: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.page = action.payload;
        state.error = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(checkoutFromCart.pending, (state) => {
        state.checkoutStatus = "loading";
        state.checkoutError = null;
      })
      .addCase(checkoutFromCart.fulfilled, (state, action) => {
        state.checkoutStatus = "succeeded";
        state.checkoutError = null;
        const newOrder = action.payload;
        state.lastCreatedOrder = newOrder;
        // Forzar refresco completo al abrir órdenes
        state.page = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(checkoutFromCart.rejected, (state, action) => {
        state.checkoutStatus = "failed";
        state.checkoutError = action.payload;
      });
  },
});

export const { resetOrders } = ordersSlice.actions;

export const selectOrdersPage = (state) => state.orders.page;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;

export const selectLastCreatedOrder = (state) => state.orders.lastCreatedOrder;
export const selectCheckoutStatus = (state) => state.orders.checkoutStatus;
export const selectCheckoutError = (state) => state.orders.checkoutError;

export default ordersSlice.reducer;
