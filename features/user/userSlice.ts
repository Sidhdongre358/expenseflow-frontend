
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserProfile, LoadingStatus } from '../../types';
import { api } from '../../services/api';

interface UserState {
  profile: UserProfile | null;
  status: LoadingStatus;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  status: 'idle',
  error: null,
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => {
    const response = await api.user.get();
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (updates: Partial<UserProfile>) => {
    const response = await api.user.update(updates);
    return response;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      });
  },
});

export default userSlice.reducer;
