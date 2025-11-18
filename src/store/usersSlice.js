// src/store/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUsersNoPagination,
  deleteUser,
  updateUserRole,
} from "../api/user";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllUsersNoPagination();
      return Array.isArray(data) ? data : data?.content || [];
    } catch (err) {
      return rejectWithValue(err.message || "No se pudieron cargar los usuarios");
    }
  }
);

export const removeUserThunk = createAsyncThunk(
  "users/removeUser",
  async (userId, { rejectWithValue }) => {
    try {
      const numericId = Number(userId);
      await deleteUser(numericId);
      return numericId;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo eliminar el usuario");
    }
  }
);

export const updateUserRoleThunk = createAsyncThunk(
  "users/updateRole",
  async ({ userId, newRole }, { rejectWithValue }) => {
    try {
      const updated = await updateUserRole(userId, newRole);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo actualizar el rol");
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  mutationStatus: "idle",
  mutationError: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeUserThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(removeUserThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const removedId = action.payload;
        state.items = state.items.filter(
          (u) => String(u.id) !== String(removedId)
        );
      })
      .addCase(removeUserThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      .addCase(updateUserRoleThunk.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateUserRoleThunk.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const updated = action.payload;
        if (!updated) return;
        state.items = state.items.map((user) =>
          user.id === updated.id ? updated : user
        );
      })
      .addCase(updateUserRoleThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      });
  },
});

export const selectUsers = (state) => state.users.items;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;
