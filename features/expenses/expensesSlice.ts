
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Expense, LoadingStatus } from '../../types';
import { api } from '../../services/api';
import { RootState } from '../../store/store';

interface ExpensesState {
  items: Expense[];
  status: LoadingStatus;
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) return []; 
    const response = await api.expenses.list(orgId);
    return response;
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expense: Omit<Expense, 'id' | 'orgId' | 'userId'>, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) throw new Error("No active org");
    const response = await api.expenses.create(orgId, expense);
    return response;
  }
);

export const updateExpense = createAsyncThunk(
    'expenses/updateExpense',
    async ({ id, updates }: { id: string; updates: Partial<Expense> }, { getState }) => {
      const state = getState() as RootState;
      const orgId = state.orgs.activeOrgId;
      if (!orgId) throw new Error("No active org");
      const response = await api.expenses.update(orgId, id, updates);
      return response;
    }
  );

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: string, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) throw new Error("No active org");
    await api.expenses.delete(orgId, id);
    return id;
  }
);

export const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
            state.items[index] = action.payload;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;
