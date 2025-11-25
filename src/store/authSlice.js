// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUser, getToken } from '../lib/auth';

const API_BASE = "http://localhost:8080/api/v1";
const API_LOGIN_URL = `${API_BASE}/auth/authenticate`;
const API_REGISTER_URL = `${API_BASE}/auth/register`;
const API_ME_URL = `${API_BASE}/users/me`;

// 1) Thunk: hace el fetch, maneja errores y devuelve { user, token }
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let msg = 'Error al iniciar sesión';
        try {
          const t = await res.text();
          if (t) msg = t;
        } catch {}
        if (res.status === 401) msg = 'Credenciales inválidas';
        return rejectWithValue(msg);
      }

      const data = await res.json();
      const token = data.access_token || data.token || data.jwt;
      if (!token) {
        return rejectWithValue('La API no devolvió access_token');
      }

      let me = null;
      try {
        const meRes = await fetch(API_ME_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          me = await meRes.json();
        }
      } catch {
      }

      return { user: me, token };
    } catch (err) {
      return rejectWithValue(err.message || 'No se pudo iniciar sesión');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ firstname, lastname, email, password, role }, { rejectWithValue }) => {
    try {
      const safeRole = role === 'ADMIN' ? 'BUYER' : role;
      const res = await fetch(API_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          role: safeRole,
        }),
      });

      if (!res.ok) {
        let msg = 'Error al registrarse';
        try {
          const t = await res.text();
          if (t) msg = t;
        } catch {}
        return rejectWithValue(msg);
      }

      const data = await res.json();
      const token = data.access_token || data.token || data.jwt;
      if (!token) {
        return rejectWithValue('La API no devolvió access_token');
      }

      let me = null;
      try {
        const meRes = await fetch(API_ME_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          me = await meRes.json();
        }
      } catch {}

      return { user: me, token };
    } catch (err) {
      return rejectWithValue(err.message || 'No se pudo completar el registro');
    }
  }
);

const initialState = {
  user: getUser(),
  token: getToken(),
  status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const { user, token } = action.payload || {};
        state.user = user || null;
        state.token = token || null;

        if (token) {
          localStorage.setItem('jwt', token);
        } else {
          localStorage.removeItem('jwt');
        }

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'No se pudo iniciar sesión';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const { user, token } = action.payload || {};
        state.user = user || null;
        state.token = token || null;

        if (token) {
          localStorage.setItem('jwt', token);
        } else {
          localStorage.removeItem('jwt');
        }

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'No se pudo completar el registro';
      });
  },
});

export const { logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectUserRole = (state) => {
  const user = state.auth.user;
  if (!user) return null;
  if (user.role) return user.role;
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles[0];
  }
  return null;
};
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
