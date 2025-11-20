
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface AuthState {
  isAuthenticated: boolean;
  userToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userToken: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (email: string) => {
        const response = await api.auth.login(email);
        return response.token;
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        await api.auth.logout();
        return;
    }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(login.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.isAuthenticated = true;
            state.userToken = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Login failed';
        })
        .addCase(logout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.userToken = null;
            state.status = 'idle';
        });
  }
});

export default authSlice.reducer;
