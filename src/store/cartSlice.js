// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../lib/auth";

// 👇 IMPORTS CORRECTOS SEGÚN TU src/api/cart.js
import {
  getMyCart,
  addItemMe,
  updateQtyMe,
  removeItemMe,
  clearMyCart,
} from "../api/cart";

// 🧠 Cargar carrito del usuario logueado
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const user = getUser();
      if (!user) {
        // si no hay user, consideramos carrito vacío
        return null;
      }
      const cart = await getMyCart();
      return cart; // { cartId, items:[...], total }
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo cargar el carrito");
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ listingId, quantity = 1 }, { rejectWithValue }) => {
    const cart = await addItemMe(listingId, quantity);
    return cart;
  }
);

// 🧠 Cambiar cantidad de un ítem (listingId en tu API)
export const changeItemQuantity = createAsyncThunk(
  "cart/changeItemQuantity",
  async ({ listingId, quantity }, { rejectWithValue }) => {
    try {
      const cart = await updateQtyMe(listingId, quantity);
      return cart;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo actualizar la cantidad");
    }
  }
);

// 🧠 Eliminar un ítem del carrito (listingId en tu API)
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ listingId }, { rejectWithValue }) => {
    try {
      const cart = await removeItemMe(listingId);
      return cart;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo eliminar el producto");
    }
  }
);

// 🧠 Vaciar carrito
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const cart = await clearMyCart(); // devuelve carrito vacío / nuevo
      return cart;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo vaciar el carrito");
    }
  }
);

const initialState = {
  cart: null,      // { cartId, items, total }
  status: "idle",  // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // helper para no repetir tanto
    const pendingReducer = (state) => {
      state.status = "loading";
      state.error = null;
    };
    const fulfilledReducer = (state, action) => {
      state.status = "succeeded";
      state.cart = action.payload;
      state.error = null;
    };
    const rejectedReducer = (state, action, defaultMsg) => {
      state.status = "failed";
      state.error = action.payload || defaultMsg;
    };

    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        pendingReducer(state);
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        fulfilledReducer(state, action);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        rejectedReducer(state, action, "Error al cargar el carrito");
      })

      // addItemToCart
      .addCase(addItemToCart.pending, (state) => {
        pendingReducer(state);
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        fulfilledReducer(state, action);
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        rejectedReducer(state, action, "Error al agregar al carrito");
      })

      // changeItemQuantity
      .addCase(changeItemQuantity.pending, (state) => {
        pendingReducer(state);
      })
      .addCase(changeItemQuantity.fulfilled, (state, action) => {
        fulfilledReducer(state, action);
      })
      .addCase(changeItemQuantity.rejected, (state, action) => {
        rejectedReducer(state, action, "Error al actualizar el carrito");
      })

      // removeItemFromCart
      .addCase(removeItemFromCart.pending, (state) => {
        pendingReducer(state);
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        fulfilledReducer(state, action);
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        rejectedReducer(state, action, "Error al eliminar del carrito");
      })

      // clearCart
      .addCase(clearCart.pending, (state) => {
        pendingReducer(state);
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        fulfilledReducer(state, action);
      })
      .addCase(clearCart.rejected, (state, action) => {
        rejectedReducer(state, action, "Error al vaciar el carrito");
      });
  },
});

export const { resetCart } = cartSlice.actions;

// 🔍 Selectores
export const selectCartState = (state) => state.cart;
export const selectCart = (state) => state.cart.cart;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;

// Contador de ítems (asumiendo cart.items = [{ quantity, ... }])
export const selectCartItemCount = (state) => {
  const cart = state.cart.cart;
  if (!cart || !Array.isArray(cart.items)) return 0;
  return cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

export default cartSlice.reducer;

