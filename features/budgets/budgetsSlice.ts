
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Budget, LoadingStatus } from '../../types';
import { api } from '../../services/api';
import { RootState } from '../../store/store';

interface BudgetsState {
  items: Budget[];
  status: LoadingStatus;
  error: string | null;
}

const initialState: BudgetsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) return [];
    const response = await api.budgets.list(orgId);
    return response;
  }
);

export const addBudget = createAsyncThunk(
  'budgets/addBudget',
  async (budget: Omit<Budget, 'id' | 'orgId'>, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) throw new Error("No active org");
    const response = await api.budgets.create(orgId, budget);
    return response;
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ id, updates }: { id: number; updates: Partial<Budget> }, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) throw new Error("No active org");
    const response = await api.budgets.update(orgId, id, updates);
    return response;
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id: number, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) throw new Error("No active org");
    await api.budgets.delete(orgId, id);
    return id;
  }
);

export const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch budgets';
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.items.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter(b => b.id !== action.payload);
      });
  },
});

export default budgetsSlice.reducer;
