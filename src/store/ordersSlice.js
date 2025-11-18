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

      // Limpiar carrito en Redux
      dispatch(clearCart());

      return order;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo procesar el checkout");
    }
  }
);

const initialState = {
  page: null,               // Page<OrderResponse>
  status: "idle",           // para listado
  error: null,

  checkoutStatus: "idle",   // 'idle' | 'loading' | 'succeeded' | 'failed'
  checkoutError: null,
  lastCreatedOrder: null,   // OrderResponse de la última orden
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrders: () => initialState,
  },
  extraReducers: (builder) => {
    // LISTAR ÓRDENES
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

    // CHECKOUT
    builder
      .addCase(checkoutFromCart.pending, (state) => {
        state.checkoutStatus = "loading";
        state.checkoutError = null;
      })
      .addCase(checkoutFromCart.fulfilled, (state, action) => {
        state.checkoutStatus = "succeeded";
        state.lastCreatedOrder = action.payload;
      })
      .addCase(checkoutFromCart.rejected, (state, action) => {
        state.checkoutStatus = "failed";
        state.checkoutError = action.payload;
      });
  },
});

export const { resetOrders } = ordersSlice.actions;

// SELECTORES
export const selectOrdersPage = (state) => state.orders.page;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;

export const selectLastCreatedOrder = (state) => state.orders.lastCreatedOrder;
export const selectCheckoutStatus = (state) => state.orders.checkoutStatus;
export const selectCheckoutError = (state) => state.orders.checkoutError;

export default ordersSlice.reducer;
