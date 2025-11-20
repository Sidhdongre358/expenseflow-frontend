
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrencyCode } from '../../types';

interface UiState {
  isDark: boolean;
  isSidebarOpen: boolean;
  currency: CurrencyCode;
}

const initialState: UiState = {
  isDark: true,
  isSidebarOpen: false,
  currency: 'USD',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      if (state.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
      if (state.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setCurrency: (state, action: PayloadAction<CurrencyCode>) => {
      state.currency = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen, setCurrency } = uiSlice.actions;
export default uiSlice.reducer;
