// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import ordersReducer from "./ordersSlice";
import productsReducer from "./productsSlice";
import catalogReducer from "./catalogSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    products: productsReducer,
    catalog: catalogReducer,
    users: usersReducer,
  },
});
